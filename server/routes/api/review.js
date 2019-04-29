var router = require('express').Router();
var auth = require('../auth');
let agenda = require('../../jobs/agenda');
var mongoose = require('mongoose');
var WaitItem = mongoose.model('WaitItem');
var HappyRes = mongoose.model('HappyRes');
var User = mongoose.model('User');
const path = require("path");
const fs = require('fs');
const publicPath = path.resolve(__dirname, "../../public"); 

//assuming app is express Object.
router.get('/',function(req,res){
    
    var uniqId = req.query.x;
    var happyVal = req.query.y;

    if (typeof uniqId !== 'undefined' && uniqId !== null){
        if (typeof happyVal !== 'undefined' && happyVal !== null){

            WaitItem.find({uniqueIdentifier: uniqId}).then(function(item){
                if (!item) { return res.sendStatus(401); }

                User.findById(item[0].clientBusiness).then(function(user){
                    if (!user) { return res.sendStatus(401); }
                    
                    var name = user.username;
                    var targetPlatform = "yelp"; // user.targetPlatform

                    if(happyVal == 0) // Negative
                    {
                        
                        item[0].happyDeactivate();
                        var stringVal = "templates-page/unhappy.html";

                        if(item[0].sadWait == false){
                            var stringVal = "templates-page/unhappy-submitted.html";
                        }

                        var htmlPath = path.join(publicPath, stringVal);
                        fs.readFile(htmlPath, 'utf8', function (err,data) {
                            if (err) {
                                res.json("Something went wrong.");
                                return console.log(err);
                            }
                            var resHtml = data;

                            resHtml = resHtml.replace('REPLACESTR_ID', uniqId);
                    
                            resHtml = resHtml.replace('REPLACESTR_BUSINESS', name);
                    
                            res.send(resHtml);
                        });
                    }

                    if(happyVal == 1) // poz
                    {
                        var stringVal = "templates-page/happy.html";

                        var imgPath = "";
                        var platformLink = "";

                        if((item[0].happyWait == false)&&(item[0].sadWait == false)){

                            console.log("so this happenned 111....");
                            stringVal = "templates-page/happy-and-unhappy.html";
                        }

                        var htmlPath = path.join(publicPath, stringVal);

                        switch(targetPlatform) {
                            case "facebook":
                                imgPath = "/img/review-sites/facebook.png";
                                platformLink = "#";
                                break;
                            case "google":
                                imgPath = "/img/review-sites/google.png";
                                platformLink = "#";
                                break;
                            case "tripadvisor":
                                imgPath = "/img/review-sites/tripadvisor.png";
                                platformLink = "#";
                                break;
                            case "trustpilot":
                                imgPath = "/img/review-sites/trustpilot.png";
                                platformLink = "#";
                                break;
                            case "yelp":
                                imgPath = "/img/review-sites/yelp.png";
                                platformLink = "#";
                                break;
                            default:
                                imgPath = "/img/logo.png";
                                platformLink = "#";
                                break;
                        }

                        fs.readFile(htmlPath, 'utf8', function (err,data) {
                            if (err) {
                                res.json("Something went wrong.");
                                return console.log(err);
                            }
                            var resHtml = data;

                            if((item[0].happyWait == false)&&(item[0].sadWait == true)){
                                resHtml = resHtml.replace('REPLACETOSHOW', '');
                            }
                            resHtml = resHtml.replace('REPLACESTR_ID', uniqId);
                            resHtml = resHtml.replace('REPLACESTR_REVIEWTARGET', targetPlatform);
                            resHtml = resHtml.replace('REPLACESTR_BUSINESS', name);
                            resHtml = resHtml.replace('REPLACESTR_IMAGE', imgPath);
                            resHtml = resHtml.replace('REPLACESTR_LINK', platformLink);
                    
                            res.send(resHtml);

                            
                        if(item[0].happyWait == true)
                        {

                            var newReview = new HappyRes();
                            newReview.clientBusiness = item[0].clientBusiness;
                            newReview.uniqueIdentifier = item[0].uniqueIdentifier;
                            newReview.isHappy = true;
                            newReview.contactEmail = "none";
                            newReview.contactPhone = "none";
                            newReview.reviewText = "none";
                            newReview.viewed = false;
                            newReview.clicked = false;
                            newReview.reviewTarget = "";
                            newReview.clickedTimestamp = "";
                            newReview.save().then(function()
                            {
                                console.log("Saved Positive Review");
                            });

                            var pid = user.oneSignalIds;
                            agenda.now('notify',{ playerIds: pid, 
                                msg: "See how well you are doing by opening the app.",
                                msgTitle: "Another Happy Customer!"
                            });

                            item[0].happyDeactivate();
                        }

                        });
                    }

                });
            });

        }else{res.json("Something went wrong.");}
    }else{res.json("Something went wrong.");}
});

module.exports = router;