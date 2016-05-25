/*global WebSocket, Game*/
/*exported Connection*/

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
    socket = new WebSocket("ws://localhost:8080");
    socket.onopen = function (e) {
      socket.send('Connection opened !!');
    };

    socket.onmessage = function (e) {
      console.log('Received From Server: ' + e.data);
      var resposne = JSON.parse(e.data);
      Game.onmessage(resposne);

    };
  }

  function send(msg) {
    console.log("Sending " + msg);
    socket.send(JSON.stringify(msg));
  }

  return {
    init: init,
    send: send
  };

}());
