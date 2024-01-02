import request from "supertest";
import "dotenv/config";
import { expect } from "chai";
import sha256 from "crypto-js/sha256.js";
import fs from "fs";
// login console SM ADMIN
const endpoint = process.env.ENDPOINT;
let tokenConsole = {};
let refreshTokenConsole = "";
let userIDConsole = "";
let slugOrg = "";
const loginEmailConsole = process.env.EMAILCONSOLE;
const pwdEmailConsole = process.env.PASSWORDCONSOLE;
const sha256HashConsole = sha256(pwdEmailConsole).toString();
const userIDOrgAdmin = process.env.USERIDORGADMIN;
const userIDGameAdmin = process.env.USERIDGAMEADMIN;

describe("Remove Member: ", function () {
  it("Read Data From File", async function () {
    fs.readFile("slugorg.txt", "utf8", (err, dataorg) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Slug Org: ", dataorg);
      slugOrg = dataorg
    });
  });

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
      console.log("Error Login: ", res.body);
      expect(res.body.errorCode).to.be.equal("AUTH_ERROR");
      expect(res.body.message).to.be.equal("Your email or password is wrong");
      return false;
    }
  });
  
  it("Remove Org Admin In Organization", async function () {
    const res = await request(endpoint)
      .delete("/v1/console/users")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        userId: userIDOrgAdmin,
      });
    expect(res.status).to.be.equal(200);
  });

  it("Remove Game Admin In Organization", async function () {
    const res = await request(endpoint)
      .delete("/v1/console/users")
      .set("Authorization", "Bearer " + tokenConsole)
      .send({
        userId: userIDGameAdmin,
      });
    expect(res.status).to.be.equal(200);
  });

  it("Get List Member In Organization", async function () {
    const res = await request(endpoint)
      .get(
        "/v1/console/organizations/" +
          slugOrg +
          "/users?pageSize=20&page=1&orderBy=user_id&desc=false"
      )
      .set("Authorization", "Bearer " + tokenConsole);
    expect(res.status).to.be.equal(404);
    expect(res.body.message).to.be.equal("User not found");
  });
});
