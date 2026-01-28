// src/components/layout/Header.tsx
import React from 'react';
import { Settings, HelpCircle, Search, Globe, Building } from 'lucide-react';

// Phase 1: Simplified header for App Owner view (static)
const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - App Owner Context */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Building className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">App Owner Dashboard</p>
              <p className="text-xs text-gray-500">Managing all accounts & workspaces</p>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Language */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <Globe className="h-5 w-5" />
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <Settings className="h-5 w-5" />
          </button>

          {/* Help */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;