
// Set up canvas and context
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bgm = document.getElementById('bgm');
bgm.loop = true;

// Set up game variables
let isPlaying = false;
let isJumping = false;
let score = 0;
groundPNGPixels = 75;


const groundImage = new Image();
groundImage.src = './assets/ground.png';
const PlayerSpriteSheet = new Image();
PlayerSpriteSheet.src = './assets/spritesheet128.png';
const Background1Image = new Image();
Background1Image.src = './assets/Background_01.png';
const Background2Image = new Image();
Background2Image.src = './assets/Background_02.png';

const ground = {
  x: 0,
  y: (canvas.height-groundPNGPixels), // position the ground at the bottom of the canvas
  width: groundPNGPixels,
  height: groundPNGPixels,
};

const Background1 = {
  x: 0,
  y: 0,
  speed:1
}
const Background2 = {
  x: 0,
  y: 0,
  speed:2
}

// Set up player
const player = {
  width: 128,
  height: 128,
  PerRow: 10,
  rows: 1,
  total: 10,
  current: 0,
  x: 0,
  y: 0,
  originalspeed: 0,
  speed: 3,
  jumpHeight: 180,
  jumpHeightVariable: 0,
  jumpUp: true,
  jumpSpeed: 3
};
const frame = {
  Counter: 0,
  Delay: 0
}
player.originalspeed = player.speed
let groundYPosition = (canvas.height-groundPNGPixels-144)  + (24);
player.y = groundYPosition;
let midAir = 0;

function update() {
    // Check if player is playing
    if (!isPlaying) {
      return;
    }

    if(score>=100 && score<1000){
      player.speed = player.originalspeed + 1;
    }
    if(score>=1000 && score<10000){
      player.speed = player.originalspeed + 2;
    }
    frame.Delay = 32/player.speed;
    frame.Counter++;
    if (frame.Counter >= frame.Delay) {
      player.current = (player.current + 1) % player.total;
      frame.Counter = 0;
      score++;
    }

    player.jumpHeight = groundYPosition - (player.jumpHeightVariable);

    // Update ground position
    ground.x -= player.speed;
    Background1.x -= Background1.speed;
    Background2.x -= Background2.speed;

    // Check if ground is off screen
    if (ground.x + ground.width < 0) {
        ground.x = 0;
    }
    if (Background1.x <= (-canvas.width)) {
      Background1.x = 0;
    }
    if (Background2.x <= (-canvas.width)) {
      Background2.x = 0;
     }
}
  
  // Set up draw function
  function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(Background1Image, 0, 0, Background1Image.width, Background1Image.height, Background1.x, 0, canvas.width, canvas.height);
    ctx.drawImage(Background1Image, 0, 0, Background1Image.width, Background1Image.height, Background1.x + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(Background2Image, 0, 0, Background2Image.width, Background2Image.height, Background2.x, 0, canvas.width, canvas.height);
    ctx.drawImage(Background2Image, 0, 0, Background2Image.width, Background2Image.height, Background2.x + canvas.width, 0, canvas.width, canvas.height);

    // Draw ground
    let groundend = 0;
    while (true){
      if (groundend >= (canvas.width+ground.width)){
        break;
      }
      ctx.drawImage(groundImage, ground.x + groundend, ground.y, ground.width, ground.height);
      groundend = groundend + ground.width;
    }

    
    col = player.current % player.PerRow;
    if (isJumping){
      if (player.y>player.jumpHeight && player.jumpUp){
        player.y -= player.jumpSpeed;
        row = 0;
        col = 1;
        ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
      }
      if (player.y <= player.jumpHeight){
        if (midAir==16){
          player.y += player.jumpSpeed;
          player.jumpUp = false;
        }
        midAir++;
        row = 0;
        col = 2;
        ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
      }
      if (player.y<=groundYPosition && !player.jumpUp){
        if (player.y == groundYPosition){
          isJumping = false;
          player.jumpUp = true;
          midAir=0;
        }
        else{
        player.y += player.jumpSpeed;
        row = 0;
        col = 6;
        ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
        }
      }
    }
    else {
      row = 0; //running
    ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
    }

    
    
    ctx.font = '16px Arial';
    ctx.fillText(score, canvas.width - ctx.measureText(score).width - 10, 20);
  }
  
  // Set up game loop
  function loop() {
    if(!isPlaying){
      return;
    }
    update();
    draw();
    requestAnimationFrame(loop);
  }
  
  // Start game
  function startGame() {
    // Reset game variables
    bgm.currentTime = 0;
    bgm.play();
    midAir=0;
    isPlaying = true; 
    isJumping = false;
    score = 0;
    ground.x = 0;
    player.x = 0;
    player.y = groundYPosition;
    player.current = 0;
    player.jumpUp = true;
    // Start game loop
    loop();
  }
  function stopGame() {
    isPlaying = false;
    score = 0;
    ground.x = 0;
    player.current = 0;
    bgm.pause();
    
  }

  function restartGame() {
    if (isPlaying && startButton.innerHTML === 'Stop Game'){
      stopGame();
    }
    else if(!isPlaying && startButton.innerHTML === 'Start Game'){
      startGame();
    }
  }

  function pauseGame(){
    if (isPlaying && pauseButton.innerHTML === 'Pause'){
      isPlaying = false;
      bgm.pause();
    }
    else if(!isPlaying && pauseButton.innerHTML === 'Resume'){
      isPlaying = true;
      bgm.play();
      loop();
    }
  }

  function jump(){
    if(player.y == groundYPosition){
      isJumping = true;
      return;
    }
    else{
      return;
    }
  }
// Add event listener to start button

startButton.addEventListener('click', function() {
  if (startButton.innerHTML === 'Start Game') {
    restartGame();
    pauseButton.style.display = 'block';
    startButton.innerHTML = 'Stop Game';
  } else {
    restartGame();
    startButton.innerHTML = 'Start Game';
    pauseButton.style.display = 'none';
    pauseButton.innerHTML = 'Pause';
  }
});
pauseButton.addEventListener('click', function() {
  if (pauseButton.innerHTML === 'Pause') {
    pauseGame();
    pauseButton.innerHTML = 'Resume';
  } else {
    pauseGame();
    pauseButton.innerHTML = 'Pause';
  }
});
let keyDownTime = 0;
let elapsedTime = 0;
let spaceKeyDown = false;

document.addEventListener('keydown', function(event) {
  if (event.code === 'Space' && !spaceKeyDown) {
    keyDownTime = Date.now();
    spaceKeyDown = true;
  }
});
document.addEventListener('keyup', function(event) {
  if (event.code === 'Space' && spaceKeyDown) {
    elapsedTime = Date.now() - keyDownTime;
    spaceKeyDown = false;
    console.log(elapsedTime);
    if(elapsedTime<=80){
      player.jumpHeightVariable = 40*3;
    }
    if(elapsedTime>80 && elapsedTime<=180){
      player.jumpHeightVariable = ((elapsedTime-(elapsedTime%2))/2)*3;
    }
    if(elapsedTime>180){
      player.jumpHeightVariable = 90*3;
    }
    
    jump();
  }
});