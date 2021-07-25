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
const express_1 = require("express");
const router = express_1.Router();
const { changePassword, changePersonalDate } = require('../controllers/settings');
router.post('/change-password', (req, res) => __awaiter(this, void 0, void 0, function* () { return changePassword(req, res); }));
router.post('/change-personal', (req, res) => __awaiter(this, void 0, void 0, function* () { return changePersonalDate(req, res); }));
module.exports = router;
//# sourceMappingURL=settings.js.map