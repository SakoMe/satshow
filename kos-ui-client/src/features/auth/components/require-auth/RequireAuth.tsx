import { Loading } from '@kythera/kui-components';
import { Navigate, useLocation } from 'react-router-dom';

import { useGetCurrentUserQuery } from '../../authSlice';

interface RequireAuthProps {
  children: JSX.Element;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { isLoading, data } = useGetCurrentUserQuery('/users/currentuser');
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
