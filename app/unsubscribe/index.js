const client = require('../../redis/index.js');

const SubscribeAndUnsubscribe = async () => {
    const channel = "message";
    await client.connect();
    await client.subscribe(channel, (messageStr) => {
        const message = JSON.parse(messageStr);
        console.log("Sender: ", message.from);
        console.log("Receiver: ", message.to);
        console.log("Message: ", message.message);
        console.log("--------------------------");
    })

    let i = 0;
    const wait = 30;
    console.log("Subscribe Started, will be done 30 sec");

    const timer = setInterval(() => {
        i++;
        console.log(wait - i, 'second left');
    }, 1000);

    const waited = await new Promise((resolve, reject) => {
        setTimeout(() => {
            clearInterval(timer);
            resolve(true);
        }, wait * 1000);
    })

    if (waited === true) {
        await client.unsubscribe(channel);
        console.log("STOP SUBSCRIBING");
    }
}

SubscribeAndUnsubscribe().then(() => {
}).catch(err => {
    console.log(err);
})