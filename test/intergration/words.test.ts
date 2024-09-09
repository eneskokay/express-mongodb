const request = require("supertest");
const app = require("../../server");
jest.setTimeout(15 * 1000);

const token = process.env.TEST_TOKEN;
// describe("GET /words/getWordsPartially", () => {
//   it("should return words with given range", async () => {
//     const specificRange = { skip: 10, limit: 20 };
//     return request(app as any)
//       .get("/words/getWordsPartially")
//       .query(specificRange)
//       .set("Authorization", `Bearer ${token}`)
//       .expect("Content-Type", /json/)
//       .expect(200)
//       .then((res: any) => {
//         expect(res.body.length).toBe(specificRange.limit);
//         expect(res.statusCode).toBe(200);
//       });
//   });
// });

// describe("GET /words/getAllCollections", () => {
//   it("should return all collections of the request sender", async () => {
//     return request(app as any)
//       .get("/words/getAllCollections")
//       .set("Authorization", `Bearer ${token}`)
//       .expect("Content-Type", /json/)
//       .then((res: any) => {
//         expect(res.statusCode).toBe(200);
//         expect(res.body.collections).toBeInstanceOf(Array);
//         // console.log("/words/getAllCollections res.body:", res.body);
//       });
//   });
// });

describe("DELETE /words/deleteCollection", () => {
  it("should delete a collection of the request sender", async () => {
    return request(app as any)
      .delete("/words/deleteCollection")
      .send({ collectionId: "614f9b3b1a7c1c001f8c8b7d" })
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .then((res: any) => {
        expect(res.statusCode).toBe(400);
        console.log("/words/deleteCollection res.body:", res.body);
      });
  });
});
