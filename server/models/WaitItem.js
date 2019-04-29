var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var User = mongoose.model('User');

var WaitItemSchema = new mongoose.Schema({
    uniqueIdentifier: String,
    clientBusiness: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    happyWait: Boolean,
    sadWait: Boolean,
}, {timestamps: true});

WaitItemSchema.methods.happyDeactivate = function(){
    this.happyWait = false;
    return this.save();
};
WaitItemSchema.methods.sadDeactivate = function(){
    this.sadWait = false;
    return this.save();
};

mongoose.model('WaitItem', WaitItemSchema);