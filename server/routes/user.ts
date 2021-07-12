import { Router } from 'express';
const router = Router();
const { getUser } = require('../controllers/user');

router.get('/:id', async (req, res) => getUser(req, res));
// router.get('/ads', async (req, res) => getUserAds())

module.exports = router;
