export const wsConnection = new WebSocket('ws://localhost:8000/chat/message');

wsConnection.addEventListener('open', function (event: Event) {
    console.log('Соединение установлено.');
});

wsConnection.addEventListener('close', function (event: CloseEvent) {
    if (event.wasClean) {
        console.log('Соединение закрыто чисто');
    } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
    }
    console.log('Код: ' + event.code + ' причина: ' + event.reason);
});

wsConnection.addEventListener('error', function (event: Event) {
    console.log('Ошибка ' + event);
});

export const wsSend = function (data: IDataMessage) {
    // readyState - true, если есть подключение
    if (!wsConnection.readyState) {
        setTimeout(function () {
            wsSend(data);
        }, 100);
    } else {
        wsConnection.send(JSON.stringify({ data }));
    }
};

export const wsGet = function (state: any, setState: any) {
    wsConnection.onmessage = function (event) {
        const incomingMessage = JSON.parse(event.data);
        const message = {
            message_author: incomingMessage.data.author,
            message_from: incomingMessage.data.from,
            message_text: incomingMessage.data.text,
            message_date: incomingMessage.data.date,
        };
        setState([...state, message]);
    };
};

interface IDataMessage {
    author: string | null;
    from: number;
    text?: string;
    room_id: number;
    date?: string;
}
