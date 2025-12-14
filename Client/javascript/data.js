import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// 👉 thay config của bạn ở đây
const firebaseConfig = {
  apiKey: "AIzaSyB-NaW2MY9Ft6b7JKyoK9p-EYwRg7P9imA",
  authDomain: "spck-real.firebaseapp.com",
  projectId: "spck-real",
  storageBucket: "spck-real.firebasestorage.app",
  messagingSenderId: "172640637259",
  appId: "1:172640637259:web:b8365ae08dc31bdfd618ce",
  measurementId: "G-GNZJW89YRZ"
};

// Khởi tạo Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Import JSON
async function importQuizzes() {
  const response = await fetch('/Client/data/science.json');
  const quizzes = await response.json();
  console.log(quizzes)

  for (const quiz of quizzes) {
    const docRef = doc(db, "Life skills", quiz.id);
    await setDoc(docRef, quiz);
    console.log(` Đã thêm quiz: ${quiz.id} → Document ID: ${docRef.id}`);
  }

  alert("Đã import xong toàn bộ quiz vào Firestore!");
}

importQuizzes();