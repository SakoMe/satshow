import { Prisma, Region } from '@prisma/client';

import prisma from '../../../client';

export async function createManyRegions(regionsDTO: Region[]) {
  const newRegions = await prisma.$transaction(
    regionsDTO.map((region) =>
      prisma.region.create({
        data: {
          ...region,
          coordinates: region.coordinates !== null ? region.coordinates : Prisma.JsonNull,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return newRegions;
}

export async function updateManyRegions(regionsDTO: Region[]) {
  const updatedRegions = await prisma.$transaction(
    regionsDTO.map((region) =>
      prisma.region.update({
        where: { id: region.id },
        data: {
          ...region,
          coordinates: region.coordinates !== null ? region.coordinates : Prisma.JsonNull,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return updatedRegions;
}

export async function deleteManyRegions(regionsDTO: Region[]) {
  const deletedRegions = await prisma.$transaction(
    regionsDTO.map((region) =>
      prisma.region.delete({
        where: { id: region.id },
      }),
    ),
  );
  await prisma.$disconnect();
  return deletedRegions;
}

export async function createRegion(regionDTO: Region) {
  const newRegion = await prisma.region.create({
    data: {
      ...regionDTO,
      coordinates:
        regionDTO.coordinates !== null ? regionDTO.coordinates : Prisma.JsonNull,
    },
  });

  await prisma.$disconnect();
  return newRegion;
}

export async function updateRegion(id: number, regionDTO: Region) {
  const updatedRegion = await prisma.region.update({
    where: { id },
    data: {
      ...regionDTO,
      coordinates:
        regionDTO.coordinates !== null ? regionDTO.coordinates : Prisma.JsonNull,
    },
  });

  await prisma.$disconnect();
  return updatedRegion;
}

export async function deleteRegion(id: number) {
  const deletedRegion = await prisma.region.delete({
    where: { id },
  });

  await prisma.$disconnect();
  return deletedRegion;
}

export async function getAllRegionsForServiceSegment(segmentId: number) {
  const regions = await prisma.region.findMany({
    where: {
      service_segment_id: segmentId,
    },
  });

  await prisma.$disconnect();
  return regions;
}
