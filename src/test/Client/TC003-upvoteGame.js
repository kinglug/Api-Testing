import request from "supertest";
import "dotenv/config";
import { expect } from "chai";
import { token } from "../test/AccountService.js";

const endpoint = process.env.ENDPOINT;

describe("Test Upvote The Game: ", function () {
  it("Upvote The Game Many Times", async function () {
    for (let i = 0; i < 10; i++){
        const res = await request(endpoint)
        .post("/v2/users/games/origins/votes")
        .send({
          eventType: "vote_create",
          source: "",
        })
        .set("Authorization", "Bearer " + token);
  
      if (res.status === 201) {
        expect(res.status).to.be.equal(201);
      } else {
        console.log(res.status,"\n",res.body);
      }
    }
  });
});
