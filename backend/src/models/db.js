const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,        // <-- Port-nya dipisah ke baris sendiri ya!
    user: 'root',      
    password: '',      
    database: 'axolearn_db'
});

db.connect((err) => {
    if (err) {
        console.error('Yah, gagal nyambung ke database:', err);
    } else {
        console.log('Sip! Database MySQL udah nyambung.');
    }
});

module.exports = db;