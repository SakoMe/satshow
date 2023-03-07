import { CandidateBeam } from '@prisma/client';

import prisma from '../../../client';

export async function createManyBeams(beamsDTO: CandidateBeam[]) {
  const newBeams = await prisma.$transaction(
    beamsDTO.map((beam) =>
      prisma.candidateBeam.create({
        data: {
          ...beam,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return newBeams;
}

export async function updateManyBeams(beamsDTO: CandidateBeam[]) {
  const updatedBeams = await prisma.$transaction(
    beamsDTO.map((beam) =>
      prisma.candidateBeam.update({
        where: { id: beam.id },
        data: {
          ...beam,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return updatedBeams;
}

export async function deleteManyBeams(beamsDTO: CandidateBeam[]) {
  const deletedBeams = await prisma.$transaction(
    beamsDTO.map((beam) =>
      prisma.candidateBeam.delete({
        where: { id: beam.id },
      }),
    ),
  );
  await prisma.$disconnect();
  return deletedBeams;
}

export async function createBeam(beamDTO: CandidateBeam) {
  const newBeam = await prisma.candidateBeam.create({
    data: {
      ...beamDTO,
    },
  });

  await prisma.$disconnect();
  return newBeam;
}

export async function updateBeam(id: number, beamDTO: CandidateBeam) {
  const updatedBeam = await prisma.candidateBeam.update({
    where: { id },
    data: {
      ...beamDTO,
    },
  });

  await prisma.$disconnect();
  return updatedBeam;
}

export async function deleteBeam(id: number) {
  const deletedBeam = await prisma.candidateBeam.delete({
    where: { id },
  });

  await prisma.$disconnect();
  return deletedBeam;
}
