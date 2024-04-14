import express from 'express';
import { create, list } from '../controllers/articleController';
import checkRequestBody from '../middlewares/checkRequestBody';
import checkSessionToken from '../middlewares/checkSessionToken';

const router = express.Router();

router.post('/', [checkRequestBody, checkSessionToken], create);

router.get('/', list);

export default router;
