const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let isPlaying = false;
let mouseX = 0;
let mouseY = 0;
let cameraX = 0;
let cameraY = 0;

// Ekran boyutu değiştiğinde Canvas'ı tam ekrana ayarla
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // İlk açılışta boyutu ayarla

// Oyuncu fareyi hareket ettirdiğinde x,y koordinatlarını kaydet
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function initGame() {
    if (!isPlaying) {
        isPlaying = true;
        gameLoop(); // Çizim döngüsünü başlat
    }
}

// Oyunun ana döngüsü (Saniyede 60 kare hızında çalışır)
function gameLoop() {
    if (!isPlaying) return;
    
    updateInput(); // Farenin baktığı yönü hesapla ve sunucuya gönder
    draw();        // Ekranı çiz
    
    requestAnimationFrame(gameLoop);
}

function updateInput() {
    if (myId && gameState.players[myId]) {
        // Ekranın tam ortası bizim yılanımız olduğu için farenin merkeze olan açısını hesaplıyoruz
        const dx = mouseX - (canvas.width / 2);
        const dy = mouseY - (canvas.height / 2);
        const angle = Math.atan2(dy, dx);
        
        // Bu açıyı (radyan cinsinden) sunucuya gönder
        socket.emit('input', { angle: angle });
    }
}

function draw() {
    // 1. Ekranı temizle (Arka plan rengi)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!myId || !gameState.players[myId]) return;

    // Kamerayı kendi yılanımızın üzerine ortala
    const me = gameState.players[myId];
    cameraX = me.x - (canvas.width / 2);
    cameraY = me.y - (canvas.height / 2);

    ctx.save();
    ctx.translate(-cameraX, -cameraY); // Dünyayı kameranın tersine kaydır

    // 2. Arka plandaki ızgarayı (grid) çiz (hareket hissi vermek için)
    drawGrid();

    // 3. Yemleri çiz
    gameState.foods.forEach(food => {
        ctx.fillStyle = '#f1c40f'; // Altın sarısı yemler
        ctx.beginPath();
        ctx.arc(food.x, food.y, 6, 0, Math.PI * 2);
        ctx.fill();
    });

    // 4. Bütün oyuncuları ve kuyruklarını çiz
    for (let id in gameState.players) {
        const player = gameState.players[id];
        const isMe = (id === myId);
        drawPlayer(player, isMe);
    }

    ctx.restore();
}

function drawGrid() {
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    const gridSize = 50; // Karelerin büyüklüğü
    
    // Ekranda sadece görünen kısmı çizmek için optimizasyon
    const startX = Math.floor(cameraX / gridSize) * gridSize;
    const startY = Math.floor(cameraY / gridSize) * gridSize;
    const endX = startX + canvas.width + gridSize;
    const endY = startY + canvas.height + gridSize;

    ctx.beginPath();
    for (let x = startX; x < endX; x += gridSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
    }
    for (let y = startY; y < endY; y += gridSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
    }
    ctx.stroke();
}

function drawPlayer(player, isMe) {
    // 1. Vücut Boğumlarını Çiz (Sondan başa doğru çiziyoruz ki kafa kuyruğun üstünde kalsın)
    if (player.body && player.body.length > 0) {
        for (let i = player.body.length - 1; i >= 0; i--) {
            const segment = player.body[i];
            
            // Boğumun içi
            ctx.fillStyle = player.color || '#e74c3c';
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, 11, 0, Math.PI * 2);
            ctx.fill();

            // Boğumun dış kenarlığı (Slither.io tarzı görünüm için)
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // 2. Yılanın Kafasını Çiz (Kafa boğumlardan biraz daha büyük)
    ctx.fillStyle = isMe ? '#27ae60' : (player.color || '#c0392b'); 
    ctx.beginPath();
    ctx.arc(player.x, player.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. Gözleri Çiz (Tatlı bir yılan görünümü)
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(player.x - 5, player.y - 5, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(player.x + 5, player.y - 5, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath(); ctx.arc(player.x - 5, player.y - 5, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(player.x + 5, player.y - 5, 2, 0, Math.PI*2); ctx.fill();

    // 4. Oyuncu İsmini Çiz
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    // İsmi yılanın biraz daha üstünde göster
    ctx.fillText(player.name, player.x, player.y - 25);
}
