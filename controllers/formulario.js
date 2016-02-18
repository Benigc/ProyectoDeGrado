module.exports = function( io ) {
    var app = require('express');
    var router = app.Router();
    var Obrero = require('../models/obrero')
    var a = new Date();
    //a = a.getHours()+":"+ a.getMinutes()+":"+a.getSeconds();


    /* GET home page. */
    router.get('/',function( req , res , next ){
      var obrero = req.session.obrero || null ;
      data_obj = { title: 'Formulario' };
      if ( obrero != null ) {
        data_obj.obrero = obrero;
      }
      delete req.session.obrero;

      res.render( 'formulario' , data_obj );
    });

    router.post('/', function(req, res, next) {
      var obrero = new Obrero({
        img: req.body.img,
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        cargo: req.body.cargo,
        seccion: req.body.seccion,
        ci: req.body.ci,
        turno: req.body.turno,
        estado:false
        //hora: [{dia:a}]
      });
      obrero.save(function( error , obrero ){
        if(error){
          res.send('Error al guardar datos');
        }
        else{
          req.session.obrero = obrero;
          res.redirect('/formulario' );
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