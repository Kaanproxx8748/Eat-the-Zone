const Player = require('./player');
const { isPointInPolygon, linesIntersect } = require('./math');

class Game {
    constructor(io) {
        this.io = io;
        this.players = {};
        this.foods = [];
        this.arenaSize = 2000;
        
        // Başlangıçta 200 tane yem oluştur
        for(let i = 0; i < 200; i++) this.spawnFood();

        // Saniyede 60 kere oyun durumunu güncelle
        setInterval(() => this.update(), 1000 / 60);
    }

    spawnFood() {
        this.foods.push({
            id: Math.random().toString(36).substr(2, 9),
            x: Math.floor(Math.random() * this.arenaSize),
            y: Math.floor(Math.random() * this.arenaSize)
        });
    }

    addPlayer(socketId, name) {
        this.players[socketId] = new Player(socketId, name);
    }

    removePlayer(socketId) {
        delete this.players[socketId];
    }

    handleInput(socketId, angle) {
        if(this.players[socketId]) {
            this.players[socketId].angle = angle;
        }
    }

    update() {
        // Bütün oyuncuları hareket ettir ve alan kapatmalarını kontrol et
        for (let id in this.players) {
            let p = this.players[id];
            p.update();
            this.checkEnclosure(p); // Alan kapattı mı?
        }
        
        // Yem sayısı azaldıkça yenilerini ekle
        while(this.foods.length < 200) {
            this.spawnFood();
        }

        // Bütün oyunculara yeni koordinatları gönder
        this.io.emit('gameState', {
            players: this.players,
            foods: this.foods
        });
    }

    checkEnclosure(player) {
        const trail = player.trail;
        if (trail.length < 5) return; // Alan oluşması için yeterli çizgi yok

        // Şimdiki konumumuz ile bir önceki noktamız arasındaki çizgi (Kafamız)
        const currentP1 = trail[trail.length - 1];
        const currentP2 = { x: player.x, y: player.y };

        // Kafamız, eski kuyruğumuzdaki herhangi bir çizgiyi kesiyor mu?
        // Son 3 çizgiyi kontrol etmiyoruz çünkü kafamız onlara zaten çok yakın
        for (let i = 0; i < trail.length - 3; i++) {
            const p1 = trail[i];
            const p2 = trail[i + 1];

            // Kesişme bulduk! (Kapalı alan oluştu)
            if (linesIntersect(p1, p2, currentP1, currentP2)) {
                
                // Kesiştiği noktadan şu anki yere kadar olan noktaları al = KAPALI ALAN (Poligon)
                const polygon = trail.slice(i);
                polygon.push(currentP2); 

                // Yemleri kontrol et, hangileri içerde kaldı?
                let eatenCount = 0;
                this.foods = this.foods.filter(food => {
                    if (isPointInPolygon(food, polygon)) {
                        eatenCount++; // Yem poligonun içindeyse sayacı artır
                        return false; // Listeden (haritadan) sil
                    }
                    return true; // Dışındaysa haritada bırak
                });

                if (eatenCount > 0) {
                    player.score += eatenCount;
                    console.log(`${player.name}, ${eatenCount} yem yedi! Toplam Puan: ${player.score}`);
                    // (İsteğe bağlı) Yedikçe player.speed veya kuyruk uzunluğu artırılabilir
                }

                // Alan kapattıktan sonra düğüm oluşmaması için oyuncunun kuyruğunu temizle
                player.trail = [{ x: player.x, y: player.y }];
                break; // Aynı karede birden fazla kesişme aramaya gerek yok
            }
        }
    }
}

module.exports = Game;