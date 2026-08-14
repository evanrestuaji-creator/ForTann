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
