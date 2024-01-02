import "dotenv/config";
import request from "supertest";
import { expect } from "chai";
import sluggame from "../../datajson/slugGame.json" assert { type: "json" };
import namegame from "../../datajson/nameGame.json" assert { type: "json" };
import { faker } from '@faker-js/faker/locale/en';

const endpoint = process.env.ENDPOINT;
export let gameIdOrigin = "";
export let gameIDClassic = "";
export let gameIDHomeLand = "";
export let gameIDRaylights = "";
export let gameIDDoll = "";

describe("Test Public Game API: ", function () {

  // it('Data Faker', async function () {
  //   const name = faker.person.fullName();
  //   console.log(name);
  // });
  it("Get All Published Game", async function () {
    const res = await request(endpoint).post("/v2/public/games");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.data[0]?.mode).to.be.equal("live");
    } else {
      console.log("Get All Published Game Error: \n", res.status, res.body);
    }
  });

  it("Get All Game Genres", async function () {
    const res = await request(endpoint).get("/v2/public/game-genres");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      console.log("Get All Game Genres Error: \n", res.status, res.body);
    }
  });

  it("Get All Collectibles", async function () {
    const res = await request(endpoint).get("/v2/public/collectibles");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      console.log("Get All Collectibles Error: \n", res.status, res.body);
    }
  });

  it("Get All Game Rating", async function () {
    const res = await request(endpoint).get("/v2/public/game-ratings");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      console.log("Get All Game Rating Error: \n", res.status, res.body);
    }
  });

  it("Get Game By SLug With Origins", async function () {
    const res = await request(endpoint).get("/v2/public/games/Origins");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gameorigins);
    } else {
      console.log(
        "Get Game By SLug With Origins Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game By SLug With ooriginss", async function () {
    const res = await request(endpoint).get("/v2/public/games/ooriginss");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Game not found");
    }
  });

  it("Get Game By SLug With origins", async function () {
    const res = await request(endpoint).get("/v2/public/games/origins");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gameorigins);
      console.log("ID Game Origins: ", (gameIdOrigin = res.body.id));
    } else {
      console.log(
        "Get Game By SLug With origins Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game By Slug With classic", async function () {
    const res = await request(endpoint).get("/v2/public/games/classic");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gameclassic);
      console.log("ID Game Classic: ", (gameIDClassic = res.body.id));
    } else {
      console.log(
        "Get Game By Slug With classic Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game By Slug With raylights", async function () {
    const res = await request(endpoint).get("/v2/public/games/raylights");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gameraylights);
      console.log("ID Game Raylights: ", (gameIDRaylights = res.body.id));
    } else {
      console.log(
        "Get Game By Slug With raylights Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game By Slug With doll", async function () {
    const res = await request(endpoint).get("/v2/public/games/doll");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gamedoll);
      console.log("ID Game Doll: ", (gameIDDoll = res.body.id));
    } else {
      console.log("Get Game By Slug With doll Error: \n", res.status, res.body);
    }
  });

  it("Get Game By Slug With homeland", async function () {
    const res = await request(endpoint).get("/v2/public/games/homeland");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(sluggame.gamehomeland);
      console.log("ID Game HomeLand: ", (gameIDHomeLand = res.body.id));
    } else {
      console.log(
        "Get Game By Slug With homeland Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game By ID With ID = 0", async function () {
    const res = await request(endpoint).get("/v2/public/games/0");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Game not found");
    }
  });

  it("Get Game By ID With ID Game Origin", async function () {
    const res = await request(endpoint).get("/v2/public/games/" + gameIdOrigin);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIdOrigin);
      expect(res.body.name).to.be.equal(namegame.nameorigins);
    } else {
      console.log(
        "Get Game By ID With ID Game Origin Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game By ID With ID Game Classic", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/" + gameIDClassic
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDClassic);
      expect(res.body.name).to.be.equal(namegame.nameclassic);
    } else {
      console.log(
        "Get Game By ID With ID Game Classic Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game By ID With ID Game Raylights", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/" + gameIDRaylights
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDRaylights);
      expect(res.body.name).to.be.equal(namegame.nameraylights);
    } else {
      console.log(
        "Get Game By ID With ID Game Raylights Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game By ID With ID Game Doll", async function () {
    const res = await request(endpoint).get("/v2/public/games/" + gameIDDoll);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDDoll);
      expect(res.body.name).to.be.equal(namegame.namedoll);
    } else {
      console.log(
        "Get Game By ID With ID Game Doll Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game By ID With ID Game Homeland", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/" + gameIDHomeLand
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(gameIDHomeLand);
      expect(res.body.name).to.be.equal(namegame.namehomeland);
    } else {
      console.log(
        "Get Game By ID With ID Game Homeland Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game By ID With ID Not Found", async function () {
    const res = await request(endpoint).get("/v2/public/games/100");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Game not found");
    }
  });

  it("Get Game Latest Version With ID = null ", async function () {
    const res = await request(endpoint).get("/v2/public/games/versions/latest");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.code).to.be.equal(404);
      expect(res.body.message).to.be.equal("Not Found");
    }
  });

  it("Get Game Latest Version With ID = 0 ", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/0/versions/latest"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Game not found");
    }
  });

  it("Get Game Latest Version With ID Game Origins", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/" + gameIdOrigin + "/versions/latest"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.isLatest).to.be.equal(true);
    } else {
      console.log(
        "Get Game Latest Version With ID Game Origins Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game Latest Version With ID Game Classic", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/" + gameIDClassic + "/versions/latest"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.isLatest).to.be.equal(true);
    } else {
      console.log(
        "Get Game Latest Version With ID Game Classic Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game Latest Version With ID Game Raylights", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/" + gameIDRaylights + "/versions/latest"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.isLatest).to.be.equal(true);
    } else {
      console.log(
        "Get Game Latest Version With ID Game Raylights Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game Latest Version With ID Game Doll", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/" + gameIDDoll + "/versions/latest"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.isLatest).to.be.equal(true);
    } else {
      console.log(
        "Get Game Latest Version With ID Game Doll Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game Latest Version With ID Game HomeLand", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/" + gameIDHomeLand + "/versions/latest"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.isLatest).to.be.equal(true);
    } else {
      console.log(
        "Get Game Latest Version With ID Game HomeLand Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Game Latest Version With ID Not Found", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/1000/versions/latest"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Game not found");
    }
  });

  it("Get Public Banner", async function () {
    const res = await request(endpoint).get("/v2/public/banners");
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      console.log("Get Public Banner Error: \n", res.status, res.body);
    }
  });

  it("Get Public Game With Option", async function () {
    const res = await request(endpoint)
      .post("/v2/public/games")
      .send({
        partnershipType: ["sky-mavis"],
        genre: ["strategy"],
      });
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      console.log(
        "Get Public Game With Option Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get Public Game With Option But Not Found", async function () {
    const res = await request(endpoint)
      .post("/v2/public/games")
      .send({
        partnershipType: ["sky-mavis"],
        genre: ["early-acss"],
      });
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Game not found");
    }
  });

  it("Get Public Game Patch Note With ID Game Origins", async function () {
    const res = await request(endpoint).get(
      "/v2/public/games/" + sluggame.gameorigins + "/patchnotes"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Game not found");
    }
  });

  it('Get List Games By Universe Axie Infinity', async function () {
    const res = await request(endpoint).get(
      "/v2/public/universes/axie_infinity/games"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Game not found");
    }
  });

  it('Get List Games By Universe Axie Infinity', async function () {
    const res = await request(endpoint).get(
      "/v2/public/universes/machine_arenas/games"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Game not found");
    }
  });

  it('Get List Games By Universe Axie Infinity', async function () {
    const res = await request(endpoint).get(
      "/v2/public/universes/others/games"
    );
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
    } else {
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal("Game not found");
    }
  });
});
