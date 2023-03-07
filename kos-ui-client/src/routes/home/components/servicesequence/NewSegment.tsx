import {
  Dropdown,
  DynamicDropdown,
  FlexContainer,
  FormattedInput,
  GridContainer,
  Switch,
  Text,
  TextField,
  theme,
} from '@kythera/kui-components';
import { useContext, useState } from 'react';

import { useGetAllGroupsQuery } from '../../../../features/segment_process/segment_processSlice';
import { ErrorContext } from './context/ErrorContext';
import { SequenceReducerContext } from './context/SequenceReducer';

export const NewSegmentPage = () => {
  const { state, dispatch } = useContext(SequenceReducerContext);
  const { errors } = useContext(ErrorContext);

  const [serviceType, setServiceType] = useState<{ label: string; value: string }[]>([
    { label: state.service_type, value: state.service_type },
  ]);
  const { data } = useGetAllGroupsQuery();
  return (
    <GridContainer
      gridTemplateColumns="376px 376px"
      gridTemplateRows="1fr 1fr 1fr 1fr"
      gap="16px"
      padding="16px"
      // width="808px"
      height="100%"
      justifyContent="space-around"
      alignItems="center"
    >
      <TextField
        title="Service Segment Name"
        variant={'default'}
        inputProps={{
          style: { width: '100%' },
          onChange: (x) => {
            dispatch({
              type: 'POST_SEGMENT',
              data: { service_segment_name: x.currentTarget.value },
            });
          },
          placeholder: 'Enter service segment name...',
          type: 'text',
          value: state.service_segment_name,
        }}
      />
      <Dropdown
        title="Service Type"
        items={[
          { label: 'DTH', value: 'DTH' },
          { label: 'Point to Point', value: 'Point_to_Point' },
          { label: 'Gateway', value: 'Gateway' },
          {
            label: 'Mobile',
            choices: [
              { label: 'Mobile - Grid', value: 'Mobile_Grid_Beam' },
              { label: 'Mobile - Follow-me', value: 'Mobile_Follow_Me' },
            ],
          },
          {
            label: 'Multicast',
            choices: [
              { label: 'Multicast - Gateway', value: 'Multicast_Gateway' },
              { label: 'Multicast - Terminal', value: 'Multicast_Terminal' },
            ],
          },
          {
            label: 'Trunking',
            choices: [
              {
                label: 'Trunking - Phased Array Down, Phased Array Up',
                value: 'Trunking_Phased_Array_Down_Phased_Array_Up',
              },
              {
                label: 'Trunking - Phased Array Down, Steerable Up',
                value: 'Trunking_Phased_Array_Down_Steerable_Up',
              },
              {
                label: 'Trunking - Steerable Down, Phased Array Up',
                value: 'Trunking_Steerable_Down_Phased_Array_Up',
              },
              {
                label: 'Trunking - Steerable Down, Steerable Up',
                value: 'Trunking_Steerable_Down_Steerable_Up',
              },
            ],
          },
        ]}
        postReturnValue={(x) => {
          setServiceType([x]);
          dispatch({
            type: 'POST_SEGMENT',
            data: { service_type: x.value ?? 'Gateway' },
          });
        }}
        selectedText={serviceType.at(0)?.label}
        error={errors.find((e) => e.field === 'service_type') !== undefined}
        statement={errors.find((e) => e.field === 'service_type')?.message}
      />
      <FormattedInput
        title={'Service Priority'}
        tooltip={''}
        unit={''}
        decimals={0}
        changeFunction={(x) => {
          // console.log(typeof x); // Returns 'number';
          dispatch({ type: 'POST_SEGMENT', data: { segment_priority: x } });
        }}
        value={state.segment_priority}
        variant={errors.find((e) => e.field === 'segment_priority') ? 'error' : 'default'}
        statement={errors.find((e) => e.field === 'segment_priority')?.message}
      />
      <Dropdown
        title="Data Type"
        selectedText={state.data_type}
        items={[
          { label: 'Bandwidth Service', value: 'Bandwidth' },
          { label: 'Data Service', value: 'Data' },
        ]}
        postReturnValue={(x) => {
          dispatch({
            type: 'POST_SEGMENT',
            data: {
              data_type: (x?.value as 'Data' | 'Bandwidth') ?? 'Bandwidth',
            },
          });
        }}
        error={errors.find((e) => e.field === 'data_type') !== undefined}
        statement={errors.find((e) => e.field === 'data_type')?.message}
      />
      <DynamicDropdown
        title="Associated Group"
        options={[
          ...(data?.map((g) => {
            return {
              label: g.service_segment_group_name,
              value: g.id,
            };
          }) ?? []),
        ]}
        returnPropertyFunction={(x) => {
          const group =
            typeof x === 'string'
              ? data?.find((gr) => gr.service_segment_group_name === x)?.id ?? x
              : x.value;
          dispatch({
            type: 'POST_SEGMENT',
            data: {
              service_segment_associated_group: group ?? x,
            },
          });
        }}
        error={
          errors.find((e) => e.field === 'service_segment_associated_group') !== undefined
        }
        statement={
          errors.find((e) => e.field === 'service_segment_associated_group')?.message
        }
      />
      <Dropdown
        title="Gain Mode"
        selectedText={state.service_segment_gain_mode}
        items={[
          { label: 'ALC', value: 'ALC' },
          { label: 'FGM', value: 'FGM' },
        ]}
        postReturnValue={(x) => {
          dispatch({
            type: 'POST_SEGMENT',
            data: {
              service_segment_gain_mode: (x?.value as 'ALC' | 'FGM') ?? 'ALC',
            },
          });
        }}
      />
      <FlexContainer
        flexDirection="row"
        justifyContent="space-between"
        gap="8px"
        style={{
          flexGrow: 1,
          border: '1px solid white',
          borderRadius: '8px',
          padding: '13px 16px',
          height: '46px',
          alignItems: 'center',
        }}
      >
        <Text tag="heading" variant="T3" weight="medium" style={{ color: 'white' }}>
          {'Defragmentation'}
        </Text>
        <Switch
          isChecked={state.defrag_userlink_allowed}
          onToggle={(e) => {
            dispatch({
              type: 'POST_SEGMENT',
              data: { defrag_userlink_allowed: e },
            });
          }}
        />
      </FlexContainer>
      <FlexContainer
        flexDirection="row"
        justifyContent="space-between"
        gap="8px"
        style={{
          flexGrow: 1,
          border: '1px solid white',
          borderRadius: '8px',
          padding: '13px 16px',
          height: '46px',
          alignItems: 'center',
        }}
      >
        <Text tag="heading" variant="T3" weight="medium" style={{ color: 'white' }}>
          {'Gateway Handover'}
        </Text>
        <Switch
          isChecked={state.service_segment_gateway_handover}
          onToggle={(e) => {
            dispatch({
              type: 'POST_SEGMENT',
              data: {
                service_segment_gateway_handover: e,
              },
            });
          }}
        />
      </FlexContainer>
    </GridContainer>
  );
};
