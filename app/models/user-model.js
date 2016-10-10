var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    favorites:{
        type: Array
    }
  
});

//generate hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('User', UserSchema);

module.exports = User;