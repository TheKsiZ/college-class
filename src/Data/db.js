import { db, storage } from './fbase';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, getDocs, deleteDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, sendPasswordResetEmail, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
var generator = require('generate-password');

//User Auth/Register -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const AuthorizateUser = async (auth, email, password) => (signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;     
        SetUserId(user.uid);     
    })
    .catch((error) => {   
        return error.code;             
    }));

export const CreateUser = async (auth, email, password) => (createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {        
        const user = userCredential.user;        
        localStorage.setItem('userId', user.uid);
    })
    .catch((error) => {  
        return error.code;                      
    })
);

export const AddUserToDatabase = async (firstName, lastName, email) => {
    try {        
        const auth = getAuth();
        const userID = auth.currentUser.uid;
        await setDoc(doc(db, "users", `${userID}`), {
            firstName: firstName,
            lastName: lastName,
            email: email,
            rooms: [],
        });    
        SetUserId(userID);    
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const UpdateUser = async (auth, email, firstName, lastName, password) => {      
    if(email !== ""){        
        let error;
        await updateEmail(auth.currentUser, email)
        .catch((e) => {
            error = e.code;
        });
        if(error) return error;
    }
    
    if(password !== ""){             
        await updatePassword(auth.currentUser, password).then()
        .catch((error) => {
            console.error(error);
        });
    }

    if(firstName !== ""){
        await updateDoc(doc(db, "users", GetUserId()),{
            firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),         
        });
    }

    if(lastName !== ""){
        await updateDoc(doc(db, "users", GetUserId()),{
            lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        });
    }        
    await SetUserToLocal();
}

export const ResetPassword = async (auth, email) => {
    await sendPasswordResetEmail(auth, email).then()
    .catch((error) => {
        return error.code;        
    });
}

export const CheckOldPassword = async (auth, password) => {
    const user = auth.currentUser;    
    const credential = EmailAuthProvider.credential(user.email, password)

    let flag = false;
    await reauthenticateWithCredential(user, credential).then()
    .catch((e) => {             
        flag = true;       
    });
        
    return flag;
}

export const GetUserById = async (id) => {
    const docSnap = await getDoc(doc(db, "users", id));    
    return  docSnap.data();
}

//User localstorage -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const SetUserId = (userId) => {
    localStorage.setItem('userId', userId);
}
export const GetUserId = () => {    
    return localStorage.getItem('userId');
}
export const RemoveUserId = () => {
    localStorage.removeItem('userId');
}

export const IsUserAuthorized = () => {
    if(!GetUserId()){        
        window.location.href = "/login";    
    }    
}

//Get user from db and set to localstorage -----------------------------------------------------------------------------------------------------------------------------------------
export const SetUserToLocal = async () => {
    const docSnap = await getDoc(doc(db, "users", GetUserId()));    
    const user = JSON.stringify(docSnap.data());
    localStorage.setItem('user', user);   
    return JSON.parse(user); 
}
export const GetUser = () => {
    return JSON.parse(localStorage.getItem('user'));
}
export const RemoveUser = () => {
    localStorage.removeItem('user');
}

export const SignOut = () => {    
    RemoveUserId();
    RemoveUser();
    RemoveRoomCode();
    RemoveIsUserOwner();
    RemoveIsUserTeacher();
    RemoveTestCode();    
}

//Rooms -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const CreateRoom = async (title, description) => {
    try {                        
        const code = generator.generate({
            length: 8,
            numbers: true
        });
        const userRef = doc(db, 'users', GetUserId());        
        const roomRef = doc(db, 'rooms', code);

        await setDoc(roomRef, {
            title: title,
            description: description,
            lessons: [],
            owner: userRef,            
            users: [],
        });            

        await updateDoc(roomRef, {
            teachers: arrayUnion(userRef),
        })

        SetRoomCode(code);        

        await updateDoc(userRef, {
            rooms: arrayUnion(roomRef),            
        })

        await SetUserToLocal();
        await IsUserTeacher();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const AddRoomToUser = async () => {
    const userRef = doc(db, "users", GetUserId());
    const roomRef = doc(db, "rooms", GetRoomCode());
    await updateDoc(userRef, {
        rooms: arrayUnion(roomRef),                    
    })
    await updateDoc(roomRef, {
        users: arrayUnion(userRef),        
    })
}

export const SwitchToTeachers = async (id) => {
    const userRef = doc(db, 'users', id);
    const roomRef = doc(db, "rooms", GetRoomCode());
    await updateDoc(roomRef, {
        users: arrayRemove(userRef),
        teachers: arrayUnion(userRef),
    })
}
export const SwitchToUsers = async (id) => { 
    const userRef = doc(db, 'users', id);
    const roomRef = doc(db, "rooms", GetRoomCode());
    await updateDoc(roomRef, {
        users: arrayUnion(userRef),
        teachers: arrayRemove(userRef),
    })
}
export const KickFromRoom = async (id) => {
    const userRef = doc(db, 'users', id);
    const roomRef = doc(db, "rooms", GetRoomCode());

    //Remove from users
    await updateDoc(roomRef, {
        users: arrayRemove(userRef),
        teachers: arrayRemove(userRef),
    })

    //Remove user from lessons
    const roomSnap = await getDoc(roomRef);
    await Promise.all(roomSnap.data().lessons.map(async (lesson, index) => {  
        const lesRef = doc(db, "lessons", lesson.id);
        const lesSnap = await getDoc(lesRef); 
        if(lesSnap.data().type !== "lesson"){
            await Promise.all(lesSnap.data().users.map(async (user, index) => {
                if(user.id === id){                                
                    const storageRef = ref(storage, `${lesson.id}/${id}/${lesSnap.data().users[index].fileName}`);
                    await deleteObject(storageRef).then().catch(error => console.error(error));
    
                    await updateDoc(lesRef,{
                        users: arrayRemove(user),
                    });
                }
            }))
        }        
    }));

    //Remove room from user
    await updateDoc(userRef, {
        rooms: arrayRemove(roomRef),
    })   
}
//Room code to localstorage -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const SetRoomCode = (code) => {
    localStorage.setItem('room', code);
}
export const GetRoomCode = () => {    
    return localStorage.getItem('room');
}
export const RemoveRoomCode = () => {
    localStorage.removeItem('room');
}


export const UpdateRoom = async (title, description) => {
    if(title !== ""){
        await updateDoc(doc(db, "rooms", GetRoomCode()),{
            title: title,            
        });
    }
    if(description !== ""){
        await updateDoc(doc(db, "rooms", GetRoomCode()),{
            description: description,
        });
    }
}
export const DeleteRoom = async () => {    
    const roomRef = doc(db, "rooms", GetRoomCode());
    const docSnap = await getDoc(roomRef);

    //Delete ref from teachers
    await Promise.all(docSnap.data().teachers.map(async (user) => {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
            rooms: arrayRemove(roomRef),
        });
    }));
    //Delete ref from users
    await Promise.all(docSnap.data().users.map(async (user) => {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
            rooms: arrayRemove(roomRef),
        });
    }));

    await Promise.all(docSnap.data().lessons.map(async (lesson) => {
        await DeleteLesson(lesson.id);          
    }));
    await deleteDoc(doc(db, "rooms", GetRoomCode()));
    RemoveRoomCode();
}

//Get Room from db -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const GetRoomByCode = async(code) => {
    const roomRef = doc(db, "rooms", code);    
    const docSnap = await getDoc(roomRef);
    return docSnap.data();
}

export const GetRoom = async (roomRef) => {    
    const docSnap = await getDoc(doc(db, "rooms", roomRef._key.path.segments[6]));             //REFACTOR            
    const data = {
        id: roomRef._key.path.segments[6],
        data: docSnap.data(),
    }
    return data;
}
export const GetUserByRef = async (userRef) => {
    const docSnap = await getDoc(doc(db, "users", userRef._key.path.segments[6]));             //REFACTOR
    const data = {
        id: userRef._key.path.segments[6],
        data: docSnap.data(),
    }
    return data; 
}

//Owner validation -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const SetIsUserOwner = (state) => {
    localStorage.setItem('isOwner', state);
}
export const GetIsUserOwner = () => {
    return localStorage.getItem('isOwner') === "true";
}
export const RemoveIsUserOwner = () => {
    localStorage.removeItem('isOwner');
}

//Teacher validation -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const IsUserTeacher = async () => {
    const roomRef = doc(db, 'rooms', GetRoomCode());
    const docSnap = await getDoc(roomRef);
    let flag = false;
    await Promise.all(docSnap.data().teachers.map((teacher) => {
        if(teacher.id === GetUserId()){
            flag = true;
        }
    }));
    
    localStorage.setItem('isTeacher', flag);    
}
export const GetIsUserTeacher = () => {
    return localStorage.getItem('isTeacher') === "true";
}
export const RemoveIsUserTeacher = () => {
    localStorage.removeItem('isTeacher');
}

export const ValidateRoomCode = async (code) => {
    const querySnapshot = await getDocs(collection(db, "rooms"));
    let result = false;
    querySnapshot.forEach((doc) => {        
        if(doc.id === code){            
            result = true;
            return;
        }
    })
    return result;
}

export const IsUserStillInRoom = async () => {    
    const roomRef = doc(db, 'rooms', GetRoomCode());
    const roomSnap = await getDoc(roomRef);
    
    let flag = false;
    roomSnap.data().teachers.forEach(async (teacher) => {
        if(teacher.id === GetUserId()){
            flag = true;
        }
    })
    
    roomSnap.data().users.forEach(async (user) => {
        if(user.id === GetUserId()){
            flag = true;
        }
    })
    
    if(!flag) RemoveRoomCode();
}

export const IsAlreadyJoinedRoom = async (code) => {
    const roomRef = doc(db, 'rooms', code);
    const docSnap = await getDoc(roomRef);
    let flag = false;
    docSnap.data().teachers.forEach(async (teacher) => {
        if(teacher.id === GetUserId()){
            flag = true;
        }
    });
    docSnap.data().users.forEach(async (user) => {
        if(user.id === GetUserId()){
            flag = true;
        }
    })
    return flag;
}

export const IsCodeActive = () => {
    if(!GetRoomCode()){
        window.location.href="/rooms";
    }    
}

//Lessons -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const CreateLesson = async (title, description, file) => {
    try {        
        const id = generator.generate({
            length: 16,
            numbers: true
        });

        const lessons = await GetSpecificTasks("lesson");

        const lesRef = doc(db, 'lessons', id);                
        await setDoc(lesRef, {
            index: lessons.length + 1,
            type: "lesson",   
            title: title,
            description: description,
            creationDate: Date.now(),                                        
        });                 
        
        const roomRef = doc(db, 'rooms', GetRoomCode());                
        await updateDoc(roomRef, {
            lessons: arrayUnion(lesRef),            
        })
        
        if(file === undefined) return;
        //File        
        const storageRef = ref(storage, `${id}/${file.name}`);
        
        await uploadBytes(storageRef, file).then((snapshot) => {                    
            getDownloadURL(snapshot.ref).then(async (url) => {
                await updateDoc(lesRef, {
                    downloadLink: url,
                    fileName: file.name,
                });
            })
        });

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const UpdateLesson = async (id, title, description, file) => {
    const lesRef = doc(db, "lessons", id);

    if(title !== ""){
        await updateDoc(lesRef, {
            title: title,
        })
    }

    if(description !== ""){
        await updateDoc(lesRef, {
            description: description,
        })
    }

    if(file !== undefined){
        //Delete previous file
        const docSnap = await getDoc(lesRef);        
        const storageRefPrev = ref(storage, `${id}/${docSnap.data().fileName}`);
        await deleteObject(storageRefPrev).then().catch(error => console.error(error))

        //Put new file
        const storageRef = ref(storage, `${id}/${file.name}`);
        
        await uploadBytes(storageRef, file).then((snapshot) => {                    
            getDownloadURL(snapshot.ref).then(async (url) => {
                await updateDoc(lesRef, {
                    downloadLink: url,
                    fileName: file.name,
                });
            })
        });        
    }
}

export const DeleteLesson = async (id) => {
    const roomRef = doc(db, "rooms", GetRoomCode());
    const lesRef = doc(db, "lessons", id);

    const docSnap = await getDoc(lesRef);
    const storageRef = ref(storage, `${id}/${docSnap.data().fileName}`);   
    
    await deleteObject(storageRef).then().catch(error => console.error(error))
    await updateDoc(roomRef, {
        lessons: arrayRemove(lesRef),
    })
    
    await deleteDoc(lesRef);    

    //Fix indexes
    const lessons = await GetSpecificTasks(docSnap.data().type);
    await Promise.all(lessons.map(async (lesson, index) => {
        const lesRef = doc(db, "lessons", lesson.id);        
        await updateDoc(lesRef,{
            index: index+1,
        })
    }))
}

//Tasks -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const GetSpecificTasks = async (type) => {
    const roomRef = doc(db, "rooms", GetRoomCode());
    const roomSnap = await getDoc(roomRef);

    let tasks = [];    
    await Promise.all(roomSnap.data().lessons.map(async (item) => {
        const taskRef = doc(db, "lessons", item.id);
        const taskSnap = await getDoc(taskRef);

        if(taskSnap.data().type === type){                
            tasks.push({
                id: item.id,
                task: taskSnap.data(),
            });
        }
    }));    
    tasks = tasks.sort((a,b) => a.task.creationDate - b.task.creationDate);
    return tasks;
}

export const CreateTask = async (title, description, type, deadline, file) => {
    try {        
        const id = generator.generate({
            length: 16,
            numbers: true
        });

        const tasks = await GetSpecificTasks(type);

        const taskRef = doc(db, 'lessons', id);        
        await setDoc(taskRef, {
            index: tasks.length + 1,
            type: type,
            title: title,
            description: description,
            creationDate: Date.now(),    
            deadline: deadline,     
            users: [],                            
        });                 
        
        const roomRef = doc(db, 'rooms', GetRoomCode());                
        await updateDoc(roomRef, {
            lessons: arrayUnion(taskRef),            
        })
        
        if(file === undefined) return;
        //File        
        const storageRef = ref(storage, `${id}/${file.name}`);
        
        await uploadBytes(storageRef, file).then((snapshot) => {                    
            getDownloadURL(snapshot.ref).then(async (url) => {
                await updateDoc(taskRef, {
                    downloadLink: url,
                    fileName: file.name,
                });
            })
        });

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
export const UpdateTask = async (id, title, description, type, deadline, file) => {
    const taskRef = doc(db, "lessons", id);

    if(title !== ""){
        await updateDoc(taskRef, {
            title: title,
        })
    }

    if(description !== ""){
        await updateDoc(taskRef, {
            description: description,
        })
    }
    
    if(type !== ""){
        await updateDoc(taskRef, {
            type: type,
        });
    }

    const docSnap = await getDoc(taskRef);
    if(deadline !== docSnap.data().deadline){
        await updateDoc(taskRef, {
            deadline: deadline,
        });
    }

    if(file !== undefined){
        //Delete previous file
        const docSnap = await getDoc(taskRef);    
        if(docSnap.data().fileName !== ""){
            const storageRefPrev = ref(storage, `${id}/${docSnap.data().fileName}`);
            await deleteObject(storageRefPrev).then().catch(error => console.error(error))
        }        

        //Put new file
        const storageRef = ref(storage, `${id}/${file.name}`);
        
        await uploadBytes(storageRef, file).then((snapshot) => {                    
            getDownloadURL(snapshot.ref).then(async (url) => {
                await updateDoc(taskRef, {
                    downloadLink: url,
                    fileName: file.name,
                });
            })
        });
    }
}

export const SetMark = async (lessonid, userid, mark) => {    
    const taskRef = doc(db, "lessons", lessonid);
    
    let updateUser = {
        id: '',
        creationDate: 0,
        downloadLink: '',
        fileName: '',
        mark: '',
    }
    const docSnap = await getDoc(taskRef);
    await Promise.all(docSnap.data().users.map(async (user) => {        
        if(user.id === userid){
            updateUser = user;
            await updateDoc(taskRef,{
                users: arrayRemove(user),
            })
        }
    }));

    updateUser.mark = mark;    
    updateDoc(taskRef,{
        users: arrayUnion(updateUser),
    });
}

export const DeleteTask = async (id) => {
    const taskRef = doc(db, "lessons", id);
    const taskSnap = await getDoc(taskRef);    

    //Delete user's task
    await Promise.all(taskSnap.data().users.map(async (el) => {    
        const storageRef = ref(storage, `${id}/${el.id}/${el.fileName}`);
        await deleteObject(storageRef).then().catch(error => console.error(error))
    }));
    //Delete task file
    if(taskSnap.data().fileName !== ""){
        const storageRef = ref(storage, `${id}/${taskSnap.data().fileName}`);
        await deleteObject(storageRef).then().catch(error => console.error(error))
    }
    //Delete task ref
    const roomRef = doc(db, "rooms", GetRoomCode());
    await updateDoc(roomRef, {
        lessons: arrayRemove(taskRef),
    })
    
    await deleteDoc(taskRef);    

    //Fix indexes
    const tasks = await GetSpecificTasks(taskSnap.data().type);
    await Promise.all(tasks.map(async (task, index) => {
        const taskRef = doc(db, "lessons", task.id);        
        await updateDoc(taskRef,{
            index: index+1,
        })
    }))
}

export const SendTaskFile = async (id, file) => {
    const taskRef = doc(db, "lessons", id);
    const docSnap = await getDoc(taskRef);
        
    await Promise.all(docSnap.data().users.map(async (user) => {
        if(user.id === GetUserId()){
            //Delete user's file
            const storageRef = ref(storage, `${id}/${user.id}/${user.fileName}`);
            await deleteObject(storageRef).then().catch(error => console.error(error))            

            //Delete user info
            const prevUser = user;            
            await updateDoc(taskRef,{
                users: arrayRemove(prevUser)
            })            
        }
    }));

    let typestr = "";
    switch(docSnap.data().type){
        case "homework":
            typestr = "HW";
            break;
        case "practice":
            typestr = "PR";
            break;
        case "laboratory":
            typestr = "LAB";
            break;
        default:
            break;
    }
    const userRef = doc(db, "users", GetUserId());
    const userSnap = await getDoc(userRef);
    let fileName = `${id}/${GetUserId()}/${typestr}_${userSnap.data().lastName}_${file.name}`;

    const storageRef = ref(storage, fileName);    
    await uploadBytes(storageRef, file).then((snapshot) => {                    
        getDownloadURL(snapshot.ref).then(async (url) => {
            const user = {
                id: GetUserId(),
                fileName: `${typestr}_${userSnap.data().lastName}_${file.name}`,
                downloadLink: url,
                creationDate: Date.now(),                
            }
            await updateDoc(taskRef, {
                users: arrayUnion(user),
            })
        })
    });
}

export const GetLesson = async (lesRef) => {
    const docSnap = await getDoc(doc(db, "lessons", lesRef._key.path.segments[6]));             //REFACTOR    
    return docSnap.data(); 
}

export const GetLessonById = async (id) => {
    const docSnap = await getDoc(doc(db, "lessons", id));    
    return  docSnap.data();
}

export const GetRows = async () => {
    const roomRef = doc(db, "rooms", GetRoomCode());
    const docSnap = await getDoc(roomRef);

    var rows = [];
    
    //Get lesson
    await Promise.all(docSnap.data().lessons.map(async (el, index) => {   
        const lesRef = doc(db, "lessons", el.id);
        const lesSnap = await getDoc(lesRef);                
        if(lesSnap.data().type !== "lesson"){                          
            //Get users in lesson            
            await Promise.all(lesSnap.data().users.map(async (user) => {                
                //First time filling array    
                    let row = {};                    
                    //row["id"] = user.id;
                    
                    const userRef = doc(db, "users", user.id);
                    const userSnap = await getDoc(userRef);
                    row["name"] = userSnap.data().firstName + " " + userSnap.data().lastName;

                    row[`mark`] = user.mark;                                                            
                    rows.push({...row});
                                    
            }))
        }        
    })        )
    const reducedRows = rows.reduce((prev, value, index) => {
        prev[value.id] = [...prev[value.id] || [], value];
        return prev
    
    }, {})
    return [...Object.keys(reducedRows).map(item => {
        return reducedRows[item].reduce((prev,item ,index) => { 
            const temp = {...prev,id: item.id, name: item.name,}
            temp[`mark${index}`] = item.mark;
            return temp;
        }, {})
    })];
}

export const GetStatistics = async () => {
    const roomRef = doc(db, "rooms", GetRoomCode());
    const roomSnap = await getDoc(roomRef);    

    let lessons = [];    
    await Promise.all(roomSnap.data().lessons.map(async (item) => {
        const lesRef = doc(db, "lessons", item.id);
        const lesSnap = await getDoc(lesRef);

        if(lesSnap.data().type !== "lesson"){                
            lessons.push({
                id: item.id,
                task: lesSnap.data(),
            });
        }
    }));    
    lessons = lessons.sort((a,b) => a.task.creationDate - b.task.creationDate);    

    let users = [];

    await Promise.all(roomSnap.data().users.map(async (user, index) => {
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);                

        let userRow = {
            name: `${userSnap.data().lastName} ${userSnap.data().firstName}`,
            marks: [],
        }

        for(let i = 0; i < lessons.length; i++){
            let mark = {};

            switch(lessons[i].task.type){
                case "homework":
                    mark["type"] = "HW";
                    mark["index"] = lessons[i].task.index;
                    break;
                case "practice":
                    mark["type"] = "PR";
                    mark["index"] = lessons[i].task.index;
                    break;
                case "laboratory":
                    mark["type"] = "LR";
                    mark["index"] = lessons[i].task.index;
                    break;
                case "test":
                    mark["type"] = "T";
                    mark["index"] = lessons[i].task.index;
                    break;
                default:
                    mark["type"] = "L";
                    mark["index"] = lessons[i].task.index;
                    break;
            }
            let value;
            lessons[i].task.users.forEach(item => {                
                if(item.id === user.id){                    
                    value = item.mark;                    
                }
            })

            if(value === undefined){                           
                if(lessons[i].task.type === 'laboratory'){
                    value = "fail";                                   
                }
                else{
                    value = 0;     
                }
            }                        
            mark["value"] = value;            
            userRow.marks.push(mark);
        }        
        users.push(userRow);
    }));
    
    return users;
}

//Tests -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const SetTestCode = (testCode) => {
    localStorage.setItem('testCode', testCode);
}
export const GetTestCode = () => {
    return localStorage.getItem('testCode');
}
export const RemoveTestCode = () => {
    localStorage.removeItem('testCode');
}

export const IsTestCodeActive = () => {
    if(!GetTestCode()){
        window.location.href="/room";
    }    
}

export const CreateTest = async (title, description, questions) => {
    try {        
        const id = generator.generate({
            length: 16,
            numbers: true
        });

        const tasks = await GetSpecificTasks("test");        
        
        const taskRef = doc(db, 'lessons', id);        
        await setDoc(taskRef, {
            index: tasks.length + 1,
            type: "test",
            title: title,
            description: description,
            creationDate: Date.now(),                
            questions: JSON.stringify(questions),
            users: [],                            
        });                 
        
        const roomRef = doc(db, 'rooms', GetRoomCode());                
        await updateDoc(roomRef, {
            lessons: arrayUnion(taskRef),            
        })

        window.location.href="/room";
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const UpdateTest = async (id, title, description, questions) => {
    const testRef = doc(db, "lessons", id);
    try{
        await updateDoc(testRef, {
            title: title,
            description: description,
            questions: JSON.stringify(questions),
        })    
    }
    catch(e){
        console.error(e);
    }

    window.location.href = "/room";
}

export const SetTestMark = async (id, mark) => {    
    const testRef = doc(db, "lessons", id);
    
    let updateUser = {
        id: GetUserId(),                        
        mark: '',
    }
    const testSnap = await getDoc(testRef);
    await Promise.all(testSnap.data().users.map(async (user) => {        
        if(user.id === updateUser.id){
            updateUser = user;
            await updateDoc(testRef,{
                users: arrayRemove(user),
            })
        }
    }));

    updateUser.mark = mark;    
    updateDoc(testRef,{
        users: arrayUnion(updateUser),
    });
}

export const DeleteTest = async (id) => {
    const testRef = doc(db, "lessons", id);
    const testSnap = await getDoc(testRef);    

    //Delete test ref
    const roomRef = doc(db, "rooms", GetRoomCode());
    await updateDoc(roomRef, {
        lessons: arrayRemove(testRef),
    })
    
    await deleteDoc(testRef);    

    //Fix indexes
    const tests = await GetSpecificTasks(testSnap.data().type);
    await Promise.all(tests.map(async (test, index) => {
        const testRef = doc(db, "lessons", test.id);        
        await updateDoc(testRef,{
            index: index+1,
        })
    }))
}

export const GetTestData = async () => {
    const testRef = doc(db, 'lessons', GetTestCode());
    const testSnap = await getDoc(testRef);

    return testSnap.data();
}