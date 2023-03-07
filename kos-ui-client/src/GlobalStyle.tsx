import { theme } from '@kythera/kui-components';
import { createGlobalStyle } from 'styled-components';

export type ThemeProps = {
  theme: typeof theme;
};

const GlobalStyle = createGlobalStyle<ThemeProps>`
* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

html {
	font-size: 62.5%;
}

body {
	font-family: ${theme.typoGraphy.fontFamily};
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-size: 1.6rem;
	line-height: 1.6;
	width: 100vw;
	height: 100vh;
	display: grid;
	justify-content: center;
	align-content: center;
}
body {
  font-family: ${theme.typoGraphy.fontFamily};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: ${theme.colors.greyScale[100]};
  font-size: 1.6rem;
  line-height: 1.6;
  width: 100vw;
  height: 100vh;
  display: grid;
  justify-content: center;
  align-content: center;
}
`;

export default GlobalStyle;
