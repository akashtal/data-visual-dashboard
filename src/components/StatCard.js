'use client';
import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, change, trend }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
            <TrendingUp size={16} className={trend > 0 ? 'text-green-600' : 'text-red-600 rotate-180'} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      {change && <p className="text-xs text-gray-500">{change}</p>}
    </div>
  );
};

export default StatCard;