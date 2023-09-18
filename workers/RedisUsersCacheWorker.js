const mongoose = require("mongoose");
const Users = require("../mongodb/users.js");
const client = require("../redis/index.js");
const { request } = require("express");
const { Batch } = require("mongodb");

const stopForMs = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve()
        }, ms)
    })
}

const RedisUsersCacheWorker = async (page = 0, batch = 50) => {
    const users = await Users.find({}).skip(page * batch).limit(batch).lean();
    if (users.length === 0) {
        return true;
    }

    console.log("Page: ", page + 1, "Batch of ", batch, " is adding to the cache");
    await client.set(`users/${page + 1}/${batch}`, JSON.stringify(users), {
        EX: 3600,
        NX: true,
        KEEPTTL: true
    });

    await stopForMs(1000);
    return await RedisUsersCacheWorker(page + 1, batch);
}

module.exports = RedisUsersCacheWorker;