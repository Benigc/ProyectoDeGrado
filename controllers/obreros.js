module.exports = function( io ) {
    var app = require('express');
    var router = app.Router();
    var Obrero = require('../models/obrero');

    /* GET home page. */
    ///router.get('/', function(req,res,next))
    router.get('/', function(req, res, next) {
    	console.log( req );
		Obrero.find( {} ,  null , { sort: { _id : -1 }} , function( error , obreros ){
			///console.log(obreros);
			if( error ){
				res.send( 'Ha surgido un error.' );
			}else{
				res.render('obreros/index', {
					obreros: obreros
				});
			}
		});
	});

    router.get( '/create' , function( req , res , next ){
		res.render('obreros/create' , {
			put: false,
			action: '/obreros/store',
			obrero: new Obrero({
				nombre: '',
				apellido: '',
				biografia: ''
			})
		});
	});


    router.post( '/store' , function( req , res , next ){
		var obrero = new Obrero({
			nombre: req.body.nombre,
			apellido: req.body.apellido,
			biografia: req.body.biografia
		});
		obrero.save( function( error , obrero ){
			if( error ){
				res.send('Error al intentar guardar el Obrero.');
			}else{	
				res.redirect( '/obreros' );
			}
		});
	});

	router.get('/:_id/ver' ,function(req, res, next){
		Obrero.findById( req.params._id , function(error, obrero ){
			if(error){
				res.send('Error al intentar ver el Obrero.');
			}else{
				res.render( 'obreros/mostrar', {
					obrero: obrero
				});
			}
		});
	});


	router.get( '/:_id/editar'  , function( req , res , next ){
		Obrero.findById( req.params._id, function(error, obrero ){
			if( error ){
				res.send('Error al intentar ver el persona.');
			}else{
				res.render('obreros/create', {
					put: true,
					action: '/obreros/modificar/' + req.params._id,
					obrero: obrero
				});
			}
		});
	});


	router.post( '/modificar/:_id' , function( req , res , next ){

		Obrero.findById( req.params._id, function( error, obrero ){
			if( error ){
				res.send('Error al intentar modificar persona.');
			}else{
				obrero.nombre = req.body.nombre;
				obrero.apellido = req.body.apellido;
				obrero.biografia = req.body.biografia;
				obrero.save( function( error, obrero ){
					if(error){
						res.send('Error al intentar guardar  persona.');
					}else{	
						res.redirect('/obreros');
					}
				});
			}
		});
	});


	router.post( '/:_id/eliminar', function( req, res , next ){
		Obrero.remove({_id: req.params._id}, function(error){
			if(error){
				res.send('Error al intentar eliminar el persona.');
			}else{	
				res.redirect('/obreros');
			}
		});
	});

	router.post('/buscador', function( req, res, next){
      //if("ci"==req.body.seleccion){
      	console.log(req.body.buscar+"-------------------------");
        Obrero.findOne({nombre:req.body.buscar},function(error,obrero){
          if(error){
            console.log('Error al buscar');
          }
          else{
            //io.emit('buscar',{obrero:dato});
            res.render( 'obreros/mostrar', {
					obrero: obrero
				});
          }
        });
        console.log('buscar')
    });


    io.on('connection', function ( socket ) { } );
    return router;
}

