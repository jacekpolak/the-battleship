/*jslint plusplus: true*/
/*global console, Game*/

var Board = (function () {

  "use strict";

  function createBoard(board, type) {

    var i, boardObj,
      boardDOM = document.querySelector(board),
      startSelect, endSelect;

    boardObj = {
      locked : false,
      board : boardDOM,
      subBoard : boardDOM.querySelector(".board"),
      fields : [],
      currSelection : [],
      selectDir : null, // 0 - horizontal, 1 - vertical
      SHIPNUMS : {
        "5": 1,
        "4": 1,
        "3": 2,
        "2": 3
      }
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
        //field.innerHTML = i;
        this.board.querySelector(".board").appendChild(field);
      }
    };

    boardObj.resetShipNums = function () {
      this.SHIPNUMS = {"5": 1, "4": 1, "3": 2, "2": 3};
      Game.updateShipsLeftNum();
    };

    boardObj.clear = function () {
      var i, cl;
      for (i = 0; i < 100; i++) {
        this.fields[i] = false;
        cl = this.board.querySelector("#f" + i).classList.item(2);
        this.board.querySelector("#f" + i).classList.remove(cl);
      }
      this.resetShipNums();
    };

    boardObj.getId = function (e) {
      var target = e.target || e.srcElement,
        id = target.id.substr(1, 2);

      return {
        id: parseInt(id, 10),
        target: target
      };
    };

    boardObj.isSelected = function (e) {
      var fId = this.getId(e).id;
      return this.fields[fId];
    };


    boardObj.deselectShip = function () {
      boardObj.currSelection.map(function (elem) {
        boardObj.board.querySelector("#f" + elem).classList.remove("ship");
      });
    };

    boardObj.updateFields = function () {
      var self = this;
      this.currSelection.map(function (elem) {
        self.fields[elem] = true;
      });
    };

    boardObj.isInLine = function (id) {
      id = parseInt(id, 10);

      if (this.currSelection.length === 0) {
        return true;
      } else if (this.currSelection.length === 1) {
        var diff = Math.abs(id - this.currSelection[0]);
        if (diff === 1 || diff === 10) {
          this.selectDir = diff;
          return true;
        }
      } else {
        var first = this.currSelection[0],
          last = this.currSelection[this.currSelection.length - 1];

        if (id - last === this.selectDir || first - id === this.selectDir) {
          return true;
        } else {
          return false;
        }
        /*isHorizontal = ((id - 1) === last || (id + 1) === first)
          ? true : false,
        isVertical = ((id - 10) === last || (id + 10) === first)
          ? true : false;
        return (isHorizontal || isVertical);
        */

      }
    };

    boardObj.selectShip = function (e) {

      var fId = this.getId(e).id,
        target = this.getId(e).target;

      if (this.locked || this.isSelected(e) || !this.isInLine(fId)) {
        return;
      }

      e.stopPropagation();

      console.log("+ " + fId);

      if (this.currSelection.length === 0 || !this.currSelection.includes(fId)) {

        this.currSelection.push(fId);
        this.currSelection.sort();
        target.classList.add("ship");
      }
    };

    boardObj.updateShipsNum =  function () {
      var len = boardObj.currSelection.length;
      this.SHIPNUMS[len]--;
      Game.updateShipsLeftNum();
    };

    boardObj.updateShipColor = function () {
      var board = this.subBoard;
      this.currSelection.forEach(function(id,idx,arr){
        board.querySelector("#f" + id).classList.remove("ship");
        board.querySelector("#f" + id).classList.add("ship-"+arr.length);
      });
    };

    boardObj.endShip = function (e) {

      this.board.removeEventListener("mousemove", startSelect);
      this.board.removeEventListener("mouseup", endSelect);

      if (this.currSelection.length === 1 || this.currSelection.length > 5 || this.SHIPNUMS[this.currSelection.length] === 0) {
        this.deselectShip();
      } else {
        this.updateShipsNum();
        this.updateFields();
        this.updateShipColor();
      }
      this.currSelection = [];
    };

    startSelect = boardObj.selectShip.bind(boardObj);
    endSelect = boardObj.endShip.bind(boardObj);

    boardObj.setShip = function (e) {
      if (this.locked || this.isSelected(e)) {
        return;
      }
      console.log("setShip");
      this.selectShip(e);
      this.board.addEventListener("mousemove", startSelect);
      this.board.addEventListener("mouseup", endSelect);
    };

    boardObj.checkHit = function (fId) {
      var target = this.board.querySelector("#f" + fId),
        hit = this.fields[fId];

      if (hit) {
        this.fields[fId] = false;
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
      boardObj.locked = true;
      boardObj.board.style.opacity = 0.4;
    };

    return boardObj;
  }

  return {

    create: createBoard

  };


}());
