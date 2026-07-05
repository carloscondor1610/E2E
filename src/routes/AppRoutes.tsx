import { Navigate, Route, Routes } from "react-router-dom";
import { PublicOnlyRoute } from "../auth/PublicOnlyRoute";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { PassengerDashboardPage } from "../pages/passenger/PassengerDashboardPage";
import { CreateTripPage } from "../pages/passenger/CreateTripPage";
import { PassengerTripDetailPage } from "../pages/passenger/PassengerTripDetailPage";
import { DriverDashboardPage } from "../pages/driver/DriverDashboardPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/login" replace />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["PASSENGER"]} />}>
          <Route path="passenger/dashboard" element={<PassengerDashboardPage />} />
          <Route path="passenger/trips/new" element={<CreateTripPage />} />
          <Route path="passenger/trips/:id" element={<PassengerTripDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["DRIVER"]} />}>
          <Route path="driver/dashboard" element={<DriverDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
