// İki çizginin (p0-p1 ve p2-p3) birbiriyle kesişip kesişmediğini hesaplar
function linesIntersect(p0, p1, p2, p3) {
    let s1_x = p1.x - p0.x;
    let s1_y = p1.y - p0.y;
    let s2_x = p3.x - p2.x;
    let s2_y = p3.y - p2.y;

    let s, t;
    let denom = (-s2_x * s1_y + s1_x * s2_y);
    if (denom === 0) return false; // Çizgiler paralel

    s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / denom;
    t = ( s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / denom;

    // Eğer kesişme noktası her iki çizgi segmentinin üzerindeyse
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return true; 
    }
    return false;
}

// Bir noktanın (yemin), verilen poligonun (kapalı kuyruğun) içinde olup olmadığını hesaplar
function isPointInPolygon(point, polygon) {
    let x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].x, yi = polygon[i].y;
        let xj = polygon[j].x, yj = polygon[j].y;
        
        // Ray-casting (Işın dökümü) mantığı
        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

module.exports = { isPointInPolygon, linesIntersect };