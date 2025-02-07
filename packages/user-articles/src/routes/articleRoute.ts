import express from 'express';
import { create, list } from '../controllers/articleController';
import checkSessionToken from '../middlewares/checkSessionToken';
import validateSchema from '../middlewares/validateSchema';
import { createArticleRequestSchema } from '../schemas/request/article';

const router = express.Router();

router.post(
  '/',
  [checkSessionToken, validateSchema(createArticleRequestSchema)],
  create,
);

router.get('/', list);

export default router;
