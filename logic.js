const fillFieldContent = (fieldId, value) => {
    document.getElementById(fieldId).innerText = value;
};

const toggleAmPmForRow = (time, hour) => {
    const suffixForAmPm = `-icon-${time}`;
    if (hour >= 12) {
        document.getElementById(`am${suffixForAmPm}`).classList.add('active');
        document.getElementById(`pm${suffixForAmPm}`).classList.remove('active');
    } else {
        document.getElementById(`am${suffixForAmPm}`).classList.remove('active');
        document.getElementById(`pm${suffixForAmPm}`).classList.add('active');
    }
};

const fillRow = (time, month, day, year, hour, minute) => {
    const suffixForFields = `-value-${time}`;
    fillFieldContent(`month${suffixForFields}`, month);
    fillFieldContent(`day${suffixForFields}`, `${day}`.padStart(2, '0'));
    fillFieldContent(`year${suffixForFields}`, year);
    fillFieldContent(`hour${suffixForFields}`, `${hour}`.padStart(2, '0'));
    fillFieldContent(`minute${suffixForFields}`, `${minute}`.padStart(2, '0'));
    toggleAmPmForRow(time, hour);
};


const storeCurrentDestinationInLocalStorageAsLastDeparted = dest => localStorage.setItem('destinationTimeUnix', dest.getTime() / 1000);

const getLastDepFromLocalStorage = () => localStorage.getItem('destinationTimeUnix');

const fillDestinationTime = () => {
    const dest = new Date(Date.now());

    storeCurrentDestinationInLocalStorageAsLastDeparted(dest);

    fillRow('destination', dest.toLocaleString('en-US', {month: 'short'}), dest.getDay(), dest.getFullYear(), dest.getHours(), dest.getMinutes());
}

const fillPresentTime = () => {
    const now = new Date(Date.now());
    fillRow('present', now.toLocaleString('en-US', {month: 'short'}), now.getDate(), now.getFullYear(), now.getHours(), now.getMinutes());
};

const fillLastDepartedTime = () => {
    const lastDepFromStorage = getLastDepFromLocalStorage();
    let lastDep = !lastDepFromStorage ? new Date(0) : new Date(lastDepFromStorage * 1000);
    fillRow('departure', lastDep.toLocaleString('en-US', {month: 'short'}), lastDep.getDate(), lastDep.getFullYear(), lastDep.getHours(), lastDep.getMinutes());
};

const blinkSeconds = () => {
    document.querySelectorAll('.blinker').forEach(b => {
        if (b.classList.contains('active')) b.classList.remove('active');
        else b.classList.add('active');
    });
};

const updateLiveValues = () => {
    fillPresentTime();
    blinkSeconds();
};

const testInputAgainstRegex = (regex, event) => {
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
};

const validateInputCharacter = event => {
    if (event.target.id.includes('month')) return testInputAgainstRegex(/[a-zA-Z]/, event);
    return testInputAgainstRegex(/[0-9]/, event);
};

const storeOriginalInnerTextOnFocus = event => {
    const target = event.target;
    tempEditStorage.set(target.id, target.innerText);
};

function restorePreviousValue(target) {
    target.innerText = tempEditStorage.get(target.id);
}

const validateOrResetInputOnBlur = event => {
    const target = event.target;
    if (target.id.includes('month') && !monthValidationRegex.test(target.innerText)
        || target.id.includes('day') && !dayValidationRegex.test(target.innerText)
        || target.id.includes('year') && !yearValidationRegex.test(target.innerText)
        || target.id.includes('hour') && !hourValidationRegex.test(target.innerText)
        || target.id.includes('minute') && !minuteValidationRegex.test(target.innerText)) {
        restorePreviousValue(target);
    }
};

const getValueFromDom = (id) => {
    return document.querySelector('#' + id).innerText;
}

const getMonthFromString = mon => new Date(Date.parse(mon + " 1, 2012")).getMonth();

const storeDestinationTimeFromDom = () => {
    const destTime = new Date();
    const destSuffix = '-value-destination';

    destTime.setMonth(getMonthFromString(getValueFromDom('month' + destSuffix)));
    destTime.setDate(getValueFromDom('day' + destSuffix));
    destTime.setFullYear(getValueFromDom('year' + destSuffix));
    destTime.setHours(getValueFromDom('hour' + destSuffix));
    destTime.setMinutes(getValueFromDom('minute' + destSuffix));

    localStorage.setItem('destinationTimeUnix', destTime.getTime() / 1000);
};

const removeGlowAnimation = () => {
    document.querySelectorAll('.glow-animation').forEach(e => e.classList.remove('glow-animation'))
}

const setDestinationTimeByUserInput = () => {
    const allValueFields = document.querySelectorAll('.value');
    [...allValueFields].forEach(en => {
        en.addEventListener('click', event => {
            removeGlowAnimation();
            storeOriginalInnerTextOnFocus(event)
        });
        en.addEventListener('keypress', event => validateInputCharacter(event))
        en.addEventListener('blur', event => {
            validateOrResetInputOnBlur(event);
            storeDestinationTimeFromDom();
        })
    });
};

const setClocks = () => {
    //TODO fix me setting last departed from local storage depends on reverse order init
    fillLastDepartedTime();
    fillDestinationTime();
    window.setInterval(updateLiveValues, 1000);

    //imperformant as hell, but more convenient than having a separate gui for input
    setDestinationTimeByUserInput();
};

window.addEventListener('DOMContentLoaded', () => {
    setClocks();
})

const tempEditStorage = new Map();
const monthValidationRegex = /^[a-zA-Z]{3}$/;
const dayValidationRegex = /^(3[01]|[12][0-9]|[1-9])$/;
const yearValidationRegex = /^\d{4}$/;
const hourValidationRegex = /^(2[0-4]|1[0-9]|[1-9])$/;
const minuteValidationRegex = /^([0-5]?[0-9]|60)$/;

window.addEventListener("keypress", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    setClocks();

    explosionAnimation();
});

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
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
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