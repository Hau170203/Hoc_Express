const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: ""
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema,'user');
module.exports = User;