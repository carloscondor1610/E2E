import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { PassengerDashboardPage } from '../pages/passenger/PassengerDashboardPage';
import { DriverDashboardPage } from '../pages/driver/DriverDashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute allowedRoles={["PASSENGER"]} />,
        children: [{ path: 'passenger/dashboard', element: <PassengerDashboardPage /> }],
      },
      {
        element: <ProtectedRoute allowedRoles={["DRIVER"]} />,
        children: [{ path: 'driver/dashboard', element: <DriverDashboardPage /> }],
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
