let canvas, ctx;
let isActive = false, isSpawning = false;
let timeLast = performance.now();
let elementText, elementRoot, elementConfetti;
let confetti = [];

function cipher(str) {
    let strNew = "";

    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        let charNew = str[i];

        if (char >= 65 && char <= 90)  { charNew = String.fromCharCode(25 - char + 65 + 65); }
        if (char >= 97 && char <= 122) { charNew = String.fromCharCode(25 - char + 97 + 97); }
        if (char >= 48 && char <= 57)  { charNew = String.fromCharCode(9  - char + 48 + 48); }
        
        strNew += charNew;
    }

    return strNew;
}



function onLoad(event) {
    elementText = document.getElementById("text");
    elementRoot = document.documentElement;
    elementConfetti = document.getElementById("confetti");
    elementBackground = document.getElementById("background");

    const params = new URLSearchParams(window.location.search);

    let paramText = params.get("a");
    if (paramText) { 
        paramText = cipher(decodeURIComponent(paramText));
        elementText.dataset.text = paramText;
        document.getElementById("settings-text").value = paramText;
    }

    let paramImageConfetto = params.get("b");
    if (paramImageConfetto) {
        paramImageConfetto = cipher(decodeURIComponent(paramImageConfetto));
        elementRoot.style.setProperty("--confetto-image", `url("${paramImageConfetto}")`); 
        document.getElementById("settings-confetto-image").value = paramImageConfetto;
    }

    let paramImageBackground = params.get("c");
    if (paramImageBackground) {
        paramImageBackground = cipher(decodeURIComponent(paramImageBackground));
        console.log(paramImageBackground);
        elementRoot.style.setProperty("--background-image", `url("${paramImageBackground}")`); 
        document.getElementById("settings-background-image").value = paramImageBackground;
    }

    requestAnimationFrame(onUpdate);
}

function onUpdate() {
    let timeNow = performance.now();
    let timeDelta = (timeNow - timeLast) * 0.03;
    timeLast = timeNow;
    
    if (isActive) {
        if (isSpawning) {
            for (var i = 0; i < timeDelta; i++) {
                confetti.push(new Confetto(confetti.length));
                if (confetti.length > 100) {
                    setTimeout(onEnd, 1000);
                    isSpawning = false;
                    break;
                }
            }
        }
    }

    requestAnimationFrame(onUpdate);
}

function onClick() {
    elementText.innerText = elementText.dataset.text;
    elementBackground.classList.add("background-animation");
    if (!isActive) {
        isActive = true;
        isSpawning = true;
    }
}

function onEnd() {
    elementBackground.classList.remove("background-animation");
    for (const confetto of confetti) {
        confetto.delete();
    }
    confetti = [];

    isActive = false;
    isSpawning = false;
}

class Confetto {
    constructor(index) {
        this.index = index;
        this.div = document.createElement("div");
        this.div.style.setProperty("--confetto-x", `${Math.random()*100}vw`);
        this.div.style.setProperty("--confetto-rotate-1", "0deg");
        this.div.style.setProperty("--confetto-rotate-2", `${Math.random()-0.5}turn`);
        this.div.style.setProperty("--confetto-hue", `${(Math.random()-0.5)*0.2}turn`);
        document.body.appendChild(this.div);
        this.div.classList.add("confetto");
        
        setTimeout(this.destroy, 1000);
    }

    delete() {
        this.div.remove();
        delete this;
    }
}

window.addEventListener("load", onLoad);

function generate() {
    let url = new URL(window.location);
    url.searchParams.set("a", encodeURIComponent(cipher(document.getElementById("settings-text").value)));
    url.searchParams.set("b", encodeURIComponent(cipher(document.getElementById("settings-confetto-image").value)));
    url.searchParams.set("c", encodeURIComponent(cipher(document.getElementById("settings-background-image").value)));

    window.location = url;
    onLoad();
}

function settingsOpen() {
    let elementSettings = document.getElementById("settings-container");
    let value = (elementSettings.style.getPropertyValue("top") == "0px") ? "-100vh" : "0px";
    elementSettings.style.setProperty("top", value);
}

function share() {
    navigator.clipboard.writeText(window.location);
}