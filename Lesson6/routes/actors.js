const express = require('express');
const router = express.Router({mergeParams: true});
const driver = require('../config/neo4jDriver');


// Get all actors
router.get('/', async (req, res) => {
  const session = driver.session();
  let result = [];
  await session
    .run(`MATCH (a:Actor) RETURN a`)
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
});


// Get an actor by ID
router.get('/:id', async (req, res) => {
const session = driver.session();
const id = parseInt(req.params.id);
let result = [];
await session
  .run(`MATCH (a:Actor) WHERE ID(a) = ${id} RETURN a`)
  .subscribe({
    onKeys: keys => {
      console.log(keys)
    },
    onNext: record => {
      console.log(record.get(`a`));
      result.push(record.get(`a`).properties);
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
});


// Add a new actor
router.post('/', async (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const company = req.body.company;
  let result = {};
  const session = driver.session();
  await session
      .run(`MERGE (a:Actor {name : "${name}", age: "${age}", company: "${company}"}) RETURN a`)
      .subscribe({
        onKeys: keys => {
          console.log(keys)
        },
        onNext: record => {
          console.log(record.get(`a`))
          result = record.get(`a`);
        },
        onCompleted: () => {
          session.close();
          return res.send(result.properties);
        },
        onError: error => {
          session.close();
          console.log(error)
        }
      })
});


// Update an actor by ID
router.put('/:id', async (req, res) => {
const name = req.body.name;
const age = req.body.age;
const company = req.body.company;
const id = parseInt(req.params.id);
let result = [];
const session = driver.session();
await session
  .run(`MATCH (a:Actor) WHERE ID(a) = ${id} SET a.name = "${name}" , a.age = "${age}" , a.company = "${company}" RETURN a`)
  .subscribe({
    onKeys: keys => {
      console.log(keys)
    },
    onNext: record => {
      console.log(record.get(`a`));
      result.push(record.get(`a`).properties);
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
});


// Delete an actor by ID
router.delete('/:id', async (req, res) => {
const session = driver.session();
const id = parseInt(req.params.id);
await session
  .run(`MATCH (a:Actor) WHERE ID(a) = ${id} DETACH DELETE a`)
  .subscribe({
    onKeys: keys => {
      console.log(keys)
    },
    onNext: record => {
      console.log("Ok");
    },
    onCompleted: () => {
      session.close();
      return res.send("Deleted.");
    },
    onError: error => {
      session.close();
      console.log(error)
    }
  })
});


//LESSON 7

// Show actors who acted in the most amount of movies
router.get('/actors/popular', async (req, res) => {
  const session = driver.session();
  try {
      const result = await session.readTransaction((tx) =>
          tx.run(`MATCH (a:Actor) - [rel: ACTED_IN]-> (b: Movie) RETURN a, COUNT(rel) AS num ORDER BY num DESC LIMIT 3`));
          
      session.close();
      return res.send(result.records);
  } catch(ex) {
      session.close();
      res.send(ex);
  }
});

module.exports = router;