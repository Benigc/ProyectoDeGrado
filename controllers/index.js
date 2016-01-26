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
      res.render( 'index' , { title: 'Proyecto de grado' });
    });

    io.on('connection', function (socket) {
      socket.on('index_hello', function (data) {
        console.log(data);
        var obrero = new Obrero();
        obrero.codigo = ' prueba1';
        obrero.save(function(err){
          if(err)
            console.log(error);
          console.log(obrero);
        })
      });
    });


    return router;
}