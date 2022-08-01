//create TABLE tranings ( id SERIAL PRIMARY KEY, userID INTEGER, FOREIGN KEY (userID) REFERENCES users(id), name VARCHAR(20) NOT NULL, exercises VARCHAR[][3] )
//create TABLE users ( id INTEGER PRIMARY KEY, premium BOOLEAN , stage NUMERIC(3) )

const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = client