'use client';

import React from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
const Sidebar = ({ collapsed, setCollapsed }) => {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: PieChart, label: 'Analytics' },
    { icon: TrendingUp, label: 'Reports' },
    { icon: Users, label: 'Users' },
  ];

  return (
    <div className={`bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col shadow-2xl`}>
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          {!collapsed && <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Data Visualization</h1>}
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:bg-slate-700 ${item.active ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' : ''}`}>
              <IconComponent size={20} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;