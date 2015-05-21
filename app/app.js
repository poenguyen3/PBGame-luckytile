var app = require('express')(),
    http = require('http').Server(app),
    skio = require('socket.io')(http);

var config = {
      port: 8888,
      devDir: '/builds/dev',
      env: process.env.NODE_ENV
    }


switch (config.env) {
  case 'development': {
    app.get('/', function(req, res){
      console.log("GET INDEX");
      // res.sendFile(config.devDir + '/index.html');
    });
  }break;
  default: {
    app.get('/', function(req, res){
      console.log("GET INDEX");
      res.sendFile(__dirname + config.devDir + '/index.html');
    });
  }
}

io.on('connection', function(socket){
  console.log('a user connected');
});


http.listen(config.port, function(){
  console.log('Listening on port ' + config.port)
});
