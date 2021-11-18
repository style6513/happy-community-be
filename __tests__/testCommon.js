const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MONGODB_URI } = require("../config");
let mongod = MongoMemoryServer

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
         console.log(e);
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
   console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");
   let payload = {
      id: user._id,
      isAdmin: user.isAdmin || false
   };
   return jwt.sign(payload, SECRET, { expiresIn: "3d" })
};

