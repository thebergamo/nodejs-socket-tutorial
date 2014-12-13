var net = require('net');
// socket client para se conectar no server

var nl = new Buffer('\r\n');
var client = net.connect({port: 8080}, function() {
  console.log('client connected');
  var msg = {
    cmd: 'SMG',
    data: {
      msg: 'PING'
    }
  };
  client.write(JSON.stringify(msg)+nl);
});
client.on('data', function(data) {
  console.log(data.toString());
});
client.on('end', function() {
  console.log('client disconnected');
});
