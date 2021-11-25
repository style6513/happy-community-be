const mongoose = require('mongoose');
mongoose.set("debug", true);
mongoose.Promise = Promise;
const { MONGODB_URI } = require("../config");
// const DB_URL = process.env.DB_URL || 'mongodb://localhost/appname'

// Error / Disconnection
mongoose.connection.on('error', err => console.log(err.message + ' is Mongod not running?'));
mongoose.connection.on('disconnected', () => console.log('mongo disconnected DB: ' + MONGODB_URI));


// Connection string (we will be replacing this later with environmental variables)
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.once('open', ()=>{
    console.log('connected to mongoose... DB: '+ MONGODB_URI)
});
