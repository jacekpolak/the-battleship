
/*jslint node:true */
/*jslint plusplus: true*/

"use strict";

var WSServer = require('ws').Server,
  server = new WSServer({port: 8080}),
  userID  = 1,
  USERS;


server.on("connection", function (ws) {

  ws.id = userID;
  ws.send(JSON.stringify({UID: ws.id}));
  userID++;

  console.log("New client ID ", ws.id);

  USERS[ws.id] = {
    id:   ws.id,
    ready: false,
    playing: false
  };

  ws.on("message", function (message) {
    var msg;

    console.log(message);

    try {
      msg = JSON.parse(message);
    } catch (SyntaxError) {
      console.log('Invalid JSON:');
      console.log(message);
      return false;
    }

    msg.user = ws.id;
    server.clients.forEach(function (conn) {
      conn.send(JSON.stringify(msg));
    });

  });
});

server.on("close", function (ws) {
  console.log('closing connection!');

  // remove user from list and broadcast
  ws.broadcast(JSON.stringify({task: 'removeUser', user : USERS[ws.id] }));
  delete USERS[ws.id];

});
