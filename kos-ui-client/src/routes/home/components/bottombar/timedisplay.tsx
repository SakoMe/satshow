import { Calendar, Icon } from '@kythera/kui-components';
import { theme } from '@kythera/kui-components';
import { useState } from 'react';

import { useDate } from '../../../../hooks/useDate';
import { BBButton } from './bottombarbuttoncontainer';

export const TimeComponent = () => {
  const [isLive, setLive] = useState(true);
  const [open, setOpen] = useState(false);
  const { date } = useDate();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginLeft: 'auto',
        height: '100%',
        maxHeight: '100%',
      }}
    >
      <BBButton onClick={() => setLive(!isLive)}>
        <Icon iconTitle="circle" />
        <span style={{ color: 'white', ...theme.typoGraphy.action['T3-medium'] }}>
          {'Live'}
        </span>
      </BBButton>
      <BBButton onClick={() => setOpen(!open)}>
        <span
          style={{
            minWidth: '200px',
            textAlign: 'center',
            color: 'white',
            ...theme.typoGraphy.action['T3-medium'],
          }}
        >
          {date.toISOString()}
        </span>
      </BBButton>
      <div
        style={{
          position: 'absolute',
          marginTop: -475,
          display: open ? 'block' : 'none',
        }}
      >
        <Calendar
          initialDate={new Date()}
          setInitialDate={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </div>
    </div>
  );
};
