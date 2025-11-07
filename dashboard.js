// Dashboard işlemleri

document.addEventListener('DOMContentLoaded', function() {
    // Giriş kontrolü
    checkAuth();
    
    // Kullanıcı bilgilerini göster
    displayUserInfo();
    
    // Dropdown menü kontrolü
    setupDropdown();
    
    // Sidebar kontrolü
    setupSidebar();
    
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
        // Giriş yapılmamışsa ana sayfaya yönlendir
        window.location.href = 'home.html';
        return;
    }
}

// Kullanıcı bilgilerini göster
function displayUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        const userNameElement = document.getElementById('userName');
        const welcomeNameElement = document.getElementById('welcomeName');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userNameElement) {
            userNameElement.textContent = currentUser.name;
        }
        
        if (welcomeNameElement) {
            welcomeNameElement.textContent = currentUser.name;
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
        
        // Dışarı tıklandığında menüyü kapat
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
        // Menü butonuna tıklama
        menuToggle.addEventListener('click', function() {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('show');
        });
        
        // Overlay'e tıklama
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
        });
        
        // Kapatma butonuna tıklama
        if (closeSidebar) {
            closeSidebar.addEventListener('click', function() {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('show');
            });
        }
    }
}

// Çıkış işlemi
function handleLogout() {
    // Onay sor
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        // Mevcut kullanıcıyı temizle
        localStorage.removeItem('currentUser');
        
        // Ana sayfaya yönlendir
        window.location.href = 'home.html';
    }
}
