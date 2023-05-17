"use strict";


const request = require("supertest");
const app = require("../app");

const shipItApi = require("../shipItApi");
const shipmentsRoutes = require("./shipments");
shipItApi.shipProduct = jest.fn();


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("throws error if empty request body", async function () {
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
    
    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

});