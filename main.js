function RGBtoHEX(r, g, b) {
    return "&#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0")
}
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}

function rainbowify(username) {
    let outputName = ""
 
    for(let i = 0; i < username.length; i++) {
        outputName += RGBtoHEX(...HSVtoRGB(i / username.length, 1, 1)) + username[i]
    }
    return outputName;
}

const nameInput = document.querySelector("#name-input");
const makeBtn = document.querySelector("#make");
const nameOutput = document.querySelector("#output");

makeBtn.addEventListener("click", () => {
    nameOutput.textContent = rainbowify(nameInput.value);
})