// src/App.tsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AccountsPage from "./pages/account/AccountPage";
import CreateAccountPage from "./pages/account/CreateAccountPage";
import AccountDetailPage from "./pages/account/AccountDetailPage";
import AccountEditPage from "./pages/account/AccountEditPage";
import WorkspacesPage from "./pages/workspace/WorkspacesPage";
import CreateWorkspacePage from "./pages/workspace/CreateWorkspacePage";
import WorkspaceDetailPage from "./pages/workspace/WorkspaceDetailPage";
import WorkspaceEditPage from "./pages/workspace/WorkspaceEditPage";
import InboxPage from "./pages/inbox/InboxPage";
import TasksPage from "./pages/tasks/TaskPage";
import CreateTaskPage from "./pages/tasks/CreateTaskPage";
import UsersPage from "./pages/users/UsersPage";
import FormsPage from "./pages/forms/FormsPage";
import CampaignsPage from "./pages/campaigns/CampaignsPage";
import KnowledgePage from "./pages/knowledge/KnowledgePage";
import UserRegister from "./pages/auth/UserRegister";


const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/accept-invitation/user" element={<UserRegister />} />
        
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
                  <Route path="/accounts/:accountId/edit" element={<AccountEditPage />} />
                  <Route path="/accounts/:accountId/workspaces" element={<WorkspacesPage />} />
                  <Route path="/accounts/:accountId/workspaces/create" element={<CreateWorkspacePage />} />
                  <Route path="/workspaces" element={<WorkspacesPage />} />
                  <Route path="/workspaces/create" element={<CreateWorkspacePage />} />
                  <Route path="/accounts/:accountId/workspaces/:workspaceId" element={<WorkspaceDetailPage />} />
                  <Route path="/accounts/:accountId/workspaces/:workspaceId/edit" element={<WorkspaceEditPage />} />
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
