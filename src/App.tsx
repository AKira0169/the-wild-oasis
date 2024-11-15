import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Bookings from './pages/Bookings';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Cabins from './pages/Cabins';
import Login from './pages/Login';
import Settings from './pages/Settings';
import NewUsers from './pages/Users';
import PageNotFound from './pages/PageNotFound';
import GlobalStyle from './styles/GlobalStyle';
import AppLayout from './ui/AppLayout';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to='dashboard' />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='bookings' element={<Bookings />} />
            <Route path='account' element={<Account />} />
            <Route path='cabins' element={<Cabins />} />
            <Route path='settings' element={<Settings />} />
            <Route path='users' element={<NewUsers />} />
          </Route>
          <Route path='login' element={<Login />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={12}
        containerStyle={{ margin: '8px' }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px',
            backgroundColor: 'var(--color-grey-0)',
            color: 'var(--color-grey-700)',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
