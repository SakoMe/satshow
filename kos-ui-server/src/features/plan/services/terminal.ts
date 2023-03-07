import { Prisma, SegmentTerminal } from '@prisma/client';

import prisma from '../../../client';

export async function createManyTerminals(terminalsDTO: SegmentTerminal[]) {
  const newTerminals = await prisma.$transaction(
    terminalsDTO.map((terminal) =>
      prisma.segmentTerminal.create({
        data: {
          ...terminal,
          flight_paths:
            terminal.flight_paths !== null ? terminal.flight_paths : Prisma.JsonNull,
          temporal_variations_forward:
            terminal.temporal_variations_forward !== null
              ? terminal.temporal_variations_forward
              : Prisma.JsonNull,
          temporal_variations_return:
            terminal.temporal_variations_return !== null
              ? terminal.temporal_variations_return
              : Prisma.JsonNull,
          modcods_forward:
            terminal.modcods_forward !== null
              ? terminal.modcods_forward
              : Prisma.JsonNull,
          modcods_return:
            terminal.modcods_return !== null ? terminal.modcods_return : Prisma.JsonNull,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return newTerminals;
}

export async function updateManyTerminals(terminalsDTO: SegmentTerminal[]) {
  const updatedTerminals = await prisma.$transaction(
    terminalsDTO.map((terminal) =>
      prisma.segmentTerminal.update({
        where: { id: terminal.id },
        data: {
          ...terminal,
          flight_paths:
            terminal.flight_paths !== null ? terminal.flight_paths : Prisma.JsonNull,
          temporal_variations_forward:
            terminal.temporal_variations_forward !== null
              ? terminal.temporal_variations_forward
              : Prisma.JsonNull,
          temporal_variations_return:
            terminal.temporal_variations_return !== null
              ? terminal.temporal_variations_return
              : Prisma.JsonNull,
          modcods_forward:
            terminal.modcods_forward !== null
              ? terminal.modcods_forward
              : Prisma.JsonNull,
          modcods_return:
            terminal.modcods_return !== null ? terminal.modcods_return : Prisma.JsonNull,
        },
      }),
    ),
  );
  await prisma.$disconnect();
  return updatedTerminals;
}

export async function deleteManyTerminals(terminalsDTO: SegmentTerminal[]) {
  const deletedTerminals = await prisma.$transaction(
    terminalsDTO.map((terminal) =>
      prisma.segmentTerminal.delete({
        where: { id: terminal.id },
      }),
    ),
  );
  await prisma.$disconnect();
  return deletedTerminals;
}

export async function createTerminal(terminalDTO: SegmentTerminal) {
  const newTerminal = await prisma.segmentTerminal.create({
    data: {
      ...terminalDTO,
      flight_paths:
        terminalDTO.flight_paths !== null ? terminalDTO.flight_paths : Prisma.JsonNull,
      temporal_variations_forward:
        terminalDTO.temporal_variations_forward !== null
          ? terminalDTO.temporal_variations_forward
          : Prisma.JsonNull,
      temporal_variations_return:
        terminalDTO.temporal_variations_return !== null
          ? terminalDTO.temporal_variations_return
          : Prisma.JsonNull,
      modcods_forward:
        terminalDTO.modcods_forward !== null
          ? terminalDTO.modcods_forward
          : Prisma.JsonNull,
      modcods_return:
        terminalDTO.modcods_return !== null
          ? terminalDTO.modcods_return
          : Prisma.JsonNull,
    },
  });
  await prisma.$disconnect();
  return newTerminal;
}

export async function updateTerminal(id: number, terminalDTO: SegmentTerminal) {
  const updatedTerminal = await prisma.segmentTerminal.update({
    where: { id },
    data: {
      ...terminalDTO,
      flight_paths:
        terminalDTO.flight_paths !== null ? terminalDTO.flight_paths : Prisma.JsonNull,
      temporal_variations_forward:
        terminalDTO.temporal_variations_forward !== null
          ? terminalDTO.temporal_variations_forward
          : Prisma.JsonNull,
      temporal_variations_return:
        terminalDTO.temporal_variations_return !== null
          ? terminalDTO.temporal_variations_return
          : Prisma.JsonNull,
      modcods_forward:
        terminalDTO.modcods_forward !== null
          ? terminalDTO.modcods_forward
          : Prisma.JsonNull,
      modcods_return:
        terminalDTO.modcods_return !== null
          ? terminalDTO.modcods_return
          : Prisma.JsonNull,
    },
  });
  await prisma.$disconnect();
  return updatedTerminal;
}

export async function deleteTerminal(id: number) {
  const deletedTerminal = await prisma.segmentTerminal.delete({
    where: { id },
  });
  await prisma.$disconnect();
  return deletedTerminal;
}

export async function getTerminal(id: number) {
  const terminal = await prisma.segmentTerminal.findUnique({
    where: { id },
  });
  await prisma.$disconnect();
  return terminal;
}

export async function getAllTerminals() {
  const terminals = await prisma.segmentTerminal.findMany();
  await prisma.$disconnect();
  return terminals;
}
