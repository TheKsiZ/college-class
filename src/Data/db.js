import db from './fbase';
import { doc, setDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


export const CreateUser = async (auth, email, password) => (createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {        
        const user = userCredential.user;        
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
        });
        console.log("Document written with ID: ", userID);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};