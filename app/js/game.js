/*jslint plusplus: true*/
/*exported Game*/

var Game = (function () {
  "use strict";

  var p1Board = document.querySelector("#p1"),
    p2Board = document.querySelector("#p2"),
    p2BoardShips = p2Board.querySelector(".board"),
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
    // states
    INIT_CONNECTION = 0,
    SHIPS_INIT = 1,
    READY = 2,
    PLAYING = 3,
    WAITING = 4,
      END  = 5,
    GAMEOVER = false,

    infoTextArr = [
      "Connecting...",
      "Place your ships on the board",
      "Waiting for your oponent...",
      "It's your turn!",
      "Player 2 turn...",
      "Game Over!"
    ],

    winText = "Congratulations!!!\nYou win !!!",
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
    },

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
    text = text || infoTextArr[player1.state];
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
    console.log("playgame");
    player1.state = READY;
    player1.firstTurn = (player2.state !== READY) ? true : false;
    Connection.send({state: READY});
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
    console.log("checkWIn");
    return player1Board.includes(true)
      ? false
      : true;
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


  function startPlay() {
    console.log("startPlay " + player1.state);

    if( player1.firstTurn ) {
      player1.state = PLAYING;
    } else {
      player1.state = WAITING;
    }
  }

  function onChangeState() {

    console.log("onChangeState ", player1.state, player2.state );

    if (player1.state === READY && player2.state === READY) {
      startPlay();
    }

    setInfoText();

  }


  function checkHit(fId) {
    console.log("checkHit");
    var target = p1Board.querySelector("#f"+fId);
    console.log(target)

    if (player1Board[fId] === true) {
      player1Board[fId] = false;
      target.classList.add("burned");
      Connection.send({state: WAITING, hit:true});
    } else {
      target.classList.add("missed");
      Connection.send({state: WAITING, hit:false});
    }

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
        player1.uid = msg.UID
        player1.state = SHIPS_INIT;
        setInfoText();
      } else {

        console.log("myID " + player1.uid)
        if (msg.user !== player1.uid) {
          console.log("player 2 ID " + msg.user);

          if( msg.state === READY) {
            player2.state = msg.state;
            player2.firstTurn = (player1.state !== READY) ? true : false;

          }

          if( msg.state === PLAYING ) {
            checkHit(msg.fId);
          }

          if( msg.state === WAITING ) {


            console.log("checkedHit");
            var target = p2Board.querySelector("#f"+fId);


            if( msg.hit) {
              target.classList.add("burned");
            } else {
              target.classList.add("missed");
            }

            player1.state = WAITING;

          }

          if( msg.state === END) {
            gameOver.style.display = "initial";
            gameOver.querySelector("p").innerHTML = winText;
          }

        }


      }

    onChangeState();

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
    setInfoText: setInfoText,
    onmessage: onmessage
  };

}());
