const { DB_CONFIG } = require('./CONST');

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database,
    port: DB_CONFIG.port,
});

connection.connect((err) => {
    if (err) {
        return console.error('Ошибка: ' + err.message);
    } else {
        console.log('Подключение к серверу MySQL успешно установлено');
    }
});

export { connection };
