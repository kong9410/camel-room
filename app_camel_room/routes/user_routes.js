
module.exports = function(app, User){
    // CREATE user
    app.post('/api/User', function(req, res){
        console.error("Post to User");
        var user = new User();
        user.email = req.body.email;
        user.password = req.body.password;
        user.realname = req.body.realname;
        user.tel = req.body.tel;
        user.dob = req.body.dob;
        user.address = req.body.address;
        
        user.save(function(err){
            if(err){
                console.error(err);
                res.redirect('/');
                return;
            }
        });
        res.redirect('/');
    });
}