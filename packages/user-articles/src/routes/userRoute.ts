import express from 'express';
import { create } from '../controllers/userController';
import checkRequestBody from '../middlewares/checkRequestBody';

const router = express.Router();

router.post('/', [checkRequestBody], create);

export default router;
