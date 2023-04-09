// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { DocumentData, doc, getDoc, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb6xv5WPhG5bRve6IevS-_iubRTT8IXLY",
  authDomain: "content-spark.firebaseapp.com",
  projectId: "content-spark",
  storageBucket: "content-spark.appspot.com",
  messagingSenderId: "399642653358",
  appId: "1:399642653358:web:5316e83041b16e1b0e733f",
  measurementId: "G-03ZLR7MB6N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);

const getUserProfile = async (userId: string) => {
  try {
    const userProfileDoc = await getDoc(doc(firestore, "users", userId));
    return userProfileDoc.data() as DocumentData | null;
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }
  return null;
};

export { auth, firestore, googleProvider, getUserProfile };
