import { theme } from '@kythera/kui-components';
import styled from 'styled-components';

export const Panel = styled.div`
  width: calc(100% - 16px);
  flex: 1 1;
  display: flex;
  margin: 7.5px 0px 0;
  padding: 8px 8px;
  border-radius: 8px;
  background-color: ${theme.colors.greyScale[800]};
  flex-direction: column;
  color: white;
  overflow-y: scroll;
  position: relative;
  max-height: calc(100vh - 174px);
`;
