const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require("bcryptjs");
const { UnauthorizedError } = require('../ExpressError');
const { BCRYPT_WORK_FACTOR, SECRET } = require("../config");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res, next) => {
   const { username, email, password, phone } = req.body;
   const hashedPw = await bcrypt.hash(password, 12);
   const newUser = new User({
      username,
      email,
      password: hashedPw,
      phone
   });
   try {
      const savedUser = await newUser.save();
      return res.status(201).json(savedUser);
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
         const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user._isAdmin || false
         },
            SECRET,
            { expiresIn: "3d" }
         );
         const { password, ...others } = user._doc;
         return res.status(200).json({ ...others, accessToken })
      }

   } catch (e) {
      return next(e);
   }
})

module.exports = router;