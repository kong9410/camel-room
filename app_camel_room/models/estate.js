var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estateSchema = new Schema({
    title:String,
    imageURL:String,
    houseType:String,
    contractTag:String,
    price:Number,
    deposit:Number,
    homeAddress:String,
    roomSize:Number,
    rooms:Number,
    toilet:Number,
    floors:Number,
    years:String,
    coordinates:{x:Number, y:Number},
}, { versionKey: false });

module.exports = mongoose.model('estate', estateSchema);
