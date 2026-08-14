/* =========================================================
   FOR MY PARTNER
   SCRIPT.JS
========================================================= */


/* =========================================================
   PAGE SYSTEM
========================================================= */

const pages = {
    loading: document.getElementById("page-loading"),
    welcome: document.getElementById("page-welcome"),
    password: document.getElementById("page-password"),
    dice: document.getElementById("page-dice"),
    flower: document.getElementById("page-flower"),
    cover: document.getElementById("page-cover"),
    gallery: document.getElementById("page-gallery"),
    videos: document.getElementById("page-videos"),
    ending: document.getElementById("page-ending")
};

function showPage(page) {

    Object.values(pages).forEach(p => {
        if (p) p.classList.remove("active");
    });

    if (pages[page]) {
        pages[page].classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}


/* =========================================================
   AUDIO
========================================================= */

const loadingMusic =
    document.getElementById("loadingMusic");

const mainMusic =
    document.getElementById("mainMusic");

const musicBtn =
    document.getElementById("musicBtn");

let musicPlaying = false;

function playMusic(audio) {

    if (!audio) return;

    audio.loop = true;

    audio.play()
        .then(() => {
            musicPlaying = true;
            updateMusicButton();
        })
        .catch(() => {});
}

function pauseMusic(audio) {

    if (!audio) return;

    audio.pause();

    musicPlaying = false;

    updateMusicButton();
}

function updateMusicButton() {

    if (!musicBtn) return;

    musicBtn.textContent =
        musicPlaying ? "🔊" : "🎵";
}

if (musicBtn) {

    musicBtn.addEventListener("click", () => {

        const currentAudio =
            !mainMusic.paused
                ? mainMusic
                : loadingMusic;

        if (currentAudio.paused) {
            playMusic(currentAudio);
        } else {
            pauseMusic(currentAudio);
        }

    });

}


/* =========================================================
   START
========================================================= */

/*
   Karena halaman pertama sudah dihapus,
   kita langsung mulai dari loading.
*/

window.addEventListener("load", () => {

    startFlowerLoading();

});


/* =========================================================
   LOADING
========================================================= */

function startFlowerLoading() {

    showPage("loading");

    let percent = 0;

    const percentElement =
        document.getElementById("loadingPercent");

    const timer =
        setInterval(() => {

            percent += Math.floor(
                Math.random() * 4
            ) + 1;

            if (percent >= 100) {

                percent = 100;

                clearInterval(timer);

                setTimeout(() => {

                    showPage("welcome");

                    playMusic(mainMusic);

                }, 600);
            }

            if (percentElement) {
                percentElement.textContent =
                    percent + "%";
            }

        }, 55);

}


/* =========================================================
   WELCOME
========================================================= */

const enterBtn =
    document.getElementById("enterBtn");

if (enterBtn) {

    enterBtn.addEventListener("click", () => {

        showPage("password");

        startMemoryGame();

    });

}


/* =========================================================
   MEMORY PASSWORD GAME
========================================================= */

/*
   Password:
   F O R T A N

   Huruf akan muncul acak.
   Semua huruf target akan berkedip
   bersamaan sekitar 2 detik.

   Setelah itu pemain harus mengingat
   urutannya dan menekan huruf yang benar.
*/


const passwordCode =
    ["F", "O", "R", "T", "A", "N"];

let memoryIndex = 0;

let memoryAttempts = 0;

let memoryBusy = false;

let memoryLetters = [];


/* RANDOM ALPHABET */

const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


function randomLetter() {

    return alphabet[
        Math.floor(
            Math.random() *
            alphabet.length
        )
    ];

}


/* SHUFFLE */

function shuffle(array) {

    const result =
        [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
}


/* CREATE GRID */

function createMemoryGrid() {

    const grid =
        document.getElementById(
            "randomLetters"
        );

    if (!grid) return;

    grid.innerHTML = "";

    /*
       12 kotak.
       Password punya 6 huruf.

       Supaya huruf yang sama tetap
       bisa diklik dua kali, kita sengaja
       membuat duplikat huruf target.
    */

    let letters = [
        ...passwordCode,
        ...passwordCode
    ];

    /*
       Tambahkan huruf random
       sampai 16 kotak.
    */

    while (letters.length < 16) {

        letters.push(
            randomLetter()
        );

    }

    letters =
        shuffle(letters);

    memoryLetters = [];

    letters.forEach(letter => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "memory-letter";

        button.textContent =
            letter;

        button.dataset.letter =
            letter;

        button.addEventListener(
            "click",
            () => memoryClick(button)
        );

        grid.appendChild(button);

        memoryLetters.push(button);

    });

}


/* SHOW CLUE */

function showMemoryClue() {

    memoryBusy = true;

    memoryIndex = 0;

    const sequence =
        [...passwordCode];

    /*
       Cari SATU tombol untuk masing-masing
       huruf password.

       Jadi F O R T A N semuanya
       berkedip BERSAMA.
    */

    const selectedButtons = [];

    sequence.forEach(letter => {

        const candidates =
            memoryLetters.filter(
                button =>
                    button.dataset.letter ===
                    letter
            );

        if (candidates.length > 0) {

            /*
               Ambil random supaya posisinya
               tidak selalu sama.
            */

            const button =
                candidates[
                    Math.floor(
                        Math.random() *
                        candidates.length
                    )
                ];

            selectedButtons.push(button);

        }

    });


    selectedButtons.forEach(button => {

        button.classList.add(
            "memory-clue"
        );

    });


    /*
       Clue menyala selama 2 detik.
    */

    setTimeout(() => {

        selectedButtons.forEach(button => {

            button.classList.remove(
                "memory-clue"
            );

        });

        memoryBusy = false;

    }, 2000);

}


/* START MEMORY */

function startMemoryGame() {

    memoryIndex = 0;

    memoryAttempts = 0;

    memoryBusy = false;

    createMemoryGrid();

    /*
       Kasih waktu sebentar sebelum clue.
    */

    setTimeout(() => {

        showMemoryClue();

    }, 500);

}


/* PLAYER CLICK */

function memoryClick(button) {

    if (memoryBusy) return;

    if (button.classList.contains(
        "memory-selected"
    )) {
        return;
    }

    const clicked =
        button.dataset.letter;

    const correct =
        passwordCode[memoryIndex];


    /* BENAR */

    if (clicked === correct) {

        button.classList.add(
            "memory-selected"
        );

        memoryIndex++;

        /*
           Semua huruf password sudah benar.
        */

        if (
            memoryIndex >=
            passwordCode.length
        ) {

            memoryBusy = true;

            memoryLetters.forEach(
                button => {

                    button.classList.add(
                        "memory-success"
                    );

                }
            );

            setTimeout(() => {

                showPage("dice");

                startDiceGame();

            }, 1000);

        }

        return;
    }


    /* SALAH */

    button.classList.add(
        "memory-error"
    );

    memoryAttempts++;

    setTimeout(() => {

        button.classList.remove(
            "memory-error"
        );

    }, 400);


    /*
       Maksimal 3 kesalahan.
    */

    if (memoryAttempts >= 3) {

        memoryBusy = true;

        setTimeout(() => {

            createMemoryGrid();

            memoryAttempts = 0;

            /*
               Huruf diacak ulang sehingga
               posisinya tidak sama.
            */

            const grid =
                document.getElementById(
                    "randomLetters"
                );

            if (grid) {

                grid.classList.add(
                    "memory-shuffle"
                );

                setTimeout(() => {

                    grid.classList.remove(
                        "memory-shuffle"
                    );

                }, 500);

            }

            setTimeout(() => {

                showMemoryClue();

            }, 400);

        }, 450);

    }

}


/* =========================================================
   DICE GAME
========================================================= */


/*
   Dadu hanya berjalan selama tombol ditekan.

   Semakin lama tombol ditahan:
   - semakin cepat roll
   - semakin sering vibrate
   - semakin banyak animasi

   Setelah dilepas:
   - dadu berhenti
   - hasil terakhir disimpan

   Untuk membuka halaman:
   harus mendapatkan 6 + 6.

   Mekanisme dibuat maksimal 5 kali.
   Percobaan ke-5 otomatis menghasilkan
   6 + 6.
*/


let diceRolling = false;

let diceRollTimer = null;

let diceStartTime = 0;

let diceAttempts = 0;

let dice1Value = 1;

let dice2Value = 1;

const holdDiceBtn =
    document.getElementById(
        "holdDiceBtn"
    );


/* =========================================================
   DICE PIPS
========================================================= */

function pipPositions(number) {

    const positions = {

        1: ["center"],

        2: [
            "top-left",
            "bottom-right"
        ],

        3: [
            "top-left",
            "center",
            "bottom-right"
        ],

        4: [
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right"
        ],

        5: [
            "top-left",
            "top-right",
            "center",
            "bottom-left",
            "bottom-right"
        ],

        6: [
            "top-left",
            "top-right",
            "middle-left",
            "middle-right",
            "bottom-left",
            "bottom-right"
        ]

    };

    return positions[number] || [];
}


/* CREATE FACE */

function createDiceFace(number) {

    const face =
        document.createElement("div");

    face.className =
        "dice-face";

    pipPositions(number)
        .forEach(position => {

            const pip =
                document.createElement("span");

            pip.className =
                "pip " + position;

            face.appendChild(pip);

        });

    return face;
}


/* CREATE 3D DICE */

function buildDice(element, value) {

    if (!element) return;

    element.innerHTML = "";

    const faces = [
        ["face-front", value],
        ["face-back", oppositeDice(value)],
        ["face-right", value],
        ["face-left", value],
        ["face-top", value],
        ["face-bottom", value]
    ];

    faces.forEach(([className, number]) => {

        const face =
            createDiceFace(number);

        face.classList.add(
            className
        );

        element.appendChild(face);

    });

}


/*
   Sisi belakang sederhana.
*/

function oppositeDice(value) {

    const opposite = {
        1: 6,
        2: 5,
        3: 4,
        4: 3,
        5: 2,
        6: 1
    };

    return opposite[value];

}


/* DICE ROTATION */

function setDiceValue(
    element,
    value,
    extraRotation = 0
) {

    if (!element) return;

    /*
       Kita rebuild titiknya,
       kemudian kasih rotasi 3D.
    */

    buildDice(
        element,
        value
    );

    const rotations = {

        1:
            "rotateX(0deg) rotateY(0deg)",

        2:
            "rotateX(90deg) rotateY(0deg)",

        3:
            "rotateX(0deg) rotateY(-90deg)",

        4:
            "rotateX(0deg) rotateY(90deg)",

        5:
            "rotateX(-90deg) rotateY(0deg)",

        6:
            "rotateX(0deg) rotateY(180deg)"

    };

    element.style.transform =
        rotations[value] +
        " rotateZ(" +
        extraRotation +
        "deg)";

}


/* RANDOM DICE */

function randomDice() {

    return Math.floor(
        Math.random() * 6
    ) + 1;

}


/* VIBRATION */

function vibratePhone(duration) {

    if (
        "vibrate" in navigator
    ) {

        try {

            navigator.vibrate(
                duration
            );

        } catch (error) {}

    }

}


/* START DICE */

function startDiceGame() {

    diceRolling = false;

    diceAttempts = 0;

    dice1Value = 1;

    dice2Value = 1;

    const dice1 =
        document.getElementById(
            "dice1"
        );

    const dice2 =
        document.getElementById(
            "dice2"
        );

    setDiceValue(
        dice1,
        1
    );

    setDiceValue(
        dice2,
        1
    );

    updateDiceAttempts();

}


/* ROLL */

function rollDice() {

    if (!diceRolling) return;


    const elapsed =
        Date.now() -
        diceStartTime;


    /*
       Semakin lama ditahan,
       interval makin kecil.
    */

    const speed =
        Math.max(
            55,
            190 -
            Math.floor(
                elapsed / 100
            )
        );


    /*
       Percobaan ke-5:
       otomatis 6 + 6.
    */

    if (
        diceAttempts >= 4
    ) {

        dice1Value = 6;

        dice2Value = 6;

    } else {

        dice1Value =
            randomDice();

        dice2Value =
            randomDice();

    }


    const dice1 =
        document.getElementById(
            "dice1"
        );

    const dice2 =
        document.getElementById(
            "dice2"
        );


    setDiceValue(
        dice1,
        dice1Value,
        Math.random() * 30 - 15
    );

    setDiceValue(
        dice2,
        dice2Value,
        Math.random() * 30 - 15
    );


    /*
       Getaran ikut cepat ketika
       tombol ditahan semakin lama.
    */

    const vibration =
        Math.max(
            20,
            Math.min(
                100,
                Math.floor(
                    25 +
                    elapsed / 100
                )
            )
        );

    vibratePhone(
        vibration
    );


    diceRollTimer =
        setTimeout(
            rollDice,
            speed
        );

}


/* BEGIN */

function beginDiceRoll() {

    if (diceRolling) return;

    diceRolling = true;

    diceStartTime =
        Date.now();

    if (holdDiceBtn) {

        holdDiceBtn.classList.add(
            "pressed"
        );

    }

    rollDice();

}


/* END */

function endDiceRoll() {

    if (!diceRolling) return;

    diceRolling = false;

    if (diceRollTimer) {

        clearTimeout(
            diceRollTimer
        );

        diceRollTimer = null;

    }

    if (holdDiceBtn) {

        holdDiceBtn.classList.remove(
            "pressed"
        );

    }


    diceAttempts++;

    updateDiceAttempts();


    const dice1 =
        document.getElementById(
            "dice1"
        );

    const dice2 =
        document.getElementById(
            "dice2"
        );


    if (
        dice1Value === 6 &&
        dice2Value === 6
    ) {

        showLucky();

        setTimeout(() => {

            startFlowerBookSequence();

        }, 1800);

        return;

    }


    /*
       Kalau belum 6+6,
       tetap boleh mencoba.
    */

    if (diceAttempts < 5) {

        return;

    }


    /*
       Safety fallback.
       Percobaan kelima wajib 6+6.
    */

    dice1Value = 6;

    dice2Value = 6;


    setDiceValue(
        dice1,
        6,
        0
    );

    setDiceValue(
        dice2,
        6,
        0
    );


    showLucky();


    setTimeout(() => {

        startFlowerBookSequence();

    }, 1800);

}


/* ATTEMPTS */

function updateDiceAttempts() {

    const element =
        document.getElementById(
            "diceAttempts"
        );

    if (!element) return;

    element.textContent =
        "Percobaan: " +
        diceAttempts +
        " / 5";

}


/* LUCK */

function showLucky() {

    const text =
        document.getElementById(
            "luckText"
        );

    if (!text) return;

    text.classList.remove(
        "show"
    );

    /*
       restart animation
    */

    void text.offsetWidth;

    text.classList.add(
        "show"
    );

}


/* BUTTON */

if (holdDiceBtn) {

    holdDiceBtn.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            beginDiceRoll();

        }
    );

    holdDiceBtn.addEventListener(
        "pointerup",
        event => {

            event.preventDefault();

            endDiceRoll();

        }
    );

    holdDiceBtn.addEventListener(
        "pointercancel",
        endDiceRoll
    );

    holdDiceBtn.addEventListener(
        "pointerleave",
        event => {

            if (
                diceRolling &&
                event.buttons === 0
            ) {

                endDiceRoll();

            }

        }
    );

}


/* =========================================================
   FLOWER + BOOK
========================================================= */

function startFlowerBookSequence() {

    showPage("flower");

    createNightSky();

    createFlowers();

    startFlowerProgress();

}


/* NIGHT SKY */

function createNightSky() {

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;


    /*
       Jangan duplicate.
    */

    if (
        container.querySelector(
            ".night-sky"
        )
    ) {
        return;
    }


    const sky =
        document.createElement("div");

    sky.className =
        "night-sky";


    const moon =
        document.createElement("div");

    moon.className =
        "moon";

    sky.appendChild(moon);


    const stars =
        document.createElement("div");

    stars.className =
        "stars";


    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const star =
            document.createElement("span");

        star.className =
            "star";

        star.style.left =
            Math.random() * 100 +
            "%";

        star.style.top =
            Math.random() * 75 +
            "%";

        star.style.animationDelay =
            Math.random() * 2 +
            "s";

        star.style.transform =
            "scale(" +
            (
                .5 +
                Math.random()
            ) +
            ")";

        stars.appendChild(star);

    }


    sky.appendChild(stars);

    container.prepend(sky);


    /*
       Tanah.
    */

    if (
        !container.querySelector(
            ".flower-ground"
        )
    ) {

        const ground =
            document.createElement("div");

        ground.className =
            "flower-ground";

        container.appendChild(
            ground
        );

    }

}


/* FLOWERS */

function createFlowers() {

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;


    let flowers =
        container.querySelector(
            ".flowers"
        );


    if (!flowers) {

        flowers =
            document.createElement(
                "div"
            );

        flowers.className =
            "flowers";

        container.appendChild(
            flowers
        );

    }


    flowers.innerHTML = "";


    const flowerTypes = [
        "🌸",
        "🌷",
        "🌺",
        "🌻",
        "🌹"
    ];


    /*
       Bunga tumbuh dari bawah.
    */

    for (
        let i = 0;
        i < 15;
        i++
    ) {

        const flower =
            document.createElement(
                "div"
            );

        flower.className =
            "falling-flower";

        flower.textContent =
            flowerTypes[
                Math.floor(
                    Math.random() *
                    flowerTypes.length
                )
            ];

        flower.style.left =
            Math.random() *
            96 +
            "%";

        flower.style.bottom =
            Math.random() *
            12 +
            "%";

        flower.style.animationDelay =
            Math.random() * 3 +
            "s";

        flower.style.fontSize =
            (
                25 +
                Math.random() *
                25
            ) +
            "px";

        flowers.appendChild(
            flower
        );

    }

}


/* FLOWER PROGRESS */

function startFlowerProgress() {

    let percent = 0;

    const page =
        document.querySelector(
            ".flower-loading"
        );

    if (!page) return;


    let info =
        page.querySelector(
            ".flower-loading-info"
        );


    if (!info) {

        info =
            document.createElement(
                "div"
            );

        info.className =
            "flower-loading-info";

        info.innerHTML = `
            <h2>
                Menyiapkan sesuatu untukmu...
            </h2>

            <div class="flower-progress">
                <div id="flowerProgress"></div>
            </div>

            <div id="flowerPercent">
                0%
            </div>
        `;

        page.appendChild(info);

    }


    const progress =
        document.getElementById(
            "flowerProgress"
        );

    const percentText =
        document.getElementById(
            "flowerPercent"
        );


    const timer =
        setInterval(() => {

            percent +=
                Math.floor(
                    Math.random() * 3
                ) + 1;


            if (percent >= 100) {

                percent = 100;

                clearInterval(timer);


                if (progress) {
                    progress.style.width =
                        "100%";
                }

                if (percentText) {
                    percentText.textContent =
                        "100%";
                }


                setTimeout(() => {

                    startCatchBooks();

                }, 800);

            }


            if (progress) {

                progress.style.width =
                    percent + "%";

            }

            if (percentText) {

                percentText.textContent =
                    percent + "%";

            }

        }, 60);

}


/* =========================================================
   CATCH BOOK 3X
========================================================= */

let booksCaught = 0;

let bookTimer = null;

function startCatchBooks() {

    booksCaught = 0;

    const page =
        document.querySelector(
            ".flower-loading"
        );

    if (!page) return;


    /*
       Instruction
    */

    let instruction =
        page.querySelector(
            ".book-instruction"
        );


    if (!instruction) {

        instruction =
            document.createElement(
                "div"
            );

        instruction.className =
            "book-instruction";

        instruction.innerHTML =
            "📖 <strong>TANGKAP BUKU 3×</strong><br>" +
            "Tangkap bukunya untuk membuka halaman selanjutnya";

        page.appendChild(
            instruction
        );

    }


    /*
       Buku pertama.
    */

    spawnBook();


    /*
       Buku berikutnya datang
       setiap 2 detik.
    */

}


/* SPAWN BOOK */

function spawnBook() {

    if (
        booksCaught >= 3
    ) {
        return;
    }


    const page =
        document.querySelector(
            ".flower-loading"
        );

    if (!page) return;


    const book =
        document.createElement(
            "button"
        );

    book.type = "button";

    book.className =
        "catch-book";

    book.textContent =
        "📖";


    /*
       Posisi random.
    */

    const randomLeft =
        5 +
        Math.random() *
        85;

    const randomRotation =
        -15 +
        Math.random() *
        30;

    const duration =
        2.5 +
        Math.random() *
        2.5;


    book.style.left =
        randomLeft + "%";

    book.style.setProperty(
        "--book-rotation",
        randomRotation + "deg"
    );

    book.style.animationDuration =
        duration + "s";


    book.addEventListener(
        "click",
        () => {

            catchBook(book);

        }
    );


    page.appendChild(book);


    /*
       Kalau tidak ditangkap,
       tetap kirim buku berikutnya.
    */

    book.addEventListener(
        "animationend",
        () => {

            if (
                !book.classList.contains(
                    "book-caught"
                )
            ) {

                book.remove();

                scheduleNextBook();

            }

        }
    );

}


/* NEXT BOOK */

function scheduleNextBook() {

    if (
        booksCaught >= 3
    ) {
        finishBookCatch();
        return;
    }


    clearTimeout(bookTimer);


    bookTimer =
        setTimeout(() => {

            spawnBook();

        }, 2000);

}


/* CATCH */

function catchBook(book) {

    if (
        book.classList.contains(
            "book-caught"
        )
    ) {
        return;
    }


    booksCaught++;


    book.classList.add(
        "book-caught"
    );


    /*
       Haptic feedback
    */

    vibratePhone(80);


    setTimeout(() => {

        if (book.parentNode) {
            book.remove();
        }

    }, 400);


    if (
        booksCaught >= 3
    ) {

        finishBookCatch();

    } else {

        scheduleNextBook();

    }

}


/* FINISH */

function finishBookCatch() {

    clearTimeout(
        bookTimer
    );


    setTimeout(() => {

        showPage("cover");

        startBookCover();

    }, 900);

}


/* =========================================================
   3D BOOK COVER
========================================================= */

function startBookCover() {

    const page =
        document.getElementById(
            "page-cover"
        );

    if (!page) return;


    /*
       Jika elemen belum dibuat oleh HTML,
       kita buat otomatis.
    */

    if (
        page.querySelector(
            ".book-scene"
        )
    ) {
        return;
    }


    page.innerHTML = `
        <div class="book-scene">

            <div class="book-table"></div>

            <div class="book-3d">

                <div class="book-cover-front">

                    <div class="cover-decoration">
                        ✦
                    </div>

                    <h1>
                        A This book is for my partner.
                    </h1>

                    <div class="cover-decoration">
                        ❤️
                    </div>

                    <button
                        id="openBookBtn"
                        class="book-next-button">
                        BUKA BUKU
                    </button>

                </div>

                <div class="book-pages"></div>

                <div class="book-spine"></div>

                <div class="book-cover-back"></div>

            </div>

            <div class="book-open-hint">
                Klik buku untuk membukanya
            </div>

        </div>
    `;


    const book =
        page.querySelector(
            ".book-3d"
        );

    const button =
        document.getElementById(
            "openBookBtn"
        );


    /*
       Klik DI MANA SAJA pada halaman
       buku akan terbuka.
    */

    page.addEventListener(
        "click",
        event => {

            if (
                event.target === button ||
                book.contains(event.target)
            ) {

                openBook();

            }

        }
    );

}


/* OPEN BOOK */

let bookOpened = false;

function openBook() {

    if (bookOpened) return;

    bookOpened = true;


    const page =
        document.getElementById(
            "page-cover"
        );

    page.classList.add(
        "book-opening"
    );


    const book =
        page.querySelector(
            ".book-3d"
        );


    if (book) {

        book.style.transform =
            "rotateX(8deg) rotateY(-75deg)";

    }


    setTimeout(() => {

        showPage("gallery");

        prepareGallery();

    }, 1200);

}


/* =========================================================
   GALLERY
========================================================= */

function prepareGallery() {

    const page =
        document.getElementById(
            "page-gallery"
        );

    if (!page) return;


    /*
       Kalau HTML lama masih dipakai,
       kita tambahkan class supaya CSS
       tetap bagus.
    */

    const background =
        page.querySelector(
            ".book-background"
        );


    if (background) {

        background.classList.add(
            "book-page-scene"
        );

    }


    const images =
        page.querySelectorAll(
            "img"
        );


    images.forEach(img => {

        if (
            !img.parentElement.classList.contains(
                "photo-frame"
            )
        ) {

            const frame =
                document.createElement(
                    "div"
                );

            frame.className =
                "photo-frame";

            img.parentNode.insertBefore(
                frame,
                img
            );

            frame.appendChild(
                img
            );

        }

    });


    const video =
        page.querySelector(
            "#topVideo"
        );


    if (video) {

        const parent =
            video.parentElement;

        if (
            !parent.classList.contains(
                "gallery-video"
            )
        ) {

            parent.classList.add(
                "gallery-video"
            );

        }

    }

}


/* GALLERY -> VIDEOS */

const nextVideoPage =
    document.getElementById(
        "nextVideoPage"
    );

if (nextVideoPage) {

    nextVideoPage.addEventListener(
        "click",
        () => {

            showPage("videos");

            prepareVideos();

        }
    );

}


/* =========================================================
   VIDEOS
========================================================= */

function prepareVideos() {

    const page =
        document.getElementById(
            "page-videos"
        );

    if (!page) return;


    const videos =
        page.querySelectorAll(
            "video"
        );


    videos.forEach(video => {

        if (
            !video.parentElement.classList.contains(
                "memory-video-frame"
            )
        ) {

            const frame =
                document.createElement(
                    "div"
                );

            frame.className =
                "memory-video-frame";

            video.parentNode.insertBefore(
                frame,
                video
            );

            frame.appendChild(
                video
            );

        }

    });


    const background =
        page.querySelector(
            ".book-background"
        );


    if (background) {

        background.classList.add(
            "book-page-scene"
        );

    }

}


/* VIDEOS -> ENDING */

const toEnding =
    document.getElementById(
        "toEnding"
    );

if (toEnding) {

    toEnding.addEventListener(
        "click",
        () => {

            showPage("ending");

            prepareEnding();

        }
    );

}


/* =========================================================
   ENDING
========================================================= */

function prepareEnding() {

    const ending =
        document.getElementById(
            "endingText"
        );

    if (!ending) return;


    /*
       Jangan isi kalau user nanti
       sudah punya teks sendiri.
    */

    if (
        ending.children.length === 0
    ) {

        const lines = [
            "Terima kasih sudah sampai sejauh ini.",
            "Semoga setiap halaman kecil di dalam buku ini bisa membuatmu tersenyum.",
            "Aku mungkin tidak selalu bisa mengatakan semuanya secara langsung.",
            "Tapi aku ingin kamu tahu kalau kamu sangat berarti.",
            "Semoga cerita kita terus memiliki banyak halaman baru.",
            "Dan semoga halaman berikutnya selalu menjadi sesuatu yang indah.",
            "❤️"
        ];


        lines.forEach(text => {

            const line =
                document.createElement(
                    "div"
                );

            line.className =
                "ending-line";

            line.textContent =
                text;

            ending.appendChild(
                line
            );

        });

    }


    /*
       Tambahkan tombol restart
       kalau belum ada.
    */

    let restart =
        document.getElementById(
            "restartBtn"
        );


    if (restart) {

        restart.classList.add(
            "restart-button"
        );

    }

}


/* RESTART */

const restartBtn =
    document.getElementById(
        "restartBtn"
    );

if (restartBtn) {

    restartBtn.addEventListener(
        "click",
        () => {

            location.reload();

        }
    );

}


/* =========================================================
   PREVENT DOUBLE TOUCH
========================================================= */

document.addEventListener(
    "touchstart",
    () => {},
    {
        passive: true
    }
);


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            /*
               Tidak perlu melakukan apa-apa.
            */

        }

    }
);
