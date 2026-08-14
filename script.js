/* =========================================================
   FOR MY PARTNER
   SCRIPT.JS FINAL
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

let musicPlaying = false;

if (musicBtn) {

    musicBtn.addEventListener("click", () => {

        if (!mainMusic) return;

        if (mainMusic.paused) {

            mainMusic.play()
                .then(() => {
                    musicPlaying = true;
                    musicBtn.textContent = "🔊";
                })
                .catch(() => {});

        } else {

            mainMusic.pause();

            musicPlaying = false;

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
   WELCOME → PASSWORD
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
   MEMORY PASSWORD GAME
========================================================= */

const letters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L"
];

let memorySequence = [];
let playerSequence = [];

let memoryMistakes = 0;

let memoryLocked = true;

let memoryStarted = false;


/*
    Acak array
*/

function shuffleArray(array) {

    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            result[i],
            result[j]
        ] =
        [
            result[j],
            result[i]
        ];

    }

    return result;
}


/*
    Buat huruf
*/

function createMemoryGrid() {

    const grid = $("randomLetters");

    if (!grid) return;

    grid.innerHTML = "";

    const randomLetters =
        shuffleArray(letters).slice(0, 8);

    randomLetters.forEach(letter => {

        const button =
            document.createElement("button");

        button.className =
            "memory-letter";

        button.textContent =
            letter;

        button.dataset.letter =
            letter;

        button.addEventListener(
            "click",
            () => handleMemoryClick(button)
        );

        grid.appendChild(button);

    });

}


/*
    Mulai game
*/

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


/*
    Tampilkan clue

    Semua huruf yang dipilih
    menyala BERSAMAAN.
*/

function showMemoryClue() {

    const buttons =
        Array.from(
            document.querySelectorAll(
                ".memory-letter"
            )
        );

    if (!buttons.length) return;


    /*
        Ambil 1–3 huruf sebagai kode.
    */

    const shuffled =
        shuffleArray(buttons);

    const clueCount =
        Math.min(
            3,
            Math.max(
                1,
                Math.floor(
                    buttons.length / 3
                )
            )
        );


    memorySequence =
        shuffled
            .slice(0, clueCount)
            .map(
                button =>
                    button.dataset.letter
            );


    /*
        Semua clue menyala bersamaan.
    */

    shuffled
        .slice(0, clueCount)
        .forEach(button => {

            button.classList.add(
                "memory-clue"
            );

        });


    /*
        Durasi clue 2 detik.
    */

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


/*
    Klik huruf
*/

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


    /*
        Salah
    */

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


        /*
            Jika salah 3×,
            kode diacak ulang.
        */

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


    /*
        Benar semua
    */

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


/*
    Reset percobaan tanpa
    mengubah posisi huruf.
*/

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


/*
    Salah 3×
    Huruf dibuat ulang
    sehingga posisinya berubah.
*/

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


/*
    Getaran HP
*/

function vibrateDevice(duration) {

    if (
        navigator.vibrate &&
        typeof navigator.vibrate === "function"
    ) {

        navigator.vibrate(duration);

    }

}


/*
    Buat titik dadu
*/

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
                <span
                    class="pip ${position}">
                </span>
            `;

        })
        .join("");

}


/*
    Criar 6 sisi dadu
*/

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

        /*
            Nilai awal semua sisi.
            JavaScript kemudian mengubah
            nilai visualnya.
        */

        faceElement.innerHTML =
            createPips(1);

        diceElement.appendChild(
            faceElement
        );

    });

}


/*
    Nilai dadu saat ini
*/

let diceValue1 = 1;
let diceValue2 = 1;


/*
    Rotasi visual dadu
*/

let rotationX1 = 0;
let rotationY1 = 0;
let rotationZ1 = 0;

let rotationX2 = 0;
let rotationY2 = 0;
let rotationZ2 = 0;


/*
    Update sisi dadu
*/

function updateDiceVisual(
    diceElement,
    value
) {

    if (!diceElement) return;

    const faces =
        diceElement.querySelectorAll(
            ".dice-face"
        );

    /*
        Mapping sisi agar nilai
        terlihat seperti dadu.
    */

    const mapping = [
        value,
        7 - value,
        value,
        7 - value,
        value,
        7 - value
    ];

    faces.forEach(
        (face, index) => {

            face.innerHTML =
                createPips(
                    mapping[index]
                );

        }
    );

}


/*
    Tampilkan nilai akhir
*/

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


/*
    Mulai game dadu
*/

function startDiceGame() {

    if (diceStarted) return;

    diceStarted = true;

    diceAttempts = 0;

    setDiceValues(1, 1);

    updateDiceAttempts();

}


/*
    Update tulisan percobaan
*/

function updateDiceAttempts() {

    const element =
        $("diceAttempts");

    if (!element) return;

    element.textContent =
        `Percobaan: ${diceAttempts} / ${MAX_DICE_ATTEMPTS}`;

}


/*
    Hold start
*/

function startDiceRoll(event) {

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


    /*
        Roll berjalan selama tombol ditahan.
    */

    function rollFrame() {

        if (!diceRolling) return;


        const heldTime =
            performance.now() -
            diceHoldStart;


        /*
            Semakin lama ditahan,
            interval semakin cepat.
        */

        const speed =
            Math.max(
                20,
                180 -
                heldTime * 0.15
            );


        /*
            Random dadu.
        */

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
            Rotasi semakin cepat.
        */

        const rotationSpeed =
            Math.min(
                45,
                4 +
                heldTime * 0.025
            );


        rotationX1 +=
            rotationSpeed;

        rotationY1 +=
            rotationSpeed * 1.4;

        rotationZ1 +=
            rotationSpeed * .5;


        rotationX2 +=
            rotationSpeed * 1.2;

        rotationY2 +=
            rotationSpeed * .8;

        rotationZ2 +=
            rotationSpeed * .6;


        applyDiceRotation();


        /*
            Getaran semakin cepat
            ketika ditahan lama.
        */

        if (
            heldTime > 200
        ) {

            vibrateDevice(
                Math.max(
                    15,
                    Math.min(
                        80,
                        65 -
                        heldTime * .03
                    )
                )
            );

        }


        diceRollTimer =
            setTimeout(
                () => {

                    diceAnimationFrame =
                        requestAnimationFrame(
                            rollFrame
                        );

                },
                speed
            );

    }


    rollFrame();

}


/*
    Stop roll
*/

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


    /*
        Lama tekanan menentukan
        seberapa lama efek akhir.
    */

    const finalDuration =
        Math.min(
            1500,
            350 +
            heldTime * .25
        );


    /*
        Percobaan bertambah.
    */

    diceAttempts++;

    updateDiceAttempts();


    /*
        5× percobaan:
        dipaksa mendapatkan 6 + 6.
    */

    if (
        diceAttempts >=
        MAX_DICE_ATTEMPTS
    ) {

        finishLuckyDice();

        return;

    }


    /*
        Normal random.
    */

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


/*
    Animasi berhenti menuju angka akhir
*/

function animateDiceToFinal(
    final1,
    final2,
    duration
) {

    const startTime =
        performance.now();

    const start1 =
        diceValue1;

    const start2 =
        diceValue2;


    function animate() {

        const elapsed =
            performance.now() -
            startTime;

        const progress =
            Math.min(
                1,
                elapsed / duration
            );


        /*
            Ease out
        */

        const ease =
            1 -
            Math.pow(
                1 - progress,
                4
            );


        if (progress < 1) {

            /*
                Selama animasi,
                masih random.
            */

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


            applyDiceRotation();

            requestAnimationFrame(
                animate
            );

        } else {

            setDiceValues(
                final1,
                final2
            );


            /*
                Tambahkan rotasi akhir.
            */

            rotationX1 += 360;
            rotationY1 += 540;

            rotationX2 += 450;
            rotationY2 += 360;

            applyDiceRotation();


            /*
                Cek apakah 6 + 6.
            */

            if (
                final1 === 6 &&
                final2 === 6
            ) {

                finishLuckyDice();

            }

        }

    }


    animate();

}


/*
    Rotasi dadu
*/

function applyDiceRotation() {

    const dice1 =
        $("dice1");

    const dice2 =
        $("dice2");


    if (dice1) {

        dice1.style.transform =
            `
            rotateX(${rotationX1}deg)
            rotateY(${rotationY1}deg)
            rotateZ(${rotationZ1}deg)
            `;

    }


    if (dice2) {

        dice2.style.transform =
            `
            rotateX(${rotationX2}deg)
            rotateY(${rotationY2}deg)
            rotateZ(${rotationZ2}deg)
            `;

    }

}


/*
    BERUNTUNG
*/

function finishLuckyDice() {

    diceRolling = false;

    setDiceValues(
        6,
        6
    );


    /*
        Getaran panjang.
    */

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

        /*
            Force reflow agar animasi
            bisa diputar lagi.
        */

        void luckText.offsetWidth;

        luckText.classList.add(
            "show"
        );

    }


    /*
        Setelah efek selesai,
        masuk ke flower loading.
    */

    setTimeout(() => {

        showPage(
            "page-flower"
        );

        startFlowerLoading();

    }, 1900);

}


/*
    Event tombol dadu
*/

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
        (event) => {

            /*
                Jangan menghentikan saat
                pointer masih ditekan di HP.
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


/*
    Buat langit.
*/

function createNightSky() {

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;


    /*
        Hindari membuat dua kali.
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

    sky.appendChild(
        moon
    );


    const stars =
        document.createElement("div");

    stars.className =
        "stars";


    /*
        Banyak bintang random.
    */

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

        star.style.width =
            (
                Math.random() * 3 +
                1
            ) + "px";

        star.style.height =
            star.style.width;

        star.style.animationDelay =
            (
                Math.random() * 2
            ) + "s";

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


/*
    Buat tanah.
*/

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
        document.createElement("div");

    ground.className =
        "flower-ground";

    container.appendChild(
        ground
    );

}


/*
    Buat bunga.
*/

function createFlowers() {

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;


    const flowers =
        document.createElement("div");

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


    /*
        18 bunga.
    */

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
            (
                Math.random() * 96
            ) + "%";


        /*
            Bunga punya tinggi
            random.
        */

        flower.style.bottom =
            (
                8 +
                Math.random() * 18
            ) + "%";


        flower.style.fontSize =
            (
                24 +
                Math.random() * 30
            ) + "px";


        flower.style.animationDelay =
            (
                Math.random() * 2
            ) + "s";


        flowers.appendChild(
            flower
        );

    }


    container.appendChild(
        flowers
    );

}


/*
    Loading bunga.
*/

function startFlowerLoading() {

    if (flowerStarted) return;

    flowerStarted = true;


    createNightSky();

    createFlowerGround();

    createFlowers();


    /*
        Info loading
    */

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

                clearInterval(
                    interval
                );


                if (
                    $("flowerPercent")
                ) {

                    $("flowerPercent")
                        .textContent =
                        "100%";

                }


                if (
                    $("flowerProgress")
                ) {

                    $("flowerProgress")
                        .style.width =
                        "100%";

                }


                setTimeout(() => {

                    prepareCatchBooks();

                }, 700);


            } else {

                if (
                    $("flowerPercent")
                ) {

                    $("flowerPercent")
                        .textContent =
                        Math.floor(
                            progress
                        ) + "%";

                }


                if (
                    $("flowerProgress")
                ) {

                    $("flowerProgress")
                        .style.width =
                        progress + "%";

                }

            }

        }, 100);

}


/* =========================================================
   CATCH BOOK
   3× RANDOM
========================================================= */

let booksCaught = 0;

let booksCreated = 0;

let catchBookRunning = false;


/*
    Instruction
*/

function createBookInstruction() {

    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;


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


/*
    Persiapan buku
*/

function prepareCatchBooks() {

    createBookInstruction();

    setTimeout(() => {

        spawnCatchBook();

    }, 800);

}


/*
    Buku datang random.
*/

function spawnCatchBook() {

    if (
        booksCreated >= 3
    ) {
        return;
    }


    booksCreated++;

    catchBookRunning = true;


    const container =
        document.querySelector(
            ".flower-loading"
        );

    if (!container) return;


    const book =
        document.createElement(
            "button"
        );

    book.className =
        "catch-book";

    book.type =
        "button";


    book.textContent =
        "📖";


    /*
        Posisi horizontal random.
    */

    const randomLeft =
        8 +
        Math.random() * 84;


    book.style.left =
        randomLeft + "%";


    book.style.setProperty(
        "--book-rotation",
        (
            Math.random() * 40 -
            20
        ) + "deg"
    );


    /*
        Tangkap buku.
    */

    book.addEventListener(
        "click",
        () => {

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


            vibrateDevice(70);


            /*
                Buku berikutnya
                muncul setelah 2 detik.
            */

            if (
                booksCaught < 3
            ) {

                setTimeout(() => {

                    spawnCatchBook();

                }, 2000);

            } else {

                /*
                    Semua tertangkap.
                */

                setTimeout(() => {

                    openBookCover();

                }, 800);

            }

        }
    );


    container.appendChild(
        book
    );


    /*
        Kalau buku tidak ditangkap,
        tetap hilang setelah lewat.
        Tapi user harus menunggu
        buku berikutnya.
    */

    setTimeout(() => {

        if (
            !book.classList.contains(
                "book-caught"
            )
        ) {

            book.remove();

            /*
                Jangan menghilangkan
                kesempatan tangkap.
            */

            if (
                booksCaught <
                booksCreated
            ) {

                setTimeout(() => {

                    spawnCatchBook();

                }, 1000);

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
                        class="book-next-button">

                        BUKA BUKU

                    </button>

                </div>

            </div>

            <div class="book-open-hint">

                Klik bukunya untuk membuka

            </div>

        </div>

    `;


    const openButton =
        $("openBookBtn");


    if (openButton) {

        openButton.addEventListener(
            "click",
            openBook
        );

    }

}


/*
    Buka buku
*/

function openBook() {

    const book =
        $("book3d");

    if (book) {

        book.classList.add(
            "book-opening"
        );


        book.style.transform =
            `
            rotateX(8deg)
            rotateY(-25deg)
            scale(1.03)
            `;

    }


    /*
        Kamera tidak pindah.
        Hanya buku yang bergerak.
    */

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

    /*
        Bungkus foto dengan frame.
    */

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


/*
    Gallery → videos
*/

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


/*
    Videos → ending
*/

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
   ENDING TEXT
========================================================= */

function startEndingText() {

    const ending =
        $("endingText");

    if (!ending) return;


    /*
        Jangan isi ulang jika sudah ada.
    */

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


/* =========================================================
   PREVENT CONTEXT MENU
   (OPTIONAL)
========================================================= */

document.addEventListener(
    "contextmenu",
    event => {

        /*
            Jangan ganggu video.
        */

        if (
            event.target.tagName !==
            "VIDEO"
        ) {

            event.preventDefault();

        }

    }
);
