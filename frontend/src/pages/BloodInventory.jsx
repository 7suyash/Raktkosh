import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { inventoryAPI } from '../services/api';
import { useQuery } from '@tanstack/react-query';

const BloodInventory = () => {
  const [filter, setFilter] = useState('all');

  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ['blood-inventory'],
    queryFn: () => inventoryAPI.getInventory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const bloodGroups = [
    { name: 'A+', units: 45, capacity: 100, color: '#ef4444' },
    { name: 'A-', units: 15, capacity: 100, color: '#f97316' },
    { name: 'B+', units: 38, capacity: 100, color: '#eab308' },
    { name: 'B-', units: 12, capacity: 100, color: '#22c55e' },
    { name: 'AB+', units: 8, capacity: 100, color: '#3b82f6' },
    { name: 'AB-', units: 4, capacity: 100, color: '#8b5cf6' },
    { name: 'O+', units: 52, capacity: 100, color: '#ec4899' },
    { name: 'O-', units: 18, capacity: 100, color: '#06b6d4' },
  ];

  const lowStock = bloodGroups.filter(group => (group.units / group.capacity) < 0.2);
  const adequateStock = bloodGroups.filter(group => (group.units / group.capacity) >= 0.2);

  const filteredData = filter === 'low' ? lowStock : 
                      filter === 'adequate' ? adequateStock : 
                      bloodGroups;

  const inventoryStatus = [
    { name: 'Adequate', value: adequateStock.length, color: '#22c55e' },
    { name: 'Low', value: lowStock.length, color: '#eab308' },
    { name: 'Critical', value: bloodGroups.filter(g => (g.units / g.capacity) < 0.1).length, color: '#ef4444' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blood Inventory</h1>
              <p className="text-gray-600">Real-time blood stock levels and analytics</p>
            </div>
            <div className="flex space-x-4 mt-4 lg:mt-0">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Blood Groups</option>
                <option value="low">Low Stock</option>
                <option value="adequate">Adequate Stock</option>
              </select>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </motion.div>

        {/* Alert Section */}
        {lowStock.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-red-800 mb-2 flex items-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                  Low Stock Alert
                </h2>
                <p className="text-red-700">
                  Immediate attention required for {lowStock.length} blood group(s)
                </p>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                Request Supply
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {lowStock.map(group => (
                <span
                  key={group.name}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: group.color }}
                  ></div>
                  {group.name} ({group.units} units)
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {inventoryStatus.map((stat, index) => (
            <div key={stat.name} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.name} Stock</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">Blood Groups</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Blood Group Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="units" 
                  radius={[4, 4, 0, 0]}
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Stock Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Inventory Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Inventory</h3>
            <p className="text-sm text-gray-600 mt-1">Real-time blood stock across all locations</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bloodGroups.map((group) => {
                  const percentage = (group.units / group.capacity) * 100;
                  let status = 'Adequate';
                  let statusColor = 'text-green-800 bg-green-100';

                  if (percentage < 10) {
                    status = 'Critical';
                    statusColor = 'text-red-800 bg-red-100';
                  } else if (percentage < 20) {
                    status = 'Low';
                    statusColor = 'text-yellow-800 bg-yellow-100';
                  }

                  return (
                    <tr key={group.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-3 shadow-sm"
                            style={{ backgroundColor: group.color }}
                          ></div>
                          <span className="font-medium text-gray-900">
                            {group.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: group.color,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {group.units} units
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {group.capacity} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {percentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Just now
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BloodInventory;