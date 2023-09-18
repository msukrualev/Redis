module.exports = (router) => {
    router.get('/test', async (req, res) => {
        console.log("API Router Successful");
        res.json({
            test: "successful",
            path: '/api/test',
            createdAt: new Date().toUTCString()
        })
    })
}