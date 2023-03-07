import { theme } from '@kythera/kui-components';
import styled from 'styled-components';

export const BBButton = styled.button`
  appearance: none;
  background-color: ${theme.colors.greyScale[900]};
  border: none;
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
  height: 100%;
  padding: 12px 16px;
  place-items: center;
  cursor: pointer;
  &:hover {
    background-color: #ffffff22;
  }
`;
