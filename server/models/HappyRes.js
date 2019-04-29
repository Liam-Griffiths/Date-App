var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var User = mongoose.model('User');

// Happy Response

var HappyResSchema = new mongoose.Schema({
    uniqueIdentifier: String,
    isHappy: Boolean,
    clientBusiness: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the client user object.
    contactEmail: String,
    contactPhone: String,
    reviewText: String,
    viewed: Boolean,
    clicked: Boolean,
    reviewTarget: String,
    clickedTimestamp: String,
}, {timestamps: true});

mongoose.model('HappyRes', HappyResSchema);