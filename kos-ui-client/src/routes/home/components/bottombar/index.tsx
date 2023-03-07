import { Datatable, FlexContainer } from '@kythera/kui-components';
import { theme } from '@kythera/kui-components';
import { Resizable } from 're-resizable';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../../app/store';
import {
  highlightRow,
  SelectAllBeams,
} from '../../../../features/new_layers/beamsLayerSlice';
import { BBButton } from './bottombarbuttoncontainer';
import { TimeComponent } from './timedisplay';

export const BottomBarContent = () => {
  const [datatableSetting, setDatatableSetting] = useState<'cells' | 'logs'>();
  const handleSwitch = (title: 'cells' | 'logs') => {
    setDatatableSetting((previousSetting) =>
      title === previousSetting ? undefined : title,
    );
  };
  const dispatch = useDispatch();
  // This will be swapped to the KPI part of the state.
  // Will need to be flexible enough to dispatch to different parts of state depending on what KPI is selected, for gateways or otherwise
  const storeBeams = useSelector((state: RootState) => SelectAllBeams(state.beams));
  return (
    <FlexContainer
      flexDirection="column"
      style={{
        backgroundColor: theme.colors.greyScale[900],
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <FlexContainer style={{ height: '48px', width: '100%' }} flexDirection={'row'}>
        {/* Buttons */}
        <BBButton
          onClick={() => handleSwitch('cells')}
          style={{
            ...(datatableSetting === 'cells'
              ? {
                  boxShadow: `inset 0 -2px 0 0 ${theme.colors.purple[200]}`,
                  color: theme.colors.purple[200],
                }
              : { color: theme.colors.greyScale[200] }),
            ...theme.typoGraphy.action['T3-medium'],
          }}
        >
          {'Data Table'}
        </BBButton>
        <BBButton
          onClick={() => handleSwitch('logs')}
          style={{
            ...(datatableSetting === 'logs'
              ? {
                  boxShadow: `inset 0 -2px 0 0 ${theme.colors.purple[200]}`,
                  color: theme.colors.purple[200],
                }
              : { color: theme.colors.greyScale[200] }),
            ...theme.typoGraphy.action['T3-medium'],
          }}
        >
          {'Logs'}
        </BBButton>
        <TimeComponent />
      </FlexContainer>
      {/* Expanded container */}
      {datatableSetting !== undefined && (
        <Resizable
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}
          enable={{ top: true }}
          minHeight={'200px'}
          maxHeight={'600px'}
          defaultSize={{ width: '100%', height: '200px' }}
          as={'section'}
        >
          {/* Secondary resizable for resizing the layers and logs horizontally */}
          {datatableSetting === 'cells' && (
            // Datatable component for the table
            <Datatable
              dataColumns={[{ header: 'Cell ID', key: 'cell_id', type: 'string' }]}
              data={storeBeams.map((b) => ({ ...b.properties }))}
              noRowsMessage={'No rows.'}
              setData={() => null}
              clickRow={(clickedRow) => dispatch(highlightRow(clickedRow.cell_id))}
            />
          )}
          {/* Datatable component for the logs */}
          {datatableSetting === 'logs' && (
            <Datatable
              dataColumns={[]}
              data={[]}
              noRowsMessage={'No logs.'}
              setData={() => null}
              clickRow={() => null}
            />
          )}
        </Resizable>
      )}
    </FlexContainer>
  );
};
