import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { theme } from '@kythera/kui-components';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { ThemeProvider } from 'styled-components';

import reportHandler from './analytics/reportHandler';
import reportWebVitals from './analytics/reportWebVitals';
import { store } from './app/store';
import GlobalStyle from './GlobalStyle';
import AppRouter from './routers/AppRouter';
import { StyledToastContainer } from './styled/toastify/StyledContainer';

if (typeof window !== undefined) {
  injectStyle();
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <StyledToastContainer />
        <AppRouter />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(reportHandler);
