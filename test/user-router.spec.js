const supertest = require("supertest");
const app = require("../api/app");

const { TEST_ATLAS_URI } = require("../api/config");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const seedTestTables = require("./fixtures/seedTestTables");

const { JWT_SECRET, JWT_EXPIRY } = require("../api/config");

const Actions = require("./fixtures/action.fixtures");
const Content = require("./fixtures/dbcontent.fixtures");

describe("User Router", () => {
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

  //   describe("POST: api/auth/login", () => {
  //     // it("responds 200 and JWT auth token using secret when valid credentials", () => {
  //     //   const validUserCreds = {
  //     //     email: testUsers[0].email,
  //     //     password: testUsers[0].password,
  //     //   };
  //     //   const expectedToken = jwt.sign(
  //     //     {
  //     //       user_id: testUsers[0]._id,
  //     //       name: testUsers[0].full_name,
  //     //     }, //payload
  //     //     JWT_SECRET,
  //     //     {
  //     //       subject: testUsers[0].email,
  //     //       expiresIn: JWT_EXPIRY,
  //     //       algorithm: "HS256",
  //     //     }
  //     //   );
  //     //   return supertest(app)
  //     //     .post("/api/auth/login")
  //     //     .send(validUserCreds)
  //     //     .expect(200, {
  //     //       authToken: expectedToken,
  //     //     });
  //     // });
  //   });

  describe("GET: api/user/", () => {
    it(`responds with 401 error when auth header is missing`, () => {
      return supertest(app).get("/api/user/").expect(401, {
        message: `Missing bearer token`,
      });
    });

    it(`responds with all users, each user object should mirror : {_id, email, full_name, description}`, () => {
      return supertest(app)
        .get("/api/user/")
        .set("Authorization", Actions.makeAuthHeader(testUsers[0]))
        .expect((response) => {
          response.body.forEach((userObj) => {
            expect(userObj).to.have.keys([
              "_id",
              "email",
              "full_name",
              "description",
            ]);
          });
        });
    });
  });
});
