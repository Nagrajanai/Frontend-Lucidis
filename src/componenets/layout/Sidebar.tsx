// src/components/layout/Sidebar.tsx - original simplified version
import React from 'react';
import {
  Home,
  Users,
  Mail,
  Settings,
  Building,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Menu item type definition
interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  badge?: number;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Phase 1: Foundation - Only core features
  const menuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Building, label: 'Accounts', path: '/accounts' },
    { icon: Building, label: 'Workspaces', path: '/workspaces' },
    { icon: Mail, label: 'Inbox', path: '/inbox', badge: 0 },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const secondaryItems = [
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
    { icon: LogOut, label: 'Logout', path: '/logout', onClick: handleLogout },
  ];

  return (
    <div
      className={`bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : ''
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <img src="\assets\react.svg" alt="" />
            </div>
            <span className="font-bold text-xl">Lucidis</span>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto">
            <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">L</span>
            </div>
          </div>
        )}
        <button onClick={onToggle} className="p-1 hover:bg-gray-800 rounded-lg transition">
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // Smart active detection based on context
            let isActive = false;

            if (item.path === '/workspaces') {
              isActive = location.pathname === '/workspaces' || location.pathname.includes('/workspaces');
            } else if (item.path === '/accounts') {
              isActive =
                location.pathname.startsWith('/accounts') && !location.pathname.includes('/workspaces');
            } else {
              isActive = location.pathname.startsWith(item.path);
            }

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                {item.badge && !isCollapsed && (
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={item.onClick || (() => navigate(item.path))}
                className="w-full flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-indigo-600">AO</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">App Owner</p>
              <p className="text-sm text-gray-400">admin@lucidis.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;