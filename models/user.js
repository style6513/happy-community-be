const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const userSchema = new mongoose.Schema({
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
        type: String,
        validate : {
            validator : function(val) {
                return /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(val);
            },
            message : props => `${props.value} is not a valid phone number`
        },
        required : [true, "can't be blank"],
        
    },
    isAdmin : {
        type : Boolean,
    }
},{timestamps: true,});

userSchema.plugin(uniqueValidator, { message : "is already taken" });

module.exports = mongoose.model('User',userSchema);