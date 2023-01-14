//Variables
let sky, ron, points,pinchos,ground,restart,gameOver, botiquin; // Los sprites
let ronImage, skyImage,pointsImage, pinchosImage, groundImage, gameOverImage, // Las imagenes
restartImage, botiquinImage;

// Grupos
let pointsGroup, pinchosGroup, botiquinGroup;

// Sonidos
let jumpSound, hitSound, coinCollectSound, curedSound, failedSound;

let velocObjects = -3; // Velocidad de los objetos
let pointsValue = 0; // Los puntos
let lives = 10; // Las vidas del jugador
let gameState = true; // El estado del juego

// Imagenes y sonidos cargados
function preload(){
    ronImage = loadImage("CubePlayer.png");
    skyImage = loadImage("Sky.png");
    pointsImage = loadImage("Money.png");
    pinchosImage = loadImage("pinchos.png");
    groundImage = loadImage("Ground.png");
    gameOverImage = loadImage("GameOver.png");
    restartImage = loadImage("Restart.png");
    botiquinImage = loadImage("Botiquin.png");

    jumpSound = loadSound("Jump.mp3");
    hitSound = loadSound("Hit.mp3");
    coinCollectSound = loadSound("Coin Collect.mp3");
    curedSound = loadSound("Cured.mp3");
    failedSound = loadSound("Falla.mp3");
}

// Creando los sprites y sus fisicas y también creando el canvas
function setup() {
    createCanvas(800,600);

    sky = createSprite(400,400,900,1250);
    sky.addImage(skyImage);
    sky.scale = 1.12;

    ground = createSprite(400,600,800,80);
    ground.addImage(groundImage);
    ground.x = ground.width / 2;
    ground.velocityX = velocObjects;

    ron = createSprite(50,520,250,250);
    ron.addImage(ronImage);
    ron.scale = 0.25;

    pointsGroup = new Group();
    pinchosGroup = new Group();
    botiquinGroup = new Group();
}

// Logica del juego
function draw() {
  background("black");

  if (gameState) { // Si el esta en TRUE entonces el juego ya empezo

     if (keyDown("space") && ron.y >= 520) { // Si el jugador toca la tecla espacio y la posicion Y es mayor o igual a la permitida entonces que salte
       ron.velocityY -= 20;
       jumpSound.play();
     }

     if (ground.x <= 380) { // Si el piso llego a su limite en X, entonces restaurar donde estaba
       ground.x = ground.width / 2;
     }

     botiquinGroup.collide(ground);

      if (pointsGroup.isTouching(ron) && pointsValue >= 0) { // Si el jugador toca una moneda o un punto entonces sumarle 1 al Score, además, destruye el objeto y la velocidad del jugador aumenta
        pointsGroup.destroyEach();
        velocObjects -= 0.25; // Aunque en realidad aumenta la velocidad del los objetos XD
        coinCollectSound.play();
        pointsValue += 1;
      } else if (pinchosGroup.isTouching(ron)) { // De lo contraro si toca un pincho entonces restale 1 a sus vidas
        pinchosGroup.destroyEach();
        hitSound.play();
        lives -= 1;
     }
     
     if (botiquinGroup.isTouching(ron) && lives < 10) { // Pero si el jugador toca un botiquin, que se cure
        botiquinGroup.destroyEach();
        curedSound.play();
        lives += 1;
     } else if (botiquinGroup.isTouching(ron) && lives == 10) { // Sino, que desparezca y suene un sonido de falla
        botiquinGroup.destroyEach();
        failedSound.play();
     }

     if (lives <= 0 && gameState) { // Si las vidas del jugador esta en 0 y el estado del juego esta en TRUE, entonces GAME OVER instantaneo
          gameState = false;
     }

     ron.velocityY += 0.8; // Despues de darle espacio, que baje :v
     ron.collide(ground); // El suelo se vuelve tocable :D

     spawnMoneyPoints(); // Que aparezca los puntos >:D
     spawnPinchos(); // Que aparezca los pinchos >:D
     spawnBotiquines();

     textSize(20); // Escalado de los textos
     fill(255); // Que se blanqueen los textos XD

     text("Score: " + pointsValue, 5,30); // Texto del Score
     text("Lives: " + lives, 5, 60);
     text("Velocity X: " + velocObjects, 100, 30); // Texto de la Velocidad X
     text("Velocity Y: " + ron.velocityY, 250,30); // Texto de la Velocidad Y

    } else { // Pero si el estado del juego es FALSE, osea ya termino el juego entonces...

    // Que se destruyan todos los objetos >:D
    pinchosGroup.destroyEach();
    pointsGroup.destroyEach();

    // Incluso a estos dos :v
    ground.destroy();
    ron.destroy();

    // No se que hace, pero lo pongo igualmente XD
    pinchosGroup.setVelocityYEach(0);
    pointsGroup.setVelocityYEach(0);

    // Creeme Game Over por favor ;D
    gameOver = createSprite(360,280,400,300);
    gameOver.addImage(gameOverImage);

    // Igualmente el botón de reiniciar :D
    restart = createSprite(360, 400, 400,50);
    restart.addImage(restartImage);

    if (mousePressedOver(restart)) { // Si el jugador le da click al boton, restaurar el juego
         location.reload();
    }

    textSize(20); // Igualmente el escalado del texto
    fill(255); // Muy blancos están los textos ;D
    text("Score: " + pointsValue, 320,350); // Texto del Score, para que puedas ver tu puntuación :D
  }

  drawSprites(); // Dibujame los sprites querido JavaScript u.u
}

// Función de spawnear los pinchos
function spawnPinchos() {
  let num = Math.round(random(500, 950));

  if (World.frameCount % 60 === 0) {
    let pi = createSprite(num,535,32,32);

    pi.addImage(pinchosImage);
    pi.shapeColor = "red";
    pi.scale = 0.85;
    pi.velocityX = velocObjects;
    pi.lifeTime = 150;

    pinchosGroup.add(pi);
  }
}

// Función de spawnear puntos o moneditas >:D
function spawnMoneyPoints() {
  let num1 = Math.round(random(500, 950))

  if (World.frameCount % 60 === 0) {
      let m = createSprite(num1, 535, 64, 64);

      m.addImage(pointsImage);
      m.shapeColor = "yellow";
      m.scale = 0.5;
      m.velocityX = velocObjects;
      m.lifeTime = 150;

      pointsGroup.add(m);
  }
}

function spawnBotiquines() {
  let num2 = Math.round(random(50, 700))

  if (World.frameCount % 60 === 0) {
      let b = createSprite(num2, 60, 64, 64);
      
      b.addImage(botiquinImage);
      b.shapeColor = "green";
      b.scale = 0.5;
      b.velocityY = 5;
      b.velocityX = velocObjects;
      b.lifeTime = 300;

      botiquinGroup.add(b);
  }
}
