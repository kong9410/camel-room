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
    writer:String,
    latitude : Number,
    longitude : Number,
    estate_id : String,
    safe_value : Number,
    popular_value : Number,
    education_value : Number,
    traffic_value : Number,
    healthy_value : Number,
    convenience_value : Number
}, { versionKey: false });

module.exports = mongoose.model('estate', estateSchema);
