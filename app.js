var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongoose');
var session = require('express-session');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
/*------------------CONEXION DE MONGODB---------------------*/
mongodb.connect('mongodb://localhost/obreros',function(error){
  if(error){
    throw error;
  }else{
    console.log('base de datos conectado');
  }
});

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
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());




/* --------------- RUTAS ------------------- */

var index = require('./controllers/index')( io );
var usuarios = require('./controllers/usuarios')( io );
var registro = require('./controllers/registro')( io );
var stream = require('./controllers/stream')( io );
var alarmas = require('./controllers/alarmas')( io );
var formulario = require('./controllers/formulario')( io );
var obreros = require('./controllers/obreros')( io );


app.use( '/' , index );
app.use( '/usuarios', usuarios );
app.use( '/registro', registro );
app.use( '/stream', stream);
app.use( '/alarmas', alarmas);
app.use( '/formulario', formulario);
app.use( '/obreros', obreros );

/* --------------------- SOCKETS ------------------------ */

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

var Usuario = require('./models/usuario');

passport.serializeUser( function( user , done ) {
  done( null , user._id );
});
 
passport.deserializeUser( function( id , done ) {
  Usuario.findById( id , function( err , user ) {
    done( err , user );
  });
});


var isValidPassword = function( user , password ){
  return bCrypt.compareSync( password , user.password );
}

// passport/login.js
passport.use( new LocalStrategy(
  function( username , password , done ) { 
    // check in mongo if a user with username exists or not
    Usuario.findOne({ 'username' :  username }, function( err , user ) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log( 'User Not Found with username ' + username );
          return done( null, false , { message: 'Incorrect username.' } );                 
        }
        // User exists but wrong password, log the error 
        if ( !isValidPassword( user , password ) ){
          console.log( 'Invalid Password' );
          return done( null , false , { message: 'Incorrect password.' } );
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done( null , user );
      }
    );
}));


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/usuarios',
                                   failureFlash: false })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/*var Obrero = require('./models/obrero');
Obrero.find({},function(error,obreros){
  if(error){
    res.send('Ha ocurrido un error');
  }
  else{
    console.log(obreros)
  }
})
var obrero = new Obrero({
//        codigo: "12345",
  //      nombre: "jorge",
    //    mes.meses:"enero"
        //hora: [{dia:a}]
      });
      obrero.save(function( error , obrero ){
        if(error){
          console.log('Error al guardar datos');
        }
        else{
          //req.session.obrero = obrero;
          //res.redirect('/formulario' );
          console.log("dato guardado");
        }
      });










/*--------------------PUERTO SERIAL------------------------*/

/*var piserial = new serialport.SerialPort("/dev/ttyUSB0",
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
  
   // var obrero = new Obrero();
    //obrero.codigo = data;
//Auth.findOne({nick: 'noname'}, function(err,obj) { console.log(obj); });
  Obrero.findOne({codigo:data},function(error,dato){
      //console.log("dato ----"+dato);
      //console.log("error---- "+error);
    console.log(dato);
    if(dato == null){
      io.emit('registro',{codigo:data});
      console.log("no existe");
    }
    else{
      var a = new Date();
      //a=a.getHours()+":"+a.getMinutes();
      var obrero = dato; 
      var b=[];
      b=obrero.trabajo.horaEntrada;
      //console.log(dato.hora.getMinutes());
      if(b.length==0){
        b.push(a);
        obrero.estado=false;
        obrero.trabajo.horaEntrada=b;
        io.emit('rfid',{obrero:dato});
        obrero.save(function(error){
          if(error)
            console.log(error);
          else
            console.log("hora registrada");
        });
        console.log("hora registada en la posicion 0");
      }
      else{
        if(a.getMinutes()!= b[b.length-1].getMinutes()&& obrero.estado==true){
          b.push(a);
          obrero.estado=false;
          obrero.trabajo.horaEntrada = b;
          io.emit('rfid',{obrero:dato});
          obrero.save(function(error){
            if(error)
              console.log(error);
            else
              console.log("hora de entrada registrada");
          });
        }
        else{
          var c = [];
          c = obrero.trabajo.horaSalida;
          if(a.getMinutes()!= c[c.length-1].getMinutes()&& obrero.estado==false){
            c.push(a);
            obrero.estado=true;
            obrero.trabajo.horaSalida = c;
            io.emit('rfid',{obrero:dato});
            obrero.save(function(error){
              if(error)
                console.log(error);
              else
                console.log("hora de salida registrada");
            });
          }
        }
        console.log("existe");
      }
    }
  });
  //console.log(data+"  dato");
});
*/
function guardar(req,res){
  
}






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
