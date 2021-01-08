import firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBxjyi5eBQjp9kFaqmf3ZZOizg04VetOpg",
  authDomain: "kossep-1e2f3.firebaseapp.com",
  databaseURL: "https://kossep-1e2f3-default-rtdb.firebaseio.com",
  projectId: "kossep-1e2f3",
  storageBucket: "kossep-1e2f3.appspot.com",
  messagingSenderId: "195914972985",
  appId: "1:195914972985:web:332788d122f52e194f32e8",
};

// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase;
