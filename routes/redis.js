const { route } = require("express/lib/router");
const client = require("../redis/index.js");

module.exports = (router) => {
    /* TEST */
    router.get('/redis/test', async (req, res) => {
        res.json({
            message: 'Welcome to Redis Router'
        })
    })

    /* STRING */
    router.get('/redis/string', async (req, res) => {
        const KEY = 'string';
        let value = await client.get(KEY);
        if (!value) {
            console.log('Veri yazılıyor');
            const val = "Hello World :)";
            const write = await client.set(KEY, val);
            if (write === 'OK') {
                value = val;
            }
        }
        res.json({
            message: 'Redis String',
            value: value
        })
    })

    /* HASH */
    router.get('/redis/hash', async (req, res) => {
        const KEY = "hash";
        let value = await client.hGetAll(KEY);

        if (Object.keys(value).length === 0) {
            console.log("Veri yaziliyor..");
            await client.hSet(KEY, 'name', 'Mehmet Sungur');
            await client.hSet(KEY, 'age', 32);
            await client.hSet(KEY, 'phoneNumber', "456-785-67-86");
        }

        res.json({
            message: 'Redis Hash',
            value: value
        })
    })

    /* LIST */
    router.get('/redis/list', async (req, res) => {
        const KEY = "list";
        //await client.lPush(KEY, ['Mehmet', 'Sungur']);
        //await client.lInsert(KEY, 'BEFORE', 'Mehmet', 'Kara')
        //await client.lInsert(KEY, 'AFTER', 'Mehmet', 'Gamze')
        //await client.rPush(KEY, 'Muhittin')
        //await client.rPop(KEY)
        //await client.lPop(KEY)

        // const dropLeft = await client.lPopCount(KEY, 1);
        // console.log(dropLeft);

        // const dropRight = await client.rPopCount(KEY, 1);
        // console.log(dropRight);

        await client.lRem(KEY, 2, 'Muhittin');

        const value = await client.lRange(KEY, 0, -1);

        res.json({
            message: 'Welcome to List',
            value: value
        })
    })

    /* SET */
    router.get('/redis/set', async (req, res) => {
        const KEY = 'set';
        const value = await client.sMembers(KEY);
        if (value.length === 0) {
            console.log("Veri yaziliyor ..");
            await client.sAdd(KEY, [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
                'Monday'
            ])
        }
        res.json({
            message: 'REDIS SET',
            value: value
        })
    });

    /* ZSET (SORTED SETS) */
    router.get('/redis/sortedsets', async (req, res) => {
        const KEY = 'sorted-set';
        await client.zAdd(KEY, [
            {
                score: 4,
                value: "Mehmet"
            },
            {
                score: 2,
                value: "Sungur"
            },
            {
                score: 1,
                value: "Demir"
            },
            {
                score: 3,
                value: "Kerim"
            }
        ])
        const value = await client.zRange(KEY, 0, -1);
        res.json({
            message: 'REDIS SORTEDSET',
            value: value
        })
    })

    /* JSON */
    router.get('/redis/json', async (req, res) => {
        const KEY = "json";
        let value = await client.json.get(KEY);

        if (!value) {
            console.log('Veri yaziliyor..');
            const val = {
                name: 'Mehmet Sungur',
                age: 32,
                phoneNumber: '456-456-12-90',
                address: {
                    street: '123 Golden Beach',
                    city: 'Miami',
                    state: 'California'
                }
            }

            const write = await client.json.set(KEY, '$', val);

            if (write === 'OK') {
                value = val
            }
        }

        res.json({
            message: 'REDIS JSON',
            value: value
        })
    })

    /* DELETION */
    router.get('/redis/deletion', async (req, res) => {
        let KEY = 'string';
        await client.del(KEY);

        KEY = 'hash';
        await client.del(KEY);

        KEY = 'list';
        await client.del(KEY);

        KEY = 'set';
        await client.del(KEY);

        KEY = 'sorted-set';
        await client.del(KEY);

        KEY = 'json';
        await client.json.del(KEY, '$');

        res.json({
            message: 'DELETE ALL'
        })
    })
}