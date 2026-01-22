import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../componenets/layout/Header";
import Sidebar from "../componenets/layout/Sidebar";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={onToggleSidebar} />
      <div
        className={`flex-1 flex flex-col ${
          isSidebarCollapsed ? "ml-0" : "ml-0"
        }`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default ProtectedRoute;