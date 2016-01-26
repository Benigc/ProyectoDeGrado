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
    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render( 'index' , { title: 'Proyecto de grado' });
    });

    io.on('connection', function (socket) {
      socket.on('index_hello', function (data) {
        console.log(data);
      });
    });

    return router;
}