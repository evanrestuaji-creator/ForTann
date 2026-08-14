/* ========================= */
/* ELEMENT */
/* ========================= */

const pages = document.querySelectorAll(".page");

const startPage =
document.getElementById("page-start");

const loadingPage =
document.getElementById("page-loading");

const welcomePage =
document.getElementById("page-welcome");

const startBtn =
document.getElementById("startBtn");

const enterBtn =
document.getElementById("enterBtn");

const loadingMusic =
document.getElementById("loadingMusic");

const mainMusic =
document.getElementById("mainMusic");

const musicBtn =
document.getElementById("musicBtn");

const loader =
document.querySelector(".loader-inner");

const percent =
document.getElementById("loadingPercent");

/* ========================= */
/* PAGE SYSTEM */
/* ========================= */

function showPage(id){

pages.forEach(page=>{
page.classList.remove("active");
});

document
.getElementById(id)
.classList.add("active");

}

/* ========================= */
/* MUSIC */
/* ========================= */

let musicPlaying = false;

musicBtn.addEventListener("click",()=>{

if(musicPlaying){

loadingMusic.pause();
mainMusic.pause();

musicPlaying = false;

musicBtn.innerHTML = "🔇";

}else{

if(
showingPage() === "page-loading"
){
loadingMusic.play();
}else{
mainMusic.play();
}

musicPlaying = true;

musicBtn.innerHTML = "🎵";

}

});

function showingPage(){

const active =
document.querySelector(".page.active");

return active.id;

}

/* ========================= */
/* START */
/* ========================= */

startBtn.addEventListener("click",()=>{

showPage("page-loading");

loadingMusic.currentTime = 0;

loadingMusic.play();

musicPlaying = true;

startLoading();

});

/* ========================= */
/* LOADING */
/* ========================= */

function startLoading(){

let current = 0;

const duration = 10000;

const interval = 100;

const step =
100 / (duration / interval);

loader.style.width = "0%";

percent.innerHTML = "0%";

const timer =
setInterval(()=>{

current += step;

if(current > 100){
current = 100;
}

loader.style.width =
current + "%";

percent.innerHTML =
Math.floor(current) + "%";

if(current >= 100){

clearInterval(timer);

setTimeout(()=>{

loadingMusic.pause();

showPage("page-welcome");

},500);

}

},interval);

}

/* ========================= */
/* ENTER */
/* ========================= */

enterBtn.addEventListener("click",()=>{

showPage("page-password");

});

/* ========================= */
/* PASSWORD GAME */
/* ========================= */

const passwordPage =
document.getElementById("page-password");

const randomLetters =
document.getElementById("randomLetters");

const targetBoxes =
document.querySelectorAll(".target-box");

const PASSWORD = "FORTAN";

let currentIndex = 0;

function generateLetters(){

randomLetters.innerHTML = "";

const chars = [
"F","O","R","T",
"A","A",
"N","N",
"X","Y",
"Z","Q",
"M","P",
"K"
];

chars.sort(() => Math.random() - 0.5);

chars.forEach(char=>{

const btn =
document.createElement("button");

btn.className =
"letter-btn";

btn.innerHTML =
char;

btn.addEventListener(
"click",
()=>selectLetter(char,btn)
);

randomLetters.appendChild(btn);

});

}

function selectLetter(letter,btn){

const needed =
PASSWORD[currentIndex];

if(letter === needed){

targetBoxes[currentIndex]
.style.background =
"#32d36a";

currentIndex++;

btn.disabled = true;

btn.style.opacity = ".4";

if(
currentIndex >=
PASSWORD.length
){

setTimeout(()=>{

showPage("page-dice");

},1200);

}

}else{

randomLetters.classList.add(
"shuffle"
);

setTimeout(()=>{

randomLetters.classList.remove(
"shuffle"
);

},400);

generateLetters();

}

}

/* ========================= */
/* RESET PASSWORD */
/* ========================= */

function resetPasswordGame(){

currentIndex = 0;

targetBoxes.forEach(box=>{

box.style.background =
"#ff3c3c";

});

generateLetters();

}

/* ========================= */
/* INIT */
/* ========================= */

generateLetters();

/* ========================= */
/* DICE GAME */
/* ========================= */

const dice1 =
document.getElementById("dice1");

const dice2 =
document.getElementById("dice2");

const holdDiceBtn =
document.getElementById("holdDiceBtn");

const luckText =
document.getElementById("luckText");

let holdStart = 0;

let rolling = false;

let diceAttempt = 0;

let rollInterval;

/* ========================= */
/* START HOLD */
/* ========================= */

holdDiceBtn.addEventListener(
"mousedown",
startRoll
);

holdDiceBtn.addEventListener(
"touchstart",
startRoll
);

function startRoll(e){

e.preventDefault();

if(rolling) return;

rolling = true;

holdStart = Date.now();

dice1.classList.add(
"rolling"
);

dice2.classList.add(
"rolling"
);

rollInterval =
setInterval(()=>{

dice1.innerHTML =
randomDice();

dice2.innerHTML =
randomDice();

},100);

}

/* ========================= */
/* STOP HOLD */
/* ========================= */

holdDiceBtn.addEventListener(
"mouseup",
stopRoll
);

holdDiceBtn.addEventListener(
"mouseleave",
stopRoll
);

holdDiceBtn.addEventListener(
"touchend",
stopRoll
);

function stopRoll(){

if(!rolling) return;

rolling = false;

clearInterval(
rollInterval
);

dice1.classList.remove(
"rolling"
);

dice2.classList.remove(
"rolling"
);

diceAttempt++;

let value1;
let value2;

/* ========================= */
/* AUTO 6+6 ATTEMPT 5 */
/* ========================= */

if(diceAttempt >= 5){

value1 = 6;
value2 = 6;

}else{

value1 =
randomDice();

value2 =
randomDice();

}

dice1.innerHTML =
value1;

dice2.innerHTML =
value2;

/* ========================= */
/* WIN */
/* ========================= */

if(
value1 === 6 &&
value2 === 6
){

showLucky();

}

}

/* ========================= */
/* RANDOM */
/* ========================= */

function randomDice(){

return Math.floor(
Math.random()*6
)+1;

}

/* ========================= */
/* LUCKY */
/* ========================= */

function showLucky(){

luckText.style.display =
"block";

setTimeout(()=>{

luckText.style.display =
"none";

showPage(
"page-flower"
);

startFlowerScene();

},2500);

}

/* ========================= */
/* RESET */
/* ========================= */

function resetDiceGame(){

diceAttempt = 0;

dice1.innerHTML = "1";

dice2.innerHTML = "1";

luckText.style.display =
"none";

  }
