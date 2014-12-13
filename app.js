var net = require('net');
//Todas as conexões recebidas devem retornar um hello =D
var server = net.createServer(function(socket) {

  console.log('server connected');

  socket.on('end', function() {
    console.log('server disconnected');
  });
  socket.on('error', function(err){
    console.log('error: '+err);
  });

  socket.on('data', function(data){
    socket.write('you say: '+ data);
  });
});
server.listen(8080, function() { //'listening' listener
  console.log('server bound');
});
