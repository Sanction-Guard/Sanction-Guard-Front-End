import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import '../styles/Base.css';
import '../styles/layouts/Dashboard.css';
import '../styles/components/Card.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';

// Simple utility functions to avoid dependency on services if they're not set up yet
const getDbStatus = () => {
  try {
    return {
      overall: 'healthy',
      details: {
        main: { status: 'healthy', health: 100 },
        backup: { status: 'healthy', health: 98 },
        archive: { status: 'healthy', health: 87 }
      }
    };
  } catch (err) {
    console.error('Error getting DB status:', err);
    return {
      overall: 'unknown',
      details: {
        main: { status: 'unknown', health: 0 },
        backup: { status: 'unknown', health: 0 },
        archive: { status: 'unknown', health: 0 }
      }
    };
  }
};

const fetchAuditLogs = () => {
  try {
    // Try to get logs from localStorage if they exist
    const cachedLogs = localStorage.getItem('cachedAuditLogs');
    if (cachedLogs) {
      return JSON.parse(cachedLogs);
    }
    
    // Return sample data if no logs found
    return [];
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return [];
  }
};

const Dashboard = () => {
  // State for dashboard metrics
  const [metrics, setMetrics] = useState({
    totalRecords: {
      current: 3456,
      trend: 'up',
      percentage: '12.5',
      data: [
        { value: 30 }, { value: 40 }, { value: 35 }, 
        { value: 50 }, { value: 49 }, { value: 60 }, 
        { value: 70 }, { value: 91 }, { value: 125 }
      ]
    },
    processingTime: {
      current: '3.2',
      trend: 'down',
      percentage: '8.7',
      data: [
        { value: 10 }, { value: 8 }, { value: 7 }, 
        { value: 6 }, { value: 5 }, { value: 4.5 }, 
        { value: 4 }, { value: 3.5 }, { value: 3.2 }
      ]
    }
  });
  
  // State for database status
  const [dbStatus, setDbStatus] = useState(() => getDbStatus());
  
  // State for activities
  const [activities, setActivities] = useState([
    { id: 1, action: 'Data Import', user: 'John Doe', time: '5 minutes ago', status: 'success' },
    { id: 2, action: 'Batch Processing', user: 'Jane Smith', time: '10 minutes ago', status: 'success' },
    { id: 3, action: 'Database Cleanup', user: 'Mike Johnson', time: '1 hour ago', status: 'warning' },
    { id: 4, action: 'Record Update', user: 'Sarah Williams', time: '2 hours ago', status: 'error' },
    { id: 5, action: 'System Backup', user: 'System', time: '6 hours ago', status: 'success' }
  ]);
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // State for database status animation
  const [animateDbStatus, setAnimateDbStatus] = useState(false);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to load real metrics if available
        try {
          const storedMetrics = localStorage.getItem('performanceMetrics');
          if (storedMetrics) {
            const perfMetrics = JSON.parse(storedMetrics);
            
            // Process total records data
            const recordsData = perfMetrics.totalRecords.history.map(item => ({
              value: item.value
            }));
            
            // Process processing time data
            const timeData = perfMetrics.processingTime.history.map(item => ({
              value: item.value
            }));
            
            // Update metrics
            setMetrics({
              totalRecords: {
                current: perfMetrics.totalRecords.current,
                trend: 'up',
                percentage: '12.5',
                data: recordsData.length > 0 ? recordsData : metrics.totalRecords.data
              },
              processingTime: {
                current: perfMetrics.processingTime.current.toFixed(1),
                trend: 'down',
                percentage: '8.7',
                data: timeData.length > 0 ? timeData : metrics.processingTime.data
              }
            });
          }
        } catch (metricsErr) {
          console.error('Error loading metrics:', metricsErr);
          // Keep using default metrics if there's an error
        }
        
        // Try to get real audit logs
        try {
          const logs = await fetchAuditLogs();
          if (logs && logs.length > 0) {
            // Transform logs to activities
            const recentLogs = logs.slice(0, 5);
            const newActivities = recentLogs.map(log => ({
              id: log._id || Math.random().toString(36).substr(2, 9),
              action: log.action === 'search?' ? 'Search' : log.action || 'System Activity',
              user: log.userId || 'System User',
              time: log.timestamp ? getTimeAgo(new Date(log.timestamp)) : '5 minutes ago',
              status: 'success'
            }));
            
            if (newActivities.length > 0) {
              setActivities(newActivities);
            }
          }
        } catch (logsErr) {
          console.error('Error processing logs:', logsErr);
          // Keep using default activities if there's an error
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up refresh interval
    const intervalId = setInterval(fetchData, 60000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
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
  
  // Helper function for time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };
  
  // Format metrics for cards
  const dashboardMetrics = [
    { 
      id: 1, 
      title: 'Total Records', 
      value: typeof metrics.totalRecords.current === 'number' ? 
        metrics.totalRecords.current.toLocaleString() : 
        metrics.totalRecords.current, 
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
                style={{ backgroundColor: '#4ade8020' }}
              >
                {/* Status indicator dot */}
                <span className="text-success">⬤</span>
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
                <div 
                  className="bg-success h-2 rounded-full" 
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
            
            <div className="bg-light rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Backup Database</span>
                <span className="status-badge healthy">Good</span>
              </div>
              <div className="w-full bg-medium-gray rounded-full h-2 mt-2">
                <div 
                  className="bg-success h-2 rounded-full" 
                  style={{ width: '98%' }}
                ></div>
              </div>
            </div>
            
            <div className="bg-light rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Archive Database</span>
                <span className="status-badge healthy">Good</span>
              </div>
              <div className="w-full bg-medium-gray rounded-full h-2 mt-2">
                <div 
                  className="bg-warning h-2 rounded-full" 
                  style={{ width: '87%' }}
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