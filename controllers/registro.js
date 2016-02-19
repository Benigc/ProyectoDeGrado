module.exports = function( io ) {
    var app = require('express');
    var router = app.Router();

    var Obrero = require('../models/obrero');

    /* GET home page. */
    router.get('/', function(req, res, next) {
      //res.render( 'video' , { title: 'Video' });
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
              res.render('registro',{ obreros:obreros });
            }
          });
      //};
        //res.render( 'index' , { title: 'Proyecto de grado' });
      });
    //});
    router.post('/',function(req, res){
      if("ci"==req.body.seleccion){
        Obrero.findOne({ci:req.body.buscar},function(error,dato){
          if(error){
            io.emit('Error al buscar');
          }
          else{
            io.emit('mos',{obrero:dato});
          }
        });
      }
      else{
        if("cargo"==req.body.seleccion){
          Obrero.findOne({cargo:req.body.buscar},function(error,dato){
            if(error){
              io.emit('Error al buscar');
            }
            else{
              io.emit('mos',{obrero:dato});
            }
          });
        }
        else{
          Obrero.findOne({turno:req.body.buscar},function(error,dato){
            if(error){
              io.emit('Error al buscar');
            }
            else{
              io.emit('mos',{obrero:dato});
            }
          });  
        }
      }
    })
    //io.emit('rfid',{obrero:dato});

    return router;
}

