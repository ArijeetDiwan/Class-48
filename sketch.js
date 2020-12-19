var PLAY = 1;
var END = 0;
var gameState = PLAY;
var ninja, ninja_Running, ninja_collided,ninja_jump;
var ground, invisibleGround, groundImage;
var enemy,enemy_Running,enemy_collided,enemy_jumpAttack;
var cloudsGroup, cloudImage;
var enemyGroup, enemy1, enemy2, enemy3, enemy4, enemy5, enemy6;
var backimg;
var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  ninja_Running =   loadAnimation("Run (1).png","Run (2).png"),"Run (3).png","Run (4).png","Run (5).png","Run (6).png","Run (7).png","Run (8).png","Run (8).png","Run (9).png","Run (10).png";
  ninja_collided = loadAnimation("Dead (1).png","Dead (2).png","Dead (3).png","Dead (4).png","Dead (5).png","Dead (6).png","Dead (7).png","Dead (8).png","Dead (9).png","Dead (10).png");
  ninja_jump=loadAnimation("Jump (1).png","Jump (2).png","Jump (3).png","Jump (4).png","Jump (5).png","Jump (6).png","Jump (7).png","Jump (8).png","Jump (9).png","Jump (10).png");
  groundImage = loadImage("ground2.png");
  backimg=loadImage("bg7.jpg");
  enemy_Running= loadAnimation("Run__000.png","Run__001.png","Run__002.png","Run__003.png","Run__004.png","Run__005.png","Run__006.png","Run__007.png","Run__008.png","Run__009.png");
  enemy_collided=loadAnimation("Dead__000.png","Dead__001.png","Dead__002.png","Dead__003.png","Dead__004.png","Dead__005.png","Dead__006.png","Dead__007.png","Dead__008.png","Dead__009.png");
enemy_jumpAttack=loadAnimation("Jump_Attack__001.png","Jump_Attack__002.png","Jump_Attack__003.png","Jump_Attack__004.png","Jump_Attack__005.png","Jump_Attack__006.png","Jump_Attack__007.png","Jump_Attack__008.png","Jump_Attack__009.png");

  cloudImage = loadImage("cloud.png");
  
 
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  ninja = createSprite(50,height-20,20,50);
  //enemy=createSprite(width/2,height-20,20,20);
  ninja.addAnimation("Running", ninja_Running);
  ninja.addAnimation("collided", ninja_collided);
ninja.addAnimation("ninjajumping", ninja_jump);

  ninja.scale = 0.2;
  
  ground = createSprite(width,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+40);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  enemyGroup = new Group();
  
  score = 0;
}

function draw() {
  //Run.debug = true;
  background(backimg);
  text("Score: "+ score, width-150,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  console.log(ninja.y);
    if((touches.length>0||keyDown("space") )&& ninja.y >= height- 120) {
      ninja.velocityY = -12;
       touches=[];
ninja.changeAnimation("ninjajumping", ninja_jump)
    }
  
    ninja.velocityY = ninja.velocityY + 0.8
  ninja.changeAnimation("Running",ninja_Running);
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    ninja.collide(invisibleGround);
    spawnClouds();
    spawnenemy();
  
    if(enemyGroup.isTouching(ninja)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    ninja.velocityY = 0;
    enemyGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the Run animation
    ninja.changeAnimation("collided",ninja_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    enemyGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width,height-20,40,10);
    cloud.y = Math.round(random(80,height-20));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = ninja.depth;
    ninja.depth = ninja.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnenemy() {
  if(frameCount % 80=== 0) {
    var enemy = createSprite(width,height-35,10,40);
    //enemy.debug = true;
    enemy.velocityX = -(6 + 3*score/100);
    
    //generate random enemy
  enemy.addAnimation("enemyRunning",enemy_Running);
  enemy.addAnimation("enemycollided",enemy_collided);
  enemy.addAnimation("enemyjumpAttack",enemy_jumpAttack);

    //assign scale and lifetime to the enemy           
    enemy.scale = 0.3;
    enemy.lifetime = 300;
    //add each enemy to the group
    enemyGroup.add(enemy);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  enemyGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  ninja.changeAnimation("Running",ninja_Running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}