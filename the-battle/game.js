document.getElementById("nextRoundBtn").onclick = () => {
  currentRound++;
  // 현재 상태 저장
  localStorage.setItem("gameState", JSON.stringify({
    player: playerObj,
    com: comObj,
    round: currentRound
  }));
  // 카드 선택 화면으로 이동 (예: 라운드 초기화용)
  window.location.href = "choose-cards.html";
};
document.getElementById("restartBtn").onclick = () => {
  window.location.href = "select-character.html"; //캐릭터 선택 화면으로 이동
};

let cardIndex = 0;
let playerCards, comCards, playerObj, comObj;
let actionQueue = []; //round의 실행 카드 6개 
let currentRound = 1;


init();

function init() {
  checkCharSelect(); //플레이어 캐릭터 선택 여부 확인

  //이전 라운드의 
  let savedState = localStorage.getItem("gameState");

  if (savedState) {
    const parsed = JSON.parse(savedState);
    playerObj = reviveCharacter(parsed.player);
    comObj = reviveCharacter(parsed.com);
    currentRound = parsed.round || 1;
  } else {
    playerObj = window.GameData.player;
    comObj = window.GameData.com;
    currentRound = 1;
  }

  cardIndex = 0;

  //player, com 카드 선택 + 순서 설정
  const selected = JSON.parse(localStorage.getItem("selectedCards"));
  const comSelected = generateRandomComCards();

  //display cards
  renderPlayerCards(selected);
  renderComCards(comSelected);

  // 카드 전부 가려놓기

  //Round(3 turn) 진행
  setupRound(selected, comSelected, playerObj, comObj, currentRound);

  // Round 시작 메시지 표시
  showRoundMessage(`ROUND ${currentRound}<br>START!`);

  // ⭐ 초기에는 전부 가려놓기
  updateCardVisibility(-1);

  // ⭐ 3초 후에 executeCard() 실행
  setTimeout(() => {
    executeCard();
  }, 3000);
}

function setupRound(selected, comSelected, player, com, currentRound) {
  playerCards = selected;
  comCards = comSelected;
  playerObj = player;
  comObj = com;
  cardIndex = 0;

  // 우선순위 기반 큐 생성
  actionQueue = [];

  for (let i = 0; i < 3; i++) {
    const turnCards = [
      {
        actor: playerObj,
        target: comObj,
        card: playerCards[i],
        priority: getCardPriority(playerCards[i]),
      },
      {
        actor: comObj,
        target: playerObj,
        card: comCards[i],
        priority: getCardPriority(comCards[i]),
      },
    ];

    // 우선순위에 따라 정렬 후 큐에 추가
    turnCards.sort((a, b) => a.priority - b.priority);
    actionQueue.push(...turnCards);
  }

  drawScoreBoard({ player, com, round: currentRound });
  drawCharactersToField(player, com);
}

function executeCard() {
  if (isGameOver()) {
    gameOver();
    return;
  }

  if (cardIndex >= actionQueue.length) {
    showRoundMessage(`ROUND ${currentRound}<br>END!`);

    // 다음 라운드 버튼 보이기
    document.getElementById("nextRoundBtn").style.visibility = "visible";
    return;
  }

  const action = actionQueue[cardIndex];
  action.actor.isGuarding = false;

  activateCard(action.card, action.actor, action.target);

  // ⭐ 카드 보이기 업데이트
  updateCardVisibility(cardIndex);

  drawScoreBoard({ player: playerObj, com: comObj, round: currentRound });
  drawCharactersToField(playerObj, comObj);

  // 애니메이션 시간에 맞춰 딜레이 후, 다음 카드로 진행
  let delay = getActionDelay(action.card);

  setTimeout(() => {
    // 카드 인덱스 증가
    cardIndex++;

    // 다음 카드 실행
    executeCard();
  }, delay);  // 카드에 설정된 시간만큼 대기
}

// 각 카드에 따른 실행 시간 반환
function getActionDelay(cardName) {
  if (cardName.startsWith("MOVE_")) {
    return 1000;
  } else if (cardName === "GUARD") {
    return 2000;
  } else if (cardName === "ENERGY_UP") {
    return 2000;
  } else { //ATTACK CARD
    return 2000;
  }
}

// 만약 필요하면 작은 딜레이 함수
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



function isGameOver() {
  return playerObj.isDead() || comObj.isDead();
}

function gameOver() {
  //local storage 정리
  localStorage.removeItem("gameState");
  localStorage.removeItem("selectedCards");
  localStorage.removeItem("selectedCharacter");
  localStorage.removeItem("comCharacter");

  //win OR lose Message
  const resultText = playerObj.isDead() ? "LOSE" : "WIN!";
  document.getElementById("gameResult").textContent = resultText; // ⭐ 모달에 결과 출력

  showGameOverModal();
}

function showGameOverModal() {
  document.getElementById("gameOverModal").classList.remove("hidden");
}




/** 게임 화면 카드 관련*/
function renderPlayerCards(cardKeys) {
  cardKeys.forEach((key, i) => {
    const slotNum = 3 - i;
    const cardDiv = document.getElementById(`player-card-${slotNum}`);
    if (cardDiv && cardData[selectedCharacter][key]) {
      cardDiv.innerHTML = "";

      const cardInner = document.createElement("div");
      cardInner.className = "card-inner";

      const front = document.createElement("div");
      front.className = "card-front";
      front.appendChild(createCardImage(cardData[selectedCharacter][key]));

      const back = document.createElement("div");
      back.className = "card-back"; // 덮개

      cardInner.appendChild(front);
      cardInner.appendChild(back);
      cardDiv.appendChild(cardInner);

      // const img = createCardImage(cardData[selectedCharacter][key]);
      // cardDiv.appendChild(img);

      // const cover = createCoverLayer(); // ⭐ 덮개 추가
      // cardDiv.appendChild(cover);
    }
  });
}

function renderComCards(cardKeys) {
  cardKeys.forEach((key, i) => {
    const cardDiv = document.getElementById(`com-card-${i + 1}`);
    if (cardDiv && cardData[comCharacter][key]) {
      cardDiv.innerHTML = "";

      const cardInner = document.createElement("div");
      cardInner.className = "card-inner";

      const front = document.createElement("div");
      front.className = "card-front";
      front.appendChild(createCardImage(cardData[comCharacter][key]));

      const back = document.createElement("div");
      back.className = "card-back"; // 덮개

      cardInner.appendChild(front);
      cardInner.appendChild(back);
      cardDiv.appendChild(cardInner);

      // const img = createCardImage(cardData[comCharacter][key]);
      // cardDiv.appendChild(img);

      // const cover = createCoverLayer(); // ⭐ 덮개 추가
      // cardDiv.appendChild(cover);
    }
  });
}

// 검정 덮개 생성
function createCoverLayer() {
  const cover = document.createElement("div");
  cover.classList.add("card-cover");
  return cover;
}

function generateRandomComCards() {
  const cards = cardData[comCharacter];
  const cardKeys = Object.keys(cards);
  const ENERGY_UP_AMOUNT = 15;

  const currentEnergy = comObj.energy;

  //ENERGY 상황에 유효한 조합을 찾을때 까지 무한 시도
  while (true) {
    const shuffled = shuffle([...cardKeys]);
    const candidate = shuffled.slice(0, 3);

    let energy = currentEnergy;
    let isValid = true;

    for (const key of candidate) {
      if (key === "ENERGY_UP") {
        energy = Math.min(energy + ENERGY_UP_AMOUNT, 100);
      } else if (ATTACK_SKILLS[key]) {
        const { energyCost } = parseAttackCard(ATTACK_SKILLS[key]);
        if (energy < energyCost) {
          isValid = false;
          break;
        }
        energy -= energyCost;
      }
    }

    if (isValid) {
      localStorage.setItem("comSelectedCards", JSON.stringify(candidate));
      return candidate;
    }
  }
}

// 배열 섞기 유틸
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createCardImage(src) {
  const img = document.createElement("img");
  img.src = src;
  img.style.width = "80px";
  return img;
}




/**System Method (시스템 구성 메서드) */

/**game field에 캐릭터 배치 */
function drawCharactersToField(player, com) {
  // 1. 필드 전체 초기화 (캐릭터만 제거)
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 4; x++) {
      const cell = document.getElementById(`${y}${x}`);
      const characters = cell.querySelectorAll(".character");
      characters.forEach(char => char.remove());
    }
  }

  // 2. 캐릭터 삽입 함수
  function insertCharacter(character, isPlayer) {
    const cellId = `${character.y}${character.x}`;
    const cell = document.getElementById(cellId);

    const charName = character.name.toLowerCase();
    const direction = isPlayer ? "l" : "r";

    const wrapper = document.createElement("div");
    wrapper.className = `character ${isPlayer ? "player" : "com"}`;
    wrapper.setAttribute("data-name", character.name); //'data-name' 속성

    const img = document.createElement("img");
    img.src = `img/char/${charName}/${charName}-standing-${direction}.png`;
    img.alt = character.name;

    wrapper.appendChild(img);
    cell.appendChild(wrapper);
  }

  insertCharacter(player, true);
  insertCharacter(com, false);
}



/**
 * 캐릭터 상태 체크 및 업데이트
 */

/**State Update */


//ATTACK Skill (range, damage, energyCost) 분할하기
function parseAttackCard(card) {
  console.log("parseAttackCard called with:", card); // 🪵 확인용

  // 예: "ATTACK-456-50-10"
  const [, rangeStr, damageStr, energyStr] = card.split("-");
  return {
    range: [...rangeStr].map(Number),  // "456" -> [4, 5, 6]
    damage: parseInt(damageStr, 10),
    energyCost: parseInt(energyStr, 10)
  };
}



function checkCharSelect() {
  // ✅ 선택된 캐릭터 가져오기
  const selectedCharacter = localStorage.getItem("selectedCharacter");
  if (!selectedCharacter) {
    // 선택 안 된 경우 처리
    alert("캐릭터가 선택되지 않았습니다.");
    window.location.href = "select-character.html"; // 다시 선택 화면으로 이동
  }
}


//카드 종류에 따른 우선순위 부여
function getCardPriority(card) {
  if (card.startsWith("MOVE_")) return 1;
  if (card === "GUARD") return 2;
  if (card === "ENERGY_UP") return 3;
  return 4; // 공격 카드
}

/**card skill 효과 발동 */
async function activateCard(cardName, self, target) {
  if (cardName.startsWith("MOVE_")) {
    const dir = getMoveDirection(cardName); // 문자열 → 숫자
    if (dir !== undefined) self.move(dir);
  } else if (cardName === "GUARD") {
    self.guard();
  } else if (cardName === "ENERGY_UP") {
    self.energyUp();
  } else {
    self.attack(target, cardName);
  }
}


function getMoveDirection(cardName) {
  const map = {
    MOVE_UP: 0,
    MOVE_DOWN: 1,
    MOVE_LEFT: 2,
    MOVE_RIGHT: 3
  };
  return map[cardName];
}





function showRoundMessage(text) {
  const messageEl = document.getElementById("roundMessage");
  // messageEl.textContent = text;
  messageEl.innerHTML = text; // 줄바꿈 처리 위해 innerHTML 사용
  messageEl.classList.remove("hidden");

  setTimeout(() => {
    messageEl.classList.add("show");

    setTimeout(() => {
      messageEl.classList.remove("show");

      setTimeout(() => {
        messageEl.classList.add("hidden");
      }, 800); // fade-out 끝난 후 hidden
    }, 2000); // 보여주는 시간 2초
  }, 50); // 살짝 딜레이 후 fade-in
}


function updateCardVisibility(cardIndex) {
  // 카드 번호: 1~3
  const turnNumber = Math.floor(cardIndex / 2) + 1;

  for (let i = 1; i <= 3; i++) {
    document.getElementById(`player-card-${i}`).classList.remove("flipped");
    document.getElementById(`com-card-${i}`).classList.remove("flipped");
  }

  if (turnNumber >= 1 && turnNumber <= 3) {
    document.getElementById(`player-card-${4 - turnNumber}`).classList.add("flipped"); // 3→1
    document.getElementById(`com-card-${turnNumber}`).classList.add("flipped");       // 1→3
  }
}
