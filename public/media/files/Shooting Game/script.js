let bird = document.getElementById('bird');
let score = 0;
let addingScore = true;
let thought = document.getElementById("thought");
let add = "add";
let sub = "sub";
let isReactRunning = false;

let backgroundMusic1 = document.getElementById("background-1");
let backgroundMusic2 = document.getElementById("background-2");
let backgroundMusic3 = document.getElementById('background-3');
let backgroundMusic4 = document.getElementById('background-4');
let loose1 = document.getElementById('loose-1');
let loose2 = document.getElementById('loose-2');
let loose3 = document.getElementById('loose-3');
let loose4 = document.getElementById('loose-4');
let loose5 = document.getElementById('loose-5');
let win1 = document.getElementById("win-1");
let win2 = document.getElementById("win-2");
let win3 = document.getElementById("win-3");
let win4 = document.getElementById("win-4");
let win5 = document.getElementById("win-5");

backgroundMusic1.volume = 0.2;
backgroundMusic2.volume = 0.2;
backgroundMusic3.volume = 0.2;
backgroundMusic4.volume = 0.2;

backgroundMusic1.play();

backgroundMusic1.onpause = () => {
    backgroundMusic2.play();
}

backgroundMusic2.onpause = () => {
    backgroundMusic3.play();
}

backgroundMusic3.onpause = () => {
    backgroundMusic4.play();
}

backgroundMusic4.onpause = () => {
    backgroundMusic1.play();
}

const React = (e) => {
    if (isReactRunning) {
        return;
    }
    isReactRunning = true;

    let loose = [
        'Oopsie-daisy!',
        'Better luck next time!',
        'Oh noes!',
        'Whoops-a-doodle!',
        'Epic fail!',
    ];
    let win = [
        'Congratulations, champ!',
        "You're a winner!",
        'Victory dance!',
        'Way to go!',
        'Winner winner, chicken dinner!',
    ];
    if (e === 'add') {
        const randomWin = Math.floor(Math.random() * win.length);
        if (randomWin === 0) {
            win1.play();
            console.log("1");
            console.log(win[randomWin]);
        } else if (randomWin === 1) {
            win2.play();
            console.log("2");
            console.log(win[randomWin]);
        } else if (randomWin === 2) {
            win3.play();
            console.log("3");
            console.log(win[randomWin]);
        } else if (randomWin === 3) {
            win4.play();
            console.log("4");
            console.log(win[randomWin]);
        } else if (randomWin === 4) {
            win5.play();
            console.log("5");
            console.log(win[randomWin]);
        }
        thought.innerHTML = win[randomWin];
    } else {
        const randomLoose = Math.floor(Math.random() * loose.length);
        if (randomLoose === 0) {
            loose1.play();
            console.log("1");
            console.log(loose[randomLoose]);
        } else if (randomLoose === 1) {
            loose2.play();
            console.log("2");
            console.log(loose[randomLoose]);
        } else if (randomLoose === 2) {
            loose3.play();
            console.log("3");
            console.log(loose[randomLoose]);
        } else if (randomLoose === 3) {
            loose4.play();
            console.log("4");
            console.log(loose[randomLoose]);
        } else if (randomLoose === 4) {
            loose5.play();
            console.log("5");
            console.log(loose[randomLoose]);
        }
        thought.innerHTML = loose[randomLoose];
    }

    setTimeout(() => {
        isReactRunning = false;
    }, 500)
}

setInterval(() => {
    document.getElementById("score").innerHTML = `Score : ${score}`;
}, 100);

const selectionDirection = () => {
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    if (randomNumber == 1) {
        return 'right-to-left';
    } else {
        return 'left-to-right';
    }
}

const moveBird = (direction) => {
    if (direction === "right-to-left") {
        bird.classList.add("right-to-left");
        bird.classList.remove("left-to-right");
    } else {
        bird.classList.remove("right-to-left");
        bird.classList.add("left-to-right");
    }
}

function AutoChangingDirection() {
    let direction = selectionDirection();
    moveBird(direction);
}

const checkCollision = () => {
    const birdComputeStyle = getComputedStyle(bird);
    const birdX = parseInt(birdComputeStyle.getPropertyValue("left"));
    const birdWidth = parseInt(birdComputeStyle.getPropertyValue("width"));
    const leftCheckerX = parseInt(getComputedStyle(document.getElementById("left-checker")).getPropertyValue('left'));
    const rightCheckerX = parseInt(getComputedStyle(document.getElementById("right-checker")).getPropertyValue('left'));
    const leftCheckerWidth = parseInt(getComputedStyle(document.getElementById("left-checker")).getPropertyValue("width"));
    const rightCheckerWidth = parseInt(getComputedStyle(document.getElementById("right-checker")).getPropertyValue("width"));
    const birdTouchedLeftChecker = (birdX + birdWidth) >= leftCheckerX && birdX <= leftCheckerX + leftCheckerWidth;
    const birdTouchedRightChecker = birdX <= rightCheckerX + rightCheckerWidth && (birdX + birdWidth) >= rightCheckerX;
    if (birdTouchedLeftChecker || birdTouchedRightChecker) {
        addingScore = false;
        AutoChangingDirection();
        setTimeout(() => { addingScore = true }, 500);
        if (score == 0) {
        } else {
            score--;
        }
        React(sub);
    }
}

let birdDirection = selectionDirection();

setInterval(() => {
    checkCollision();
}, 5);

function update() {
    const birdComputeStyle = getComputedStyle(bird);
    const birdX = parseInt(birdComputeStyle.getPropertyValue("left"));
    const birdWidth = parseInt(birdComputeStyle.getPropertyValue("width"));
    const leftCheckerX = parseInt(getComputedStyle(document.getElementById("left-checker")).getPropertyValue('left'));
    const rightCheckerX = parseInt(getComputedStyle(document.getElementById("right-checker")).getPropertyValue('left'));
    const leftCheckerWidth = parseInt(getComputedStyle(document.getElementById("left-checker")).getPropertyValue("width"));
    const rightCheckerWidth = parseInt(getComputedStyle(document.getElementById("right-checker")).getPropertyValue("width"));
    const birdMoved = birdX !== parseInt(birdComputeStyle.getPropertyValue("left"));
    if (birdMoved) {
        checkCollision();
        requestAnimationFrame(update);
    }
}

update();

const moveRandomY = () => {
    const RandomY = (Math.floor(Math.random() * 80) + 5) + "%"
    return RandomY;
}

setInterval(() => {
    const valueY = moveRandomY();
    bird.style.top = valueY;
    bird.style.transition = "all 0.5s linear";
}, 200);

const Score = () => {
    if (addingScore == true) {
        score++;
    } else {
        if (score == 0) {
        } else {
            score--;
        }
    }
}

bird.addEventListener('click', () => {
    Score();
    React(add);
    bird.style.display = "none";
    setTimeout(() => {
        AutoChangingDirection();
        bird.style.display = "block";
    }, 1000);
});

function HACK(e){
score = score + e
}

window.onload = ()=>{
backgroundMusic1.play();
}

document.body.click()
document.body.click()
document.body.click()
document.body.click()
backgroundMusic1.click()
let currentMusic = backgroundMusic1; // Initialize currentMusic to backgroundMusic1
let playNext = true; // Flag to control playing the next music

setInterval(() => {
    if (playNext) {
        currentMusic.play();
        console.log("PLAYED");
        playNext = false; // Set playNext to false to prevent immediate play of the next music
    }

    currentMusic.onended = () => {
        playNext = true; // Set playNext to true when current music ends
        if (currentMusic === backgroundMusic1) {
            currentMusic = backgroundMusic2;
        } else if (currentMusic === backgroundMusic2) {
            currentMusic = backgroundMusic3;
        } else if (currentMusic === backgroundMusic3) {
            currentMusic = backgroundMusic4;
        } else {
            currentMusic = backgroundMusic1;
        }
    };
}, 2000);