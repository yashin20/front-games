/* */
const limitTime = 45000; //45seconds



/**ID 기반 section 보이기 */
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
}


function startIntro() {
  showSection("intro");
}

function startGame() {
  score = 0;
  document.getElementById("score").textContent = score;
  showSection("game");
}

function endGame() {
  //1. result 섹션 ON
  showSection("result");
}