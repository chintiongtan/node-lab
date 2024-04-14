import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

export default function checkRequestBody(req: Request, res: Response, next: NextFunction) {
  if (_.isEmpty(req.body)) {
    res.status(400).end();
    return;
  }

  next();
}
