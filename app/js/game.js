/*jslint plusplus: true*/

var Game = (function () {
  "use strict";

  var p1Board = document.querySelector("#p1"),
    p2Board = document.querySelector("#p2"),
    p2BoardShips = p2Board.querySelector(".board"),
    clearButton = document.querySelector("#clear-button"),
    playButton = document.querySelector("#play-button"),
    infoText = document.querySelector(".info-bar-text"),

    shipNumText = {
      "5": document.querySelector("#ship-5-nums"),
      "4": document.querySelector("#ship-4-nums"),
      "3": document.querySelector("#ship-3-nums"),
      "2": document.querySelector("#ship-2-nums")
    },

    state,
    // states
    INIT_CONNECTION = 0,
    SHIPS_INIT = 1,
    READY = 2,
    PLAYER1_TURN = 3,
    PLAYER2_TURN = 4,
    GAMEOVER = 5,

    infoTextArr = [
      "Place your ships on the board",
      "Waiting for your oponent...",
      "It's your turn!",
      "Player 2 turn...",
      "Game Over!"
    ],

    UID = null,

    config = {
      mode: null,
      state: null
    },

    SHIPNUMS = {
      "5": 1,
      "4": 1,
      "3": 2,
      "2": 3
    },

    player1Board = [],
    player2Board = [],

    currSelection = [];

  function setInfoText(text) {
    text = text || infoTextArr[state];
    infoText.innerHTML = text;
  }

  function clearBoard() {

    var i;

    for (i = 0; i < 100; i++) {
      player1Board[i] = false;
      document.querySelector("#f" + i).classList.remove("ship");
    }

    resetShipNums();

  }

  function playGame() {
    state = READY;
    //state = PLAYER1_TURN;
    Connection.send(JSON.stringify({state: state}));
    setInfoText();
    p1Board.style.opacity = 0.4;
  }

  function drawField(board) {

    var i, j, field, letter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      topDiv = board.querySelector(".board-top-bar"),
      leftDiv = board.querySelector(".board-left-bar");

    for (i = 0; i < 10; i++) {
      field = document.createElement("div");
      field.classList.add("field-side");
      //field.classList.add("clearfix");
      field.innerHTML = (i + 1);
      leftDiv.appendChild(field);
    }

    for (i = 0; i < 10; i++) {
      field = document.createElement("div");
      field.classList.add("field-side");
      //field.classList.add("clearfix");
      field.innerHTML = letter[i];
      topDiv.appendChild(field);
    }

    for (i = 0; i < 100; i++) {
      field = document.createElement("div");
      field.classList.add("field");
      field.classList.add("clearfix");
      field.id = "f" + i;
      board.querySelector(".board").appendChild(field);
    }
  }

  function checkWin() {
    return player1Board.includes(true)
      ? false
      : true;
  }

  function hitField(e) {
    if (state !== PLAYER1_TURN) {
      return;
    }

    e.stopPropagation();
    var target = e.target || e.srcElement,
      fId = target.id.substr(1, 2);

    Connection.send(fId);

    if (player1Board[fId] === true) {
      target.classList.add("burned");
    } else {
      target.classList.add("missed");
    }

    //var target = document.elementFromPoint(e.pageX, e.pageY);
    //target.classList.add("burned");
    //target.classList.add("missed");

    if (checkWin()) {
      state = GAMEOVER;
      setInfoText();
    } else {
      state = PLAYER2_TURN;
      setInfoText();
    }
  }



  function deselectShip() {
    currSelection.map(function (elem) {
      document.querySelector("#f" + elem).classList.remove("ship");

    });
  }

  function updatePlayerBoard() {
    currSelection.map(function (elem) {
      player1Board[elem] = true;
    });
  }

  function selectShip(e) {
    console.log("selectShip");
    e.stopPropagation();
    var target = e.target || e.srcElement,
      fId = target.id.substr(1, 2);

    if (!currSelection.includes(fId)) {
      currSelection.push(fId);
      target.classList.add("ship");
    }
  }

  function endShip(e) {
    console.log("endShip");
    p1Board.removeEventListener("mousemove", selectShip);
    p1Board.removeEventListener("mouseup", endShip);

    if (currSelection.length === 1 || currSelection.length > 5 || SHIPNUMS[currSelection.length] === 0) {
      deselectShip();
    } else {
      updateShipsNum();
      updatePlayerBoard();
    }

    currSelection = [];
  }

  function getId(target) {
    return target.id.substr(1, 2);
  }

  function isSelected(e) {
    var target = e.target || e.srcElement,
      fId = getId(target);
    return player1Board[fId];
  }

  function setShip(e) {
    if (state !== SHIPS_INIT || isSelected(e)) {
      return;
    }
    console.log("setShip");
    selectShip(e);
    p1Board.addEventListener("mousemove", selectShip);
    p1Board.addEventListener("mouseup", endShip);
  }

  function resetShipNums() {
    SHIPNUMS = {"5": 1, "4": 1, "3": 2, "2": 3};
    shipNumText[5].innerHTML = SHIPNUMS[5];
    shipNumText[4].innerHTML = SHIPNUMS[4];
    shipNumText[3].innerHTML = SHIPNUMS[3];
    shipNumText[2].innerHTML = SHIPNUMS[2];
  }

  function initScoreBoard() {
    resetShipNums();
  }

  function updateShipsNum() {
    var len = currSelection.length;
    SHIPNUMS[len]--;
    shipNumText[len].innerHTML = SHIPNUMS[len];
  }

  function initPlayerBoard() {
    clearBoard();
  }




  function init() {

    Connection.init();

    drawField(p1Board);
    drawField(p2Board);
    initScoreBoard();
    initPlayerBoard();

    state = SHIPS_INIT;
    setInfoText();

    p2BoardShips.addEventListener("click", hitField);

    p2BoardShips.addEventListener("mousemove", Pointer.set);
    p2BoardShips.addEventListener("mouseover", Pointer.show);
    p2BoardShips.addEventListener("mouseout", Pointer.hide);

    p1Board.addEventListener("mousedown", setShip);

    clearButton.addEventListener("click", clearBoard);
    playButton.addEventListener("click", playGame);
  }

  return {
    init: init,
    setInfoText: setInfoText
  };

}());
