/**
 * 게임 설정 변수
 */
var ROWS = 24, COLS = 12;  //game field size : 10 X 20 (wall 세로 2자리 + 가로 2자리)
var tileColor = "rgb(9, 17, 26)"; //빈 타일 색상
var shapeColor, nextColor; //현재 블록 색상 / 다음 블록 색상상
var wallColor = "rgb(6,37,72)"; //경계석 색상



var movingThread, movingSpeed; //블록 이동 속도
var fastMode = false; 
var initSpeed = 500; //기본 속도 (낮을수록 빠름)
var deltaSpeed = 20; //레벨 상승시 속도 변화량
var fastSpeed = 25; //빠르게 내리는 속도
var isPaused = false; //게임 퍼즈 상태 여부


/**
 * 테크로미노 변수 설정
 */
//테크로미노 7종류 - 총 변형 모양 19개 (y, z)
var shapeArray = [
    // I shape - 2 (0,1)
    [[1,0], [1,1], [1,2], [1,3]],
    [[0,1], [1,1], [2,1], [3,1]],
    // O shape - 1 (2)
    [[0,1], [0,2], [1,1], [1,2]],
    // T shape - 4 (3,4,5,6)
    [[0,1], [1,0], [1,1], [1,2]],
    [[0,1], [1,1], [1,2], [2,1]],
    [[0,0], [0,1], [0,2], [1,1]],
    [[0,1], [1,0], [1,1], [2,1]],
    // L shape - 4 (7,8,9,10)
    [[0,2], [1,0], [1,1], [1,2]],
    [[0,1], [1,1], [2,1], [2,2]],
    [[0,0], [0,1], [0,2], [1,0]],
    [[0,1], [0,2], [1,2], [2,2]],
    // J shape - 4 (11,12,13,14)
    [[0,0], [1,0], [1,1], [1,2]],
    [[0,1], [0,2], [1,1], [2,1]],
    [[0,0], [0,1], [0,2], [1,2]],
    [[0,2], [1,2], [2,1], [2,2]],
    // S shape - 2 (15,16)
    [[0,1], [0,2], [1,0], [1,1]],
    [[0,1], [1,1], [1,2], [2,2]],
    // Z shape - 2 (17,18)
    [[0,0], [0,1], [1,1], [1,2]],
    [[0,2], [1,1], [1,2], [2,1]]
];
//회전시 다음 shape 인덱스
var shapeRotateMap = [1,0, 2, 4,5,6,3, 8,9,10,7, 12,13,14,11, 16,15, 18,17];
var shapeColorArray = [
    "rgb(0,255,255)",
    "rgb(255,255,0)",
    "rgb(128,0,128)",
    "rgb(255,165,0)",
    "rgb(0,0,255)",
    "rgb(0,255,0)",
    "rgb(255,0,0)"
];

/**
 * 테크로미노 메인 모양
 *  (I: 0, O: 2, T: 3, L: 7, J: 11, S: 15, Z: 17)
 */
var shapeMainIndex = [0, 2, 3, 7, 11, 15, 17];
//퍼즐 - 색 매핑
var shapeColorMap = {};
for (var i=0; i<shapeMainIndex.length; i++) {
    shapeColorMap[shapeMainIndex[i]] = shapeColorArray[i];
}

var bag = [];
var lastShapeIndex = null;


/**
 * Ghost 기능 변수
 */
var ghostCell = [];
var ghostColor = "rgba(200, 200, 200, 0.25)";


/**
 * 게임 데이터 변수
 */
var shapeCell; // 현재 블록 위치 저장
var existField; // 쌓인 블록 여부 저장하는 2D 배열
var shapePoint; // 블록의 기준점 위치 (y, x)
var createPoint=[1, parseInt(COLS/2)-2]; // 블록 생성 위치
var currentShape, nextShape; // 현재 블록과 다음 블록
var score, level, levelStack=0; // 점수, 레벨, 레벨 업 카운트



init();

//초기화
function init() {
    fillBag(); //초반 7블럭 균일 무작위
    drawField(); //게임 필드 그리기
    initExistField(); //필드 데이터 초기화
    setWall();
    movingSpeed = initSpeed;
    shapeCell=[];
    shapePoint=[1,1];
    score = 0, level = 1;
    chooseNextShape();
    chooseNextColor();
    createShape();
}


/**
 * 키 입력 처리
 */
//1. 키가 눌렸을떄 처리
document.onkeydown = keyDownEventHandler; 
function keyDownEventHandler(e) {
    switch(e.keyCode){
        case 37: setTimeout("moveLR(-1)", 0); break; //방향키 좌(←) - 좌측 이동
        case 38: setTimeout("rotateShape()", 0); break; //방향키 상(↑) - 회전
        case 90: setTimeout("rotateShape()", 0); break; //'z' - 회전
        case 39: setTimeout("moveLR(1)", 0); break; //방향키 우(→) - 우측 이동
        case 40: moveFast(); break; //방향키 하(↓) - 빠르게 내리기
        case 32: hardDrop(); break; //space bar - Hard Drop

        case 27: pause(); break; //ESC
    }
}

//2. 키에서 손을 뗐을때 처리
document.onkeyup = keyUpEventHandler; 
function keyUpEventHandler(e){
    if(e.keyCode == 40) moveSlow(); //'z'키에서 손떼면 속도 원복
}


/**
 * getElementById
 */
function gebi(y, x) {
    //ret - return
    var ret = document.getElementById(String(y)+" "+String(x));
    return ret;
}

/**
 * Game Field Setting
 */
function initExistField(){
    existField = new Array(ROWS);
    for(var i=0; i<ROWS; i++){
        existField[i]=new Array(COLS);
    }
    for(var i=0; i<ROWS; i++){
        for(var j=0; j<COLS; j++){
            existField[i][j]=false;
        }
    }
}

// y: 0 ~ 21, x: 0 ~ 11
// y: 0, 21 / x: 0, 11 -> Wall
function drawField(){
    var fieldTag = "<table id=\"gameTable\" border=0>";
    for(var i=0; i<ROWS; i++){
        fieldTag += "<tr>";
        for(var j=0; j<COLS; j++)
            fieldTag += "<td id=\""+String(i)+" "+String(j)+"\"></td>";
            // fieldTag += `<td id="${i} ${j}"></td>`; //백틱 방식
        fieldTag += "</tr>";
    }
    document.write(fieldTag);
}

function setWall(){
    //양측면 벽 생성
    for(var i=0; i<ROWS; i++){
        gebi(i,0).style.background = wallColor;
        gebi(i,COLS-1).style.background = wallColor;
        existField[i][0]=true;
        existField[i][COLS-1]=true;
    }
    //상하단 벽 생성
    for(var i=0; i<COLS; i++){
        gebi(0,i).style.background = wallColor;
        gebi(ROWS-1,i).style.background = wallColor;
        existField[0][i]=true;
        existField[ROWS-1][i]=true;
    }
}


/**
 * Shape Setting
 */

//다음 블록 선택
function chooseNextShape() {
    var nextShapeIndex;

    if (bag.length > 0) {
        // 첫 7개 블록은 bag에서 가져옴
        nextShapeIndex = bag.shift();
    } else {
        // 8번째 이후는 무작위 선택 (연속 블록 방지)
        do {
            nextShapeIndex = shapeMainIndex[Math.floor(Math.random() * shapeMainIndex.length)];
        } while (nextShapeIndex === lastShapeIndex);
    }

    lastShapeIndex = nextShapeIndex;

    //nextShape 설정
    nextShape = nextShapeIndex;
}

//다음 블록색 선택
function chooseNextColor() {
    // nextColor(String) - nextShape 을 이용하여 설정
    nextColor = shapeColorMap[nextShape];
}

function createShape() {
    shapePoint[0] = createPoint[0];
    shapePoint[1] = createPoint[1];
    currentShape = nextShape;
    shapeColor = nextColor
    var shape = shapeArray[currentShape];
    chooseNextShape();
    chooseNextColor();
    displayNextShape();
    for (var i=0; i<shape.length; i++) {
        var sy = shapePoint[0] + shape[i][0];
        var sx = shapePoint[1] + shape[i][1];
        if (!isValidPoint(sy, sx)) gameOver();
        var el = gebi(parseInt(sy), parseInt(sx));
        el.style.background = shapeColor;
        shapeCell.push([sy, sx]);
    }



    movingThread = setTimeout("moveDown()", movingSpeed);
}

//다음 블록 보여주기
function displayNextShape() {
    initNextTable();
    var shape = shapeArray[nextShape];
    var color = nextColor;
    for (var i = 0; i < 4; i++) {
        var y = shape[i][0];
        var x = shape[i][1];
        document.getElementById(String(y) + String(x)).style.background = color;
    }
}
//다음 블록 영역 초기화
function initNextTable() {
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            document.getElementById(String(i) + String(j)).style.background = "rgb(14,31,49)";
        }
    }
}

//7가지 인덱스를 무작위
function fillBag() {
    var newBag = [...shapeMainIndex];
    //Fisher-Yates shuffle
    for (var i = newBag.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [newBag[i], newBag[j]] = [newBag[j], newBag[i]];
    }
    bag = newBag;
}


/**
 * Shape Control
 */

//하강
function moveDown() {
    if (!canMove(1, 0)) {
        ghostCell = []; //Ghost 블록 초기화!
        commitExist();
        checkLine();
        shapeCell = [];
        createShape();
        return;
    }
    removeShape();
    for (var i = 0; i < shapeCell.length; i++) shapeCell[i][0]++;
    shapePoint[0]++;

    updateGhost();  // Ghost 블록 업데이트

    showShape();

    movingThread = setTimeout("moveDown()", movingSpeed);
}

function rotateShape() {
    if (!canRotate()) return;
    removeShape(); //이전 블록록 지우기
    shapeCell = []; //현재 블록 위치 정보 초기화
    // '현재 모양'을 회전 후 모양으로 업데이트
    currentShape = shapeRotateMap[currentShape];
    var rotateShape = shapeArray[currentShape];
    for (var i=0; i<4; i++) {
        var sy = shapePoint[0] + rotateShape[i][0];
        var sx = shapePoint[1] + rotateShape[i][1];
        shapeCell.push([sy, sx]);
    }
    showShape(); //(회전후)블록 그리기

    updateGhost();  // Ghost 블록 업데이트
}

function canRotate() {
    // tempShape - 회전 후 블록
    var tempShape = shapeArray[shapeRotateMap[currentShape]];

    //회전 후 블록이 유효한 위치에 있는지 확인
    for (var i=0; i<4; i++) {
        var ty = shapePoint[0] + tempShape[i][0];
        var tx = shapePoint[1] + tempShape[i][1];
        if (!isValidPoint(ty, tx)) return false;
    }
    return true;
}


//유효 Point 체크
function isValidPoint(y, x) {
    // y : 1 ~ 20 , x : 1 ~ 10 까지 유효
    return !(y<=0 || y>=ROWS-1 || x<=0 || x>=COLS-1 || existField[y][x]);
}

//shapeCell - 현재 블럭 위치를 모두 타일 색으로 변경
function removeShape() {
    for (var i=0; i<shapeCell.length; i++) {
        var el = gebi(shapeCell[i][0], shapeCell[i][1]);
        el.style.background = tileColor;
    }
}

//shapeCell - 현재 블럭 위치를 모두 현재 블럭색으로 변경
function showShape() {
    for (var i=0; i<shapeCell.length; i++) {
        var el = gebi(shapeCell[i][0], shapeCell[i][1]);
        el.style.background = shapeColor;
    }
}

//이동 가능 여부 확인
function canMove(dy, dx) {
    for (var i=0; i<shapeCell.length; i++) {
        var ny = shapeCell[i][0] + dy;
        var nx = shapeCell[i][1] + dx;
        if (!isValidPoint(ny, nx)) return false;
    }
    return true;
}

//블록 좌우 이동동
function moveLR(delta) {
    //이동 가능 여부 || '정지' 여부
    if(!canMove(0, delta) || isPaused) return;
    removeShape();
    //현재 블록 x 좌표 변경
    for (var i=0; i<shapeCell.length; i++) shapeCell[i][1] += delta;
    shapePoint[1] += delta; //블록 중심 변경

    updateGhost();  // Ghost 블록 업데이트

    showShape();
}

//속도 증가
function moveFast() {
    if(fastMode) return; //이미 활성화 되어 있으면 패스
    clearTimeout(movingThread);
    movingSpeed = fastSpeed;
    movingThread = setTimeout("moveDown()", movingSpeed);
    fastMode = true;
}

function moveSlow() {
    if(!fastMode) return;
    clearTimeout(movingThread);
    movingSpeed = initSpeed;
    movingThread = setTimeout("moveDown()", movingSpeed);
    fastMode = false;
}

function hardDrop(){
    clearTimeout(movingThread); // 기존 이동 멈춤
    var dropDistance = 0;

    while (true) {
      // 모든 블록이 dy 증가 후 이동 가능한지 확인
        var canDrop = true;
        for (var i = 0; i < shapeCell.length; i++) {
            var ny = shapeCell[i][0] + (dropDistance + 1);
            var nx = shapeCell[i][1];
            if (!isValidPoint(ny, nx)) {
                canDrop = false;
                break;
            }
        }
        if (!canDrop) break; // 이동 불가능하면 멈춤
        dropDistance++;
    }

    removeShape();
    for(var i=0;i<shapeCell.length;i++) {
        shapeCell[i][0] += dropDistance;
    }

    // ✅ Score Update (hard drop : 2 * dropDistance)
    var hardDropScore = 2 * dropDistance;
    score += hardDropScore;
    document.getElementById("score").innerHTML = score; // UI 업데이트

    shapePoint[0] += dropDistance;
    showShape();

    ghostCell = []; //Ghost 블록 초기화!
    //블록 고정 및 다음 블록 생성
    commitExist();
    checkLine();
    shapeCell = [];
    createShape();
}


//블럭을 고정하는 함수 (바닥 OR 다른 블럭에 하단이 닿을때 사용)
function commitExist() {
    for (var i = 0; i < shapeCell.length; i++) {
        var y = shapeCell[i][0];
        var x = shapeCell[i][1];
        existField[y][x] = true;
    }
}

function checkLine(){
    var combo = 0;
    var finalScore = 0;

    for(var i=ROWS-2; i>1; i--){
        if(isFull(i)){
            removeLine(i);
            i++;
            finalScore += updateScore(++combo);
            levelStack++; //한줄 지울때 마다 levelStack 쌓임
            leveling(); //레벨 관련 확인
        }
        if(combo > 0) displayCombo(combo, finalScore);
    }
}

//특정 한 줄이 가득 찼는지 확인하는 함수
function isFull(lineIndex) {
    for (var i = 1; i < COLS - 1; i++){
        if (!existField[lineIndex][i]) return false;
    }
    return true;
}
//'lineIndex' 줄을 지우고 나머지 줄을 당겨 채운다.
function removeLine(lineIndex) {
    for (var i = lineIndex - 1; i >= 1; i--) {
        for (var j = 1; j < COLS - 1; j++) {
            gebi(i + 1, j).style.background = gebi(i, j).style.background;
            existField[i + 1][j] = existField[i][j];
        }
    }
}

//level * 3 줄을 클리어 할태 마다 레벨 상승
function leveling(){
    if(level==10) return;
    if(levelStack == level * 3){
        level++;
        levelStack=0;
        if(!fastMode)
            movingSpeed = initSpeed - (level*deltaSpeed);
    }
    document.getElementById("level").innerHTML = level;
}
function updateScore(combo){
    var comboScore = 0;

    switch(combo) {
        case 1: comboScore = 100; break; //싱글
        case 2: comboScore = 300; break; //더블
        case 3: comboScore = 500; break; //트리플
        case 4: comboScore = 800; break; //테트리스

        default: comboScore = 250 * combo; break; //5줄 이상
    }

    //level 가중치 (+ level * 5점)
    comboScore += level * 5;
    score += comboScore;
    document.getElementById("score").innerHTML = score;
    return comboScore;
}
function displayCombo(combo, finalScore){

    var str;

    switch (combo) {
        case 1: str = "Single"; break;
        case 2: str = "Double"; break;
        case 3: str = "Triple"; break;
        case 4: str = "TETRIS"; break;
    
        default: str = "SUPER"; break;
    }

    var comboStr = str +" COMBO +"+ finalScore;
    document.getElementById("comboField").innerHTML = comboStr;
    setTimeout(function(){document.getElementById("comboField").innerHTML = "";},700);
}


/**
 * Game Mode Setting
 */
function gameOver() {
    clearTimeout(movingThread); //thread 초기화
    initExistField(); //고정 블록 초기화
    alert("🏆 GAME OVER 🏆\nlevel: " + level + "\nScore: " + score);
    document.getElementById("gameField").style.visibility = "hidden";
    document.getElementById("gameover").style.visibility = "visible";
}
function pause() {
    // pause -> start
    if(isPaused) {
        movingThread = setTimeout("moveDown()", movingSpeed);
        document.getElementById("pause").style.visibility = "hidden";
        document.getElementById("gameField").style.visibility = "visible";
        isPaused = false;
    } //start -> pause
    else {
        clearTimeout(movingThread);
        document.getElementById("pause").style.visibility = "visible";
        document.getElementById("gameField").style.visibility = "hidden";
        isPaused = true;
    }
}


var rule = "!SCORE \nSingle Line Clear : 100 point\n" +
"Double Line Clear : 300 point\n" +
"Triple Line Clear : 500 point\n" +
"TETRIS Line Clear : 800 point\n" +
"Hard Drop : \'Drop Line Count\' * 2\n\n" +
"!LEVEL \n" +
"\'current level\' * 3 => NEXT LEVEL";

function info() {
    alert(rule);
}



/**
 * Ghost 기능 
 */
function updateGhost() {
    clearGhost();
    ghostCell = getGhostPosition();
    drawGhost();
}

//Ghost 블록 업데이트
function getGhostPosition() {
    let ghostShape = shapeCell.map(([y, x]) => [y, x]); // 현재 블록 위치 복사
    while (true) {
        let canMoveDown = ghostShape.every(([y, x]) => isValidPoint(y + 1, x));
        if (!canMoveDown) break;
        ghostShape = ghostShape.map(([y, x]) => [y + 1, x]); // 한 칸 아래로 이동
    }
    return ghostShape;
}

//Ghost 그리기
function drawGhost() {
    for (var i=0; i<ghostCell.length; i++) {
        var el = gebi(ghostCell[i][0], ghostCell[i][1]);
        el.style.background = ghostColor;
    }
}

//Ghost 지우기
function clearGhost() {
    for (var i=0; i<ghostCell.length; i++) {
        var el = gebi(ghostCell[i][0], ghostCell[i][1]);
        el.style.background = tileColor;
    }
}