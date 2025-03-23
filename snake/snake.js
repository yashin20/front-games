let ROWS = 30, COLS = 40; //field size
var y, x; //player point
var cy, cx; //coin point

var score;
var keepMove;
var moveState;
var speed;
var direction; //up,down,left,right

var snakeQueue = new Array();
var snakeColor = "#ED5B5B";  // 🔴 밝은 빨간색
var wallColor = "#2E2E2E";   // ⚫ 어두운 회색
var tileColor = "#EEEEEE";   // ⚪ 밝은 회색
var coinColor = "#FFD700";   // 🟡 금색


document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e){
  if(e.keyCode == 38 && direction != 1) direction = 0; //up-38
  else if(e.keyCode == 40 && direction != 0) direction = 1; //down-40
  else if(e.keyCode == 37 && direction != 3) direction = 2; //left-37
  else if(e.keyCode == 39 && direction != 2) direction = 3; //right-39
}


init();

function init() {
  drawBoard();
  drawWall();
  y=parseInt(ROWS/2);
  x=parseInt(COLS/2);
  setSnake(y,x);
  setCoin();
  score=0;
  direction=-1;
  speed=75
  keepMove = setInterval(function() {
    if (direction != -1) {
      move(direction);
    }
  }, speed);
  
}

function drawBoard(){
  var boardTag = "<table board=0>";
  for (var i=0; i<ROWS; i++) {
    boardTag += "<tr>";
    for (var j=0; j<COLS; j++) {
      boardTag += "<td id=\"" + String(i) + " " + String(j) + "\"></td>";
    }
    boardTag += "</tr>";
  }
  boardTag += "</table>";
  document.write(boardTag);
}

function drawWall(){
  var wallCell = new Array();
  //좌우 벽
  for (var i=0; i<ROWS; i++) {
    wallCell.push(new Array(i,0));
    wallCell.push(new Array(i,COLS-1));
  }
  //상하 벽
  for (var i=1; i<COLS-1; i++) {
    wallCell.push(new Array(0,i));
    wallCell.push(new Array(ROWS-1,i));
  }

  for(var i=0; i<wallCell.length; i++) {
    var wy = wallCell[i][0];
    var wx = wallCell[i][1];
    document.getElementById(String(wy) + " " + String(wx)).style.background = wallColor;
    document.getElementById(String(wy) + " " + String(wx)).style.borderRadius = "1.5px"
  }
}


function setSnake(y,x) {
  snakeQueue.push(new Array(y,x));
  document.getElementById(String(y)+" "+String(x)).style.background = snakeColor;
}
function removeSnake() {
  var ty = snakeQueue[0][0];
  var tx = snakeQueue[0][1];
  snakeQueue.shift();
  document.getElementById(String(ty)+" "+String(tx)).style.background = tileColor;
}


function move(dir) {
  switch(dir) {
    case 0: y-=1; break;
    case 1: y+=1; break;
    case 2: x-=1; break;
    case 3: x+=1; break;
    default: break;
  }
  if (isInvalidMove(y,x)) gameover();
  setSnake(y,x);
  meetCoin();
  scoring();
}


function meetCoin(){
  if(isCoin()) {
    score+=100*(snakeQueue.length-1); //몸통 길이(머리 제외)
    setCoin();
    showPlus();
    document.getElementById(String(y)+" "+String(x)).style.borderRadius = "3px";
  }
  else {
    removeSnake(y,x);
    score+=snakeQueue.length;
  }
}
function showPlus() {
  var plusedScore = 100*(snakeQueue.length-1);
  document.getElementById("plus").innerHTML = "    +"+plusedScore;
  setTimeout("document.getElementById(\"plus\").innerHTML=\"\"", 500);
}


//뱀 충돌 여부 체크
function isInvalidMove(y, x) {
  return (y==0 || y==ROWS-1 || x==0 || x==COLS-1) || isCollapsed(y, x);
}
//몸통 충돌여부
function isCollapsed(y, x) {
  if(isInQueue(y, x)) return true;
  return false;
}
function isInQueue(y, x) {
  for (var i=0; i<snakeQueue.length; i++) {
    if(snakeQueue[i][0] == y && snakeQueue[i][1] == x) return true;
  }
  return false;
}


//coin 생성 및 충돌
function setCoin(){
  do{
    var rand = parseInt(Math.random() * ((ROWS-2)*(COLS-2)));
    cy = parseInt(rand/(COLS-2)) +1;
    cx = rand%(COLS-2) +1;
  }while(isInQueue(cy, cx));
  document.getElementById(String(cy)+" "+String(cx)).style.background = coinColor;
  document.getElementById(String(cy)+" "+String(cx)).style.borderRadius = "6px";
}
function isCoin() {
  return (y==cy && x==cx);
}

//score 반영
function scoring() {
  document.getElementById("score").innerHTML = score;
}
function gameover(){
  alert("[Game Over]\nScore: "+score);
  init();
  location.reload();
}