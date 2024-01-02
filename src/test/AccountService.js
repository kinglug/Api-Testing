import request from "supertest";
import "dotenv/config";
import { expect } from "chai";
import { randomIntFromInterval, sleep } from "../helpers/utils.js";
import sha256 from "crypto-js/sha256.js";
import getEmails, { imap } from "../helpers/index.js";
import { linkVerify } from "../helpers/index.js";
import { en } from "@faker-js/faker";

// login account service
const endpointAS = process.env.ENDPOINTAS;
const registerWithEmail = process.env.EMAILREGISTER;
const pwdEmail = process.env.PASSWORD;
export const loginEmail = process.env.EMAIL;
const sha256Hash = sha256(pwdEmail).toString();


const randomNumberEmailRegister = randomIntFromInterval(100, 10000000000);
const randomNumberSecondEmailResgister = randomIntFromInterval(100,1000000);
export const emailRegister = registerWithEmail + "+" + randomNumberEmailRegister + randomNumberSecondEmailResgister + "@gmail.com";
export var token = {};
export var refreshToken = "";
export var userID = "";

export var tokenConsole = {};
export var refreshTokenConsole = "";
export var userIDConsole = "";

describe("Register Account", function () {
  // it("Register With Email", async function () {
  //   const res = await request(endpointASRegister)
  //     .post("/v2/public/auth/register")
  //     .send({
  //       email: emailRegister,
  //       password: sha256Hash,
  //       challenge: "",
  //     });
  //   if (res.statusCode == 201) {
  //     expect(res.status).to.be.equal(201);
  //     expect(res.body.code).to.be.equal("201");
  //     expect(res.body.success).to.be.equal(true);
  //     await sleep(10000);
  //     return true;
  //   } else {
  //     console.log(res.body);
  //     await sleep(10000);
  //     return false;
  //   }
  // });

  // it("Verify Email", async function () {
  //   await sleep(10000);
  //   await getEmails();
  //   await sleep(10000);
  //   console.log("Link Verify Email After Register: " + linkVerify);
  //   console.log("Email After Register: " + emailRegister);
  //   const res = await request(linkVerify).get("");
  //   expect(res.status).to.be.equal(301);
  //   await sleep(10000);
  // });

  it("Login User", async function () {
    const res = await request(endpointAS).post("/v2/public/auth/login").send({
      email: loginEmail,
      password: sha256Hash,
    });
    if (res.statusCode == 200) {
      expect(res.body.accessToken).not.to.be.null;
      console.log("Email Login: " + loginEmail);
      console.log("AccessToken After Login Success: ",(token = res.body.accessToken));
      console.log("RefreshToken After Login Success: ",(refreshToken = res.body.refreshToken));
      console.log("UserID After Login Success: ",(userID = res.body.userID));
      return true;
    } else {
      console.log(res.body);
      expect(res.body.error_status).to.be.equal("ERR_WRONG_EMAIL_OR_PASSWORD");
      expect(res.body.error_message).to.be.equal(
        "Your email or password is wrong"
      );
      return false;
    }
  });
});
