// === MENU AÇ/KAPA ===
const menuToggle = document.getElementById("menu-toggle");
const menuItems = document.querySelector(".menu-items");
const menuButtons = document.querySelectorAll(".menu-btn");

menuToggle.addEventListener("click", () => {
  menuItems.classList.toggle("show");
});

// === ALANLAR ===
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const addBtn = document.getElementById("add-btn");

const notesSection = document.getElementById("notes-section");
const archiveSection = document.getElementById("archive-section");
const trashSection = document.getElementById("trash-section");

// === FIREBASE ===
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const db = window.db;
const notesRef = collection(db, "notes");

// === SAYFA YÜKLENDİĞİNDE NOTLARI GETİR ===
window.addEventListener("DOMContentLoaded", async () => {
  await loadNotes();
});

// === NOT EKLE ===
addBtn.addEventListener("click", async () => {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (!title && !content) return alert("Boş not eklenemez!");

  const newNote = { title, content, status: "active", created: Date.now() };

  await addDoc(notesRef, newNote);
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

// === NOT KARTI OLUŞTUR ===
function createNoteElement(id, note) {
  const div = document.createElement("div");
  div.classList.add("note");
  div.innerHTML = `
    <h3>${note.title || "Başlıksız"}</h3>
    <p>${note.content}</p>
    <div class="note-buttons">
      ${note.status !== "archived" && note.status !== "trashed" ? `
        <button onclick="archiveNote('${id}')">📦 Arşivle</button>
        <button onclick="deleteNote('${id}')">🗑️ Sil</button>
      ` : ""}
      ${note.status === "archived" ? `
        <button onclick="restoreNote('${id}')">♻️ Geri Al</button>
      ` : ""}
      ${note.status === "trashed" ? `
        <button onclick="restoreNote('${id}')">♻️ Geri Al</button>
        <button onclick="permanentDelete('${id}')">❌ Kalıcı Sil</button>
      ` : ""}
    </div>
  `;
  return div;
}

// === NOTU ARŞİVLE ===
window.archiveNote = async (id) => {
  const ref = doc(db, "notes", id);
  await updateDoc(ref, { status: "archived" });
  await loadNotes();
};

// === NOTU ÇÖP KUTUSUNA TAŞI ===
window.deleteNote = async (id) => {
  const ref = doc(db, "notes", id);
  await updateDoc(ref, { status: "trashed" });
  await loadNotes();
};

// === NOTU GERİ AL ===
window.restoreNote = async (id) => {
  const ref = doc(db, "notes", id);
  await updateDoc(ref, { status: "active" });
  await loadNotes();
};

// === NOTU KALICI SİL ===
window.permanentDelete = async (id) => {
  const ref = doc(db, "notes", id);
  await deleteDoc(ref);
  await loadNotes();
};

// === MENÜ BUTONLARI ARASINDA GEÇİŞ ===
menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const section = btn.getAttribute("data-section");
    notesSection.classList.add("hidden");
    archiveSection.classList.add("hidden");
    trashSection.classList.add("hidden");

    if (section === "notes") notesSection.classList.remove("hidden");
    else if (section === "archive") archiveSection.classList.remove("hidden");
    else if (section === "trash") trashSection.classList.remove("hidden");

    menuItems.classList.remove("show");
  });
});
