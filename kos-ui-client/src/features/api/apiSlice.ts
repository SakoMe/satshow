import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

export type APIError = {
  data: {
    errors: {
      message: string;
      field?: string;
    }[];
  };
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8086/api/v1',
  }) as BaseQueryFn<string | FetchArgs, unknown, APIError, Record<string, unknown>>,
  tagTypes: [
    'User',
    'Beam',
    'Gateway',
    'Log',
    'Terminal',
    'RainViewer',
    'Layers/Terminal',
    'Layers/Beam',
    'Layers/Gateway',
  ],
  endpoints: () => ({}),
});
