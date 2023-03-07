import {
  Button,
  ButtonIcon,
  FlexContainer,
  FlexItem,
  GridContainer,
  Icon,
  PageSetting,
  ProgressBar,
  theme,
} from '@kythera/kui-components';
import { useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';

import { APIError } from '../../../../features/api/apiSlice';
import {
  useCreateParamIDsMutation,
  useGetNewPlanIDMutation,
  usePatchPlanMutation,
  usePatchRegionsMutation,
  usePostCandidateBeamsBeamsMutation,
  usePostCandidateBeamsOptionsMutation,
  usePostConnectivityMutation,
  usePostConstraintsMutation,
  usePostManyGatewaysMutation,
  usePostMethodTerminalsMutation,
  usePostModemsMutation,
  usePostNewGroupMutation,
  usePostNewSegmentMutation,
  usePostNewTerminalsMutation,
  usePostRegionsMutation,
} from '../../../../features/segment_process/segment_processSlice';
import { BigPostTerminal } from '../../../../ts/types/plan';
import { AddGatewayModems } from './AddGatewayModems';
import { AddGateways } from './AddGateways';
import { AddRegions } from './AddRegions';
import { AddConstraints } from './AddRegulatoryConstraints';
import { AddTerminals } from './AddTerminals';
import { CandidateBeams } from './CandidateBeams';
import { Connectivity } from './Connectivity';
import { ErrorContext } from './context/ErrorContext';
import {
  SequenceReducerBase,
  SequenceReducerContext,
  SequenceReducerFunction,
  SequenceReducerType,
} from './context/SequenceReducer';
import { NewPlanPage } from './NewPlan';
import { NewSegmentPage } from './NewSegment';
import { ServiceParams } from './ServiceParams';

export const ServiceSequenceControl = ({ finish }: { finish: (x: string) => void }) => {
  const [postTerminals] = usePostNewTerminalsMutation();
  const [postRegions] = usePostRegionsMutation();
  const [patchRegions] = usePatchRegionsMutation();
  const [postConstraints] = usePostConstraintsMutation();
  const [postConnectivity] = usePostConnectivityMutation();
  const [postParams] = useCreateParamIDsMutation();
  const [postSegment] = usePostNewSegmentMutation();
  const [postMethods] = usePostMethodTerminalsMutation();
  const [postGroup] = usePostNewGroupMutation();
  const [getPId] = useGetNewPlanIDMutation();
  const [postCanBeamsOptions] = usePostCandidateBeamsOptionsMutation();
  const [postCandidateBeams] = usePostCandidateBeamsBeamsMutation();
  const [postGateways] = usePostManyGatewaysMutation();
  const [postModems] = usePostModemsMutation();
  const [patchPlan] = usePatchPlanMutation();
  const [state, dispatch] = useReducer<
    typeof SequenceReducerFunction,
    SequenceReducerType
  >(SequenceReducerFunction, SequenceReducerBase, () => {
    return SequenceReducerBase;
  });
  const [errors, setErrors] = useState<{ message: string; field?: string }[]>([]);
  const [pageCompletion, setPageCompletion] = useState<PageSetting[]>( // Only using the initial setting, should update from store
    (state.service_type === 'Gateway'
      ? [
          'Regions',
          'Service Parameters',
          'Regulatory Constraints',
          'Candidate Cells',
          'Terminals',
          'Add Gateways',
          'Gateway Modems',
        ]
      : state.service_type === 'Multicast_Gateway'
      ? [
          'Regions',
          'Service Parameters',
          'Regulatory Constraints',
          'Candidate Cells',
          'Terminals',
          'Add Gateways',
          'Gateway Modems',
          'Connectivity',
        ]
      : state.service_type === 'DTH'
      ? ['Add Regions', 'Service Parameters', 'Add Constraints', 'Candidate Cells']
      : state.service_type === 'Mobile_Grid_Beam' ||
        state.service_type === 'Mobile_Follow_Me'
      ? [
          'Add Regions',
          'Service Parameters',
          'Add Constraints',
          'Candidate Cells',
          'Terminals',
          'Add Gateways',
          'Gateway Modems',
        ]
      : state.service_type === 'Trunking_Steerable_Down_Steerable_Up' ||
        state.service_type === 'Trunking_Steerable_Down_Phased_Array_Up' ||
        state.service_type === 'Trunking_Phased_Array_Down_Steerable_Up' ||
        state.service_type === 'Trunking_Phased_Array_Down_Phased_Array_Up' ||
        state.service_type === 'Multicast_Terminal' ||
        state.service_type === 'Point_to_Point'
      ? [
          'Regions',
          'Service Parameters',
          'Regulatory Constraints',
          'Candidate Cells',
          'Terminals',
          'Connectivity',
        ]
      : []
    ).map((p) => ({ isCompleted: false, label: p })),
  );
  useEffect(() => {
    setPageCompletion(
      (state.service_type === 'Gateway'
        ? [
            'Regions',
            'Service Parameters',
            'Regulatory Constraints',
            'Candidate Cells',
            'Terminals',
            'Add Gateways',
            'Gateway Modems',
          ]
        : state.service_type === 'Multicast_Gateway'
        ? [
            'Regions',
            'Service Parameters',
            'Regulatory Constraints',
            'Candidate Cells',
            'Terminals',
            'Add Gateways',
            'Gateway Modems',
            'Connectivity',
          ]
        : state.service_type === 'DTH'
        ? ['Add Regions', 'Service Parameters', 'Add Constraints', 'Candidate Cells']
        : state.service_type === 'Mobile_Grid_Beam' ||
          state.service_type === 'Mobile_Follow_Me'
        ? [
            'Add Regions',
            'Service Parameters',
            'Add Constraints',
            'Candidate Cells',
            'Terminals',
            'Add Gateways',
            'Gateway Modems',
          ]
        : state.service_type === 'Trunking_Steerable_Down_Steerable_Up' ||
          state.service_type === 'Trunking_Steerable_Down_Phased_Array_Up' ||
          state.service_type === 'Trunking_Phased_Array_Down_Steerable_Up' ||
          state.service_type === 'Trunking_Phased_Array_Down_Phased_Array_Up' ||
          state.service_type === 'Multicast_Terminal' ||
          state.service_type === 'Point_to_Point'
        ? [
            'Regions',
            'Service Parameters',
            'Regulatory Constraints',
            'Candidate Cells',
            'Terminals',
            'Connectivity',
          ]
        : []
      ).map((p) => ({ isCompleted: false, label: p })),
    );
  }, [state.service_type]);
  const [step, setStep] = useState(-2);
  const handleContinue = () => {
    if (step === -2) {
      getPId({
        number_segments: state.number_segments,
        plan_name: state.plan_name,
        time_period_end: state.time_period_end,
        time_period_start: state.time_period_start,
      })
        .unwrap()
        .then((data) => {
          dispatch({ type: 'RETURN_PLAN', data });
          setPageCompletion((oldPages) =>
            oldPages.map((p, i) => (i === -2 ? { ...p, isCompleted: true } : p)),
          );
        })
        .catch((error: APIError) => {
          error.data.errors?.forEach((e) => toast(e.message));
          setErrors(error.data.errors);
          setStep(-2);
        });
    }
    if (step == -1) {
      // Post the new group, if needed.
      if (typeof state.service_segment_associated_group === 'string') {
        if (
          state.service_segment_associated_group === '' ||
          state.service_segment_associated_group === undefined
        ) {
          setErrors([
            {
              field: 'service_segment_associated_group',
              message: 'Segments must be associated with a group.',
            },
          ]);
          return toast('Segments must be associated with a group.');
        }
        postGroup({
          service_segment_group_name: state.service_segment_associated_group,
        })
          .unwrap()
          .then((data) => {
            dispatch({ type: 'RETURN_GROUP', data });
            postSegment({
              defrag_userlink_allowed: state.defrag_userlink_allowed,
              group_id: data.id,
              service_segment_data_type: state.data_type ?? 'Bandwidth',
              service_segment_gain_mode: state.service_segment_gain_mode,
              service_segment_gateway_handover: state.service_segment_gateway_handover,
              service_segment_name: state.service_segment_name,
              service_segment_priority: state.segment_priority,
              service_segment_type: state.service_type ?? 'DTH',
              plan_id: state.plan_id,
            })
              .unwrap()
              .then((data) => {
                dispatch({ type: 'RETURN_SEGMENT', data });
                setPageCompletion((oldPages) =>
                  oldPages.map((p, i) => (i === -1 ? { ...p, isCompleted: true } : p)),
                );
              })
              .catch((e) => {
                setErrors(e.data.errors);
                toast(e.data.errors.at(0)?.message);
                setStep(-1);
              });
          })
          .catch((e) => {
            console.log(e);
            toast(e.data.errors.at(0)?.message);
            setErrors(e.data.errors);
            setStep(-1);
          });
      } else {
        postSegment({
          defrag_userlink_allowed: state.defrag_userlink_allowed,
          group_id: state.service_segment_associated_group,
          service_segment_data_type: state.data_type ?? 'Bandwidth',
          service_segment_gain_mode: state.service_segment_gain_mode,
          service_segment_gateway_handover: state.service_segment_gateway_handover,
          service_segment_name: state.service_segment_name,
          service_segment_priority: state.segment_priority,
          service_segment_type: state.service_type ?? 'DTH',
          plan_id: state.plan_id,
        })
          .unwrap()
          .then((data) => {
            dispatch({ type: 'RETURN_SEGMENT', data });
            setPageCompletion((oldPages) =>
              oldPages.map((p, i) => (i === -1 ? { ...p, isCompleted: true } : p)),
            );
          })
          .catch((error: APIError) => {
            console.log(error);
            toast(error.data.errors.at(0)?.message);
            setErrors(error.data.errors);
            setStep(-1);
          });
      }
    }
    if (step === 0) {
      if (state.regions.filter((r) => r.id !== undefined).length > 0) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        patchRegions(state.regions.filter((r) => r.id !== undefined));
      }
      if (state.regions.filter((r) => r.id === undefined).length > 0) {
        // Send regions.
        postRegions(
          state.regions
            .filter((r) => r.id === undefined)
            .map((r) => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return { ...r, service_segment_id: state.service_segment_id! };
            }),
        )
          .unwrap()
          .then((r) => {
            dispatch({
              type: 'RETURN_REGIONS',
              data: r,
            });
            setPageCompletion((oldPages) =>
              oldPages.map((p, i) => (i === 0 ? { ...p, isCompleted: true } : p)),
            );
          })
          .catch((error: APIError) => {
            toast(error.data.errors.at(0)?.message);
            setErrors(error.data.errors);
            setStep(0);
          });
      }
    }
    if (step === 1) {
      // Send a request to the server and grab param ids for all the rows that don't have them.
      postParams(state.params)
        .unwrap()
        .then((p) => {
          dispatch({ type: 'RETURN_PARAMS', data: p });
          setPageCompletion((oldPages) =>
            oldPages.map((p, i) => (i === 0 ? { ...p, isCompleted: true } : p)),
          );
        })
        .catch((error: APIError) => {
          toast(error.data.errors.at(0)?.message);
          setErrors(error.data.errors);
          setStep(1);
        });
    }
    if (step === 2) {
      // Send Regulatory Constraints
      postConstraints(state.constraints)
        .unwrap()
        .then((c) => {
          dispatch({ type: 'RETURN_CONSTRAINTS', data: c });
          setPageCompletion((oldPages) =>
            oldPages.map((p, i) => (i === 2 ? { ...p, isCompleted: true } : p)),
          );
        })
        .catch((error: APIError) => {
          toast(error.data.errors.at(0)?.message);
          setErrors(error.data.errors);
          setStep(2);
        });
    }
    if (step === 3) {
      // Don't request beams if the user imported beams
      if (state.candidate_beams.length > 0) {
        postCandidateBeams(
          state.candidate_beams.map((c) => {
            return {
              beam_diameter_range_max: null,
              beam_diameter_range_min: null,
              spacing: null,
              latitude: c.lat,
              longitude: c.long,
              beam_diameter: c.diameter,
              beam_type: null,
              service_segment_candidate_beam_id: c.no,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              service_segment_id: state.service_segment_id!,
            };
          }),
        )
          .unwrap()
          .then(() => {
            if (state.service_type === 'DTH') {
              patchPlan({ plan_id: state.plan_id, status: 'Ready' })
                .then(() => {
                  finish(`${state.service_segment_id}`);
                })
                .catch((e: APIError) => {
                  console.log(e);
                  setErrors(e.data.errors);
                });
            }
            setPageCompletion((oldPages) =>
              oldPages.map((p, i) => (i === 3 ? { ...p, isCompleted: true } : p)),
            );
          })
          .catch((error: APIError) => {
            toast(error.data.errors.at(0)?.message);
            setErrors(error.data.errors);
            setStep(3);
          });
      } else {
        // Request candidate beams.
        postCanBeamsOptions({
          ...state.create_beams_settings,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          service_segment_id: state.service_segment_id!,
        })
          .unwrap()
          .then(() => {
            if (state.service_type === 'DTH') {
              patchPlan({ plan_id: state.plan_id, status: 'Ready' })
                .then(() => {
                  finish(`${state.service_segment_id}`);
                })
                .catch((e) => {
                  console.log(e);
                  setErrors(e.data.errors);
                });
            }
            setPageCompletion((oldPages) =>
              oldPages.map((p, i) => (i === 3 ? { ...p, isCompleted: true } : p)),
            );
          })
          .catch((error: APIError) => {
            toast(error.data.errors.at(0)?.message);
            setErrors(error.data.errors);
            setStep(3);
          });
      }
    }
    if (step === 4) {
      if (
        state.terminal_auto_generation_options.avg_num_of_termninals_per_square_km > 0
      ) {
        postMethods(state.terminal_auto_generation_options)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((e: any) => {
            console.log(e);
            setPageCompletion((oldPages) =>
              oldPages.map((p, i) => (i === 4 ? { ...p, isCompleted: true } : p)),
            );
          })
          .catch((e) => console.log(e));
      } else {
        // Send Terminals here
        const myTerminals: BigPostTerminal[] = state.terminals.map((t) => {
          return {
            terminal_id: t.id,
            eirp: t.eirp,
            gt: t.gt,
            latitude: t.latitude,
            longitude: t.longitude,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            service_segment_id: state.service_segment_id!,
            cir_forward: t.cir_forward,
            cir_return: t.cir_return,
            bandwidth_forward: t.bandwidth_forward,
            bandwidth_return: t.bandwidth_return,
            mir_forward: t.mir_forward,
            mir_return: t.mir_return,
            satellite_eirp: t.satellite_eirp,
            target_availability_forward: t.target_availability_forward,
            target_availability_return: t.target_availability_return,
            flight_paths: state.terminal_flight_paths[t.mobility_path_key ?? ''],
            modcods_forward: state.terminal_modcods_fwd[t.modcod_forward_key ?? ''] ?? [],
            modcods_return: state.terminal_modcods_rtn[t.modcod_return_key ?? ''] ?? [],
            temporal_variations_forward:
              state.terminal_variations_fwd[t.variation_forward_key ?? ''] ?? [],
            temporal_variations_return:
              state.terminal_variations_rtn[t.variation_return_key ?? ''] ?? [],
          };
        });
        postTerminals(myTerminals)
          .unwrap()
          .then((data) => {
            dispatch({ type: 'RETURN_TERMINALS', data });
            setPageCompletion((oldPages) =>
              oldPages.map((p, i) => (i === 4 ? { ...p, isCompleted: true } : p)),
            );
          })
          .catch((e: APIError) => {
            e.data.errors.forEach((err) => toast(`Terminal error: ${err.message}`));
            setErrors(e.data.errors);
            setStep(4);
          });
      }
    }
    if (
      step === 5 &&
      (state.service_type === 'Gateway' ||
        state.service_type === 'Multicast_Gateway' ||
        state.service_type === 'Mobile_Grid_Beam' ||
        state.service_type === 'Mobile_Follow_Me')
    ) {
      // Add Gateways querying for ids for the user generated gateways
      postGateways(state.gateways)
        .unwrap()
        .then((v) => {
          dispatch({ type: 'RETURN_GATEWAYS', data: v });
          setPageCompletion((oldPages) =>
            oldPages.map((p, i) => (i === 5 ? { ...p, isCompleted: true } : p)),
          );
        })
        .catch((e: APIError) => {
          e.data.errors.map((err) => {
            toast(`Gateway error: ${err.message}`);
          });
          setErrors(e.data.errors);
          setStep(5);
        });
    }
    if (
      step === 6 &&
      (state.service_type === 'Gateway' ||
        state.service_type === 'Multicast_Gateway' ||
        state.service_type === 'Mobile_Grid_Beam' ||
        state.service_type === 'Mobile_Follow_Me')
    ) {
      // Post Modems
      postModems(state.modems)
        .unwrap()
        .then((x) => {
          dispatch({ type: 'RETURN_MODEMS', data: x });
          setPageCompletion((oldPages) =>
            oldPages.map((p, i) => (i === 6 ? { ...p, isCompleted: true } : p)),
          );
          if (
            state.service_type === 'Mobile_Follow_Me' ||
            state.service_type === 'Mobile_Grid_Beam' ||
            state.service_type === 'Gateway'
          ) {
            patchPlan({ plan_id: state.plan_id, status: 'Ready' })
              .then(() => {
                finish(`${state.service_segment_id}`);
              })
              .catch((e) => {
                console.log(e);
                setErrors(e.data.errors);
              });
          }
        })
        .catch((error: APIError) => {
          toast(error.data.errors.at(0)?.message);
          setErrors(error.data.errors);
          setStep(6);
        });
    }
    if (
      (step === 5 &&
        (state.service_type === 'Point_to_Point' ||
          state.service_type === 'Multicast_Terminal' ||
          state.service_type === 'Trunking_Phased_Array_Down_Phased_Array_Up' ||
          state.service_type === 'Trunking_Phased_Array_Down_Steerable_Up' ||
          state.service_type === 'Trunking_Steerable_Down_Phased_Array_Up' ||
          state.service_type === 'Trunking_Steerable_Down_Steerable_Up')) ||
      (state.service_type === 'Multicast_Gateway' && step === 7)
    ) {
      // Connectivity
      if (
        'Trunking_Phased_Array_Down_Steerable_Up' === state.service_type ||
        'Trunking_Phased_Array_Down_Phased_Array_Up' === state.service_type ||
        'Trunking_Steerable_Down_Phased_Array_Up' === state.service_type ||
        'Trunking_Steerable_Down_Steerable_Up' === state.service_type ||
        'Multicast_Terminal' === state.service_type ||
        'Multicast_Gateway' === state.service_type ||
        'Point_to_Point' === state.service_type
      ) {
        state.connectivities.forEach((c) => {
          postConnectivity({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            uplink_terminals: [c.uplink_terminal!],
            downlink_terminals: c.downlink_terminals,
            mir: c.mir,
            cir: c.cir,
            availability: c.availability,
            satellite_eirp: c.satellite_eirp,
            bandwidth: c.bandwidth,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            service_segment_id: state.service_segment_id!,
            modcods: state.connectivity_modcods[c.modcod_key ?? ''] ?? [],
            temporal_variations:
              state.connectivity_variations[c.temporal_variation_key ?? ''] ?? [],
          })
            .unwrap()
            .then((rc) => {
              // There's not really a good reason to put this info in state, since it's the last step.
              console.log(rc);
              patchPlan({ plan_id: state.plan_id, status: 'Ready' })
                .then(() => {
                  finish(`${state.service_segment_id}`);
                })
                .catch((e) => {
                  console.log(e);
                  setErrors(e.data.errors);
                });
            })
            .catch((error: APIError) => {
              toast(error.data.errors.at(0)?.message);
              setErrors(error.data.errors);
            });
        });
      }
    }
    setStep((step) => {
      if (step === 3 && state.service_type === 'DTH') return step;
      if (
        (step === 5 &&
          (state.service_type === 'Point_to_Point' ||
            state.service_type === 'Multicast_Terminal' ||
            state.service_type === 'Trunking_Phased_Array_Down_Phased_Array_Up' ||
            state.service_type === 'Trunking_Phased_Array_Down_Steerable_Up' ||
            state.service_type === 'Trunking_Steerable_Down_Phased_Array_Up' ||
            state.service_type === 'Trunking_Steerable_Down_Steerable_Up')) ||
        (state.service_type === 'Multicast_Gateway' && step === 7)
      )
        return step;
      if (
        (state.service_type === 'Mobile_Follow_Me' ||
          state.service_type === 'Mobile_Grid_Beam' ||
          state.service_type === 'Gateway') &&
        step == 6
      )
        return step;
      return step + 1;
    });
  };
  const handleBack = () => {
    if (step < 1) return;
    setStep((step) => step - 1);
  };
  return (
    <GridContainer
      style={{
        backgroundColor: theme.colors.greyScale[900],
        borderRadius: '8px',
        display: 'grid',
        placeItems: 'center',
        gridTemplateRows: 'max-content auto 1fr',
        width: step === -2 ? '708px' : step === -1 ? '808px' : '1600px',
        height: step === -2 ? '302px' : step === -1 ? '460px' : '800px',
      }}
    >
      <FlexContainer
        flexDirection="row"
        justifyContent="space-between"
        style={{
          width: '100%',
          paddingInline: '16px',
          placeItems: 'center',
          borderRadius: '8px 8px 0 0',
          border: `1px solid ${theme.colors.greyScale[700]}`,
          height: '58px',
        }}
      >
        <span
          style={{
            ...theme.typoGraphy.heading['T4-bold'],
            color: theme.colors.greyScale[200],
          }}
        >
          {step === -2
            ? 'New Plan'
            : step === -1
            ? 'New Service Segment'
            : `Service Segment ${state.service_segment_id} (${state.service_type})`}
        </span>
        <ButtonIcon
          onClick={() => finish(`${state.service_segment_id}`)}
          iconTitle={'close'}
          variant="tertiary"
        />
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        style={{
          width: '100%',
          border: `solid ${theme.colors.greyScale[700]}`,
          borderWidth: '0px 1px 0px 1px',
          height: step === -2 ? '188px' : step === -1 ? '346px' : undefined,
        }}
      >
        {step >= 0 && (
          <div
            style={{
              height: '76px',
              width: '100%',
              display: 'grid',
              alignItems: 'center',
            }}
          >
            <ProgressBar pages={pageCompletion} setting={step} />
          </div>
        )}
        <SequenceReducerContext.Provider value={{ state, dispatch }}>
          <ErrorContext.Provider value={{ errors }}>
            {step === -2 && <NewPlanPage />}
            {step === -1 && <NewSegmentPage />}
            {state.service_type === 'Gateway' ? (
              step === 0 ? (
                <AddRegions />
              ) : step === 1 ? (
                <ServiceParams />
              ) : step === 2 ? (
                <AddConstraints />
              ) : step === 3 ? (
                <CandidateBeams />
              ) : step === 4 ? (
                <AddTerminals />
              ) : step === 5 ? (
                <AddGateways />
              ) : step === 6 ? (
                <AddGatewayModems />
              ) : (
                <></>
              )
            ) : state.service_type === 'Multicast_Gateway' ? (
              step === 0 ? (
                <AddRegions />
              ) : step === 1 ? (
                <ServiceParams />
              ) : step === 2 ? (
                <AddConstraints />
              ) : step === 3 ? (
                <CandidateBeams />
              ) : step === 4 ? (
                <AddTerminals />
              ) : step === 5 ? (
                <AddGateways />
              ) : step === 6 ? (
                <AddGatewayModems />
              ) : step === 7 ? (
                <Connectivity />
              ) : (
                <></>
              )
            ) : state.service_type === 'DTH' ? (
              step === 0 ? (
                <AddRegions />
              ) : step === 1 ? (
                <ServiceParams />
              ) : step === 2 ? (
                <AddConstraints />
              ) : step === 3 ? (
                <CandidateBeams />
              ) : step === 4 ? (
                <AddTerminals />
              ) : (
                <></>
              )
            ) : state.service_type === 'Mobile_Grid_Beam' ||
              state.service_type === 'Mobile_Follow_Me' ? (
              step === 0 ? (
                <AddRegions />
              ) : step === 1 ? (
                <ServiceParams />
              ) : step === 2 ? (
                <AddConstraints />
              ) : step === 3 ? (
                <CandidateBeams />
              ) : step === 4 ? (
                <AddTerminals />
              ) : step === 5 ? (
                <AddGateways />
              ) : step === 6 ? (
                <AddGatewayModems />
              ) : (
                <></>
              )
            ) : state.service_type === 'Trunking_Phased_Array_Down_Phased_Array_Up' ||
              state.service_type === 'Trunking_Phased_Array_Down_Steerable_Up' ||
              state.service_type === 'Trunking_Steerable_Down_Phased_Array_Up' ||
              state.service_type === 'Trunking_Steerable_Down_Steerable_Up' ||
              state.service_type === 'Multicast_Terminal' ||
              state.service_type === 'Point_to_Point' ? (
              step === 0 ? (
                <AddRegions />
              ) : step === 1 ? (
                <ServiceParams />
              ) : step === 2 ? (
                <AddConstraints />
              ) : step === 3 ? (
                <CandidateBeams />
              ) : step === 4 ? (
                <AddTerminals />
              ) : step === 5 ? (
                <Connectivity />
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </ErrorContext.Provider>
        </SequenceReducerContext.Provider>
      </FlexContainer>
      <FlexContainer
        alignContent={'center'}
        flexDirection={'row'}
        alignItems={'center'}
        flexWrap={'nowrap'}
        gap={'15px'}
        justifyContent={'end'}
        width="100%"
        height="56px"
        style={{
          border: `1px solid ${theme.colors.greyScale[700]}`,
          borderWidth: '1px',
          borderRadius: '0 0 8px 8px',
          padding: '8px 16px',
        }}
      >
        {step > 0 && (
          <FlexItem marginRight={'auto'} marginLeft={'0'}>
            <Button
              size="medium"
              variant="tertiary"
              onClick={() => {
                setStep(0);
              }}
              style={{ gap: '8px' }}
            >
              {'Reset'}
            </Button>
          </FlexItem>
        )}
        {step > 0 && (
          <FlexItem>
            <Button
              size="medium"
              variant="secondary"
              onClick={() => handleBack()}
              style={{ gap: '8px' }}
            >
              <Icon
                iconTitle="full arrow"
                fill={theme.colors.purple[200]}
                rotation="left"
              />
              {'Back'}
            </Button>
          </FlexItem>
        )}
        <FlexItem>
          <Button
            size="medium"
            variant="primary"
            onClick={() => handleContinue()}
            style={{ gap: '8px' }}
          >
            <span>{step === -2 ? 'Get Started' : 'Continue'}</span>
            <Icon iconTitle="full arrow" fill="black" rotation="right" size={1.8} />
          </Button>
        </FlexItem>
      </FlexContainer>
    </GridContainer>
  );
};
