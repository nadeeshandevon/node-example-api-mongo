import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";
import { CustomerModel } from "../src/models/customerModel";

jest.setTimeout(120000);

describe("Customers API", () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
      binary: { version: "6.0.14" },
    });
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongo) {
      await mongo.stop();
    }
  });

  beforeEach(async () => {
    await CustomerModel.deleteMany({});
  });

  it("creates and fetches a customer", async () => {
    const createRes = await request(app)
      .post("/customers")
      .send({ firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", phone: "123" })
      .expect(201);

    const id = createRes.body.id;
    expect(id).toBeDefined();

    const getRes = await request(app).get(`/customers/${id}`).expect(200);
    expect(getRes.body).toMatchObject({
      id,
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      phone: "123",
    });
  });

  it("lists customers", async () => {
    await CustomerModel.create([
      { firstName: "One", lastName: "User", email: "one@example.com" },
      { firstName: "Two", lastName: "User", email: "two@example.com" },
    ]);

    const res = await request(app).get("/customers").expect(200);
    expect(res.body.length).toBe(2);
    const emails = res.body.map((c: any) => c.email).sort();
    expect(emails).toEqual(["one@example.com", "two@example.com"]);
  });

  it("updates a customer", async () => {
    const created = await CustomerModel.create({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
    });

    const res = await request(app)
      .put(`/customers/${created.id}`)
      .send({ phone: "555-1111" })
      .expect(200);

    expect(res.body.phone).toBe("555-1111");
  });

  it("returns 404 for missing customer", async () => {
    await request(app).get("/customers/nonexistent").expect(404);
  });

  it("deletes a customer", async () => {
    const created = await CustomerModel.create({
      firstName: "To",
      lastName: "Delete",
      email: "delete@example.com",
    });

    await request(app).delete(`/customers/${created.id}`).expect(204);
    await request(app).get(`/customers/${created.id}`).expect(404);
  });
});

