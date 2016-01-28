module.exports = function( io ) {
    var app = require('express');
    var router = app.Router();
    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render( 'stream' , { title: 'Stream' });
    });

    io.on('connection', function (socket) {
      socket.on('index_hello', function (data) {
        console.log(data);
      });
    });

    return router;
}
