var config = {
    apiKey: "AIzaSyC3QCF6eHHGENiOhrxjUCmbHXQIAk_OEqA",
    authDomain: "stay-alive-2ab57.firebaseapp.com",
    databaseURL: "https://stay-alive-2ab57.firebaseio.com",
    storageBucket: "stay-alive-2ab57.appspot.com",
};
firebase.initializeApp(config);
// ^^ DATABASE STUFF!! FOR STORING HIGH SCORE AND # OF TIMES THE GAME HAS BEEN PLAYED
// YOU CAN PRETTY MUCH IGNORE THIS


// IMPORTANT //\\//\\//\\//\\//\\//\\//\\
// THE TWO THINGS YOU'LL BE USING MOST OFTEN IN JavaScript ARE VARIABLES (var) AND FUNCTIONS;
// VARIABLES CAN STORE ANYTHING -> FROM NUMBERS, STRINGS(which are characters,letters,sentences, etc.), BOOLEANS (true OR false VALUES) AND MUCH MORE
// VARIABLES ARE REALLY USEFUL IF YOU WANT TO USE A VALUE MULTIPLE TIMES, OR YOU WANT A QUICK WAY TO REFERENCE (or get) THAT VALUE.


var canvas = document.getElementById("myCanvas");
// ^ THE CANVAS IS PRETTY MUCH OUR PLAYGROUND
// IT'S THE PLACE WHERE WE DISPLAY OUR GAME OBJECTS, SUCH AS THE OBSTACLES YOU HAVE TO AVOID

var ctx = canvas.getContext("2d");
// ^ THIS VARIABLE DEFINES THE CONTEXT OF OUR CANVAS, SAYING THAT WE'LL BE DRAWING ON A 2D SPACE
// THE CONTEXT (ctx) VARIABLE WILL BE USED LATER TO ACTUALLY DRAW OUR GRAPHICS ON THE SCREEN, INSIDE THE CANVAS.

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//^ THIS SETS THE CANVAS WIDTH AND HEIGHT TO MATCH YOUR BROWSER

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
//^ THIS PRETTY MUCH SAYS THAT EVERY TIME YOU RESIZE YOUR BROWSER WINDOW, THE CANVAS SHOULD BE RESIZED TO MATCH THE WINDOW SIZE


// BELOW ARE SOME OF THE VARIABLES THAT WE'LL BE USING ALL THROUGHOUT THE GAME
// THESE VARIABLES CAN PRETTY MUCH DEFINE ANYTHING IN THE GAME, AND ARE USUALLY INTEGERS, STRINGS(characters,letters,words and phrases), OR BOOLEANS.
// A LOT OF OTHER THINGS CAN BE PLACED INSIDE VARIABLES, SUCH AS OUR canvas AND ctx VARIABLES ABOVE
// VARIABLES ARE PRETTY MUCH USED TO HAVE A HANDY REFERENCE TO SOMETHING AT ALL TIMES, WHEN YOU KNOW THAT YOU'LL BE USING ITS VALUES MORE THAN ONCE.

var isGameOver = false;
// ^ DEFINES THAT AT THE BEGINNING OF THE GAME, THE GAME IS NOT YET OVER.
// ^ THIS IS TURNED TO TRUE WHENEVER YOUR CURSOR TOUCHES AN OBSTACLE, WHICH STOPS RENDERING OTHER BUBBLES

canDie = true;

var cursorX; // YOUR MOUSE X COORDINATE. WE'LL UPDATE THIS VARIABLE EVERY TIME YOU MOVE YOUR MOUSE
var cursorY; // YOUR MOUSE Y COORDINATE. WE'LL UPDATE THIS VARIABLE EVERY TIME YOU MOVE YOUR MOUSE

var squareSizeX = 10; // CURSOR SQUARE WIDTH

var squareSizeY = 10; // CURSOR SQUARE HEIGHT

var circles = []; // ARRAY IN WHICH EVERY OBSTACLE IS ADDED. RANDOM X AND Y COORDINATES WILL BE ADDED HERE IN THE FORM - circles = [[50,40],[100,200]]; .. ETC

var circleSize = 10; // DEFAULT SIZE OF THE CIRCLES

var intervalAddCircles = 100; // HOW OFTEN TO ADD NEW CIRCLES, IN MILLISECONDS. 1000 IS 1 SECOND.

var canvasBackgroundColor = "white";

var totalNumberOfCircles = 0;

var squareColor = "#FF0001"; // HEX CODE VALUE FOR THE SQUARE's COLOR. YOU CAN LOOK UP MORE COLOR CODES.

var circleColor = getRandomColor(); // HEX CODE VALUE FOR THE CIRCLE's COLOR. YOU CAN LOOK UP MORE COLOR CODES.

var shouldDisplayMouseMove = true; // THIS VALUE WILL GET UPDATED ON THE FLY FOR NOW, SO CHANGING IT WON'T AFFECT THE GAME.

var noMoveTimerOriginalVal = 5; // THIS DEFINES THE TIMEOUT VALUE IF YOU HAVEN'T MOVED YOUR MOUSE, IN SECONDS.

var noMoveTimer = noMoveTimerOriginalVal; // THIS VALUE WON'T AFFECT THE GAME, AS IT'S CONSTANTLY BEING UPDATED FROM THE ABOVE VARIABLE

var safeZoneAndMinMoveZone = 45;
// ^ THIS IS THE SIZE OF THE AREA THAT YOU HAVE TO MOVE OUT OF FOR YOU NOT TO BE CONSIDERED IDLE;
// ^ USED TO PREVENT THE USER FROM GOING IN CIRCLES, WHICH IS CONSIDERED CHEATING

var highScoreRef = firebase.database().ref('highscore/'); // < DATABASE STUFF < .. CHANGING THIS WILL BREAK THE DATABASE INTEGRATION
var highScore = "-";
// ^THE DEFAULT HIGH SCORE THAT IS DISPLAYED BEFORE IT'S FETCHED FROM THE DATABASE, WHICH USUALLY TAKES LESS THAN A SECOND.
// THIS VALUE IS UPDATED CONSTANTLY WITH YOUR HIGHEST SCORE
var totalTimesPlayedRef = firebase.database().ref('timesplayed/'); // < DATABASE STUFF < .. CHANGING THIS WILL BREAK THE DATABASE INTEGRATION
var totalTimesPlayed = "-";
// ^THE DEFAULT VALUE FOR HOW MANY TIMES THE GAME HAS BEEN EVER PLAYED.
// THIS VALUE IS INCREASED EVERY TIME YOU DIE AND START A NEW GAME

shouldAddCircles = true;
shouldRemoveCircles = false;

getDBValues();
// THIS CALLS THE BELOW getDBValues() FUNCTION AND TELLS THAT ALL THE CODE INSIDE IT SHOULD BE EXECUTED

function getDBValues() {
    totalTimesPlayedRef.on('value', function(snapshot) {
        totalTimesPlayed = snapshot.val();
        //^ SETS THE LOCAL totalTimesPlayed VARIABLE TO THE VARIABLE FROM THE DATABASE
    });
    highScoreRef.on('value', function(snapshot) {
        highScore = snapshot.val();
        //^ SETS THE LOCAL highScore VARIABLE TO THE VARIABLE FROM THE DATABASE
    });
}
//^ UPDATES THE totalTimesPlayed and highScore VARIABLES WITH THE VALUES FROM THE DATABASE EVERY TIME THE FUNCTION IS CALLED
//... SO, SINCE THE getDBValues() FUNCTION IS CALLED AT THE VERY BEGINNING OF THIS SCRIPT, >
//... EVERY TIME YOU LOAD THE GAME PAGE THE VALUES ARE PULLED FROM THE DATABASE AND DISPLAYED ON THE SCREEN ACCORDING TO THAT

// ~ DRAWING LOOP
var secondsAlive = 0;

var shouldSlideCircles = false;

var slideDirection = 0;

var slideAmount = 0.05;

var shouldIncreaseCircleSize = false;

var shouldDecreaseCircleSize = false;

var increaseSizeAmount = 0.05;

function drawingLoop() {
  
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    if (!isGameOver) {
        clearCanvas();
        //^ CALLS THE clearCanvas(); FUNCTION AND TELLS ITS CODE TO BE EXECUTED. READ THERE FOR INFO ON WHAT IT DOES.
      createBackgroundRect(canvasBackgroundColor);
        for (var i = 0; i < circles.length; i++) {
            createCircle(circles[i][0], circles[i][1], circles[i][2], circles[i][3]);
        }
        createSquare(cursorX, cursorY);
        ctx.fillText("HOW LONG CAN YOU STAY ALIVE? - " + secondsAlive + "s", canvas.width / 2, 30);
        ctx.fillText("PLAYED " + totalTimesPlayed + " TIMES", 150, canvas.height - canvas.height / 50);
        ctx.fillText("ALL-TIME HIGH: " + highScore, canvas.width - 180, canvas.height - canvas.height / 50);
        ctx.fillText(totalNumberOfCircles, canvas.width / 2, 65);
        if (shouldDisplayMouseMove) {
          ctx.font = "26px Arial";  
            ctx.fillText("CAN'T STAY IN ONE PLACE! YOU'LL DIE IN " + noMoveTimer, canvas.width / 2, canvas.height / 2);
        }
      
        for(i=0; i<circles.length; i++){
          if (shouldSlideCircles){
          switch(slideDirection){
            case 0:
               circles[i][1] = circles[i][1] + slideAmount;
            case 1:
              circles[i][0] = circles[i][0] + slideAmount;
              circles[i][1] = circles[i][1] + slideAmount;
            case 2:
              circles[i][0] = circles[i][0] + slideAmount;
            case 3:
              circles[i][0] = circles[i][0] + slideAmount;
              circles[i][1] = circles[i][1] - slideAmount;
            case 4:
              circles[i][1] = circles[i][1] - slideAmount;
            case 5:
              circles[i][0] = circles[i][0] - slideAmount;
              circles[i][1] = circles[i][1] - slideAmount;
            case 6:
              circles[i][0] = circles[i][0] - slideAmount;
            case 7:
              circles[i][0] = circles[i][0] - slideAmount;
              circles[i][1] = circles[i][1] +  slideAmount;
          }
        }
          if(shouldIncreaseCircleSize){
            circles[i][3] =circles[i][3] + increaseSizeAmount;
            setTimeout(function(){
              shouldIncreaseCircleSize = false;
            },getRandomNumber(500,3000));
          }
          
          if(shouldDecreaseCircleSize && circles[i][3] > 5){
            circles[i][3] =circles[i][3] - increaseSizeAmount;
            setTimeout(function(){
              shouldDecreaseCircleSize = false;
            },getRandomNumber(500,3000));
          }
          
          if(circles[i][0]<-circles[i][3]){
            circles[i][0] = canvas.width + circles[i][3];
          }
          if(circles[i][1]<-circles[i][3]){
            
            circles[i][1] = canvas.height + circles[i][3];
          }
      }
    }
}
//^ THE ABOVE CODE WILL BE EXECUTED EVERY 1 MILLISECOND, ACCORDING TO THE BELOW setInterval FUNCTION, WHICH GIVES YOU THE IMPRESSION OF MOTION.
// SINCE OUR CANVAS (SCREEN) IS CLEARED EVERY ONE MILLISECOND AT THE BEGINNING OF THIS FUNCTION AND NEW OBJECTS ARE GENERATED AFTER THAT, WE PERCEIVE THIS AS MOTION
// FOR EXAMPLE, OUR RED SQUARE MOVES WITH OUR CURSOR. THE cursorX and cursorY VARIABLES ARE UPDATED EVERY TIME YOU MOVE YOUR MOUSE.
// SO EVERY MILLISECOND, OUR RED SQUARE IS ERASED AND RE-DRAWN TO THE SCREEN.
setInterval(drawingLoop, 1);
//^ THIS IS THE LINE THAT TELLS THE drawingLoop FUNCTION TO BE RE-EXECUTED EVERY 1ms.

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
//^ WE'LL BE CALLING THIS FUNCTION SEVERAL TIMES THROUGHOUT OUR GAME.
// ALL THIS DOES IS TELLING OUR CANVAS CONTEXT TO CLEAR THE CANVAS.
// IT STARTS FROM THE COORDINATES (0,0) -> [WHICH ARE THE TOP LEFT OF THE CANVAS]
// THE canvas.width AND canvas.height VALUES USED SHOULD BE SELF EXPLANATORY


function createSquare(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, squareSizeX, squareSizeY);
    ctx.fillStyle = squareColor;
    ctx.fill();
    ctx.closePath();
}
//^ WE'LL BE CALLING THIS FUNCTION A LOT!
// FOR EXAMPLE, THIS IS CALLED IN THE drawingLoop() FUNCTION ABOVE EVERY 1ms.
// THE (x, y) VALUES SEEN IN "function createSquare(x, y) {" ARE USED IN THE LINE "ctx.rect(x, y, squareSizeX, squareSizeY);",
// EVERY TIME YOU CALL THIS FUNCTION YOU NEED TO PASS SOME COORDINATES WHERE YOU WANT THE SQUARE TO BE DRAWN
// Ex: USING "createSquare(50,100);" (WITHOUT QUOTES) WILL DRAW THE SQUARE AT 50(x-coordinate) AND 100(y-coordinate);


function createCircle(x, y, color, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function createBackgroundRect(color){
  ctx.beginPath();
  ctx.rect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}


canvas.addEventListener('mousemove', function(evt) {
    if (!isGameOver) {
        var mousePos = getMousePos(canvas, evt);
        if (Math.abs(mousePos.x - getCursorCoordinatesDelayed[0]) > safeZoneAndMinMoveZone && Math.abs(mousePos.y - getCursorCoordinatesDelayed[1]) > safeZoneAndMinMoveZone) {
            shouldDisplayMouseMove = false;
            noMoveTimer = noMoveTimerOriginalVal;
        }
        cursorX = mousePos.x - squareSizeX / 2;
        cursorY = mousePos.y - squareSizeY / 2;
        for (var i = 0; i < circles.length; i++) {
            var closenessX = Math.abs(circles[i][0] - mousePos.x);
            var closenessY = Math.abs(circles[i][1] - mousePos.y);
            if (closenessX < circles[i][3] && closenessY < circles[i][3] && canDie) {
                gameOver("YOU DIED! CLICK TO TRY AGAIN");
            }
        }
    }
});


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
// WHEN THIS FUNCTION IS CALLED, IT RETURNS CORRECTED VALUES FOR x AND y MOUSE COORDINATES
// NOT NECESSARY TO KNOW.. IT'S JUST MATH AND LOGIC.


function setEvery2s() {
    if (!shouldDisplayMouseMove) {
        shouldDisplayMouseMove = true;
    }
}
setInterval(setEvery2s, 2000);
// ^ EVERY 2 SECONDS CHECK IF shouldDisplayMouseMove IS FALSE (!shouldDisplayMouseMove => exclamation means opposite, so false).
// THEN IF IT'S FALSE, TURN IT BACK TO TRUE. THIS ALLOWS FOR CONSTANT RECHECKING IF YOU'RE MOVING YOUR MOUSE.
// THIS MEANS THAT THE TEXT WILL -WANT- TO GET DISPLAYED AGAIN, BUT IT WILL BE TURNED BACK TO FALSE IS YOU MOVE YOUR MOUSE. IN THAT CASE IT WON'T BE DISPLAYED.

var intervalIncreaseSize;


function getRandomSlideDirection(){
  slideDirection = Math.floor(Math.random() * 7)
}

function displayMoveText() {
  
  if (!isGameOver){
      secondsAlive++;
  }
  

  ctx.fillStyle = "#FFFFFF"
  ctx.fill();
  
  if (secondsAlive > 60 && secondsAlive % getRandomNumber(20,30) === 0){
    canvasBackgroundColor = circleColor;
    var hasRun = 0;
var handle = setTimeout(function(){
    canvasBackgroundColor = "white";
   hasRun++;
}, getRandomNumber(300,1200));
// Do this before it runs, and it'll never run

    if (hasRun === 1){
      clearTimeout(handle);
      hasRun = 0;
    }
  }
  
 
  
  
  if (secondsAlive % 10 === 0){
     if(getRandomNumber(0, 2) === 0){
       synchronizeColors();
     }
    if(getRandomNumber(0, 1) === 0){
      circleColor = getRandomColor();
    }
    
    switch(getRandomNumber(0,2)){
      case 0:
        shouldAddCircles= true;
        break;
      case 1:
        shouldAddCircles = false;
        break;
    }
    
    switch(getRandomNumber(0,2)){
      case 0:
        shouldRemoveCircles= true;
        break;
      case 1:
        shouldRemoveCircles = false;
        break;
    }
    
    switch(getRandomNumber(0,2)){
      case 0:
        shouldSlideCircles= true;
        break;
      case 1:
        shouldSlideCircles = false;
        break;
    }
    
    
    
    slideDirection = getRandomNumber(0,8);
    
    switch(getRandomNumber(0,4)){
      case 0:
        shouldIncreaseCircleSize = true;
        break;
    }
    
    switch(getRandomNumber(0,4)){
      case 0:
        shouldDecreaseCircleSize = true;
        break;
    }
    
  }
  
  if (circleSize < 4){
    shouldDecreaseCircleSize = false;
  }
  
  if(shouldSlideCircles === false && shouldRemoveCircles === false && shouldAddCircles === false && shouldIncreaseCircleSize === false){
    circleColor = getRandomColor();
    synchronizeColors();
  }
  
  if(circles.length === 0){
    shouldAddCircles = true;
  }
  
    if (shouldDisplayMouseMove && !isGameOver) {
        noMoveTimer = noMoveTimer - 1;
        if (noMoveTimer < 1 && canDie) {
            clearCanvas();
            gameOver("YOU WERE IDLE FOR TOO LONG! KEEP MOVING YOUR MOUSE");
        }
    }

}
setInterval(displayMoveText, 1000);
//^ EVERY SECOND TRY TO SEE IF shouldDisplayMouseMove IS TRUE
// IF IT'S TRUE THEN COUNT DOWN TO 0.
// WHEN THE COUNTDOWN REACHES 0, CLEAR THE CANVAS AND CALL THE gameOver() FUNCTION TO DISPLAY THE IDLE TEXT MESSAGE.

function getRandomColor(){
  return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
}

function getRandomNumber(min, max){
  return (Math.floor(Math.random() * (max-min)) + min);
}

function synchronizeColors(){
  for(i=0; i<circles.length; i++){
   circles[i][2] = circleColor;
  }
}


function slideCircles(){
  getRandomSlideDirection();
  shouldSlideCircles = true;
}


var intervalSlideCircles;

function setDBValues() {
    highScoreRef.on('value', function(snapshot) {
        if (snapshot.val() < totalNumberOfCircles) {
            firebase.database().ref('highscore/').set(totalNumberOfCircles);
        }
    });
    totalTimesPlayedRef.on('value', function(snapshot) {
        if (snapshot.val() < totalTimesPlayed) {
            firebase.database().ref('timesplayed/').set(totalTimesPlayed);
        }
    });
}

function gameOver(text) {

    shouldDisplayMouseMove = false;
    drawingLoop();
    isGameOver = true;
  totalNumberOfCircles = 0;
    secondsAlive = 0;
  
  var shouldIncreaseCircleSize = false;
var shouldDecreaseCircleSize = false;
  var shouldSlideCircles = false;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
}

getCursorCoordinatesDelayed = [];

function checkMouseCoordsDelayed() {
    getCursorCoordinatesDelayed = [];
    getCursorCoordinatesDelayed.push(cursorX);
    getCursorCoordinatesDelayed.push(cursorY);
}
setInterval(checkMouseCoordsDelayed, safeZoneAndMinMoveZone / 25 * 1000);


canvas.addEventListener("click", function() {
    if (isGameOver) {
        circles = [];
        noMoveTimer = noMoveTimerOriginalVal;
        isGameOver = false;
        totalTimesPlayed++;
    }
});


function addCircles() {
    if (!isGameOver) {
      if(shouldAddCircles){
        totalNumberOfCircles++;
        setDBValues();
        getDBValues();
        var circlesX;
        var circlesY;
        var circleCoords = [0, 0];
        circlesX = Math.random() * (canvas.width - 10) + 10;
        circlesY = Math.random() * (canvas.height - 10) + 10;
        if (Math.abs(circlesX - cursorX) < safeZoneAndMinMoveZone && Math.abs(circlesY - cursorY) < safeZoneAndMinMoveZone) {} else {
            circleCoords[0] = circlesX;
            circleCoords[1] = circlesY;
          circleCoords[2] = circleColor;
          circleCoords[3] = circleSize;
            circles.push(circleCoords);
        }
      } else if(shouldRemoveCircles){
        circles.splice(circles.length - 1, 1);
      }
        
    }
}

var intervalID = setInterval(addCircles, intervalAddCircles);
// ^ THIS TELLS THE addCircles FUNCTION TO REPEAT EVERY NUMBER OF MILISECONDS THAT IS DEFINED IN THE intervalAddCircles VARIABLE
