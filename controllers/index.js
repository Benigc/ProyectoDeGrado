module.exports = function( io ) {
    var app = require('express');
    var router = app.Router();
    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render( 'index' , { title: 'OBRERO EN SOCAVON' });
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