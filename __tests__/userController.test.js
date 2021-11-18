process.env.NODE_ENV = "test";
const db = require("./testCommon")
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

let testData = {};

beforeAll(async () =>{ 
  await db.connect()
  const res  = await db.testDataSetup();
  testData = { ...res }
  console.log(testData)
});
afterEach(async () => {
  await db.clearDatabase()
});

describe("PUT users/:id", () => {
  test("works for admin", async () => {
    const res = await request(app).put(`/users/${testData.testUser._id}`).send({
      username : "change to this"
    })
    .set("authorization", `Bearer ${testData.adminToken}`)
    expect(res.body.updatedUser).toEqual({
      username: 'change to this',
      password: 'testpw',
      email: 'test@test.com',
      phone: 1234567,
      isAdmin: false,
      _id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      __v: 0
    })
  })

  test("works for valid users", async () => {
    const res = await request(app).put(`/users/${testData.testUser._id}`).send({
      username : "newOne"
    })
    .set("authorization", `Bearer ${testData.testUserToken}`);
    console.log(res.body)
    // expect(res.body.updatedUser.username).toEqual("newOne")
  })
})

describe("DELETE /users/:id", () => {
  test("works for admin", async () => {
    const res = await request(app).delete(`/users/${testData.testUser._id}`).set("authorization", `Bearer ${testData.adminToken}`);
    expect(res.body).toEqual({ deleted : expect.any(String) })
  });
  test("works for valid users", async () => {
    const res = await request(app).delete(`/users/${testData.testUser._id}`).set("authorization", `Bearer ${testData.testUserToken}`);
    expect(res.body).toEqual({ deleted : expect.any(String) })
  });
  test("unauth for invalid users", async () => {
    const badjwt = db.createToken({ id : '68546546', isAdmin : false });
    const res = await request(app).delete(`/users/${testData.testUser._id}`).set("authorization", `Bearer ${badjwt}`);
    expect(res.statusCode).toEqual(401);
  });
  test("unauth for anons", async () => {
    const res = await request(app).delete(`/users/${testData.testUser._id}`);
    expect(res.statusCode).toEqual(401);
  });
});



afterAll(async () => await db.closeDatabase())