/*jslint plusplus: true*/
/*global console, Game*/

var Board = (function () {

  "use strict";

  function createBoard(board, type) {

    var i, boardObj = {};

    boardObj.locked = false;
    boardObj.board = document.querySelector(board);
    boardObj.subBoard = boardObj.board.querySelector(".board");
    boardObj.fields = [];
    boardObj.currSelection = [];
    boardObj.SHIPNUMS = {
      "5": 1,
      "4": 1,
      "3": 2,
      "2": 3
    };

    for (i = 0; i < 100; i++) {
      boardObj.fields[i] = false;
    }

    boardObj.draw = function () {
      var i, j, field, letter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        topDiv = this.board.querySelector(".board-top-bar"),
        leftDiv = this.board.querySelector(".board-left-bar");

      // A B C D E F G H I J
      for (i = 0; i < 10; i++) {
        field = document.createElement("div");
        field.classList.add("field-side");
        field.innerHTML = letter[i];
        leftDiv.appendChild(field);
      }

      // 1 2 3 4 5 6 7 8 9 10
      for (i = 0; i < 10; i++) {
        field = document.createElement("div");
        field.classList.add("field-side");
        field.innerHTML = (i + 1);
        topDiv.appendChild(field);
      }

      // core fields
      for (i = 0; i < 100; i++) {
        field = document.createElement("div");
        field.classList.add("field");
        field.classList.add("clearfix");
        field.id = "f" + i;
        this.board.querySelector(".board").appendChild(field);
      }
    };

    boardObj.resetShipNums = function () {
      boardObj.SHIPNUMS = {"5": 1, "4": 1, "3": 2, "2": 3};
      Game.updateShipsLeftNum();
    };

    boardObj.clear = function () {
      var i;
      for (i = 0; i < 100; i++) {
        boardObj.fields[i] = false;
        boardObj.board.querySelector("#f" + i).classList.remove("ship");
      }
      boardObj.resetShipNums();
    };

    boardObj.getId = function (target) {
      return target.id.substr(1, 2);
    };

    boardObj.isSelected = function (e) {
      var target = e.target || e.srcElement,
        fId = this.getId(target);
      console.log(this.fields[fId]);
      return this.fields[fId];
    };


    boardObj.deselectShip = function () {
      boardObj.currSelection.map(function (elem) {
        boardObj.board.querySelector("#f" + elem).classList.remove("ship");
      });
    };

    boardObj.updateFields = function () {
      boardObj.currSelection.map(function (elem) {
        boardObj.fields[elem] = true;
      });
    };

    boardObj.selectShip = function (e) {
      console.log("selectShip");
      e.stopPropagation();
      var target = e.target || e.srcElement,
        fId = target.id.substr(1, 2);
      if (!boardObj.currSelection.includes(fId)) {
        boardObj.currSelection.push(fId);
        target.classList.add("ship");
      }
    };

    boardObj.updateShipsNum =  function () {
      var len = boardObj.currSelection.length;
      boardObj.SHIPNUMS[len]--;
      Game.updateShipsLeftNum();
    };


    boardObj.endShip = function (e) {
      console.log("endShip");
      boardObj.board.removeEventListener("mousemove", boardObj.selectShip);
      boardObj.board.removeEventListener("mouseup", boardObj.endShip);

      if (boardObj.currSelection.length === 1 || boardObj.currSelection.length > 5 || boardObj.SHIPNUMS[boardObj.currSelection.length] === 0) {
        boardObj.deselectShip();
      } else {
        boardObj.updateShipsNum();
        boardObj.updateFields();
      }
      boardObj.currSelection = [];
    };

    boardObj.setShip = function (e) {
      if (boardObj.locked || boardObj.isSelected(e)) {
        return;
      }
      console.log("setShip");
      boardObj.selectShip(e);
      boardObj.board.addEventListener("mousemove", boardObj.selectShip);
      boardObj.board.addEventListener("mouseup", boardObj.endShip);
    };

    boardObj.checkHit = function (fId) {
      var target = boardObj.board.querySelector("#f" + fId),
        hit = boardObj.fields[fId];

      if (hit) {
        boardObj.fields[fId] = false;
        target.classList.add("burned");
      } else {
        target.classList.add("missed");
      }

      return hit;
    };

    boardObj.checkWin = function () {
      return boardObj.fields.includes(true)
        ? false
        : true;
    };

    boardObj.lock = function () {
      boardObj.board.style.opacity = 0.4;
    };

    return boardObj;
  }

  return {

    create: createBoard

  };


}());
