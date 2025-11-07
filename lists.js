// Liste yönetimi işlemleri

let currentView = 'active'; // active, archived, trash
let editingListId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Giriş kontrolü
    checkAuth();
    
    // Kullanıcı bilgilerini göster
    displayUserInfo();
    
    // Dropdown menü kontrolü
    setupDropdown();
    
    // Sidebar kontrolü
    setupSidebar();
    
    // Bottom menu kontrolü
    setupBottomMenu();
    
    // Modal ayarları
    setupModal();
    
    // Tablo işlemleri
    setupTable();
    
    // Listeleri yükle
    loadLists();
    
    // Yeni liste butonu
    const newListBtn = document.getElementById('newListBtn');
    if (newListBtn) {
        newListBtn.addEventListener('click', openNewListModal);
    }
    
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
        window.location.href = 'home.html';
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
}

// Bottom menu ayarları
function setupBottomMenu() {
    const menuToggle = document.getElementById('listsMenuToggle');
    const menuContent = document.getElementById('listsMenuContent');
    const bottomMenu = document.getElementById('listsBottomMenu');
    
    if (menuToggle && menuContent) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            bottomMenu.classList.toggle('open');
        });
        
        document.addEventListener('click', function(e) {
            if (!bottomMenu.contains(e.target)) {
                bottomMenu.classList.remove('open');
            }
        });
        
        // Menü öğelerine tıklama
        const menuItems = document.querySelectorAll('.bottom-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const view = this.dataset.view;
                if (view) {
                    currentView = view;
                    updatePageTitle();
                    loadLists();
                    
                    // Aktif sınıfı güncelle
                    menuItems.forEach(mi => mi.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Menüyü kapat
                    bottomMenu.classList.remove('open');
                }
            });
        });
    }
}

// Modal ayarları
function setupModal() {
    const modal = document.getElementById('listModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelListBtn');
    const saveBtn = document.getElementById('saveListBtn');
    
    if (closeModal) {
        closeModal.addEventListener('click', closeListModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeListModal);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveList);
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeListModal();
        }
    });
}

// Tablo işlemleri
function setupTable() {
    const addRowBtn = document.getElementById('addRowBtn');
    if (addRowBtn) {
        addRowBtn.addEventListener('click', addTableRow);
    }
    
    // Sütun ekleme butonu
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-column-btn')) {
            addTableColumn();
        }
        if (e.target.classList.contains('delete-row-btn')) {
            deleteTableRow(e.target);
        }
    });
}

// Yeni satır ekle
function addTableRow() {
    const tableBody = document.getElementById('tableBody');
    const headerRow = document.getElementById('headerRow');
    const columnCount = headerRow.querySelectorAll('th').length - 2; // # ve action sütunları hariç
    
    const row = document.createElement('tr');
    const rowNumber = tableBody.querySelectorAll('tr').length + 1;
    
    row.innerHTML = `
        <td class="row-number">${rowNumber}</td>
        ${Array(columnCount).fill('<td contenteditable="true"></td>').join('')}
        <td class="action-column">
            <button class="table-btn delete-row-btn" title="Satır Sil">×</button>
        </td>
    `;
    
    tableBody.appendChild(row);
}

// Satır sil
function deleteTableRow(btn) {
    const row = btn.closest('tr');
    const tableBody = document.getElementById('tableBody');
    
    if (tableBody.querySelectorAll('tr').length > 1) {
        row.remove();
        updateRowNumbers();
    }
}

// Satır numaralarını güncelle
function updateRowNumbers() {
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const rowNumber = row.querySelector('.row-number');
        if (rowNumber) {
            rowNumber.textContent = index + 1;
        }
    });
}

// Yeni sütun ekle
function addTableColumn() {
    const headerRow = document.getElementById('headerRow');
    const tableBody = document.getElementById('tableBody');
    const columnCount = headerRow.querySelectorAll('th').length - 1; // action sütunu hariç
    
    // Header'a yeni sütun ekle
    const newHeader = document.createElement('th');
    newHeader.contentEditable = true;
    newHeader.className = 'editable-header';
    newHeader.textContent = `Sütun ${columnCount}`;
    
    const actionColumn = headerRow.querySelector('.action-column');
    headerRow.insertBefore(newHeader, actionColumn);
    
    // Her satıra yeni hücre ekle
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const newCell = document.createElement('td');
        newCell.contentEditable = true;
        const actionCell = row.querySelector('.action-column');
        row.insertBefore(newCell, actionCell);
    });
}

// Yeni liste modalını aç
function openNewListModal() {
    editingListId = null;
    document.getElementById('modalTitle').textContent = 'Yeni Liste Oluştur';
    document.getElementById('listTitle').value = '';
    
    // Tabloyu sıfırla
    resetTable();
    
    document.getElementById('listModal').classList.add('show');
}

// Tabloyu sıfırla
function resetTable() {
    const headerRow = document.getElementById('headerRow');
    const tableBody = document.getElementById('tableBody');
    
    // Header'ı sıfırla
    headerRow.innerHTML = `
        <th class="row-number">#</th>
        <th contenteditable="true" class="editable-header">Sütun 1</th>
        <th contenteditable="true" class="editable-header">Sütun 2</th>
        <th contenteditable="true" class="editable-header">Sütun 3</th>
        <th class="action-column">
            <button class="table-btn add-column-btn" title="Sütun Ekle">+</button>
        </th>
    `;
    
    // Body'yi sıfırla
    tableBody.innerHTML = `
        <tr>
            <td class="row-number">1</td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td class="action-column">
                <button class="table-btn delete-row-btn" title="Satır Sil">×</button>
            </td>
        </tr>
    `;
}

// Liste modalını kapat
function closeListModal() {
    document.getElementById('listModal').classList.remove('show');
    editingListId = null;
}

// Liste kaydet
function saveList() {
    const title = document.getElementById('listTitle').value.trim();
    
    if (!title) {
        alert('Lütfen liste başlığı girin');
        return;
    }
    
    // Tablo verilerini al
    const tableData = getTableData();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const lists = JSON.parse(localStorage.getItem(`lists_${currentUser.id}`)) || [];
    
    if (editingListId) {
        // Mevcut listeyi güncelle
        const listIndex = lists.findIndex(l => l.id === editingListId);
        if (listIndex !== -1) {
            lists[listIndex].title = title;
            lists[listIndex].data = tableData;
            lists[listIndex].updatedAt = new Date().toISOString();
        }
    } else {
        // Yeni liste oluştur
        const newList = {
            id: Date.now().toString(),
            title: title,
            data: tableData,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        lists.push(newList);
    }
    
    localStorage.setItem(`lists_${currentUser.id}`, JSON.stringify(lists));
    
    closeListModal();
    loadLists();
}

// Tablo verilerini al
function getTableData() {
    const headerRow = document.getElementById('headerRow');
    const tableBody = document.getElementById('tableBody');
    
    // Header'ları al
    const headers = [];
    const headerCells = headerRow.querySelectorAll('th.editable-header');
    headerCells.forEach(cell => {
        headers.push(cell.textContent.trim());
    });
    
    // Satırları al
    const rows = [];
    const bodyRows = tableBody.querySelectorAll('tr');
    bodyRows.forEach(row => {
        const cells = row.querySelectorAll('td[contenteditable]');
        const rowData = [];
        cells.forEach(cell => {
            rowData.push(cell.textContent.trim());
        });
        rows.push(rowData);
    });
    
    return { headers, rows };
}

// Listeleri yükle
function loadLists() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const lists = JSON.parse(localStorage.getItem(`lists_${currentUser.id}`)) || [];
    const listsGrid = document.getElementById('listsGrid');
    const emptyState = document.getElementById('emptyState');
    
    // Görünüme göre filtrele
    let filteredLists = lists;
    if (currentView === 'archived') {
        filteredLists = lists.filter(list => list.status === 'archived');
    } else if (currentView === 'trash') {
        filteredLists = lists.filter(list => list.status === 'deleted');
    } else {
        filteredLists = lists.filter(list => list.status === 'active');
    }
    
    // Listeleri göster
    if (filteredLists.length === 0) {
        listsGrid.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        listsGrid.innerHTML = filteredLists.map(list => createListCard(list)).join('');
        
        // Liste kartlarına event listener ekle
        attachListEvents();
    }
}

// Liste kartı oluştur
function createListCard(list) {
    const date = new Date(list.createdAt).toLocaleDateString('tr-TR');
    const rowCount = list.data.rows.length;
    const columnCount = list.data.headers.length;
    
    return `
        <div class="list-card" data-list-id="${list.id}">
            <div class="list-card-header">
                <h3 class="list-title">${list.title}</h3>
                <div class="list-menu">
                    <button class="list-menu-btn" onclick="event.stopPropagation(); toggleListMenu('${list.id}')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                    </button>
                    <div class="list-menu-dropdown" id="menu-${list.id}">
                        ${getListMenuButtons(list)}
                    </div>
                </div>
            </div>
            <div class="list-info">
                <span>📊 ${rowCount} satır × ${columnCount} sütun</span>
                <span class="list-date">${date}</span>
            </div>
        </div>
    `;
}

// Liste menü butonlarını al
function getListMenuButtons(list) {
    if (currentView === 'trash') {
        return `
            <button onclick="event.stopPropagation(); restoreList('${list.id}')" class="list-menu-item">
                <span>↩️</span> Geri Yükle
            </button>
            <button onclick="event.stopPropagation(); deleteListPermanently('${list.id}')" class="list-menu-item danger">
                <span>🗑️</span> Kalıcı Sil
            </button>
        `;
    } else if (currentView === 'archived') {
        return `
            <button onclick="event.stopPropagation(); unarchiveList('${list.id}')" class="list-menu-item">
                <span>📤</span> Arşivden Çıkar
            </button>
            <button onclick="event.stopPropagation(); deleteList('${list.id}')" class="list-menu-item danger">
                <span>🗑️</span> Sil
            </button>
        `;
    } else {
        return `
            <button onclick="event.stopPropagation(); editList('${list.id}')" class="list-menu-item">
                <span>✏️</span> Düzenle
            </button>
            <button onclick="event.stopPropagation(); archiveList('${list.id}')" class="list-menu-item">
                <span>🗄️</span> Arşivle
            </button>
            <button onclick="event.stopPropagation(); deleteList('${list.id}')" class="list-menu-item danger">
                <span>🗑️</span> Sil
            </button>
        `;
    }
}

// Liste kartlarına event listener ekle
function attachListEvents() {
    const listCards = document.querySelectorAll('.list-card');
    
    listCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.list-menu')) {
                const listId = this.dataset.listId;
                viewList(listId);
            }
        });
    });
}

// Liste menüsünü aç/kapat
window.toggleListMenu = function(listId) {
    const menu = document.getElementById(`menu-${listId}`);
    const allMenus = document.querySelectorAll('.list-menu-dropdown');
    
    allMenus.forEach(m => {
        if (m !== menu) {
            m.classList.remove('show');
        }
    });
    
    menu.classList.toggle('show');
};

// Listeyi görüntüle
function viewList(listId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const lists = JSON.parse(localStorage.getItem(`lists_${currentUser.id}`)) || [];
    const list = lists.find(l => l.id === listId);
    
    if (!list) return;
    
    editingListId = listId;
    document.getElementById('modalTitle').textContent = list.title;
    document.getElementById('listTitle').value = list.title;
    
    // Tabloyu doldur
    loadTableData(list.data);
    
    document.getElementById('listModal').classList.add('show');
}

// Tablo verilerini yükle
function loadTableData(data) {
    const headerRow = document.getElementById('headerRow');
    const tableBody = document.getElementById('tableBody');
    
    // Header'ı oluştur
    let headerHTML = '<th class="row-number">#</th>';
    data.headers.forEach(header => {
        headerHTML += `<th contenteditable="true" class="editable-header">${header}</th>`;
    });
    headerHTML += '<th class="action-column"><button class="table-btn add-column-btn" title="Sütun Ekle">+</button></th>';
    headerRow.innerHTML = headerHTML;
    
    // Body'yi oluştur
    let bodyHTML = '';
    data.rows.forEach((row, index) => {
        bodyHTML += `<tr><td class="row-number">${index + 1}</td>`;
        row.forEach(cell => {
            bodyHTML += `<td contenteditable="true">${cell}</td>`;
        });
        bodyHTML += '<td class="action-column"><button class="table-btn delete-row-btn" title="Satır Sil">×</button></td></tr>';
    });
    tableBody.innerHTML = bodyHTML;
}

// Listeyi düzenle
window.editList = function(listId) {
    viewList(listId);
};

// Listeyi arşivle
window.archiveList = function(listId) {
    updateListStatus(listId, 'archived');
};

// Arşivden çıkar
window.unarchiveList = function(listId) {
    updateListStatus(listId, 'active');
};

// Listeyi sil
window.deleteList = function(listId) {
    if (confirm('Bu listeyi çöp kutusuna taşımak istediğinizden emin misiniz?')) {
        updateListStatus(listId, 'deleted');
    }
};

// Listeyi geri yükle
window.restoreList = function(listId) {
    updateListStatus(listId, 'active');
};

// Listeyi kalıcı sil
window.deleteListPermanently = function(listId) {
    if (confirm('Bu listeyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let lists = JSON.parse(localStorage.getItem(`lists_${currentUser.id}`)) || [];
        lists = lists.filter(l => l.id !== listId);
        localStorage.setItem(`lists_${currentUser.id}`, JSON.stringify(lists));
        loadLists();
    }
};

// Liste durumunu güncelle
function updateListStatus(listId, status) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const lists = JSON.parse(localStorage.getItem(`lists_${currentUser.id}`)) || [];
    const listIndex = lists.findIndex(l => l.id === listId);
    
    if (listIndex !== -1) {
        lists[listIndex].status = status;
        lists[listIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(`lists_${currentUser.id}`, JSON.stringify(lists));
        loadLists();
    }
}

// Sayfa başlığını güncelle
function updatePageTitle() {
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        if (currentView === 'archived') {
            pageTitle.textContent = 'Arşiv - Listeleme';
        } else if (currentView === 'trash') {
            pageTitle.textContent = 'Çöp Kutusu - Listeleme';
        } else {
            pageTitle.textContent = 'Listeleme';
        }
    }
}

// Çıkış işlemi
function handleLogout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'home.html';
    }
}

// Menüleri kapat
document.addEventListener('click', function() {
    const allMenus = document.querySelectorAll('.list-menu-dropdown');
    allMenus.forEach(menu => menu.classList.remove('show'));
});
