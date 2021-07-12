import { Router } from 'express';
const {
    createAd,
    getAd,
    getAllAds,
    toggleFavoriteAd,
    getFavoriteAll,
    getAllFavoriteAds,
    deleteAdById,
    editAdById,
} = require('../controllers/ads');
const router = Router();

router.get('/all', async (req, res) => getAllAds(req, res));
router.get('/:id', async (req, res) => getAd(req, res));
router.get('/favorites/:id', async (req, res) => getAllFavoriteAds(req, res));
router.get('/edit/:id', async (req, res) => getAd(req, res));

router.post('/create', async (req, res) => createAd(req, res));
router.post('/favorite', async (req, res) => toggleFavoriteAd(req, res));
router.post('/favorites', async (req, res) => getFavoriteAll(req, res));
router.post('/delete/:id', async (req, res) => deleteAdById(req, res));
router.post('/edit/:id', async (req, res) => editAdById(req, res));

module.exports = router;
