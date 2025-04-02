const h = 300;
const w = 200;
const numPoints = 20;

function createPoints() {
    let points = [];
    for (let i=0; i<numPoints; i++) {
        let point = {};
        point.x = Math.floor(w*Math.random()+1);
        point.y = Math.floor(h*Math.random()+1);
        points.push(point);
    }
    return points;
}

function d(p,q) {
    let dx2 = Math.pow(p.x-q.x,2);
    let dy2 = Math.pow(p.y-q.y,2);
    return Math.sqrt(dx2+dy2);
}