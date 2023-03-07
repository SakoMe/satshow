/**
 * Model Kos_user
 *
 */
export type Kos_user = {
  user_id: number;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * Model Plan_request
 *
 */
export type Plan_request = {
  id?: number;
  plan_name: string;
  number_segments: number;
  status?: plan_request_status;
  time_period_start: Date;
  time_period_end: Date;
  created_at?: Date | null;
  updated_at?: Date | null;
  user_id?: number;
};

/**
 * Model Service_segment
 *
 */
export type Service_segment = {
  id?: number;
  service_segment_name: string;
  service_segment_type: service_segment_type;
  service_segment_data_type: service_segment_data_type;
  service_segment_priority: number;
  service_segment_gateway_handover: boolean;
  defrag_userlink_allowed: boolean;
  service_segment_gain_mode: gain_mode;
  created_at?: Date | null;
  updated_at?: Date | null;
  plan_id?: number;
  group_id: number;
};

/**
 * Model Service_segment_group
 *
 */
export type Service_segment_group = {
  id?: number;
  service_segment_group_name: string;
  created_at?: Date | null;
  updated_at?: Date | null;
};

/**
 * Model Service_segment_region
 *
 */
export type Service_segment_region = {
  id?: number;
  region_name: string;
  coordinates: number[][][];
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_id?: number;
};

/**
 * Model Service_segment_frequency_plan
 *
 */
export type Service_segment_frequency_plan = {
  id?: number;
  band: frequency_band;
  direction: link_direction;
  polarization: polarization;
  frequency_start: number;
  frequency_end: number;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_id?: number;
};

/**
 * Model Service_segment_regulatory_constraint
 *
 */
export type Service_segment_regulatory_constraint = {
  id?: number;
  regulatory_constraint_name: string;
  direction: link_direction;
  polarization: polarization;
  min_frequency: number;
  max_frequency: number;
  max_copol_directivity: number;
  min_crosspol_discrimination: number;
  pfd_level: number;
  coordinates: unknown;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_id?: number;
};

/**
 * Model Service_segment_candidate_beam
 *
 */
export type Service_segment_candidate_beam = {
  id?: number;
  beam_type: beam_type | null;
  beam_diameter: number | null;
  spacing: number | null;
  beam_diameter_range_min: number | null;
  beam_diameter_range_max: number | null;
  latitude: number | null;
  longitude: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_id?: number;
};

/**
 * Model Service_segment_gateway
 *
 */
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
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_id?: number;
};

/**
 * Model Service_segment_gateway_modem
 *
 */
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
  rof: number;
  max_sym_rate: number;
  min_sym_rate: number;
  max_num_slice: number | null;
  max_num_carrier: number | null;
  max_term: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  gateway_id?: number;
};

/**
 * Model Service_segment_method_terminal
 *
 */
export type Service_segment_method_terminal = {
  id?: number;
  terminal_method: terminal_method_type; // Uniform_grid, Random_uniform, Population_density
  avg_num_of_termninals_per_square_km: number;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_id?: number;
  method_terminals: unknown;
};

/**
 * Model Service_segment_terminal
 *
 */
export type Service_segment_terminal = {
  id?: number;
  latitude: number;
  longitude: number;
  eirp: number;
  gt: number;
  satellite_eirp: number | null;
  bandwidth_forward: number | null;
  bandwidth_return: number | null;
  mir_forward: number | null;
  mir_return: number | null;
  cir_forward: number | null;
  cir_return: number | null;
  target_availability_forward: number | null;
  target_availability_return: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_id?: number;
};

/**
 * Model Service_segment_terminal_flight_path
 *
 */
export type Service_segment_terminal_flight_path = {
  service_segment_terminal_flight_path_id?: number;
  time: Date | null;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_terminal_id?: number;
};

/**
 * Model Service_segment_terminal_temporal_variation_forward
 *
 */
export type Service_segment_terminal_temporal_variation_forward = {
  service_segment_terminal_temporal_variation_id?: number;
  time: Date | null;
  demand: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_terminal_id?: number;
};

/**
 * Model Service_segment_terminal_temporal_variation_return
 *
 */
export type Service_segment_terminal_temporal_variation_return = {
  service_segment_terminal_temporal_variation_id?: number;
  time: Date | null;
  demand: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_terminal_id: number;
};

/**
 * Model Service_segment_terminal_modcod_forward
 *
 */
export type Service_segment_terminal_modcod_forward = {
  service_segment_terminal_modcod_id?: number;
  name?: string | null;
  spec_eff_ideal: number | null;
  spec_eff: number | null;
  esno: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_terminal_id?: number;
};

/**
 * Model Service_segment_terminal_modcod_return
 *
 */
export type Service_segment_terminal_modcod_return = {
  service_segment_terminal_modcod_id?: number;
  name?: string | null;
  spec_eff_ideal: number | null;
  spec_eff: number | null;
  esno: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_terminal_id?: number;
};

/**
 * Model Service_segment_connectivity
 *
 */
export type Service_segment_connectivity = {
  id?: number;
  uplink_terminals: number[];
  downlink_terminals: number[];
  mir: number | null;
  cir: number | null;
  availability: number | null;
  satellite_eirp: number | null;
  bandwidth: number | null;
  temporal_variations: unknown;
  modcods: unknown;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_id?: number;
};

/**
 * Model Service_segment_connectivity_temporal_variation
 *
 */
export type Service_segment_connectivity_temporal_variation = {
  service_segment_terminal_temporal_variation_id?: number;
  time: Date | null;
  demand: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_connectivity_id?: number;
};

/**
 * Model Service_segment_connectivity_modcod
 *
 */
export type Service_segment_connectivity_modcod = {
  service_segment_terminal_modcod_id?: number;
  name: string | null;
  spec_eff_ideal: number | null;
  spec_eff: number | null;
  esno: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  service_segment_connectivity_id?: number;
};

/**
 * Model Gateway
 *
 */
export type Gateway = {
  gateway_id: number;
  name: string | null;
  location: unknown | null;
  antenna_size: number | null;
  tx_antenna_efficiency: number | null;
  rx_antenna_efficiency: number | null;
  antenna_wetting_losses: number | null;
  clear_sky_wetting_losses: number | null;
  tx_xpol_isolation: number | null;
  rx_xpol_isolation: number | null;
  lhcp_max_eirp: number | null;
  lhcp_max_power: number | null;
  lhcp_transmit_hpa_nom_npr: number | null;
  lhcp_transmit_hpa_max_npr: number | null;
  rhcp_max_eirp: number | null;
  rhcp_max_power: number | null;
  rhcp_transmit_hpa_nom_npr: number | null;
  rhcp_transmit_hpa_max_npr: number | null;
  lhcp_gt: number | null;
  lhcp_system_temp: number | null;
  lhcp_sky_temp: number | null;
  rhcp_gt: number | null;
  rhcp_system_temp: number | null;
  rhcp_sky_temp: number | null;
  upc_error: number | null;
  pointing_error_deg: number | null;
};

/**
 * Model Modcod
 *
 */
export type Modcod = {
  modcod_id: number;
  name: string | null;
  spec_eff_ideal: number | null;
  spec_eff: number | null;
  esno: number | null;
};

/**
 * Model Modcod_table
 *
 */
export type Modcod_table = {
  table_id: number;
  modcods: number[];
};

/**
 * Model Terminal
 *
 */
export type Terminal = {
  terminal_id: number;
  location: unknown | null;
  mobile_user: boolean | null;
  placement_id: number | null;
};

/**
 * Model Terminal_placement
 *
 */
export type Terminal_placement = {
  terminal_placement_id: number;
  terminal_name: string | null;
  antenna_diameter: number | null;
  antenna_efficiency: number | null;
  cost: number | null;
  eirp_spec: number | null;
  gt_spec: number | null;
  tsky: number | null;
  tsys: number | null;
  power_spec: number | null;
  npr: number | null;
  xpol_isolation_tx: number | null;
  xpol_isolation_rx: number | null;
  power_limit: number | null;
  upc_error_mean: number | null;
  upc_error_variance: number | null;
  modcod_table_tx_id: number | null;
  modcod_table_rx_id: number | null;
  loss_ant_wet_degraded: number | null;
  loss_ant_wet_clear_sky: number | null;
  loss_pointing_error: number | null;
};

/**
 * Model Baseband_beam
 *
 */
export type Baseband_beam = {
  beam_id: number;
  beam_name: string | null;
  gateway_id: number | null;
  beam_direction: link_path | null;
  beam_uplink_polarization: polarization | null;
  beam_downlink_polarization: polarization | null;
  beam_coordinates: unknown | null;
};

/**
 * Model Baseband_carrier
 *
 */
export type Baseband_carrier = {
  carrier_id: number;
  beam_id: number | null;
  uplink_frequency: number | null;
  downlink_frequency: number | null;
  symbol_rate: number | null;
  roll_off: number | null;
  gw_tx_power: number | null;
};

/**
 * Model Baseband_slice
 *
 */
export type Baseband_slice = {
  slice_id: number;
  beam_id: number | null;
  uplink_frequency: number | null;
  downlink_frequency: number | null;
  bandwidth: number | null;
  roll_off: number | null;
  max_psd: number | null;
};

/**
 * Model Baseband_terminal
 *
 */
export type Baseband_terminal = {
  terminal_id: number;
  assigned_forward_beam_id: number | null;
  assigned_return_beam_id: number | null;
};

/**
 * Model Beam_definition
 *
 */
export type Beam_definition = {
  beam_id: number;
  beam_name: string | null;
  direction: transmit_direction | null;
  path: link_path | null;
  beam_polarization: polarization | null;
  beam_weights: unknown | null;
};

/**
 * Model Beam_routing
 *
 */
export type Beam_routing = {
  beam_routing_id: number;
  input_beam_id: number | null;
  output_beam_id: number | null;
  input_channel_start: number | null;
  output_channel_start: number | null;
  channel_width: number | null;
  alc_enabled: boolean | null;
  alc_target_power: number | null;
  additional_gain: number | null;
};

/**
 * Model Cell
 *
 */
export type Cell = {
  cell_id: number;
  baseband_beam_ids: number[];
  satellite_beam_ids: number[];
  center_coordinate: unknown | null;
  polygon_coordinates: unknown | null;
};

/**
 * Model Cell_metadata
 *
 */
export type Cell_metadata = {
  cell_id: number;
  metadata_id: string;
  metadata_value: string | null;
};

/**
 * Model Event_log
 *
 */
export type Event_log = {
  event_log_id: number;
  timestamp: Date | null;
  severity: log_severity | null;
  component: string | null;
  message: string | null;
};

/**
 * Model Gateway_beam_association
 *
 */
export type Gateway_beam_association = {
  gateway_id: number;
  polarization: polarization;
  beam_id: number | null;
};

/**
 * Model Kpi_beam
 *
 */
export type Kpi_beam = {
  beam_id: number;
  min_fwd_downlink_c_over_n: number | null;
  max_fwd_downlink_c_over_n: number | null;
  avg_fwd_downlink_c_over_n: number | null;
  min_rtn_uplink_c_over_n: number | null;
  max_rtn_uplink_c_over_n: number | null;
  avg_rtn_uplink_c_over_n: number | null;
  min_fwd_downlink_aggregate_c_over_i: number | null;
  max_fwd_downlink_aggregate_c_over_i: number | null;
  avg_fwd_downlink_aggregate_c_over_i: number | null;
  min_rtn_uplink_aggregate_c_over_i: number | null;
  max_rtn_uplink_aggregate_c_over_i: number | null;
  avg_rtn_uplink_aggregate_c_over_i: number | null;
  min_rtn_uplink_eirp: number | null;
  max_rtn_uplink_eirp: number | null;
  avg_rtn_uplink_eirp: number | null;
  min_rtn_uplink_g_over_t: number | null;
  max_rtn_uplink_g_over_t: number | null;
  avg_rtn_uplink_g_over_t: number | null;
  min_fwd_downlink_eirp: number | null;
  max_fwd_downlink_eirp: number | null;
  avg_fwd_downlink_eirp: number | null;
  min_fwd_spectral_efficiency: number | null;
  max_fwd_spectral_efficiency: number | null;
  avg_fwd_spectral_efficiency: number | null;
  min_rtn_spectral_efficiency: number | null;
  max_rtn_spectral_efficiency: number | null;
  avg_rtn_spectral_efficiency: number | null;
  min_fwd_es_over_no: number | null;
  max_fwd_es_over_no: number | null;
  avg_fwd_es_over_no: number | null;
  min_rtn_es_over_no: number | null;
  max_rtn_es_over_no: number | null;
  avg_rtn_es_over_no: number | null;
  aggregate_fwd_allocated_capacity: number | null;
  aggregate_rtn_allocated_capacity: number | null;
  aggregate_fwd_demanded_capacity: number | null;
  aggregate_rtn_demanded_capacity: number | null;
};

/**
 * Model Kpi_gateway
 *
 */
export type Kpi_gateway = {
  gateway_id: number;
  antenna_size: number | null;
};

/**
 * Model Kpi_region
 *
 */
export type Kpi_region = {
  region_id: number;
  avg_satellite_eirp: number | null;
  avg_satellite_g_over_t: number | null;
  avg_fwd_c_over_i: number | null;
  avg_rtn_c_over_i: number | null;
  avg_fwd_c_over_n: number | null;
  avg_fwd_c_over_ni: number | null;
  avg_rtn_c_over_n: number | null;
  avg_fwd_es_over_no: number | null;
  avg_rtn_es_over_no: number | null;
  avg_fwd_spectral_efficiency: number | null;
  avg_rtn_spectral_efficiency: number | null;
  avg_fwd_required_capacity: number | null;
  avg_rtn_required_capacity: number | null;
  avg_fwd_allocated_capacity: number | null;
  avg_rtn_allocated_capacity: number | null;
  avg_fwd_capacity_delta: number | null;
  avg_rtn_capacity_delta: number | null;
};

/**
 * Model Kpi_terminal
 *
 */
export type Kpi_terminal = {
  terminal_id: number;
  avg_fwd_downlink_eirp: number | null;
  avg_rtn_uplink_eirp: number | null;
  avg_fwd_spectral_efficiency: number | null;
  avg_rtn_spectral_efficiency: number | null;
  avg_fwd_es_over_no: number | null;
  avg_rtn_es_over_no: number | null;
  fwd_allocated_capacity: number | null;
  rtn_allocated_capacity: number | null;
  fwd_demanded_capacity: number | null;
  rtn_demanded_capacity: number | null;
};

/**
 * Model Link_budget_result
 *
 */
export type Link_budget_result = {
  terminal_id: number;
  beam_id: number;
  baseband_signal_id: number;
  path: link_path;
  uplink_eirp: number | null;
  uplink_gain: number | null;
  uplink_g_over_t: number | null;
  uplink_path_loss: number | null;
  uplink_fade: number | null;
  uplink_noise_bandwidth: number | null;
  uplink_c_over_n: number | null;
  uplink_signal_power: number | null;
  uplink_adjacent_beam_interference: number | null;
  uplink_rx_cross_pol_interference: number | null;
  uplink_tx_cross_pol_interference: number | null;
  uplink_intermod: number | null;
  uplink_aggregate_c_over_i: number | null;
  downlink_eirp: number | null;
  downlink_gain: number | null;
  downlink_g_over_t: number | null;
  downlink_path_loss: number | null;
  downlink_fade: number | null;
  downlink_noise_bandwidth: number | null;
  downlink_c_over_n: number | null;
  downlink_signal_power: number | null;
  downlink_adjacent_beam_interference: number | null;
  downlink_rx_cross_pol_interference: number | null;
  downlink_tx_cross_pol_interference: number | null;
  downlink_intermod: number | null;
  downlink_aggregate_c_over_i: number | null;
  es_no: number | null;
  bits_per_symbol: number | null;
};

/**
 * Model Mobility_history
 *
 */
export type Mobility_history = {
  terminal_id: number;
  time: Date;
  position: unknown | null;
};

/**
 * Model Mobility_route_point
 *
 */
export type Mobility_route_point = {
  terminal_id: number;
  time: Date;
  position: unknown | null;
};

/**
 * Model Status_beam
 *
 */
export type Status_beam = {
  beam_id: number;
  status: status | null;
  forward_loading_ratio: number | null;
  return_loading_ratio: number | null;
};

/**
 * Model Status_gateway
 *
 */
export type Status_gateway = {
  gateway_id: number;
  status: status | null;
};

/**
 * Model Status_terminal
 *
 */
export type Status_terminal = {
  terminal_id: number;
  status: status | null;
};

/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const beam_type = {
  Fixed: 'Fixed',
  Uniform: 'Uniform',
  Non_uniform: 'Non_uniform',
  Follow_me: 'Follow_me',
};

export type beam_type = (typeof beam_type)[keyof typeof beam_type];

export const frequency_band = {
  C: 'C',
  Ku: 'Ku',
  Ka: 'Ka',
  Q: 'Q',
  V: 'V',
};

export type frequency_band = (typeof frequency_band)[keyof typeof frequency_band];

export const gain_mode = {
  ALC: 'ALC',
  FGM: 'FGM',
};

export type gain_mode = (typeof gain_mode)[keyof typeof gain_mode];

export const link_direction = {
  UpLink: 'UpLink',
  DownLink: 'DownLink',
};

export type link_direction = (typeof link_direction)[keyof typeof link_direction];

export const link_path = {
  ForwardPath: 'ForwardPath',
  ReturnPath: 'ReturnPath',
};

export type link_path = (typeof link_path)[keyof typeof link_path];

export const log_severity = {
  Info: 'Info',
  Warning: 'Warning',
  Error: 'Error',
  Critical: 'Critical',
};

export type log_severity = (typeof log_severity)[keyof typeof log_severity];

export const plan_request_status = {
  New: 'New',
  Ready: 'Ready',
  In_Progress: 'In_Progress',
  Completed: 'Completed',
  Failed: 'Failed',
};

export type plan_request_status =
  (typeof plan_request_status)[keyof typeof plan_request_status];

export const polarization = {
  LHCP: 'LHCP',
  RHCP: 'RHCP',
  VLP: 'VLP',
  HLP: 'HLP',
};

export type polarization = (typeof polarization)[keyof typeof polarization];

export const service_segment_data_type = {
  Data: 'Data',
  Bandwidth: 'Bandwidth',
};

export type service_segment_data_type =
  (typeof service_segment_data_type)[keyof typeof service_segment_data_type];

export const service_segment_type = {
  DTH: 'DTH',
  Gateway: 'Gateway',
  Trunking_Steerable_Down_Steerable_Up: 'Trunking_Steerable_Down_Steerable_Up',
  Trunking_Steerable_Down_Phased_Array_Up: 'Trunking_Steerable_Down_Phased_Array_Up',
  Trunking_Phased_Array_Down_Steerable_Up: 'Trunking_Phased_Array_Down_Steerable_Up',
  Trunking_Phased_Array_Down_Phased_Array_Up:
    'Trunking_Phased_Array_Down_Phased_Array_Up',
  Mobile_Grid_Beam: 'Mobile_Grid_Beam',
  Mobile_Follow_Me: 'Mobile_Follow_Me',
  Point_to_Point: 'Point_to_Point',
  Multicast_Terminal: 'Multicast_Terminal',
};

export type service_segment_type =
  (typeof service_segment_type)[keyof typeof service_segment_type];

export const status = {
  Good: 'Good',
  Warning: 'Warning',
  Critical: 'Critical',
  Unknown: 'Unknown',
};

export type status = (typeof status)[keyof typeof status];

export const terminal_method_type = {
  Population_density: 'Population_density',
  Random_uniform: 'Random_uniform',
  Uniform_grid: 'Uniform_grid',
};

export type terminal_method_type =
  (typeof terminal_method_type)[keyof typeof terminal_method_type];

export const transmit_direction = {
  Transmit: 'Transmit',
  Receive: 'Receive',
};

export type transmit_direction =
  (typeof transmit_direction)[keyof typeof transmit_direction];

export type InternalTerminal = {
  modcod_forward_key?: string;
  modcod_return_key?: string;
  variation_forward_key?: string;
  variation_return_key?: string;
  mobility_path_key?: string;
} & Service_segment_terminal;

export type InternalConnectivity = {
  modcod_key?: string;
  temporal_variation_key?: string;
  uplink_terminal?: number;
  downlink_terminal?: number;
} & Service_segment_connectivity;
