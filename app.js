let currentPriceSingle = 14; 
let openCount = 1; // Дефолтное количество открытий (1, 2 или 3)
let isSpinning = false;

// Пул предметов кейса с весами редкости (для симуляции RTP)
const caseItems = [
    { icon: '👜', rarity: 'rarity-epic' },
    { icon: '💪', rarity: 'rarity-rare' },
    { icon: '💎', rarity: 'rarity-epic' },
    { icon: '🚀', rarity: 'rarity-rare' },
    { icon: '🍒', rarity: 'rarity-common' }
];

// Открытие кейса
window.openCaseMenu = function(title, price) {
    currentPriceSingle = price;
    document.getElementById('inner-case-title').innerText = title;
    updatePriceTag();
    
    document.getElementById('cases-list-view').classList.add('hidden');
    document.getElementById('case-inner-view').classList.remove('hidden');
    
    generateTracksPlaceholder(); // Генерируем начальный вид лент
};

window.closeCaseMenu = function() {
    if (isSpinning) return;
    document.getElementById('case-inner-view').classList.add('hidden');
    document.getElementById('cases-list-view').classList.remove('hidden');
};

// Переключение кол-ва открытий (x1, x2, x3)
window.setCount = function(count, element) {
    if (isSpinning) return;
    openCount = count;
    
    const buttons = element.parentElement.querySelectorAll('.mult-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    updatePriceTag();
    generateTracksPlaceholder();
};

function updatePriceTag() {
    document.getElementById('case-price-tag').innerText = `💎 ${currentPriceSingle * openCount}`;
}

// Генерация стартового состояния лент рулетки
function generateTracksPlaceholder() {
    const container = document.getElementById('roulette-container-box');
    container.innerHTML = ''; // Очищаем

    for (let i = 0; i < openCount; i++) {
        const track = document.createElement('div');
        track.className = 'roulette-track';
        track.id = `track-${i}`;
        
        // Заполняем ленту дефолтными иконками, чтобы она не была пустой
        for (let j = 0; j < 5; j++) {
            const item = document.createElement('div');
            item.className = `roulette-item ${caseItems[j % caseItems.length].rarity}`;
            item.innerText = caseItems[j % caseItems.length].icon;
            track.appendChild(item);
        }
        container.appendChild(track);
    }
}

// КНОПКА: БЫСТРОЕ ОТКРЫТИЕ (С ЛОГИКОЙ КАЗИНО И ПЛАВНЫМ ТОРМОЖЕНИЕМ)
document.getElementById('fast-open-btn').addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    document.getElementById('fast-open-btn').disabled = true;

    const totalItemsInTrack = 35; // Длина ленты для долгого кручения
    const itemWidth = 88; // 80px ширина + 8px отступы (4px с каждой стороны)
    const winIndex = 28;  // Индекс выигрышного предмета на ленте

    // Генерируем новые заполненные ленты для анимации
    for (let t = 0; t < openCount; t++) {
        const track = document.getElementById(`track-${t}`);
        track.innerHTML = ''; // Сброс
        track.style.transition = 'none';
        track.style.transform = 'translateX(0px)';
        track.classList.remove('spinning', 'blurring');

        // Подготавливаем массив предметов для этой ленты
        let randomItemsList = [];
        for (let i = 0; i < totalItemsInTrack; i++) {
            // Случайный предмет из пула кейса
            const randItem = caseItems[Math.floor(Math.random() * caseItems.length)];
            randomItemsList.push(randItem);
        }

        // ОПРЕДЕЛЯЕМ ПОБЕДИТЕЛЯ (Сюда потом легко привязать подкрутку/RTP из бота)
        const winner = caseItems[Math.floor(Math.random() * caseItems.length)];
        randomItemsList[winIndex] = winner; // Ставим победителя строго на 28 позицию

        // Рендерим ленту в HTML
        randomItemsList.forEach(data => {
            const el = document.createElement('div');
            el.className = `roulette-item ${data.rarity}`;
            el.innerText = data.icon;
            track.appendChild(el);
        });

        // Форсируем перерисовку браузера перед запуском анимации
        track.offsetHeight; 

        // Высчитываем точную координату остановки по центру маркера
        const wrapperWidth = document.querySelector('.roulette-wrapper').offsetWidth;
        const centerOffset = wrapperWidth / 2 - itemWidth / 2;
        const finalTranslate = -(winIndex * itemWidth) + centerOffset;

        // Включаем анимацию
        track.classList.add('spinning', 'blurring');
        track.style.transform = `translateX(${finalTranslate}px)`;
    }

    // По окончании анимации (3.5 секунды) убираем размытие и отдаем призы
    setTimeout(() => {
        for (let t = 0; t < openCount; t++) {
            const track = document.getElementById(`track-${t}`);
            track.classList.remove('blurring');
        }
        isSpinning = false;
        document.getElementById('fast-open-btn').disabled = false;
    }, 3500);
});

// Навигация нижнего меню (Таб-бар)
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const tabs = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (isSpinning) return; // Запрещаем уходить во время прокрутки
            navItems.forEach(nav => nav.classList.remove('active'));
            tabs.forEach(tab => tab.classList.add('hidden'));

            item.classList.add('active');
            const targetTab = item.getAttribute('data-tab');
            document.getElementById(targetTab).classList.remove('hidden');
            
            if (targetTab !== 'tab-cases') closeCaseMenu();
        });
    });
});
