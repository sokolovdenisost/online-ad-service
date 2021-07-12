const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const ws = require('ws');
const cors = require('cors');
const path = require('path');
const app = express();
const fileupload = require('express-fileupload');
const url = require('url');

const { webSocketServer } = require('./controllers/websocket');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const adsRouter = require('./routes/ads');
const settingsRouter = require('./routes/settings');
const messageRouter = require('./routes/chat');
const subscribeRouter = require('./routes/subscribe');

app.use(fileupload({ useTempFiles: true }));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
express.static(path.join(__dirname, '/public'));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/ads', adsRouter);
app.use('/settings', settingsRouter);
app.use('/subscribe', subscribeRouter);
// TODO
app.use('/chat', messageRouter);

const start: Function = () => {
    try {
        app.listen(3001, () => {
            console.log('Сервер запущен на порту ' + 3001);
        });
    } catch (error) {
        console.log('[Error]: ' + error);
    }
};

start();

export { express };
