// Profil ayarları işlemleri

document.addEventListener('DOMContentLoaded', function() {
    // Giriş kontrolü
    checkAuth();
    
    // Kullanıcı bilgilerini göster
    displayUserInfo();
    
    // Dropdown menü kontrolü
    setupDropdown();
    
    // Sidebar kontrolü
    setupSidebar();
    
    // Form event listeners
    setupForms();
    
    // Avatar renk seçimi
    setupAvatarColors();
    
    // Hash kontrolü (şifre bölümüne direkt gitmek için)
    if (window.location.hash) {
        const element = document.querySelector(window.location.hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
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
        window.location.href = 'index.html';
        return;
    }
}

// Kullanıcı bilgilerini göster
function displayUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        const userNameElement = document.getElementById('userName');
        const newNameInput = document.getElementById('newName');
        const userAvatar = document.getElementById('userAvatar');
        const profileAvatar = document.getElementById('profileAvatar');
        
        if (userNameElement) {
            userNameElement.textContent = currentUser.name;
        }
        
        if (newNameInput) {
            newNameInput.value = currentUser.name;
        }
        
        const avatarColor = currentUser.avatarColor || '8b0000';
        
        if (userAvatar) {
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=${avatarColor}&color=fff&size=40`;
            userAvatar.src = avatarUrl;
        }
        
        if (profileAvatar) {
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=${avatarColor}&color=fff&size=120`;
            profileAvatar.src = avatarUrl;
        }
        
        // Aktif rengi işaretle
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns.forEach(btn => {
            if (btn.dataset.color === avatarColor) {
                btn.classList.add('active');
            }
        });
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

// Form ayarları
function setupForms() {
    // Kullanıcı adı değiştirme
    const nameForm = document.getElementById('nameForm');
    if (nameForm) {
        nameForm.addEventListener('submit', handleNameChange);
    }
    
    // Şifre değiştirme
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

// Avatar renk seçimi
function setupAvatarColors() {
    const colorBtns = document.querySelectorAll('.color-btn');
    
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.dataset.color;
            
            // Aktif sınıfı güncelle
            colorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Kullanıcı bilgilerini güncelle
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.avatarColor = color;
            
            // LocalStorage'ı güncelle
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Tüm kullanıcılar listesini güncelle
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].avatarColor = color;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Avatar'ı güncelle
            displayUserInfo();
        });
    });
}

// Kullanıcı adı değiştirme
function handleNameChange(e) {
    e.preventDefault();
    
    const newName = document.getElementById('newName').value.trim();
    const messageDiv = document.getElementById('nameMessage');
    
    if (!newName) {
        showMessage(messageDiv, 'Lütfen geçerli bir isim girin.', 'error');
        return;
    }
    
    // Kullanıcı bilgilerini güncelle
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.name = newName;
    
    // LocalStorage'ı güncelle
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Tüm kullanıcılar listesini güncelle
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].name = newName;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    showMessage(messageDiv, 'Kullanıcı adınız başarıyla güncellendi!', 'success');
    
    // Sayfayı yenile
    setTimeout(() => {
        displayUserInfo();
    }, 1000);
}

// Şifre değiştirme
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    const messageDiv = document.getElementById('passwordMessage');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Mevcut şifre kontrolü
    if (currentPassword !== currentUser.password) {
        showMessage(messageDiv, 'Mevcut şifreniz yanlış.', 'error');
        return;
    }
    
    // Yeni şifre validasyonu
    if (newPassword.length < 6) {
        showMessage(messageDiv, 'Yeni şifre en az 6 karakter olmalıdır.', 'error');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showMessage(messageDiv, 'Yeni şifreler eşleşmiyor.', 'error');
        return;
    }
    
    // Şifreyi güncelle
    currentUser.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Tüm kullanıcılar listesini güncelle
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    showMessage(messageDiv, 'Şifreniz başarıyla güncellendi!', 'success');
    
    // Formu temizle
    document.getElementById('passwordForm').reset();
}

// Çıkış işlemi
function handleLogout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Mesaj göster
function showMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`;
        
        // 5 saniye sonra mesajı gizle
        setTimeout(() => {
            element.className = 'message';
            element.textContent = '';
        }, 5000);
    }
}
