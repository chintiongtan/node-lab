import express from 'express';
import { login, logout } from '../controllers/authController';
import checkRequestBody from '../middlewares/checkRequestBody';
import checkSessionToken from '../middlewares/checkSessionToken';

const router = express.Router();

router.post('/', [checkRequestBody], login);

router.post('/logout', [checkSessionToken], logout);

export default router;
