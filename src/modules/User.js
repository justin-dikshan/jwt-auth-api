const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username  : {
        type : String,
        required : true,
        unique : true
    },
    password  : {
        type : String,
        required: true
    },
    refreshTokens :[String],
    accessTokens : [String],
    roles : [String]
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema)