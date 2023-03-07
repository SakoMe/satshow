import { DatabaseConnectionError } from '@kythera/common';
import jwt from 'jsonwebtoken';
import request from 'supertest';

import app from '../app';
import prisma from '../client';

declare global {
  function getAuthCookie(): Promise<string[]>;
  function setAuthCookie(): string[];
}

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  try {
    await prisma.$connect();
  } catch (err) {
    throw new DatabaseConnectionError('Test DB connection error');
  }
});

beforeEach(async () => {
  await prisma.terminalConnectivity.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.serviceSegmentGroup.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

afterEach(async () => {
  await prisma.terminalConnectivity.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.serviceSegmentGroup.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

afterAll(async () => {
  await prisma.terminalConnectivity.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.serviceSegmentGroup.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

global.getAuthCookie = async () => {
  const credentials = { email: 'test@mail.com', password: 'hello123' };

  const response = await request(app).post('/api/v1/users/signup').send(credentials);

  return response.get('Set-Cookie');
};

global.setAuthCookie = () => {
  const payload = {
    id: 1,
    email: 'test@test.com',
  };

  let userToken;
  if (process.env.JWT_KEY) {
    userToken = jwt.sign(payload, process.env.JWT_KEY);
  }
  const session = { jwt: userToken };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
};
