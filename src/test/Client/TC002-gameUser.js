import request from "supertest";
import "dotenv/config";
import { expect } from "chai";
import { randomIntFromInterval } from "../../helpers/utils";
import sluggame from "../datajson/slugGame.json" assert { type: "json" };
import {
  userID,
  token,
  loginEmail,
} from "../test/AccountService.js";

export let gameIdOrigin = "";
export let gameIDClassic = "";
export let gameIDHomeLand = "";
export let gameIDRaylights = "";
export let gameIDDoll = "";

const randomNumberProfileName = randomIntFromInterval(10, 1000000);
const bodyProfileUpdate = {
  name: "Test MH " + randomNumberProfileName,
};
const endpoint = process.env.ENDPOINT;

describe("Test Game User: ", function () {
  // var token = {};
  // before("Login User", async function () {
  //   const res = await request(endpointAS).post("/v2/public/auth/login").send({
  //     email: loginWithEmail,
  //     password: sha256Hash,
  //   });
  //   if (res.statusCode == 200) {
  //     expect(res.body.accessToken).not.to.be.null;
  //     console.log(
  //       "Token After Login Success: ",
  //       (token = res.body.accessToken)
  //     );
  //     return true;
  //   } else {
  //     console.log(res.body);
  //     expect(res.body.error_status).to.be.equal("ERR_WRONG_EMAIL_OR_PASSWORD");
  //     expect(res.body.error_message).to.be.equal("Your email or password is wrong");
  //     return false;
  //   }
  // });

  
  it("Get Game By SLug With origins", async function () {
    const res = await request(endpoint).get("/v2/public/games/origins");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gameorigins);
      console.log("ID Game Origins: ", (gameIdOrigin = res.body.id));
    } else {
      console.log("Get Game By SLug With origins Error: \n", res.status, res.body);
    }
  });

  it("Get Game By Slug With classic", async function () {
    const res = await request(endpoint).get("/v2/public/games/classic");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gameclassic);
      console.log("ID Game Classic: ", (gameIDClassic = res.body.id));
    } else {
      console.log("Get Game By SLug With classic Error: \n", res.status, res.body);
    }
  });

  it("Get Game By Slug With raylights", async function () {
    const res = await request(endpoint).get("/v2/public/games/raylights");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gameraylights);
      console.log("ID Game Raylights: ", (gameIDRaylights = res.body.id));
    } else {
      console.log("Get Game By SLug With raylights Error: \n", res.status, res.body);
    }
  });

  it("Get Game By Slug With doll", async function () {
    const res = await request(endpoint).get("/v2/public/games/doll");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gamedoll);
      console.log("ID Game Doll: ", (gameIDDoll = res.body.id));
    } else {
      console.log("Get Game By SLug With doll Error: \n", res.status, res.body);
    }
  });

  it("Get Game By Slug With homeland", async function () {
    const res = await request(endpoint).get("/v2/public/games/homeland");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gamehomeland);
      console.log("ID Game HomeLand: ", (gameIDHomeLand = res.body.id));
    } else {
      console.log("Get Game By SLug With homeland Error: \n", res.status, res.body);
    }
  });
  
  it("Get Profile User", async function () {
    const res = await request(endpoint)
      .get("/v2/users/profile")
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.asProfile.email).to.be.equal(loginEmail);
      expect(res.body.asProfile.userID).to.be.equal(userID);
    } else {
      console.log("Get Profile User Error: \n", res.status, res.body);
    }
  });

  it("Get Profile User No Auth", async function () {
    const res = await request(endpoint)
      .get("/v2/users/profile")
      .set("Authorization", "Bearer ");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(403);
      expect(res.body.code).to.be.equal(401002);
      expect(res.body.message).to.be.equal("Authentication failed, please check again later");
    }
  });

  it("Update Profile", async function () {
    const res = await request(endpoint)
      .patch("/v2/users/profile")
      .set("Authorization", "Bearer " + token)
      .send(bodyProfileUpdate);
    if (res.status == 202) {
      expect(res.status).to.be.equal(202);
      var nameChanged = res.body.asProfile.name;
      expect(res.body.asProfile.name).to.be.equal(nameChanged);
    } else {
      console.log("Update Profile Error: \n", res.status, res.body);
    }
  });

  it("Update Profile No Auth", async function () {
    const res = await request(endpoint)
      .patch("/v2/users/profile")
      .set("Authorization", "Bearer ")
      .send(bodyProfileUpdate);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(403);
      expect(res.body.code).to.be.equal(401002);
      expect(res.body.message).to.be.equal("Authentication failed, please check again later");
    }
  });

  it("Add Game To Lib Not Auth", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/1")
      .set("Authorization", "Bearer ");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(403);
      expect(res.body.code).to.be.equal(401002);
      expect(res.body.message).to.be.equal(
        "Authentication failed, please check again later"
      );
    }
  });

  it("Add Game To Lib With Game ID Null", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/")
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Not Found");
    }
  });

  it("Add Game To Lib With Game ID Not Found", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/1000")
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(406);
      expect(res.body.message).to.be.equal(
        "Library update failed because game not found"
      );
    }
  });

  it("Add Game To Lib With Game ID Origins", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIdOrigin)
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIdOrigin);
    } else {
      console.log("Add Game To Lib With Game ID Origins Error: \n", res.status, res.body);
    }
  });

  it("Add Game To Lib With Game ID HomeLand", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDHomeLand)
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDHomeLand);
    } else {
      console.log("Add Game To Lib With Game ID HomeLand Error: \n", res.status, res.body);
    }
  });

  it("Add Game To Lib With Game ID Classic", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDClassic)
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDClassic);
    } else {
      console.log("Add Game To Lib With Game ID Classic Error: \n", res.status, res.body);
    }
  });

  it("Add Game To Lib With Game ID Raylights", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDRaylights)
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDRaylights);
    } else {
      console.log("Add Game To Lib With Game ID Raylights Error: \n", res.status, res.body);
    }
  });

  it("Add Game To Lib With Game ID Doll", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDDoll)
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDDoll);
    } else {
      console.log("Add Game To Lib With Game ID Doll Error: \n", res.status, res.body);
    }
  });

  it("Add Game To Lib With Game ID Exist", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/1")
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(406);
      expect(res.body.message).to.be.equal(
        "Library update failed because game not found"
      );
    }
  });

  it("Get Game Lib", async function () {
    const res = await request(endpoint)
      .get("/v2/users/games")
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      console.log("Get Game Lib Error: \n", res.status, res.body);
    }
  });

  it("Get Game Lib Not Auth", async function () {
    const res = await request(endpoint)
      .get("/v2/users/games")
      .set("Authorization", "Bearer ");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(403);
      expect(res.body.code).to.be.equal(401002);
      expect(res.body.message).to.be.equal(
        "Authentication failed, please check again later"
      );
    }
  });

  it("Get Game Detail In Lib With Game ID Not Found", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/1000")
      .set("Authorization", "Bearer " + token);
    if (res.status == 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(406);
      expect(res.body.message).to.be.equal("Library update failed because game not found");
    }
  });

  it("Get Game Detail In Lib With Game ID Origins", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIdOrigin)
      .set("Authorization", "Bearer " + token);
    if (res.body === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIdOrigin);
    } else {
      console.log("Get Game Detail In Lib With Game ID Origins Error: \n", res.status, res.body);
    }
  });

  it("Get Game Detail In Lib With Game ID HomeLand", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDHomeLand)
      .set("Authorization", "Bearer " + token);
    if (res.body === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDHomeLand);
    } else {
      console.log("Get Game Detail In Lib With Game ID HomeLand Error: \n", res.status, res.body);
    }
  });

  it("Get Game Detail In Lib With Game ID Classic", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDClassic)
      .set("Authorization", "Bearer " + token);
    if (res.body === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDClassic);
    } else {
      console.log("Get Game Detail In Lib With Game ID Classic Error: \n", res.status, res.body);
    }
  });

  it("Get Game Detail In Lib With Game ID Raylights", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDRaylights)
      .set("Authorization", "Bearer " + token);
    if (res.body === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDRaylights);
    } else {
      console.log("Get Game Detail In Lib With Game ID Raylights Error: \n", res.status, res.body);
    }
  });

  it("Get Game Detail In Lib With Game ID Doll", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDDoll)
      .set("Authorization", "Bearer " + token);
    if (res.body === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDDoll);
    } else {
      console.log("Get Game Detail In Lib With Game ID Doll Error: \n", res.status, res.body);
    }
  });

  it("Get Latest Game Version With Game ID Not Found", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/1000/versions/latest")
      .set("Authorization", "Bearer " + token);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Not Found");
    }
  });

  it("Get Latest Game Version With Game ID Origins", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIdOrigin + "/versions/latest")
      .set("Authorization", "Bearer " + token);
    if (res.body === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.isLatest).to.be.equal(true);
    } else {
      console.log("Get Latest Game Version With Game ID Origins Error: \n", res.status, res.body);
    }
  });

  it("Get Latest Game Version With Game ID HomeLand", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDHomeLand + "/versions/latest")
      .set("Authorization", "Bearer " + token);
    if (res.body === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.isLatest).to.be.equal(true);
    } else {
      console.log("Get Latest Game Version With Game ID HomeLand Error: \n", res.status, res.body);
    }
  });

  it("Get Latest Game Version With Game ID Classic", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDClassic + "/versions/latest")
      .set("Authorization", "Bearer " + token);
    if (res.body === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.isLatest).to.be.equal(true);
    } else {
      console.log("Get Latest Game Version With Game ID Classic Error: \n", res.status, res.body);
    }
  });

  it("Get Latest Game Version With Game ID Raylights", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDRaylights + "/versions/latest")
      .set("Authorization", "Bearer " + token);
    if (res.body === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.isLatest).to.be.equal(true);
    } else {
      console.log("Get Latest Game Version With Game ID Raylights Error: \n", res.status, res.body);
    }
  });

  it("Get Latest Game Version With Game ID Doll", async function () {
    const res = await request(endpoint)
      .put("/v2/users/games/" + gameIDDoll + "/versions/latest")
      .set("Authorization", "Bearer " + token);
    if (res.body === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.isLatest).to.be.equal(true);
    } else {
      console.log("Get Latest Game Version With Game ID Doll Error: \n", res.status, res.body);
    }
  });
});
