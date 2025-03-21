import React from 'react';
import DashboardCard from './DashboardCard';
import { useSearch } from './SearchContext';
import '../styles/Base.css';
import '../styles/layouts/Dashboard.css';
import '../styles/components/Card.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../components/SearchScreen';

const Dashboard = () => {
  // Get data from search context instead of using hardcoded data
  const { 
    totalSearches, 
    totalMatches, 
    searchResult,
    getRecentActivities, 
    getSearchMetrics
  } = useSearch();
  
  // Get dynamic metrics from context
  const metrics = getSearchMetrics();
  
  // Get recent activities from context
  const activities = getRecentActivities();
  
  return (
    <div className="dashboard-container fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your data today.</p>
      </div>
      
      {/* Dashboard metrics */}
      <div className="dashboard-grid">
        {metrics.map((metric, index) => (
          <div key={metric.id} style={{ animationDelay: `${index * 0.1}s` }} className="slide-up">
            <DashboardCard {...metric} />
          </div>
        ))}
      </div>
      
      {/* Database status section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Database Status</h2>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: '#4ade8020' }}
              >
                {/* <span className="text-success">⬤</span> */}
              </div>
              <div>
                <h3 className="font-medium">Systems Operational</h3>
                <p className="text-sm text-gray-500">All databases are running smoothly</p>
              </div>
            </div>
            <div>
              <span className="status-badge healthy">Healthy</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-light rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Main Database</span>
                <span className="status-badge healthy">Good</span>
              </div>
              <div className="w-full bg-medium-gray rounded-full h-2 mt-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="bg-light rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Backup Database</span>
                <span className="status-badge healthy">Good</span>
              </div>
              <div className="w-full bg-medium-gray rounded-full h-2 mt-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            
            <div className="bg-light rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Archive Database</span>
                <span className="status-badge healthy">Good</span>
              </div>
              <div className="w-full bg-medium-gray rounded-full h-2 mt-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
        <div className="card">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Activity</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <tr key={activity.id} className="border-b hover:bg-light transition-colors">
                    <td className="py-3 px-4">{activity.action}</td>
                    <td className="py-3 px-4">{activity.user}</td>
                    <td className="py-3 px-4">{activity.time}</td>
                    <td className="py-3 px-4">
                      <span className={`status-badge ${activity.status}`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b">
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    No recent activity found. Try performing some searches.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="p-4 text-center">
            <button className="btn btn-primary btn-ripple">View All Activity</button>
          </div>
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Search Analytics</h2>
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-light rounded p-3 text-center">
              <h4 className="text-gray-600 mb-1">Total Searches</h4>
              <div className="text-2xl font-bold">{totalSearches}</div>
            </div>
            
            <div className="bg-light rounded p-3 text-center">
              <h4 className="text-gray-600 mb-1">Total Matches</h4>
              <div className="text-2xl font-bold">{totalMatches}</div>
            </div>
            
            <div className="bg-light rounded p-3 text-center">
              <h4 className="text-gray-600 mb-1">Match Rate</h4>
              <div className="text-2xl font-bold">
                {totalSearches > 0 
                  ? `${((searchResult / totalMatches) * 100).toFixed(1)}%` 
                  : '0%'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;