var router = require('express').Router();
var auth = require('../auth');
let agenda = require('../../jobs/agenda');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var MailInput = mongoose.model('MailInput');
var WaitItem = mongoose.model('WaitItem');

router.post('/', auth.required, function(req, res, next){

    var returnMessage = "";

    User.findById(req.payload.id).then(function(user){
        if (!user) { return res.sendStatus(401); }
    
        var mailInput = new MailInput();

        emailTemps = req.body.mailInput;

        mailInput.clientBusiness = user;
        mailInput.uniqueIdentifier = mailInput.generateIdentifier();
        mailInput.email = emailTemps.split(',');
        mailInput.scheduled = "3 seconds";

        mailInput.email.forEach(function(element) {

            mailInput.uniqueIdentifier = mailInput.generateIdentifier();

            agenda.schedule(mailInput.scheduled,'email',{emailAddress: element, displayName: user.username, uniqId: mailInput.uniqueIdentifier});

            var waitItem = new WaitItem();
            waitItem.uniqueIdentifier = mailInput.uniqueIdentifier;
            waitItem.clientBusiness = user;
            waitItem.happyWait = true;
            waitItem.sadWait = true;

            waitItem.save().then(function()
            {
                returnMessage += "Email Queued... ";
                console.log("Email Job Queued");
            });
        });
    }).catch(next);
    return res.json(returnMessage);
});

module.exports = router;