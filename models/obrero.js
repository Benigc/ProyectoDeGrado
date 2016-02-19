var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var obreros = require('./model');
var HoraSchema = new Schema({
	total : Date,
	periodo: {pre1:{entrada:Date,salida:Date},per2:{entrada:Date,salida:Date}}
});
module.exports = mongoose.model('Hora',HoraSchema);

var TrabajoSchema = new Schema({
	meses : String,
	dias  : Date,
	hora  : { type:Schema.ObjectId, ref: "Hora"}
});
module.exports = mongoose.model('Trabajo',TrabajoSchema);
var ObreroSchema = new Schema({
	img: String,
	codigo: String,
	nombre: String,
	ci:Number,
	cargo: String,
	estado: Boolean,
	seccion: String,
	turno: String,
	foto: String,
	//hora: { type: Date, default: Date.now },
	horastrabajadas:{type:Schema.ObjectId, ref:"Trabajo"},
	trabajo:{horaEntrada:[],horaSalida:[],hora:[],}
/*var ObreroModel = mongoose.model('Obrero',ObreroSchema);
obreros.setModel(ObreroModel);*/
});
module.exports = mongoose.model('Obrero',ObreroSchema);

