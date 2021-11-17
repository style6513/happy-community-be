require('./db/db')
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const appnameController = require('./controllers/appnameController');
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 9000
const whitelist = ["http://localhost:3000"]
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) != -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/appname',appnameController);
app.use('/auth',authController);


app.listen(PORT, () => {
    console.log(`project is running on port ${PORT}`)
})