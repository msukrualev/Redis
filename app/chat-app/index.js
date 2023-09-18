const term = require("terminal-kit").terminal;
const mongoose = require("mongoose");
const Users = require("../../mongodb/users.js");
const client1 = require("../../redis/index.js");
const client2 = client1.duplicate();

const colors = [
    "magenta",
    "cyan",
    "yellow",
    "green",
    "red",
    "blue"
];

term.clear('');

term.on('key', (key) => {
    if (key === "CTRL_C") {
        term.clear('');
        process.exit(0);
    }
})

const color = colors[Math.floor(Math.random() * colors.length)];

const user = {
    fullName: '',
    chatRoom: '123',
    color: color
}

let client1Connected = false, client2Connected = false;

let readIncomingMessage = async () => {
    const channel = `message/${user.chatRoom}`;
    if (!client2Connected) {
        await client2.connect();
        client2Connected = true;
    }

    await client2.subscribe(channel, (messageStr) => {
        const message = JSON.parse(messageStr);
        if (message.from !== user.fullName) {
            term.deleteLine(1);
            term.previousLine(1);
            term.nextLine(1);
            term?.[message.color].bold(`${message.from}: `);
            term?.[message.color].bold("\n");
            term?.[message.color].bold(message.message);
            term?.[message.color].bold("\n");
            term?.[message.color].bold(new Date(message.sendAt).toLocaleString());
            term?.[message.color].bold("\n");
            term?.[message.color].bold("-------------------------");
            term?.[message.color].bold("\n");
            term.white("Enter your Message: ");
        }
    })
}

const sendMessage = async (messageStr) => {
    const channel = `message/${user.chatRoom}`;
    const message = {
        from: user.fullName,
        chatRoom: user.chatRoom,
        message: messageStr.trim(),
        color: user.color,
        sendAt: new Date()
    }

    if (!client1Connected) {
        await client1.connect();
        client1Connected = true;
    }

    await client1.publish(channel, JSON.stringify(message));
}

const listenForMessageSend = () => {
    return new Promise(async (resolve, reject) => {
        term.white("Enter your Message: ");
        const input = await term.inputField({
            submitKey: 'Enter'
        }).promise;
        term.deleteLine(1);
        term.previousLine(1);
        term.nextLine(1);
        term?.[user.color].bold("You:");
        term?.[user.color].bold("\n");
        term?.[user.color].bold(input);
        term?.[user.color].bold("\n");
        term?.[user.color].bold(new Date().toLocaleString());
        term?.[user.color].bold("\n");
        term?.[user.color].bold("-------------------------");
        term?.[user.color].bold("\n");

        sendMessage(input);
        resolve(input);
    })
}

const prompt = async (num = 0) => {
    if (num === 0) {
        const estimatedDocumentCount = new Users.estimatedDocumentCount();
        const randomSkip = Math.floor(Math.random() * (estimatedDocumentCount - 1));
        const loggedUser = await Users.findOne({}).skip(randomSkip).limit(1);

        term.white.bold('Logged as', " ", loggedUser.name, " ", loggedUser.surname, "\n");
        term.white.bold('You can send a message now', "\n");
        term.white.bold('--------------------------------');
        user.fullName = loggedUser.name + " " + loggedUser.surname;
    }
    const input = await listenForMessageSend();
    return await prompt(num + 1);
};

mongoose.connect("mongodb+srv://ms:FqzMjcCwllhgGG9h@redis.zfooibf.mongodb.net/production?retryWrites=true&w=majority").then(async () => {
    console.log("MongoDB Connected");
    term.deleteLine(1);
    term.clear('');
    term.white('Chat Room Ready');
    term.white('\n');
    prompt();
    //await client.connect();
    // mongodbConnected = true;
    // RedisUsersCacheWorker().then((res) => {
    //     if (res) {
    //         console.log("Users are synchronize with Redis Cache System");
    //     }
    // }).catch((err) => {
    //     console.log(err);
    // })

    // console.log("ExampleDataFormation Started");
    // await ExampleDataFormation();
}).catch(err => {
    console.log(err);
})

readIncomingMessage().then(() => {

}).catch((err) => {
    console.log(err);
})