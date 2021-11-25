const User = require('../models/User');
const bcrypt = require("bcryptjs");
const { ExpressError } = require('../utils/ExpressError');
const { BCRYPT_WORK_FACTOR, SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const jsonschema = require("jsonschema");
const userRegisterSchema = require("../validationSchema/userRegisterSchema.json");


exports.createToken = user => {
    let payload = {
        id: user._id,
        isAdmin: user.isAdmin || false
    };
    return jwt.sign(payload, SECRET, { expiresIn: "3d" })
}

exports.register = async (req, res, next) => {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
        const errors = validator.errors.map(e => e.stack);
        return next(new ExpressError(errors, 401))
    }
    try {
        const { username, email, phone } = req.body;
        const hashedPw = await bcrypt.hash(req.body.password, BCRYPT_WORK_FACTOR);
        const newUser = new User({
            username,
            email,
            password: hashedPw,
            phone,
            isAdmin : req.body.isAdmin || false
        });

        const savedUser = await newUser.save();
        const token = this.createToken(savedUser);
        const { password, ...others } = savedUser._doc;
        return res.status(201).json({ ...others, token });
    } catch (e) {
        return next(e);
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(new ExpressError("Invalid credentials", 401)) 

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (isValid) {
            const accessToken = this.createToken(user);
            const { password, ...others } = user._doc;
            return res.status(200).json({ ...others, accessToken })
        }
        return next(new ExpressError("Invalid credentials", 401))
    } catch (e) {
        return next(e);
    }
}
