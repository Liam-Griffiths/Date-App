const nodemailer = require('nodemailer');
const path = require("path");
const fs = require('fs');

module.exports = function(agenda) {
    agenda.define('email', {priority: 'high', lockLifetime: 10000}, job => {

        var templateStr = "mail_template_1.txt"; // default

        var emailHtml = "";
        var email = job.attrs.data.emailAddress;
        var uniqId = job.attrs.data.uniqId;
        var displayName = job.attrs.data.displayName;
        var templateName = job.attrs.data.templateStr;
        if(templateName)
        {
            templateStr = templateName;
        }

        email = email.replace(',','');
        email = email.replace(' ','');

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'zqxeruhen6ckrgls@ethereal.email',
                pass: 'TEu5hsJG8qmfryBu6V'
            }
        });

        const publicPath = path.resolve(__dirname, "../../public/templates-email"); 
        const htmlPath = path.join(publicPath, templateStr);


        fs.readFile(htmlPath, 'utf8', function (err,data) {
            if (err) {
              return console.log(err);
            }
            emailHtml = data;
            emailHtml = emailHtml.replace('REPLACESTR_BUSINESS', displayName);
            emailHtml = emailHtml.replace('REPLACESTR_REF', uniqId);
            emailHtml = emailHtml.replace('REPLACESTR_REF', uniqId);

            let mailOptions = {
                from: '"Review Happy" <auto@reviewhappy.co.uk>', // sender address
                to: email, // list of receivers
                subject: displayName + ' - Powered by Review Happy', // Subject line
                text: emailHtml, // plain text body
                html: emailHtml // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                /*job.remove(err => {
                    if (!err) {
                        console.log('Job Removed.');
                    }*/
                });
            });
          });
};