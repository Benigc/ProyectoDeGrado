/*var express = require('express');
var router = express.Router();

/* GET home page. * /
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/
module.exports = function( io ) {
    var app = require('express');
    var router = app.Router();
    var Obrero = require('../models/obrero');
    /* GET home page. */
    router.get('/', function(req, res, next) {
      /*Obrero.findById(req.params.codigo, function(error, documento){
        if(error){
          res.send('Error al intentar ver el personaje.');
        }else{
          res.render('personajes/show', {
            obrero: documento
          });
        }*/
      
      //function(req,res){
    Obrero.find({/*
      occupation: /host/,
      'name.last': 'Ghost',
      age: { $gt: 17, $lt: 66 },
      likes: { $in: ['vaporizing', 'talking'] }*/
    }).
    //limit(10).
    sort({ _id: -1 }).
    //select({ name: 1, occupation: 1 }).
    exec(function(error,obreros){
            if(error){
              res.send('Ha ocurrido un error');
            }
            else{
              res.render('index',{ obreros:obreros });
            }
          });
      //};
        //res.render( 'index' , { title: 'Proyecto de grado' });
      });

    io.on('connection', function (socket) {
      socket.on('index_hello', function (data) {
        console.log(data);
        /*var obrero = new Obrero();
        obrero.codigo = ' prueba1';
        obrero.save(function(err){
          if(err)
            console.log(error);
          console.log(obrero);
        })*/
      });
    });
    return router;
}