const express = require('express');
const app = express();
app.use(express.json());


// Get all data
app.get('/bands', async (req, res) => {
  client.query('SELECT * FROM band', (err, result) => {
    if(err) {
      return res.send({error: err.message});
    }
    else {
      const message = {toInsert: result.rows};
      return res.send(message)
    }
  });
});


// Add records to the database
app.post('/bands', async (req, res) => {
  let {name, creationDate} = req.body;
  client.query('INSERT INTO band(name, creationDate) VALUES ($1, $2)', [name, creationDate], (err, result) => {
    if(err) {
      return res.send({error: err.message});
    }
    else {
      return res.send(result.id);
    }
  });  
});


// Get data about a band with a given name
app.get('/bands/:bandName', async (req, res) => {
  let name = req.params.bandName;
  client.query('SELECT * FROM band WHERE name = $1', [name], (err, result) => {
    if(err) {
      console.log(err.stack)
      return res.send({error: err.message});
    }
    else {
      console.log(result.rows);
      return res.send(result.rows);
    }
  });
});


// Delete a record by ID
app.delete('/bands/:id', async (req, res) => {
  let id = req.params.id;
  client.query('DELETE FROM band WHERE id = $1', [id], (err, result) => {
    if(err){
      console.log(err.stack)
      return res.send({error: err.message});
    }
    else {
      const message2 = {
        toDelete: id
      }
      return res.send(message2)
    }
  });
});


// Update a record by ID
app.put('/bands/:id', async (req, res) => {
  let id = req.params.id;
  let {name,  creationDate} = req.body;
  client.query('UPDATE band SET name = $1, creationDate = $2 WHERE id = $3',[name, creationDate, id],
    (err, result) => {
      if(err){
        console.log(err.stack)
        return res.send({error: err.message});
      }
      else {
        const message3 = {
          toPut: result.rows
        }
        return res.send(message3);
      }
    });
});




//require('dotenv').config();
const dbConnData = {
    host: process.env.PGHOST || '127.0.0.1',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'postgres',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || "tajne"
};


const { Client } = require('pg');
const client = new Client(dbConnData);
console.log('Connection parameters: ');
console.log(dbConnData);
client
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    const port = process.env.PORT || 5000
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(err => console.error('Connection error', err.stack));
