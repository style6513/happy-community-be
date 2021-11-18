const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { SECRET } = require("../config");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
let mongod = MongoMemoryServer


const testDataSetup = async () => {
   const _adminUser = new User({
      username : "admin",
      password : "testpw",
      email : "admin@admin.com",
      phone : "213-111-2222",
      isAdmin : true
   });
   const _testUser = new User({
      username : "test",
      password : "testpw",
      email : "test@test.com",
      phone : "213-111-2222",
      isAdmin : false
   })
   const adminUser = await _adminUser.save();
   const adminToken = this.createToken(adminUser);
   const testUser = await _testUser.save();
   const testUserToken = this.createToken(testUser);
   return  { adminToken, testUserToken, adminUser : adminUser._doc, testUser : testUser._doc }
}


// connect to test db
module.exports.connect = async (callback) => {
   mongod = await MongoMemoryServer.create();
   const uri = mongod.getUri()

   const mongooseOpts = {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
   }
   mongoose.connection.on('error', (e) => {
      if (e.message.code === 'ETIMEDOUT') {
         mongoose.connect(uri, mongooseOpts);
      }
      console.log(e);
   });

   mongoose.connection.once('open', () => {
      console.log(`MongoDB successfully connected to ${uri}`);
      callback();
   });

}

// disconnect and close connection
module.exports.closeDatabase = async () => {
   await mongoose.connection.dropDatabase();
   await mongoose.connection.close();
   await mongod.stop();
}

// clear db, remove all data
module.exports.clearDatabase = async () => {
   const collections = mongoose.connection.collections;
   for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
   }
}

module.exports.createToken = (user) => {
   let payload = {
      id: user._id,
      isAdmin: user.isAdmin || false
   };
   return jwt.sign(payload, SECRET, { expiresIn: "3d" })
};

module.exports.testDataSetup = testDataSetup;
