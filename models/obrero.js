var mongoose =require('mongoose');
var Schema = mongoose.Schema;
//var obreros = require('./model');

var ObreroSchema = new Schema({
	codigo: String,
	nombre: String,
	estado: Boolean,
	turno: String,
	hora: { type: Date, default: Date.now },
	trabajo:{horaEntrada:[],horaSalida:[],horaTotal:[]}
});
/*var ObreroModel = mongoose.model('Obrero',ObreroSchema);
obreros.setModel(ObreroModel);*/
module.exports = mongoose.model('Obrero',ObreroSchema);

