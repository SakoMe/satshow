import { theme } from '@kythera/kui-components';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

type RLProps = {
  pos: number;
  visible: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const RoamingLine = styled.div`
  position: absolute;
  height: 40px;
  width: 3px;
  background-color: ${theme.colors.purple[200]};
  margin-right: 45px;
  border-radius: 7px;
  margin-top: ${(props: RLProps) => props.pos ?? 0}px;
  visibility: ${(props: RLProps) => (props.visible ? 'visible' : 'hidden')};
  transition-property: margin-top;
  transition-duration: 70ms;
`;
