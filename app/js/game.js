/*jslint plusplus: true*/

var Game = (function () {
  "use strict";

  var myBoard = document.querySelector("#my-field"),

    // states
    SHIPS_INIT,
    PLAYER1_TURN,
    PLAYER2_TURN,
    GAMEOVER,
    config = {
      mode: null,
      state: null
    };

  function drawField(board) {

    var i, j, field;

    for (i = 0; i < 100; i++) {
      field = document.createElement("div");
      field.classList.add("field");
      field.classList.add("clearfix");
      field.classList.add(i + 1);
      board.appendChild(field);
    }
  }

  function hitField(e) {
    e.stopPropagation();
    var target = e.target || e.srcElement;
    //var target = document.elementFromPoint(e.pageX, e.pageY);
    //target.classList.add("burned");
    target.classList.add("missed");
  }



  function selectShip(e) {
    e.stopPropagation();
    var target = e.target || e.srcElement;
    target.classList.add("ship");
  }

  function endShip(e) {
    myBoard.removeEventListener("mousemove", selectShip);
    myBoard.removeEventListener("mouseup", endShip);
  }

  function setShip(e) {
    selectShip(e);
    myBoard.addEventListener("mousemove", selectShip);
    myBoard.addEventListener("mouseup", endShip);
  }

  function init() {
    drawField(myBoard);
    //myBoard.addEventListener("click", hitField);

    //myBoard.addEventListener("mousemove", Pointer.set);
    //myBoard.addEventListener("mouseover", Pointer.show);
    //myBoard.addEventListener("mouseout", Pointer.hide);

    myBoard.addEventListener("mousedown", setShip);
  }

  return {
    init: init
  };

}());
