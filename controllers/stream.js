module.exports = function( io ) {
    var app = require('express');
    var router = app.Router();
    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render( 'stream' , { title: 'Stream' });
    });

    io.on('connection', function (socket) {
      socket.on('javascript_simple.html', function (data) {
        console.log(data);
      });
    });
//--/javascript_simple.html
    return router;
}
