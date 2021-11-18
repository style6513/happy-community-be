const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "cant't be blank"],
        match : [/^[a-zA-Z0-9]+$/, 'is invalid'],
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        unique : true
    },
    phone: {
        type: Number,
        required: true
    },
    isAdmin : {
        type : Boolean,
    }
},{timestamps: true,});

module.exports = mongoose.model('User',userSchema);