import {
  frequency_band,
  link_direction,
  polarization,
  Service_segment_terminal,
  Service_segment_terminal_flight_path,
  Service_segment_terminal_modcod_forward,
  Service_segment_terminal_modcod_return,
  Service_segment_terminal_temporal_variation_forward,
  Service_segment_terminal_temporal_variation_return,
} from './fromPrisma';

// export type SuperRequired<T> = Required<{
//   [key in keyof T]: Required<SuperRequired<T[key]>>;
// }>;

// export type VeryPartial<T> = Partial<{
//   [key in keyof T]: Partial<VeryPartial<T[key]>>;
// }>;

export type Plan = {
  id: number;
  plan_name: string;
  serviceNames: string[];
  terminals: unknown[];
  gateways: Gateway[];
  time_period_start: Date; // The backend will calculate the difference between the timestamps which is what we really want.
  time_period_end: Date;
  number_segments: number;
};

export type PlanMeta = {
  id?: number;
  plan_name: string;
  number_segments: number;
  time_period_start: Date;
  time_period_end: Date;
};

export type ModCod = {
  modcod_id: number;
  name: string;
  spec_eff_ideal: number;
  spec_eff: number;
  esno: number;
};

// Client code will collect data thru form and file imports
// Client sends it to the HTTP server
// HTTP server sends it to the database
// Database sends it to the real backend

// Little block part of a Service. Has some changes to terminals and connectivity, but largely stays the same.
// Clones the dateStart and dateEnd from the Plan for now.
export type ServiceRequest = {
  dateStart: Date;
  dateEnd: Date;
  terminals: unknown[];
};

export type ServiceTypes =
  | 'Mobile_Grid_Beam' // Mobile_Grid
  | 'Mobile_Follow_Me'
  | 'Multicast_Gateway'
  | 'Multicast_Terminal'
  | 'Point_to_Point'
  | 'Trunking_Phased_Array_Down_Phased_Array_Up'
  | 'Trunking_Phased_Array_Down_Steerable_Up'
  | 'Trunking_Steerable_Down_Phased_Array_Up'
  | 'Trunking_Steerable_Down_Steerable_Up'
  | 'Gateway'
  | 'DTH';

export type ServiceSegment = {
  plan_id: number;
  service_segment_id: number;
  service_segment_name: string;
  service_segment_data_type: 'Bandwidth' | 'Data';
  service_segment_type: ServiceTypes;
  service_segment_priority: number;
  service_segment_associated_group: string;
  service_segment_gateway_handover: boolean;
  defrag_userlink_allowed: boolean;
  service_segment_gain_mode: 'ALC' | 'FGM';
};

export type Region = {
  name: string;
  activated: boolean; // Not sure, I just saw it on a data table from Nisanth
  source: string; // Not sure
  shape: unknown; // Polygon SVG coming from Leaflet draw | Polygon coming from that other file type on import.
  shape_id: number;
};

export type Service_segment_regulatory_constraint = {
  service_segment_regulatory_constraint_id?: number;
  regulatory_constraint_name: string;
  coordinates: number[][];
  direction: 'UpLink' | 'DownLink';
  polarization: 'LHCP' | 'RHCP' | 'VLP' | 'HLP';
  min_frequency: number;
  max_frequency: number;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_id: number;
};

type BandType = 'Ku' | 'Ka' | 'Q' | 'V' | 'C';

export type FrequencyPlan = {
  band: BandType;
  type: 'Active User';
  direction: 'uplink' | 'downlink';
  startf: number;
  stopf: number;
  exclude: boolean;
};

export type Terminal = {
  id: number;
  latitude: number;
  longitude: number;
  priority: number;
  preemption: number;
  forward_MIR: number;
  return_MIR: number;
  forward_CIR: number;
  return_CIR: number;
  availability: number;
  EIRP: number;
};

export type CandidateBeam = {
  no?: number;
  diameter: number;
  lat: number;
  long: number;
};

type ServiceParameter = {
  band: BandType;
  direction: 'uplink' | 'downlink';
  startf: number;
  stopf: number;
};

export type Service_segment_gateway = {
  id?: number;
  gateway_name: string;
  latitude: number;
  longitude: number;
  polarization: polarization;
  direction: link_direction;
  min_frequency: number;
  max_frequency: number;
  eirp: number;
  gt: number;
  npr: number;
  service_segment_id: number;
};

export type Service_segment_frequency_plan = {
  service_segment_parameter_id?: number;
  band: frequency_band;
  direction: link_direction;
  polarization: polarization;
  frequency_start: number;
  frequency_end: number;
  service_segment_id?: number;
};

export type Gateway = {
  no: number;
  lat: number;
  long: number;
  pol: number;
  upf: number;
  dnf: number;
  eirp: number;
  gt: number;
  npr: number;
  bdw: number;
};

export type Modem = {
  id?: number;
  gateway_id?: number;
  direction: 'UpLink' | 'DownLink';
  polarization: 'LHCP' | 'RHCP' | 'VLP' | 'HLP';
  min_frequency: number;
  max_frequency: number;
  max_span: number;
  max_agg_tot_sym: number;
  max_num_carrier: number;
  max_num_slice: number;
  max_sym_rate: number;
  min_sym_rate: number;
  max_term: number;
  rof: number;
  lat: number;
  long: number;
};

export type Service_segment_gateway_modem = {
  id?: number;
  latitude: number;
  longitude: number;
  polarization: polarization;
  direction: link_direction;
  min_frequency: number;
  max_frequency: number;
  max_span: number;
  max_agg_tot_sym: number;
  max_num_carrier: number | null;
  max_num_slice: number | null;
  max_sym_rate: number;
  min_sym_rate: number;
  max_term: number | null;
  rof: number;
  created_at?: Date | null;
  updated_at?: Date | null;
  gateway_id?: number;
};

// This shows up in connectivity?
export type ServiceRelationship =
  | {
      gatewayID: unknown;
      terminalID: unknown;
      relationship: 'uplink-gateway';
    }
  | { gatewayID: unknown; terminalID: unknown; relationship: 'downlink-gateway' }
  | {
      gatewayID: unknown;
      terminalID: unknown;
      relationship: 'two-way';
    }
  | {
      uplinkID: unknown;
      downlinkID: unknown;
      relationship: 'p2p';
    }
  | {
      uplinkID: unknown;
      downlinkID: unknown;
      relationship: 'trunking';
    }
  | { uplinkT: unknown; downlinkT: unknown; relationship: 'multicast' };

export type DatabaseTerminalType = {
  temporal_variations_forward: Service_segment_terminal_temporal_variation_forward[];
  temporal_variations_return: Service_segment_terminal_temporal_variation_return[];
  modcods_forward: Service_segment_terminal_modcod_forward[];
  modcods_return: Service_segment_terminal_modcod_return[];
  flight_paths: Service_segment_terminal_flight_path[];
  id: number;
};

export type DatabaseTerminalType2 = {
  terminal_id?: number;
  latitude: number;
  longitude: number;
  eirp: number;
  gt: number;
  cir: number;
  mir: number;
  availability: number;
  modcod_f: number; // Foreign key
  modcod_r: number; // Foreign key
  bandw: number;
  sat_eirp: number;
  cir_f: number;
  cir_r: number;
  mir_f: number;
  mir_r: number;
  availability_f: number;
  availability_r: number;
  mobilitypath: number; // Foreign key
};

export type Service_segment_terminal_modcod = {
  service_segment_terminal_modcod_id?: number;
  name?: string;
  spec_eff_ideal: number;
  spec_eff: number;
  esno: number;
  direction: 'Forward' | 'Return';
  service_segment_terminal_id?: number;
};

// export type Service_segment_terminal_flight_path = {
//   service_segment_terminal_flight_path_id?: number;
//   time: Date;
//   latitude: number;
//   longitude: number;
//   altitude: number;
//   service_segment_terminal_id?: number;
// };
export type CSV_flight_path = {
  time: Date;
  latitude: number;
  longitude: number;
  altitude: number;
};
export type Service_segment_terminal_temporal_variation = {
  service_segment_terminal_temporal_variation_id?: number;
  direction: 'Forward' | 'Return';
  time: Date;
  demand: number;
  service_segment_terminal_id?: number;
};
export type CSV_temporal_variation = {
  time: Date;
  demand: number;
};
export type Service_segment_region = {
  region_name: string;
  coordinates: number[][];
  id?: number;
  service_segment_id: number;
};

// Validation
// All segments in the group share their data type; either all data or all bandwidth.
// Mobility beam services must be in a group with a mobility grid service
// Any other one service type can only(?) be grouped with other services of the same type

export type FullConnectivityColumns = {
  uplink_terminal: number;
  downlink_terminals: number[];
  downlink_terminal: number;
  mir: number; // Editable
  cir: number; // Editable
  availability: number;
  satellite_eirp: number; // Editable
  bandwidth: number; // Editable
  temporal: string;
  modcod: string;
};

export type FullConnectivityDatabase = {
  uplink_terminal: number;
  mir: number; // Editable
  cir: number; // Editable
  availability: number;
  temporal: string;
  modcod: string;
  downlink_terminals: Terminal[];
  downlink_terminal: number;
  bandwidth: number; // Editable
  satellite_eirp: number; // Editable
};

export type ConnectivityNonMulticast = {
  uplink_terminal: number;
  downlink_terminal: number;
  mir: number; // Editable
  cir: number; // Editable
  availability: number;
  temporal: string;
  modcod: string;
};

export type ConnectivityMulticastGateway = {
  downlink_terminals: Terminal[];
  mir: number; // Editable
  cir: number; // Editable
  availability: number;
  temporal: string;
  modcod: string;
};

export type ConnectivityMulticastTerminal = {
  uplink_terminal: number;
  downlink_terminals: string;
  mir: number; // Editable
  cir: number; // Editable
  availability: number;
  temporal: string;
  modcod: string;
};

export type ConnectivityNonMulticastBandwidth = {
  uplink_terminal: number;
  downlink_terminal: number;
  bandwidth: number; // Editable
  satellite_eirp: number; // Editable
};

export type ConnectivityMulticastGatewayBandwidth = {
  downlink_terminals: string;
  bandwidth: number; // Editable
  satellite_eirp: number; // Editable
};

export type ConnectivityMulticastTerminalBandwidth = {
  uplink_terminal: number;
  downlink_terminals: string;
  bandwidth: number; // Editable
  satellite_eirp: number; // Editable
};

// Types from notes in recent meetings Oct 28, 2022

type Mobile = 'Mobile Grid' | 'Mobile Follow Me';
type MultiCast = 'MultiCast Gateway' | 'MultiCast Terminal';
type Trunking = 'Stea' | 'Trunking Terminal';

type ServiceSegmentType =
  | 'DTH' // fine
  | 'Full Mesh' // fine point to single point
  | 'Gateway' // gateway fine
  | Mobile // fine
  | MultiCast // fine
  | Trunking;

type ServiceSegmentDataType = 'Data Service' | 'Bandwidth Service';

export interface ServiceSegmentAlt {
  serviceSegmentId?: number; // primary key
  serviceSegmentName: string;
  serviceSegmentType: ServiceSegmentType;
  serviceSegmentDataType: ServiceSegmentDataType;
  serviceSegmentAssociatedGroup: string;
  serviceSegmentGateway: boolean;
  planId: number; // foreign key
}

type RegionCoordinates = {
  latitude: number;
  longitude: number;
};

export interface RegionAlt {
  regionId?: number; // primary key
  selected: boolean; // selected by user
  regionName: string; // polygon name
  regionCoordinates: RegionCoordinates[];
  serviceSegmentId: number; // foreign key
}

type ServiceParameterDirection = 'UpLink' | 'DownLink';

export interface ServiceParameterAlt {
  serviceParameterId?: number; // primary key
  selected: boolean;
  serviceParameterBand: string;
  serviceParameterType: string;
  serviceParameterDirection: ServiceParameterDirection;
  serviceParameterStartFrequency: number;
  serviceParameterStopFrequency: number;
  serviceSegmentId: number; // foreign key
}

type RegulatoryConstraintDirection = 'UpLink' | 'DownLink';

export interface RegulatoryConstraint {
  regulatoryConstraintId?: number; // primary key
  selected: boolean;
  regulatoryConstraintName: string;
  regulatoryConstraintDirection: RegulatoryConstraintDirection;
  regulatoryConstraintMinFrequency: number;
  regulatoryConstraintMaxFrequency: number;
  regulatoryConstraintPFDLevel: number;
  serviceSegmentId: number; // foreign key
}

type Unform = {
  beamDiameter: number;
  beamSpacing: number;
};

type NonUniform = {
  beamDiameterRangeMin: number;
  beamDiameterRangeMax: number;
};

type FollowMe = {
  beamDiameter: number;
};

type CandidateBeamType = Unform | NonUniform | FollowMe;

interface CandidateBeams {
  candidateBeamId?: number; // primary key
  selected: boolean;
  candidateBeamType: CandidateBeamType;
}

export type BigPostTerminal = Service_segment_terminal & {
  flight_paths: Service_segment_terminal_flight_path[];
  temporal_variations_forward: Service_segment_terminal_temporal_variation_forward[];
  temporal_variations_return: Service_segment_terminal_temporal_variation_return[];
  modcods_forward: Service_segment_terminal_modcod_forward[];
  modcods_return: Service_segment_terminal_modcod_return[];
};

// export type Service_segment_terminal = {
//   service_segment_terminal_id?: number;
//   terminal_id: number;
//   latitude: number;
//   longitude: number;
//   eirp: number;
//   gt: number;
//   satellite_eirp?: number;
//   bandwidth_forward?: number;
//   bandwidth_return?: number;
//   mir_forward?: number;
//   mir_return?: number;
//   cir_forward?: number;
//   cir_return?: number;
//   target_avialability_forward?: number;
//   target_avialability_return?: number;
//   service_segment_id: number;
// };

export type CSV_modcod = {
  spec_eff_ideal: number;
  spec_eff: number;
  esno: number;
  // direction: 'Forward' | 'Return';
};
