var mario1,mario1Img,mario2,mario2Img,mariodeadImg,coin,coinImg, ground,goombaGroup,coinGroup,rand;;
var goomba1,goomba1Img,goomba2Img,goomba3Img,mariodead,kingdom,kingdomImg,start,startImg;
var PLAY=1; 
var END=0;
var gameState="START";
var score=0;
var jumpSound , checkPointSound, dieSound;
localStorage ["HighScore"]=0;

//sound effects : https://www.prokerala.com/downloads/ringtones/download.php?id=30189
//great: https://themushroomkingdom.net/media/smb/wav
//https://themushroomkingdom.net/

//to load the image
function preload(){
  mario1Img=loadImage("sprites/mario1.gif");
  startImg=loadImage("sprites/start.png");
  kingdomImg = loadImage("sprites/kingdom.jpg");
  goomba1Img = loadImage("sprites/goomba1.gif");
  goomba2Img=loadImage("sprites/goomba2.png");
  goomba3Img=loadImage("sprites/goomba3.png");
  goomba4Img=loadImage("sprites/goomba4.png");
  goomba5Img=loadImage("sprites/goomba5.png");
  goomba6Img=loadImage("sprites/goomba6.png");
  coinImg=loadImage("sprites/coin.png");
  coin2Img=loadImage("sprites/coin2.png");
  coin3Img=loadImage("sprites/coin3.png");
  coin4Img=loadImage("sprites/coin4.png");
  mariodeadImg=loadImage("sprites/mariodead.jpg");
  bgImg=loadImage("sprites/bg.jpg");
  jump = loadSound("sprites/jumpS.wav");
  theme = loadSound("sprites/theme.mp3");
  coinSound = loadSound("sprites/coin.wav");
  gameOverSound=loadSound("sprites/gameover.wav");
  checkPointSound=loadSound("sprites/checkpoint.ogg");

}

//create the sprites(objects)
function setup() {
  createCanvas(1500,700);

  theme.play();
  
  kingdom=createSprite(750,350,1500,700);
  //kingdom.addImage(kingdomImg);
  kingdom.addImage(bgImg);
  kingdom.scale=10.5;

  start = createSprite(750,350,50,50);
  start.addImage(startImg);
  start.visible=true;
  start.scale=0.5;

  mario1=createSprite(90, 680, 50, 50);
  mario1.addImage(mario1Img);
  // mario1.debug=true;
  mario1.setCollider("circle",0,0,80);
  mario1.scale=1.2;

  ground=createSprite(750,680,1800,20);
  ground.visible=false;

  mariodead = createSprite(750,350,1500,700);
  mariodead.addImage(mariodeadImg);
  mariodead.visible=false;

  goombaGroup=createGroup();
  coinGroup=createGroup();

}

//working
function draw() {
  background(0);
  //console.log(gameState);

  if(gameState==="START"){
    theme.stop();
    start.visible=true;
    //console.log(start.x)
    mario1.visible=false;
      
    if(mousePressedOver(start)){
        gameState="PLAY";
        theme.play();
      }

  }

 

  //game : play state
  if(gameState==="PLAY"){

    start.destroy();
    mario1.visible=true;

    //kingdom
    kingdom.velocityX=-5;
   // console.log(kingdom.x);

   //movement 
    if(kingdom.x<0){
      kingdom.x=width/2;
    }

    //mario to jump
    if(keyDown("UP_ARROW")&& mario1.y >= 100 ){
      mario1.velocityY=-9;
      jump.play();
    }

    if(keyDown("LEFT_ARROW")&& mario1.x >= 115 ){
        mario1.x=mario1.x-9;
        jump.play();
    }

    if(keyDown("RIGHT_ARROW")&& mario1.x <= 1400 ){
        mario1.x=mario1.x+9;
        jump.play();
    }

    spawnCoin();
    spawnGoomba();

    //After the score of 100 - level 2 
    goombaGroup.velocityX = -(15 + 3* score/100);

    // score:   
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }

    if(mario1.isTouching(coinGroup)){
        coinGroup.destroyEach();
        score = score + Math.round(getFrameRate()/3);  
        coinSound.play();  
        // score=score+50;
    }

    if(mario1.isTouching(goombaGroup)){
        gameState="END";
        gameOverSound.play(); 
        theme.stop();       
    }  
  }

  //gravity of mario
  mario1.velocityY=mario1.velocityY+1;

  //mario to stand on the ground
  mario1.collide(ground);

  drawSprites();

  textSize(35);
  fill(255,255,255); 
  text("Score: " +score, 1180,100);
  text("High Score: "+localStorage["HighScore"],1180,150);

  if(gameState==="END"){

    mario1.velocityY=0;
    
    coinGroup.destroyEach();
    goombaGroup.destroyEach();
    coinGroup.setVelocityXEach(0);
    goombaGroup.setVelocityXEach(0);
    goombaGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    mariodead.visible=true;
    mario1.visible=false;
    kingdom.velocityX=0;     

    textSize(38);
    fill(255,255,255)
   
    text("Press 'r' to restart the game", 550,180);

    // to restart the game
    if(keyCode===114){
      reset();
      //start.visible=true;
    }
  }
  

}

function spawnCoin(){
    //to remove continues objects
    if(World.frameCount % 130 === 0){
    coin=createSprite(1500,500,10,10);
    coin.y=Math.round(random(180,650));    
    coin.scale=0.25;
    coin.velocityX=-15;
    
    //console.log(coin.x);
  
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: coin.addImage(coinImg);
             break;
      case 2: coin.addImage(coin2Img);
            break;
      case 3: coin.addImage(coin3Img);
        break;
      case 4:  coin.addImage(coin4Img);
            break;     
      default: break;
    }
  
    //depth
    coin.depth=mario1.depth;
    mario1.depth=mario1.depth+1;
  
    //lifetime
    //speed=distance/time --> t= d/s = 1500/5 =300
    coin.lifetime=300;

    coinGroup.add(coin);     
    }  
  }

  function spawnGoomba(){
    if(World.frameCount % 80 === 0){
    goomba=createSprite(1500,650,10,10);
    goomba.y=Math.round(random(180,620));
    goomba.velocityX=-12;
    goomba.scale=0.5;
    //goomba.debug=true;
    goomba.setCollider("circle",0,0,120);
    //console.log(goomba.x);
  
    var rand = Math.round(random(1,4));
    switch(rand) {
      
      case 1: goomba.addImage(goomba3Img);
        break;
      case 2:  goomba.addImage(goomba4Img);
            break;
      case 3:  goomba.addImage(goomba5Img);
            break;
      case 4:  goomba.addImage(goomba6Img);
            break;
      default: break;
    } 
  
    //depth
    goomba.depth=mario1.depth;
    mario1.depth=mario1.depth+1;  
    goombaGroup.add(goomba);  
    goomba.lifetime=300;
    }  
  }
  
  function reset(){
  gameState="START";
  start = createSprite(750,350,50,50);
  start.addImage(startImg);
  start.visible=true;
  start.scale=0.5;
  start.visible=true;
  if(localStorage ["HighScore"]<score){
    localStorage["HighScore"]=score;
  }
    score=0;
    coinGroup.destroyEach();
    goombaGroup.destroyEach();
    mariodead.visible=false;
    mario1.visible=true;
   
}
  
  