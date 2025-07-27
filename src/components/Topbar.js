'use client';
import React from 'react';
import { Search, Bell, User, Sun, Moon, Menu } from 'lucide-react';

const Topbar = ({ darkMode, setDarkMode, collapsed, setCollapsed }) => {
    return (
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>
      </header>
    );
  };

  export default Topbar;
