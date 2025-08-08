import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../../store"; // adjust path as needed

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  return isLoggedIn && allowedRoles.includes(role)
    ? <Outlet />
    : isLoggedIn
    ? <Navigate to="/denied" state={{ from: location }} replace />
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;