import { theme } from '@kythera/kui-components';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: grid;
  grid-template-areas:
    'head head'
    'side body'
    'side bottom';
  grid-template-rows: minmax(48px, min-content) 1fr min-content;
  grid-template-columns: minmax(48px, min-content) auto;
  width: 100vw;
  height: 100vh;
`;

const HeadContainer = styled.div`
  grid-area: head;
  padding-left: 15px;
  padding-right: 15px;
  position: relative;
  z-index: 4;
  background-color: ${theme.colors.greyScale[900]};
  height: 48px;
  box-shadow: 0 0 1px 1px ${theme.colors.greyScale[600]};
  justify-content: start;
  gap: 16px;
  display: grid;
  grid-template-columns: auto repeat(7, min-content);
  align-items: center;
  height: auto;
  gap: 0px;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${theme.colors.greyScale[900]};
  grid-area: bottom;
  z-index: 2;
  box-shadow: 0 0 1px 1px ${theme.colors.greyScale[600]};
`;

const SideContainer = styled.div`
  display: grid;
  grid-template-areas: 'buttons resizable';
  grid-template-columns: 50px auto;
  grid-area: side;
  grid-template-rows: 100%;
  z-index: 3;
  width: 48px;
  box-shadow: 0 0 1px 2px ${theme.colors.greyScale[200]};
`;

const BodyContainer = styled.div`
  grid-area: body;
  flex-flow: row nowrap;
  display: flex;
  position: relative;
  z-index: 1;
`;

export { BodyContainer, BottomContainer, HeadContainer, HomeContainer, SideContainer };
