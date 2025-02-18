//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
// let birdImg;
let birdImgs = [];
let birdImgsIndex = 0;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
//sounds
let wingSound = new Audio('./sfx_wing.wav');
wingSound.preload = 'auto';
let hitSound = new Audio('./sfx_hit.wav');
let bgm = new Audio('./bgm_mario.mp3');
bgm.preload = 'auto';
bgm.loop = true;
let point = new Audio('./sfx_point.wav');
let fall = new Audio('./sfx_die.wav');

window.onload = function () {
  board = document.getElementById('board');
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext('2d'); //used for drawing on the board

  //draw flappy bird
  // context.fillStyle = "green";
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);

  //load images
  // birdImg = new Image();
  // birdImg.src = "./flappybird.png";
  // birdImg.onload = function() {
  //     context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  // }

  for (let i = 0; i < 4; i++) {
    let birdImg = new Image();
    birdImg.src = `./flappybird${i}.png`;
    birdImgs.push(birdImg);
  }

  topPipeImg = new Image();
  topPipeImg.src = './toppipe.png';

  bottomPipeImg = new Image();
  bottomPipeImg.src = './bottompipe.png';

  requestAnimationFrame(update);
  setInterval(placePipes, 1500); //every 1.5 seconds
  setInterval(animateBird, 200);

  document.addEventListener('keydown', (e) => {
    moveBird(e);
  });

  // 2) Mouse clicks and mobile taps - used poitnerdown as more mordern
  board.addEventListener('pointerdown', (e) => {
    moveBird(e);
  });

  //   // 3) Touch taps
  //   board.addEventListener('touchstart', (e) => {
  //     e.preventDefault();
  //     moveBird(e);
  //   });
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  // bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
  // context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  context.drawImage(
    birdImgs[birdImgsIndex],
    bird.x,
    bird.y,
    bird.width,
    bird.height
  );
  // birdImgsIndex++;
  // birdImgsIndex %= birdImgs.length;

  if (bird.y > board.height) {
    gameOver = true;
    fall.play();
  }

  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
      pipe.passed = true;
      point.play();
    }

    if (detectCollision(bird, pipe)) {
      hitSound.play();
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //removes first element from the array
  }

  //score
  context.fillStyle = 'white';
  context.font = '45px sans-serif';
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText('GAME OVER', 5, 90);
    bgm.pause();
    bgm.currentTime = 0;
    setTimeout(() => {
      fall.play();
    }, 500);
  }
}

function animateBird() {
  birdImgsIndex++;
  birdImgsIndex %= birdImgs.length;
}

function placePipes() {
  if (gameOver) {
    return;
  }

  //(0-1) * pipeHeight/2.
  // 0 -> -128 (pipeHeight/4)
  // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  // Keyboard triggers
  if (e.code == 'Space' || e.code == 'ArrowUp' || e.code == 'KeyX') {
    jump();
  }

  // Mouse or touch triggers
  // (They don't have e.code, so we just call jump()
  // to do the same action)
  if (e.type === 'pointerdown') {
    jump();
  }
}

function jump() {
  //sound
  if (bgm.paused) {
    bgm.play();
  }
  //   bgm.play(); disabled as might be causing lag on mobile.
  wingSound.play();
  velocityY = -6;
  if (gameOver) {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
  }
}
function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}
