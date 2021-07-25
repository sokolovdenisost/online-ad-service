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
const { createAd, getAd, getAllAds, toggleFavoriteAd, getFavoriteAll, getAllFavoriteAds, deleteAdById, editAdById, } = require('../controllers/ads');
const router = express_1.Router();
router.get('/all', (req, res) => __awaiter(this, void 0, void 0, function* () { return getAllAds(req, res); }));
router.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { return getAd(req, res); }));
router.get('/favorites/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { return getAllFavoriteAds(req, res); }));
router.get('/edit/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { return getAd(req, res); }));
router.post('/create', (req, res) => __awaiter(this, void 0, void 0, function* () { return createAd(req, res); }));
router.post('/favorite', (req, res) => __awaiter(this, void 0, void 0, function* () { return toggleFavoriteAd(req, res); }));
router.post('/favorites', (req, res) => __awaiter(this, void 0, void 0, function* () { return getFavoriteAll(req, res); }));
router.post('/delete/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { return deleteAdById(req, res); }));
router.post('/edit/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { return editAdById(req, res); }));
module.exports = router;
//# sourceMappingURL=ads.js.map