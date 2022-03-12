const app = require("../api/app");

describe("App", () => {
  it('GET / responds with 200 containing "Hello!"', () => {
    return supertest(app).get("/").expect(200, "Hello!");
  });
});
