import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// === FIREBASE CONFIG ===
const firebaseConfig = {
  apiKey: "AIzaSyB1cFxk1JjLXlrNEK5MyqPOZxZEqsFMx4Y",
  authDomain: "trsultan-keep.firebaseapp.com",
  projectId: "trsultan-keep",
  storageBucket: "trsultan-keep.firebasestorage.app",
  messagingSenderId: "142103713041",
  appId: "1:142103713041:web:0faf05bc7f71d9081b28b0",
  measurementId: "G-QE8FVDQRVC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesRef = collection(db, "notes");

// === ELEMENTLER ===
const menuToggle = document.getElementById("menu-toggle");
const menuItems = document.querySelector(".menu-items");
const menuButtons = document.querySelectorAll(".menu-btn");
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const addBtn = document.getElementById("add-btn");
const notesSection = document.getElementById("notes-section");
const archiveSection = document.getElementById("archive-section");
const trashSection = document.getElementById("trash-section");

// === MENÜ ===
menuToggle.addEventListener("click", () => menuItems.classList.toggle("show"));

menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const section = btn.dataset.section;
    [notesSection, archiveSection, trashSection].forEach((sec) =>
      sec.classList.add("hidden")
    );
    if (section === "notes") notesSection.classList.remove("hidden");
    else if (section === "archive") archiveSection.classList.remove("hidden");
    else trashSection.classList.remove("hidden");
    menuItems.classList.remove("show");
  });
});

// === NOT EKLE ===
addBtn.addEventListener("click", async () => {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  if (!title && !content) return alert("Boş not eklenemez!");
  await addDoc(notesRef, { title, content, status: "active", created: Date.now() });
  noteTitle.value = "";
  noteContent.value = "";
  await loadNotes();
});

// === NOTLARI YÜKLE ===
async function loadNotes() {
  notesSection.innerHTML = "";
  archiveSection.innerHTML = "";
  trashSection.innerHTML = "";
  const querySnapshot = await getDocs(notesRef);
  querySnapshot.forEach((docSnap) => {
    const note = docSnap.data();
    const id = docSnap.id;
    const noteElement = createNoteElement(id, note);
    if (note.status === "archived") archiveSection.appendChild(noteElement);
    else if (note.status === "trashed") trashSection.appendChild(noteElement);
    else notesSection.appendChild(noteElement);
  });
}

// === KART OLUŞTUR ===
function createNoteElement(id, note) {
  const div = document.createElement("div");
  div.classList.add("note");
  div.innerHTML = `
    <h3>${note.title || "Başlıksız"}</h3>
    <p>${note.content}</p>
    <div class="note-buttons">
      ${note.status === "active" ? `
        <button onclick="archiveNote('${id}')">📦 Arşivle</button>
        <button onclick="moveToTrash('${id}')">🗑️ Sil</button>
      ` : ""}
      ${note.status === "archived" ? `
        <button onclick="restoreNote('${id}')">♻️ Geri Al</button>
      ` : ""}
      ${note.status === "trashed" ? `
        <button onclick="restoreNote('${id}')">♻️ Geri Al</button>
        <button onclick="deletePermanently('${id}')">❌ Kalıcı Sil</button>
      ` : ""}
    </div>`;
  return div;
}

// === İŞLEMLER ===
window.archiveNote = async (id) => {
  await updateDoc(doc(db, "notes", id), { status: "archived" });
  await loadNotes();
};

window.moveToTrash = async (id) => {
  await updateDoc(doc(db, "notes", id), { status: "trashed" });
  await loadNotes();
};

window.restoreNote = async (id) => {
  await updateDoc(doc(db, "notes", id), { status: "active" });
  await loadNotes();
};

window.deletePermanently = async (id) => {
  await deleteDoc(doc(db, "notes", id));
  await loadNotes();
};

// === BAŞLAT ===
window.addEventListener("DOMContentLoaded", loadNotes);
