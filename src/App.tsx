// src/App.tsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InboxPage from "./pages/InboxPage";
import UsersPage from "./pages/UsersPage";
import "./App.css";
import Header from "./componenets/layout/Header";
import Sidebar from "./componenets/layout/Sidebar";
import AccountsPage from "./pages/AccountPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import WorkspacesPage from "./pages/WorkspacesPage";
import CreateWorkspacePage from "./pages/CreateWorkspacePage";
import AccountDetailPage from "./pages/AccountDetailPage";
import WorkspaceDetailPage from "./pages/WorkspaceDetailPage";
import TasksPage from "./pages/TaskPage";
import CreateTaskPage from "./pages/CreateTaskPage";


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

// const AuthRedirect: React.FC = () => {
//   const { isAuthenticated } = useAuth();
//   return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
// };

import FormsPage from "./pages/FormsPage";
import CampaignsPage from "./pages/CampaignsPage";
import KnowledgePage from "./pages/KnowledgePage";
import RegisterPage from "./pages/RegisterPage";
// import SetupPage from "./pages/SetupPage";

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // Phase 1: Workspace management will be added in future phases

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        
          <Route
            path="/*"
            element={
              <ProtectedRoute
                isSidebarCollapsed={isSidebarCollapsed}
                onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/accounts" element={<AccountsPage />} />
                  <Route path="/accounts/create" element={<CreateAccountPage />} />
                  <Route path="/accounts/:accountId" element={<AccountDetailPage />} />
                  <Route path="/accounts/:accountId/workspaces" element={<WorkspacesPage />} />
                  <Route path="/accounts/:accountId/workspaces/create" element={<CreateWorkspacePage />} />
                  <Route path="/workspaces" element={<WorkspacesPage />} />
                  <Route path="/workspaces/create" element={<CreateWorkspacePage />} />
                  <Route path="/workspaces/:workspaceId" element={<WorkspaceDetailPage />} />
                  <Route path="/inbox" element={<InboxPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/tasks/create" element={<CreateTaskPage />} />
                  <Route path="/tasks/:taskId" element={<TasksPage />} />
                  <Route path="/tasks/:taskId/edit" element={<CreateTaskPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/forms" element={<FormsPage />} />
                  <Route path="/campaigns" element={<CampaignsPage />} />
                  <Route path="/knowledge" element={<KnowledgePage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
