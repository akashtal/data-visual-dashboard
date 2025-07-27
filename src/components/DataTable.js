'use client';

import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

const DataTable = ({ data }) => {
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const headers = [
    { key: 'topic', label: 'Topic' },
    { key: 'sector', label: 'Sector' },
    { key: 'region', label: 'Region' },
    { key: 'country', label: 'Country' },
    { key: 'intensity', label: 'Intensity' },
    { key: 'likelihood', label: 'Likelihood' },
    { key: 'relevance', label: 'Relevance' },
    { key: 'end_year', label: 'End Year' }
  ];

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const paginatedData = sortedData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Data Overview</h3>
        <p className="text-sm text-gray-600 mt-1">Total {data.length} records</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th 
                  key={header.key}
                  onClick={() => handleSort(header.key)}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {header.label}
                    {sortField === header.key && (
                      <TrendingUp size={14} className={`transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {headers.map(header => (
                  <td key={header.key} className="px-6 py-4 text-sm text-gray-700">
                    {typeof row[header.key] === 'number' && ['intensity', 'likelihood', 'relevance'].includes(header.key) ? (
                      <div className="flex items-center gap-2">
                        <span>{row[header.key]}</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((row[header.key] / 10) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className={header.key === 'topic' ? 'font-medium text-gray-900' : ''}>
                        {row[header.key] || '-'}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 text-black flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default DataTable;