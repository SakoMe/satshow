export type KpiBeam = {
  beam_id: string; // bigint;
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
  min_fwd_downlink_eirp_density: number | null;
  max_fwd_downlink_eirp_density: number | null;
  avg_fwd_downlink_eirp_density: number | null;
  fwd_loading_ratio: number | null;
  fwd_channel_count: number | null;
  fwd_bandwidth_demand: number | null;
  fwd_polarization: number | null;
  fwd_min_frequency: number | null;
  fwd_max_frequency: number | null;
  fwd_allocated_bandwidth: number | null;
  fwd_delta: number | null;
  rtn_loading_ratio: number | null;
  rtn_channel_count: number | null;
  rtn_bandwidth_demand: number | null;
  rtn_polarization: number | null;
  rtn_min_frequency: number | null;
  rtn_max_frequency: number | null;
  rtn_allocated_bandwidth: number | null;
  rtn_delta: number | null;
};

export type KpiTerminal = {
  terminal_id: string; // bigint;
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
  fwd_satellite_eirp_density: number | null;
  fwd_directivity: number | null;
  fwd_c_over_i: number | null;
  fwd_terminal_g_over_t: number | null;
  fwd_c_over_n: number | null;
  fwd_bandwidth_demand: number | null;
  fwd_allocated_bandwidth: number | null;
  fwd_bandwidth_delta: number | null;
  fwd_loading_ratio: number | null;
  rtn_satellite_g_over_t: number | null;
  rtn_directivity: number | null;
  rtn_terminal_eirp_density: number | null;
  rtn_c_over_n: number | null;
  rtn_bandwidth_demand: number | null;
  rtn_allocated_bandwidth: number | null;
  rtn_bandwidth_delta: number | null;
  rtn_loading_ratio: number | null;
};

export type KpiRegion = {
  region_id: string; // bigint;
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
  fwd_aggregate_bandwidth: number | null;
  fwd_aggregate_allocated_bandwidth: number | null;
  fwd_loading_ratio: number | null;
  rtn_aggregate_bandwidth: number | null;
  rtn_aggregate_allocated_bandwidth: number | null;
  rtn_loading_ratio: number | null;
  avg_eirp_density: number | null;
};

export type KpiGateway = {
  gateway_id: string; // bigint;
  antenna_size: number | null;
};