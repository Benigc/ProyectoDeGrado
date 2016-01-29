var mongoose =require('mongoose');
var Schema = mongoose.Schema;
//var obreros = require('./model');

var ObreroSchema = new Schema({
	codigo: String,
	nombre: String,
	hora: { type: Date, default: Date.now }
});
/*var ObreroModel = mongoose.model('Obrero',ObreroSchema);
obreros.setModel(ObreroModel);*/
module.exports = mongoose.model('Obrero',ObreroSchema);

