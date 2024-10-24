const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        default: 0
    }
},{
    timestamps: true
});

const forgotPassword = mongoose.model('forgotPassword', forgotPasswordSchema,'forgotPassword');
module.exports = forgotPassword;