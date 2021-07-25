"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
function getSubscribersById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = yield req.params;
        db_1.connection.query(`
    SELECT * FROM service.subscribers
    WHERE sub_to_id = ${id} OR sub_id = ${id}
    `, (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }
            if (!err) {
                const subId = [];
                const subToId = [];
                for (let elem of result) {
                    if (elem.sub_id === +id) {
                        subId.push(elem);
                    }
                    else if (elem.sub_to_id === +id) {
                        subToId.push(elem);
                    }
                }
                res.json({ message: 'Подписчики', subscribers: subToId, subscriptions: subId });
            }
        });
    });
}
function toggleSubscribe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sub_to_id, sub_id } = yield req.body;
        db_1.connection.query(`
        SELECT * FROM service.subscribers
        WHERE sub_id = ${sub_id} AND sub_to_id = ${sub_to_id}
    `, (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }
            console.log(result.length ? true : null);
            console.log(!result.length ? true : null);
            if (!err) {
                if (!result.length) {
                    subscribeHandler(res, sub_id, sub_to_id);
                }
                else if (result.length) {
                    unSubscribeHandler(res, sub_id, sub_to_id);
                }
            }
        });
    });
}
function subscribeHandler(res, sub_id, sub_to_id) {
    return __awaiter(this, void 0, void 0, function* () {
        db_1.connection.query(`
        INSERT INTO service.subscribers(sub_id, sub_to_id)
        VALUES(?, ?)
    `, [sub_id, sub_to_id], (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }
            if (!err) {
                res.json({ message: 'Подписались' });
            }
        });
    });
}
function unSubscribeHandler(res, sub_id, sub_to_id) {
    return __awaiter(this, void 0, void 0, function* () {
        db_1.connection.query(`
        DELETE FROM service.subscribers
        WHERE sub_id = ${sub_id} AND sub_to_id = ${sub_to_id}
    `, (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }
            if (!err) {
                res.json({ message: 'Отписались' });
            }
        });
    });
}
module.exports = {
    getSubscribersById,
    toggleSubscribe,
};
//# sourceMappingURL=subscribe.js.map