"use strict";

const shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("throws error if validation fails", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({});
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error).toEqual({
      "message": [
        "instance requires property \"productId\"",
        "instance requires property \"name\"",
        "instance requires property \"addr\"",
        "instance requires property \"zip\""
      ],
      "status": 400
    })
  });

  test("mock shipProduct function", async function () {
    shipItApi.shipProduct.mockReturnValue(1234);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 1234 });
  });
});