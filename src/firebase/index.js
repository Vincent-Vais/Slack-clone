import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAiXg85uXlESumG3v3kawDOk9REjSWzTgk",
  authDomain: "slack-clone-db90b.firebaseapp.com",
  databaseURL: "https://slack-clone-db90b.firebaseio.com",
  projectId: "slack-clone-db90b",
  storageBucket: "slack-clone-db90b.appspot.com",
  messagingSenderId: "709963579195",
  appId: "1:709963579195:web:eb1d2fad0d459a4444411e",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
