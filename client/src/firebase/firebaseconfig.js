// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjGMZNZoFjeTYozlLxLfLJ8wm_34N0rTQ",
  authDomain: "estate-project-58f23.firebaseapp.com",
  projectId: "estate-project-58f23",
  storageBucket: "estate-project-58f23.appspot.com",
  messagingSenderId: "927392614117",
  appId: "1:927392614117:web:11ba91b48020fb9e2e360c",
  measurementId: "G-HSSC5SCC6K",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
