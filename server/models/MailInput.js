var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var User = mongoose.model('User');
var crypto = require('crypto');

var MailInputSchema = new mongoose.Schema({
    uniqueIdentifier: String,
    clientBusiness: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the client user object.
    email: [{type: String}],
    templateId: String,
    scheduled: String,
}, {timestamps: true});

MailInputSchema.methods.generateIdentifier = function(){
    this.uniqueIdentifier = crypto.randomBytes(16).toString("hex");
    return this.uniqueIdentifier;
};

mongoose.model('MailInput', MailInputSchema);