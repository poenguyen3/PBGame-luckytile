(function($, window){
  var socket = io();
  socket.on('connect', function(){
    socket.emit('hello there', 'HELLO NODE SERVER', function(data){
      console.log(data);
    });
  });

  $('.overlay').click(function(){
    Waves.displayEffect();
  });
}(jQuery, window));
