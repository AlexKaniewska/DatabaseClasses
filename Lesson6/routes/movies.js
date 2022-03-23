const express = require('express');
const router = express.Router({mergeParams: true});
const driver = require('../config/neo4jDriver');


// Get all movies
router.get('/', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run("MATCH (m:Movie) RETURN m"));
            
        session.close();
        const respond = result.records.map(record => {
            return record.get('m');
        });
        return res.send(respond);
    } catch(ex) {
        session.close();
        res.send(ex);
    }
});


// Get a movie by ID
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`MATCH (m:Movie) WHERE ID(m) = ${id} RETURN m`));
            
        session.close();
        return res.send(result.records);
    } catch(ex) {
        session.close();
        res.send(ex);
    }
});


// Add a new movie
router.post('/', async (req, res) => {
    const session = driver.session();
    const title = req.body.title;
    const year = req.body.releaseYear;
    const genre = req.body.genre;

    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`MERGE (m:Movie {title : "${title}", releaseYear: "${year}", genre: "${genre}"}) RETURN m`));
            
        session.close();
        return res.send(result.records);
    } catch(ex) {
        session.close();
        res.send(ex);
    }
});


// Update a movie by ID
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const title = req.body.title;
    const year = req.body.releaseYear;
    const genre = req.body.genre;
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`MATCH (m:Movie) WHERE ID(m) = ${id} SET m.title = "${title}" , m.releaseYear = "${year}" , m.genre = "${genre}" RETURN m`));
            
        session.close();
        return res.send(result.records);
    } catch(ex) {
        session.close();
        res.send(ex);
    }
});

// Delete a movie by ID
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const session = driver.session();

    try {
        await session.writeTransaction((tx) =>
            tx.run(`MATCH (m:Movie) WHERE ID(m) = ${id} DETACH DELETE m`));
            
        session.close();
        return res.send("Deleted.");
    } catch(ex) {
        session.close();
        res.send(ex);
    }
});

// Create a relation actor-movie
router.post('/assign-actor', async (req, res) => {
    const id_m = req.body.idM;
    const id_a = req.body.idA;
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`MATCH (m:Movie) WHERE ID(m) = ${id_m} MATCH (a:Actor) WHERE ID(a) = ${id_a} CREATE (a) -[rel:ACTED_IN]-> (m) RETURN a, m, rel`));
            
        session.close();
        return res.send(result.records);
    } catch(ex) {
        session.close();
        res.send(ex);
    }

});


//LESSON 7

// Show actors who acted in selected movie
router.get('/:id/actors', async (req, res) => {
    const id = parseInt(req.params.id);
    const session = driver.session();
    let result = [];
    await session
      .run(`MATCH (a:Actor) - [rel: ACTED_IN]-> (b: Movie) WHERE ID(b) = ${id} RETURN a`)
      .subscribe({
        onKeys: keys => {
          console.log(keys)
        },
        onNext: records => {
          console.log(records.get(`a`));
          result.push(records.get(`a`).properties);
        },
        onCompleted: () => {
          session.close();
          return res.send(result);
        },
        onError: error => {
          session.close();
          console.log(error)
        }
      })
})

// Show actors who only acted in selected movie
router.get('/:id/distinct-actors', async (req, res) => {
    const id = parseInt(req.params.id);
    const session = driver.session();
    let result = [];
    await session
      .run(`MATCH (a:Actor) - [rel: ACTED_IN]-> (b: Movie) WITH a, COUNT(rel) as relation WHERE relation = 1  MATCH (a) - [rel: ACTED_IN]-> (c: Movie) WHERE ID(c) = ${id} RETURN a`)
      .subscribe({
        onKeys: keys => {
          console.log(keys)
        },
        onNext: records => {
          console.log(records.get(`a`));
          result.push(records.get(`a`).properties);
        },
        onCompleted: () => {
          session.close();
          return res.send(result);
        },
        onError: error => {
          session.close();
          console.log(error)
        }
      })
})

// Show actors who acted in selected movie and know selected actor (by ID)
router.get('/:id/actors/:idActor', async (req, res) => {
    const id = parseInt(req.params.id);
    const idC = parseInt(req.params.idActor);
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`MATCH (c:Actor) <-[r:IS_FRIEND_WITH]-(a:Actor) - [rel: ACTED_IN]-> (b: Movie) WHERE ID(b) = ${id} AND ID(c) = ${idC} RETURN a`));
            
        session.close();
        return res.send(result.records);
    } catch(ex) {
        session.close();
        res.send(ex);
    }
});


module.exports = router;