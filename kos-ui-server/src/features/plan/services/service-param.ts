import { ServiceParam } from '@prisma/client';

import prisma from '../../../client';

export async function createManyServiceParams(serviceParamsDTO: ServiceParam[]) {
  const newServiceParams = await prisma.$transaction(
    serviceParamsDTO.map((param) =>
      prisma.serviceParam.create({
        data: {
          ...param,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return newServiceParams;
}

export async function updateManyServiceParams(serviceParamsDTO: ServiceParam[]) {
  const updatedServiceParams = await prisma.$transaction(
    serviceParamsDTO.map((param) =>
      prisma.serviceParam.update({
        where: { id: param.id },
        data: {
          ...param,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return updatedServiceParams;
}

export async function deleteManyServiceParams(serviceParamsDTO: ServiceParam[]) {
  const deletedServiceParams = await prisma.$transaction(
    serviceParamsDTO.map((param) =>
      prisma.serviceParam.delete({
        where: { id: param.id },
      }),
    ),
  );
  await prisma.$disconnect();
  return deletedServiceParams;
}

export async function createServiceParam(serviceParamsDTO: ServiceParam) {
  const newServiceParam = await prisma.serviceParam.create({
    data: {
      ...serviceParamsDTO,
    },
  });

  await prisma.$disconnect();
  return newServiceParam;
}

export async function updateServiceParam(id: number, serviceParamsDTO: ServiceParam) {
  const updatedServiceParam = await prisma.serviceParam.update({
    where: { id },
    data: {
      ...serviceParamsDTO,
    },
  });

  await prisma.$disconnect();
  return updatedServiceParam;
}

export async function deleteServiceParam(id: number) {
  const deletedServiceParam = await prisma.serviceParam.delete({
    where: { id },
  });

  await prisma.$disconnect();
  return deletedServiceParam;
}
