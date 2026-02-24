class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.x = Math.floor(Math.random() * 2000);
        this.y = Math.floor(Math.random() * 2000);
        this.angle = 0;
        this.speed = 4;
        this.score = 0;
        
        // SLITHER.IO FİZİKLERİ:
        this.length = 40; // Başlangıçtaki boğum sayısı (Yılanın uzunluğu)
        this.spacing = 4; // Boğumlar arası boşluk (Kafanın kaç adım gerisinden gelsin)
        this.history = []; // Kafanın geçtiği yerlerin geçmişi
        this.body = [];    // Çizilecek ve hesaplanacak vücut boğumları
        
        // Yılanın ilk başta bir nokta gibi durmaması için geçmişi dolduruyoruz
        for(let i = 0; i < this.length * this.spacing; i++) {
            this.history.push({ x: this.x, y: this.y });
        }

        const colors = ['#e74c3c', '#8e44ad', '#3498db', '#e67e22', '#2ecc71'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        // Kafayı hareket ettir
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Kafanın yeni konumunu geçmişin en başına (0. indekse) ekle
        this.history.unshift({ x: this.x, y: this.y });

        // Yılanın boyundan daha eski geçmiş kayıtlarını sil (Sunucuyu yormamak için)
        if (this.history.length > this.length * this.spacing) {
            this.history.length = this.length * this.spacing;
        }

        // Vücut boğumlarını oluştur (Geçmişteki belirli aralıklı noktaları alarak)
        this.body = [];
        for(let i = 0; i < this.length; i++) {
            let index = i * this.spacing;
            if(this.history[index]) {
                this.body.push(this.history[index]);
            }
        }
    }
}

module.exports = Player;
