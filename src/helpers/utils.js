import supertest from "supertest";
import "dotenv/config";
import { expect } from "chai";

const sleep = async (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, time);
  });
};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const characters ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function generateString(length) {
    let result = "";
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export { randomIntFromInterval, sleep, generateString };
