"use client";

import React, { useState } from "react";
import { Filter } from "lucide-react";

const FilterPanel = ({ filters, setFilters, options }) => {
  const [showPanel, setShowPanel] = useState(false);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Data Visualization Dashboard
        </h1>

        <button
          onClick={() => setShowPanel((prev) => !prev)}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition"
          title="Toggle Filters"
        >
          <Filter size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Filter Panel */}
      {showPanel && (
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(options).map(([key, values]) => (
              <div key={key} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key.replace("_", " ")}
                </label>
                <select
                  value={filters[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white text-sm"
                >
                  <option value="">All {key.replace("_", " ")}</option>
                  {values.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
