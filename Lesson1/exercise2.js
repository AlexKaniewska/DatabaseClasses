const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const json2csv = require('json2csv').parse;
app.use(express.json());



// Get all data to csv
app.get('/bands', async (req, res) => {
  client.query('SELECT * FROM band', (err, result) => {
    if(err) {
      return res.send({error: err.message});
    }
    else {
      const message = {toInsert: result.rows};
      const mesg = result.rows;

      for(let i = 0; i < mesg.length; i++){
        let new2 = mesg[i].creationdate.toString();
        mesg[i].year = 2021 - parseInt(new2.slice(11,15));
      }
      // data to csv

      const write = async (fileName,data) => {
    
        const filename = path.join(__dirname, 'dane', `${fileName}`);
        let rows2;
        rows2 = json2csv(data, { header: false });
        

        fs.appendFileSync(filename, rows2);
        fs.appendFileSync(filename, "\r\n");
      }
      write("dane.csv", mesg)
      return res.send(message)
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
