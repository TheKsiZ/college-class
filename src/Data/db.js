//TO-DO: remake localstorage to cookies
import { db, storage } from './fbase';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, getDocs, deleteDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
var generator = require('generate-password');

//User Auth/Register
export const AuthorizateUser = async (auth, email, password) => (signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;     
        SetUserId(user.uid);        
    })
    .catch((error) => {
        return error.message;
    }));

export const CreateUser = async (auth, email, password) => (createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {        
        const user = userCredential.user;        
        localStorage.setItem('userId', user.uid);
    })
    .catch((error) => {                
        return error.message;
    }));

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

export const UpdateUser = async (firstName, lastName) => {    
    if(firstName !== ""){
        await updateDoc(doc(db, "users", GetUserId()),{
            firstName: firstName,         
        });
    }
    if(lastName !== ""){
        await updateDoc(doc(db, "users", GetUserId()),{
            lastName: lastName,
        });
    }    
    await SetUserToLocal();
}

export const GetUserById = async (id) => {
    const docSnap = await getDoc(doc(db, "users", id));    
    return  docSnap.data();
}

//User localstorage
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

//Get user from db and set to localstorage
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
    window.location.href="/login";
}

//Rooms
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
    await updateDoc(roomRef, {
        users: arrayRemove(userRef),
        teachers: arrayRemove(userRef),
    })

    await updateDoc(userRef, {
        rooms: arrayRemove(roomRef),
    })
    
}
//Room code to localstorage
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
    docSnap.data().teachers.forEach(async (user) => {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
            rooms: arrayRemove(roomRef),
        });
    });
    //Delete ref from users
    docSnap.data().users.forEach(async (user) => {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
            rooms: arrayRemove(roomRef),
        });
    });

    docSnap.data().lessons.forEach(async (lesson) => {
        DeleteLesson(lesson.id);              
    });
    await deleteDoc(doc(db, "rooms", GetRoomCode()));
    RemoveRoomCode();
}

//Get Room from db 
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

//Owner validation
export const SetIsUserOwner = (state) => {
    localStorage.setItem('isOwner', state);
}
export const GetIsUserOwner = () => {
    return localStorage.getItem('isOwner') === "true";
}
export const RemoveIsUserOwner = () => {
    localStorage.removeItem('isOwner');
}

//Teacher validation
export const IsUserTeacher = async () => {
    const roomRef = doc(db, 'rooms', GetRoomCode());
    const docSnap = await getDoc(roomRef);
    let flag = false;
    docSnap.data().teachers.forEach(async (teacher) => {
        if(teacher.id === GetUserId()){
            flag = true;
        }
    });
    return flag;
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

export const IsCodeActive = () => {
    if(!GetRoomCode()){
        window.location.href="/rooms";
    }    
}

//Lessons
export const CreateLesson = async (title, description, file) => {
    try {        
        const id = generator.generate({
            length: 16,
            numbers: true
        });

        const lesRef = doc(db, 'lessons', id);        
        await setDoc(lesRef, {
            isLesson: true,   
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
}

//Homework
export const CreateHomework = async (title, description, deadline, file) => {
    try {        
        const id = generator.generate({
            length: 16,
            numbers: true
        });

        const homeRef = doc(db, 'lessons', id);        
        await setDoc(homeRef, {
            isLesson: false,   
            title: title,
            description: description,
            creationDate: Date.now(),    
            deadline: deadline,     
            users: [],                            
        });                 
        
        const roomRef = doc(db, 'rooms', GetRoomCode());                
        await updateDoc(roomRef, {
            lessons: arrayUnion(homeRef),            
        })
        
        if(file === undefined) return;
        //File        
        const storageRef = ref(storage, `${id}/${file.name}`);
        
        await uploadBytes(storageRef, file).then((snapshot) => {                    
            getDownloadURL(snapshot.ref).then(async (url) => {
                await updateDoc(homeRef, {
                    downloadLink: url,
                    fileName: file.name,
                });
            })
        });

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
export const UpdateHomework = async (id, title, description, deadline, file) => {
    const homeRef = doc(db, "lessons", id);

    if(title !== ""){
        await updateDoc(homeRef, {
            title: title,
        })
    }

    if(description !== ""){
        await updateDoc(homeRef, {
            description: description,
        })
    }

    const docSnap = await getDoc(homeRef);
    if(deadline !== docSnap.data().deadline){
        await updateDoc(homeRef,{
            deadline: deadline,
        })
    }

    if(file !== undefined){
        //Delete previous file
        const docSnap = await getDoc(homeRef);    
        if(docSnap.data().fileName !== ""){
            const storageRefPrev = ref(storage, `${id}/${docSnap.data().fileName}`);
            await deleteObject(storageRefPrev).then().catch(error => console.error(error))
        }        

        //Put new file
        const storageRef = ref(storage, `${id}/${file.name}`);
        
        await uploadBytes(storageRef, file).then((snapshot) => {                    
            getDownloadURL(snapshot.ref).then(async (url) => {
                await updateDoc(homeRef, {
                    downloadLink: url,
                    fileName: file.name,
                });
            })
        });
    }
}

export const DeleteHomework = async (id) => {
    const homeRef = doc(db, "lessons", id);
    const docSnap = await getDoc(homeRef);

    //Delete user's homework
    docSnap.data().users.map(async (el) => {    
        const storageRef = ref(storage, `${id}/${el.id}/${el.fileName}`);
        await deleteObject(storageRef).then().catch(error => console.error(error))
    });
    //Delete homework file
    if(docSnap.data().fileName !== ""){
        const storageRef = ref(storage, `${id}/${docSnap.data().fileName}`);
        await deleteObject(storageRef).then().catch(error => console.error(error))
    }
    //Delete homework ref
    const roomRef = doc(db, "rooms", GetRoomCode());
    await updateDoc(roomRef, {
        lessons: arrayRemove(homeRef),
    })

    await deleteDoc(homeRef);    
}

export const SendHomeworkFile = async (id, file) => {
    const homeRef = doc(db, "lessons", id);
    const docSnap = await getDoc(homeRef);
        
    docSnap.data().users.map(async (el) => {
        if(el.id === GetUserId()){
            //Delete user's file
            const storageRef = ref(storage, `${id}/${el.id}/${el.fileName}`);
            await deleteObject(storageRef).then().catch(error => console.error(error))            

            //Delete user info
            const prevUser = el;            
            await updateDoc(homeRef,{
                users: arrayRemove(prevUser)
            })            
        }
    });

    const storageRef = ref(storage, `${id}/${GetUserId()}/${file.name}`);    
    await uploadBytes(storageRef, file).then((snapshot) => {                    
        getDownloadURL(snapshot.ref).then(async (url) => {
            const user = {
                id: GetUserId(),
                fileName: file.name,
                downloadLink: url,
                creationDate: Date.now(),
            }
            await updateDoc(homeRef, {
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