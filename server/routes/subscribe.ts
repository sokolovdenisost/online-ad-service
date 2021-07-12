import { Router } from 'express';
const { getSubscribersById, toggleSubscribe } = require('../controllers/subscribe');
const router = Router();

router.get('/:id', async (req, res) => getSubscribersById(req, res));
router.post('/toggle', async (req, res) => toggleSubscribe(req, res));

module.exports = router;
