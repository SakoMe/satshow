import { ServiceSegment } from '@prisma/client';

import prisma from '../../../client';

export async function createServiceSegment(serviceSgementDTO: ServiceSegment) {
  const newServiceSgement = await prisma.serviceSegment.create({
    data: {
      ...serviceSgementDTO,
    },
  });

  await prisma.$disconnect();
  return newServiceSgement;
}

export async function updateServiceSegment(
  id: number,
  serviceSgementDTO: ServiceSegment,
) {
  const updatedServiceSgement = await prisma.serviceSegment.update({
    where: { id },
    data: {
      ...serviceSgementDTO,
    },
  });

  await prisma.$disconnect();
  return updatedServiceSgement;
}

export async function deleteServiceSegment(id: number) {
  const deletedServiceSgement = await prisma.serviceSegment.delete({
    where: { id },
  });

  await prisma.$disconnect();
  return deletedServiceSgement;
}

export async function getServiceSegmentById(id: number) {
  const serviceSgement = await prisma.serviceSegment.findUnique({
    where: { id },
  });

  await prisma.$disconnect();
  return serviceSgement;
}

export async function getAllServiceSegments() {
  const serviceSgements = await prisma.serviceSegment.findMany({
    include: {
      gateways: true,
    },
  });
  await prisma.$disconnect();
  return serviceSgements;
}
