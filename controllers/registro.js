module.exports = function( io ) {
    var app = require('express');
    var router = app.Router();
    var Obrero = require('../models/obrero')
    var a = new Date();
    //a = a.getHours()+":"+ a.getMinutes()+":"+a.getSeconds();


    /* GET home page. */
    router.get('/',function( req , res , next ){
      var obrero = req.session.obrero || null ;
      data_obj = { title: 'Registro' };
      if ( obrero != null ) {
        data_obj.obrero = obrero;
      }
      delete req.session.obrero;

      res.render( 'registro' , data_obj );
    });

    router.post('/', function(req, res, next) {
      var obrero = new Obrero({
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        estado: req.body.estado
        //hora: [{dia:a}]
      });
      obrero.save(function( error , obrero ){
        if(error){
          res.send('Error al guardar datos');
        }
        else{
          req.session.obrero = obrero;
          res.redirect('/registro' );
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