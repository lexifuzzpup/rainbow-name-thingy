function RGBtoHEX(r, g, b) {
    return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0")
}
function HEXtoRGB(hex) {
    const str = hex.replace("#", "");

    const r = parseInt(str.slice(0, 2), 16);
    const g = parseInt(str.slice(2, 4), 16);
    const b = parseInt(str.slice(4, 6), 16);

    return [ r, g, b ];
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
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return [ h, s, v ];
}

function rainbowify(username, from, to, linear) {
    let outputName = document.createElement("span");
 
    for(let i = 0; i < username.length; i++) {
        const t = (i / (username.length - 1));

        const h = (to[0] - from[0]) * t + from[0];
        const s = (to[1] - from[1]) * t + from[1];
        const v = (to[2] - from[2]) * t + from[2];
        const hex = linear ? RGBtoHEX(Math.floor(h), Math.floor(s), Math.floor(v)) : RGBtoHEX(...HSVtoRGB(h, s, v));

        const section = document.createElement("span");
        section.style.fontSize = "0px";
        const char = document.createElement("span");
        section.textContent = "&" + hex;
        char.textContent = username[i];
        char.style.color = hex;

        outputName.append(section, char);
    }
    return outputName;
}

const nameInput = document.querySelector("#name-input");
const makeBtn = document.querySelector("#make");
const nameOutput = document.querySelector("#output");
const color1 = document.querySelector("#color1");
const color2 = document.querySelector("#color2");
const hueLinear = document.querySelector("#hue-linear");
const copyButton = document.querySelector("#copy");

load();

nameInput.addEventListener("input", save);
color1.addEventListener("input", save);
color2.addEventListener("input", save);
hueLinear.addEventListener("click", save);

function save() {
    localStorage["name-input"] = nameInput.value;
    localStorage["color1"] = color1.value;
    localStorage["color2"] = color2.value;
    localStorage["hue-linear"] = hueLinear.checked ? "yes" : "no";
}
function load() {
    if("name-input" in localStorage) nameInput.value = localStorage["name-input"];
    if("color1" in localStorage) color1.value = localStorage["color1"];
    if("color2" in localStorage) color2.value = localStorage["color2"];
    if("hue-linear" in localStorage) hueLinear.checked = localStorage["hue-linear"] == "yes";
}

makeBtn.addEventListener("click", () => {
    const linear = hueLinear.checked;
    const color1rgb = HEXtoRGB(color1.value);
    const color2rgb = HEXtoRGB(color2.value);

    nameOutput.replaceChildren(rainbowify(
        nameInput.value,
        linear ? color1rgb : RGBtoHSV(...color1rgb),
        linear ? color2rgb : RGBtoHSV(...color2rgb),
        linear
    ));
    copyButton.hidden = false;
})

copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(nameOutput.textContent);
})