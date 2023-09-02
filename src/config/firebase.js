import { initializeApp } from "firebase/app";
import { getFirestore,collection, addDoc,getDocs,setDoc,doc,query, where, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes,getDownloadURL,uploadBytesResumable } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCvAO22_JAiDn6Ui6-_FTdBBhaB-JiZLqw",
  authDomain: "react-266df.firebaseapp.com",
  projectId: "react-266df",
  storageBucket: "react-266df.appspot.com",
  messagingSenderId: "480860030706",
  appId: "1:480860030706:web:be40ce9e1d2d184ea7326b",
  measurementId: "G-ZJXRDX7T5Q"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export {collection, addDoc,db,getDocs,ref, uploadBytes,storage,getDownloadURL,uploadBytesResumable,setDoc,doc,query, where, onSnapshot,}