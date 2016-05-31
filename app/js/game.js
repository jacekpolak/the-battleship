/*jslint plusplus: true*/
/*exported Game*/
/*global Connection, Board, Pointer, console*/

var Game = (function () {
  "use strict";

  var p1Board = Board.create("#p1", 0), //my //document.querySelector("#p1"),
    p2Board = Board.create("#p2", 1),//document.querySelector("#p2"),
    //p2BoardShips = p2Board.querySelector(".board"),
    clearButton = document.querySelector("#clear-button"),
    playButton = document.querySelector("#play-button"),
    infoText = document.querySelector(".info-bar-text"),
    gameOver = document.querySelector(".game-over"),

    shipNumText = {
      "5": document.querySelector("#ship-5-nums"),
      "4": document.querySelector("#ship-4-nums"),
      "3": document.querySelector("#ship-3-nums"),
      "2": document.querySelector("#ship-2-nums")
    },

    state,

    // player states
    INIT_CONNECTION = 0,
    SHIPS_INIT = 1,
    READY = 2,
    PLAYING = 3,
    WAITING = 4,
    END  = 5,

    // game state
    GAMEOVER = false,

    infoTextArr = [
      "Connecting...",
      "Place your ships on the board, than press PLAY button",
      "Waiting for your oponent...",
      "It's your turn!",
      "Player 2 turn...",
      "Game Over!"
    ],

    winText = "Congratulations!!!\nYou win!!!\nClick here to close",
    failText = "You lost!!!\nTry again!",

    fId,

    player1 = {
      uid: null,
      state: INIT_CONNECTION,
      firstTurn: false
    },

    player2 = {
      uid: null,
      state: INIT_CONNECTION,
      firstTurn: false
    };

  function setInfoText(text) {
    text = text || infoTextArr[player1.state];
    infoText.innerHTML = text;
  }

  function playGame() {
    console.log("playgame");
    player1.state = READY;
    player1.firstTurn = (player2.state !== READY) ? true : false;
    Connection.send({state: READY});
    setInfoText();
    p1Board.lock();//style.opacity = 0.4;
  }

  function checkWin() {
    console.log("checkWIn");
    return p1Board.checkWin();
  }

  function hitField(e) {


    if (player1.state !== PLAYING) {
      return;
    }

    console.log("Hit");
    e.stopPropagation();
    var target = e.target || e.srcElement;
    fId = target.id.substr(1, 2);

    Connection.send({state: PLAYING, fId: fId});
  }

  function updateShipsLeftNum() {
    shipNumText[5].innerHTML = p1Board.SHIPNUMS[5];
    shipNumText[4].innerHTML = p1Board.SHIPNUMS[4];
    shipNumText[3].innerHTML = p1Board.SHIPNUMS[3];
    shipNumText[2].innerHTML = p1Board.SHIPNUMS[2];
  }

  function startPlay() {
    console.log("startPlay " + player1.state);

    if (player1.firstTurn) {
      player1.state = PLAYING;
    } else {
      player1.state = WAITING;
    }
  }

  function onChangeState() {

    console.log("onChangeState ", player1.state, player2.state);

    if (player1.state === READY && player2.state === READY) {
      startPlay();
    }

    setInfoText();

  }

  function checkHit(fId) {
    console.log("checkHit");

    var hit = p1Board.checkHit(fId);
    Connection.send({state: WAITING, hit: hit});

    if (checkWin()) {
      console.log("GAME OVER");
      GAMEOVER = true;
      //setInfoText();
      Connection.send({state: END });
      gameOver.style.display = "initial";
      gameOver.querySelector("p").innerHTML = failText;
    } else {
      console.log("change turn");
      player1.state = PLAYING;
      setInfoText();
    }
  }

  function onmessage(msg) {

    if (msg.UID) {
      player1.uid = msg.UID;
      player1.state = SHIPS_INIT;
      setInfoText();
    } else {

      console.log("myID " + player1.uid);
      if (msg.user !== player1.uid) {
        console.log("player 2 ID " + msg.user);

        if (msg.state === READY) {
          player2.state = msg.state;
          player2.firstTurn = (player1.state !== READY) ? true : false;
        }

        if (msg.state === PLAYING) {
          checkHit(msg.fId);
        }

        if (msg.state === WAITING) {

          console.log("checkedHit");
          var target = p2Board.board.querySelector("#f" + fId);

          if (msg.hit) {
            target.classList.add("burned");
          } else {
            target.classList.add("missed");
          }

          player1.state = WAITING;
        }

        if (msg.state === END) {
          gameOver.style.display = "initial";
          gameOver.querySelector("p").innerHTML = winText;
        }

      }
    }

    onChangeState();
  }

  function clearBoard() {
    p1Board.clear();
  }

  function init() {

    Connection.init();

    p1Board.draw();
    p2Board.draw();

    updateShipsLeftNum();
    setInfoText();

    p1Board.board.addEventListener("mousedown", p1Board.setShip.bind(p1Board));
    p2Board.subBoard.addEventListener("click", hitField);
    p2Board.subBoard.addEventListener("mousemove", Pointer.set);
    p2Board.subBoard.addEventListener("mouseover", Pointer.show);
    p2Board.subBoard.addEventListener("mouseout", Pointer.hide);

    //clearButton.addEventListener("click", clearBoard);
    clearButton.addEventListener("click", clearBoard);
    playButton.addEventListener("click", playGame);
  }

  return {
    init: init,
    setInfoText: setInfoText,
    onmessage: onmessage,
    updateShipsLeftNum: updateShipsLeftNum
  };

}());
