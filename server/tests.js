const assert = require('assert');
const mocha = require('mocha')
const app = require("./index");
const testData = require("./testData.js")
const supertest = require("supertest");

//mocha tests.js to run

describe("testing-server-routes", () => {

  it("GET /listCountries - success", function(done) {
    supertest(app).get("/api/listCountries")
      .expect(testData.countries)
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
  });

  it("POST /listCities - success", function(done) {
    supertest(app).post("/api/listCities")
      .send({country: "US"})
      .expect(testData.usCities)
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
  });

  it("POST /queryCity - success", function(done) {
    supertest(app).post("/api/queryCity")
      .send({city: "Seattle"})
      .expect((res) => { 
        console.log(res)
        assert(res.body.data.name == "Seattle") })
      .end(done);
  });

});