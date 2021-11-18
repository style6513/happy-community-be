require('dotenv').config();
const SECRET = process.env.SECRET_KEY || 'prodKey';
const PORT = process.env.PORT || 9000;
const DEVELOPMENT_DB = process.env.DATABASE_URL || "mongodb://localhost/appname";

const MONGODB_URI = process.env.NODE_ENV === "test" ?  'mongodb://localhost/appname_test' : DEVELOPMENT_DB;
const BCRYPT_WORK_FACTOR =  process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
   SECRET,
   PORT,
   DEVELOPMENT_DB,
   MONGODB_URI,
   BCRYPT_WORK_FACTOR
};