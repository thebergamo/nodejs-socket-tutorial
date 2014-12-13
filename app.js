var buffertools = require('buffertools').extend();
var net = require('net');
//Todas as conexões recebidas devem retornar um hello =D

// mensagens tem que terminar com uma quebra de linha /n
var nl = new Buffer('\r\n');
var buffer = new Buffer(0);
var server = net.createServer(function(socket) {

  console.log('server connected');

  socket.on('end', function() {
    console.log('server disconnected');
  });
  socket.on('error', function(err){
    console.log('error: '+err);
  });

  var cmd = {
    buffer: new Buffer(150),
    cursor: 0
  };

  cmd.buffer.clear();

  socket.on('data', function(data){
    if((cmd.cursor + data.length) > 150)
      return socket.destroy(); // Alguém mandou um comando maior de 150 bytes

    // Gravamos os dados recebidos no buffer de comando
    // de acordo com a posição do cursor
    cmd.buffer.write(data.toString(), cmd.cursor);

    // Mudamos a posição do cursor
    cmd.cursor += (data.length);


    // Não achamos o \r\n :-(
    if(data.indexOf(nl) === -1)
      return;

    // Achamos \r\n, precisamos pegar todas as mensagens
    var mgs = [];

    var loop = function(){
      if(cmd.buffer.indexOf(nl) === -1)
        return;

      mgs.push(cmd.buffer.slice(0, cmd.buffer.indexOf(nl)));
      cmd.buffer = cmd.buffer.slice(cmd.buffer.indexOf(nl) + 1);
      loop();
    };

    loop();

    // Precisamos ver o que sobrou dentro do buffer e criar um novo
    // buffer com 150 bytes de limite contendo o que sobrou do buffer antigo
    var old = cmd.buffer
    cmd.buffer = new Buffer(150);
    cmd.buffer.clear();
    cmd.buffer.write(old.toString(), 0);

    // Setamos o cursor para o restante
    cmd.cursor = old.length;

    mgs.forEach(function(json){
      msgParser(socket, json);
    });
  });
});
server.listen(8080, function() { //'listening' listener
  console.log('server bound');
});

function msgParser(socket, json){
  try{
    var data = JSON.parse(json);

    //cmd available...
    //SMG = Send Message
    //TMJ = Tell Me a Joke
    // KLC = Kill Connection
    var availableCMD = ['SMG', 'TMJ', 'KLC'];
    if(availableCMD.indexOf(data.cmd) <= -1){
      console.log('Invalid Protocol');
      socket.destroy();
      return;
    }

    if(data.cmd === 'SMG') SMG(data, socket);
    if(data.cmd === 'TMJ') TMJ(data, socket);
    if(data.cmd === 'KLC') KLC(data, socket);


  }catch(err){
    console.log(json.toString());
    console.log("Error on parsing JSON: "+err);
    socket.destroy();
    return;
  }

};

function SMG(data, socket){
  if(data.msg === 'PING'){
    //devolva a msg 'PONG';
    var ret = {
      cmd: 'SMG',
      data: {
        msg: 'PONG'
      }
    }
    socket.write(JSON.stringify(ret)+nl);
    return;
  }

  //para qualquer outra mensagem...
  var ret = {
    cmd: 'SMG',
    data: {
      msg: 'Message received! Tks'
    }
  }
  socket.write(JSON.stringify(ret)+nl);
  return;
}
function TMJ(data, socket){
  console.log('TMJ');
  var ret = {
    cmd: 'SMG',
    data: {
      msg: 'You\'re awesome!'
    }
  }
  socket.write(JSON.stringify(ret)+nl);
  return;
}
function KLC(data, socket){
  var ret = {
    cmd: 'SMG',
    data: {
      msg: 'byebye!'
    }
  }
  socket.write(JSON.stringify(ret)+nl);
  socket.destroy();
  return;
}
