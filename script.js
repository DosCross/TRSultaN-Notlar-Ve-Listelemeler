// Notları localStorage'dan al
function getNotes() {
  return JSON.parse(localStorage.getItem("notes") || "[]");
}

// Notları kaydet
function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Notları ekranda göster
function renderNotes() {
  const container = document.getElementById("notesContainer");
  container.innerHTML = "";
  const notes = getNotes();

  if (notes.length === 0) {
    container.innerHTML = "<p>Henüz not eklenmedi.</p>";
    return;
  }

  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `
      <p>${note}</p>
      <button data-index="${index}" class="deleteBtn">🗑️</button>
    `;
    container.appendChild(div);
  });

  // Silme butonlarına olay bağla
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const notes = getNotes();
      notes.splice(index, 1);
      saveNotes(notes);
      renderNotes();
    });
  });
}

// Yeni not ekle
document.getElementById("addNoteBtn").addEventListener("click", () => {
  const textarea = document.getElementById("noteInput");
  const text = textarea.value.trim();
  if (!text) return alert("Lütfen bir not yazın!");

  const notes = getNotes();
  notes.push(text);
  saveNotes(notes);
  textarea.value = "";
  renderNotes();
});

// Menü aç/kapa
document.getElementById("menuBtn").addEventListener("click", () => {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
});

// Tüm notları sil
document.getElementById("clearNotes").addEventListener("click", () => {
  if (confirm("Tüm notlar silinecek, emin misiniz?")) {
    localStorage.removeItem("notes");
    renderNotes();
  }
});

// Sayfa yüklenince notları göster
document.addEventListener("DOMContentLoaded", renderNotes);
