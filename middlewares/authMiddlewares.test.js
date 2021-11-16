const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const { authenticateJWT,
   ensureLoggedIn,
   ensureAdmin,
   ensureCorrectUserOrAdmin } = require("./authMiddlewares");

const { UnauthorizedError } = require("../ExpressError");
const testJWT = jwt.sign({ id: 12345, isAdmin: false }, SECRET);
const badJWT = jwt.sign({ id: 123456, isAdmin: false }, "BAD");

describe("authenticateJWT", () => {
   test("works: via header:", () => {
      expect.assertions(2);
      const req = { headers: { authorization: `Bearer ${testJWT}` } }
      const res = { locals: {} };
      const next = function (err) {
         expect(err).toBeFalsy();
      };
      authenticateJWT(req, res, next);
      expect(res.locals).toEqual({
         user: {
            iat: expect.any(Number),
            id: 12345,
            isAdmin: false
         }
      })
   });

   test("works: no header", () => {
      expect.assertions(2);
      const req = {};
      const res = { locals: {} };
      const next = function (err) {
         expect(err).toBeFalsy();
      }
      authenticateJWT(req, res, next);
      expect(res.locals).toEqual({});
   });

   test("works: invalid token", () => {
      expect.assertions(2);
      const req = { headers: { authorization: `Bearer ${badJWT}` } };
      const res = { locals: {} };
      const next = function (err) {
         expect(err).toBeFalsy();
      }
      authenticateJWT(req, res, next);
      expect(res.locals).toEqual({});
   });

});

describe("ensureLoggedIn", () => {
   test("works", () => {
      expect.assertions(1);
      const req = {};
      const res = { locals: { user: { id: 12345, isAdmin: false } } };
      const next = function (err) {
         expect(err).toBeFalsy();
      }
      ensureLoggedIn(req, res, next);
   });
   test("unauth if no login", () => {
      expect.assertions(1);
      const req = {};
      const res = { locals: {} };
      const next = err => {
         expect(err instanceof UnauthorizedError).toBeTruthy()
      };
      ensureLoggedIn(req, res, next);
   })
});

describe("ensureAdmin", () => {
   test("works", () => {
      expect.assertions(1);
      const req = {};
      const res = { locals: { user: { id: 12345, isAdmin: true } } }
      const next = e => {
         expect(e).toBeFalsy();
      }
      ensureAdmin(req, res, next)
   });
   test("unauth if not admin", () => {
      expect.assertions(1);
      const req = {};
      const res = { locals: { user: { id: 12345, isAdmin: false } } };
      const next = e => {
         expect(e instanceof UnauthorizedError).toBeTruthy();
      }
      ensureAdmin(req, res, next)
   });
   test("unauth if anon", () => {
      expect.assertions(1);
      const req = {};
      const res = { locals: {} };
      const next = e => {
         expect(e instanceof UnauthorizedError).toBeTruthy();
      }
      ensureAdmin(req, res, next)
   });
})

describe("ensureCorrectUserOrAdmin", () => {
  test("works: admin", () => {
    expect.assertions(1);
    const req = { params: { id:  12345} };
    const res = { locals: { user: { id: 1111, isAdmin: true } } };
    const next = (err) => {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("works: same user", () => {
    expect.assertions(1);
    const req = { params: { id: 12345 } };
    const res = { locals: { user: { id: 12345, isAdmin: false } } };
    const next = (e) => {
      expect(e).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("unauth: mismatch", () => {
    expect.assertions(1);
    const req = { params: { id: 1} };
    const res = { locals: { user: { id: 2, isAdmin: false } } };
    const next = (e) => {
      expect(e instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("unauth: anons", () => {
    expect.assertions(1);
    const req = { params: { id: "test" } };
    const res = { locals: {} };
    const next = (e) => {
      expect(e instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next)
  });
});
