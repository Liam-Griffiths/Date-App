var router = require('express').Router();
var auth = require('../auth');
let agenda = require('../../jobs/agenda');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var HappyRes = mongoose.model('HappyRes');
var WaitItem = mongoose.model('WaitItem');

router.post('/', function(req, res, next){

    var uniqId = req.body.uniqId;
    var happyVal = req.body.happyVal;
    var contactEmail = req.body.contactEmail;
    var contactPhone = req.body.contactPhone;
    var reviewText = req.body.reviewText; 
    var refEmail = req.body.refEmail;

    WaitItem.find({uniqueIdentifier: uniqId}).then(function(item){

        if (!item) { return res.sendStatus(401); }

        User.findById(item[0].clientBusiness).then(function(user){
            if (!user) { return res.sendStatus(401); }

            // Negative Review
            if(happyVal == "0" )
            {

                if(item[0].sadWait == false){ return res.sendStatus(401); }
                
                var newReview = new HappyRes();
                newReview.clientBusiness = item[0].clientBusiness;
                
                item[0].sadDeactivate();

                console.log(item[0].active1);

                item[0].active1 = false;
                item[0].save();

                newReview.uniqueIdentifier = uniqId;
                newReview.isHappy = false;
                newReview.contactEmail = contactEmail;
                newReview.contactPhone = contactPhone;
                newReview.reviewText = reviewText;
                newReview.viewed = false;
                newReview.clicked = false;
                newReview.reviewTarget = "";
                newReview.clickedTimestamp = "";
                newReview.save().then(function()
                {
                    console.log("Saved Negative Review");
                });

                var pid = user.oneSignalIds;
                agenda.now('notify',{ playerIds: pid, 
                    msg: "Open in the app to see their comments.",
                    msgTitle: "Negative Review!"
                });
                agenda.now('email', {emailAddress: refEmail, templateStr: "mail_template_unhappy.txt", displayName: user.username});
                return res.json("Negative " + item);
            }

            // Positive Review
            if(happyVal == "1")
            {

                if(item[0].happyWait == false){ return res.sendStatus(401); }
                item[0].happyDeactivate();

                newReview.isHappy = true;
                newReview.save().then(function()
                {
                    console.log("Saved Postive Review");
                });

                var pid = user.oneSignalIds;
                agenda.now('notify',{ playerIds: pid, 
                    msg: "See how well you are doing by opening the app.",
                    msgTitle: "Another Happy Customer!"
                });
                agenda.now('email', {emailAddress: refEmail, templateStr: "mail_template_happy.txt", displayName: user.username});
                return res.json("Positive " + item);
            }
        });


    }).catch(next);
   
});

router.post('/clicked', function(req, res, next){

    var uniqId = req.body.uniqId;
    var reviewTarget1 = req.body.reviewTarget;

    HappyRes.findOne({uniqueIdentifier: uniqId},function (err,item){

        if(err){ console.log(err); return res.sendStatus(401); }
        if (!item) { return res.sendStatus(401); }
        if(item.clicked == true){ return res.sendStatus(401); }

        item.clicked = true; 
        item.reviewTarget = reviewTarget1; 
        item.clickedTimestamp = Date.now();

        item.save(function(err,news){
            console.log("Tried to save...");
            if(err)
            {
                return res.sendStatus(401);
            }else{
                return res.sendStatus(200);
            }
        });

    });
   
});

router.get('/', auth.required, function(req, res, next){

    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }
        HappyRes.find({clientBusiness: user}).then(function(item){
            console.log("got this");
            if(!item){ return res.sendStatus(401); }
            return res.json({data: item});
          });
    });
});

module.exports = router;