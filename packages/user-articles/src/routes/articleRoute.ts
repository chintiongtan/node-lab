import express from 'express';
import { create, list } from '../controllers/articleController';
import authorized from '../middlewares/authorized';
import validateSchema from '../middlewares/validateSchema';
import { createArticleRequestSchema } from '../schemas/api';

const router = express.Router();

router.post(
  '/',
  [authorized, validateSchema(createArticleRequestSchema)],
  create,
);

router.get('/', [authorized(false)], list);

export default router;
