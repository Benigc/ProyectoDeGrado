var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonaSchema = new Schema({
	nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    biografia: {type: String, required: true}
});
module.exports = mongoose.model('Persona',PersonaSchema);
