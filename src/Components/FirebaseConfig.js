import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import {getStorage} from'firebase/storage'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDPXKaUIXz6PmgVOymQhdnGLvniabHXWyU",
    authDomain: "donationapp1-f2bd9.firebaseapp.com",
    databaseURL: "https://donationapp1-f2bd9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "donationapp1-f2bd9",
    storageBucket: "donationapp1-f2bd9.appspot.com",
    messagingSenderId: "308589438791",
    appId: "1:308589438791:web:db038806afd674b599ce62"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app);

export {db,storage,auth}





