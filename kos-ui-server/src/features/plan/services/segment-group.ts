import { ServiceSegmentGroup } from '@prisma/client';

import prisma from '../../../client';

export async function createServiceSegmentGroup(
  serviceSegmentGroupDTO: ServiceSegmentGroup,
) {
  const newServiceSegmentGroup = await prisma.serviceSegmentGroup.create({
    data: {
      ...serviceSegmentGroupDTO,
    },
  });

  await prisma.$disconnect();
  return newServiceSegmentGroup;
}

export async function updateServiceSegmentGroup(
  id: number,
  serviceSegmentGroupDTO: ServiceSegmentGroup,
) {
  const updatedServiceSegmentGroup = await prisma.serviceSegmentGroup.update({
    where: { id },
    data: {
      ...serviceSegmentGroupDTO,
    },
  });

  await prisma.$disconnect();
  return updatedServiceSegmentGroup;
}

export async function deleteServiceSegmentGroup(id: number) {
  const deletedServiceSegmentGroup = await prisma.serviceSegmentGroup.delete({
    where: { id },
  });

  await prisma.$disconnect();
  return deletedServiceSegmentGroup;
}

export async function getAllServiceSegmentGroups() {
  const serviceSegmentGroups = await prisma.serviceSegmentGroup.findMany({
    include: {
      service_segments: true,
    },
  });

  await prisma.$disconnect();
  return serviceSegmentGroups;
}

export async function getServiceSegmentGroupById(id: number) {
  const serviceSegmentGroup = await prisma.serviceSegmentGroup.findUnique({
    where: { id },
    include: {
      service_segments: true,
    },
  });

  await prisma.$disconnect();
  return serviceSegmentGroup;
}
