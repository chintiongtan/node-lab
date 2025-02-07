import express from 'express';
import { login, logout } from '../controllers/authController';
import authorized from '../middlewares/authorized';
import validateSchema from '../middlewares/validateSchema';
import { loginRequestSchema } from '../schemas/request/auth';

const router = express.Router();

router.post('/', [validateSchema(loginRequestSchema)], login);

router.post('/logout', [authorized], logout);

export default router;
