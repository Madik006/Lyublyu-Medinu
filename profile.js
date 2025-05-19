// Проверка авторизации при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'index.html';
        return;
    }
    
    // Заполняем данные профиля
    fillProfileData(currentUser);
    
    // Настройка обработчиков
    setupEventHandlers(currentUser);
});

function fillProfileData(user) {
    document.getElementById('profileName').value = user.name || '';
    document.getElementById('profileEmail').value = user.email || '';
    
    const avatarImg = document.getElementById('currentAvatar');
    if (user.avatar) {
        avatarImg.src = user.avatar;
    }
}

function setupEventHandlers(user) {
    // Смена аватара
    document.getElementById('changeAvatarBtn').addEventListener('click', () => {
        document.getElementById('avatarInput').click();
    });
    
    document.getElementById('avatarInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                user.avatar = event.target.result;
                updateUserData(user);
                document.getElementById('currentAvatar').src = user.avatar;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Сохранение профиля
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        user.name = document.getElementById('profileName').value;
        user.email = document.getElementById('profileEmail').value;
        
        updateUserData(user);
        alert('Данные успешно сохранены!');
    });
}

function updateUserData(user) {
    // Обновляем текущего пользователя
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Обновляем в списке пользователей
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u => u.id === user.id ? user : u);
    localStorage.setItem('users', JSON.stringify(users));
}