import * as turf from '@turf/turf';
import { createContext, Dispatch } from 'react';

import {
  InternalConnectivity,
  InternalTerminal,
  Plan_request,
  Service_segment,
  Service_segment_connectivity,
  Service_segment_connectivity_modcod,
  Service_segment_connectivity_temporal_variation,
  Service_segment_frequency_plan,
  Service_segment_gateway,
  Service_segment_gateway_modem,
  Service_segment_group,
  Service_segment_region,
  Service_segment_regulatory_constraint,
  Service_segment_terminal_flight_path,
  Service_segment_terminal_modcod_forward,
  Service_segment_terminal_modcod_return,
  Service_segment_terminal_temporal_variation_forward,
  Service_segment_terminal_temporal_variation_return,
} from '../../../../../ts/types/fromPrisma';
import { BigPostTerminal, CandidateBeam } from '../../../../../ts/types/plan';

export type SequenceReducerType = {
  // Step -2
  plan_name: string;
  number_segments: number;
  time_period_start: Date;
  time_period_end: Date;
  plan_id?: number;
  // Step -1
  service_segment_name: string;
  service_segment_gateway_handover: boolean;
  defrag_userlink_allowed: boolean;
  service_segment_gain_mode: 'ALC' | 'FGM';
  segment_priority: number;
  service_segment_associated_group: number | string;
  service_segment_group_name?: string;
  group_id?: number;
  service_type:
    | 'Gateway'
    | 'Multicast_Gateway'
    | 'DTH'
    | 'Mobile_Grid_Beam'
    | 'Mobile_Follow_Me'
    | 'Point_to_Point'
    | 'Multicast_Terminal'
    | 'Trunking_Steerable_Down_Phased_Array_Up'
    | 'Trunking_Phased_Array_Down_Steerable_Up'
    | 'Trunking_Steerable_Down_Steerable_Up'
    | 'Trunking_Phased_Array_Down_Phased_Array_Up';
  data_type: 'Bandwidth' | 'Data';
  service_segment_id?: number;
  // Step 0
  regions: Service_segment_region[];
  // Step 1
  constraints: Service_segment_regulatory_constraint[];
  // constraint_features: Record<string, turf.Feature>;
  // Step 2
  params: Service_segment_frequency_plan[];
  // Step 3
  create_beams_settings: {
    beam_type: 'Uniform' | 'Non_uniform' | 'Follow_me' | 'Fixed';
    beam_diameter: number | undefined;
    spacing: number | undefined;
    beam_diameter_range_min: number | undefined;
    beam_diameter_range_max: number | undefined;
  };
  candidate_beams: CandidateBeam[];
  // Step 4
  gateways: Service_segment_gateway[];
  // Step 5
  modems: Service_segment_gateway_modem[];
  // Step 6
  terminals: InternalTerminal[];
  terminal_auto_generation_options: {
    terminal_method: 'Uniform_grid' | 'Random_uniform' | 'Population_density';
    avg_num_of_termninals_per_square_km: number;
    method_terminals: InternalTerminal[];
  };
  terminal_modcods_rtn: Record<string, Service_segment_terminal_modcod_return[]>;
  terminal_modcods_fwd: Record<string, Service_segment_terminal_modcod_forward[]>;
  terminal_flight_paths: Record<string, Service_segment_terminal_flight_path[]>;
  terminal_variations_fwd: Record<
    string,
    Service_segment_terminal_temporal_variation_forward[]
  >;
  terminal_variations_rtn: Record<
    string,
    Service_segment_terminal_temporal_variation_return[]
  >;
  // Step 7
  connectivities: InternalConnectivity[];
  connectivity_modcods: Record<string, Service_segment_connectivity_modcod[]>;
  connectivity_variations: Record<
    string,
    Service_segment_connectivity_temporal_variation[]
  >;
};

export type SequenceReducerActions =
  | {
      type: 'POST_PLAN';
      data: {
        plan_name?: string;
        number_segments?: number;
        time_period_start?: Date;
        time_period_end?: Date;
      };
    }
  | {
      type: 'POST_SEGMENT';
      data: {
        service_segment_gain_mode?: 'ALC' | 'FGM';
        service_segment_gateway_handover?: boolean;
        defrag_userlink_allowed?: boolean;
        service_segment_name?: string;
        segment_priority?: number;
        service_segment_associated_group?: number | string | undefined;
        service_segment_group_name?: string;
        service_segment_group_id?: number;
        service_type?:
          | 'Gateway'
          | 'Multicast_Gateway'
          | 'DTH'
          | 'Mobile_Grid_Beam'
          | 'Mobile_Follow_Me'
          | 'Point_to_Point'
          | 'Multicast_Terminal'
          | 'Trunking_Steerable_Down_Phased_Array_Up'
          | 'Trunking_Phased_Array_Down_Steerable_Up'
          | 'Trunking_Steerable_Down_Steerable_Up'
          | 'Trunking_Phased_Array_Down_Phased_Array_Up';
        data_type?: 'Bandwidth' | 'Data';
        service_segment_id?: number;
      };
    }
  | {
      type: 'POST_REGIONS';
      data: {
        regions?: Service_segment_region[];
      };
    }
  | {
      type: 'POST_CONSTRAINTS';
      data: {
        constraints?: Service_segment_regulatory_constraint[];
        constraint_features?: Record<string, turf.Feature>;
      };
    }
  | {
      type: 'POST_PARAMS';
      data: {
        params?: Service_segment_frequency_plan[];
      };
    }
  | {
      type: 'POST_BEAMS';
      data: {
        create_beams_settings?: {
          beam_type?: 'Uniform' | 'Non_uniform' | 'Follow_me' | 'Fixed';
          beam_diameter?: number | undefined;
          spacing?: number | undefined;
          beam_diameter_range_min?: number | undefined;
          beam_diameter_range_max?: number | undefined;
        };
        candidate_beams?: CandidateBeam[];
      };
    }
  | {
      type: 'POST_TERMINALS';
      data: {
        terminals?: InternalTerminal[];
        terminal_auto_generation_options?: {
          terminal_method?: 'Uniform_grid' | 'Random_uniform' | 'Population_density';
          avg_num_of_terminals_per_square_km?: number;
          method_terminals?: InternalTerminal[];
        };
        terminal_modcods_rtn?: Record<string, Service_segment_terminal_modcod_return[]>;
        terminal_modcods_fwd?: Record<string, Service_segment_terminal_modcod_forward[]>;
        terminal_flight_paths?: Record<string, Service_segment_terminal_flight_path[]>;
        terminal_variations_fwd?: Record<
          string,
          Service_segment_terminal_temporal_variation_forward[]
        >;
        terminal_variations_rtn?: Record<
          string,
          Service_segment_terminal_temporal_variation_return[]
        >;
      };
    }
  | {
      type: 'POST_GATEWAYS';
      data: {
        gateways?: Service_segment_gateway[];
      };
    }
  | {
      type: 'POST_MODEMS';
      data: {
        modems?: Service_segment_gateway_modem[];
      };
    }
  | {
      type: 'POST_CONNECTIVITIES';
      data: {
        connectivities?: InternalConnectivity[];
        connectivity_modcods?: Record<string, Service_segment_connectivity_modcod[]>;
        connectivity_variations?: Record<
          string,
          Service_segment_connectivity_temporal_variation[]
        >;
      };
    }
  | { type: 'RETURN_PLAN'; data: Plan_request }
  | { type: 'RETURN_SEGMENT'; data: Service_segment }
  | { type: 'RETURN_GROUP'; data: Service_segment_group }
  | { type: 'RETURN_REGIONS'; data: Service_segment_region[] }
  | { type: 'RETURN_CONSTRAINTS'; data: Service_segment_regulatory_constraint[] }
  | { type: 'RETURN_PARAMS'; data: Service_segment_frequency_plan[] }
  | { type: 'RETURN_BEAMS'; data: undefined }
  | { type: 'RETURN_TERMINALS'; data: BigPostTerminal[] }
  | { type: 'RETURN_GATEWAYS'; data: Service_segment_gateway[] }
  | { type: 'RETURN_MODEMS'; data: Service_segment_gateway_modem[] }
  | {
      type: 'RETURN_CONNECTIVITIES';
      data: (Service_segment_connectivity & {
        service_segment_connectivity_temporal_variations: Service_segment_connectivity_temporal_variation[];
        service_segment_connectivity_modcods: Service_segment_connectivity_modcod[];
      })[];
    };

export function SequenceReducerFunction(
  state: SequenceReducerType,
  action: SequenceReducerActions,
): SequenceReducerType {
  switch (action.type) {
    case 'POST_PLAN':
      console.log('STEP_-2');
      return { ...state, ...action.data };
    case 'RETURN_PLAN':
      console.log('STEP_-2');
      return { ...state, plan_id: action.data.id };

    case 'POST_SEGMENT':
      console.log('STEP_-1');
      return { ...state, ...action.data };
    case 'RETURN_SEGMENT':
      console.log('STEP_-1');
      return { ...state, service_segment_id: action.data.id };
    case 'RETURN_GROUP':
      console.log('STEP_-1');
      return { ...state, group_id: action.data.id };

    case 'POST_REGIONS':
      console.log('STEP_0');
      return { ...state, ...action.data };
    case 'RETURN_REGIONS':
      console.log('STEP_0');
      return { ...state, regions: action.data };

    case 'POST_CONSTRAINTS':
      console.log('STEP_1');
      return { ...state, ...action.data };
    case 'RETURN_CONSTRAINTS':
      console.log('STEP_1');
      return { ...state, constraints: [...action.data] };

    case 'POST_PARAMS':
      console.log('STEP_2');
      return { ...state, ...action.data };
    case 'RETURN_PARAMS':
      console.log('STEP_2');
      return { ...state, params: [...action.data] };

    case 'POST_BEAMS':
      console.log('STEP_3');
      action.data;
      return {
        ...state,
        create_beams_settings: {
          beam_diameter_range_max:
            action.data.create_beams_settings?.beam_diameter_range_max ??
            state.create_beams_settings.beam_diameter_range_max,
          beam_diameter_range_min:
            action.data.create_beams_settings?.beam_diameter_range_min ??
            state.create_beams_settings.beam_diameter_range_min,
          beam_type:
            action.data.create_beams_settings?.beam_type ??
            state.create_beams_settings.beam_type,
          beam_diameter:
            action.data.create_beams_settings?.beam_diameter ??
            state.create_beams_settings.beam_diameter,
          spacing:
            action.data.create_beams_settings?.spacing ??
            state.create_beams_settings.spacing,
        },
        candidate_beams: action.data.candidate_beams ?? state.candidate_beams,
      };
    case 'RETURN_BEAMS':
      console.log('STEP_3');
      return { ...state };

    case 'POST_GATEWAYS':
      console.log('STEP_4');
      return { ...state, ...action.data };
    case 'RETURN_GATEWAYS':
      console.log('STEP_4');
      return { ...state, gateways: [...action.data] };

    case 'POST_MODEMS':
      console.log('STEP_5');
      return { ...state, ...action.data };
    case 'RETURN_MODEMS':
      console.log('STEP_5');
      return { ...state, modems: [...action.data] };

    case 'POST_TERMINALS':
      console.log('STEP_6');
      action.data;
      return {
        ...state,
        terminals: action.data.terminals ?? state.terminals,
        terminal_auto_generation_options: {
          terminal_method:
            action.data.terminal_auto_generation_options?.terminal_method ??
            state.terminal_auto_generation_options.terminal_method,
          avg_num_of_termninals_per_square_km:
            action.data.terminal_auto_generation_options
              ?.avg_num_of_terminals_per_square_km ??
            state.terminal_auto_generation_options.avg_num_of_termninals_per_square_km,
          method_terminals:
            action.data.terminal_auto_generation_options?.method_terminals ??
            state.terminal_auto_generation_options.method_terminals,
        },
        terminal_modcods_fwd:
          action.data.terminal_modcods_fwd ?? state.terminal_modcods_fwd,
        terminal_modcods_rtn:
          action.data.terminal_modcods_rtn ?? state.terminal_modcods_rtn,
        terminal_variations_fwd:
          action.data.terminal_variations_fwd ?? state.terminal_variations_fwd,
        terminal_variations_rtn:
          action.data.terminal_variations_rtn ?? state.terminal_variations_rtn,
      };
    case 'RETURN_TERMINALS':
      console.log('STEP_6');
      return {
        ...state,
        terminal_flight_paths: {
          ...state.terminal_flight_paths,
          ...Object.fromEntries(
            action.data.map((t) => {
              return [`${t.id}`, t.flight_paths];
            }),
          ),
        },
        terminal_modcods_rtn: {
          ...state.terminal_modcods_rtn,
          ...Object.fromEntries(
            action.data.map((t) => {
              return [`${t.id}`, t.modcods_forward];
            }),
          ),
        },
        terminal_modcods_fwd: {
          ...state.terminal_modcods_rtn,
          ...Object.fromEntries(
            action.data.map((t) => {
              return [`${t.id}`, t.modcods_return];
            }),
          ),
        },
        terminal_variations_fwd: {
          ...state.terminal_variations_fwd,
          ...Object.fromEntries(
            action.data.map((t) => {
              return [`${t.id}`, t.temporal_variations_forward];
            }),
          ),
        },
        terminal_variations_rtn: {
          ...state.terminal_variations_rtn,
          ...Object.fromEntries(
            action.data.map((t) => {
              return [`${t.id}`, t.temporal_variations_return];
            }),
          ),
        },
        terminals: [
          ...state.terminals,
          ...action.data.map((t) => {
            return {
              ...t,
              variation_forward_key: `${t.id}`,
              variation_return_key: `${t.id}`,
              modcod_forward_key: `${t.id}`,
              modcod_return_key: `${t.id}`,
              mobility_path_key: `${t.id}`,
            };
          }),
        ],
      };

    case 'POST_CONNECTIVITIES':
      console.log('STEP_7');
      if (
        state.service_type === 'Point_to_Point' ||
        state.service_type === 'Trunking_Phased_Array_Down_Phased_Array_Up' ||
        state.service_type === 'Trunking_Steerable_Down_Phased_Array_Up' ||
        state.service_type === 'Trunking_Phased_Array_Down_Steerable_Up' ||
        state.service_type === 'Trunking_Steerable_Down_Steerable_Up'
      ) {
        return {
          ...state,
          ...action.data,
          connectivities:
            action.data.connectivities?.map((c) => {
              return {
                ...c,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                downlink_terminals: [c.downlink_terminal!],
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                uplink_terminals: [c.uplink_terminal!],
              };
            }) ?? state.connectivities,
        };
      }
      if (
        state.service_type === 'Multicast_Gateway' ||
        state.service_type === 'Multicast_Terminal'
      ) {
        return {
          ...state,
          ...action.data,
          connectivities:
            action.data.connectivities?.map((c) => {
              return {
                ...c,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                uplink_terminals: [c.uplink_terminal!],
              };
            }) ?? state.connectivities,
        };
      }
      return { ...state, ...action.data };
    case 'RETURN_CONNECTIVITIES':
      console.log('STEP_7');
      return state;
    default:
      return state;
  }
}

export const SequenceReducerContext = createContext<{
  state: SequenceReducerType;
  dispatch: Dispatch<SequenceReducerActions>;
}>({ state: {} as SequenceReducerType, dispatch: () => null });

export const SequenceReducerBase: SequenceReducerType = {
  candidate_beams: [],
  connectivities: [],
  connectivity_modcods: {},
  connectivity_variations: {},
  constraints: [],
  // constraint_features: {},
  create_beams_settings: {
    beam_diameter_range_max: 0,
    beam_diameter_range_min: 0,
    beam_type: 'Fixed',
    beam_diameter: 0,
    spacing: 0,
  },
  data_type: 'Bandwidth',
  defrag_userlink_allowed: false,
  gateways: [],
  modems: [],
  number_segments: 0,
  params: [],
  plan_name: '',
  regions: [],
  segment_priority: 0,
  service_segment_associated_group: '',
  service_segment_gain_mode: 'ALC',
  service_segment_gateway_handover: false,
  service_segment_name: '',
  service_type: 'DTH',
  terminal_auto_generation_options: {
    avg_num_of_termninals_per_square_km: 0,
    method_terminals: [],
    terminal_method: 'Population_density',
  },
  terminal_flight_paths: {},
  terminal_modcods_fwd: {},
  terminal_modcods_rtn: {},
  terminal_variations_fwd: {},
  terminal_variations_rtn: {},
  terminals: [],
  time_period_end: new Date(),
  time_period_start: new Date(),
  plan_id: undefined,
  group_id: undefined,
  service_segment_group_name: '',
  service_segment_id: undefined,
};
