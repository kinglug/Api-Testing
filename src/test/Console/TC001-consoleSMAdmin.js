import request from "supertest";
import "dotenv/config";
import { expect } from "chai";
import { randomIntFromInterval, generateString } from "../../helpers/utils.js";
import sha256 from "crypto-js/sha256.js";
import fs from "fs";

// login console SM ADMIN
const endpoint = process.env.ENDPOINT;
let tokenConsole = {};
let refreshTokenConsole = "";
let userIDConsole = "";
const loginEmailConsole = process.env.EMAILCONSOLE;
const pwdEmailConsole = process.env.PASSWORDCONSOLE;
const sha256HashConsole = sha256(pwdEmailConsole).toString();

// Create new organization information
const randomNumberNameOrg = randomIntFromInterval(10, 100000);
const nameOrg = "QA Test " + randomNumberNameOrg;
const nameSlug = "QATest" + generateString(5);
const emailOrgAdmin = process.env.EMAILORGADMIN;
const emailGameAdmin = process.env.EMAILGAMEADMIN;
const emailGamePlayer = process.env.EMAILGAMEPLAYER;
let logoURL = "";
let idOrg = "";
let slugOrg = "";
let idGame = "";
let slugGame = "";
let versionGame = "";
let userIDAddPlayer = "";

describe("Test console role SM Admin: ", function () {
  it("Login User Console With Role SM-Admin", async function () {
    const res = await request(endpoint).post("/v2/auth/login").send({
      email: loginEmailConsole,
      password: sha256HashConsole,
      isConsole: true,
    });
    if (res.statusCode == 200) {
      expect(res.body.accessToken).not.to.be.null;
      console.log("Email Login: " + loginEmailConsole);
      console.log(
        "AccessToken After Login Success: ",
        (tokenConsole = res.body.accessToken)
      );
      console.log(
        "RefreshToken After Login Success: ",
        (refreshTokenConsole = res.body.refreshToken)
      );
      console.log(
        "UserID After Login Success: ",
        (userIDConsole = res.body.userID)
      );
      return true;
    } else {
      console.log("Error Login: ",res.body);
      expect(res.body.errorCode).to.be.equal("AUTH_ERROR");
      expect(res.body.message).to.be.equal("Your email or password is wrong");
      return false;
    }
  });

  it("Upload File Image", async function () {
    const res = await request(endpoint)
      .post("/v1/console/upload")
      .set("Authorization", "Bearer " + tokenConsole)
      .attach("file", "src/image/avatar-11349012.png");
    if (res.status === 201) {
      expect(res.status).to.be.equal(201);
      console.log("Upload Success: \n", (logoURL = res.body.url));
    } else {
      console.log("Upload Error: \n", res.status, res.body);
    }
  });

  it("Create New Organization", async function () {
    const res = await request(endpoint)
      .post("/v1/console/organizations")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        name: nameOrg,
        slug: nameSlug,
        partnershipType: "sky-mavis",
        logoUrl: logoURL,
      });
    if (res.status === 201) {
      expect(res.status).to.be.equal(201);
      console.log(
        "Create Organization Success With ID Org: ",
        (idOrg = res.body.id),
        (slugOrg = res.body.slug)
      );
    } else {
      console.log("Create Organization Error: \n", res.status, res.body);
    }
  });

  it("List Organization", async function () {
    const res = await request(endpoint)
      .get("/v1/console/organizations?pageSize=10&page=1&orderBy=id&desc=false")
      .set("Authorization", "Bearer " + tokenConsole);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      console.log("Total Organization: ", res.body.total);
    } else {
      console.log("List Organization Error: \n", res.status, res.body);
    }
  });

  it("Get Organization Detail With OrgID", async function () {
    const res = await request(endpoint)
      .get("/v1/console/organizations/" + idOrg)
      .set("Authorization", "Bearer " + tokenConsole);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.equal(idOrg);
    } else {
      console.log("Get Organization Detail Error: \n", res.status, res.body);
    }
  });

  it("Get Organization Detail With SlugID", async function () {
    const res = await request(endpoint)
      .get("/v1/console/organizations/" + slugOrg)
      .set("Authorization", "Bearer " + tokenConsole);
    if (res.status === 200) {
      expect(res.status).to.be.equal(200);
      expect(res.body.slug).to.be.equal(slugOrg);
    } else {
      console.log("Get Organization Detail Error: \n", res.status, res.body);
    }
  });

  it("Update Organization Detail With OrgID", async function () {
    const res = await request(endpoint)
      .patch("/v1/console/organizations/" + idOrg)
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        name: "Update Name Org " + randomNumberNameOrg,
        partnershipType: "axie-builder-program",
      });
    if (res.status === 202) {
      expect(res.status).to.be.equal(202);
      expect(res.body.id).to.be.equal(idOrg);
    } else {
      console.log("Update Organization Detail Error: \n", res.status, res.body);
    }
  });

  it("Update Organization Status False", async function () {
    const res = await request(endpoint)
      .patch("/v1/console/organizations/" + idOrg + "/status")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        active: false,
      });
    if (res.status === 202) {
      expect(res.status).to.be.equal(202);
      expect(res.body.active).to.be.equal(false);
    } else {
      console.log("Update Organization Status Error: \n", res.status, res.body);
    }
  });

  it("Update Organization Status True", async function () {
    const res = await request(endpoint)
      .patch("/v1/console/organizations/" + idOrg + "/status")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        active: true,
      });
    if (res.status === 202) {
      expect(res.status).to.be.equal(202);
      expect(res.body.active).to.be.equal(true);
    } else {
      console.log("Update Organization Status Error: \n", res.status, res.body);
    }
  });

  it("Game Quick Create", async function () {
    const res = await request(endpoint)
      .post("/v1/console/game-quick-create")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        name: "Game 1 " + randomNumberNameOrg,
        slug: nameSlug,
        thumbnailUrl: logoURL,
        platforms: [
          {
            type: "desktop",
            os: "windows",
          },
          {
            type: "desktop",
            os: "macos",
          },
        ],
        organizationId: idOrg,
        ratingId: 2,
        genres: ["early-access", "turn-based"],
      });
    if (res.status === 201) {
      expect(res.status).to.be.equal(201);
      expect(res.body.organizationId).to.be.equal(idOrg);
      idGame = res.body.id;
      slugGame = res.body.slug;
    } else {
      console.log("Game Quick Create Error: \n", res.status, res.body);
    }
  });

  it("Get List Game In Organization", async function () {
    const res = await request(endpoint)
      .get(
        "/v1/console/organizations/" +
          idOrg +
          "/games?pageSize=20&page=1&orderBy=id&desc=false"
      )
      .set("Authorization", "Bearer " + tokenConsole);
    expect(res.status).to.be.equal(200);
  });

  it("Update Game Information", async function () {
    const res = await request(endpoint)
      .patch("/v1/console/games/" + slugGame + "?section=information")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        name: "Game 1 " + randomNumberNameOrg,
        genres: ["early-access", "turn-based"],
        ratingId: 2,
        description: "update description",
        about: "update about",
        collectibles: ["0x32950db2a7164ae833121501c797d79e7b79d74c"],
      });
    expect(res.status).to.be.equal(202);
    expect(res.body.organizationId).to.be.equal(idOrg);
    expect(res.body.id).to.be.equal(idGame);
  });

  it("Update Image Required", async function () {
    const res = await request(endpoint)
      .patch("/v1/console/games/" + slugGame + "?section=images")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        logoUrl: logoURL,
        thumbnailUrl: logoURL,
        gallery: [
          {
            type: "image",
            src: logoURL,
          },
          {
            type: "image",
            src: logoURL,
          },
        ],
      });
    expect(res.status).to.be.equal(202);
    expect(res.body.organizationId).to.be.equal(idOrg);
    expect(res.body.id).to.be.equal(idGame);
  });

  it("Submit Game", async function () {
    const res = await request(endpoint)
      .patch("/v1/console/games/" + slugGame + "/state")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        state: "submit",
      });
    expect(res.status).to.be.equal(202);
    expect(res.body.organizationId).to.be.equal(idOrg);
    expect(res.body.id).to.be.equal(idGame);
  });

  it("Change Game Mode", async function () {
    const res = await request(endpoint)
      .patch("/v1/console/games/" + slugGame + "/mode")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        mode: "coming-soon",
      });
    console.log();
    expect(res.status).to.be.equal(202);
    expect(res.body.organizationId).to.be.equal(idOrg);
    expect(res.body.id).to.be.equal(idGame);
  });

  it("Create New Game Version", async function () {
    const res = await request(endpoint)
      .post("/v1/console/games/" + slugGame + "/versions")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        tag: "1.1.1",
        isLatest: true,
        patchNotes: {
          title: "1.1.1",
          thumbnailUrl: logoURL,
          brief: "new version",
          content: "new version",
        },
        resources: [
          {
            platform: "desktop",
            os: "windows",
            checksum:
              "921c79826a36f5fed0821c380149deb31e0089c55a3d75f5f7cedae93fb7baa9",
            binaryPath: "123123",
            binarySum:
              "921c79826a36f5fed0821c380149deb31e0089c55a3d75f5f7cedae93fb7baa9",
            downloadUrl: "https://translate.google.com/?hl=en&tab=TT",
            size: 2,
          },
          {
            platform: "desktop",
            os: "macos",
            checksum:
              "921c79826a36f5fed0821c380149deb31e0089c55a3d75f5f7cedae93fb7baa9",
            binaryPath: "123123",
            binarySum:
              "921c79826a36f5fed0821c380149deb31e0089c55a3d75f5f7cedae93fb7baa9",
            downloadUrl: "https://translate.google.com/?hl=en&tab=TT",
            size: 2,
          },
        ],
      });
    expect(res.status).to.be.equal(201);
    versionGame = res.body.tag;
  });

  it("Get New Version Detail", async function () {
    const res = await request(endpoint)
      .get("/v1/console/games/" + slugGame + "/versions/" + versionGame)
      .set("Authorization", "Bearer " + tokenConsole);
    expect(res.status).to.be.equal(200);
    expect(res.body.tag).to.be.equal(versionGame);
  });

  it("Approved Version Game", async function () {
    const res = await request(endpoint)
      .patch("/v1/console/games/" + slugGame + "/versions/" + versionGame)
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        state: "submit",
      });
    expect(res.status).to.be.equal(202);
    expect(res.body.tag).to.be.equal(versionGame);
    expect(res.body.state).to.be.equal("approved");
  });

  it("Published Version Game", async function () {
    const res = await request(endpoint)
      .patch("/v1/console/games/" + slugGame + "/versions/" + versionGame)
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        state: "publish",
      });
    expect(res.status).to.be.equal(202);
    expect(res.body.tag).to.be.equal(versionGame);
    expect(res.body.state).to.be.equal("published");
  });

  it("Search Player", async function () {
    const res = await request(endpoint)
      .post("/v1/console/games/" + idGame + "/search-players")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        emails: [emailGamePlayer],
      });
    userIDAddPlayer = res.body[0].userId;
    expect(res.status).to.be.equal(200);
    expect(res.body[0].status).to.be.equal("VALID");
  });

  it("Add Player", async function () {
    const res = await request(endpoint)
      .post("/v1/console/games/" + idGame + "/players")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        userIds: [userIDAddPlayer],
      });
    expect(res.status).to.be.equal(201);
  });

  it("View List Player", async function () {
    const res = await request(endpoint)
      .get(
        "/v1/console/games/" +
          slugGame +
          "/players?pageSize=20&page=1&orderBy=created_at&desc=false"
      )
      .set("Authorization", "Bearer " + tokenConsole);
    expect(res.status).to.be.equal(200);
  });

  it("Remove Player", async function () {
    const res = await request(endpoint)
      .delete("/v1/console/games/" + idGame + "/players")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        userIds: [userIDAddPlayer],
      });
    expect(res.status).to.be.equal(202);
  });

  it("View List Player After Remove", async function () {
    const res = await request(endpoint)
      .get(
        "/v1/console/games/" +
          slugGame +
          "/players?pageSize=20&page=1&orderBy=created_at&desc=false"
      )
      .set("Authorization", "Bearer " + tokenConsole);
    expect(res.status).to.be.equal(404);
    expect(res.body.message).to.be.equal("Player not found");
  });

  it("Invite Members With Role Org Admin", async function () {
    const res = await request(endpoint)
      .post("/v1/console/users")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        email: emailOrgAdmin,
        role: "organization-admin",
        organizationId: idOrg,
      });
    if (res.status === 201) {
      expect(res.status).to.be.equal(201);
      console.log();
    } else {
      console.log(
        "Invite Members With Role Org Admin Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Invite Members With Role Game Admin", async function () {
    const res = await request(endpoint)
      .post("/v1/console/users")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        email: emailGameAdmin,
        role: "game-admin",
        gameId: idGame,
        organizationId: idOrg,
      });
    if (res.status === 201) {
      expect(res.status).to.be.equal(201);
    } else {
      console.log(
        "Invite Members With Role Game Admin Error: \n",
        res.status,
        res.body
      );
    }
  });

  it("Get List Member In Organization", async function () {
    const res = await request(endpoint)
      .get(
        "/v1/console/organizations/" +
          idOrg +
          "/users?pageSize=20&page=1&orderBy=user_id&desc=false"
      )
      .set("Authorization", "Bearer " + tokenConsole);
    expect(res.status).to.be.equal(200);
  });

  it("Write Data To File", async function () {
    fs.writeFile("slugorg.txt", slugOrg, (err) => {
      if (err) throw err;
    });

    fs.writeFile("sluggame.txt", slugGame, (err) => {
      if (err) throw err;
    });

    fs.writeFile("gameversion.txt", versionGame, (err) => {
      if (err) throw err;
    });
  });
});
