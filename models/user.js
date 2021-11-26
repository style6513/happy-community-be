const crypto = require("crypto");
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
        required: true,
        select : false
    },
    passwordConfirm : {
        type : String,
        required : true,
        validate : {
            validator : function(val) {
                return this.password === val
            },
            message : "Passwords are not the same"
        }
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
    },
    role : {
        type : String,
        enum : ['user', 'moderators'],
        default : 'user'
    },
    passwordChangedAt : { type : Date},
    passwordResetToken : {type : String},
    passwordResetExpires : {type : Date}
},
    {timestamps: true}
);

// client sends some data about postimages to -> Post(/post/) 
userSchema.plugin(uniqueValidator, { message : `{VALUE} is already taken` });

userSchema.pre("save", function(next) {
    // only run this function if password was modified.
    if(!this.isModified("password")) return next();
    this.passwordConfirm = undefined;
    return next();
})

userSchema.methods.changedPasswordAfter = function(JWTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTimestamp < changedTimestamp
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digetst('hex');

    console.log({resetToken}, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return next(resetToken);
}

const User = mongoose.model("User", userSchema);


module.exports = User; 