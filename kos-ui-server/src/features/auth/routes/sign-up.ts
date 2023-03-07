import { BadRequestError, validateRequest } from '@kythera/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { sign } from 'jsonwebtoken';

import { createUser, getUserByEmail } from '../services/users';

const router = Router();

router.post(
  '/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) throw new BadRequestError('Email in use');

    const newUser = await createUser(email, password);

    const payload = { id: newUser.id, email: newUser.email };

    if (process.env.JWT_KEY) {
      const userToken = sign(payload, process.env.JWT_KEY);
      request.session = { jwt: userToken };
    }

    const user = {
      id: newUser.id,
      email: newUser.email,
    };

    return response.status(201).json(user);
  },
);

export { router as signUpRouter };
