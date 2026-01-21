const { Client } = require('pg');

const passwords = ['postgres', 'admin', 'password', '1234', 'root', ''];

async function testConnection() {
  for (const password of passwords) {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres', // connect to default postgres db first
      password: password,
      port: 5432,
    });

    try {
      await client.connect();
      console.log(`SUCCESS: Connection established with password: "${password}"`);
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log(`FAILED: Password "${password}" - ${err.message}`);
    }
  }
  console.log('All common passwords failed.');
  process.exit(1);
}

testConnection();
