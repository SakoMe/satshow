import { theme } from '@kythera/kui-components';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

export const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    min-height: 36px;
    height: 46px;
    border-radius: 8px;
    z-index: 9999999;
  }
  .Toastify__toast-body {
    color: black;
    align-items: center;
    height: 100%;
  }
  .Toastify__toast--default {
    background-color: ${theme.colors.orange[400]};
  }
  .Toastify__toast--info {
    background-color: ${theme.colors.blue[400]};
  }
  .Toastify__toast--success {
    background-color: ${theme.colors.green[400]};
  }
  .Toastify__toast--warning {
    background-color: ${theme.colors.orange[400]};
  }
  .Toastify__toast--error {
    background-color: ${theme.colors.red[400]};
  }
  .Toastify__toast-icon > svg {
    fill: black;
  }
  .Toastify__close-button {
    align-self: center;
  }
  .Toastify__close-button--default {
  }
  .Toastify__close-button > svg {
    width: 18px;
    height: 18px;
    fill: black;
    opacity: 1;
  }
  .Toastify__close-button:hover,
  .Toastify__close-button:focus {
  }
  .Toastify__progress-bar--info,
  .Toastify__progress-bar--success,
  .Toastify__progress-bar--warning,
  .Toastify__progress-bar--error {
    background: black;
  }
`;
