// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    if (tg.initDataUnsafe?.user) {
        document.getElementById('username').innerText = tg.initDataUnsafe.user.first_name;
    }
}

// Эмуляция базы данных в LocalStorage (в будущем это будет идти из ТГ-бота через Бэкенд)
let balance = parseInt(localStorage.getItem('med_balance')) || 12500;
let rtp = parseInt(localStorage.getItem('casino_rtp')) || 60; // RTP по умолчанию 60%

// Функции для теста в консоли (имитируют действия админки ТГ-бота)
window.setOfflineRTP = function(newRTP) {
    rtp = newRTP;
    localStorage.setItem('casino_rtp', rtp);
    console.log(`[Бот Симуляция]: RTP изменен на ${rtp}%`);
};

window.addOfflineBalance = function(amount) {
    balance += amount;
    updateUI();
    console.log(`[Бот Симуляция]: Ютуберу начислено ${amount} монет`);
};

function updateUI() {
    document.getElementById('balance-display').innerText = balance;
    localStorage.setItem('med_balance', balance);
}
updateUI();

// Логика игры с учетом RTP
document.getElementById('spin-btn').addEventListener('click', () => {
    if (balance < 500) {
        document.getElementById('win-message').innerText = "Недостаточно монет!";
        return;
    }

    balance -= 500;
    updateUI();

    const items = ['💎', '🎰', '🦝', '🍋', '🍒'];
    const roll = Math.random() * 100;
    
    // Математика подкрутки: проверяем, проходит ли ставка лимит RTP
    let isWin = roll < rtp; 

    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');
    const msg = document.getElementById('win-message');

    if (isWin) {
        const winItem = items[Math.floor(Math.random() * items.length)];
        slot1.innerText = winItem;
        slot2.innerText = winItem;
        slot3.innerText = winItem;

        balance += 1500; // x3 окуп ставки
        msg.innerText = "Победа! +1500 🪙";
        msg.style.color = "#00ff87";
    } else {
        let i1 = items[Math.floor(Math.random() * items.length)];
        let i2 = items[Math.floor(Math.random() * items.length)];
        if (i1 === i2) i2 = items[(items.indexOf(i2) + 1) % items.length];
        let i3 = items[Math.floor(Math.random() * items.length)];

        slot1.innerText = i1;
        slot2.innerText = i2;
        slot3.innerText = i3;

        msg.innerText = "Мимо! Повезет в следующий раз.";
        msg.style.color = "#ff4a4a";
    }

    updateUI();
});
