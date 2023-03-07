import { Prisma } from '@prisma/client';

import client from '../../../client';
import { IConnectivity } from '../../../ts';
import { getAllTerminals } from './terminal';

export async function createConnectivity(connectivityDTO: IConnectivity) {
  const terminals = await getAllTerminals();

  const uplink_terminals = terminals
    .filter((terminal) =>
      connectivityDTO.uplink_terminals.some((t) => t.id === terminal.id),
    )
    .map((terminal) => terminal.id);

  const downlink_terminals = terminals
    .filter((terminal) =>
      connectivityDTO.downlink_terminals.some((t) => t.id === terminal.id),
    )
    .map((terminal) => terminal.id);

  const connectivity = await client.connectivity.create({
    data: {
      service_segment_id: connectivityDTO.service_segment_id,
      mir: connectivityDTO.mir,
      cir: connectivityDTO.cir,
      availability: connectivityDTO.availability,
      satellite_eirp: connectivityDTO.satellite_eirp,
      bandwidth: connectivityDTO.bandwidth,
      temporal_variations:
        connectivityDTO.temporal_variations !== null
          ? connectivityDTO.temporal_variations
          : Prisma.JsonNull,
      modcods:
        connectivityDTO.modcods !== null ? connectivityDTO.modcods : Prisma.JsonNull,
    },
  });

  await client.terminalConnectivity.createMany({
    data: [
      ...uplink_terminals.map((terminal_id) => ({
        segment_terminal_id: terminal_id,
        connectivity_id: connectivity.id,
        uplink_terminal: true,
        downlink_terminal: false,
      })),
      ...downlink_terminals.map((terminal_id) => ({
        segment_terminal_id: terminal_id,
        connectivity_id: connectivity.id,
        downlink_terminal: true,
        uplink_terminal: false,
      })),
    ],
  });
  return connectivity;
}

export async function updateConnectivity(connectivityDTO: IConnectivity, id: number) {
  const terminals = await getAllTerminals();

  const uplink_terminals = terminals
    .filter((terminal) =>
      connectivityDTO.uplink_terminals.some((t) => t.id === terminal.id),
    )
    .map((terminal) => terminal.id);

  const downlink_terminals = terminals
    .filter((terminal) =>
      connectivityDTO.downlink_terminals.some((t) => t.id === terminal.id),
    )
    .map((terminal) => terminal.id);

  const connectivity = await client.connectivity.update({
    where: { id },
    data: {
      service_segment_id: connectivityDTO.service_segment_id,
      mir: connectivityDTO.mir,
      cir: connectivityDTO.cir,
      availability: connectivityDTO.availability,
      satellite_eirp: connectivityDTO.satellite_eirp,
      bandwidth: connectivityDTO.bandwidth,
      temporal_variations:
        connectivityDTO.temporal_variations !== null
          ? connectivityDTO.temporal_variations
          : Prisma.JsonNull,
      modcods:
        connectivityDTO.modcods !== null ? connectivityDTO.modcods : Prisma.JsonNull,
    },
  });

  await client.terminalConnectivity.deleteMany({
    where: { connectivity_id: id },
  });

  await client.terminalConnectivity.createMany({
    data: [
      ...uplink_terminals.map((terminal_id) => ({
        segment_terminal_id: terminal_id,
        connectivity_id: connectivity.id,
        uplink_terminal: true,
        downlink_terminal: false,
      })),
      ...downlink_terminals.map((terminal_id) => ({
        segment_terminal_id: terminal_id,
        connectivity_id: connectivity.id,
        downlink_terminal: true,
        uplink_terminal: false,
      })),
    ],
  });
  return connectivity;
}

export async function deleteConnectivity(id: number) {
  await client.terminalConnectivity.deleteMany({
    where: { connectivity_id: id },
  });
  return await client.connectivity.delete({ where: { id } });
}

export async function createManyConnectivities(connectivitiesDTO: IConnectivity[]) {
  return await Promise.all(
    connectivitiesDTO.map((connectivityDTO) => createConnectivity(connectivityDTO)),
  );
}

export async function updateManyConnectivities(connectivitiesDTO: IConnectivity[]) {
  return await Promise.all(
    connectivitiesDTO.map((connectivityDTO) =>
      updateConnectivity(connectivityDTO, connectivityDTO.id),
    ),
  );
}

export async function deleteManyConnectivities(connectivitiesDTO: IConnectivity[]) {
  return await Promise.all(connectivitiesDTO.map(({ id }) => deleteConnectivity(id)));
}
