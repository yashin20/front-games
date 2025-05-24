const colors = ["red", "blue", "green", "yellow"];
const BLOCK_DELAY_MS = 3000; //각 블록의 등장 간격 (1s)
const BLOCK_VISIBLE_DURATION_MS = 5000; // 블록이 화면에 표시되는 시간 (ms)
const monsterData = {
  1: {
    name: "HoneyBadger",
    maxHealth: 10,
    patternLength: 5,
    image: "assets/honey-badger.png",
  },
  2: {
    name: "BaekduTiger",
    maxHealth: 15,
    patternLength: 7,
    image: "assets/baekdu-tiger.png",
  },
  3: {
    name: "Dragon",
    maxHealth: 30,
    patternLength: 10,
    image: "assets/dragon.png"
  }
};


const eden = {
  maxHealth: 7,
  health: 7,
  basicAttack: 50,
  attack: 5,
  score: 0
};

let currentMonster = {
  name: "",
  maxHealth: 0,
  health: 0,
  patternLength: 0,
  image: ""
};

let stage = 1;
let currentRound = 1;

let attackPattern = []; //몬스터 공격 패턴 
let resultList = []; //플레이어 방어 성공 여부
let currentIndex = 0; //현재 몬스터 공격 순서
let totalBlocks = 0; //누적 블락 수
let inputAllowed = false; //사용자가 INPUT 가능 시점 표시

document.getElementById("btn-red").addEventListener("click", () => handleInput("red"));
document.getElementById("btn-blue").addEventListener("click", () => handleInput("blue"));
document.getElementById("btn-yellow").addEventListener("click", () => handleInput("yellow"));
document.getElementById("btn-green").addEventListener("click", () => handleInput("green"));
document.getElementById("btn-attack").addEventListener("click", () => {
  triggerCounterAttack();
  showAttackEffect();

  currentMonster.health -= eden.attack;
  updateMonsterHealthUI();

  const attackBtn = document.getElementById("btn-attack");
  attackBtn.disabled = true;
  attackBtn.classList.remove("active");

  if (currentMonster.health <= 0) {
    currentMonster.health = 0;
    updateMonsterHealthUI();

    showAnnouncementWithCallback("스테이지 클리어!", 1000, () => {
      setTimeout(() => {
        console.log("Attack Button - Stage Clear Run");
        nextStage(); // 여기서 내부적으로 nextRound() 호출
        return;
      }, 1000);
    });

  } else {
    // 체력이 아직 남아 있다면 다음 라운드로
    setTimeout(() => {
      console.log("Attack Button - Remain Monster Health Run");
      nextRound();
      return;
    }, 1000);
  }
});



function showAttackEffect() {
  const effect = document.getElementById("attack-effect");
  if (!effect) return;

  effect.style.opacity = "1";
  setTimeout(() => {
    effect.style.opacity = "0";
  }, 300);
}


document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("rule-btn").addEventListener("click", ruleModal);
document.getElementById("restart-btn").addEventListener("click", startIntro);
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

/** 규칙 설명 모달 띄우기 */
function ruleModal() {
  document.getElementById("rule-modal").style.display = "flex";
}
document.getElementById("close-rule-btn").addEventListener("click", () => {
  document.getElementById("rule-modal").style.display = "none";
});


startIntro();


/**ID 기반 section 보이기 */
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
}

/***** INTRO SECTION *****/
function startIntro() {
  showSection("intro");
}

/***** GAME SECTION *****/
function startGame() {
  showSection("game"); //게임 화면 표시

  function init() {
    // 1. 스테이지 초기화
    stage = 1;
    stageMonster(stage); // currentMonster 객체를 초기화

    // 2. 플레이어 상태 초기화
    eden.health = eden.maxHealth;
    eden.score = 0;
    eden.attack = eden.basicAttack;

    //3. 공격 패턴 관련 변수 초기화
    currentRound = 1;
    attackPattern = [];
    currentIndex = 0;
    resultList = []; //라운드 블락 결과
    totalBlocks = 0;

    //4. UI 초기화
    resetHeartsUI(); //eden heart img UI init
  }

  init();

  showAnnouncementWithCallback("몬스터 등장!", 2000, () => {
    setTimeout(() => {
      console.log("startGame Method Run");
      nextRound();
    }, 1000); // 문구 사라진 후 1초 대기
  });

}

/***** RESULT SECTION *****/
function endGame() {
  showSection("result");
}


function updateMonsterHealthUI() {
  const fill = document.getElementById("monster-fill");

  const percentage = (currentMonster.health / currentMonster.maxHealth) * 100;
  fill.style.width = `${percentage}%`;

  if (percentage > 60) {
    fill.style.backgroundColor = "#4caf50"; // 초록
  } else if (percentage > 30) {
    fill.style.backgroundColor = "#ff9800"; // 주황
  } else {
    fill.style.backgroundColor = "#f44336"; // 빨강
  }
}


function triggerCounterAttack() {
  const monster = document.getElementById("monster-img"); // 몬스터 이미지 요소
  if (!monster) return;

  monster.classList.add("monster-hit");

  setTimeout(() => {
    monster.classList.remove("monster-hit");
  }, 500);
}


function generateAttackPattern() {
  attackPattern = [];
  for (let i = 0; i < currentMonster.patternLength; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    attackPattern.push(colors[randomIndex]);
  }
}



function showPatternSequence() {
  const container = document.getElementById("attack-sequence");
  container.innerHTML = "";
  resultList = [];

  attackPattern.forEach((color, index) => {
    const block = document.createElement("div");
    block.className = `attack ${color}`;
    block.dataset.index = index;
    container.appendChild(block);

    // 블록이 보여지는 시점 예약
    setTimeout(() => {
      currentIndex = index;
      inputAllowed = true;
      block.style.opacity = "1";

      // 블록 유지 시간 끝나면 입력 평가
      setTimeout(() => {
        inputAllowed = false;

        const wasBlocked = block.classList.contains("explode");
        const wasDamaged = block.classList.contains("damage");

        // 사용자가 아무 입력도 하지 않은 경우 실패 처리
        if (!wasBlocked && !wasDamaged) {
          block.classList.add("damage");
          resultList.push(false); // 실패
          applyPlayerDamageEffect(1);
          reducePlayerHearts(1);
        }

        // 마지막 블록이면 라운드 종료
        if (index === attackPattern.length - 1) {
          setTimeout(() => {
            const isPerfect = resultList.length === attackPattern.length && resultList.every(Boolean);
            if (isPerfect) {
              const attackBtn = document.getElementById("btn-attack");
              attackBtn.disabled = false;
              attackBtn.classList.add("active");
            }
            // else {
            //   console.log("showPatternSequence Method Run");
            //   nextRound();
            // }
          }, 500); // 결산 약간 지연
        }

      }, BLOCK_VISIBLE_DURATION_MS);

    }, index * BLOCK_DELAY_MS);
  });
}



function handleInput(color) {
  if (!inputAllowed) return;

  const container = document.getElementById("attack-sequence");
  const blocks = container.getElementsByClassName("attack");

  const currentBlock = blocks[currentIndex];
  const expectedColor = attackPattern[currentIndex];
  const isCorrect = (color === expectedColor);

  resultList[currentIndex] = isCorrect;

  if (isCorrect) {
    totalBlocks += 1;
    currentBlock.classList.add("explode");
    setTimeout(() => {
      currentBlock.style.opacity = "0";
    }, 500);
  } else {
    // 틀렸을 때 바로 damage 처리
    currentBlock.classList.add("damage");
    applyPlayerDamageEffect(1);
    reducePlayerHearts(1);
  }

  showResult(isCorrect ? "막음!" : "놓침", currentIndex);

  inputAllowed = false;

  // 마지막 블록이면 결산으로 넘어가기
  if (currentIndex === attackPattern.length - 1) {
    setTimeout(() => {
      const isPerfect = resultList.length === attackPattern.length && resultList.every(Boolean);
      if (isPerfect) {
        const attackBtn = document.getElementById("btn-attack");
        attackBtn.disabled = false;
        attackBtn.classList.add("active");
      } else {
        console.log("handleInput Method Run");
        nextRound();
      }
    }, 500);
  }
}




function showResult(text, index) {
  const container = document.getElementById("block-status");

  const msg = document.createElement("div");
  msg.className = "status-message";
  msg.textContent = text;
  container.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 1000);
}



function nextRound() {
  console.log("nextRound Method Run");
  attackPattern = [];
  resultList = [];
  generateAttackPattern();    // 1. 공격 패턴 생성
  setTimeout(() => {
    showPatternSequence();      // 2. 공격 패턴 보여주기
  }, 1000);
}

function nextStage() {
  stage++;

  if (stage > 3) {
    showAnnouncementWithCallback("모든 스테이지 클리어!", 3000, () => {
      handleGameOver();
    });
    return;
  }

  resultList = [];

  stageMonster(stage);

  showAnnouncementWithCallback(`Stage ${stage} 시작!`, 2000, () => {
    setTimeout(() => {
      console.log("nextStage Method Run");
      nextRound();
      return;
    }, 1000); // 문구 사라진 후 1초 대기
  });
}


function stageMonster(stage) {
  const data = monsterData[stage];
  if (!data) {
    console.warn("No monster data for stage", stage);
    return;
  }

  currentMonster.name = data.name;
  currentMonster.maxHealth = data.maxHealth;
  currentMonster.health = data.maxHealth;
  currentMonster.patternLength = data.patternLength;
  currentMonster.image = data.image;

  // UI 업데이트 (몬스터 이미지 + 공격 이펙트 div 삽입)
  const monsterImgContainer = document.getElementById("monster-img");
  if (monsterImgContainer) {
    monsterImgContainer.innerHTML = `
      <div class="monster-wrapper">
        <img src="${data.image}" alt="${data.name}" class="monster-image">
        <div id="attack-effect" class="attack-effect"></div>
      </div>
    `;
  }

  updateMonsterHealthUI();
}





function applyPlayerDamageEffect(failCount) {
  const player = document.querySelector("#player-img img");
  let hit = 0;

  function triggerHitEffect() {
    if (hit >= failCount) return;

    player.classList.add("player-damage");

    setTimeout(() => {
      player.classList.remove("player-damage");
      hit++;

      // 다음 타격 딜레이
      setTimeout(triggerHitEffect, 200);
    }, 300); // 애니메이션 지속 시간
  }

  triggerHitEffect();
}


function reducePlayerHearts(failCount) {
  const start = eden.health;
  const end = Math.max(0, eden.health - failCount);

  for (let i = start; i > end; i--) {
    const heart = document.getElementById(`heart-${i}`);
    if (heart) {
      heart.classList.remove("full");
      heart.innerHTML = `<img src="assets/heart-empty.png">`;
    }
  }

  eden.health = end;

  // 💀 생명력이 0 이하일 경우 게임 오버 처리
  if (eden.health <= 0) {
    handleGameOver();
  }
}


function handleGameOver() {
  showAnnouncementWithCallback("게임 오버!", 3000, () => {
    updateScoreDisplay(); //최종 스코어 UI 업데이트
    showSection("result"); // 결과 화면으로 전환

    //초기화는 GamePage가 시작될때 함.

    resetHeartsUI();
  });
}

/** score update method */
function updateScoreDisplay() {
  calculateFinalScore();

  document.getElementById("remain-health").textContent = eden.health;
  document.getElementById("clear-monster").textContent = stage - 1;
  document.getElementById("block-attacks").textContent = totalBlocks;
  document.getElementById("final-score").textContent = eden.score;
}

//Eden의 체력 UI 초기화 (하트를 모두 채워진 하트로)
function resetHeartsUI() {
  for (let i = 1; i <= 7; i++) {
    const heart = document.getElementById(`heart-${i}`);
    if (heart) {
      heart.classList.add("full");
      heart.innerHTML = `<img src="assets/heart-full.png">`;
    }
  }
}
/**
 * 최종 점수 계산
 * 최종 스코어 = (막은 공격 수) * (클리어한 스테이지 수 + 1) * (남은 체력 + 1)
 */
function calculateFinalScore() {
  eden.score = totalBlocks * (stage) * (eden.health + 1);
}

// 안내 문구 보이기
function showAnnouncementWithCallback(text, duration = 2000, callback) {
  const announcement = document.getElementById("announcement");
  announcement.textContent = text;
  announcement.style.opacity = "1";
  announcement.style.pointerEvents = "auto";

  setTimeout(() => {
    announcement.style.opacity = "0";
    announcement.style.pointerEvents = "none";

    // 콜백 실행
    if (typeof callback === "function") {
      callback();
    }
  }, duration);
}
