var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongoose');
//var obreros = require('./models/model');

var socket_io    = require( "socket.io" );
var app = express();
// Socket.io
var io           = socket_io();
app.io           = io;

var serialport = require("serialport");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/* --------------- RUTAS ------------------- */

var index = require('./controllers/index')( io );
var users = require('./controllers/users');
var registro = require('./controllers/registro')( io );
var stream = require('./controllers/stream')(io);
var alarmas = require('./controllers/alarmas')(io);
var video = require('./controllers/video')(io);

app.use( '/' , index );
app.use( '/users', users );
app.use( '/registro', registro );
app.use( '/stream',stream);
app.use( '/alarmas',alarmas);
app.use( '/video',video);

/* --------------------- SOCKETS ------------------------ */

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
/*----------------------------------------------*/
mongodb.connect('mongodb://localhost/obreros',function(error){
  if(error){
    throw error;
  }else{
    console.log('base de datos conectado');
  }
});

/*--------------------------------------------------------*/

var piserial = new serialport.SerialPort("/dev/ttyUSB0",
  {
    baudrate : 9600,
    parser : serialport.parsers.readline('\03')
  });

piserial.on("close",function(err){
  console.log("Puerto serial cerrado");
});
piserial.on("error",function(err){
  console.log("error",err);
});

piserial.on("data",function(data){
  data = data.substring(1);
  var Obrero = require('./models/obrero');
   // var obrero = new Obrero();
    //obrero.codigo = data;
//Auth.findOne({nick: 'noname'}, function(err,obj) { console.log(obj); });
    Obrero.findOne({codigo:data},function(error,dato){
      //console.log("dato ----"+dato);
      //console.log("error---- "+error);
      if(dato == null){
        io.emit('registro',{codigo:data});
        console.log("no existe");
      }
      else{
        console.log("existe");
        /*Obrero.save(function(err){
        if(err)
          console.log(error);
        })*/
      }
    });


    
    
  //console.log(data+"  dato");
});
/* --------------------------------------------- */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
