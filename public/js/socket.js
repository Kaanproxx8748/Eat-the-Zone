// Sunucuya bağlan
const socket = io();

// Sunucudan gelen oyun verisini (yemler, diğer oyuncular vs.) burada tutacağız
let gameState = {
    players: {},
    foods: []
};

// Kendi yılanımızın ID'si (hangi yılanın kamerayla takip edileceğini bilmek için)
let myId = null;

socket.on('connect', () => {
    myId = socket.id;
    console.log("Sunucuya bağlanıldı, ID: ", myId);
});

// Sunucudan saniyede yaklaşık 60 kere "oyun durumu" gelecek
socket.on('gameState', (state) => {
    gameState = state;
});

// Sunucu "oyun bitti" mesajı gönderdiğinde çalışır (örn: başka yılana çarparsan)
socket.on('gameOver', () => {
    document.getElementById('start-screen').classList.remove('hidden');
    alert("Oyun Bitti! Bir yere çarptın veya hata oluştu.");
    // Oyunu durdur
    isPlaying = false; 
});