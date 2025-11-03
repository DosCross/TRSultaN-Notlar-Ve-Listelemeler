// Not yönetimi işlemleri

let currentView = 'notes'; // notes, archive, trash
let editingNoteId = null;
let selectedColor = 'default';

document.addEventListener('DOMContentLoaded', function() {
    // Giriş kontrolü
    checkAuth();
    
    // Kullanıcı bilgilerini göster
    displayUserInfo();
    
    // Dropdown menü kontrolü
    setupDropdown();
    
    // Sidebar kontrolü
    setupSidebar();
    
    // Not input ayarları
    setupNoteInput();
    
    // Renk seçimi
    setupColorPicker();
    
    // Modal ayarları
    setupModal();
    
    // Hash kontrolü (arşiv veya çöp kutusu)
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    // Notları yükle
    loadNotes();
    
    // Çıkış butonu
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Giriş kontrolü
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
}

// Kullanıcı bilgilerini göster
function displayUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        const userNameElement = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userNameElement) {
            userNameElement.textContent = currentUser.name;
        }
        
        if (userAvatar) {
            const avatarColor = currentUser.avatarColor || '8b0000';
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=${avatarColor}&color=fff&size=40`;
            userAvatar.src = avatarUrl;
        }
    }
}

// Dropdown menü ayarları
function setupDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (profileBtn && dropdownMenu) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}

// Sidebar ayarları
function setupSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');
    
    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('show');
        });
        
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
        });
        
        if (closeSidebar) {
            closeSidebar.addEventListener('click', function() {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('show');
            });
        }
    }
    
    // Menü öğelerine tıklama
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.dataset.view;
            if (view) {
                currentView = view;
                updatePageTitle();
                loadNotes();
                
                // Aktif sınıfı güncelle
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Sidebar'ı kapat
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('show');
            }
        });
    });
}

// Not input ayarları
function setupNoteInput() {
    const quickInput = document.getElementById('quickNoteInput');
    const compactView = document.getElementById('noteInputCompact');
    const expandedView = document.getElementById('noteInputExpanded');
    const closeBtn = document.getElementById('closeNoteBtn');
    const saveBtn = document.getElementById('saveNoteBtn');
    
    // Hızlı input'a tıklama
    if (quickInput) {
        quickInput.addEventListener('click', function() {
            compactView.style.display = 'none';
            expandedView.style.display = 'block';
            document.getElementById('noteTitle').focus();
        });
    }
    
    // Kapat butonu
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeNoteInput();
        });
    }
    
    // Kaydet butonu
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveNote();
        });
    }
}

// Not input'u kapat
function closeNoteInput() {
    const compactView = document.getElementById('noteInputCompact');
    const expandedView = document.getElementById('noteInputExpanded');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    
    compactView.style.display = 'block';
    expandedView.style.display = 'none';
    noteTitle.value = '';
    noteContent.value = '';
    selectedColor = 'default';
    
    // Renk seçimini sıfırla
    document.querySelectorAll('.note-colors .color-option').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Renk seçimi ayarları
function setupColorPicker() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.dataset.color;
            selectedColor = color;
            
            // Aktif sınıfı güncelle
            const container = this.closest('.note-colors');
            container.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Not kaydet
function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title && !content) {
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser.id}`)) || [];
    
    const newNote = {
        id: Date.now().toString(),
        title: title,
        content: content,
        color: selectedColor,
        status: 'active', // active, archived, deleted
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    notes.push(newNote);
    localStorage.setItem(`notes_${currentUser.id}`, JSON.stringify(notes));
    
    closeNoteInput();
    loadNotes();
}

// Notları yükle
function loadNotes() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser.id}`)) || [];
    const notesGrid = document.getElementById('notesGrid');
    const emptyState = document.getElementById('emptyState');
    
    // Görünüme göre filtrele
    let filteredNotes = notes;
    if (currentView === 'archive') {
        filteredNotes = notes.filter(note => note.status === 'archived');
    } else if (currentView === 'trash') {
        filteredNotes = notes.filter(note => note.status === 'deleted');
    } else {
        filteredNotes = notes.filter(note => note.status === 'active');
    }
    
    // Notları göster
    if (filteredNotes.length === 0) {
        notesGrid.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        notesGrid.innerHTML = filteredNotes.map(note => createNoteCard(note)).join('');
        
        // Not kartlarına event listener ekle
        attachNoteEvents();
    }
}

// Not kartı oluştur
function createNoteCard(note) {
    const date = new Date(note.createdAt).toLocaleDateString('tr-TR');
    const colorClass = note.color !== 'default' ? `color-${note.color}` : '';
    
    let menuButtons = '';
    if (currentView === 'trash') {
        menuButtons = `
            <button class="note-menu-btn" onclick="event.stopPropagation(); restoreNote('${note.id}')" title="Geri Yükle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 14 4 9 9 4"></polyline>
                    <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                </svg>
            </button>
            <button class="note-menu-btn" onclick="event.stopPropagation(); deleteNotePermanently('${note.id}')" title="Kalıcı Sil">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        `;
    } else if (currentView === 'archive') {
        menuButtons = `
            <button class="note-menu-btn" onclick="event.stopPropagation(); unarchiveNote('${note.id}')" title="Arşivden Çıkar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="21 8 21 21 3 21 3 8"></polyline>
                    <rect x="1" y="3" width="22" height="5"></rect>
                    <line x1="10" y1="12" x2="14" y2="12"></line>
                </svg>
            </button>
            <button class="note-menu-btn" onclick="event.stopPropagation(); deleteNote('${note.id}')" title="Sil">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;
    } else {
        menuButtons = `
            <button class="note-menu-btn" onclick="event.stopPropagation(); archiveNote('${note.id}')" title="Arşivle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="21 8 21 21 3 21 3 8"></polyline>
                    <rect x="1" y="3" width="22" height="5"></rect>
                    <line x1="10" y1="12" x2="14" y2="12"></line>
                </svg>
            </button>
            <button class="note-menu-btn" onclick="event.stopPropagation(); deleteNote('${note.id}')" title="Sil">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;
    }
    
    return `
        <div class="note-card ${colorClass}" data-note-id="${note.id}">
            ${note.title ? `<div class="note-title">${note.title}</div>` : ''}
            ${note.content ? `<div class="note-content">${note.content}</div>` : ''}
            <div class="note-footer">
                <span class="note-date">${date}</span>
            </div>
            <div class="note-hover-menu">
                <div class="note-menu-trigger">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                </div>
                <div class="note-menu-options">
                    ${menuButtons}
                </div>
            </div>
        </div>
    `;
}

// Not kartlarına event listener ekle
function attachNoteEvents() {
    const noteCards = document.querySelectorAll('.note-card');
    
    noteCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Menü butonlarına veya menü tetikleyicisine tıklanmışsa kartı açma
            if (e.target.classList.contains('note-menu-btn') || 
                e.target.classList.contains('note-menu-trigger') ||
                e.target.closest('.note-hover-menu')) {
                return;
            }
            
            const noteId = this.dataset.noteId;
            openEditModal(noteId);
        });
    });
}

// Düzenleme modalını aç
function openEditModal(noteId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser.id}`)) || [];
    const note = notes.find(n => n.id === noteId);
    
    if (!note) return;
    
    editingNoteId = noteId;
    selectedColor = note.color;
    
    document.getElementById('editNoteTitle').value = note.title;
    document.getElementById('editNoteContent').value = note.content;
    
    // Renk seçimini ayarla
    document.querySelectorAll('#editModal .color-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.color === note.color) {
            opt.classList.add('active');
        }
    });
    
    document.getElementById('editModal').classList.add('show');
}

// Modal ayarları
function setupModal() {
    const modal = document.getElementById('editModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const saveBtn = document.getElementById('saveEditBtn');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('show');
            editingNoteId = null;
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.classList.remove('show');
            editingNoteId = null;
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            updateNote();
        });
    }
    
    // Modal dışına tıklama
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            editingNoteId = null;
        }
    });
}

// Notu güncelle
function updateNote() {
    if (!editingNoteId) return;
    
    const title = document.getElementById('editNoteTitle').value.trim();
    const content = document.getElementById('editNoteContent').value.trim();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser.id}`)) || [];
    const noteIndex = notes.findIndex(n => n.id === editingNoteId);
    
    if (noteIndex !== -1) {
        notes[noteIndex].title = title;
        notes[noteIndex].content = content;
        notes[noteIndex].color = selectedColor;
        notes[noteIndex].updatedAt = new Date().toISOString();
        
        localStorage.setItem(`notes_${currentUser.id}`, JSON.stringify(notes));
        
        document.getElementById('editModal').classList.remove('show');
        editingNoteId = null;
        loadNotes();
    }
}

// Notu arşivle
window.archiveNote = function(noteId) {
    updateNoteStatus(noteId, 'archived');
};

// Arşivden çıkar
window.unarchiveNote = function(noteId) {
    updateNoteStatus(noteId, 'active');
};

// Notu sil
window.deleteNote = function(noteId) {
    if (confirm('Bu notu çöp kutusuna taşımak istediğinizden emin misiniz?')) {
        updateNoteStatus(noteId, 'deleted');
    }
};

// Notu geri yükle
window.restoreNote = function(noteId) {
    updateNoteStatus(noteId, 'active');
};

// Notu kalıcı sil
window.deleteNotePermanently = function(noteId) {
    if (confirm('Bu notu kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let notes = JSON.parse(localStorage.getItem(`notes_${currentUser.id}`)) || [];
        notes = notes.filter(n => n.id !== noteId);
        localStorage.setItem(`notes_${currentUser.id}`, JSON.stringify(notes));
        loadNotes();
    }
};

// Not durumunu güncelle
function updateNoteStatus(noteId, status) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUser.id}`)) || [];
    const noteIndex = notes.findIndex(n => n.id === noteId);
    
    if (noteIndex !== -1) {
        notes[noteIndex].status = status;
        notes[noteIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(`notes_${currentUser.id}`, JSON.stringify(notes));
        loadNotes();
    }
}

// Hash değişikliğini işle
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    if (hash === 'archive') {
        currentView = 'archive';
    } else if (hash === 'trash') {
        currentView = 'trash';
    } else {
        currentView = 'notes';
    }
    
    updatePageTitle();
    loadNotes();
    
    // Sidebar'da aktif öğeyi güncelle
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === currentView || (currentView === 'notes' && item.getAttribute('href') === 'notes.html')) {
            item.classList.add('active');
        }
    });
}

// Sayfa başlığını güncelle
function updatePageTitle() {
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        if (currentView === 'archive') {
            pageTitle.textContent = 'Arşiv';
        } else if (currentView === 'trash') {
            pageTitle.textContent = 'Çöp Kutusu';
        } else {
            pageTitle.textContent = 'Not Tutma';
        }
    }
}

// Çıkış işlemi
function handleLogout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}