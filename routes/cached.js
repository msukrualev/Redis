const client = require("../redis/index.js");

const Users = require("../mongodb/users.js");
const Messages = require("../mongodb/messages.js");

module.exports = function (router) {
    router.get('/cached/users', async (req, res) => {
        const users = await Users.find({}).limit(50).lean();
        res.json({
            message: 'Not Cached Users',
            users: users
        })
    })
    /* CACHED USERS */
    router.get('/cached/users-cached', async (req, res) => {
        const cachedKey = "users/first50";
        let users = await client.get(cachedKey);

        if (!users) {
            console.log('1');
            users = await Users.find({}).limit(50).lean();
            await client.set(cachedKey, JSON.stringify(users));
        } else {
            console.log('2');
            users = JSON.parse(users);
        }

        res.json({
            message: 'Cached Users',
            users: users
        })
    })
}

module.exports = function (router) {
    router.get('/cached/messages', async (req, res) => {
        const users = await Messages.find({}).limit(50).lean();
        res.json({
            message: 'Not Cached Messages',
            messages: messages
        })
    })

    /* ABSOLUTE TIMING */
    router.get('/cached/users-cached-absolute-expire', async (req, res) => {
        const cachedKey = 'users/expire/first50';
        let users = await client.get(cachedKey);
        if (!users) {
            users = await Users.find({}).limit(50).lean();
            await client.set(cachedKey, JSON.stringify(users), {
                EX: 3600,
                NX: true,
                KEEPTTL: true
            })
        } else {
            users = JSON.parse(users);
        }

        res.json({
            message: 'CACHED USERS WITH ABSOLUTE TIMING',
            users: users
        })
    })

    /* SLIDING TIMING */
    router.get('/cached/users-cached-sliding-expire', async (req, res) => {
        const cachedKey = 'users/expire/first50';
        let users = await client.get(cachedKey);
        if (!users) {
            users = await Users.find({}).limit(50).lean();
            await client.set(cachedKey, JSON.stringify(users), {
                EX: 3600,
                NX: true,
                KEEPTTL: true
            })
        } else {
            const GETEX_OLD = await client.ttl(cachedKey);
            console.log("Cache would have been expired in", GETEX_OLD, "seconds");
            client.expire(cachedKey, 3600).then(async () => {
                const GETEX_NEW = await client.ttl(cachedKey);
                console.log("Cache will expired in", GETEX_OLD, "seconds");
            }).catch(err => {
                console.log(err);
            })
            users.JSON.parse(users);
        }

        res.json({
            message: 'CACHED USERS WITH SLIDING TIMING',
            users: users
        })
    })

    /* NON-CACHED MESSAGES */
    router.get("/cached/messages", async (req, res) => {
        const messages = await Messages.find({}).populate(["from", "to"]).limit(50).lean();
        res.json({
            messages: "NON-CACHED MESSAGES",
            messages: messages
        })
    })

    /* CACHED MESSAGES */
    router.get("/cached/messages-cached", async (req, res) => {
        const cachedKey = "messages/1"
        let messages = await client.json.get(cachedKey);
        if (!messages) {
            console.log("Cache Adding..");
            messages = await Messages.find({}).populate(["from", "to"]).limit(50).lean();
            await client.json.set(cachedKey, '$', messages);
        }
        res.json({
            messages: "NON-CACHED MESSAGES",
            messages: messages
        })
    })
}