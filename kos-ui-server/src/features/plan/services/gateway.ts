import { SegmentGateway } from '@prisma/client';

import prisma from '../../../client';

export async function createManyGateways(gatewaysDTO: SegmentGateway[]) {
  const newGateways = await prisma.$transaction(
    gatewaysDTO.map((gateway) =>
      prisma.segmentGateway.create({
        data: {
          ...gateway,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return newGateways;
}

export async function updateManyGateways(gatewaysDTO: SegmentGateway[]) {
  const updatedGateways = await prisma.$transaction(
    gatewaysDTO.map((gateway) =>
      prisma.segmentGateway.update({
        where: { id: gateway.id },
        data: {
          ...gateway,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return updatedGateways;
}

export async function deleteManyGateways(gatewaysDTO: SegmentGateway[]) {
  const deletedGateways = await prisma.$transaction(
    gatewaysDTO.map((gateway) =>
      prisma.segmentGateway.delete({
        where: { id: gateway.id },
      }),
    ),
  );
  await prisma.$disconnect();
  return deletedGateways;
}

export async function createGateway(gatewayDTO: SegmentGateway) {
  const newGateway = await prisma.segmentGateway.create({
    data: {
      ...gatewayDTO,
    },
  });

  await prisma.$disconnect();
  return newGateway;
}

export async function updateGateway(id: number, gatewayDTO: SegmentGateway) {
  const updatedGateway = await prisma.segmentGateway.update({
    where: { id },
    data: {
      ...gatewayDTO,
    },
  });

  await prisma.$disconnect();
  return updatedGateway;
}

export async function deleteGateway(id: number) {
  const deletedGateway = await prisma.segmentGateway.delete({
    where: { id },
  });

  await prisma.$disconnect();
  return deletedGateway;
}

export async function getGatewayById(id: number) {
  const gateway = await prisma.segmentGateway.findUnique({
    where: { id },
  });

  await prisma.$disconnect();
  return gateway;
}

export async function getAllGateways() {
  const gateways = await prisma.segmentGateway.findMany();

  await prisma.$disconnect();
  return gateways;
}

export async function getAllGatewaysForServiceSegment(serviceSegmentId: number) {
  const gateways = await prisma.segmentGateway.findMany({
    where: { service_segment_id: serviceSegmentId },
  });

  await prisma.$disconnect();
  return gateways;
}
