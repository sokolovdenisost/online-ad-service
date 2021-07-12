const { Router } = require('express');
const router = Router();
const {
    sendMessage,
    createMessageRoom,
    getRoomsForId,
    getMessages,
} = require('../controllers/chat');

router.post('/add-message-room', async (req, res) => createMessageRoom(req, res));
router.post('/rooms', async (req, res) => getRoomsForId(req, res));
router.post('/get-messages', async (req, res) => getMessages(req, res));

module.exports = router;
