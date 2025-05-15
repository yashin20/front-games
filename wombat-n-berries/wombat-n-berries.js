/* */
const limitTime = 45000; //45 seconds
const boardSize = 7;
const cells = document.querySelectorAll(".cell");
const wombatImages = [
  "assets/wombat-7.png",
  "assets/wombat-3.png",
  "assets/wombat-6.png",
  "assets/wombat-9.png",
  "assets/wombat-10.png"
];
let score = 0;
let firstSelected = null; //처음 선택된 블록 저장
let isAnimating = false; //현재 애니메이션이 실행 중인가?

// Intro Page Buttons
document.getElementById("start-btn").addEventListener("click", startCountdown);
document.getElementById("rule-btn").addEventListener("click", ruleModal);
startIntro();
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleBlockClick(index));
});
// Result Page Buttons
document.getElementById("retry-btn").addEventListener("click", startIntro);
document.getElementById("share-btn").addEventListener("click", () => {
  const score = document.getElementById("final-score")?.textContent || "0";
  const url = window.location.href;

  const shareText = `내 점수는 ${score}점!\n👉 ${url}`;

  navigator.clipboard.writeText(shareText).then(() => {
    alert("점수와 링크가 복사되었습니다! 친구에게 공유해보세요!");
  }).catch(err => {
    console.error("복사 실패:", err);
    alert("복사에 실패했습니다. 브라우저를 확인해주세요.");
  });
});


/**ID 기반 section 보이기 */
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
}

/***** INTRO SECTION *****/
function startIntro() {
  showSection("intro");
}
function startCountdown() {
  let count = 3;
  const countdownEl = document.getElementById("intro-countdown-img");
  countdownEl.innerHTML = "";

  const countdownImg = document.createElement("img");
  countdownImg.src = `assets/wombat-count-${count}.png`;
  countdownEl.appendChild(countdownImg);

  // 버튼 비활성화
  document.getElementById("start-btn").disabled = true;
  document.getElementById("start-btn").textContent = "LOADING......";
  document.getElementById("rule-btn").disabled = true;

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownImg.src = `assets/wombat-count-${count}.png`;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        countdownEl.innerHTML = "";
        const img = document.createElement("img");
        img.src = "assets/wombat-main.png";
        countdownEl.appendChild(img);

        startGame(); /**Game Section 열기 */

        // 게임 시작 후 버튼 다시 활성화
        document.getElementById("start-btn").disabled = false;
        document.getElementById("rule-btn").disabled = false;
        document.getElementById("start-btn").textContent = "GAME START";
      }, 1000);
    }
  }, 1000);
}

/***** GAME SECTION *****/
function startGame() {
  score = 0;
  document.getElementById("score").textContent = score;
  showSection("game");
  generateBoard(); //게임 보드 채우기
  startGauge();

  // 45초 후 게임 종료
  setTimeout(() => {
    endGame();
  }, limitTime);
}

function startGauge() {
  const timeFill = document.getElementById("time-fill");
  const totalTime = limitTime;
  const updateInterval = 100; // 0.1초마다 업데이트
  let elapsed = 0;

  gaugeInterval = setInterval(() => {
    elapsed += updateInterval;
    const percent = Math.max(0, 100 - (elapsed / totalTime) * 100);
    timeFill.style.width = `${percent}%`;

    if (elapsed >= totalTime) {
      clearInterval(gaugeInterval);
    }
  }, updateInterval);
}

/**1. 3개 이상 일치하는 블록을 찾는 메서드 (image src를 기준으로 비교) */
function checkMatches() {
  // const cells = document.querySelectorAll(".cell");
  const matchedIndices = new Set();

  //row check
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize - 2; col++) {
      const idx = row * boardSize + col;
      const img1 = cells[idx].querySelector("img")?.src;
      const img2 = cells[idx + 1].querySelector("img")?.src;
      const img3 = cells[idx + 2].querySelector("img")?.src;

      if (img1 && img1 === img2 && img2 === img3) {
        matchedIndices.add(idx);
        matchedIndices.add(idx + 1);
        matchedIndices.add(idx + 2);

        let k = 3;
        while (col + k < boardSize && cells[idx + k].querySelector("img")?.src === img1) {
          matchedIndices.add(idx + k);
          k++;
        }
        col += k - 1;
      }
    }
  }

  //column check
  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row < boardSize - 2; row++) {
      const idx = row * boardSize + col;
      const img1 = cells[idx].querySelector("img")?.src;
      const img2 = cells[idx + boardSize].querySelector("img")?.src;
      const img3 = cells[idx + boardSize * 2].querySelector("img")?.src;

      if (img1 && img1 === img2 && img2 === img3) {
        matchedIndices.add(idx);
        matchedIndices.add(idx + boardSize);
        matchedIndices.add(idx + boardSize * 2);

        // 연속 검사
        let k = 3;
        while (row + k < boardSize && cells[idx + boardSize * k].querySelector("img")?.src === img1) {
          matchedIndices.add(idx + boardSize * k);
          k++;
        }
        row += k - 1;
      }
    }
  }

  return [...matchedIndices];
}
/**2. 랜덤한 7X7 블록 배열 생성*/
function generateBoard() {
  for (let i = 0; i < cells.length; i++) {
    let row = Math.floor(i / boardSize);
    let col = i % boardSize;
    let newImg;

    do {
      newImg = getRandomImage();
      cells[i].innerHTML = `<img src="${newImg}" class="wombat-img" draggable="false">`;

      // 일치하는지 체크
    } while (isPartOfMatch(row, col));
  }
}
function getRandomImage() {
  return wombatImages[Math.floor(Math.random() * wombatImages.length)];
}
// 같은 이미지가 3개 이상 연속되는지 확인 (row/col 모두)
function isPartOfMatch(row, col) {
  const idx = row * boardSize + col;
  const currentSrc = cells[idx].querySelector("img")?.src;
  if (!currentSrc) return false;

  // row check (왼쪽 2칸)
  if (col >= 2) {
    const left1 = cells[idx - 1].querySelector("img")?.src;
    const left2 = cells[idx - 2].querySelector("img")?.src;
    if (currentSrc === left1 && left1 === left2) return true;
  }

  // col check (위쪽 2칸)
  if (row >= 2) {
    const top1 = cells[idx - boardSize].querySelector("img")?.src;
    const top2 = cells[idx - boardSize * 2].querySelector("img")?.src;
    if (currentSrc === top1 && top1 === top2) return true;
  }

  return false;
}

/**3. 블록 선택 + 인접 확인 */
/**isAdjacent(index1, index2) - 두 블록이 인접한지 확인 */
function isAdjacent(index1, index2) {
  const row1 = Math.floor(index1 / boardSize);
  const col1 = index1 % boardSize;
  const row2 = Math.floor(index2 / boardSize);
  const col2 = index2 % boardSize;

  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);

  return (rowDiff + colDiff === 1); //상하좌우 중 하나만 차이
}
/**handleBlockClick() - 블록 클릭 처리 */
function handleBlockClick(index) {
  if (isAnimating) return; //애니메이션 작동 중에는 불가!

  if (firstSelected === null) {
    firstSelected = index;
    highlightCell(index);
  } else {
    if (firstSelected === index) {
      unhighlightCell(index);
      firstSelected = null;
      return;
    }

    if (isAdjacent(firstSelected, index)) {
      animateSwap(firstSelected, index, () => {
        swapBlocks(firstSelected, index); // 임시 스왑
        const matches = checkMatches();
        if (matches.length > 0) {
          processMatches();
        } else {
          animateSwap(firstSelected, index, () => {
            swapBlocks(firstSelected, index);
          });
        }
      });
    }

    unhighlightCell(firstSelected); // 시각적 선택 해제
    firstSelected = null;
  }
}
/*선택 영역 활성화 / 비활성화*/
function highlightCell(index) {
  cells[index].classList.add("selected");
}
function unhighlightCell(index) {
  cells[index].classList.remove("selected");
}

/**칸 삭제 -> 빈칸 아래로 땡기기 -> 다시 칸 삭제 연쇄반응응 */
function processMatches() {
  let matches = checkMatches();

  if (matches.length === 0) return;

  // 🟡 점수 반영: 블록 하나당 10점
  // score += matches.length * 10;
  score += addScore(matches.length);
  updateScoreDisplay();

  animateMatchedBlocks(matches, () => {
    removeMatches(matches); //1. 매치된 블록 지우기
    collapseBoard(); //2. 빈칸 내려서 채우기
    refillBoard(); //3. 빈칸 새 이미지로 채우기

    setTimeout(processMatches, 200);
  });
}

function addScore(matchesLength) {
  let multiplier = 10;
  if (matchesLength === 4) {
    multiplier = 15;
  } else if (matchesLength === 5 || matchesLength === 6) {
    multiplier = 20;
  } else if (matchesLength >= 7) {
    multiplier = 25;
  }
  return matchesLength * multiplier;
}

/**3. swap method */
function swapBlocks(index1, index2) {
  const img1 = cells[index1].querySelector("img");
  const img2 = cells[index2].querySelector("img");

  if (img1 && img2) {
    const tempSrc = img1.src;
    img1.src = img2.src;
    img2.src = tempSrc;
  }
}

/**4. removeMatches method -> 매치된 블록 제거 및 점수 추가 (img 태그 삭제 방식!) */
function removeMatches(matchedIndices) {
  matchedIndices.forEach(idx => {
    const img = cells[idx].querySelector("img");
    if (img) {
      img.remove();
    }
  })
}

/**5. collapseBoard -> 위의 블록들이 아래로 떨어지도록 처리 */
function collapseBoard() {
  for (let col = 0; col < boardSize; col++) {
    for (let row = boardSize - 1; row >= 0; row--) {
      const idx = row * boardSize + col;
      const cell = cells[idx];

      if (!cell.querySelector("img")) {
        // 위로 올라가며 img가 있는 셀을 찾기
        for (let upperRow = row - 1; upperRow >= 0; upperRow--) {
          const upperIdx = upperRow * boardSize + col;
          const upperCell = cells[upperIdx];
          const img = upperCell.querySelector("img");

          if (img) {
            // 위의 img 태그를 잘라서 아래로 이동
            upperCell.removeChild(img);
            cell.appendChild(img);
            break;
          }
        }
      }
    }
  }
}

/**6. refillBoard -> 빈칸에 새로운 블록 생성 */
function refillBoard() {
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];

    if (!cell.querySelector("img")) {
      const newImg = document.createElement("img");
      newImg.src = getRandomImage();
      newImg.classList.add("wombat-img");
      newImg.draggable = false; //드래그 방지

      cell.appendChild(newImg);
    }
  }
}

/**7. score update method */
function updateScoreDisplay() {
  document.getElementById("score").textContent = score;
}


/***** END SECTION *****/
function endGame() {
  //1. result 섹션 ON
  showSection("result");

  const timeUpMessage = document.getElementById("time-up-message");
  const scoreContainer = document.getElementById("score-container");

  //2. score 숨기기
  timeUpMessage.style.display = "block";
  scoreContainer.style.display = "none";

  // "시간 종료!" 애니메이션 실행 후 점수 표시
  showTimeUpMessage(() => {
    timeUpMessage.style.display = "none";
    scoreContainer.style.display = "block";
    document.getElementById("final-score").textContent = score;
  });
}
function showTimeUpMessage(callback) {
  const message = document.getElementById("time-up-message");

  message.style.display = "inline-block";
  message.classList.add("appear-anim");

  // start wave animation
  startWaveAnimation();

  // 2초 동안 보여주고
  setTimeout(() => {
    message.style.display = "none";
    message.classList.remove("appear-anim");
    if (typeof callback === "function") {
      callback();
    }
  }, 2500);
}
function startWaveAnimation() {
  const spans = document.querySelectorAll("#time-up-message span");

  spans.forEach((span, index) => {
    span.classList.add("wave", `delay-${index + 1}`);
  });
}




/** 규칙 설명 모달 띄우기 */
function ruleModal() {
  document.getElementById("rule-modal").style.display = "flex";
}

document.getElementById("close-rule-btn").addEventListener("click", () => {
  document.getElementById("rule-modal").style.display = "none";
});



/**Animation */
function animateSwap(index1, index2, callback) {
  isAnimating = true;

  const cell1 = cells[index1];
  const cell2 = cells[index2];
  const img1 = cell1.querySelector("img");
  const img2 = cell2.querySelector("img");

  if (!img1 || !img2) return;

  const rect1 = cell1.getBoundingClientRect();
  const rect2 = cell2.getBoundingClientRect();

  const dx = rect2.left - rect1.left;
  const dy = rect2.top - rect1.top;

  // 위치 이동
  img1.style.transition = "transform 0.2s ease";
  img2.style.transition = "transform 0.2s ease";

  img1.style.transform = `translate(${dx}px, ${dy}px)`;
  img2.style.transform = `translate(${-dx}px, ${-dy}px)`;

  // 0.2초 뒤에 실제 src 바꾸고 transform 초기화
  setTimeout(() => {
    img1.style.transition = "";
    img2.style.transition = "";

    img1.style.transform = "";
    img2.style.transform = "";
  }, 200);

  isAnimating = false;
  if (callback) callback();
}

function animateMatchedBlocks(indexList, callback) {
  isAnimating = true;

  indexList.forEach(index => {
    const img = cells[index].querySelector("img");
    if (img) {
      img.classList.add("pop-out");
    }
  });

  // 애니메이션 끝난 뒤 콜백 실행 (삭제는 없음)
  setTimeout(() => {
    isAnimating = false;
    if (callback) callback();
  }, 300);
}
