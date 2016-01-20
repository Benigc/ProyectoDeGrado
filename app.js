require('./mongodb/models')
var express = require('express.io');
var app = express().http().io();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

var spawn = require('child_process').spawn;
var proc;

var Gpio = require("onoff").Gpio;
var raspicam = require("raspicam");
var serialport = require("serialport");
var user = require('./mongodb/users');
app.configure(function(){
	app.set('port', process.env.PORT || 7076);
	app.set('views', __dirname + '/html');
	app.set('view engine', 'html');
	app.use(express.static(path.join(__dirname, '/s')));
	app.use(express.static(path.join(__dirname, '/image')));
	app.use(express.static(path.join(__dirname, '/css')));
  app.use(express.static(path.join(__dirname, '/cliente')));
  app.use(express.static(path.join(__dirname, '/stream')));
});
/*io.route('ready', function(req) {
	req.io.broadcast('mensaje',{mensaje:a});
});*/
var pir = new Gpio(17,'in','both');
var camara = new raspicam({
  mode: "timelapse",
  output:"./foto/image_%06d.jpg",
  encoding:"jpg",
  timelapse: 50,
  timeout:1000
});

var piserial = new serialport.SerialPort("/dev/ttyAMA0",{
  baudrate:9600,
  parser: serialport.parsers.readline("\03")
});

/*camara.on("start",function(err, timestamp){
  console.log("timelapse  at "+timestamp);
});
camara.on("read",function(err,timestamp,filename){
  console.log("video captured with filename: "+ filename + "at "+timestamp);
});
camara.on("exit",function(timestamp){
  console.log("video child process has exited at "+ timestamp);
});
camara.on("stop",function(err,timestamp){

});*/
setTimeout(function(){
  camara.stop();
}, 10000);

piserial.on( "close" , function (err) {
    console.log("Puerto serial cerrado");
});

piserial.on("error", function (err) {
    console.error("error", err);
});

piserial.on("open", function () {
    console.log("Puerto serial listo....");
});
piserial.on("data", function (data){
    data = data.substring(1);
    console.log(data+" dato");
});

// pir lectura de pir
/*pir.watch(function(err,value){
  if (err)exit();
  console.log("Intruso detectado");
  if(value == 1){
    camara.start();
  }
});*/

var sockets = {};

app.on('connection', function(socket) {

  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);

  socket.on('disconnect', function() {
    delete sockets[socket.id];

    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  });

  socket.on('start-stream', function() {
    startStreaming(io);
  });

});



function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./stream/image_stream.jpg');
  }
}

function startStreaming(io) {

  if (app.get('watchingFile')) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 1000));
    return;
  }

  var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "9999999", "-tl", "0.1"];
  proc = spawn('raspistill', args);

  console.log('Watching for changes...');

  app.set('watchingFile', true);

  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 1000));
  })

}

function getDia(){
    var a = new Date();
    a = a.getMinutes()+":"+a.getSeconds();
    	return a;
}

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/html/registro.html', function (req, res) {
  res.sendfile(__dirname + '/html/registro.html');
});
/*app.get('/cliente/javascript.js', function (req, res) {
  res.sendfile(__dirname + '/cliente/javascript.js');
});*/
app.get('/html/video.html', function (req, res) {
  res.sendfile(__dirname + '/html/video.html');
});
app.get('/html/alarmas.html', function (req, res) {
  res.sendfile(__dirname + '/html/alarmas.html');
});
app.get('/html/stream.html', function (req, res) {
  res.sendfile(__dirname + '/html/stream.html');
});

app.use(user);
app.listen(app.get('port'),function(){
	console.log('puerto');
});
console.log("Puerto 7076" );
setTimeout(function(){},10);