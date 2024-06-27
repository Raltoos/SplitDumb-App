import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDZCWg6kyl__V-0SmdzxhbS6aBrD-rqfgk",
  authDomain: "learningfirebase-65271.firebaseapp.com",
  projectId: "learningfirebase-65271",
  storageBucket: "learningfirebase-65271.appspot.com",
  messagingSenderId: "606096597092",
  appId: "1:606096597092:web:3eb7ba2e4889bb845bff71",
  measurementId: "G-41BEZXKQ98"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);