const nodemailer = require('nodemailer');
const path = require("path");
const fs = require('fs');
const https = require('https');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(agenda) {
    agenda.define('notify', function(job, done) {

        var userRef = job.attrs.data.playerIds;
        var notifyMessage = job.attrs.data.msg;
        var notifyTitle = job.attrs.data.msgTitle;

        var removeJob = function() {
          job.remove(err => {
            if (!err) {
                console.log('Job Removed.');
            }
        });
        }

        var sendNotification = function(data) {
            var headers = {
              "Content-Type": "application/json; charset=utf-8",
              "Authorization": "Basic NjM0MjlkNTYtMDg1MS00ZTc3LWEyODMtMmVkODI0Y2ZkZGYx"
            };
            
            var options = {
              host: "onesignal.com",
              port: 443,
              path: "/api/v1/notifications",
              method: "POST",
              headers: headers
            };
            
            var req = https.request(options, function(res) {  
              res.on('data', function(data) {
                console.log("Response:");
                console.log(JSON.parse(data));
                removeJob();
              });
            });
            
            req.on('error', function(e) {
              console.log("ERROR:");
              console.log(e);
              removeJob();
            });
            
            req.write(JSON.stringify(data));
            req.end();
        };
          
        var message = { 
            app_id: "d7d0f508-579e-44ca-b336-13dc2361ad3f",
            contents: {"en": notifyMessage},
            headings: {"en": notifyTitle},
            buttons: [{"id": "id1", "text": "Open in App"}],
            include_player_ids: userRef
        };
        console.dir(message);
          
        sendNotification(message);
        
    });
};