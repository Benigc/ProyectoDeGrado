module.exports = function( io ) {
    var app = require('express');
    var router = app.Router();
	var Usuario = require('../models/usuario');
	var bCrypt = require('bcrypt-nodejs');
	/* GET users listing. */
	
	router.get( '/' , function( req, res, next ) {
		console.log( req );
		Usuario.find( {} ,  null , { sort: { _id : -1 }} , function( error , usuarios ){
			///console.log(obreros);
			if( error ){
				res.send( 'Ha surgido un error.' );
			}else{
				res.render('usuarios/index', {
					usuarios: usuarios
				});
			}
		});
    });
	
	router.get( '/crear' , function( req , res , next ){
		res.render('usuarios/crear' , {
			put: false,
			action: '/usuarios/guardar',
			usuario : new Usuario({
				username: '',
				password: ''
			})
		});
	});

	router.post( '/guardar' , function( req , res , next ){
		var usuario = new Usuario({
			username: req.body.username,
			password: bCrypt.hashSync( req.body.password , bCrypt.genSaltSync(10) , null )
		});

		usuario.save( function( error , username ){
			if( error ){
				res.send('Error al intentar guardar el Usuario.');
			}else{	
				res.redirect( '/usuarios' );
			}
		});
	});

	router.get('/:_id/ver' ,function(req, res, next){
		Usuario.findById( req.params._id , function(error, username ){
			if(error){
				res.send('Error al intentar ver el Obrero.');
			}else{
				res.render( 'usuarios/mostrar', {
					username: username
				});
			}
		});
	});


	router.get( '/:_id/editar'  , function( req , res , next ){
		Usuario.findById( req.params._id, function(error, username ){
			if( error ){
				res.send('Error al intentar ver el persona.');
			}else{
				res.render('usuarios/crear', {
					put: true,
					action: '/usuarios/' + req.params._id + '/modificar',
					username: username
				});
			}
		});
	});

	router.post( '/:_id/modificar' , function( req , res , next ){

		Usuario.findById( req.params._id, function( error, username ){
			if( error ){
				res.send('Error al intentar modificar persona.');
			}else{
				usuario.username = req.body.username;
				usuario.password = req.body.password;
				usuario.save( function( error, username ){
					if(error){
						res.send('Error al intentar guardar  persona.');
					}else{	
						res.redirect('/usuarios');
					}
				});
			}
		});
	});



    router.post( '/:_id/eliminar', function( req, res , next ){
		Usuario.remove({_id: req.params._id}, function(error){
			if(error){
				res.send('Error al intentar eliminar el persona.');
			}else{	
				res.redirect('/usuarios');
			}
		});
	});
	router.post('/buscador', function( req, res, next){
      //if("ci"==req.body.seleccion){
      	console.log(req.body.buscar+"-------------------------");
        Usuario.findOne({username:req.body.buscar},function(error,username){
          if(error){
            console.log('Error al buscar');
          }
          else{
          	if(usuario.password == req.password)
            //io.emit('buscar',{obrero:dato});
            res.render( 'usuarios/mostrar', {
			});
          }
        });
        console.log('buscar')
    });

	// autentificacion







	return router;
}
//module.exports = router;
