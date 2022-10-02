/*EXPLOSION WITH PARTICLES*/
//stolen from here : https://codepen.io/deanwagman/pen/EjLBdQ
let canvas, ctx, particles, centerX, centerY;

window.addEventListener('DOMContentLoaded', () => {
    canvas = document.querySelector("#explosion-canvas");
    ctx = canvas.getContext('2d');

    canvas.width = document.documentElement.clientWidth;
    canvas.height = window.innerHeight;

    particles = [];
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
});


const config = {
    particleNumber: 800,
    maxParticleSize: 10,
    maxSpeed: 40,
    colorVariation: 50,
    colorPalette : {
        bg: {r: 12, g: 9, b: 29},
        matter: [
            {r: 36, g: 18, b: 42},
            {r: 78, g: 36, b: 42},
            {r: 252, g: 178, b: 96},
            {r: 253, g: 238, b: 152}
        ]
    }
};

const colorVariation = (color, returnString) => {
    let r, g, b, a;
    r = Math.round(Math.random() * config.colorVariation - config.colorVariation / 2 + color.r);
    g = Math.round(Math.random() * config.colorVariation - config.colorVariation / 2 + color.g);
    b = Math.round(Math.random() * config.colorVariation - config.colorVariation / 2 + color.b);
    a = Math.random() + .5;
    return returnString ? "rgba(" + r + "," + g + "," + b + "," + a + ")" : {r, g, b, a};
};

class Particle {
    constructor(x, y) {
        this.x = x || Math.round(Math.random() * canvas.width);
        this.y = y || Math.round(Math.random() * canvas.height);
        this.r = Math.ceil(Math.random() * config.maxParticleSize);
        this.c = colorVariation(config.colorPalette.matter[Math.floor(Math.random() * config.colorPalette.matter.length)], true);
        this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), .7);
        this.d = Math.round(Math.random() * 360);
    }
}

const updateParticleModel = p => {
    const a = 180 - (p.d + 90);
    p.d > 0 && p.d < 180 ? p.x += p.s * Math.sin(p.d) / Math.sin(p.s) : p.x -= p.s * Math.sin(p.d) / Math.sin(p.s);
    p.d > 90 && p.d < 270 ? p.y += p.s * Math.sin(a) / Math.sin(p.s) : p.y -= p.s * Math.sin(a) / Math.sin(p.s);
    return p;
};

const drawParticle = (x, y, r, c) => {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();
};

const cleanUpArray = () => particles = particles.filter(p => p.x > -100 && p.y > -100);


const initParticles = (numParticles, x, y) => {
    for (let i = 0; i < numParticles; i++) particles.push(new Particle(x, y));
    particles.forEach(p => drawParticle(p.x, p.y, p.r, p.c));
};

window.requestAnimFrame = function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        (callback => window.setTimeout(callback, 1000 / 60))
}();

const drawBg = (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const frame = () => {
    drawBg(ctx);
    particles.map(p => updateParticleModel(p));
    particles.forEach(p => drawParticle(p.x, p.y, p.r, p.c));
    window.requestAnimFrame(frame);
};

const explosionAnimation = () => {
    frame();
    cleanUpArray();
    initParticles(config.particleNumber, centerX, centerY);
};