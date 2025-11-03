const words = [
  "Apple","Banana","Cat","Dog","Elephant",
  "Fish","Guitar","House","Ice","Jungle",
  "Kite","Lion","Moon","Notebook","Orange",
  "Pizza","Queen","Rainbow","Sun","Tree",
  "Umbrella","Violin","Water","Xylophone","Zoo"
];

const startBtn = document.getElementById("start-btn");
const callBtn = document.getElementById("call-word");
const gameArea = document.getElementById("game-area");
const calledWord = document.getElementById("called-word");
const playerName = document.getElementById("player-name");
const gridDiv = document.getElementById("grid");

const dingBtn = document.getElementById("sound-ding");
const cheerBtn = document.getElementById("sound-cheer");
const dingSound = document.getElementById("ding-sound");
const cheerSound = document.getElementById("cheer-sound");

let called = [];
let leaderboard = [0,0,0,0];
let playerNum = 1;

startBtn.addEventListener("click", startGame);
callBtn.addEventListener("click", callWord);
dingBtn.addEventListener("click", () => dingSound.play());
cheerBtn.addEventListener("click", () => cheerSound.play());

function startGame() {
  playerNum = Number(document.getElementById("player-select").value);
  gameArea.style.display = "block";
  document.getElementById("setup").style.display = "none";
  playerName.textContent = `Player ${playerNum}`;
  called = [];
  createBoard();
}

function createBoard() {
  gridDiv.innerHTML = "";
  const randomWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 25);
  randomWords.forEach(w => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = w;
    cell.addEventListener("click", () => {
      if (cell.textContent === calledWord.textContent && !cell.classList.contains("marked")) {
        cell.classList.add("marked");
        dingSound.play();
        checkBingo();
      }
    });
    gridDiv.appendChild(cell);
  });
}

function callWord() {
  const available = words.filter(w => !called.includes(w));
  if (available.length === 0) {
    calledWord.textContent = "All words used!";
    return;
  }

  const next = available[Math.floor(Math.random() * available.length)];
  called.push(next);
  calledWord.textContent = next;
}

function checkBingo() {
  const cells = Array.from(gridDiv.children);
  const size = 5;
  const rows = [], cols = [], diag1 = [], diag2 = [];

  for (let r = 0; r < size; r++) rows[r] = cells.slice(r*size, r*size+size);
  for (let c = 0; c < size; c++) cols[c] = cells.filter((_, i) => i % size === c);
  for (let i=0;i<size;i++) { diag1.push(cells[i*size+i]); diag2.push(cells[i*size + (size-1-i)]); }

  const lines = [...rows, ...cols, diag1, diag2];
  for (const line of lines) {
    if (line.every(cell => cell.classList.contains("marked"))) {
      alert(`🎉 Bingo! Player ${playerNum} wins!`);
      leaderboard[playerNum-1]++;
      updateLeaderboard();
      cheerSound.play();
      callBtn.disabled = true;
      return;
    }
  }
}

function updateLeaderboard() {
  const scores = document.getElementById("scores");
  scores.innerHTML = "";
  for(let i=0;i<4;i++){
    scores.innerHTML += `<li>Player ${i+1}: ${leaderboard[i]}</li>`;
  }
}
