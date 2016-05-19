/*jslint plusplus: true*/

var Game = (function () {
  "use strict";

  var myBoard = document.querySelector("#my-field"),
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
    SHIPS_INIT = 0,
    READY = 1,
    PLAYER1_TURN = 2,
    PLAYER2_TURN = 3,
    GAMEOVER = 4,

    infoTextArr = [
      "Place your ships on the board",
      "Waiting for your oponent...",
      "It's your turn!",
      "Player 2 turn...",
      "Game Over!"
    ],

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

  function setInfoText() {
    infoText.innerHTML = infoTextArr[state];
  }

  function clearBoard() {

    var i;

    for (i = 0; i < 100; i++) {
      player1Board[i] = false;
      document.querySelector("#f" + i).classList.remove("ship");
    }
  }

  function playGame() {
    //state = READY;
    state = PLAYER1_TURN;
    setInfoText();
  }

  function drawField(board) {

    var i, j, field;

    for (i = 0; i < 100; i++) {
      field = document.createElement("div");
      field.classList.add("field");
      field.classList.add("clearfix");
      field.id = "f" + i;
      board.appendChild(field);
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
    myBoard.removeEventListener("mousemove", selectShip);
    myBoard.removeEventListener("mouseup", endShip);

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
    myBoard.addEventListener("mousemove", selectShip);
    myBoard.addEventListener("mouseup", endShip);
  }

  function initScoreBoard() {
    shipNumText[5].innerHTML = SHIPNUMS[5];
    shipNumText[4].innerHTML = SHIPNUMS[4];
    shipNumText[3].innerHTML = SHIPNUMS[3];
    shipNumText[2].innerHTML = SHIPNUMS[2];
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
    drawField(myBoard);
    initScoreBoard();
    initPlayerBoard();

    state = SHIPS_INIT;
    setInfoText();

    myBoard.addEventListener("click", hitField);

    //myBoard.addEventListener("mousemove", Pointer.set);
    //myBoard.addEventListener("mouseover", Pointer.show);
    //myBoard.addEventListener("mouseout", Pointer.hide);

    myBoard.addEventListener("mousedown", setShip);

    clearButton.addEventListener("click", clearBoard);
    playButton.addEventListener("click", playGame);
  }

  return {
    init: init
  };

}());
