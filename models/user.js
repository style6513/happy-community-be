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

userSchema.plugin(uniqueValidator, { message : `{VALUE} is already taken` });
const User = mongoose.model("User", userSchema);
const testUser = new User({
    username : "testUser3",
    password : "testPassword3",
    email : "test@test3.com",
    phone : "111-111-8581"
})
testUser.save().then(doc => {
    console.log(doc);
})
.catch(err => {
    console.log(err)
})

module.exports = User; 