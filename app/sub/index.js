const client = require('../../redis/index.js');

const Subscriber = async () => {
    const channel = "message";
    await client.connect();
    await client.subscribe(channel, (messageStr) => {
        const message = JSON.parse(messageStr);
        console.log("Sender: ", message.from);
        console.log("Receiver: ", message.to);
        console.log("Message: ", message.message);
        console.log("--------------------------");
    });
}

Subscriber().then(() => {
    console.log("Subscribe Started");
}).catch(err => {
    console.log(err);
})