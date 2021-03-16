var PLAY=1;
var END=0;
var WIN=2;
var START=3;
var gameState=START;
var bunny,bunnyIMG,bunnyStop,lava,lavaIMG,ground1,groundIMG,ground2;
var crate,crateIMG,crateGroup;
var ground=[];
var carrot,carrotIMG;
var score=0;
var gameOver,gamerOverIMG,gameOverSound;
var life=5;
var youWonSound;
var dieSound;
var spaceKeyPressed=25;
var black;
var cloud,cloudGroup,cloudImage;
var logo,logoImage;


function preload(){
  bunnyIMG=loadAnimation("bunny_running_1.png","bunny_running_2.png");
  lavaIMG=loadImage("lava image.png");
  groundIMG=loadImage("GroundTile.png");
  crateIMG=loadImage("Crate.png");
  bunnyStop=loadAnimation("bunny_go_1.png");
  carrotIMG=loadImage("carrot.png");
  gamerOverIMG=loadImage("gameOver.png");
  gameOverSound=loadSound("game over sound.mp4");
  youWonSound=loadSound("you win.mp4");
  dieSound=loadSound("die.mp3");
  cloudImage=loadImage("cloud.png");
  logoImage=loadImage("logo.png");


}

function setup() {
  createCanvas(windowWidth,windowHeight);

  ground1=createSprite(50,height-10,250,height-380);
  ground1.addImage(groundIMG);
  ground1.visible=false;

  ground2=createSprite(width-200,height-10,200,height-380);
  ground2.addImage(groundIMG);
  ground2.visible=false;

  lava=createSprite(width/2-75,height-5,245,height-385)
  lava.addImage(lavaIMG);
  lava.visible=false;

  bunny=createSprite(50,height-75,10,10);
  bunny.addAnimation("standing",bunnyStop);
  bunny.addAnimation("running",bunnyIMG);
  bunny.visible=false;

  carrot=createSprite(width-200,height-70,200,height-380);
  carrot.addImage(carrotIMG);
  carrot.visible=false;

  gameOver=createSprite(windowWidth/2,windowHeight/2,10,10);
  gameOver.addImage(gamerOverIMG);
  gameOver.scale=0.5
  gameOver.visible=false;

  logo=createSprite(windowWidth/2,175);
  logo.addImage(logoImage);
  logo.visible=true;

  ground=[ground1,ground2];

  crateGroup=new Group();
  cloudGroup=new Group();

}

function draw() {


  if(gameState===START){
    background(0);

    textSize(30);
    fill("yellow");
    text("Press s Key To Start",windowWidth/2-200,windowHeight/2+50);

    textSize(20);
    text("you have 5 life and 25 jumps to cross the lava using space key",windowWidth/2-250,windowHeight/2+75);

    if(keyDown("s")){
      gameState=PLAY;
      ground1.visible=true;
      ground2.visible=true;
      lava.visible=true;
      bunny.visible=true;
      carrot.visible=true;
      logo.visible=false;
    }

  }  

  if(gameState===PLAY){

    background("lightBlue"); 

  if(keyDown("RIGHT_ARROW")&&(bunny.isTouching(ground1)||bunny.isTouching(ground2))){
    bunny.x+=5
  }

  if(keyDown("LEFT_ARROW")&&(bunny.isTouching(ground1)||bunny.isTouching(ground2))){
    bunny.x-=5
  }

  if(keyDown("LEFT_ARROW")||keyDown("RIGHT_ARROW")){
    bunny.changeAnimation("running",bunnyIMG);
  }

 /* if(keyDown("SPACE")){
    bunny.velocityY=-2;
    bunny.velocityX=2;
    spaceKeyPressed-=1;
  }*/

  if(spaceKeyPressed !=0 && keyWentDown("SPACE") && bunny.y>500){
    bunny.velocityY=-25;
    bunny.velocityX=2;
    spaceKeyPressed-=1;
    console.log(bunny.y);
  }

  if(crateGroup.isTouching(bunny)){
    bunny.velocityY=0;
   
  }

  if(carrot.isTouching(bunny)){
    score++;
  }

  

  if(lava.isTouching(bunny)){
    bunny.velocityY=0;
    bunny.velocityX=0;
    bunny.x=100;
    bunny.y=height-75;
    bunny.changeAnimation("standing",bunnyStop);
    life-=1;
    dieSound.play();

  }

  if(life===0){
    gameState=END;
    gameOverSound.play();
  }

  if(score===1){
    gameState=WIN;
    youWonSound.play();
  }


  spawnCrate();
  spawnClouds();

 } 

 if(gameState===END){
   crateGroup.setVelocityYEach(0);
   gameOver.visible=true;
   crateGroup.setLifetimeEach(-1);
   cloudGroup.setVelocityXEach(0);
   cloudGroup.setLifetimeEach(-1);
 }

 if(gameState===WIN){
   carrot.visible=false;
   bunny.velocityX=0;
   bunny.changeAnimation("standing",bunnyStop);
   crateGroup.setVelocityYEach(0);
   crateGroup.setLifetimeEach(-1);
   cloudGroup.setVelocityXEach(0);
 }

 if(keyDown("r")){
   gameState=PLAY;
   life=5;
   score=0;
   spaceKeyPressed=20;
   crateGroup.setVelocityYEach(2);
   bunny.x=75;
   bunny.y=height-75;
   bunny.changeAnimation("standing",bunnyStop);
   gameOver.visible=false;
   carrot.visible=true;
   cloudGroup.destroyEach();
   crateGroup.destroyEach();
 }

 bunny.velocityY+=1;

  bunny.collide(ground);

  drawSprites();
  textSize(25);
  fill("white");
  text("Carrots Eaten:"+score,windowWidth-200,80);
  text("Life:"+life,windowWidth-200,110);
  text("jumps:"+spaceKeyPressed,windowWidth-200,140);

  if(gameState===WIN){
    fill("blue");
    text("YOU WIN",windowWidth/2,windowHeight/2);
    text("Press 'r' To Restart",windowWidth/2-10,windowHeight/2+50);
  }

  if(gameState===END){
    fill("blue");
    text("Press 'r' To Restart",windowWidth/2-100,windowHeight/2+50);
  }


}

function spawnCrate(){
  if(frameCount%120===0){
    var randx=Math.round(random(width/2-400,width/2+400));
    var randy=Math.round(random(height/2-100,height/2+100));

    crate=createSprite(randx,0,50,100);
    crate.velocityY=2;
    crate.addImage(crateIMG);
    crate.scale=0.15;
    crate.lifetime=300;
    crateGroup.add(crate);
  }

}

function spawnClouds(){
  if(frameCount%240===0){
    var randx=Math.round(random(width/2-400,width/2+400));
    var randy=Math.round(random(height/12,height/4));

    cloud=createSprite(windowWidth,randy,50,100);
    cloud.velocityX=-2;
    cloud.addImage(cloudImage);
    cloud.scale=0.3;
    cloud.lifetime=width;
    cloudGroup.add(cloud);
  }

}