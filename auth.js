document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Проверка в localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('Вход выполнен успешно!');
                window.location.href = 'index.html';
            } else {
                alert('Неверный email или пароль');
            }
        });
    }

    // Обработка формы регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Валидация
            if (password !== confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }
            
            if (password.length < 6) {
                alert('Пароль должен содержать минимум 6 символов');
                return;
            }
            
            // Проверка на существующего пользователя
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.email === email)) {
                alert('Пользователь с таким email уже существует');
                return;
            }
            
            // Регистрация
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            alert('Регистрация прошла успешно!');
            window.location.href = 'index.html';
        });
    }

    // Проверка авторизации на главной странице
    if (window.location.pathname.endsWith('index.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const authButtons = document.querySelector('.auth-buttons');
        
        if (currentUser) {
            authButtons.innerHTML = `
                <span>Добро пожаловать, ${currentUser.name}</span>
                <button id="logoutBtn" class="btn-auth"><i class="fas fa-sign-out-alt"></i> Выйти</button>
            `;
            
            document.getElementById('logoutBtn').addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        }
    }
});