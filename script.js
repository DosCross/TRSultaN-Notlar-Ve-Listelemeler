let notes = JSON.parse(localStorage.getItem("notes")) || [];

const noteContainer = document.getElementById("notes-container");
const addNoteBtn = document.getElementById("add-note-btn");
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const noteColor = document.getElementById("note-color");
const searchInput = document.getElementById("search");
const menuToggle = document.getElementById("menu-toggle");
const menuContent = document.querySelector(".menu-content");

let currentFilter = "all";

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
  noteContainer.innerHTML = "";

  let filteredNotes = notes.filter(note => {
    if (currentFilter === "archived") return note.archived;
    if (currentFilter === "trash") return note.trash;
    if (currentFilter === "pinned") return note.pinned && !note.trash;
    return !note.archived && !note.trash;
  });

  const searchTerm = searchInput.value.toLowerCase();
  filteredNotes = filteredNotes.filter(
    n =>
      n.title.toLowerCase().includes(searchTerm) ||
      n.content.toLowerCase().includes(searchTerm)
  );

  filteredNotes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note";
    div.style.borderLeftColor = note.color || "#900";
    div.innerHTML = `
      <div class="note-title">${note.title}</div>
      <div class="note-content">${note.content}</div>
      <div class="note-buttons">
        <button onclick="togglePin(${index})">📌</button>
        <button onclick="archiveNote(${index})">📦</button>
        <button onclick="deleteNote(${index})">🗑️</button>
      </div>
    `;
    noteContainer.appendChild(div);
  });
}

addNoteBtn.addEventListener("click", () => {
  if (!noteContent.value.trim()) return alert("Not içeriği boş olamaz!");
  const note = {
    title: noteTitle.value.trim(),
    content: noteContent.value.trim(),
    color: noteColor.value,
    pinned: false,
    archived: false,
    trash: false,
    date: new Date().toISOString(),
  };
  notes.push(note);
  saveNotes();
  noteTitle.value = "";
  noteContent.value = "";
  renderNotes();
});

function togglePin(index) {
  notes[index].pinned = !notes[index].pinned;
  saveNotes();
  renderNotes();
}

function archiveNote(index) {
  notes[index].archived = !notes[index].archived;
  saveNotes();
  renderNotes();
}

function deleteNote(index) {
  if (notes[index].trash) {
    notes.splice(index, 1);
  } else {
    notes[index].trash = true;
  }
  saveNotes();
  renderNotes();
}

searchInput.addEventListener("input", renderNotes);

menuToggle.addEventListener("click", () => {
  menuContent.classList.toggle("show");
});

document.getElementById("all-notes").addEventListener("click", () => {
  currentFilter = "all";
  renderNotes();
});
document.getElementById("archived-notes").addEventListener("click", () => {
  currentFilter = "archived";
  renderNotes();
});
document.getElementById("trash-notes").addEventListener("click", () => {
  currentFilter = "trash";
  renderNotes();
});
document.getElementById("pinned-notes").addEventListener("click", () => {
  currentFilter = "pinned";
  renderNotes();
});

renderNotes();
