import {
  DateField,
  FlexContainer,
  FormattedInput,
  TextField,
  theme,
} from '@kythera/kui-components';
import { useContext } from 'react';

import { ErrorContext } from './context/ErrorContext';
import { SequenceReducerContext } from './context/SequenceReducer';

export const NewPlanPage = () => {
  const { state, dispatch } = useContext(SequenceReducerContext);
  const { errors } = useContext(ErrorContext);
  const handleSetDate1 = (x: Date) => {
    dispatch({ type: 'POST_PLAN', data: { time_period_start: x } });
  };
  const handleSetDate2 = (x: Date) => {
    dispatch({ type: 'POST_PLAN', data: { time_period_end: x } });
  };
  return (
    <FlexContainer
      flexDirection="column"
      gap="16px"
      padding="16px"
      justifyContent="space-around"
      height="100%"
    >
      <FlexContainer flexDirection="row" gap="18px" justifyContent="space-between">
        <TextField
          title="Plan Name"
          inputProps={{
            type: 'text',
            value: state.plan_name,
            onChange: (x) => {
              dispatch({
                type: 'POST_PLAN',
                data: { plan_name: x.currentTarget.value },
              });
            },
            placeholder: 'Enter plan name...',
          }}
          variant={
            errors.find((e) => e.field === 'plan_name') !== undefined
              ? 'error'
              : 'default'
          }
        />
        <FormattedInput
          title={'No. of Plan Segments'}
          value={state.number_segments}
          decimals={0}
          tooltip={''}
          unit={''}
          changeFunction={(x) =>
            dispatch({ type: 'POST_PLAN', data: { number_segments: x } })
          }
          variant={
            errors.find((e) => e.field === 'number_segments') !== undefined
              ? 'error'
              : 'default'
          }
          error={errors.find((e) => e.field === 'number_segments') !== undefined}
          statement={errors.find((e) => e.field === 'number_segments')?.message}
        />
      </FlexContainer>
      <FlexContainer flexDirection="column" gap="8px" width="100%">
        <span
          style={{
            ...theme.typoGraphy.heading['T3-medium'],
            color: 'white',
            whiteSpace: 'nowrap',
            alignSelf: 'start',
          }}
        >
          {'Time Period'}
        </span>
        <FlexContainer flexDirection="row" gap="8px" justifyContent="space-between">
          <DateField
            date={state.time_period_start}
            postDateReturn={(d) => handleSetDate1(d)}
          />
          <span style={{ color: 'white' }}>{' - '}</span>
          <DateField
            date={state.time_period_end}
            postDateReturn={(d) => handleSetDate2(d)}
          />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
