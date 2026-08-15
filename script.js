/* =========================================================
   FOR MY PARTNER
   SCRIPT.JS FIXED
========================================================= */


/* =========================================================
   HELPER
========================================================= */

const $ = (id) => document.getElementById(id);

function showPage(id) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = $(id);

    if (page) {
        page.classList.add("active");
    }
}


/* =========================================================
   AUDIO
========================================================= */

const loadingMusic = $("loadingMusic");
const mainMusic = $("mainMusic");
const musicBtn = $("musicBtn");

if (musicBtn) {

    musicBtn.addEventListener("click", () => {

        if (!mainMusic) return;

        if (mainMusic.paused) {

            mainMusic.play()
                .then(() => {
                    musicBtn.textContent = "🔊";
                })
                .catch(() => {});

        } else {

            mainMusic.pause();
            musicBtn.textContent = "🎵";

        }

    });

}


/* =========================================================
   PAGE LOADING
========================================================= */

let loadingProgress = 0;

const loadingInterval = setInterval(() => {

    loadingProgress += Math.random() * 3 + 1;

    if (loadingProgress >= 100) {

        loadingProgress = 100;

        clearInterval(loadingInterval);

        if ($("loadingPercent")) {
            $("loadingPercent").textContent = "100%";
        }

        setTimeout(() => {
            showPage("page-welcome");
        }, 700);

    } else {

        if ($("loadingPercent")) {
            $("loadingPercent").textContent =
                Math.floor(loadingProgress) + "%";
        }

    }

}, 60);


/* =========================================================
   START LOADING MUSIC
========================================================= */

if (loadingMusic) {

    loadingMusic.volume = 0.7;

    loadingMusic.play()
        .catch(() => {});

}


/* =========================================================
   WELCOME → MEMORY
========================================================= */

const enterBtn = $("enterBtn");

if (enterBtn) {

    enterBtn.addEventListener("click", () => {

        if (loadingMusic) {
            loadingMusic.pause();
            loadingMusic.currentTime = 0;
        }

        showPage("page-password");

        startMemoryGame();

    });

}


/* =========================================================
   MEMORY GAME
========================================================= */

const letters = [
    "A", "B", "C", "D",
    "E", "F", "G", "H",
    "I", "J", "K", "L"
];

let memorySequence = [];
let playerSequence = [];

let memoryMistakes = 0;
let memoryLocked = true;
let memoryStarted = false;


function shuffleArray(array) {

    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

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


function createMemoryGrid() {

    const grid = $("randomLetters");

    if (!grid) return;

    grid.innerHTML = "";

    const randomLetters =
        shuffleArray(letters).slice(0, 8);

    randomLetters.forEach(letter => {

        const button =
            document.createElement("button");

        button.className = "memory-letter";
        button.textContent = letter;
        button.dataset.letter = letter;

        button.addEventListener(
            "click",
            () => handleMemoryClick(button)
        );

        grid.appendChild(button);

    });

}


function startMemoryGame() {

    if (memoryStarted) return;

    memoryStarted = true;
    memoryMistakes = 0;
    memoryLocked = true;

    createMemoryGrid();

    setTimeout(() => {
        showMemoryClue();
    }, 500);

}


function showMemoryClue() {

    const buttons =
        Array.from(
            document.querySelectorAll(
                ".memory-letter"
            )
        );

    if (!buttons.length) return;

    const shuffled =
        shuffleArray(buttons);

    const clueCount =
        Math.min(
            3,
            Math.max(
                1,
                Math.floor(buttons.length / 3)
            )
        );

    memorySequence =
        shuffled
            .slice(0, clueCount)
            .map(
                button =>
                    button.dataset.letter
            );

    shuffled
        .slice(0, clueCount)
        .forEach(button => {

            button.classList.add(
                "memory-clue"
            );

        });

    setTimeout(() => {

        buttons.forEach(button => {

            button.classList.remove(
                "memory-clue"
            );

        });

        memoryLocked = false;
        playerSequence = [];

    }, 2000);

}


function handleMemoryClick(button) {

    if (memoryLocked) return;

    if (
        button.classList.contains(
            "memory-selected"
        )
    ) {
        return;
    }

    const selectedLetter =
        button.dataset.letter;

    playerSequence.push(
        selectedLetter
    );

    button.classList.add(
        "memory-selected"
    );

    const index =
        playerSequence.length - 1;

    if (
        selectedLetter !==
        memorySequence[index]
    ) {

        memoryMistakes++;
        memoryLocked = true;

        button.classList.remove(
            "memory-selected"
        );

        button.classList.add(
            "memory-error"
        );

        if (memoryMistakes >= 3) {

            setTimeout(() => {
                resetMemoryGame();
            }, 700);

        } else {

            setTimeout(() => {

                button.classList.remove(
                    "memory-error"
                );

                resetCurrentMemoryAttempt();

            }, 700);

        }

        return;
    }

    if (
        playerSequence.length ===
        memorySequence.length
    ) {

        memoryLocked = true;

        document
            .querySelectorAll(
                ".memory-letter"
            )
            .forEach(button => {

                button.classList.add(
                    "memory-success"
                );

            });

        setTimeout(() => {

            showPage("page-dice");
            startDiceGame();

        }, 1000);

    }

}


function resetCurrentMemoryAttempt() {

    playerSequence = [];

    document
        .querySelectorAll(
            ".memory-letter"
        )
        .forEach(button => {

            button.classList.remove(
                "memory-selected"
            );

        });

    setTimeout(() => {

        memoryLocked = false;

    }, 300);

}


function resetMemoryGame() {

    memoryMistakes = 0;
    playerSequence = [];
    memoryLocked = true;

    const grid = $("randomLetters");

    if (grid) {
        grid.classList.add(
            "memory-shuffle"
        );
    }

    setTimeout(() => {

        if (grid) {
            grid.classList.remove(
                "memory-shuffle"
            );
        }

        createMemoryGrid();

        setTimeout(() => {
            showMemoryClue();
        }, 400);

    }, 500);

}


/* =========================================================
   DICE GAME
========================================================= */

let diceStarted = false;
let diceRolling = false;
let diceHoldStart = 0;

let diceRollTimer = null;
let diceAnimationFrame = null;

let diceAttempts = 0;

const MAX_DICE_ATTEMPTS = 5;


/* ---------------------------------------------------------
   DICE VALUES
--------------------------------------------------------- */

let diceValue1 = 1;
let diceValue2 = 1;


/* ---------------------------------------------------------
   DICE ROTATION
--------------------------------------------------------- */

let rotationX1 = -15;
let rotationY1 = 0;

let rotationX2 = -15;
let rotationY2 = 0;


/* ---------------------------------------------------------
   VIBRATION
--------------------------------------------------------- */

function vibrateDevice(duration) {

    if (
        navigator.vibrate &&
        typeof navigator.vibrate === "function"
    ) {

        navigator.vibrate(duration);

    }

}


/* =========================================================
   DICE PIPS
========================================================= */

function createPips(number) {

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

    return positions[number]
        .map(position => {

            return `
                <span class="pip ${position}"></span>
            `;

        })
        .join("");

}


/* =========================================================
   CREATE DICE FACES
========================================================= */

function createDiceFaces(diceElement) {

    if (!diceElement) return;

    const faces = [
        "front",
        "back",
        "right",
        "left",
        "top",
        "bottom"
    ];

    diceElement.innerHTML = "";

    faces.forEach(face => {

        const faceElement =
            document.createElement("div");

        faceElement.className =
            `dice-face face-${face}`;

        faceElement.innerHTML =
            createPips(1);

        diceElement.appendChild(
            faceElement
        );

    });

}


/* =========================================================
   CORRECT DICE FACE VALUES
========================================================= */

function updateDiceVisual(
    diceElement,
    value
) {

    if (!diceElement) return;

    /*
        Opposite faces:

        1 ↔ 6
        2 ↔ 5
        3 ↔ 4

        Front is always the requested value.
        Back is its opposite.

        Other sides are filled with a
        valid complementary arrangement.
    */

    const sideValues = {

        1: [1, 6, 3, 4, 2, 5],
        2: [2, 5, 3, 4, 6, 1],
        3: [3, 4, 1, 6, 2, 5],
        4: [4, 3, 1, 6, 5, 2],
        5: [5, 2, 3, 4, 6, 1],
        6: [6, 1, 3, 4, 2, 5]

    };

    const mapping =
        sideValues[value] ||
        sideValues[1];

    const faces =
        diceElement.querySelectorAll(
            ".dice-face"
        );

    faces.forEach(
        (face, index) => {

            face.innerHTML =
                createPips(
                    mapping[index]
                );

        }
    );

}


/* =========================================================
   SET DICE VALUES
========================================================= */

function setDiceValues(
    value1,
    value2
) {

    diceValue1 = value1;
    diceValue2 = value2;

    updateDiceVisual(
        $("dice1"),
        value1
    );

    updateDiceVisual(
        $("dice2"),
        value2
    );

}


/* =========================================================
   DICE ORIENTATION
========================================================= */

/*
    Front face is the face we want to show.

    Instead of randomly rotating Z,
    we keep Z = 0 so the dice don't become
    visually crooked.
*/

function orientDiceToFront(
    diceElement,
    value,
    which
) {

    if (!diceElement) return;

    let x = -15;
    let y = 0;

    /*
        Every value gets a different visual
        orientation while keeping the dice
        upright.
    */

    switch (value) {

        case 1:
            x = -15;
            y = 0;
            break;

        case 2:
            x = -15;
            y = -90;
            break;

        case 3:
            x = -15;
            y = -180;
            break;

        case 4:
            x = -15;
            y = 90;
            break;

        case 5:
            x = 75;
            y = 0;
            break;

        case 6:
            x = -105;
            y = 0;
            break;

    }

    /*
        Add enough full rotations for animation,
        but don't rotate on Z.
    */

    if (which === 1) {

        rotationX1 =
            Math.round(rotationX1 / 360) * 360 +
            x;

        rotationY1 =
            Math.round(rotationY1 / 360) * 360 +
            y;

    } else {

        rotationX2 =
            Math.round(rotationX2 / 360) * 360 +
            x;

        rotationY2 =
            Math.round(rotationY2 / 360) * 360 +
            y;

    }

    applyDiceRotation();

}


/* =========================================================
   APPLY DICE ROTATION
========================================================= */

function applyDiceRotation() {

    const dice1 = $("dice1");
    const dice2 = $("dice2");

    if (dice1) {

        dice1.style.transform =
            `
            rotateX(${rotationX1}deg)
            rotateY(${rotationY1}deg)
            rotateZ(0deg)
            `;

    }

    if (dice2) {

        dice2.style.transform =
            `
            rotateX(${rotationX2}deg)
            rotateY(${rotationY2}deg)
            rotateZ(0deg)
            `;

    }

}


/* =========================================================
   START DICE
========================================================= */

function startDiceGame() {

    if (diceStarted) return;

    diceStarted = true;
    diceAttempts = 0;

    setDiceValues(1, 1);

    rotationX1 = -15;
    rotationY1 = 0;

    rotationX2 = -15;
    rotationY2 = 0;

    applyDiceRotation();

    updateDiceAttempts();

}


/* =========================================================
   ATTEMPT
========================================================= */

function updateDiceAttempts() {

    const element =
        $("diceAttempts");

    if (!element) return;

    element.textContent =
        `Percobaan: ${diceAttempts} / ${MAX_DICE_ATTEMPTS}`;

}


/* =========================================================
   DICE HOLD START
========================================================= */

function startDiceRoll(event) {

    if (event) {
        event.preventDefault();
    }

    if (diceRolling) return;

    if (
        diceAttempts >=
        MAX_DICE_ATTEMPTS
    ) {
        return;
    }

    diceRolling = true;

    diceHoldStart =
        performance.now();

    const button =
        $("holdDiceBtn");

    if (button) {
        button.classList.add(
            "pressed"
        );
    }

    vibrateDevice(30);

    rollDiceLoop();

}


/* =========================================================
   ROLL LOOP
========================================================= */

function rollDiceLoop() {

    if (!diceRolling) return;

    const heldTime =
        performance.now() -
        diceHoldStart;

    const speed =
        Math.max(
            25,
            180 -
            heldTime * 0.15
        );

    const random1 =
        Math.floor(
            Math.random() * 6
        ) + 1;

    const random2 =
        Math.floor(
            Math.random() * 6
        ) + 1;

    setDiceValues(
        random1,
        random2
    );

    /*
        Rotate only X/Y.
        Z stays at 0.
    */

    const rotationSpeed =
        Math.min(
            35,
            4 +
            heldTime * 0.02
        );

    rotationX1 += rotationSpeed;
    rotationY1 += rotationSpeed * 1.2;

    rotationX2 += rotationSpeed * 1.1;
    rotationY2 += rotationSpeed * .9;

    applyDiceRotation();

    if (heldTime > 200) {

        vibrateDevice(
            Math.max(
                15,
                Math.min(
                    60,
                    55 -
                    heldTime * .02
                )
            )
        );

    }

    diceRollTimer =
        setTimeout(() => {

            diceAnimationFrame =
                requestAnimationFrame(
                    rollDiceLoop
                );

        }, speed);

}


/* =========================================================
   STOP DICE
========================================================= */

function stopDiceRoll() {

    if (!diceRolling) return;

    diceRolling = false;

    if (diceRollTimer) {

        clearTimeout(
            diceRollTimer
        );

        diceRollTimer = null;

    }

    if (diceAnimationFrame) {

        cancelAnimationFrame(
            diceAnimationFrame
        );

        diceAnimationFrame = null;

    }

    const button =
        $("holdDiceBtn");

    if (button) {

        button.classList.remove(
            "pressed"
        );

    }

    const heldTime =
        performance.now() -
        diceHoldStart;

    const finalDuration =
        Math.min(
            1300,
            350 +
            heldTime * .22
        );

    diceAttempts++;

    updateDiceAttempts();

    /*
        Percobaan ke-5 = pasti 6 + 6.
    */

    if (
        diceAttempts >=
        MAX_DICE_ATTEMPTS
    ) {

        animateDiceToFinal(
            6,
            6,
            finalDuration
        );

        return;

    }

    const final1 =
        Math.floor(
            Math.random() * 6
        ) + 1;

    const final2 =
        Math.floor(
            Math.random() * 6
        ) + 1;

    animateDiceToFinal(
        final1,
        final2,
        finalDuration
    );

}


/* =========================================================
   FINAL DICE ANIMATION
========================================================= */

function animateDiceToFinal(
    final1,
    final2,
    duration
) {

    const startTime =
        performance.now();

    function animate() {

        const elapsed =
            performance.now() -
            startTime;

        const progress =
            Math.min(
                1,
                elapsed / duration
            );

        if (progress < 1) {

            const random1 =
                Math.floor(
                    Math.random() * 6
                ) + 1;

            const random2 =
                Math.floor(
                    Math.random() * 6
                ) + 1;

            setDiceValues(
                random1,
                random2
            );

            /*
                Smooth upright rotation.
            */

            rotationX1 += 18;
            rotationY1 += 22;

            rotationX2 += 20;
            rotationY2 += 18;

            applyDiceRotation();

            requestAnimationFrame(
                animate
            );

        } else {

            /*
                Final value.
            */

            setDiceValues(
                final1,
                final2
            );

            /*
                Put the correct face forward.
            */

            orientDiceToFront(
                $("dice1"),
                final1,
                1
            );

            orientDiceToFront(
                $("dice2"),
                final2,
                2
            );

            if (
                final1 === 6 &&
                final2 === 6
            ) {

                setTimeout(() => {
                    finishLuckyDice();
                }, 250);

            }

        }

    }

    animate();

}


/* =========================================================
   LUCKY
========================================================= */

function finishLuckyDice() {

    diceRolling = false;

    setDiceValues(6, 6);

    orientDiceToFront(
        $("dice1"),
        6,
        1
    );

    orientDiceToFront(
        $("dice2"),
        6,
        2
    );

    vibrateDevice([
        80,
        50,
        120,
        50,
        180
    ]);

    const luckText =
        $("luckText");

    if (luckText) {

        luckText.classList.remove(
            "show"
        );

        void luckText.offsetWidth;

        luckText.classList.add(
            "show"
        );

    }

    setTimeout(() => {

        showPage(
            "page-flower"
        );

        startFlowerLoading();

    }, 1900);

}


/* =========================================================
   DICE BUTTON EVENTS
========================================================= */

const holdDiceBtn =
    $("holdDiceBtn");

if (holdDiceBtn) {

    holdDiceBtn.addEventListener(
        "pointerdown",
        startDiceRoll
    );

    holdDiceBtn.addEventListener(
        "pointerup",
        stopDiceRoll
    );

    holdDiceBtn.addEventListener(
        "pointercancel",
        stopDiceRoll
    );

    holdDiceBtn.addEventListener(
        "pointerleave",
        event => {

            /*
                Only stop if the finger
                has actually been released.
            */

            if (
                event.buttons === 0
            ) {

                stopDiceRoll();

            }

        }
    );

}


/* =========================================================
   FLOWER NIGHT
========================================================= */

let flowerStarted = false;


function createNightSky() {

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;

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

    sky.appendChild(
        moon
    );

    const stars =
        document.createElement("div");

    stars.className =
        "stars";

    for (
        let i = 0;
        i < 100;
        i++
    ) {

        const star =
            document.createElement(
                "span"
            );

        star.className =
            "star";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 75 + "%";

        const size =
            Math.random() * 3 + 1;

        star.style.width =
            size + "px";

        star.style.height =
            size + "px";

        star.style.animationDelay =
            Math.random() * 2 + "s";

        stars.appendChild(
            star
        );

    }

    sky.appendChild(
        stars
    );

    container.prepend(
        sky
    );

}


function createFlowerGround() {

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;

    if (
        container.querySelector(
            ".flower-ground"
        )
    ) {
        return;
    }

    const ground =
        document.createElement(
            "div"
        );

    ground.className =
        "flower-ground";

    container.appendChild(
        ground
    );

}


function createFlowers() {

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;

    if (
        container.querySelector(
            ".flowers"
        )
    ) {
        return;
    }

    const flowers =
        document.createElement(
            "div"
        );

    flowers.className =
        "flowers";

    const flowerTypes = [
        "🌷",
        "🌸",
        "🌹",
        "🌼",
        "🌻",
        "🌺"
    ];

    for (
        let i = 0;
        i < 18;
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
            Math.random() * 96 + "%";

        flower.style.bottom =
            8 +
            Math.random() * 18 +
            "%";

        flower.style.fontSize =
            24 +
            Math.random() * 30 +
            "px";

        flower.style.animationDelay =
            Math.random() * 2 + "s";

        flowers.appendChild(
            flower
        );

    }

    container.appendChild(
        flowers
    );

}


/* =========================================================
   FLOWER LOADING
========================================================= */

function startFlowerLoading() {

    if (flowerStarted) return;

    flowerStarted = true;

    createNightSky();
    createFlowerGround();
    createFlowers();

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;

    const info =
        document.createElement(
            "div"
        );

    info.className =
        "flower-loading-info";

    info.innerHTML = `

        <h2>
            Sebentar lagi...
        </h2>

        <div class="flower-progress">
            <div id="flowerProgress"></div>
        </div>

        <div id="flowerPercent">
            0%
        </div>

    `;

    container.appendChild(
        info
    );

    let progress = 0;

    const interval =
        setInterval(() => {

            progress +=
                Math.random() * 4 + 2;

            if (progress >= 100) {

                progress = 100;

                clearInterval(interval);

                if ($("flowerPercent")) {
                    $("flowerPercent")
                        .textContent = "100%";
                }

                if ($("flowerProgress")) {
                    $("flowerProgress")
                        .style.width = "100%";
                }

                setTimeout(() => {

                    prepareCatchBooks();

                }, 700);

            } else {

                if ($("flowerPercent")) {

                    $("flowerPercent")
                        .textContent =
                        Math.floor(progress) + "%";

                }

                if ($("flowerProgress")) {

                    $("flowerProgress")
                        .style.width =
                        progress + "%";

                }

            }

        }, 100);

}


/* =========================================================
   CATCH BOOK
========================================================= */

let booksCaught = 0;
let catchBookRunning = false;
let catchGameStarted = false;


/*
    IMPORTANT:

    booksCreated tidak lagi dipakai
    sebagai batas maksimal.

    User harus menangkap 3 buku.
    Kalau buku lewat, buku berikutnya
    tetap akan muncul.
*/

function createBookInstruction() {

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;

    if (
        container.querySelector(
            ".book-instruction"
        )
    ) {
        return;
    }

    const instruction =
        document.createElement(
            "div"
        );

    instruction.className =
        "book-instruction";

    instruction.textContent =
        "📖 Tangkap buku 3× untuk membuka halaman selanjutnya";

    container.appendChild(
        instruction
    );

}


function prepareCatchBooks() {

    if (catchGameStarted) return;

    catchGameStarted = true;
    booksCaught = 0;

    createBookInstruction();

    setTimeout(() => {

        spawnCatchBook();

    }, 800);

}


/*
    Spawn buku tanpa batas sampai
    3 buku berhasil ditangkap.
*/

function spawnCatchBook() {

    if (booksCaught >= 3) {
        return;
    }

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;

    catchBookRunning = true;

    const book =
        document.createElement(
            "button"
        );

    book.className =
        "catch-book";

    book.type = "button";

    book.setAttribute(
        "aria-label",
        "Tangkap buku"
    );

    /*
        Emoji + area tombol yang lebih besar.
    */

    book.innerHTML = `
        <span class="book-emoji">
            📖
        </span>
    `;

    const randomLeft =
        10 +
        Math.random() * 80;

    book.style.left =
        randomLeft + "%";

    book.style.setProperty(
        "--book-rotation",
        (
            Math.random() * 30 -
            15
        ) + "deg"
    );

    let caught = false;

    function catchThisBook(event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (caught) return;

        caught = true;

        booksCaught++;

        book.classList.add(
            "book-caught"
        );

        vibrateDevice(70);

        /*
            Buku sudah ditangkap.
        */

        if (booksCaught >= 3) {

            catchBookRunning = false;

            setTimeout(() => {

                openBookCover();

            }, 700);

            return;
        }

        /*
            Buku berikutnya.
        */

        setTimeout(() => {

            if (book.parentNode) {
                book.remove();
            }

            spawnCatchBook();

        }, 600);

    }


    /*
        pointerup lebih reliable
        untuk Android daripada click
        pada elemen bergerak.
    */

    book.addEventListener(
        "pointerdown",
        catchThisBook
    );

    book.addEventListener(
        "click",
        catchThisBook
    );


    container.appendChild(
        book
    );


    /*
        Kalau kelewat, spawn lagi.
        Tidak mengurangi booksCaught.
    */

    setTimeout(() => {

        if (
            !caught &&
            book.parentNode
        ) {

            book.remove();

            if (
                booksCaught < 3
            ) {

                setTimeout(() => {

                    spawnCatchBook();

                }, 400);

            }

        }

    }, 4500);

}


/* =========================================================
   BOOK COVER
========================================================= */

function openBookCover() {

    showPage(
        "page-cover"
    );

    const page =
        $("page-cover");

    if (!page) return;

    page.innerHTML = `

        <div class="book-scene">

            <div class="book-table"></div>

            <div
                id="book3d"
                class="book-3d">

                <div class="book-cover-back"></div>

                <div class="book-pages"></div>

                <div class="book-spine"></div>

                <div class="book-cover-front">

                    <div class="cover-decoration">
                        ✦ ✦ ✦
                    </div>

                    <h1>
                        A This Book
                        <br>
                        Is For My Partner
                    </h1>

                    <div class="cover-decoration">
                        ❤️
                    </div>

                    <button
                        id="openBookBtn"
                        class="book-next-button"
                        type="button">

                        BUKA BUKU

                    </button>

                </div>

            </div>

            <div class="book-open-hint">
                Klik tombol BUKA BUKU
            </div>

        </div>

    `;

    const openButton =
        $("openBookBtn");

    if (openButton) {

        openButton.addEventListener(
            "pointerdown",
            event => {
                event.stopPropagation();
            }
        );

        openButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                openBook();

            }
        );

    }

}


/* =========================================================
   OPEN BOOK
========================================================= */

function openBook() {

    const button =
        $("openBookBtn");

    if (button) {

        button.disabled = true;

    }

    const book =
        $("book3d");

    if (book) {

        book.classList.add(
            "book-opening"
        );

    }

    setTimeout(() => {

        showPage(
            "page-gallery"
        );

    }, 1100);

}


/* =========================================================
   GALLERY
========================================================= */

function prepareGallery() {

    document
        .querySelectorAll(
            ".photo-row img"
        )
        .forEach(img => {

            if (
                img.parentElement.classList
                    .contains(
                        "photo-frame"
                    )
            ) {
                return;
            }

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

        });

}

prepareGallery();


const nextVideoPage =
    $("nextVideoPage");

if (nextVideoPage) {

    nextVideoPage.addEventListener(
        "click",
        () => {

            showPage(
                "page-videos"
            );

        }
    );

}


/* =========================================================
   VIDEO PAGE
========================================================= */

function prepareVideos() {

    document
        .querySelectorAll(
            ".video-grid video"
        )
        .forEach(video => {

            if (
                video.parentElement
                    .classList
                    .contains(
                        "memory-video-frame"
                    )
            ) {
                return;
            }

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

        });

}

prepareVideos();


const toEnding =
    $("toEnding");

if (toEnding) {

    toEnding.addEventListener(
        "click",
        () => {

            showPage(
                "page-ending"
            );

            startEndingText();

        }
    );

}


/* =========================================================
   ENDING
========================================================= */

function startEndingText() {

    const ending =
        $("endingText");

    if (!ending) return;

    if (
        ending.dataset.loaded ===
        "true"
    ) {
        return;
    }

    ending.dataset.loaded =
        "true";

    const text = [

        "Untuk kamu yang selalu menjadi bagian indah dalam hidupku.",

        "Terima kasih sudah hadir dan memberikan begitu banyak cerita.",

        "Mungkin semua yang ada di dalam buku kecil ini tidak sempurna.",

        "Tapi setiap halaman di dalamnya dibuat dengan perasaan yang tulus.",

        "Semoga setiap kenangan yang kita punya selalu menjadi sesuatu yang indah untuk diingat.",

        "Dan semoga masih ada banyak halaman lain yang bisa kita tulis bersama.",

        "❤️"

    ];

    text.forEach(line => {

        const paragraph =
            document.createElement(
                "div"
            );

        paragraph.className =
            "ending-line";

        paragraph.textContent =
            line;

        ending.appendChild(
            paragraph
        );

    });

}


/* =========================================================
   RESTART
========================================================= */

const restartBtn =
    $("restartBtn");

if (restartBtn) {

    restartBtn.addEventListener(
        "click",
        () => {

            location.reload();

        }
    );

}


/* =========================================================
   DICE INITIALIZATION
========================================================= */

createDiceFaces(
    $("dice1")
);

createDiceFaces(
    $("dice2")
);

setDiceValues(
    1,
    1
);

applyDiceRotation();


/* =========================================================
   PREVENT CONTEXT MENU
========================================================= */

document.addEventListener(
    "contextmenu",
    event => {

        if (
            event.target.tagName !==
            "VIDEO"
        ) {

            event.preventDefault();

        }

    }
);
