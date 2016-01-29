module.exports = function( io ) {
    var app = require('express');
    var router = app.Router();
    var Obrero = require('../models/obrero')
      var a = new Date();
      //a = a.getHours()+":"+ a.getMinutes()+":"+a.getSeconds();
  

    /* GET home page. */
    router.get('/',function(req,res,next){
      res.render( 'registro' , { title: 'Registro' });
    });
    router.post('/', function(req, res, next) {
      var obrero = new Obrero({
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        hora: [{dia:a}]
      });
      obrero.save(function(error,documento){
        if(error){
          res.send('Error al guardar datos');
        }
        else{
          res.redirect('/registro');
        }
  });
    
    });

    io.on('connection', function (socket) {
      socket.on('index_hello', function (data) {
        console.log(data);
      });
    });
    //app.post('/', obrero.registrar);
    return router;
}