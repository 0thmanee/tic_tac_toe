"use strict";

// Get DOM elements
const plan = document.querySelector(".game-plan");
const overlay = document.querySelector(".overlay");
const categ = document.querySelector("#type");
const startBtn = document.querySelector(".start-btn");
const namesInputs = document.querySelectorAll("#player-input");
const gameInfo = document.querySelector(".game-info");
const playersEl = document.querySelectorAll(".player");
const playersNames = document.querySelectorAll(".name");
const container = document.querySelector(".container");
const boxesEl = document.querySelectorAll(".box");
const end = document.querySelector(".end-game");
const message = document.querySelector(".end-message");
const continueBtn = document.querySelector(".continue-btn");
const restartBtn = document.querySelector(".restart-btn");

// build Player class
class Player {
  constructor(name, nickname, xOro, score, moves) {
    this.xOro = xOro;
    this.score = score;
    this.name = name;
    this.nickname = nickname;
    this.moves = moves;
  }
}

let players = [
  new Player("", "", "cross", 0, []),
  new Player("", "", "nought", 0, []),
];
let activePlayer = 0;
let boxes = [];
let win;
let draw;

// Wait Function
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};
// Check existance of element in array
const exist = function (arr, item) {
  let j = 0;
  arr.forEach((el) => {
    if (el == item) j++;
  });
  if (j > 0) return true;
  else return false;
};
/* const input1 = document.querySelector(".input-info-1");
const inputs = document.querySelectorAll(".input-info-2");
plan.addEventListener("mouseover", function () {
  if (categ.value == "one") {
    input1.classList.remove("hidden");
    inputs.forEach((inp) => inp.classList.add("hidden"));
  }
  if (categ.value == "two") {
    input1.classList.add("hidden");
    inputs.forEach((inp) => inp.classList.remove("hidden"));
  }
}); */

// Two Players: Initialisation
const setTwo = function () {
  boxes = [];
  for (let i = 1; i <= 9; i++) {
    boxes.push(i);
    players[0].moves.push(0);
    players[1].moves.push(0);
  }
  let pass = true;
  namesInputs.forEach((p) => {
    if (p.value == "") pass = false;
  });
  if (!pass) return;
  namesInputs.forEach((n, i) => {
    players[i].name = n.value;
    players[i].nickname =
      n.value[0].toUpperCase() + n.value[n.value.length - 1].toUpperCase();
    playersNames[i].textContent = players[i].nickname;
  });
  namesInputs.forEach((el) => (el.value = ""));
  plan.classList.add("hidden");
  overlay.classList.add("hidden");
  gameInfo.classList.remove("hidden");
  win = false;
  draw = false;
};

// Two Players: Play
const playTwo = function (clickedBox) {
  const box = Number(clickedBox.dataset.number);
  if (exist(boxes, box) && !win && !draw) {
    clickedBox.classList.contains(players[activePlayer].xOro) ||
      clickedBox.classList.add(players[activePlayer].xOro);

    players[activePlayer].moves[boxes.indexOf(box)] = box;
    boxes[boxes.indexOf(box)] = 0;

    if (!checkWin(players[activePlayer].moves)) {
      playersEl.forEach((p) => p.classList.remove("player-Active"));
      activePlayer = activePlayer == 0 ? 1 : 0;
      document
        .querySelector(`.player-${activePlayer}`)
        .classList.add("player-Active");
    }
  }
};
const checkWin = function (arr) {
  if (
    (exist(arr, 1) && exist(arr, 2) && exist(arr, 3)) ||
    (exist(arr, 4) && exist(arr, 5) && exist(arr, 6)) ||
    (exist(arr, 7) && exist(arr, 8) && exist(arr, 9)) ||
    (exist(arr, 1) && exist(arr, 4) && exist(arr, 7)) ||
    (exist(arr, 2) && exist(arr, 5) && exist(arr, 8)) ||
    (exist(arr, 4) && exist(arr, 6) && exist(arr, 9)) ||
    (exist(arr, 1) && exist(arr, 5) && exist(arr, 9)) ||
    (exist(arr, 3) && exist(arr, 5) && exist(arr, 7))
  )
    return true;
  return false;
};

// winner Function
const winner = function () {
  if (checkWin(players[activePlayer].moves)) {
    players[activePlayer].score += 1;
    document.querySelector(`.score-${activePlayer}`).textContent =
      players[activePlayer].score;
    message.textContent = `${players[activePlayer].name} wins`;
    end.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }
};

// Draw function
const drawF = function () {
  if (checkWin(players[activePlayer].moves)) return;
  let sum = 0;
  boxes.forEach((box) => {
    sum += box;
  });
  if (sum == 0) {
    draw = true;
    message.textContent = `No One wins, Thre Is A Draw!`;
    end.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }
};

// Listen To Start Button
startBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (categ.value == "two") {
    setTwo();
  }
});

// Listen To Boxes Click
container.addEventListener("click", function (e) {
  const clickedBox = e.target.closest(".box");
  if (!clickedBox) return;
  playTwo(clickedBox);
  winner();
  drawF();
});

// Listen to continue button
continueBtn.addEventListener("click", function () {
  end.classList.add("hidden");
  overlay.classList.add("hidden");
  boxesEl.forEach((box, i) => {
    box.classList.remove(players[0].xOro);
    box.classList.remove(players[1].xOro);
    boxes[i] = i + 1;
    players[0].moves[i] = players[1].moves[i] = 0;
  });
  win = false;
  draw = false;
});
// Listen to restart button
restartBtn.addEventListener("click", function () {
  boxesEl.forEach((box, i) => {
    box.classList.remove(players[0].xOro);
    box.classList.remove(players[1].xOro);
  });
  end.classList.add("hidden");
  plan.classList.remove("hidden");
  players.forEach((p) => {
    p.score = 0;
    p.moves = [];
  });
  document
    .querySelectorAll(`.score`)
    .forEach((el, i) => (el.textContent = players[activePlayer].score));
  gameInfo.classList.add("hidden");
  win = false;
  draw = false;
});
