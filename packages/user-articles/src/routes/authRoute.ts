import express from 'express';
import { login, logout } from '../controllers/authController';
import checkSessionToken from '../middlewares/checkSessionToken';
import validateSchema from '../middlewares/validateSchema';
import { loginRequestSchema } from '../schemas/request/auth';

const router = express.Router();

router.post('/', [validateSchema(loginRequestSchema)], login);

router.post('/logout', [checkSessionToken], logout);

export default router;
