import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import useDashboardData from '../hooks/useDashboardData';
import '../styles/Base.css';
import '../styles/layouts/Dashboard.css';
import '../styles/components/Card.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';

const Dashboard = () => {
  // Use our custom hook to fetch dashboard data
  const { 
    metrics, 
    dbStatus, 
    activities, 
    loading, 
    error, 
    refreshData 
  } = useDashboardData({
    refreshInterval: 60000, // 1-minute refresh interval
    autoRefresh: true
  });
  
  // State for database status animation
  const [animateDbStatus, setAnimateDbStatus] = useState(false);
  
  // Trigger animation when database status changes
  useEffect(() => {
    setAnimateDbStatus(true);
    const timer = setTimeout(() => setAnimateDbStatus(false), 500);
    return () => clearTimeout(timer);
  }, [dbStatus.overall]);
  
  // Map database status to class names and labels
  const getStatusClass = (status) => {
    switch (status) {
      case 'healthy': return 'healthy';
      case 'degraded': return 'warning';
      case 'error': return 'error';
      default: return '';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'healthy': return 'Good';
      case 'degraded': return 'Warning';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };
  
  // Format metrics for cards
  const dashboardMetrics = [
    { 
      id: 1, 
      title: 'Total Records', 
      value: metrics.totalRecords.current.toLocaleString(), 
      trend: metrics.totalRecords.trend, 
      percentage: metrics.totalRecords.percentage, 
      color: '#4361ee',
      data: metrics.totalRecords.data
    },
    { 
      id: 2, 
      title: 'Avg. Processing Time', 
      value: metrics.processingTime.current + 's', 
      trend: metrics.processingTime.trend, 
      percentage: metrics.processingTime.percentage, 
      color: '#3f37c9',
      data: metrics.processingTime.data
    }
  ];

  return (
    <div className="dashboard-container fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your data today.</p>
      </div>
      
      {/* Dashboard metrics */}
      <div className="dashboard-grid">
        {dashboardMetrics.map((metric, index) => (
          <div key={metric.id} style={{ animationDelay: `${index * 0.1}s` }} className="slide-up">
            <DashboardCard {...metric} />
          </div>
        ))}
      </div>
      
      {/* Database status section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Database Status</h2>
        <div className={`card p-4 ${animateDbStatus ? 'pulse' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: dbStatus.overall === 'healthy' ? '#4ade8020' : 
                                         dbStatus.overall === 'degraded' ? '#ffb02020' : 
                                         '#ff202020' }}
              >
                {/* Status indicator dot */}
                <span className={`text-${getStatusClass(dbStatus.overall)}`}>⬤</span>
              </div>
              <div>
                <h3 className="font-medium">
                  {dbStatus.overall === 'healthy' ? 'Systems Operational' : 
                   dbStatus.overall === 'degraded' ? 'Systems Degraded' : 
                   'Systems Error'}
                </h3>
                <p className="text-sm text-gray-500">
                  {dbStatus.overall === 'healthy' ? 'All databases are running smoothly' : 
                   dbStatus.overall === 'degraded' ? 'Some systems experiencing issues' : 
                   'Database connection issues detected'}
                </p>
              </div>
            </div>
            <div>
              <span className={`status-badge ${getStatusClass(dbStatus.overall)}`}>
                {dbStatus.overall === 'healthy' ? 'Healthy' : 
                 dbStatus.overall === 'degraded' ? 'Warning' : 
                 'Error'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-light rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Main Database</span>
                <span className={`status-badge ${getStatusClass(dbStatus.details.main.status)}`}>
                  {getStatusLabel(dbStatus.details.main.status)}
                </span>
              </div>
              <div className="w-full bg-medium-gray rounded-full h-2 mt-2">
                <div 
                  className={`bg-${getStatusClass(dbStatus.details.main.status)} h-2 rounded-full`} 
                  style={{ width: `${dbStatus.details.main.health}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-light rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Backup Database</span>
                <span className={`status-badge ${getStatusClass(dbStatus.details.backup.status)}`}>
                  {getStatusLabel(dbStatus.details.backup.status)}
                </span>
              </div>
              <div className="w-full bg-medium-gray rounded-full h-2 mt-2">
                <div 
                  className={`bg-${getStatusClass(dbStatus.details.backup.status)} h-2 rounded-full`} 
                  style={{ width: `${dbStatus.details.backup.health}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-light rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Archive Database</span>
                <span className={`status-badge ${getStatusClass(dbStatus.details.archive.status)}`}>
                  {getStatusLabel(dbStatus.details.archive.status)}
                </span>
              </div>
              <div className="w-full bg-medium-gray rounded-full h-2 mt-2">
                <div 
                  className={`bg-${getStatusClass(dbStatus.details.archive.status)} h-2 rounded-full`} 
                  style={{ width: `${dbStatus.details.archive.health}%` }}
                ></div>
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
                  <td colSpan="4" className="py-5 text-center text-gray-500">
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <div className="loading-spinner mr-2"></div>
                        Loading activity data...
                      </div>
                    ) : (
                      'No recent activity found'
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="p-4 text-center">
            <button 
              className="btn btn-primary btn-ripple"
              onClick={() => window.location.href = '/audit-log'}
            >
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;