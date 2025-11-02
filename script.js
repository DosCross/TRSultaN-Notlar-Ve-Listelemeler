// script.js (type="module")
// Firebase modular SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore, collection, query, where, orderBy,
  onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

/* ========== FIREBASE CONFIG ========== */
/* KENDİNİN VERDİĞİ KONFİGÜRASYON */
const firebaseConfig = {
  apiKey: "AIzaSyB1cFxk1JjLXlrNEK5MyqPOZxZEqsFMx4Y",
  authDomain: "trsultan-keep.firebaseapp.com",
  projectId: "trsultan-keep",
 
