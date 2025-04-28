/**기본 실행 메서드 */
/**1. Score Board */
/**스코어 보드 데이터기반 시각화(health, energy, name, round, photo) */
function drawScoreBoard({ player, com, round }) {
  // Health, Energy 퍼센트 계산
  const playerHpRatio = player.health / 100;
  const comHpRatio = com.health / 100;
  const playerEnRatio = player.energy / 100;
  const comEnRatio = com.energy / 100;

  // 플레이어 스코어보드
  document.getElementById("player-hp").textContent = `DM ${player.health}`;
  document.getElementById("player-en").textContent = `EN ${player.energy}`;
  document.getElementById("player-hp-fill").style.width = `${playerHpRatio * 100}%`;
  document.getElementById("player-en-fill").style.width = `${playerEnRatio * 100}%`;
  // 깜빡임 처리
  document.querySelector("#player-hp-fill").classList.toggle("blinking", playerHpRatio <= 0.3);

  // COM 스코어보드
  document.getElementById("com-hp").textContent = `DM ${com.health}`;
  document.getElementById("com-en").textContent = `EN ${com.energy}`;
  document.getElementById("com-hp-fill").style.width = `${comHpRatio * 100}%`;
  document.getElementById("com-en-fill").style.width = `${comEnRatio * 100}%`;
  // 깜빡임 처리
  document.querySelector("#com-hp-fill").classList.toggle("blinking", comHpRatio <= 0.3);


  //이름 및 라운드
  document.getElementById("player-name").textContent = CHAR_NAMES[player.name] || player.name;
  document.getElementById("com-name").textContent = CHAR_NAMES[com.name] || com.name;
  document.querySelector("#player-photo img").src = `img/char/${player.name.toLowerCase()}/${player.name.toLowerCase()}-head-l.png`;
  document.querySelector("#com-photo img").src = `img/char/${com.name.toLowerCase()}/${com.name.toLowerCase()}-head-r.png`;

  document.getElementById("round-number").innerHTML = `ROUND<br>${String(round).padStart(2, "0")}`;
}

/**캐릭터 이동, 가드, 에너지 회복, 공격 */
/**MOVE METHOD
 * move
 * dir : 0, 1, 2, 3 (up, down, left, right) 
 */
function move(dir) {
  let dy = [-1, 1, 0, 0];
  let dx = [0, 0, -1, 1];

  const fromY = this.y;
  const fromX = this.x;

  let ny = this.y + dy[dir];
  let nx = this.x + dx[dir];

  if (isValid(ny, nx)) {
    this.y = ny;
    this.x = nx;

    logAction(`${this.name} : (${fromY}, ${fromX}) -> (${ny}, ${nx})`);
  } else {
    logAction(`이동 불가! (${ny}, ${nx})`);
  }
}

/** Validation of (ny, nx) checking */
function isValid(ny, nx) {
  return ny >= 0 && ny <= 2 && nx >= 0 && nx <= 3;
}

/**
 * Energe Up
 *  */
function energyUp() {
  let newEnergy = this.energy + 15;
  if (newEnergy > 100) newEnergy = 100;

  this.energy = newEnergy;

  const isPlayer = this.name === selectedCharacter;

  logAction(`${this.name} Energy Up (${this.energy})`);
  energyUpAnim(this, isPlayer);
}

/**
 * Guard
 */
function guard() {
  this.isGuarding = true;

  const isPlayer = this.name === selectedCharacter;

  logAction(`${this.name} 가드 발동! 다음 공격 피해 감소`);
  guardAnim(this, isPlayer);
}



/**
 * ATTACK METHOD
 */

/**Attacking Range 
 * 1 ~ 9 타격 범위 설정
*/
let ay = [100, -1, -1, -1, 0, 0, 0, 1, 1, 1];
let ax = [100, -1, 0, 1, -1, 0, 1, -1, 0, 1];

/**Attack
 * - param: target
 * - attackCard: SUPER_WEIGHT
 *  */
function attack(target, attackCard) {
  const { range, damage, energyCost } = parseAttackCard(ATTACK_SKILLS[attackCard]);

  //using energy
  if (this.energy < energyCost) {
    logAction("에너지가 부족하여 공격할 수 없습니다.");
    return;
  }
  this.energy -= energyCost;

  let hit = false; //피격 여부 확인
  const hitPositions = []; // ✅ 애니메이션용 좌표 저장

  //현재 위치로 부터 유효한 타격 위치 체크
  for (let i = 0; i < range.length; i++) {
    let rangeIndex = range[i];
    let hitY = this.y + ay[rangeIndex];
    let hitX = this.x + ax[rangeIndex];

    if (isValid(hitY, hitX)) {
      logAction(`💥 공격이 (${hitY}, ${hitX}) 좌표에 떨어졌습니다.`);
      /**ATTACK animation 적용 좌표 */
      hitPositions.push([hitY, hitX]);

      if (!hit && isHit(target, hitY, hitX)) {
        let finalDamage = damage;

        if (target.isGuarding) {
          finalDamage = Math.max(0, damage - 15);
          logAction(`🛡️ 가드로 피해 감소! 원래 ${damage} → 실제 ${finalDamage}`);
          target.isGuarding = false; // 가드 효과는 1번만 적용
        }

        target.health -= finalDamage;
        hit = true;

        logAction(`🎯 ${target.name} 피격!`);
        logAction(`📍 피격 위치: (${hitY}, ${hitX})`);
        logAction(`❤️ 남은 체력: ${target.health}`);
      }
    }
  }

  if (!hit) {
    logAction("❌ 공격은 명중하지 않았습니다.");
  }

  //공격 애니메이션
  const effectFn = AttackEffects[attackCard] || AttackEffects["DEFAULT"];
  effectFn(target, hitPositions);
}

/**is Hit Checking (피격 여부 판단)*/
function isHit(target, hitY, hitX) {
  return target.y === hitY && target.x === hitX;
}

//시그니처 스킬 애니메이션 이펙트
const AttackEffects = {
  "SUPER_WEIGHT": (target, hitPositions) => {
    basicAttackAnim(target, hitPositions);
    attackFireExplosionBitGif(target, hitPositions);
  },
  "FINAL_REPEAT": (target, hitPositions) => {
    basicAttackAnim(target, hitPositions);
    attackFireExplosionBitGif(target, hitPositions);
  },
  "POWER_SWING": (target, hitPositions) => {
    basicAttackAnim(target, hitPositions);
    attackFireExplosionBitGif(target, hitPositions);
  },
  "GRAND_SLAM": (target, hitPositions) => {
    basicAttackAnim(target, hitPositions);
    attackFireExplosionBitGif(target, hitPositions);
  },
  "BAT_STORM": (target, hitPositions) => {
    basicAttackAnim(target, hitPositions);
    attackStormEffectGif(target, hitPositions);
  },
  // 기본 효과 (정의되지 않은 카드용)
  "DEFAULT": (target, hitPositions) => {
    basicAttackAnim(target, hitPositions);
    attackDefaultEffectGif(target, hitPositions);
  }
};




/**action logging method */
function logAction(text) {
  console.log(text);
  const logBox = document.getElementById("action-log");
  const p = document.createElement("p");
  p.textContent = text;
  logBox.appendChild(p);
  logBox.scrollTop = logBox.scrollHeight; // 자동 스크롤
}

/**character object */
class Character {
  constructor(name, startY, startX) {
    this.name = name;
    this.y = startY;
    this.x = startX;
    this.energy = 100;
    this.health = 100;
    this.isGuarding = false;

    const baseDeck = ["MOVE_UP", "MOVE_DOWN", "MOVE_LEFT", "MOVE_RIGHT", "ENERGY_UP"];
    this.deck = [...baseDeck, ...CHARACTERS[name].attackCards];
  }

  async move(dir) {
    move.call(this, dir); // ⭐ move도 Promise를 리턴해야 함
  }

  async energyUp() {
    energyUp.call(this); // ⭐ energyUp도 Promise를 리턴해야 함
  }

  async guard() {
    guard.call(this); // ⭐ guard도 Promise를 리턴해야 함
  }

  async attack(target, card) {
    attack.call(this, target, card); // ⭐ attack도 Promise를 리턴해야 함
  }

  isDead() {
    return this.health <= 0;
  }
}

function reviveCharacter(data) {
  const revived = new Character(data.name, data.y, data.x);

  // 저장된 상태 복원
  revived.energy = data.energy;
  revived.health = data.health;
  revived.isGuarding = data.isGuarding;

  return revived;
}

// ✅ 남은 캐릭터 중에서 랜덤으로 com 선택
function getRandomComCharacter(exclude) {
  const keys = Object.keys(CHARACTERS).filter(name => name !== exclude);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}



/******************************************
 * PLAYER / COM 생성!
 */
window.selectedCharacter = localStorage.getItem("selectedCharacter");
window.comCharacter = getRandomComCharacter(window.selectedCharacter);
localStorage.setItem('comCharacter', window.comCharacter);//로컬 스토리지에 컴퓨터 선택 캐릭터 저장

/** Create Object */
window.GameData = {
  player: new Character(window.selectedCharacter, 1, 0),
  com: new Character(window.comCharacter, 1, 3)
};