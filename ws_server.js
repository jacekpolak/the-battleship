
/*jslint node:true */

//var ws = require('ws'),
var WSServer = require('ws').Server,
  //server = ws.createServer(),
  server = new WSServer({port: 8080}),
  userID  = 1,
  USERS = {},
  firstPlayer;

//server.addListener("connection", function(conn){
server.on("connection", function (ws) {
  // send list with current users and add new user to the list afterwards
  //console.log(JSON.stringify({task: 'listUsers', users : USERS}));


  ws.id = userID;
  ws.send(JSON.stringify({UID: ws.id}));
  userID++;

  console.log("Client ID ", ws.id);

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

    //if (msg.state === 2) { //ready
      msg.user = ws.id;
      server.clients.forEach(function (conn) {
        conn.send(JSON.stringify(msg));
      });
    //}


    /*var setBusy = function(id) {
      USERS[id].busy = true;
      var msg = {task:'isPlaying',user:USERS[id]};
      conn.broadcast(JSON.stringify(msg));
      conn.write(JSON.stringify(msg));
    };
    var setFree = function(id) {
      USERS[id].busy = true;
      var msg = {task:'isFree',user:USERS[id]};
      conn.broadcast(JSON.stringify(msg));
      conn.write(JSON.stringify(msg));
    };

    if (msg.task == 'setNick') {
      // set real nick and broadcast
      USERS[conn.id].nick = msg.nick;
      conn.broadcast(JSON.stringify({task:'addUser', user : USERS[conn.id] }));
    }
    else if (msg.task == 'setPlaying') {
      setBusy(conn.id);
      setBusy(msg.client);
    }
    else if (msg.task == 'setFree') {
      setFree(conn.id);
    }
    else if (msg.task == 'private') {
      // pass message to specified client only, add sender-ID to message
      msg.from = USERS[conn.id];
      conn.writeclient(JSON.stringify(msg),msg.client);
    }
    else {
      // braodcast whatever comes in for now
      msg.user = ws."ready"
      ws.broadcast(JSON.stringify(msg));
    }*/
  });
});

server.on("close", function (ws) {
  console.log('closing connection!');

  // remove user from list and broadcast
  ws.broadcast(JSON.stringify({task: 'removeUser', user : USERS[ws.id] }));
  delete USERS[ws.id];

});

//server.listen(8889);

