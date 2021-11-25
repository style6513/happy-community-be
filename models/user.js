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
        unique : true,
        trim : true,
    },
    phone: {
        type: String,
        validate :  {
            validator : function(val) {
                return /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(val);
            },
            message : `{VALUE} is not a valid phone number`,
        },
        trim : true,
        required : [true, "can't be blank"]
    },
    profilePicture : {
      type : String,
      default : "",
      trim : true
    },
    followers : [{ type : mongoose.Schema.Types.ObjectId, ref : "User" }],
    followings : [{ type : mongoose.Schema.Types.ObjectId, ref : "User" }],
    isAdmin : {
        type : Boolean,
        default : false
    }
},
    {timestamps: true}
);

// client sends some data about postimages to -> Post(/post/) 
userSchema.plugin(uniqueValidator, { message : `{VALUE} is already taken` });
const User = mongoose.model("User", userSchema);
module.exports = User; 