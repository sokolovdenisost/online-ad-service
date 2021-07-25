import { connection } from '../db';
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
        let msgParse: ImsgData = JSON.parse(message);
        console.log('получено сообщение ' + message);

        clients[id] = { ws: ws, data: { ...msgParse.data } };
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

function addMessagesInDB(data: IData) {
    const date = new Date().toLocaleString();
    connection.query(
        `
    INSERT INTO service.messages(message_author, message_from, message_text, message_date)
    VALUES (?, ?, ?, ?)
    `,
        [data.author, data.from, data.text, date],
        (err, result) => {
            if (err) {
                return new Error(err);
            }
        },
    );
}

interface ImsgData {
    data: {
        author: string;
        from: number;
        text: string;
        room_id?: number;
    };
}

interface IData {
    author: string;
    from: number;
    text: string;
}
