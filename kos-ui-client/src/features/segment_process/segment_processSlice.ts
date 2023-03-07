import {
  Service_segment,
  Service_segment_candidate_beam,
  Service_segment_connectivity,
  Service_segment_connectivity_modcod,
  Service_segment_connectivity_temporal_variation,
  Service_segment_frequency_plan,
  Service_segment_gateway,
  Service_segment_gateway_modem,
  Service_segment_group,
  Service_segment_method_terminal,
  Service_segment_region,
  Service_segment_regulatory_constraint,
  Service_segment_terminal,
} from '../../ts/types/fromPrisma';
import { BigPostTerminal, PlanMeta } from '../../ts/types/plan';
import { apiSlice } from '../api/apiSlice';

export const segment_process = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postCandidateBeamsOptions: builder.mutation<
      void,
      {
        beam_type: 'Uniform' | 'Non_uniform' | 'Follow_me' | 'Fixed';
        beam_diameter: number | undefined;
        spacing: number | undefined;
        beam_diameter_range_min: number | undefined;
        beam_diameter_range_max: number | undefined;
        service_segment_id: number;
      }
    >({
      query: (canBeamsData) => ({
        url: '/candidate-beam',
        credentials: 'include',
        method: 'POST',
        body: canBeamsData,
      }),
    }),
    postCandidateBeamsBeams: builder.mutation<void, Service_segment_candidate_beam[]>({
      query: (canBeamsData) => ({
        url: '/candidate-beam-collection',
        credentials: 'include',
        method: 'POST',
        body: canBeamsData,
      }),
    }),
    postConnectivity: builder.mutation<
      Required<
        Service_segment_connectivity & {
          service_segment_connectivity_temporal_variations: Service_segment_connectivity_temporal_variation[];
          service_segment_connectivity_modcods: Service_segment_connectivity_modcod[];
        }
      >,
      Partial<
        Service_segment_connectivity & {
          service_segment_connectivity_temporal_variations: Service_segment_connectivity_temporal_variation[];
          service_segment_connectivity_modcods: Service_segment_connectivity_modcod[];
        }
      >
    >({
      query: (connectivity) => ({
        url: `/connectivity-collection`,
        credentials: 'include',
        method: 'post',
        body: connectivity,
      }),
    }),
    postConstraint: builder.mutation<unknown, unknown>({
      query: (constraint) => ({
        url: `/constraint`,
        credentials: 'include',
        method: 'post',
        body: constraint,
      }),
    }),
    postConstraints: builder.mutation<
      Required<Service_segment_regulatory_constraint>[],
      Service_segment_regulatory_constraint[]
    >({
      query: (constraints) => ({
        url: `/constraint-collection`,
        credentials: 'include',
        method: 'post',
        body: constraints,
      }),
    }),
    createParamIDs: builder.mutation<
      Required<Service_segment_frequency_plan>[],
      Service_segment_frequency_plan[]
    >({
      query: (params) => ({
        url: '/service-param-collection',
        credentials: 'include',
        method: 'POST',
        body: params,
      }),
    }),
    getNewPlanID: builder.mutation<Required<PlanMeta>, PlanMeta>({
      query: (newPlan) => ({
        url: '/plan',
        credentials: 'include',
        method: 'POST',
        body: newPlan,
      }),
    }),
    getAllSegments: builder.query<Required<Service_segment_gateway>[], void>({
      query: () => ({
        url: '/service-segment',
        credentials: 'include',
        method: 'GET',
      }),
    }),
    postNewTerminal: builder.mutation<Required<BigPostTerminal>, BigPostTerminal>({
      query: (body) => ({
        url: '/segment-terminal',
        credentials: 'include',
        method: 'POST',
        body: body,
      }),
    }),
    postNewTerminals: builder.mutation<Required<BigPostTerminal>[], BigPostTerminal[]>({
      query: (body) => ({
        url: '/segment-terminal-collection',
        credentials: 'include',
        method: 'POST',
        body: body,
      }),
    }),
    postNewGroup: builder.mutation<
      Required<Service_segment_group>,
      { service_segment_group_name: string }
    >({
      query: (groupData) => ({
        url: '/segment-group',
        credentials: 'include',
        method: 'post',
        body: groupData,
      }),
    }),
    getAllGroups: builder.query<Required<Service_segment_group>[], void>({
      query: () => ({
        url: '/segment-group',
        credentials: 'include',
        method: 'get',
      }),
    }),
    postNewSegment: builder.mutation<Required<Service_segment>, Service_segment>({
      query: (newServiceSegment) => ({
        url: '/service-segment',
        credentials: 'include',
        method: 'post',
        body: newServiceSegment,
      }),
    }),
    postMethodTerminals: builder.mutation<void, Service_segment_method_terminal>({
      query: (method) => ({
        url: '/method-terminal',
        credentials: 'include',
        method: 'post',
        body: method,
      }),
    }),
    getAllSegmentTerminals: builder.query<Required<Service_segment_terminal>[], void>({
      query: () => ({
        url: '/segment-terminal',
        credentials: 'include',
        method: 'get',
      }),
    }),
    postModem: builder.mutation<
      Required<Service_segment_gateway_modem>,
      Service_segment_gateway_modem
    >({
      query: (gateway) => ({
        url: `/gateway-modem`,
        credentials: 'include',
        method: 'post',
        body: gateway,
      }),
    }),
    postModems: builder.mutation<
      Required<Service_segment_gateway_modem>[],
      Service_segment_gateway_modem[]
    >({
      query: (gateway) => ({
        url: `/gateway-modem-collection`,
        credentials: 'include',
        method: 'post',
        body: gateway,
      }),
    }),
    getSegmentGateways: builder.mutation<
      Required<Service_segment_gateway>,
      Service_segment
    >({
      query: (segment) => ({
        url: `/segment-gateway/${segment.id}`,
        credentials: 'include',
        method: 'get',
        body: segment,
      }),
    }),
    getServiceGateways: builder.query<Required<Service_segment_gateway>[], void>({
      query: () => ({
        url: `/segment-gateway`,
        credentials: 'include',
        method: 'get',
      }),
    }),
    postGateways: builder.mutation<
      Required<Service_segment_gateway>,
      Service_segment_gateway
    >({
      query: (gateway) => ({
        url: `/segment-gateway`,
        credentials: 'include',
        method: 'post',
        body: gateway,
      }),
    }),
    postManyGateways: builder.mutation<
      Required<Service_segment_gateway>[],
      Partial<Service_segment_gateway>[]
    >({
      query: (gateway) => ({
        url: `/segment-gateway-collection`,
        credentials: 'include',
        method: 'post',
        body: gateway,
      }),
    }),
    patchPlan: builder.mutation<void, { plan_id: number | undefined; status: string }>({
      query: (status) => ({
        url: `/plan/${status.plan_id}`,
        credentials: 'include',
        method: 'PATCH',
        body: JSON.stringify({ status: status.status }),
      }),
    }),
    getRegionsPerSegment: builder.query<Service_segment_region[], string>({
      query: (segment_id) => ({
        url: `/service-segment/region/${segment_id}`,
        credentials: 'include',
        method: 'get',
      }),
    }),
    patchRegions: builder.mutation<
      Required<Service_segment_region>[],
      Required<Service_segment_region>[]
    >({
      query: (body) => ({
        url: `/region-collection`,
        credentials: 'include',
        method: 'PATCH',
        body,
      }),
    }),
    postRegion: builder.mutation<unknown, unknown>({
      query: (region) => ({
        url: `/region`,
        credentials: 'include',
        method: 'post',
        body: region,
      }),
    }),
    postRegions: builder.mutation<
      Required<Service_segment_region>[],
      Service_segment_region[]
    >({
      query: (body) => ({
        url: `/region-collection`,
        credentials: 'include',
        method: 'post',
        body: body.map((r) => {
          return {
            ...r,
            coordinates: r.coordinates.at(0)?.map(([a, o]) => {
              return { lat: o, lng: a };
            }),
          };
        }),
        // body,
      }),
      transformResponse: (
        base: {
          id: number;
          region_name: string;
          created_at: Date;
          updated_at: Date;
          service_segment_id: number;
          coordinates: { lat: number; lng: number }[];
        }[],
      ) => {
        return base.map((b) => {
          return {
            ...b,
            coordinates: [
              b.coordinates.map((c) => {
                return [c.lng, c.lat];
              }),
            ],
          };
        });
      },
    }),
  }),
});

export const {
  usePostCandidateBeamsOptionsMutation,
  usePostCandidateBeamsBeamsMutation,
  useCreateParamIDsMutation,
  useGetAllGroupsQuery,
  useGetAllSegmentTerminalsQuery,
  useGetAllSegmentsQuery,
  // useGetNewParamIDMutation,
  useGetNewPlanIDMutation,
  useGetSegmentGatewaysMutation,
  useGetServiceGatewaysQuery,
  usePostConnectivityMutation,
  usePostConstraintMutation,
  usePostConstraintsMutation,
  usePostGatewaysMutation,
  usePostManyGatewaysMutation,
  usePostMethodTerminalsMutation,
  usePostModemMutation,
  usePostModemsMutation,
  usePostNewGroupMutation,
  usePostNewSegmentMutation,
  usePostNewTerminalMutation,
  usePostNewTerminalsMutation,
  usePostRegionMutation,
  usePostRegionsMutation,
  usePatchPlanMutation,
  useGetRegionsPerSegmentQuery,
  usePatchRegionsMutation,
} = segment_process;
