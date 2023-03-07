import { createContext } from 'react';

import { APIError } from '../../../../../features/api/apiSlice';

export const ErrorContext = createContext<{ errors: APIError['data']['errors'] }>({
  errors: [],
});
