import { compare, hash } from 'bcrypt';

import prisma from '../../../client';

async function createUser(email: string, password: string) {
  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  await prisma.$disconnect();
  return user;
}

async function getUserByEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });
  await prisma.$disconnect();

  return user;
}

async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
    },
  });
  await prisma.$disconnect();

  return user;
}

async function validatePassword(password: string, hashedPassword: string) {
  const validPassword = await compare(password, hashedPassword);
  return validPassword;
}

export { createUser, getUserByEmail, getUserById, validatePassword };
