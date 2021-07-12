import { Router } from 'express';
const router = Router();
const { registerUser, loginUser, authUser, logoutUser } = require('../controllers/auth');

router.post('/register', async (req, res) => registerUser(req, res));
router.post('/login', async (req, res) => loginUser(req, res));
router.get('/auth', async (req, res) => authUser(req, res));
router.get('/logout', async (req, res) => logoutUser(req, res));

module.exports = router;
