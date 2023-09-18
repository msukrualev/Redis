const { request } = require("express");
const fetch = require("node-fetch");

const msArr = [];
const msCachedArr = [];

const uncachedUrl = "http://localhost/api/cached/users";
const cachedUrl = "http://localhost/api/cached/users-cached";

const fetcher = async (cached = false) => {
    const url = cached ? cachedUrl : uncachedUrl;
    const date1 = new Date();
    const response = await fetch(url);
    const json = await response.json();
    const date2 = new Date();

    const ms = date2 - date1;
    if (cached) {
        msCachedArr.push(ms);
    } else {
        msArr.push(ms);
    }
}

const average = (arr) => {
    const sum = arr.reduce((a, b) => {
        return a + b;
    }, 0);

    const length = arr.length;

    return sum / length;
}

const length = 1000;
const stopPoint = 1000;

const stop = () => {
    return new Promise((resolve, request) => {
        setTimeout(function () {
            resolve()
        })
    }, 3000)
}

const start = async () => {
    const finished = () => {
        if (msArr.length === length) {
            console.log("Finished Uncached Fetching");
            startCached().then(() => {

            }).catch((error) => {

            })
        }
    }
    for (let i = 0; i < length; i++) {
        if (i % stopPoint === 0) {
            await stop();
        }
        console.log("Fetching uncached", i + 1, "th data");
        fetcher(false).then((data) => {
            finished();
        }).catch((err) => {
            msArr.push(30000);
            finished();
        })
    }
}

const startCached = async () => {
    const finished = () => {
        if (msCachedArr.length === length) {
            console.log("Finished Uncached Fetching");
            console.log("Average of Uncached MongoDB:", average(msArr));
            console.log("Average of Cached Redis:", average(msCachedArr));
        }
    }
    for (let i = 0; i < length; i++) {
        if (i % stopPoint === 0) {
            await stop();
        }
        console.log("Fetching cached", i + 1, "th data");
        fetcher(true).then((data) => {
            finished();
        }).catch((err) => {
            msCachedArr.push(30000);
            finished();
        })
    }
}

start().then(() => {

}).catch((error) => {

})