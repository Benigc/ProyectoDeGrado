var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
    email: String,
    address: String
});
module.exports = mongoose.model('Usuario', UsuarioSchema);