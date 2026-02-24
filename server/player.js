class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        // Oyuncuyu rastgele bir konumda başlat (Harita 2000x2000 piksel)
        this.x = Math.floor(Math.random() * 2000);
        this.y = Math.floor(Math.random() * 2000);
        this.angle = 0; // Baktığı yön
        this.speed = 4; // Hareket hızı
        this.trail = [{ x: this.x, y: this.y }]; // Kuyruğu oluşturan noktalar
        this.score = 0;
        
        // Rastgele bir renk ata
        const colors = ['#e74c3c', '#8e44ad', '#3498db', '#e67e22', '#2ecc71'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        // Açısına (angle) göre ileri doğru hareket et
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Kuyruğa yeni nokta ekle (Eğer son noktadan yeterince uzaklaştıysa)
        // Optimizasyon: Her karede nokta eklemek sunucuyu yorar, 15 pikselde bir ekliyoruz
        const lastPoint = this.trail[this.trail.length - 1];
        const dist = Math.hypot(this.x - lastPoint.x, this.y - lastPoint.y);
        
        if (dist > 15) {
            this.trail.push({ x: this.x, y: this.y });
        }
        
        // Kuyruk çok uzamasın diye eski noktaları sil (İsteğe bağlı uzatabilirsin)
        if (this.trail.length > 150) {
            this.trail.shift(); // En baştakini (en eskisini) sil
        }
    }
}

module.exports = Player;