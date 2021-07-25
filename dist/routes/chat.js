var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Router } = require('express');
const router = Router();
const { sendMessage, createMessageRoom, getRoomsForId, getMessages, } = require('../controllers/chat');
router.post('/add-message-room', (req, res) => __awaiter(this, void 0, void 0, function* () { return createMessageRoom(req, res); }));
router.post('/rooms', (req, res) => __awaiter(this, void 0, void 0, function* () { return getRoomsForId(req, res); }));
router.post('/get-messages', (req, res) => __awaiter(this, void 0, void 0, function* () { return getMessages(req, res); }));
module.exports = router;
//# sourceMappingURL=chat.js.map