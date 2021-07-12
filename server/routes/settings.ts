import { Router } from 'express';
const router = Router();
const { changePassword, changePersonalDate } = require('../controllers/settings');

router.post('/change-password', async (req, res) => changePassword(req, res));
router.post('/change-personal', async (req, res) => changePersonalDate(req, res));

module.exports = router;
