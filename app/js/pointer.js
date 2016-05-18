var Pointer = (function () {
  "use strict";

  var pointer = document.querySelector("#pointer"),
    board = pointer.parentElement;

  function setPointer(e) {
    pointer.style.top = (e.pageY) - board.offsetTop - 30 + "px";
    pointer.style.left = (e.pageX) - board.offsetLeft - 30 + "px";
  }

  function showPointer(e) {
    pointer.style.display = "initial";
    board.style.cursor = "none";
  }

  function hidePointer(e) {
    pointer.style.display = "none";
  }

  return {
    set: setPointer,
    show: showPointer,
    hide: hidePointer
  };

}());
