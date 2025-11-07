// Kullanıcı kayıt ve giriş işlemleri

document.addEventListener('DOMContentLoaded', function() {
    // Giriş formu
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Kayıt formu
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Kayıt işlemi
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Hata mesajlarını temizle
    hideMessage('errorMessage');
    hideMessage('successMessage');
    
    // Validasyon
    if (password.length < 6) {
        showMessage('errorMessage', 'Şifre en az 6 karakter olmalıdır.');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('errorMessage', 'Şifreler eşleşmiyor.');
        return;
    }
    
    // Kullanıcıları localStorage'dan al
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // E-posta kontrolü
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        showMessage('errorMessage', 'Bu e-posta adresi zaten kayıtlı.');
        return;
    }
    
    // Yeni kullanıcı oluştur
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('successMessage', 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
    
    // 2 saniye sonra giriş sayfasına yönlendir
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Giriş işlemi
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Hata mesajını temizle
    hideMessage('errorMessage');
    
    // Kullanıcıları localStorage'dan al
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Kullanıcı kontrolü
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showMessage('errorMessage', 'E-posta veya şifre hatalı.');
        return;
    }
    
    // Giriş yapan kullanıcıyı kaydet
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Dashboard'a yönlendir
    window.location.href = 'dashboard.html';
}

// Mesaj göster
function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('show');
    }
}

// Mesaj gizle
function hideMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
        element.classList.remove('show');
    }
}
