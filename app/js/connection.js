/*global WebSocket*/

var Connection = (function () {
  "use strict";

  var socket;

  /*socket.onopen();
  socket.onmessage();
  socket.onerror();
  socket.onclose();

  socket.send();
  socket.close();
  */

  function init() {
    console.log("Connection.init()");
    //socket = new WebSocket("ws://localhost:3000");
    socket = new WebSocket("ws://html5rocks.websocket.org/echo");
    //socket = new WebSocket("ws://"+window.document.location.host+"/echo");
    //socket = new WebSocket("ws://echo.websocket.org/");
    socket.onopen = function(e) {
      socket.send('Connection opened !!');
     Game.setInfoText('Connected to: ' + e.currentTarget.URL);
    };

    socket.onmessage = function (e) {
      console.log('Received From Server: ' + e.data);
    };



  }

  return {
    init: init
  }

}());
