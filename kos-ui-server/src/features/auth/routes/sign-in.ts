import { BadRequestError, validateRequest } from '@kythera/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { sign } from 'jsonwebtoken';

import { getUserByEmail, validatePassword } from '../services/users';

const router = Router();

router.post(
  '/users/signin',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').trim().notEmpty().withMessage('Please enter your password'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const existingUser = await getUserByEmail(email);
    if (!existingUser) throw new BadRequestError('Login failed');

    const validPassword = await validatePassword(password, existingUser.password);
    if (!validPassword) throw new BadRequestError('Login failed');

    const payload = { id: existingUser.id, email: existingUser.email };

    if (process.env.JWT_KEY) {
      const userToken = sign(payload, process.env.JWT_KEY);
      request.session = { jwt: userToken };
    }

    const user = {
      id: existingUser.id,
      email: existingUser.email,
    };

    return response.status(200).json(user);
  },
);

export { router as signInRouter };
