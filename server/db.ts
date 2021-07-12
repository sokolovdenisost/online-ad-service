const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '29891969Вв',
    database: 'service',
});

connection.connect((err) => {
    if (err) {
        return console.error('Ошибка: ' + err.message);
    } else {
        console.log('Подключение к серверу MySQL успешно установлено');
    }
});

export { connection };
