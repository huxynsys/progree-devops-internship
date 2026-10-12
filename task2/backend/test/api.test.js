const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../src/app");

test("GET /api should return API status", async () => {
  const response = await request(app)
    .get("/api")
    .expect(200);

  assert.strictEqual(
    response.body.message,
    "Progree DevOps API is running"
  );
});