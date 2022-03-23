const express = require("express");
const router = express.Router({mergeParams: true});
const client = require("../config/redisClient");

//Get data sorted (ascending/descending)
router.get("/", async (req, res) => {
    const sorted = parseInt(req.query.sorted); // 0 => ascending; 1 => descending
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);

    if (sorted == 0) { //ascending
        client.zrangebyscore(`authors`, from, to)
        .then(function (result) {
            return res.send(result)});
    }
    else if (sorted == 1) { //descending
        client.zrevrangebyscore(`authors`, to, from)
        .then(function (result) {
            return res.send(result)});
    }
});


//Add a new element
router.post("/", async (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const date = req.body.date;

    client.zadd(`authors`, date, name+" "+surname);
    client.zrange(`authors`, 0, -1, "WITHSCORES", function (err, data) {
        return res.send(data);
    })
});


//Delete an element
router.delete("/", async (req, res) => {
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);

    client.zremrangebyscore(`authors`, from, to);
    client.zrange(`authors`, 0, -1, "WITHSCORES")
    .then(function (result) {
        return res.send(result);
    })
});

module.exports = router;
