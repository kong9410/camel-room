module.exports = function(app, Estate){
    // CREATE estate
    app.post('/api/Estate', function(req, res){
        console.error("Post to Estate");
        var estate = new Estate();
        estate.title = req.body.title,
        estate.imageURL = req.body.imageURL;
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

        estate.save(function(err){
            if(err){
                console.error(err);
                res.redirect('/estate');
                return;
            }
            res.redirect('/');
        });
    });
}