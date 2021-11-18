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
      phone: "213-111-2222",
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
    expect(res.body.updatedUser.username).toEqual("newOne")
  });

  test("Unauth for invalid users", async () => {
    const invalidUserToken = db.createToken({ id : 123456, isAdmin : false });
    const res = await request(app).put(`/users/${testData.testUser._id}`).send({
      username : "newOne"
    })
    .set("authorization", `Bearer ${invalidUserToken}`);
    expect(res.statusCode).toEqual(401)
  });

  test("Unauth for anons", async () => {
    const res = await request(app).put(`/users/${testData.testUser._id}`).send({
      username : "newOne"
    });
    expect(res.statusCode).toEqual(401)
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

describe("GET /users/:id", () => {
  test("works for admin", async () => {
    const res = await request(app).get(`/users/${testData.adminUser._id}`).set("authorization", `Bearer ${testData.adminToken}`);
    expect(res.body).toEqual({
      user : {
        _id: expect.any(String),
        username: 'admin',
        email: 'admin@admin.com',
        phone: "213-111-2222",
        isAdmin: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: 0
      }
    });
  });
  test("works for signed in users", async () => {
    const res = await request(app).get(`/users/${testData.adminUser._id}`).set("authorization", `Bearer ${testData.testUserToken}`);
    expect(res.body).toEqual({
      user : {
        _id: expect.any(String),
        username: 'admin',
        email: 'admin@admin.com',
        phone: "213-111-2222",
        isAdmin: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: 0
      }
    });
  });
  test("works for anons", async () => {
    const res = await request(app).get(`/users/${testData.adminUser._id}`)
    expect(res.body).toEqual({
    user : {
        _id: expect.any(String),
        username: 'admin',
        email: 'admin@admin.com',
        phone: "213-111-2222",
        isAdmin: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: 0
      }
    })
  })
})

afterAll(async () => {
  await db.clearDatabase()
  await db.closeDatabase()
})