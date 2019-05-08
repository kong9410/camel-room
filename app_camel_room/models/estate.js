var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estateSchema = new Schema({
    title:String,
    orgFileName : String,
    saveFileName : String,
    houseType:String,
    contractTag:String,
    price:Number,
    deposit:Number,
    roadAddress:String,
    detailAddress:String,
    roomSize:Number,
    rooms:String,
    toilet:Number,
    floors:Number,
    years:String,
    writer:String
    //coordinates:{x:Number, y:Number},
}, { versionKey: false });

module.exports = mongoose.model('estate', estateSchema);
