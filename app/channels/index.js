const e = require("express");
const client = require("../../redis/index.js");

const ReadChannels = async () => {
    await client.connect();
    const channels = await client.pubSubChannels();

    console.log("-------------------------");
    console.log(channels);
    console.log(0);
}

ReadChannels().then(() => {
    console.log("CHANNELS STARTED");
}).catch((err) => {
    console.log(err);
})