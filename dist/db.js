"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '29891969Вв',
//     database: 'service',
//     port: 3306,
// });
const connection = mysql.createConnection('mysql://root:29891969Вв@localhost/service');
exports.connection = connection;
connection.connect((err) => {
    if (err) {
        return console.error('Ошибка: ' + err.message);
    }
    else {
        console.log('Подключение к серверу MySQL успешно установлено');
    }
});
//# sourceMappingURL=db.js.map