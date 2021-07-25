"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const WebSocketServer = require('ws');
const webSocketServerChat = new WebSocketServer.Server({
    port: 8000,
    path: '/chat/message',
});
const clients = {};
webSocketServerChat.on('connection', function (ws, data) {
    var id = String(Math.random());
    console.log('новое соединение ' + id);
    ws.on('message', function (message) {
        let msgParse = JSON.parse(message);
        console.log('получено сообщение ' + message);
        clients[id] = { ws: ws, data: Object.assign({}, msgParse.data) };
        if (msgParse.data.text) {
            if (msgParse.data.text.trim()) {
                for (let key in clients) {
                    if (clients[key].data.from) {
                        if (clients[key].data.room_id === msgParse.data.room_id) {
                            clients[key].ws.send(message);
                        }
                    }
                }
            }
            addMessagesInDB(msgParse.data);
        }
    });
    ws.on('close', function () {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });
});
function addMessagesInDB(data) {
    const date = new Date().toLocaleString();
    db_1.connection.query(`
    INSERT INTO service.messages(message_author, message_from, message_text, message_date)
    VALUES (?, ?, ?, ?)
    `, [data.author, data.from, data.text, date], (err, result) => {
        if (err) {
            return new Error(err);
        }
    });
}
//# sourceMappingURL=websocket.js.map