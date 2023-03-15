import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export default class ConfirmPassword implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      res.status(400).json({ message: 'password is not confirmed' });
    }
    next();
  }
}
