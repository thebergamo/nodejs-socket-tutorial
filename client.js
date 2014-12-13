var net = require('net');
// socket client para se conectar no server
var client = net.connect({port: 8080}, function() {
  console.log('client connected');
  client.write('Hello world!\r\n');
});
client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});
client.on('end', function() {
  console.log('client disconnected');
});
