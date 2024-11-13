import mysql from 'mysql2';
import fs from 'fs'; // To read the SSL certificate files (if required)

export const db = mysql.createConnection({
  host: 'mysql-187ab79d-anikmitraxd-6cbd.d.aivencloud.com',
  port: 22011,
  user: 'avnadmin',
  password: 'AVNS_ivEpjT5axfaDzo-UCIN', // Your password here
  database: 'defaultdb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
  }
});
