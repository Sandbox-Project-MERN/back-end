const supertest = require("supertest");
const app = require("../api/app");

const { TEST_ATLAS_URI } = require("../api/config");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const seedTestTables = require("./fixtures/seedTestTables");

const { JWT_SECRET, JWT_EXPIRY } = require("../api/config");

const Actions = require("./fixtures/action.fixtures");
const Content = require("./fixtures/dbcontent.fixtures");

describe("Login and Register endpoints", () => {
  before("connect to db", () => {
    mongoose.connect(TEST_ATLAS_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    const { connection } = mongoose;
    connection.once("open", () => {
      console.log("MongoDB database connected successfully");
    });
  });

  before("seed tables", () => seedTestTables(TEST_ATLAS_URI));

  beforeEach((done) => setTimeout(done, 1000));

  after("disconnect from db", () => mongoose.connection.close());

  const testUsers = Content.makeUsersArray();

  describe("POST: api/auth/login", () => {
    const requiredFields = ["email", "password"];

    requiredFields.forEach((field) => {
      const requestBody = {
        email: testUsers[0].email,
        password: testUsers[0].password,
      };

      it(`responds with 400 required error when ${field} is missing`, () => {
        delete requestBody[field];

        return supertest(app)
          .post("/api/auth/login")
          .send(requestBody)
          .expect(400, {
            message: `Missing '${field}' in request body`,
          });
      });
    });

    it(`responds with 400 'That email is not registered to any user' when login attempt with an email that is not in the database`, () => {
      const requestBody = {
        email: "unusedemail@gmail.com",
        password: testUsers[0].password,
      };

      return supertest(app)
        .post("/api/auth/login")
        .send(requestBody)
        .expect(400, {
          message: "That email is not registered to any user",
        });
    });

    it("responds 200 and JWT auth token using secret when valid credentials", () => {
      const validUserCreds = {
        email: testUsers[0].email,
        password: testUsers[0].password,
      };

      const expectedToken = jwt.sign(
        {
          user_id: testUsers[0]._id,
          name: testUsers[0].full_name,
        }, //payload
        JWT_SECRET,
        {
          subject: testUsers[0].email,
          expiresIn: JWT_EXPIRY,
          algorithm: "HS256",
        }
      );

      return supertest(app)
        .post("/api/auth/login")
        .send(validUserCreds)
        .expect(200, {
          authToken: expectedToken,
        });
    });
  });

  describe("POST: api/auth/register", () => {
    const requiredFields = ["email", "full_name", "password", "description"];

    describe("request body validation", () => {
      requiredFields.forEach((field) => {
        const requestBody = Actions.makeNewUser();

        it(`responds with 400 required error when ${field} is missing`, () => {
          delete requestBody[field];

          return supertest(app)
            .post("/api/auth/register")
            .set("Authorization", Actions.makeAuthHeader(testUsers[0]))
            .send(requestBody)
            .expect(400, {
              message: `Missing '${field}' in request body`,
            });
        });
      });

      it("responds with 400 'email already in use' when email already exists in db", () => {
        const badUserReg = Actions.makeNewUser();
        badUserReg.email = testUsers[0].email;

        return supertest(app)
          .post("/api/auth/register")
          .set("Authorization", Actions.makeAuthHeader(testUsers[0]))
          .send(badUserReg)
          .expect(400, {
            message: "email already in use",
          });
      });

      it("responds with 400 'password must be longer than 8 characters' when password is less than 8 characters", () => {
        const shortPw = Actions.makeNewUser();
        shortPw.password = "short";

        return supertest(app)
          .post("/api/auth/register")
          .set("Authorization", Actions.makeAuthHeader(testUsers[0]))
          .send(shortPw)
          .expect(400, {
            message: "password must be longer than 8 characters",
          });
      });

      it("responds with 400 'password must be shorter than 72 characters' when password more than 72 characters", () => {
        const longPw = Actions.makeNewUser();
        longPw.password = "*".repeat(73);

        return supertest(app)
          .post("/api/auth/register")
          .set("Authorization", Actions.makeAuthHeader(testUsers[0]))
          .send(longPw)
          .expect(400, {
            message: "password must be less than 72 characters",
          });
      });

      it("responds with 400 'password must not start or end with empty spaces' when password has spaces at beginning or end", () => {
        const spaceyPw = Actions.makeNewUser();
        spaceyPw.password = " aP@ssw0rd!";

        return supertest(app)
          .post("/api/auth/register")
          .set("Authorization", Actions.makeAuthHeader(testUsers[0]))
          .send(spaceyPw)
          .expect(400, {
            message: "password must not start or end with empty spaces",
          })
          .then(() => {
            spaceyPw.password = "aP@ssw0rd! ";
            return supertest(app)
              .post("/api/auth/register")
              .set("Authorization", Actions.makeAuthHeader(testUsers[0]))
              .send(spaceyPw)
              .expect(400, {
                message: "password must not start or end with empty spaces",
              });
          });
      });
    });

    describe("successful registration", () => {
      it("when valid credentials responds with 201, creates new user in users_table by checking if we can login with that user information", () => {
        const newUser = Actions.makeNewUser();

        return supertest(app)
          .post("/api/auth/register")
          .set("Authorization", Actions.makeAuthHeader(testUsers[0]))
          .send(newUser)
          .expect(201)
          .then(() => {
            return supertest(app)
              .post("/api/auth/login")
              .send(newUser)
              .expect(200);
          });
      });
    });
  });
});
