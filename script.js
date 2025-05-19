// Хранилище данных
const auth = {
    users: JSON.parse(localStorage.getItem('users')) || [],
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,

    init() {
        this.setupEventListeners();
        this.updateUI();
    },

    setupEventListeners() {
        // Кнопки открытия модалки
        document.getElementById('loginBtn')?.addEventListener('click', () => this.openModal('login'));
        document.getElementById('registerBtn')?.addEventListener('click', () => this.openModal('register'));
        
        // Закрытие модалки
        document.querySelector('.close-modal')?.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('authModal')) {
                this.closeModal();
            }
        });

        // Переключение вкладок
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Формы
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm')?.addEventListener('submit', (e) => this.handleRegister(e));
        
        // Выход
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());
    },

    openModal(tab = 'login') {
        document.getElementById('authModal').style.display = 'flex';
        this.switchTab(tab);
    },

    closeModal() {
        document.getElementById('authModal').style.display = 'none';
    },

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tab);
        });
    },

    handleLogin(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateUI();
            this.closeModal();
            alert(`Добро пожаловать, ${user.name}!`);
        } else {
            alert('Неверный email или пароль');
        }
    },

    handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        if (data.password !== data.confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }
        
        if (this.users.some(u => u.email === data.email)) {
            alert('Пользователь с таким email уже существует');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            password: data.password,
            avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.currentUser = newUser;
        
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.updateUI();
        this.closeModal();
        alert('Регистрация прошла успешно!');
    },

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        alert('Вы вышли из системы');
    },

    updateUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const userPanel = document.getElementById('userPanel');
        
        if (this.currentUser) {
            // Показываем панель пользователя
            if (userPanel) {
                userPanel.style.display = 'flex';
                document.getElementById('userName').textContent = this.currentUser.name;
                document.getElementById('userAvatar').src = this.currentUser.avatar;
            }
            
            // Скрываем кнопки входа
            if (authButtons) authButtons.style.display = 'none';
        } else {
            // Показываем кнопки входа
            if (authButtons) authButtons.style.display = 'flex';
            
            // Скрываем панель пользователя
            if (userPanel) userPanel.style.display = 'none';
        }
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
});