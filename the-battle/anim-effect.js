/**move animation */


/**energy-up animation */
function energyUpAnim(character, isPlayer) {
  //gamefield 불러오기
  const field = document.querySelector('.gamefield');
  if (!field) return;

  //character point (y, x)
  const y = character.y;
  const x = character.x;

  //point <td>
  const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
  if (!td) return;

  const energyFlash = document.createElement("div");
  energyFlash.className = "energy-effect";
  if (isPlayer) {
    energyFlash.classList.add("player");
  } else {
    energyFlash.classList.add("com");
  }
  td.appendChild(energyFlash);
  console.log("energy-up animation");

  setTimeout(() => {
    energyFlash.remove();
  }, 2000);
}

/**guard animation */
function guardAnim(character, isPlayer) {
  //gamefield 불러오기
  const field = document.querySelector('.gamefield');
  if (!field) return;

  //character point (y, x)
  const y = character.y;
  const x = character.x;

  //point <td>
  const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
  if (!td) return;

  // 방패 이펙트
  const shield = document.createElement("div");
  shield.className = "shield";
  if (isPlayer) {
    shield.classList.add("player-pos");
  } else {
    shield.classList.add("com");
  }
  td.appendChild(shield);

  // ⭐ 쉴드 상태 체크 (쉴드는 계속 유지)
  const interval = setInterval(() => {
    if (!character.isGuarding) {
      shield.remove();
      clearInterval(interval);
    }
  }, 100); // 0.1초마다 상태 확인
}


/**attack animation - basic(HTML + CSS) */
function basicAttackAnim(character, hitPositions, damage = 0) {
  const field = document.querySelector('.gamefield');
  if (!field) return;

  // 1. 카메라 흔들림 효과
  field.classList.add("shake");
  setTimeout(() => field.classList.remove("shake"), 300);

  // 2. 히트 이펙트 + 데미지 숫자 생성
  hitPositions.forEach(([y, x]) => {
    const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
    if (!td) return;

    // 히트 이펙트
    const hitEl = document.createElement("div");
    hitEl.className = "hit-effect";
    td.appendChild(hitEl);

    // 데미지 숫자
    const dmgEl = document.createElement("div");
    dmgEl.className = "damage-text";
    dmgEl.textContent = `-${damage}`;
    td.appendChild(dmgEl);

    setTimeout(() => {
      hitEl.remove();
      dmgEl.remove();
    }, 1000);
  });
}

/**attack animation - "default-effect.gif" */
function attackDefaultEffectGif(character, hitPositions) {
  const field = document.querySelector('.gamefield');
  if (!field) return;

  // 1. 카메라 흔들림 효과
  field.classList.add("shake");
  setTimeout(() => field.classList.remove("shake"), 300);

  // 2. 히트 이펙트 생성 (좌표 → 해당 셀에 넣기)
  hitPositions.forEach(([y, x]) => {
    const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
    if (!td) return;

    const effect = document.createElement("div");
    effect.className = "attack-default";
    td.appendChild(effect);

    setTimeout(() => {
      effect.remove();
    }, 3000);
  });
}

/**attack animation - "fire-explosion-bit.gif" */
function attackFireExplosionBitGif(character, hitPositions) {
  const field = document.querySelector('.gamefield');
  if (!field) return;

  // 1. 카메라 흔들림 효과
  field.classList.add("shake");
  setTimeout(() => field.classList.remove("shake"), 300);

  // 2. 히트 이펙트 생성 (좌표 → 해당 셀에 넣기)
  hitPositions.forEach(([y, x]) => {
    const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
    if (!td) return;

    const effect = document.createElement("div");
    effect.className = "attack-bit-explosion";
    td.appendChild(effect);

    setTimeout(() => {
      effect.remove();
    }, 3000);
  });
}

/**attack animation - "storm-effect.gif" */
function attackStormEffectGif(character, hitPositions) {
  const field = document.querySelector('.gamefield');
  if (!field) return;

  // 1. 카메라 흔들림 효과
  field.classList.add("shake");
  setTimeout(() => field.classList.remove("shake"), 300);

  // 2. 히트 이펙트 생성 (좌표 → 해당 셀에 넣기)
  hitPositions.forEach(([y, x]) => {
    const td = field.querySelector(`td[data-pos="${y}-${x}"]`);
    if (!td) return;

    const effect = document.createElement("div");
    effect.className = "attack-storm";
    td.appendChild(effect);

    setTimeout(() => {
      effect.remove();
    }, 3000);
  });
}
