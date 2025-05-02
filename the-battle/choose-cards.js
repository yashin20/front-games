/**mini game field */
const GRID_WIDTH = 4;

const ENERGY_UP_AMOUNT = 15; // 회복량 +15
let playerObj;
let comObj;
let currentEnergy = 100; // 기본값
let currentRound = 1;


init();

function init() {
  checkCharSelect();

  // ✅ 이전 라운드 상태가 있으면 그걸 불러오고, 없으면 초기값 사용
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

  currentEnergy = playerObj.energy; // ✅ 전역 변수로 저장

  drawScoreBoard({ player: playerObj, com: comObj, round: currentRound });
  renderSkillCards(playerObj.name);
  placeCharacterAtCoord(playerObj.y, playerObj.x, MINI_IMG[playerObj.name]);
  placeCharacterAtCoord(comObj.y, comObj.x, MINI_IMG[comObj.name]);
}

function checkCharSelect() {
  // ✅ 선택된 캐릭터 가져오기
  const selectedCharacter = localStorage.getItem("selectedCharacter");
  if (!selectedCharacter) {
    // 선택 안 된 경우 처리
    alert("업데이트 대기 중 입니다! 다른 캐릭터를 선택해 주세요!");
    window.location.href = "select-character.html"; // 다시 선택 화면으로 이동
  }
}




function renderSkillCards(selectedCharacter) {
  const cardList = Object.keys(cardData[selectedCharacter]);
  const container = document.querySelector(".card-grid");

  // 현재 에너지 가져오기
  const gameState = JSON.parse(localStorage.getItem("gameState"));
  const currentEnergy = gameState?.player?.energy ?? 100;

  container.innerHTML = "";

  cardList.forEach(cardName => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "skill-card";
    cardDiv.dataset.character = cardName;

    const img = document.createElement("img");
    img.src = cardData[selectedCharacter][cardName];

    // ✅ 공격 카드인 경우 에너지 체크
    if (ATTACK_SKILLS[cardName]) {
      const { energyCost } = parseAttackCard(ATTACK_SKILLS[cardName]);
      if (currentEnergy < energyCost) {
        cardDiv.classList.add("disabled");
        cardDiv.dataset.disabled = "true";
      }
    }

    cardDiv.appendChild(img);
    container.appendChild(cardDiv);
  });
}

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




/**CHOOSE CARDS */
// 선택된 카드들의 src 저장용
const selectedCards = new Map();

// 카드 클릭 시 슬롯에 채워지는 로직
document.querySelectorAll(".skill-card").forEach(card => {
  card.addEventListener("click", () => {
    const cardImg = card.querySelector("img");
    const cardImgSrc = cardImg.src;
    const cardName = card.dataset.character; // 카드 이름 추출

    // 빈 슬롯 찾기
    const emptySlot = [...document.querySelectorAll(".card-slot")].find(slot => {
      return slot.querySelector("img") === null;
    });

    if (emptySlot) {
      const img = document.createElement("img");
      img.src = cardImgSrc;
      img.style.width = "80px"; // 적당히 줄여서 표시
      emptySlot.innerHTML = ""; // 기존 텍스트 제거
      emptySlot.appendChild(img);

      // 저장 (슬롯 → 카드 요소)
      selectedCards.set(emptySlot, { element: card, name: cardName });

      // 카드는 화면에서 제거 (중복 선택 방지)
      card.style.visibility = "hidden";

      // 슬롯 이미지 클릭 시 복귀
      img.addEventListener("click", () => {
        card.style.visibility = "visible";
        selectedCards.delete(emptySlot);
        emptySlot.innerHTML = "<span>PLACE CARD HERE</span>";

        // ⬅️ 상태 갱신
        updateCardAvailability();
      });

      // ⬅️ 상태 갱신
      updateCardAvailability();
    }
  });
});

// Clear 버튼 클릭 시 모두 초기화
document.querySelector(".btn.clear").addEventListener("click", () => {
  document.querySelectorAll(".card-slot").forEach(slot => {
    slot.innerHTML = "<span>PLACE CARD HERE</span>";
  });

  document.querySelectorAll(".skill-card").forEach(card => {
    card.style.visibility = "visible";
  });

  // 선택 목록 초기화
  selectedCards.clear();
  updateCardAvailability();
});


// ✅ 에너지 계산 함수
function getRemainingEnergy() {
  let totalAttackCost = 0;
  let totalEnergyUp = 0;

  for (let { name } of selectedCards.values()) {
    if (ATTACK_SKILLS[name]) {
      const { energyCost } = parseAttackCard(ATTACK_SKILLS[name]);
      totalAttackCost += energyCost;
    }
    if (name === "ENERGY_UP") {
      totalEnergyUp += ENERGY_UP_AMOUNT; // 누적 회복량
    }
  }

  return Math.min(currentEnergy - totalAttackCost + totalEnergyUp, 100);
}


//🧩 2. 공격 카드 비활성화 갱신 함수
function updateCardAvailability() {
  const remaining = getRemainingEnergy();

  document.querySelectorAll(".skill-card").forEach(card => {
    const cardName = card.dataset.character;

    if (ATTACK_SKILLS[cardName]) {
      const { energyCost } = parseAttackCard(ATTACK_SKILLS[cardName]);
      
      const alreadySelected = [...selectedCards.values()].some(c => c.name === cardName);

      // 이미 선택된 카드거나, 소모 에너지 초과인 경우 비활성화
      if (remaining < energyCost && !alreadySelected) {
        card.classList.add("disabled");
        card.dataset.disabled = "true";
      } else {
        card.classList.remove("disabled");
        delete card.dataset.disabled;
      }
    }
  });
}



// 🔍 선택된 카드 순서를 확인하는 함수
function getSelectedCardNamesInOrder() {
  const slotList = [...document.querySelectorAll(".card-slot")];
  return slotList.map(slot => {
    const cardInfo = selectedCards.get(slot);
    return cardInfo ? cardInfo.name : null;
  });
}

// continue 버튼에 클릭 이벤트 추가
document.querySelector(".btn.continue").addEventListener("click", () => {
  const selected = getSelectedCardNamesInOrder();

  if (selected.filter(Boolean).length !== 3) {
    // alert("카드 3장을 선택해주세요!");
    showAlert("카드 3장을 선택해주세요!");
    return;
  }

  // 로컬 스토리지에 카드 순서 저장
  localStorage.setItem("selectedCards", JSON.stringify(selected));

  // 결과 페이지로 이동
  window.location.href = "game.html";
});

function getIndexFromCoord(y, x) {
  return y * GRID_WIDTH + x;
}

function placeCharacterAtCoord(y, x, imageSrc) {
  const index = getIndexFromCoord(y, x);
  const cells = document.querySelectorAll(".battle-grid .cell");
  if (index >= 0 && index < cells.length) {
    cells[index].innerHTML = ""; // 기존 내용 제거
    const img = document.createElement("img");
    img.src = imageSrc;
    img.style.width = "60px";
    cells[index].appendChild(img);
  }
}
