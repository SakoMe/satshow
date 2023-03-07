import { GatewayModem } from '@prisma/client';

import prisma from '../../../client';

export async function createManyGatewayModems(modemsDTO: GatewayModem[]) {
  const newGatewayModems = await prisma.$transaction(
    modemsDTO.map((modem) =>
      prisma.gatewayModem.create({
        data: {
          ...modem,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return newGatewayModems;
}

export async function updateManyGatewayModems(modemsDTO: GatewayModem[]) {
  const updatedGatewayModems = await prisma.$transaction(
    modemsDTO.map((modem) =>
      prisma.gatewayModem.update({
        where: { id: modem.id },
        data: {
          ...modem,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return updatedGatewayModems;
}

export async function deleteManyGatewayModems(modemsDTO: GatewayModem[]) {
  const deletedGatewayModems = await prisma.$transaction(
    modemsDTO.map((modem) =>
      prisma.gatewayModem.delete({
        where: { id: modem.id },
      }),
    ),
  );
  await prisma.$disconnect();
  return deletedGatewayModems;
}

export async function createGatewayModem(modemDTO: GatewayModem) {
  const newGatewayModem = await prisma.gatewayModem.create({
    data: {
      ...modemDTO,
    },
  });

  await prisma.$disconnect();
  return newGatewayModem;
}

export async function updateGatewayModem(id: number, modemDTO: GatewayModem) {
  const updatedGatewayModem = await prisma.gatewayModem.update({
    where: { id },
    data: {
      ...modemDTO,
    },
  });

  await prisma.$disconnect();
  return updatedGatewayModem;
}

export async function deleteGatewayModem(id: number) {
  const deletedGatewayModem = await prisma.gatewayModem.delete({
    where: { id },
  });

  await prisma.$disconnect();
  return deletedGatewayModem;
}
