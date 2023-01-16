
// Set up canvas and context
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bgm = document.getElementById('bgm');
bgm.loop = true;
bgm.volume=0.01;
// Set up game variables
let isPlaying = false;
let isJumping = false;
let score = 0;
groundPNGPixels = 75;


const groundImage = new Image();
groundImage.src = './assets/ground.png';
const PlayerSpriteSheet = new Image();
PlayerSpriteSheet.src = './assets/spritesheet128v2.png';
const Background1Image = new Image();
Background1Image.src = './assets/Background_01.png';
const Background2Image = new Image();
Background2Image.src = './assets/Background_02.png';
const smokeBigCloud = new Image();
smokeBigCloud.src = './assets/blacksmoke.png';
const smallGarbage = new Image();
smallGarbage.src = './assets/Garbage1.png';
const bigGarbage = new Image();
bigGarbage.src = './assets/Garbage2.png';
const deadlyGarbage = new Image();
deadlyGarbage.src = './assets/DeadlyGarbage.png';
const closedTrashCan = new Image();
closedTrashCan.src = './assets/TrashCanClosed.png';
const openTrashCan = new Image();
openTrashCan.src = './assets/TrashCanOpen.png';

const ground = {
  x: 0,
  y: (canvas.height-groundPNGPixels), // position the ground at the bottom of the canvas
  width: groundPNGPixels,
  height: groundPNGPixels,
};
const bigSmoke = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}
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
  x: 50,
  y: 0,
  originalspeed: 0,
  speed: 3,
  jumpHeight: 180,
  jumpHeightVariable: 0,
  jumpUp: true,
  jumpSpeed: 3
};
const playerBox = {
  x: player.x+32,
  y: player.y+8,
  width: player.width-64,
  height: player.height-16
};
//trash
const smallTrash = {
  x:canvas.width+64,
  y:0,
  width: 64,
  height: 64,
  isSpawned: false
}
const bigTrash = {
  x:canvas.width+128,
  y:0,
  width:96,
  height:96,
  isSpawned: false
}
const deadlyTrash = {
  x: canvas.width + 96,
  y:0,
  width:128,
  height:128,
  isSpawned: false
}
const trashCan = {
  x: canvas.width + 96,
  y:0,
  width:52,
  height:96,
  isSpawned: false,
  current: openTrashCan
}
const frame = {
  Counter: 0,
  Delay: 0
}
const pollution = {
  amount: 0,
  Counter: 0,
  Delay: 0
}
player.originalspeed = player.speed
let groundYPosition = (canvas.height-groundPNGPixels-144)  + (24);
player.y = groundYPosition;
let midAir = 0;
const isdrawBox = true;
let barWidth = 0;
const maxWidth = 100;

function checkCollision(a, b){
  if (a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.height + a.y > b.y) {
    return true;
  }
  else{
    return false;
  }
}

function drawBox(){
  if(!isdrawBox){
    return
  }
  // inside the checkCollision() function
  ctx.strokeStyle = "red"; // set the color of the rectangle border
  ctx.lineWidth = 2; // set the width of the rectangle border
  ctx.strokeRect(playerBox.x, playerBox.y, playerBox.width, playerBox.height); // draw the player bounding box
  ctx.strokeRect(deadlyTrash.x, deadlyTrash.y, deadlyTrash.width, deadlyTrash.height);
  ctx.strokeRect(smallTrash.x, smallTrash.y, smallTrash.width, smallTrash.height);
  ctx.strokeRect(bigTrash.x, bigTrash.y, bigTrash.width, bigTrash.height);
  ctx.strokeRect(trashCan.x, trashCan.y, trashCan.width, trashCan.height);
}
function spawnItem(item, itemImage, width, height){
  if (item.x <= -item.width){
    item.isSpawned = false;
  }
  if (item.isSpawned){
    item.x -= player.speed;
    ctx.drawImage(itemImage, 0, 0, itemImage.width, itemImage.height, item.x, item.y, width, height);
    return
  }
  if (!item.isSpawned){
    item.x = canvas.width+item.width;
  }
}

function update() {
    // Check if player is playing
    if (!isPlaying) {
      return;
    }

    pollution.Delay = 500;
    pollution.Counter++;
    if (pollution.Counter >= pollution.Delay) {
      pollution.Counter = 0;
      pollution.amount += player.speed;
    }

    if (Math.random() < 0.005 && !smallTrash.isSpawned){
      const random = Math.random();
      if (random<=0.33){
        smallTrash.y = canvas.height-ground.height-64;
      }
      else if(random>0.33 && random<=0.66){
        smallTrash.y = canvas.height-ground.height-256+24;
      }
      else{
        smallTrash.y = canvas.height-ground.height-384+24;
      }
      smallTrash.isSpawned = true;
    }

    if (Math.random() < 0.001 && !bigTrash.isSpawned){
      const random = Math.random();
      if (random<=0.33){
        bigTrash.y = canvas.height-ground.height-96;
      }
      else if(random>0.33 && random<=0.66){
        bigTrash.y = canvas.height-ground.height-256;
      }
      else{
        bigTrash.y = canvas.height-ground.height-384;
      }
      bigTrash.isSpawned = true;
    }

    if (Math.random() < 0.002 && !deadlyTrash.isSpawned){
      deadlyTrash.y = canvas.height-ground.height-110;
      deadlyTrash.isSpawned = true;
    }

    
    if (score>0 && score%400 == 0 && !trashCan.isSpawned){
      trashCan.y = canvas.height-ground.height-96;
      trashCan.isSpawned = true;
    }

    if(score>=100 && score<1000){
      player.speed = player.originalspeed + 1;
    }
    if(score>=1000 && score<2000){
      player.speed = player.originalspeed + 2;
    }
    if(score>=2000 && score<4000){
      player.speed = player.originalspeed + 3;
    }
    if(score>=4000 && score<8000){
      player.speed = player.originalspeed + 4;
    }
    if(score>=8000 && score<16000){
      player.speed = player.originalspeed + 5;
    }
    if(score>=16000){
      player.speed = player.originalspeed + 6;
    }
    playerBox.x = player.x+36;
    playerBox.y = player.y+8;
    frame.Delay = 32/player.speed;
    frame.Counter++;
    if (frame.Counter >= frame.Delay) {
      player.current = (player.current + 1) % player.total;
      frame.Counter = 0;
      score++;
      bigSmoke.x = bigSmoke.x-1;
    }
    bigSmoke.y = -500 + (pollution.amount*5);

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
     if (bigSmoke.x <=(-canvas.width)){
      bigSmoke.x = 0;
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

    if(smallTrash.isSpawned){
      spawnItem(smallTrash, smallGarbage, 64, 64);
    }
    if(bigTrash.isSpawned){
      spawnItem(bigTrash, bigGarbage, 96, 96);
    }
    if(deadlyTrash.isSpawned){
      spawnItem(deadlyTrash, deadlyGarbage, 128, 128);
    }
    if(trashCan.isSpawned){
      spawnItem(trashCan, trashCan.current, 52, 96);
    }

    col = player.current % player.PerRow;
    if (isJumping){
      if (player.y>=(groundYPosition-((32/player.speed)*player.jumpSpeed)) && player.jumpUp){
        player.y -= player.jumpSpeed;
        row = 0;
        col = 10;
        ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
        drawBox();
      }
      if (player.y<(groundYPosition-((32/player.speed)*player.jumpSpeed)) && player.y>=(groundYPosition-((32/player.speed)*player.jumpSpeed*2)) && player.jumpUp){
        player.y -= player.jumpSpeed;
        row = 0;
        col = 11;
        ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
        drawBox();
      }
      if (player.y<(groundYPosition-((32/player.speed)*player.jumpSpeed*2)) && player.y>player.jumpHeight && player.jumpUp){
        player.y -= player.jumpSpeed;
        row = 0;
        col = 13;
        ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
        drawBox();
      }
      if (player.y <= player.jumpHeight){
        if (midAir==12){
          player.y += player.jumpSpeed;
          player.jumpUp = false;
        }
        midAir++;
        row = 0;
        col = 12;
        ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
        drawBox();
      }
      if (player.y<=(groundYPosition-((32/player.speed)*player.jumpSpeed))  && !player.jumpUp){
        if (player.y == groundYPosition){
          isJumping = false;
          player.jumpUp = true;
          midAir=0;
        }
        else{
        player.y += player.jumpSpeed;
        row = 0;
        col = 10;
        ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
        drawBox();
        }
      }
      if (player.y<=groundYPosition && player.y>(groundYPosition-((32/player.speed)*player.jumpSpeed)) && !player.jumpUp){
        if (player.y == groundYPosition){
          isJumping = false;
          player.jumpUp = true;
          midAir=0;
          row = 0;
        col = 9;
        ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
        drawBox();
        }
        else{
        player.y += player.jumpSpeed;
        row = 0;
        col = 9;
        ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
        drawBox();
        }
      }
    }
    else {
      row = 0; //running
    ctx.drawImage(PlayerSpriteSheet, col*player.width, row*player.height, player.width, player.height, player.x, player.y, (128), (128))
    drawBox();
    }

    ctx.globalAlpha = 0.8;
    ctx.drawImage(smokeBigCloud, 0, 0, smokeBigCloud.width, smokeBigCloud.height, bigSmoke.x, bigSmoke.y, 960, 536);
    ctx.drawImage(smokeBigCloud, 0, 0, smokeBigCloud.width, smokeBigCloud.height, bigSmoke.x + canvas.width, bigSmoke.y, 960, 536);
    ctx.globalAlpha = 1;
    ctx.drawImage(smokeBigCloud, 0, 0, smokeBigCloud.width, smokeBigCloud.height, bigSmoke.x, bigSmoke.y-100, 960, 536);
    ctx.drawImage(smokeBigCloud, 0, 0, smokeBigCloud.width, smokeBigCloud.height, bigSmoke.x + canvas.width, bigSmoke.y-100, 960, 536);
    
    ctx.font = '16px Arial';
    ctx.fillText(score, canvas.width - ctx.measureText(score).width - 10, 20);
    ctx.fillStyle = "red";
    const pollutionText = "Pollution";
    ctx.fillText(pollutionText, 10, 20);
    ctx.strokeStyle = "red";
    ctx.strokeRect(10, 30, 100, 10);
    ctx.fillRect(10 , 30, pollution.amount, 10);
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
    player.x = 50;
    player.y = groundYPosition;
    player.current = 0;
    player.jumpUp = true;
    smallTrash.x = canvas.width;
    smallTrash.isSpawned = false;
    bigTrash.x = canvas.width;
    bigTrash.isSpawned = false;
    deadlyTrash.x = canvas.width;
    deadlyTrash.isSpawned = false;
    trashCan.x = canvas.width;
    trashCan.isSpawned = false;
    ctx.textAlign = "left";
    // Start game loop
    loop();
  }
  function stopGame() {
    ctx.font = "70px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
    ctx.font = "35px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Score: "+score, canvas.width/2, canvas.height/2+70);
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