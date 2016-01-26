var mongoose =require('mongoose');
var Schema = mongoose.Schema;

var ObreroSchema = new Schema({
	codigo: String
});
module.exports = mongoose.model('Obrero',ObreroSchema);