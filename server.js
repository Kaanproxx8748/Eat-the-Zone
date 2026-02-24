const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// YENİ EKLENEN KISIM: Oyun Motorunu Dahil Ediyoruz
const Game = require('./server/game');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// YENİ EKLENEN KISIM: Oyunu Başlatıyoruz
const game = new Game(io);

io.on('connection', (socket) => {
    console.log('Yeni bir oyuncu bağlandı: ' + socket.id);

    // Oyuncu ismini girip "Oyuna Başla" dediğinde
    socket.on('joinGame', (username) => {
        game.addPlayer(socket.id, username);
    });

    // İstemciden fare açısı geldiğinde yönü güncelle
    socket.on('input', (data) => {
        game.handleInput(socket.id, data.angle);
    });

    // Oyuncu ayrıldığında veya sekme kapattığında sil
    socket.on('disconnect', () => {
        console.log('Oyuncu ayrıldı: ' + socket.id);
        game.removePlayer(socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor.`);
});