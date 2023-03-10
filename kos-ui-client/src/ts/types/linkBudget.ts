export type LinkBudgetResult = {
  terminal_id?: string; // bigint;
  beam_id?: string; // bigint;
  baseband_signal_id?: string; // bigint;
  path?: 'ForwardPath' | 'ReturnPath';
  uplink_eirp?: number;
  uplink_gain?: number;
  uplink_g_over_t?: number;
  uplink_path_loss?: number;
  uplink_fade?: number;
  uplink_noise_bandwidth?: number;
  uplink_c_over_n?: number;
  uplink_signal_power?: number;
  uplink_adjacent_beam_interference?: number;
  uplink_rx_cross_pol_interference?: number;
  uplink_tx_cross_pol_interference?: number;
  uplink_intermod?: number;
  uplink_aggregate_c_over_i?: number;
  downlink_eirp?: number;
  downlink_gain?: number;
  downlink_g_over_t?: number;
  downlink_path_loss?: number;
  downlink_fade?: number;
  downlink_noise_bandwidth?: number;
  downlink_c_over_n?: number;
  downlink_signal_power?: number;
  downlink_adjacent_beam_interference?: number;
  downlink_rx_cross_pol_interference?: number;
  downlink_tx_cross_pol_interference?: number;
  downlink_intermod?: number;
  downlink_aggregate_c_over_i?: number;
  es_no?: number;
  bits_per_symbol?: number;
};
