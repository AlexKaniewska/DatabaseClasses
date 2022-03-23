const express = require("express");
const router = express.Router({mergeParams: true});
const client = require("../config/redisClient");


// Get all games
router.get("/", async (req, res) => {
    let talia = [];
    client.keys('game:*', function (err, keys) {
        if(keys){
            Promise.all(keys.map(key => 
                client.smembers(key, function (error, value) {      
                    let gra = {}
                    gra['id'] = key;
                    gra['value'] = value;
                    talia.push(gra);
                }
            ))).then((result) => {return res.send(talia)})
        }
    });
});


// Deal the right amount of cards for the chosen number of people
router.get("/:id", async (req, res) => {
    const players = parseInt(req.query.players);
    const cards = parseInt(req.query.cards);
    let karty = [];
    const id = req.params.id;
    
    const number = cards*players;
    client.spop(`game:${id}:deck:${id}`, number, function (err, data) {
        for (let i=0; i < players; i++){
            let set = {};
            set['player'] = i +1;
            set['karty'] = data.slice(i*cards, ((i*cards)+parseInt(cards)));
            karty.push(set);
        }
        return res.send({karty});
    })
});


// Add a new record with deck (game)
router.post("/", async (req, res) => {
    const id = req.body.id;
    const data = (req.body.data).split(",");
    client.sadd(`game:${id}`, data)
    
    client.smembers(`game:${id}`, function (err, data) {
        return res.send(data);
    })
});


// Add a copied game-deck
router.post("/new-game", async (req, res) => {
    const id = req.body.id;
    client.sunionstore(`game:${id}:deck:${id}`, `game:${id}`)

    return res.send(id);
    //client.smembers(`game:${id}:deck:${id}`, function(err, data) {
        //return res.send(data);
    //})

});

module.exports = router;
