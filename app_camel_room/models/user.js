var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    password: String,
	realname: String,
	tel: String,
	dob: String,
	address : String
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
