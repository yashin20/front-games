const URL = "http://www.supermaruo.shop";

var hangulWord = answerList[Math.floor(Math.random() * answerList.length)];
var answer = decomposeHangul(hangulWord);
// answer = "ㅎㅜㅎㅗㅣ";
var currentRow = 0;
var rows = document.querySelectorAll('.row');

let boardStatus = []; //결과 블록

let isAnimating = false; //애니메이션 중 여부

const englishToHangul = {
  "Q": "ㅂ", "W": "ㅈ", "E": "ㄷ", "R": "ㄱ", "T": "ㅅ", "Y": "ㅛ", "U": "ㅕ", "I": "ㅑ", "O": "ㅐ", "P": "ㅔ",
  "A": "ㅁ", "S": "ㄴ", "D": "ㅇ", "F": "ㄹ", "G": "ㅎ", "H": "ㅗ", "J": "ㅓ", "K": "ㅏ", "L": "ㅣ",
  "Z": "ㅋ", "X": "ㅌ", "C": "ㅊ", "V": "ㅍ", "B": "ㅠ", "N": "ㅜ", "M": "ㅡ"
};

// 쌍자음 / 모음 변환 테이블 (양방향)
const shiftHangul = {
  "ㅂ": "ㅃ", "ㅃ": "ㅂ",
  "ㅈ": "ㅉ", "ㅉ": "ㅈ",
  "ㄷ": "ㄸ", "ㄸ": "ㄷ",
  "ㄱ": "ㄲ", "ㄲ": "ㄱ",
  "ㅅ": "ㅆ", "ㅆ": "ㅅ",
  "ㅐ": "ㅒ", "ㅒ": "ㅐ",
  "ㅔ": "ㅖ", "ㅖ": "ㅔ"
};

let shiftActive = false; //SHIFT 활성화 상태

document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e) {
  if (isAnimating) return; //애니메이션 중이면 키 입력 무시

  const key = e.key.toUpperCase();
  const validkeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (validkeys.includes(key)) {
    var hangul = englishToHangul[key];

    // SHIFT가 활성화된 상태라면 쌍자음으로 변환
    if (shiftActive && shiftHangul[hangul]) {
      hangul = shiftHangul[hangul];
    }

    insertLetter(hangul);
  } else if (e.key == "Backspace") {
    deleteLetter();
  } else if (e.key == "Enter" && isEnterAble()) {
    submitWord();
  } else if (e.key == "Shift") {
    toggleShift();
  }
};

// 키보드 타일 클릭 이벤트 추가
const keyboardTiles = document.querySelectorAll('.keyboard .key');
keyboardTiles.forEach(tile => {
  tile.addEventListener('click', () => {
    const letter = tile.getAttribute('data-letter');

    // ENTER 키 눌렸을 경우
    if (letter === 'ENTER') {
      submitWord();
    }
    // BACKSPACE 키 눌렸을 경우
    else if (letter === 'BACKSPACE') {
      deleteLetter();
    }
    else if (letter === 'SHIFT') {
      toggleShift();
    }
    // 그 외 문자 입력된 경우
    else {
      insertLetter(letter);
    }
  });
});


function toggleShift() {
  shiftActive = !shiftActive; //상태 변환

  // SHIFT 키 색상 및 텍스트 변경
  const shiftKey = document.querySelector('.key[data-letter="SHIFT"]');
  if (shiftActive) {
    shiftKey.classList.add("active");
    shiftKey.textContent = "SHIFT ON";
  } else {
    shiftKey.classList.remove("active");
    shiftKey.textContent = "SHIFT OFF";
  }

  // 키보드 글자 및 data-letter 변환
  document.querySelectorAll(".key").forEach((key) => {
    const letter = key.dataset.letter; // data-letter 값 가져오기

    if (shiftHangul[letter]) {
      key.dataset.letter = shiftHangul[letter]; // data-letter 값 변경
      key.textContent = shiftHangul[letter]; // 표시되는 텍스트 변경
    }
  });
}



/**'ENTER' 활성화 여부 */
function isEnterAble() {
  const activeRow = rows[currentRow];
  const filledTiles = activeRow.querySelectorAll(".tile.letter");
  if (filledTiles.length === 5) return true;
  else return false;
}

function updateEnterButton() {
  const enterButton = document.querySelector('.keyboard .key[data-letter="ENTER"]');
  const activeRow = rows[currentRow];
  const filledTiles = activeRow.querySelectorAll(".tile.letter");

  // 5개 글자가 입력되었으면 ENTER 버튼 활성화, 아니면 비활성화
  if (filledTiles.length === 5) {
    enterButton.classList.remove("disabled");
    enterButton.style.pointerEvents = "auto"; // 클릭 가능하게 설정
  } else {
    enterButton.classList.add("disabled");
    enterButton.style.pointerEvents = "none"; // 클릭 불가능하게 설정
  }
}


function insertLetter(letter) {
  if (currentRow >= rows.length) return;

  const activeRow = rows[currentRow];
  const emptyTile = activeRow.querySelector(".tile.empty");

  if (emptyTile) {
    emptyTile.textContent = letter;
    emptyTile.classList.remove("empty");
    emptyTile.classList.add("letter", "anim");

    // 애니메이션 후 'anim' 클래스 제거 (0.1초 후)
    setTimeout(() => {
      emptyTile.classList.remove("anim");
    }, 100);


    updateEnterButton();
  }
}

function deleteLetter() {
  if (currentRow >= rows.length) return;

  const activeRow = rows[currentRow];
  const filledTiles = activeRow.querySelectorAll(".tile.letter");

  if (filledTiles.length > 0) {
    const lastTile = filledTiles[filledTiles.length - 1];
    lastTile.textContent = "";
    lastTile.classList.remove("letter");
    lastTile.classList.add("empty");


    updateEnterButton();
  }
}

function submitWord() {
  if (currentRow >= rows.length) return;

  const activeRow = rows[currentRow];
  const filledTiles = activeRow.querySelectorAll(".tile.letter");

  //letter 5개가 입력되어야 제출
  if (filledTiles.length !== 5) return;

  determine(filledTiles);
}

/**단어 평가 메서드 */
async function determine(filledTiles) {
  var hangulWord = tilesToWord(filledTiles);
  if (hangulWord === "wrong!") {
    // alert("단어가 성립하지 않습니다!");
    showToast("단어가 성립하지 않습니다!");
    return;
  }

  // 유효한 입력인지 확인 (비동기 함수 호출 시 await 사용!)
  const isValid = await isValidWord(hangulWord);
  if (!isValid) {
    // alert("존재하지 않는 단어입니다!");
    showToast("존재하지 않는 단어입니다!");
    return;
  }


  isAnimating = true; // 애니메이션 시작 -> 키 입력 차단

  var cnt = 0; //corrent letter count
  let currentRowStatus = []; // 한 줄의 결과를 저장할 배열

  for (let i = 0; i < filledTiles.length; i++) {
    const tile = filledTiles[i];
    const letter = tile.textContent;

    // 타일에 애니메이션 효과 추가
    setTimeout(() => {
      tile.classList.add("flip");

      setTimeout(() => {
        tile.classList.remove("flip"); // 애니메이션 종료 후 제거

        if (letter == answer[i]) {
          tile.classList.add("correct");
          cnt++;
          updateKeyboardTile(letter, "correct");
          currentRowStatus.push("correct"); /**결과 배열 : 'corrent' */
        } else if (answer.includes(letter)) {
          tile.classList.add("include");
          updateKeyboardTile(letter, "include");
          currentRowStatus.push("include"); /**결과 배열 : 'include' */
        } else {
          tile.classList.add("none");
          updateKeyboardTile(letter, "none");
          currentRowStatus.push("none"); /**결과 배열 : 'none' */
        }

        // 마지막 타일까지 처리한 경우에 한 줄 완성 → boardStatus에 추가
        if (currentRowStatus.length === filledTiles.length) {
          boardStatus.push(currentRowStatus);
          currentRowStatus = []; // 다음 줄 준비
        }

      }, 250); // 애니메이션 절반 진행 후 색상 변경

    }, i * 200); // 각 타일이 순차적으로 회전하도록 설정
  }


  /* 정답 체크 */
  setTimeout(() => {
    if (cnt === 5) {
      correctWord(filledTiles);
      setTimeout(showGameOverModal, 1000);
    } else if (currentRow >= 5) {
      setTimeout(showGameOverModal, 500);
    }

    if (cnt !== 5 && currentRow < 5) {
      currentRow++;
    }

    isAnimating = false; //애니메이션 끝 -> 키 입력 허용
  }, filledTiles.length * 200 + 300);

}


//filled tiles -> hangul word
function tilesToWord(filledTiles) {
  //자모음으로 이루어진 문자열
  var letters = "";

  for (let i = 0; i < filledTiles.length; i++) {
    const letter = filledTiles[i].textContent;
    letters += letter;
  }

  /**자모음 문자열 => 단어 */
  var hangulWord = composeHangul(letters);
  return hangulWord;
}

/**현재 데이터에 존재하는 단어인지 확인 */
function includeData(filledTiles) {
  //자모음으로 이루어진 문자열
  var letters = "";

  for (let i = 0; i < filledTiles.length; i++) {
    const letter = filledTiles[i].textContent;
    letters += letter;
  }

  /**자모음 문자열 => 단어 */
  var hangulWord = composeHangul(letters);

  return answerList.includes(hangulWord.trim());
}


// 키보드 타일 색상 업데이트 함수
function updateKeyboardTile(letter, status) {
  const priority = {
    none: 0,
    include: 1,
    correct: 2
  };

  const keyboardTile = document.querySelector(`.keyboard .key[data-letter="${letter}"]`);
  if (keyboardTile) {
    const currentStatus = ['correct', 'include', 'none'].find(cls => keyboardTile.classList.contains(cls));


    // 현재 상태의 우선순위와 비교해서 높은 경우만 업데이트
    if (!currentStatus || priority[status] > priority[currentStatus]) {
      // 기존 상태 제거
      if (currentStatus) {
        keyboardTile.classList.remove(currentStatus);
      }
      // 새 상태 추가
      keyboardTile.classList.add(status);
    }
  }
}


/* 정답을 맞춘경우 (애니메이션 + ) */
function correctWord(filledTiles) {
  for (let i = 0; i < filledTiles.length; i++) {
    setTimeout(() => {
      filledTiles[i].classList.add("anim");
      setTimeout(() => {
        filledTiles[i].classList.remove("anim");
      }, 300);
    }, i * 100);
  }
}


/**
 * Modal 표시
 */
function showGameOverModal() {
  const modal = document.getElementById("game-over-modal");
  const message = document.getElementById("modal-message");
  const resultElement = document.getElementById('resultBoard');

  //result board
  const resultText = renderBoard(boardStatus);
  resultElement.textContent = resultText;

  message.textContent = `정답은 '${hangulWord}'였습니다.`;
  modal.style.display = "flex";
}

function restartGame() {
  const modal = document.getElementById("game-over-modal");
  modal.style.display = "none"; // 모달 닫기
  currentRow = 0; // 게임 초기화
  boardStatus = []; //결과 창 초기화
  //game board init
  document.querySelectorAll(".tile.letter").forEach(tile => {
    tile.textContent = "";
    tile.className = "tile empty";
  });
  //keyboard init
  document.querySelectorAll('.keyboard .key').forEach(key => {
    key.className = "key";
  });

  setWord();
}

function renderBoard(statusBoard) {
  const tileEmojiMap = {
    correct: '🟩',
    include: '🟨',
    none: '⬜'
  };

  return statusBoard
    .map(row => row.map(status => tileEmojiMap[status]).join(''))
    .join('\n');
}

/**문제 단어 생성 로직 */
function setWord() {
  hangulWord = answerList[Math.floor(Math.random() * answerList.length)];
  answer = decomposeHangul(hangulWord);
}

/**공유 기능 (텍스트 형태로 클립보드 복사 로직) */
const shareButton = document.getElementById('share-button');
function copyForShare() {
  const resultText = renderBoard(boardStatus); //결과 블록
  const shareText = `🔠 오늘의 단어 게임 결과\n\n${resultText}\n\n🟢 정답은 "${hangulWord}"!\n\n${URL}`;

  // 클립보드 복사
  navigator.clipboard.writeText(shareText)
    .then(() => {
      showToast("복사되었습니다!");
    })
    .catch(() => {
      showToast("복사에 실패했습니다 😢");
    });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2000); // 2초 뒤 사라짐
}