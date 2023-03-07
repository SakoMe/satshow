import { ButtonIcon, Divider, FlexContainer, Icon, theme } from '@kythera/kui-components';

import { RoamingLine } from './RoamingLine';

type SBProps = {
  selectedButton: number | undefined;
  selectButton: (n: number | undefined) => void;
  zoomControls: {
    zoom: number;
    incrementZoom: (x: number) => void;
  };
};

export const SideBar = ({ zoomControls, selectButton, selectedButton }: SBProps) => {
  return (
    <FlexContainer
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      style={{
        flex: '1',
        gridArea: 'buttons',
        backgroundColor: theme.colors.greyScale[900],
      }}
    >
      <FlexContainer
        flexDirection="column"
        justifyContent="start"
        gap="16px"
        paddingTop="16px"
      >
        <ButtonIcon
          onClick={() => selectButton(0)}
          size={'L'}
          iconTitle="account tree"
          color={selectedButton === 0 ? theme.colors.purple[200] : undefined}
          variant="tertiary"
        />
        <ButtonIcon
          onClick={() => selectButton(1)}
          size={'L'}
          iconTitle="layers"
          color={selectedButton === 1 ? theme.colors.purple[200] : undefined}
          variant="tertiary"
        />
        <ButtonIcon
          onClick={() => selectButton(2)}
          size={'L'}
          iconTitle="notifications active"
          color={selectedButton === 2 ? theme.colors.purple[200] : undefined}
          variant="tertiary"
        />
        <Divider extrapadding={0} />
        <RoamingLine
          pos={selectedButton !== -1 ? 56 * (selectedButton ?? 0) : 0}
          visible={selectedButton !== undefined}
        />
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        justifyContent="end"
        paddingBottom="32px"
        gap="8px"
      >
        <ButtonIcon
          onClick={() => zoomControls.incrementZoom(1)}
          iconTitle="add"
          size="M"
          variant="tertiary"
        />
        <span
          style={{
            ...theme.typoGraphy.paragraph['T3-regular'],
            color: theme.colors.greyScale[200],
            textAlign: 'center',
          }}
        >
          {(zoomControls.zoom * 5).toFixed(0)}%
        </span>
        <ButtonIcon
          onClick={() => zoomControls.incrementZoom(-1)}
          iconTitle="remove"
          size="M"
          variant="tertiary"
        />
      </FlexContainer>
    </FlexContainer>
  );
};
