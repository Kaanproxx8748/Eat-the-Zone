const startScreen = document.getElementById('start-screen');
const playBtn = document.getElementById('play-btn');
const usernameInput = document.getElementById('username-input');

playBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim() || 'İsimsiz Yılan';
    
    // Menüyü gizle
    startScreen.classList.add('hidden');
    
    // Sunucuya "Ben oyuna giriyorum, ismim bu" mesajını gönder
    socket.emit('joinGame', username);
    
    // game.js içindeki oyun çizim döngüsünü başlat
    initGame();
});

// Enter tuşuyla da oyuna girilebilmesi için
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        playBtn.click();
    }
});