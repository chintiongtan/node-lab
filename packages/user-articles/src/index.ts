'use strict';

import express from 'express';
import articleRouter from './routes/articleRoute';
import authRouter from './routes/authRoute';
import userRouter from './routes/userRoute';

const app = express();
app.use(express.json());

// Your code starts here.
// Placeholders for all requests are provided for your convenience.

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/articles', articleRouter);

exports.module = app.listen(process.env.HTTP_PORT || 3000);
