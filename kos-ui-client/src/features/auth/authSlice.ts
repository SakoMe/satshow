import { apiSlice } from '../api/apiSlice';

export const extendAuthSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (userData) => ({
        url: '/users/signup',
        credentials: 'include',
        method: 'POST',
        body: userData,
      }),
    }),
    signIn: builder.mutation({
      query: (userData) => ({
        url: '/users/signin',
        credentials: 'include',
        method: 'POST',
        body: userData,
      }),
    }),
    signOut: builder.mutation({
      query: () => ({
        url: '/users/signout',
        credentials: 'include',
        method: 'POST',
      }),
    }),
    getCurrentUser: builder.query({
      query: () => ({
        url: '/users/currentuser',
        credentials: 'include',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useGetCurrentUserQuery,
} = extendAuthSlice;
