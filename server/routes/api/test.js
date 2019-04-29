var router = require('express').Router();
var auth = require('../auth');
let agenda = require('../../jobs/agenda');
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.post('/', auth.required, function(req, res, next){

    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }

        var newPlayerId = req.body.onesignal_pid;

        user.addOneSignalId(newPlayerId).then(function(){
            var test1 = user.oneSignalIds;
            agenda.now('notify',{ test: test1});
            console.log(newPlayerId);
            //agenda.now('email');
        });

        return res.json("Started Your Test... Mysterious.");

    
      }).catch(next);
});

router.get('/email', function(req, res, next){
        
    
    agenda.now('email');
    return res.json("Started Your Test... Mysterious.");

});

module.exports = router;