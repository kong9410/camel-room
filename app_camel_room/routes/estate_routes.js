
var router          = require('express').Router();
var Estate          = require('../models/estate');
var multer		    = require('multer');
var fs              = require('fs');
var PATH            = require('path');
// [FILE UPLOAD PATH]
var upload          = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, './uploads/');
        },
        filename: function(req, file, cb){
            cb(null, new Date().valueOf() + file.originalname);
        }
    }),
});
router.post('/', upload.single('estateFile'), function(req, res){
    console.error("Post to Estate");
    var estate = new Estate();
    estate.title = req.body.title;
    var fileObj = req.file;
    if(fileObj){
        estate.orgFileName = fileObj.originalname;
        estate.saveFileName = fileObj.filename;
    }
    estate.houseType = req.body.houseType;
    estate.contractTag = req.body.contractTag;
    estate.price = req.body.price;
    estate.deposit = req.body.deposit;
    estate.homeAddress = req.body.homeAddress;
    estate.roomSize = req.body.roomSize;
    estate.rooms = req.body.rooms;
    estate.toilet = req.body.toilet;
    estate.floors = req.body.floors;
    estate.years = req.body.years;
    console.log(estate);
    estate.save(function(err){
        if(err){
            console.error(err);
            res.redirect('/estate');
            return;
        }
        res.redirect('/');
    });
});

module.exports = router;
