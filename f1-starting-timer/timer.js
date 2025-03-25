const lights = Array.prototype.slice.call(document.querySelectorAll('.light-strip'));
const time = document.querySelector('.time');
const best = document.querySelector('.best span');
const message = document.querySelector('.message');
let bestTime = Number(localStorage.getItem('best')) || Infinity;
let started = false;
let lightsOutTime = 0;
let raf; //animation
let timeout;

function formatTime(time) {
  time = Math.round(time);
  let outputTime = (time / 1000).toFixed(3);

  if (time < 10000) {
    outputTime = '0' + outputTime;
  }

  return outputTime;
}

if (bestTime != Infinity) {
  best.textContent = formatTime(bestTime);
}

function start() {
  //all lights off!
  for(const light of lights) {
    light.classList.remove('on');
  }
  //'time' init
  time.textContent = '00.000';
  time.classList.remove('anim');

  lightsOutTime = 0;
  let lightsOn = 0;
  const lightsStart = performance.now();


  /**
 * Red Light Sequence
 */
function rls(now) {
  const toLight = Math.floor((now - lightsStart) / 1000) + 1;

  //켜야 할 조명 > 현재 켜진 조명
  if (toLight > lightsOn) {
    for (const light of lights.slice(0, toLight)) {
      light.classList.add('on');
    }
    lightsOn = toLight;
  }

  //5개의 조명이 모두 켜질때 까지 반복
  if(toLight < 5) {
    raf = requestAnimationFrame(rls);
  } else { //0.2s~3s 무작위 점등 
    const delay = Math.random()* 2800 + 200;
    timeout = setTimeout(() => {
      for (const light of lights) {
        light.classList.remove('on');
      }
      lightsOutTime = performance.now();
    }, delay);
  }
}


  //Red Light Sequence - 실핼
  raf = requestAnimationFrame(rls);
}


function end(timeStamp) {
  cancelAnimationFrame(raf);
  clearTimeout(timeout);

  //'Jump Start!' 발생
  if (!lightsOutTime) {
    time.textContent = "Jump start!";
    time.classList.add('anim');
    message.textContent = ""; // 점프 스타트 시 메시지 초기화
    return;
  }
  else {
    const thisTime = timeStamp - lightsOutTime;
    time.textContent = formatTime(thisTime);


    const slowerDriver = findSlowerDriver(thisTime);

    if (slowerDriver) {
      message.textContent = `${slowerDriver}보다 빠릅니다!`;
    } else {
      message.textContent = "";
    }
    
    //'best' 갱신
    if (thisTime < bestTime) {
      bestTime = thisTime;
      best.textContent = time.textContent;
      localStorage.setItem('best', thisTime);
    }
    
    time.classList.add('anim');
  }
}

function findSlowerDriver(userTime) {
  for (const [driver, time] of reactionTimes) {
    if (userTime <= time * 1000) {
      return driver; // 첫 번째로 큰 반응 속도를 가진 선수 반환
    }
  }
  return null; // 모든 선수 보다 느리면
}



function tap(event) {
  let timeStamp = performance.now();
  
  if (!started && event.target && event.target.closest && event.target.closest('a')) return;
  event.preventDefault(); //클릭, 스크롤 등 기본 이벤트 막기
  
  if (started) {
    end(timeStamp);
    started = false;
  }
  else {
    start();
    started = true;
  }
}


//모바일에서 터치 발생시
addEventListener('touchstart', tap, {passive: false});

//마우스 왼쪽 클릭
addEventListener('mousedown', event => {
  if (event.button === 0) tap(event);
}, {passive: false});

//spacebar
addEventListener('keydown', event => {
  if (event.key == ' ') tap(event);
}, {passive: false});

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js');
}
