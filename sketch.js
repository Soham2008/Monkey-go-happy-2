var monkey, monkey_running, monkeyCollide;
var ground, invisibleGround, groundImg;
var banana, bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var score = 0;
var bananaScore = 0;
var PLAY = 0;
var END = 1;
var gameState = PLAY;
var jumpSound;
var gameOverSound;
var checkPointSound;
var restart, restartImage;
var bananaCheckPointSound;


function preload() {

  monkey_running = loadAnimation("monkey_0.png", "monkey_1.png", "monkey_2.png", "monkey_3.png", "monkey_4.png", "monkey_5.png", "monkey_6.png", "monkey_7.png", "monkey_8.png")

  monkeyCollide = loadAnimation("monkey_1.png");

  groundImg = loadAnimation("ground.jpg")

  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");

  jumpSound = loadSound("JumpSound.mp3")

  gameOverSound = loadSound("GameOverSound.mp3")

  checkPointSound = loadSound("checkPointSound.mp3")

  restartImage = loadImage("restart.png")

  BananaCheckPointSound = loadSound("BananaCheckPointSound.mp3")

}


function setup() {

  createCanvas(600, 300);

  obstacleGroup = createGroup();
  bananaGroup = createGroup();


  monkey = createSprite(80, 270, 10, 10);
  monkey.scale = 0.12;
  monkey.addAnimation("monkey", monkey_running);
  monkey.addAnimation("collide", monkeyCollide);

  ground = createSprite(300, 340, 600, 10);
  ground.scale = 1;

  ground.addAnimation("ground", groundImg);

  invisiGround = createSprite(300, 278, 600, 7);
  invisiGround.visible = false;

  restart = createSprite(320, 195, 0, 0);
  restart.scale = 0.5
  restart.addImage("restart", restartImage)

}


function draw() {

  background("skyblue");
  fill("black");
  text("SURVIVAL TIME: " + score, 470, 20);
  text("BANANAS COLLECTED: " + bananaScore, 300, 20);

  if (gameState === PLAY) {

    restart.visible = false;

    obstacles();
    bananas();
    score = score + Math.round(getFrameRate() / 60);

    ground.velocityX = -(8 + score * 1.5 / 100);

    if (keyDown("space") && monkey.y >= 235) {

      monkey.velocityY = -15;
      jumpSound.play();

    }

    if (score > 0 && score % 200 === 0) {

      checkPointSound.play()

    }

    monkey.velocityY = monkey.velocityY + 0.8

    if (ground.x < 0) {

      ground.x = ground.width / 2;

    }

    if (monkey.isTouching(bananaGroup)) {

      bananaScore++;
      bananaGroup.destroyEach();
      BananaCheckPointSound.play();

    }

    if (monkey.isTouching(obstacleGroup)) {

      gameState = END;
      gameOverSound.play();

    }

  }

  if (gameState === END) {

    ground.velocityX = 0;

    restart.visible = true;

    monkey.y = 235;
    monkey.scale = 0.12;
    monkey.changeAnimation("collide", monkeyCollide);

    obstacleGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
    fill("Magenta")
    stroke("black")
    textSize(30);
    text("GAME OVER", 220, 170);

    if (mousePressedOver(restart)) {

      reset();

    }

  }

  drawSprites();

  monkey.collide(invisiGround);

}


function bananas() {

  if (frameCount % 80 === 0) {

    banana = createSprite(620, 120, 50, 50)
    banana.addAnimation("banana", bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -(4 + score * 1.5 / 100);
    banana.lifetime = 220;
    bananaGroup.add(banana);
    bananaGroup.add(banana);

  }

}


function obstacles() {

  if (frameCount % 200 === 0) {

    obstacle = createSprite(620, 253, 50, 50);
    obstacle.addAnimation("rock", obstacleImage);
    obstacle.setCollider("circle", 0, 0, 180);
    obstacle.scale = 0.13;
    obstacle.velocityX = -(4 + score * 1.5 / 100);
    obstacle.lifetime = 220;
    obstacleGroup.add(obstacle);

  }

}


function reset() {

  obstacleGroup.destroyEach();
  monkey.changeAnimation("monkey", monkey_running);
  score = 0;
  bananaScore = 0;
  gameState = PLAY;

}