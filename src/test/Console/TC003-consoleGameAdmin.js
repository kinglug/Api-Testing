import request from "supertest";
import "dotenv/config";
import { expect } from "chai";
import sha256 from "crypto-js/sha256.js";
import fs from "fs";

let slugGame = "";
let slugOrg = "";
let versionGame = "";
// login console ORG ADMIN
const endpoint = process.env.ENDPOINT;
const loginEmailConsole = process.env.EMAILGAMEADMIN;
const pwdEmailConsole = process.env.PASSWORDCONSOLE;
const sha256HashConsole = sha256(pwdEmailConsole).toString();
const emailGamePlayer = process.env.EMAILGAMEPLAYER;
let tokenConsole = {};
let refreshTokenConsole = "";
let userIDConsole = "";
let userIDAddPlayer = "";

describe("Test console role Game Admin: ", function () {
  it("Read Data From File", async function () {
    fs.readFile("sluggame.txt", "utf8", (err, datagame) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Slug Game: ", datagame);
      slugGame = datagame;
    });

    fs.readFile("slugorg.txt", "utf8", (err, dataorg) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Slug Org: ", dataorg);
      slugOrg = dataorg
    });

    fs.readFile("gameversion.txt", "utf8", (err, gameversion) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Game Version: ", gameversion);
        versionGame = gameversion
      });
  });

  it("Login User Console With Role ORG-Admin", async function () {
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
      console.log("Error Login: ", res.body);
      expect(res.body.errorCode).to.be.equal("AUTH_ERROR");
      expect(res.body.message).to.be.equal("Your email or password is wrong");
      return false;
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

  it("Get List Member In Organization", async function () {
    const res = await request(endpoint)
      .get(
        "/v1/console/organizations/" +
          slugOrg +
          "/users?pageSize=20&page=1&orderBy=user_id&desc=false"
      )
      .set("Authorization", "Bearer " + tokenConsole);
    expect(res.status).to.be.equal(200);
  });

  it('Get Game Detail In Organization ', async function () {
    const res = await request(endpoint)
    .get("/v1/console/games/" + slugGame)
    .set("Authorization", "Bearer " + tokenConsole);
    expect(res.status).to.be.equal(200);
    expect(res.body.slug).to.be.equal(slugGame);
  });

  it("Get New Version Detail", async function () {
    const res = await request(endpoint)
      .get("/v1/console/games/" + slugGame + "/versions/" + versionGame)
      .set("Authorization", "Bearer " + tokenConsole);
    expect(res.status).to.be.equal(200);
    expect(res.body.tag).to.be.equal(versionGame);
  });

  it("Search Player", async function () {
    const res = await request(endpoint)
      .post("/v1/console/games/" + slugGame + "/search-players")
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
      .post("/v1/console/games/" + slugGame + "/players")
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
      .delete("/v1/console/games/" + slugGame + "/players")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        userIds: [userIDAddPlayer],
      });
    expect(res.status).to.be.equal(202);
  });
});
