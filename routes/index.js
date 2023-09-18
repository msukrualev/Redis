const TestRouterFn = require("./test.js");
const RedisRouterFn = require("./redis.js");
const CachedRouterFn = require("./cached.js");

const RouterArrFns = [
    TestRouterFn,
    RedisRouterFn,
    CachedRouterFn
];

module.exports = RouterArrFns;