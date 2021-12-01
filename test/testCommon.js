const mongoose = require("mongoose");
const { MONGODB_URI, SECRET } = require("../config");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  let payload = {
    id: user._id,
    isAdmin: user.isAdmin || false,
  };
  return jwt.sign(payload, SECRET, { expiresIn: "3d" });
};

const testDataSetup = async () => {
  const _adminUser = new User({
    username: "admin",
    password: "testpw",
    passwordConfirm: "testpw",
    email: "admin@admin.com",
    phone: "213-111-2222",
    isAdmin: true,
  });
  const _testUser = new User({
    username: "test",
    password: "testpw",
    passwordConfirm: "testpw",
    email: "test@test.com",
    phone: "213-111-2222",
    isAdmin: false,
  });
  const adminUser = await _adminUser.save();
  const adminToken = createToken(adminUser);
  const testUser = await _testUser.save();
  const testUserToken = createToken(testUser);
  return {
    adminToken,
    testUserToken,
    adminUser: adminUser._doc,
    testUser: testUser._doc,
  };
};

function dbconnect() {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  return mongoose.connection;
}

function dbclose() {
  return mongoose.disconnect();
}

const basicSetup = () => {
  before((done) => {
    dbconnect()
      .once("open", () => done())
      .on("error", (error) => done(error));
  });
  beforeEach((done) => {
    mongoose.connection.db
      .listCollections()
      .toArray()
      .next((error, collections) => {
        if (collections) {
          collections.forEach((collection) => {
            mongoose.connection.db
              .dropCollection(collection.name)
              .then(() => done())
              .catch((err) => done(err));
          });
        } else {
          done(error);
        }
      });
  });

  after((done) => {
    dbclose()
      .then(() => done())
      .catch((err) => done(err));
  });
};

module.exports = basicSetup;
