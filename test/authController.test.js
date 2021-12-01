process.env.NODE_ENV = "test";
const db = require("./testCommon")
const request = require("supertest");
const app = require("../app");


beforeAll(async () => await db.connect())
// afterEach()


describe("POST /auth/register", () => {
   test("works: adds admin", async () => {
      const res = await request(app).post(`/auth/register`).send({
         "username": "admin",
         "password": "testpw",
         "confirmPassword": "testpw",
         "email": "test@test.com",
         "phone": "213-111-2222",
         "isAdmin": true
      });
      expect(res.body).toEqual({
         username: 'admin',
         email: 'test@test.com',
         phone: "213-111-2222",
         _id: expect.any(String),
         createdAt: expect.any(String),
         updatedAt: expect.any(String),
         __v: 0,
         isAdmin: true,
         token: expect.any(String)
      })
   })
   test("works: ", async () => {
      const res = await request(app).post(`/auth/register`).send({
         "username": "test3",
         "password": "testpw",
         "confirmPassword": "testpw",
         "email": "test@test.com",
         "phone": "213-111-2222",
         "isAdmin": false
      });
      expect(res.body).toEqual({
         username: 'test3',
         email: 'test@test.com',
         phone: "213-111-2222",
         _id: expect.any(String),
         createdAt: expect.any(String),
         updatedAt: expect.any(String),
         __v: 0,
         token: expect.any(String),
         isAdmin: false
      })
   });

   test("Badrequest Error for invalid data", async () => {
      const res = await request(app).post(`/auth/register`).send({
         "password": "testpw",
         "confirmPassword": "testpw",
         "phone": "213-111-2222",
         "isAdmin": false
      });
      expect(res.statusCode).toBe(400)
   });

   test("Badrequest error for duplicate fields that are required to be unique", async () => {
      await request(app).post("/auth/register").send({
         "username": "test3",
         "password": "testpw",
         "confirmPassword": "testpw",
         "email": "test@test.com",
         "phone": "213-111-2222",
         "isAdmin": false
      });
      try {
         await request(app).post("/auth/register").send({
            "username": "test3",
            "password": "testpw",
            "confirmPassword": "testpw",
            "email": "test@test.com",
            "phone": "213-111-2222",
            "isAdmin": false
         });
      } catch (e) {
         expect(e instanceof Error).toBeTruthy()
      }
   });
});

afterAll(async () => {
   await db.clearDatabase()
   await db.closeDatabase()
})