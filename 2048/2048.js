//로컬 스토리지에 '2048-best' 명으로 최고 기록 저장!
const bestScore = document.querySelector('#best');
let best = Number(localStorage.getItem('2048-best')) || 0;
if (best != 0) {
  bestScore.textContent = best;
}

var SIZE = 4;

var board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];
var tableID = [
  ["00", "01", "02", "03"],
  ["10", "11", "12", "13"],
  ["20", "21", "22", "23"],
  ["30", "31", "32", "33"]
];
var score, moves, time;
var timer; // 타이머 변수


document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e){
  switch (e.keyCode) {
    case 38: moveDir(0); break; //up
    case 40: moveDir(1); break; //down
    case 37: moveDir(2); break; //left
    case 39: moveDir(3); break; //right
  }
}

init();
function init() {
  score = 0; //score 초기화
  moves = 0;
  time = 0;


  // 기존 타이머가 실행 중이면 초기화
  if (timer) clearInterval(timer);
  updateTime(); // 타이머 시작


  //board 초기화
  for (var i=0; i<4; i++) {
    for (var j=0; j<4; j++) {
      board[i][j] = 0;
    }
  }
  //초기 블록 생성(2개)
  for (var i=0; i<2; i++) {
    var rand = parseInt(Math.random() * 16);
    var y = parseInt(rand / 4);
    var x = rand % 4;
    if (board[y][x] == 0) board[y][x] = getNewNum();
    else i--;
  }
  update();
}

function update() {
  for (var i=0; i<4; i++) {
    for (var j=0; j<4; j++) {
      var cell = document.getElementById(tableID[i][j]); //<td>
      cell.innerHTML = board[i][j]==0 ? "" : board[i][j];
      coloring(cell);
    }
  }

  document.getElementById("score").innerHTML = score;
}

function coloring(cell){
  var cellNum = parseInt(cell.innerHTML);
  switch(cellNum){
      case 0:
      case 2:
          cell.style.color="#684A23";
          cell.style.background="#FBEDDC";
          break;
      case 4:
          cell.style.color="#684A23";
          cell.style.background="#F9E2C7";
          break;
      case 8:
          cell.style.color="#684A23";
          cell.style.background="#F6D5AB";
          break;
      case 16:
          cell.style.color="#684A23";
          cell.style.background="#F2C185";
          break;
      case 32:
          cell.style.color="#684A23";
          cell.style.background="#EFB46D";
          break;
      case 64:
          cell.style.color="#FFFFFF";
          cell.style.background="#EBA24A";
          break;
      case 128:
          cell.style.color="#FFFFFF";
          cell.style.background="#E78F24";
          break;
      case 256:
          cell.style.color="#FFFFFF";
          cell.style.background="#E87032";
          break;
      case 512:
          cell.style.color="#FFFFFF";
          cell.style.background="#E85532";
          break;
      case 1024:
          cell.style.color="#FFFFFF";
          cell.style.background="#E84532";
          break;
      case 2048:
          cell.style.color="#FFFFFF";
          cell.style.background="#E83232";
          break;
      default:
          if(cellNum>2048){
              cell.style.color="#FFFFFF";
              cell.style.background="#E51A1A";
          }
          else{
              cell.style.color="#684A23";
              cell.style.background="#FBEDDC";
          }
          break;
  }
}

function moveDir(dir) {

  //이전상태 저장
  savePreviousState();


  switch (dir) {
    case 0: move(); break; //up
    case 1: rotate(2); move(); rotate(2); break; //down
    case 2: rotate(1); move(); rotate(3); break; //left
    case 3: rotate(3); move(); rotate(1); break; //right
  }

  update();
}

/**
 * dir (0-up) (1-right) (2-down) (3-left)
 */
function rotate (dir) {
  while (dir--) {
    var tempBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    //tempBoard : currentBoard를 복사 
    for (var i=0; i<4; i++) {
      for (var j=0; j<4; j++) {
        tempBoard[i][j] = board[i][j];
      }
    }

    //시계방향으로 90도 회전
    for (var i=0; i<4; i++) {
      for (var j=0; j<4; j++) {
        board[j][3-i] = tempBoard[i][j];
      }
    }

  }
}

//up dir move
function move() {
  var isMoved = false;
  var isPlused = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  //가장 위쪽은 움직일 필요가 없음
  for (var i=1; i<4; i++) {
    for (var j=0; j<4; j++) {
      if (board[i][j]==0) continue;
      var tempY = i-1;
      //이동 가능한 칸 만큼 이동
      while (tempY>0 && board[tempY][j]==0) tempY--; 
      //빈 칸이면 이동
      if (board[tempY][j]==0) {
        board[tempY][j] = board[i][j];
        board[i][j] = 0;
        isMoved = true;
      }
      //다른 숫자일 경우
      else if(board[tempY][j] != board[i][j]) {
        if(tempY+1==i) continue;
        board[tempY+1][j] = board[i][j];
        board[i][j] = 0;
        isMoved = true;
      }
      //같은 숫자일 경우(합칠 수 있는 경우)
      else {
        //합쳐지지 않은 경우
        if (isPlused[tempY][j] == 0) {
          board[tempY][j] *= 2;
          score += board[tempY][j];
          board[i][j] = 0;
          isPlused[tempY][j] = 1;
          isMoved = true;
        }
        //이미 합쳐진 경우
        else {
          board[tempY+1][j] = board[i][j];
          board[i][j] = 0;
          isMoved = true;
        }
      }
    }
  }

  if(isMoved) {
    generate();
    movesCount();
  }
  else checkGameOver();
}

//generate new number
function generate() {
  // '0'칸 좌표 기록록
  var zeroPoints = [];
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] == 0) {
        zeroPoints.push([i, j]);
      }
    }
  }

  if (zeroPoints.length == 0) return;

  //0 ~ zeroPoints.length -1
  var randIdx = parseInt(Math.random() * zeroPoints.length); 
  var [x, y] = zeroPoints[randIdx]; //숫자를 생성할 좌표

  board[x][y] = getNewNum();
}

//create new number('4' : 10%, '2' : 90%)
function getNewNum() {
  var rand = parseInt(Math.random() * 10);
  if (rand == 0) return 4;
  return 2;
}

//return current game max score
function getMaxNum() {
  var ret = 0;
  for (var i=0; i<4; i++) {
    for (var j=0; j <4; j++) {
      ret = board[i][j] > ret ? board[i][j] : ret;
    }
  }
  return ret;
}

//game over check
function checkGameOver() {
  //column checking
  for (var i=0; i<4; i++) {
    var colCheck = board[i][0];
    if(colCheck == 0) return;
    for (var j=1; j<4; j++) {
      if (board[i][j]==0 || board[i][j]==colCheck) return;
      else colCheck = board[i][j]; //next
    }
  }

  //row checking
  for (var i=0; i<4; i++) {
    var rowCheck = board[0][i]; 
    if(rowCheck == 0) return;
    for (var j=1; j<4; j++) {
      if(board[j][i]==0 || board[j][i]==rowCheck) return;
      else rowCheck = board[j][i]; //next
    }
  }
  gameover();
}

function gameover(){
  clearInterval(timer); // 타이머 정지
  alert("[Game Over]\nMax: "+getMaxNum()
  +"\nScore: "+score 
  + "\nMoves: " + moves 
  +"\nTime: "+time);

  updateBestScore();
  init();
}


//best score update
function updateBestScore() {
  if (score > best) {
    best = parseInt(score);
    document.getElementById("best").innerHTML = best;
    localStorage.setItem('best', best);
  }
}

//'moves' count
function movesCount() {
  moves++;
  document.getElementById("moves").innerHTML = moves;
}

//'time' count
function updateTime() {
  timer = setInterval(function () {
    time++;
    document.getElementById("time").innerHTML = time;
  }, 1000);
}

//'New Game' 
document.getElementById("newGame").addEventListener("click", function () {
  init();
});


/**
 * undo
 */
var prevBoard = [];
var prevScore = 0;
var prevMoves = 0;

function savePreviousState() {
  prevBoard = board.map(row => [...row]);
  prevScore = score;
  prevMoves = moves;
}

document.getElementById("btnUndo").addEventListener("click", function () {
  undo();
});


function undo() {
  if (prevBoard.length === 0) return; // 저장된 상태가 없으면 실행 안 함

  // 이전 상태로 복원
  board = prevBoard.map(row => [...row]); 
  score = prevScore;
  moves = prevMoves;

  document.getElementById("moves").innerHTML = moves;
  update(); // 화면 업데이트
}
