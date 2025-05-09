const imgSrc1 = "assets/wombat-attack.png";
const imgSrc2 = "assets/wombat-basic.png";
const limitTime = 20000; // limit time = 20seconds

/**ID 기반 section 보이기 */
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function startIntro() {
  showSection("intro");
  let count = 3;
  const countdownEl = document.querySelector("#countdown .count-text");
  countdownEl.textContent = count;

  const interval = setInterval(() => {
    count--;
    if (count === 0) {
      clearInterval(interval);
      startGame();
    } else {
      countdownEl.textContent = count;
    }
  }, 1000);
}

let spawnInterval; // 전역에서 참조 가능하도록

function startGame() {
  score = 0;
  document.getElementById("score").textContent = score;
  showSection("game");

  startGauge();

  // 웜뱃 생성 반복 시작
  spawnInterval = setInterval(spawnWombats, 100); // 0.1초마다 시도

  // 20초 후 게임 종료 및 웜뱃 생성 중단
  setTimeout(() => {
    clearInterval(spawnInterval);
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

function spawnWombats() {
  //cell 15개 가져오기
  const wombatArea = document.getElementById("wombat-area");
  const cells = wombatArea.querySelectorAll(".cell");

  // 랜덤 셀 선택
  const randomIndex = Math.floor(Math.random() * cells.length);
  const targetCell = cells[randomIndex];

  // 이미 웜뱃이 있다면 생성하지 않음
  if (targetCell.querySelector("img")) return;

  // 이미지 요소 생성
  const wombatImg = document.createElement("img");
  // 랜덤으로 이미지 선택 및 data-type 지정
  const isGood = Math.random() < 0.5;
  wombatImg.src = isGood ? imgSrc2 : imgSrc1;
  wombatImg.dataset.type = isGood ? "good" : "bad";
  wombatImg.classList.add("wombat-img");

  // 클릭 이벤트
  wombatImg.addEventListener("click", () => {
    if (wombatImg.dataset.clicked === "true") return; // 이미 클릭된 이미지면 무시
    wombatImg.dataset.clicked = "true"; // 클릭 처리 마크

    //1. score 반영
    if (wombatImg.dataset.type === "good") {
      score += 1;
    } else {
      score -= 1;
      if (score < 0) score = 0;
    }
    document.getElementById("score").textContent = score;

    //2. score 애니메이션
    const floatText = document.createElement("div");
    floatText.className = "score-float " + (wombatImg.dataset.type === "good" ? "plus" : "minus");
    floatText.textContent = wombatImg.dataset.type === "good" ? "+1" : "-1";

    targetCell.appendChild(floatText);

    // 제거 타이머
    setTimeout(() => floatText.remove(), 800);


    //3. wombat 삭제 애니메이션
    wombatImg.classList.add("wombat-exit");
    setTimeout(() => wombatImg.remove(), 300);
  });

  // 셀에 이미지 추가
  targetCell.appendChild(wombatImg);

  // 1초 후 이미지 제거
  setTimeout(() => {
    if (wombatImg.parentElement) {
      wombatImg.classList.add("wombat-exit");
      setTimeout(() => wombatImg.remove(), 300); // exit 애니메이션 끝나고 제거
    }
  }, 1000);
}



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




// 다시 하기 버튼
document.getElementById("retry-btn").addEventListener("click", startIntro);
document.getElementById("share-btn").addEventListener("click", () => {
  const score = document.getElementById("final-score")?.textContent || "0";
  const url = window.location.href;

  const shareText = `내 점수는 ${score}점!\n👉 ${url}`;

  navigator.clipboard.writeText(shareText).then(() => {
    alert("점수와 링크가 복사되었습니다! 친구에게 공유해보세요.");
  }).catch(err => {
    console.error("복사 실패:", err);
    alert("복사에 실패했습니다. 브라우저를 확인해주세요.");
  });
});


// 최초 실행
window.onload = startIntro;