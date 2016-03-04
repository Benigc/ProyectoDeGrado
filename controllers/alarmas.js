module.exports = function( io ){
	var app = require('express');
	var router = app.Router();
	var Obrero = require('../models/obrero');
	/* GET home page. */
    router.get('/', function(req, res, next) {
      res.render( 'alarmas' , { title: 'Alarmas' });
    });
    
    return router;
}