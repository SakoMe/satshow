import { Connectivity, SegmentTerminal, TerminalConnectivity } from '@prisma/client';

export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface IFlightPath {
  time: Date;
  lat: number;
  lng: number;
  alt: number;
}

export interface ITemporalVariation {
  time: Date;
  demand: number;
}

export interface IModCod {
  name: string;
  spec_eff_ideal: number;
  spec_eff: number;
  esno: number;
}

export interface IConnectivity extends Connectivity, TerminalConnectivity {
  uplink_terminals: SegmentTerminal[];
  downlink_terminals: SegmentTerminal[];
}
