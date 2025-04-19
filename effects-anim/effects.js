// saveTest.js
window.animate = {
  move(character, fromY, fromX, toY, toX) {
    const fromCell = document.querySelector(`td[data-pos="${fromY}-${fromX}"]`);
    const toCell = document.querySelector(`td[data-pos="${toY}-${toX}"]`);
    const charEl = fromCell.querySelector(`.char[data-name="${character.name}"]`);
    const field = fromCell.closest(".field");

    if (!charEl || !fromCell || !toCell || !field) return;

    // 2. 방향 계산
    const dx = toX - fromX;
    const dy = toY - fromY;

    // 💡 다음 프레임에서 이동 시작
    requestAnimationFrame(() => {
      if (dx === 1) charEl.classList.add("go-right");
      else if (dx === -1) charEl.classList.add("go-left");
      else if (dy === -1) charEl.classList.add("go-up");
      else if (dy === 1) charEl.classList.add("go-down");
    });

    setTimeout(() => {
      charEl.remove();
      const newChar = document.createElement("div");
      newChar.className = "char";
      newChar.dataset.name = character.name;
      newChar.innerText = character.name[0];
      toCell.appendChild(newChar);
    }, 350);
  },

  energyUp(character) {
    const el = document.querySelector(`.char[data-name="${character.name}"]`);
    if (!el) return;
    const flash = document.createElement("div");
    flash.className = "energy-effect";
    el.appendChild(flash);
    setTimeout(() => flash.remove(), 2000);
  },
  guard(character) {
    const el = document.querySelector(`.char[data-name="${character.name}"]`);
    if (!el) return;

    // 기존 light blue glow 유지
    el.classList.add("guarding");
    setTimeout(() => el.classList.remove("guarding"), 500);

    // 방패 이펙트 추가
    const shield = document.createElement("div");
    shield.className = "shield";
    el.appendChild(shield);

    setTimeout(() => shield.remove(), 2000);
  },
  attack(character, hitPositions) {
    const charEl = document.querySelector(`.char[data-name="${character.name}"]`);
    if (!charEl) return;

    const field = charEl.closest('.field');
    if (!field) return;

    // 1. 카메라 흔들림 효과
    field.classList.add("shake");
    setTimeout(() => field.classList.remove("shake"), 300);

    // 2. 히트 이펙트 생성 (좌표 → 해당 셀에 넣기)
    hitPositions.forEach(([y, x]) => {
      const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
      if (!td) return;

      const hitEl = document.createElement("div");
      hitEl.className = "hit-effect";
      td.appendChild(hitEl);

      setTimeout(() => hitEl.remove(), 600);
    });
  },
  attackTwo(character, hitPositions) {
    const charEl = document.querySelector(`.char[data-name="${character.name}"]`);
    if (!charEl) return;

    const field = charEl.closest('.field');
    if (!field) return;

    // 1. 카메라 흔들림 효과
    field.classList.add("shake");
    setTimeout(() => field.classList.remove("shake"), 300);

    // 2. 히트 이펙트 생성 (좌표 → 해당 셀에 넣기)
    hitPositions.forEach(([y, x]) => {
      const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
      if (!td) return;

      const hitEl = document.createElement("div");
      hitEl.className = "hit-effect-two";
      td.appendChild(hitEl);

      setTimeout(() => hitEl.remove(), 600);
    });
  },
  attackThird(character, hitPositions) {
    const charEl = document.querySelector(`.char[data-name="${character.name}"]`);
    if (!charEl) return;

    const field = charEl.closest('.field');
    if (!field) return;

    // 1. 카메라 흔들림 효과
    field.classList.add("shake");
    setTimeout(() => field.classList.remove("shake"), 300);

    // 2. 히트 이펙트 생성 (좌표 → 해당 셀에 넣기)
    hitPositions.forEach(([y, x]) => {
      const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
      if (!td) return;

      const effect = document.createElement("div");
      effect.className = "attack-effect";
      td.appendChild(effect);

      setTimeout(() => effect.remove(), 800);
    });
  },
  attackStorm(character, hitPositions) {
    const charEl = document.querySelector(`.char[data-name="${character.name}"]`);
    if (!charEl) return;

    const field = charEl.closest('.field');
    if (!field) return;

    // 1. 카메라 흔들림 효과
    field.classList.add("shake");
    setTimeout(() => field.classList.remove("shake"), 300);

    // 2. 히트 이펙트 생성 (좌표 → 해당 셀에 넣기)
    hitPositions.forEach(([y, x]) => {
      const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
      if (!td) return;

      const effect = document.createElement("div");
      effect.className = "attack-storm-effect";
      td.appendChild(effect);

      setTimeout(() => effect.remove(), 800);
    });
  },
  attackFire(character, hitPositions) {
    const charEl = document.querySelector(`.char[data-name="${character.name}"]`);
    if (!charEl) return;

    const field = charEl.closest('.field');
    if (!field) return;

    // 1. 카메라 흔들림 효과
    field.classList.add("shake");
    setTimeout(() => field.classList.remove("shake"), 300);

    // 2. 히트 이펙트 생성 (좌표 → 해당 셀에 넣기)
    hitPositions.forEach(([y, x]) => {
      const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
      if (!td) return;

      const effect = document.createElement("div");
      effect.className = "attack-fire-effect";
      td.appendChild(effect);

      setTimeout(() => effect.remove(), 800);
    });
  },
  explosion(character, hitPositions) {
    const charEl = document.querySelector(`.char[data-name="${character.name}"]`);
    if (!charEl) return;

    const field = charEl.closest('.field');
    if (!field) return;

    // 1. 카메라 흔들림 효과
    field.classList.add("shake");
    setTimeout(() => field.classList.remove("shake"), 300);

    // 2. 히트 이펙트 생성 (좌표 → 해당 셀에 넣기)
    hitPositions.forEach(([y, x]) => {
      const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
      if (!td) return;

      const effect = document.createElement("div");
      effect.className = "attack-fire-explosion-effect";
      td.appendChild(effect);

      setTimeout(() => effect.remove(), 800);
    });
  },
  explosionBlue(character, hitPositions) {
    const charEl = document.querySelector(`.char[data-name="${character.name}"]`);
    if (!charEl) return;

    const field = charEl.closest('.field');
    if (!field) return;

    // 1. 카메라 흔들림 효과
    field.classList.add("shake");
    setTimeout(() => field.classList.remove("shake"), 300);

    // 2. 히트 이펙트 생성 (좌표 → 해당 셀에 넣기)
    hitPositions.forEach(([y, x]) => {
      const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
      if (!td) return;

      const effect = document.createElement("div");
      effect.className = "attack-fire-blue-explosion-effect";
      td.appendChild(effect);

      setTimeout(() => effect.remove(), 800);
    });
  }

};


function resetField() {
  const field = document.querySelector(".field");
  if (!field) return;

  const tds = field.querySelectorAll("td");
  tds.forEach(td => {
    td.innerHTML = ""; // 각 셀 안의 내용을 모두 제거
  });
}

function placeCharacter(characterName, y, x) {
  const cell = document.querySelector(`.field td[data-pos="${y}-${x}"]`);
  if (!cell) return;

  const charEl = document.createElement("div");
  charEl.classList.add("char");
  charEl.dataset.name = characterName;
  charEl.innerText = characterName[0]; // 첫 글자만 표시하거나 원하는 대로

  cell.appendChild(charEl);
}


let moveCharPos = { y: 1, x: 1 }; // 초기 위치

window.addEventListener("DOMContentLoaded", () => {
  const moveChar = { name: "MOVE-CHAR" };
  const energyChar = { name: "ENERGY-CHAR" };
  const guardChar = { name: "GUARD-CHAR" };
  const attackChar = { name: "ATTACK-CHAR" };
  const attackCharTwo = { name: "ATTACK-CHAR-TWO" };
  const attackCharThird = { name: "ATTACK-CHAR-THIRD" };

  document.getElementById("moveUpBtn").onclick = () => {
    const { y, x } = moveCharPos;
    const newY = y - 1;
    if (newY >= 0) {
      window.animate.move(moveChar, y, x, newY, x);
      moveCharPos.y = newY;
    }
  };

  document.getElementById("moveDownBtn").onclick = () => {
    const { y, x } = moveCharPos;
    const newY = y + 1;
    if (newY <= 2) {
      window.animate.move(moveChar, y, x, newY, x);
      moveCharPos.y = newY;
    }
  };

  document.getElementById("moveLeftBtn").onclick = () => {
    const { y, x } = moveCharPos;
    const newX = x - 1;
    if (newX >= 0) {
      window.animate.move(moveChar, y, x, y, newX);
      moveCharPos.x = newX;
    }
  };

  document.getElementById("moveRightBtn").onclick = () => {
    const { y, x } = moveCharPos;
    const newX = x + 1;
    if (newX <= 3) {
      window.animate.move(moveChar, y, x, y, newX);
      moveCharPos.x = newX;
    }
  };


  document.getElementById("resetBtn").onclick = () => {
    resetField();
    moveCharPos = { y: 1, x: 1 }; // 초기화
    placeCharacter("MOVE-CHAR", 1, 1);
  };



  document.getElementById("energyBtn").onclick = () =>
    window.animate.energyUp(energyChar);

  document.getElementById("guardBtn").onclick = () =>
    window.animate.guard(guardChar);

  document.getElementById("attackBtn").onclick = () =>
    window.animate.attack(attackChar, [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]);

  document.getElementById("attackBtnTwo").onclick = () =>
    window.animate.attackTwo(attackCharTwo, [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]);

  document.getElementById("attackBtnThird").onclick = () =>
    window.animate.attackThird(attackCharThird, [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]);

  document.getElementById("attackBtnStorm").onclick = () =>
    window.animate.attackStorm(attackCharThird, [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]);

  document.getElementById("attackFireBtn").onclick = () =>
    window.animate.attackFire(attackCharThird, [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]);

  document.getElementById("explosion").onclick = () =>
    window.animate.explosion(attackCharThird, [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]);

  document.getElementById("blue-explosion").onclick = () =>
    window.animate.explosionBlue(attackCharThird, [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]);
});
