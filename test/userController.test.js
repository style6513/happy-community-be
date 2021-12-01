process.env.NODE_ENV = "test";
const expect = require("expect");
const db = require("./testCommon");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config");

let testData = {};

describe("/users", () => {
  before(async () => {
    await User.deleteMany({});
  });
  after(async () => {
    mongoose.disconnect();
  });
  it("should connect and disconnect to mongodb", async () => {
    // console.log(mongoose.connection.states);
    mongoose.disconnect();
    mongoose.connection.on("disconnected", () => {
      expect(mongoose.connection.readyState).to.equal(0);
    });
    mongoose.connection.on("connected", () => {
      expect(mongoose.connection.readyState).to.equal(1);
    });
    mongoose.connection.on("error", () => {
      expect(mongoose.connection.readyState).to.equal(99);
    });

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
});

// beforeAll(async () =>{
//   await db.connect()
//   const res  = await db.testDataSetup();
//   testData = { ...res }
//   console.log(testData)
// });

// describe("PUT users/:id", () => {
//   test("works for admin", async () => {
//     const res = await request(app).put(`/users/${testData.testUser._id}`).send({
//       username : "change to this"
//     })
//     .set("authorization", `Bearer ${testData.adminToken}`)
//     expect(res.body.updatedUser).toEqual({
//       username: 'change to this',
//       password: 'testpw',
//       email: 'test@test.com',
//       phone: "213-111-2222",
//       isAdmin: false,
//       _id: expect.any(String),
//       createdAt: expect.any(String),
//       updatedAt: expect.any(String),
//       followers : [],
//       followings : [],
//       profilePicture : "",
//       __v: 0
//     })
//   })

//   test("works for valid users", async () => {
//     const res = await request(app).put(`/users/${testData.testUser._id}`).send({
//       username : "newOne"
//     })
//     .set("authorization", `Bearer ${testData.testUserToken}`);
//     expect(res.body.updatedUser.username).toEqual("newOne")
//   });

//   test("Unauth for invalid users", async () => {
//     const invalidUserToken = db.createToken({ id : 123456, isAdmin : false });
//     const res = await request(app).put(`/users/${testData.testUser._id}`).send({
//       username : "newOne"
//     })
//     .set("authorization", `Bearer ${invalidUserToken}`);
//     expect(res.statusCode).toEqual(401)
//   });

//   test("Unauth for anons", async () => {
//     const res = await request(app).put(`/users/${testData.testUser._id}`).send({
//       username : "newOne"
//     });
//     expect(res.statusCode).toEqual(401)
//   })
// })

// describe("DELETE /users/:id", () => {
//   test("works for admin", async () => {
//     const res = await request(app).delete(`/users/${testData.testUser._id}`).set("authorization", `Bearer ${testData.adminToken}`);
//     expect(res.body).toEqual({ deleted : expect.any(String) })
//   });
//   test("works for valid users", async () => {
//     const res = await request(app).delete(`/users/${testData.testUser._id}`).set("authorization", `Bearer ${testData.testUserToken}`);
//     expect(res.body).toEqual({ deleted : expect.any(String) })
//   });
//   test("unauth for invalid users", async () => {
//     const badjwt = db.createToken({ id : '68546546', isAdmin : false });
//     const res = await request(app).delete(`/users/${testData.testUser._id}`).set("authorization", `Bearer ${badjwt}`);
//     expect(res.statusCode).toEqual(401);
//   });
//   test("unauth for anons", async () => {
//     const res = await request(app).delete(`/users/${testData.testUser._id}`);
//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("GET /users/:id", () => {
//   test("works for admin", async () => {
//     const res = await request(app).get(`/users/${testData.adminUser._id}`).set("authorization", `Bearer ${testData.adminToken}`);
//     expect(res.body).toEqual({
//       user : {
//         _id: expect.any(String),
//         username: 'admin',
//         email: 'admin@admin.com',
//         phone: "213-111-2222",
//         isAdmin: true,
//         followers : [],
//         followings : [],
//         profilePicture : "",
//         createdAt: expect.any(String),
//         updatedAt: expect.any(String),
//         __v: 0
//       }
//     });
//   });
//   test("works for signed in users", async () => {
//     const res = await request(app).get(`/users/${testData.adminUser._id}`).set("authorization", `Bearer ${testData.testUserToken}`);
//     expect(res.body).toEqual({
//       user : {
//         _id: expect.any(String),
//         username: 'admin',
//         email: 'admin@admin.com',
//         phone: "213-111-2222",
//         isAdmin: true,
//         followers : [],
//         followings : [],
//         profilePicture : "",
//         createdAt: expect.any(String),
//         updatedAt: expect.any(String),
//         __v: 0
//       }
//     });
//   });
//   test("works for anons", async () => {
//     const res = await request(app).get(`/users/${testData.adminUser._id}`)
//     expect(res.body).toEqual({
//     user : {
//         _id: expect.any(String),
//         username: 'admin',
//         email: 'admin@admin.com',
//         phone: "213-111-2222",
//         isAdmin: true,
//         followers : [],
//         followings : [],
//         profilePicture : "",
//         createdAt: expect.any(String),
//         updatedAt: expect.any(String),
//         __v: 0
//       }
//     })
//   })
// });

// describe("GET /users/friends/:userId", () => {
//   test("works: ", async () => {
//     const res = await request(app).get("/users/friends/"+testData.adminUser._id).set("authorization", `Bearer ${testData.testUserToken}`);
//     expect(res.body).toEqual({
//       friends : []
//     });
//   });
//   test("Unauthorized for anons", async () => {
//     const res = await request(app).get("/users/friends/"+testData.adminUser._id);
//     expect(res.statusCode).toEqual(401);
//   })
// })

// describe("PUT users/:id/follow", () => {

//   test("works : follows a user if not already followings", async () => {
//     const res = await request(app).put(`/users/${testData.adminUser._id}/follow`).send({
//       userId : testData.testUser._id
//     })
//     .set("authorization", `Bearer ${testData.testUserToken}`);
//     expect(res.body).toEqual("user has been followed");
//     const verify = await User.findById(testData.adminUser._id);
//     expect(verify.followers.length).toEqual(1);
//   });
//   test("403 error if you try to follow yourself", async () => {
//     const res = await request(app).put(`/users/${testData.adminUser._id}/follow`).send({
//       userId : testData.adminUser._id
//     })
//     .set("authorization", `Bearer ${testData.adminToken}`);
//     expect(res.statusCode).toEqual(403)
//   });
//   test("403 error if you try to follow a user that you're already following", async () => {
//     await request(app).put(`/users/${testData.testUser._id}/follow`).send({
//       userId : testData.adminUser._id
//     }).set("authorization", `Bearer ${testData.testUserToken}`);
//     const res = await request(app).put(`/users/${testData.testUser._id}/follow`).send({
//       userId : testData.adminUser._id
//     }).set("authorization", `Bearer ${testData.testUserToken}`);
//   })
// })

// describe("PUT users/:id/unfollow", () => {
//   test("works: unfollows a user", async () => {
//     await User.findOneAndUpdate({ _id: testData.adminUser._id }, { $addToSet: { followers: testData.testUser._id } }, { returnOriginal: false })
//     const res = await request(app).put(`/users/${testData.adminUser._id}/unfollow`).send({ userId : testData.testUser._id }).set("authorization", `Bearer ${testData.testUserToken}`);
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toEqual("user has been unfollowed")
//   });
//   test("403 error if you try to unfollow someone that you never followed", async () => {
//     const res = await request(app)
//       .put(`/users/${testData.adminUser._id}/unfollow`)
//       .send({ userId : testData.testUser._id })
//       .set("authorization", `Bearer ${testData.testUserToken}`);
//     expect(res.statusCode).toEqual(403)
//   })
// })

// afterAll(async () => {
//   await db.clearDatabase()
//   await db.closeDatabase()
// })
