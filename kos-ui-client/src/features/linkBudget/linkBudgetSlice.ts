import { LinkBudgetResult } from '../../ts/types/linkBudget';
import { apiSlice } from '../api/apiSlice';

export const extendLinkBudget = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLinkBudget: builder.query<{ linkBudgetResults: LinkBudgetResult[] }, void>({
      query: () => ({
        url: '/data/link-budget-result',
        credentials: 'include',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetLinkBudgetQuery } = extendLinkBudget;
