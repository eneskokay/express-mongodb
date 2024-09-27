import { log } from "console";

const request = require("supertest");
const app = require("../../server");

jest.setTimeout(15 * 1000);
const token = process.env.TEST_TOKEN;

const specificRange = { skip: 10, limit: 20 };
describe("GET /words/getWordsPartially", () => {
  it("should return words with given range", async () => {
    return request(app as any)
      .get("/words/getWordsPartially")
      .set("Authorization", `Bearer ${token}`)
      .query(specificRange)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res: any) => {
        expect(res.body.length).toBe(specificRange.limit);
        expect(res.statusCode).toBe(200);
      });
  });
});

describe("GET /words/getAllCollections", () => {
  it("should return all collections of the request sender", async () => {
    return request(app as any)
      .get("/words/getAllCollections")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .then((res: any) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.collections).toBeInstanceOf(Array);
      });
  });
});

let createdCollectionId = "";
describe("POST /words/createCollection", () => {
  it("should create a collection for the request sender", async () => {
    return request(app as any)
      .post("/words/createCollection")
      .send({ collectionName: "test" })
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .then((res: any) => {
        console.log("createCollection", res);
        expect(res.body.collectionId);
        createdCollectionId = res.body.collectionId;
        expect(res.statusCode).toBe(200);
        console.log("create collection", res.body);
      });
  });
});

describe("DELETE /words/deleteCollection", () => {
  it("should delete a collection of the request sender", async () => {
    return request(app as any)
      .delete("/words/deleteCollection")
      .send({ _id: createdCollectionId })
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .then((res: any) => {
        console.log("delete collection", res.body);
        expect(res.statusCode).toBe(200);
      });
  });
});
