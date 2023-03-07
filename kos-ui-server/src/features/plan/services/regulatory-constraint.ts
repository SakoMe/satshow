import { Prisma, RegulatoryConstraint } from '@prisma/client';

import prisma from '../../../client';

export async function createManyConstraints(constraintsDTO: RegulatoryConstraint[]) {
  const newConstraints = await prisma.$transaction(
    constraintsDTO.map((constraint) =>
      prisma.regulatoryConstraint.create({
        data: {
          ...constraint,
          coordinates:
            constraint.coordinates !== null ? constraint.coordinates : Prisma.JsonNull,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return newConstraints;
}

export async function updateManyConstraints(constraintsDTO: RegulatoryConstraint[]) {
  const updatedConstraints = await prisma.$transaction(
    constraintsDTO.map((constraint) =>
      prisma.regulatoryConstraint.update({
        where: { id: constraint.id },
        data: {
          ...constraint,
          coordinates:
            constraint.coordinates !== null ? constraint.coordinates : Prisma.JsonNull,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return updatedConstraints;
}

export async function deleteManyConstraints(constraintsDTO: RegulatoryConstraint[]) {
  const deletedConstraints = await prisma.$transaction(
    constraintsDTO.map((constraint) =>
      prisma.regulatoryConstraint.delete({
        where: { id: constraint.id },
      }),
    ),
  );
  await prisma.$disconnect();
  return deletedConstraints;
}

export async function createConstraint(constraintDTO: RegulatoryConstraint) {
  const newConstraint = await prisma.regulatoryConstraint.create({
    data: {
      ...constraintDTO,
      coordinates:
        constraintDTO.coordinates !== null ? constraintDTO.coordinates : Prisma.JsonNull,
    },
  });

  await prisma.$disconnect();
  return newConstraint;
}

export async function updateConstraint(id: number, constraintDTO: RegulatoryConstraint) {
  const updatedConstraint = await prisma.regulatoryConstraint.update({
    where: { id },
    data: {
      ...constraintDTO,
      coordinates:
        constraintDTO.coordinates !== null ? constraintDTO.coordinates : Prisma.JsonNull,
    },
  });

  await prisma.$disconnect();
  return updatedConstraint;
}

export async function deleteConstraint(id: number) {
  const deletedConstraint = await prisma.regulatoryConstraint.delete({
    where: { id },
  });

  await prisma.$disconnect();
  return deletedConstraint;
}
