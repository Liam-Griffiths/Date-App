var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  hash: String,
  salt: String,
  oneSignalIds: [{type: String}],
  bio: String,
  image: String,
  displayName: String,
  contactName: String,
  contactPhone: String,
  contactEmail: String,
  mailInterval: String,
  accessLvl: Number,
  childClients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  childAgents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image,
    oneSignalIds: this.oneSignalIds,
    displayName: this. displayName,
    contactName: this.contactName,
    contactPhone: this.contactPhone,
    contactEmail: this.contactEmail,
    accessLvl: this.accessLvl,
    mailInterval: this.mailInterval,
    childClients: this.childClients,
    childAgents: this.childAgents
  };
};

UserSchema.methods.toProfileJSONFor = function(user){
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    oneSignalIds: this.oneSignalIds,
    displayName: this. displayName,
    contactName: this.contactName,
    contactPhone: this.contactPhone,
    contactEmail: this.contactEmail,
    accessLvl: this.accessLvl,
    mailInterval: this.mailInterval,
    childClients: this.childClients,
    childAgents: this.childAgents
  };
};

UserSchema.methods.getPrivilege = function(user){
  return {
    accessLvl: this.accessLvl
  };
};

// -- One signal Player IDs
UserSchema.methods.addOneSignalId = function(id){
  if(this.oneSignalIds.indexOf(id) === -1){
    this.oneSignalIds = this.oneSignalIds.concat(id)
  }

  return this.save();
};
UserSchema.methods.removeOneSignalId = function(id){
  this.oneSignalIds.remove(id);
  return this.save();
};

mongoose.model('User', UserSchema);