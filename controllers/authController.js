const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require("bcryptjs");
const { UnauthorizedError } = require('../ExpressError');
const { BCRYPT_WORK_FACTOR, SECRET } = require("../config");
const jwt = require("jsonwebtoken");

function createToken(user) {
    console.assert(user.isAdmin !== undefined,
        "createToken passed user without isAdmin property");
    let payload = {
        id: user._id,
        isAdmin: user.isAdmin || false
    };
    return jwt.sign(payload, SECRET, { expiresIn: "3d" })
};

// REGISTER
router.post("/register", async (req, res, next) => {
    const { username, email, password, phone } = req.body;
    const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const newUser = new User({
        username,
        email,
        password: hashedPw,
        phone
    });
    try {
        const savedUser = await newUser.save();
        const token = createToken(savedUser);
        const { password, ...others } = savedUser;
        return res.status(201).json({ ...others, token });
    } catch (e) {
        return next(e);
    }
})

// Login 
router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) throw new UnauthorizedError();

        const isValid = await bcrypt.compare(password, user.password);
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