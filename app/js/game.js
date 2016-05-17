/*jslint plusplus: true*/

var Game = (function () {
  "use strict";

  var myBoard = document.querySelector("#my-field");

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
    console.log(target.classList);
    target.classList.add("burned");

  }

  function init() {
    drawField(myBoard);
    myBoard.addEventListener("click", hitField);

  }

  return {
    init: init
  };

}());
