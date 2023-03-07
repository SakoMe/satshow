import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { RequireAuth } from '../features/auth/components';
import { Admin } from '../routes/admin';
import { Home } from '../routes/home';
import { Landing } from '../routes/landing';
import { NotFound } from '../routes/not-found';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
