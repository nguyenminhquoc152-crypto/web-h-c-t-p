

const firebaseConfig = {
    apiKey: "AIzaSyB-NaW2MY9Ft6b7JKyoK9p-EYwRg7P9imA",
    authDomain: "spck-real.firebaseapp.com",
    projectId: "spck-real",
    storageBucket: "spck-real.firebasestorage.app",
    messagingSenderId: "172640637259",
    appId: "1:172640637259:web:b8365ae08dc31bdfd618ce",
    measurementId: "G-GNZJW89YRZ"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Initialize Cloud Storage and get a reference to the service
const storage = firebase.storage();
