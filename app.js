document.addEventListener('DOMContentLoaded', () => {
    // Интеграция с Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
        if (tg.initDataUnsafe?.user) {
            const user = tg.initDataUnsafe.user;
            // Ставим имя пользователя на экран Профиля
            const profileName = document.getElementById('prof-username');
            if (profileName) profileName.innerText = user.first_name;
        }
    }

    // Логика таб-бара на 5 вкладок
    const navItems = document.querySelectorAll('.nav-item');
    const tabs = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            tabs.forEach(tab => tab.add('hidden')); // Используем утилитарный класс с hidded

            // Для надежности скрываем все ручным перебором классов
            tabs.forEach(tab => tab.classList.add('hidden'));

            item.classList.add('active');
            const targetTab = item.getAttribute('data-tab');
            document.getElementById(targetTab).classList.remove('hidden');
        });
    });
});
