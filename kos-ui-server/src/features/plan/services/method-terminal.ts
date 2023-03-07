import { MethodTerminal, Prisma } from '@prisma/client';

import prisma from '../../../client';

export async function createManyMethodTerminals(methodTeminalsDTO: MethodTerminal[]) {
  const newTerminals = await prisma.$transaction(
    methodTeminalsDTO.map((terminal) =>
      prisma.methodTerminal.create({
        data: {
          ...terminal,
          method_terminals:
            terminal.method_terminals !== null
              ? terminal.method_terminals
              : Prisma.JsonNull,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return newTerminals;
}

export async function updateManyMethodTerminals(methodTeminalsDTO: MethodTerminal[]) {
  const updatedTerminals = await prisma.$transaction(
    methodTeminalsDTO.map((terminal) =>
      prisma.methodTerminal.update({
        where: { id: terminal.id },
        data: {
          ...terminal,
          method_terminals:
            terminal.method_terminals !== null
              ? terminal.method_terminals
              : Prisma.JsonNull,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return updatedTerminals;
}

export async function deleteManyMethodTerminals(methodTeminalsDTO: MethodTerminal[]) {
  const deletedTerminals = await prisma.$transaction(
    methodTeminalsDTO.map((terminal) =>
      prisma.methodTerminal.delete({
        where: { id: terminal.id },
      }),
    ),
  );
  await prisma.$disconnect();
  return deletedTerminals;
}

export async function createMethodTerminal(methodTeminalDTO: MethodTerminal) {
  const newTerminal = await prisma.methodTerminal.create({
    data: {
      ...methodTeminalDTO,
      method_terminals:
        methodTeminalDTO.method_terminals !== null
          ? methodTeminalDTO.method_terminals
          : Prisma.JsonNull,
    },
  });

  await prisma.$disconnect();
  return newTerminal;
}

export async function updateMethodTerminal(id: number, methodTeminalDTO: MethodTerminal) {
  const updatedTerminal = await prisma.methodTerminal.update({
    where: { id },
    data: {
      ...methodTeminalDTO,
      method_terminals:
        methodTeminalDTO.method_terminals !== null
          ? methodTeminalDTO.method_terminals
          : Prisma.JsonNull,
    },
  });

  await prisma.$disconnect();
  return updatedTerminal;
}

export async function deleteMethodTerminal(id: number) {
  const deletedTerminal = await prisma.methodTerminal.delete({
    where: { id },
  });

  await prisma.$disconnect();
  return deletedTerminal;
}
