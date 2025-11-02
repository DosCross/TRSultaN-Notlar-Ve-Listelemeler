// LocalStorage işlemleri
function getNotes() {
  return JSON.parse(localStorage.getItem("notes") || "[]");
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Notları oluşturma
function renderNotes(filter = "") {
  const container = document.getElementById("notesContainer");
  container.innerHTML = "";
  const notes = getNotes();

  const filtered = notes.filter((note) =>
    note.text.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    container.innerHTML = "<p>Hiç not yok.</p>";
    return;
  }

  filtered.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note";
    div.style.background = note.color;
    div.innerHTML = `
      <button data-index="${index}">🗑️</button>
      <p>${note.text}</p>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".note button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const notes = getNotes();
      notes.splice(index, 1);
      saveNotes(notes);
      renderNotes(document.getElementById("searchInput").value);
    });
  });
}

// Not ekleme
document.getElementById("addNoteBtn").addEventListener("click", () => {
  const text = document.getElementById("noteInput").value.trim();
  const color = document.getElementById("colorPicker").value;
  if (!text) return alert("Lütfen bir not yazın!");

  const notes = getNotes();
  notes.push({ text, color });
  saveNotes(notes);

  document.getElementById("noteInput").value = "";
  renderNotes(document.getElementById("searchInput").value);
});

// Arama filtresi
document.getElementById("searchInput").addEventListener("input", (e) => {
  renderNotes(e.target.value);
});

// Sayfa açıldığında notları yükle
document.addEventListener("DOMContentLoaded", () => renderNotes());
