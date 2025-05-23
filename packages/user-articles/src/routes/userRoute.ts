import express from 'express';
import { create } from '../controllers/userController';
import validateSchema from '../middlewares/validateSchema';
import { createUserRequestSchema } from '../schemas/api';

const router = express.Router();

router.post('/', [validateSchema(createUserRequestSchema)], create);

export default router;
