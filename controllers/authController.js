const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require("bcryptjs");
const { UnauthorizedError, BadRequestError } = require('../ExpressError');
const { BCRYPT_WORK_FACTOR, SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const jsonschema = require("jsonschema");
const userRegisterSchema = require("../validationSchema/userRegisterSchema.json");

function createToken(user) {
    let payload = {
        id: user._id,
        isAdmin: user.isAdmin || false
    };
    return jwt.sign(payload, SECRET, { expiresIn: "3d" })
};

// REGISTER
router.post("/register", async (req, res, next) => {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
        const errors = validator.errors.map(e => e.stack);
        return next(new BadRequestError(errors))
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
        const token = createToken(savedUser);
        const { password, ...others } = savedUser._doc;
        return res.status(201).json({ ...others, token });
    } catch (e) {
        return next(e);
    }
})

// Login 
router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(new UnauthorizedError()) 

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (isValid) {
            const accessToken = createToken(user);
            const { password, ...others } = user._doc;
            return res.status(200).json({ ...others, accessToken })
        }
        throw new UnauthorizedError("Invalid credentials")
    } catch (e) {
        return next(e);
    }
})

module.exports = router;