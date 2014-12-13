nodejs-socket-tutorial
======================

An tutorial to make easy to learn about working with sockets in Node.js

JSON Protocol

Send messages
````
{
  "cmd": "SMG", //3 letras para especificar o comando. (SMG = Send Message)
  "data": {
    "msg": "This is my first protocol"
  }
}

````
Answer messages
````
{
  "cmd": "RMG", //3 letras para especificar o comando. (RMG = Received Message)
  "data": {
    "msg": "Message received"
  }
}

````
Error messages
````
{
  "cmd": "ERR", //3 letras para especificar o comando. (ERR = Error)
  "data": {
    "msg": "Something is wrong!"
  }
}

````
