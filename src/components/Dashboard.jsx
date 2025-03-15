import React from 'react';
import DashboardCard from './DashboardCard';

const Dashboard = () => {
  // Sample data for dashboard
  const metrics = [
    { 
      id: 1, 
      title: 'Total Records', 
      value: '3,456', 
      trend: 'up', 
      percentage: '12.5', 
      color: '#4361ee',
      data: [
        { value: 30 }, { value: 40 }, { value: 35 }, 
        { value: 50 }, { value: 49 }, { value: 60 }, 
        { value: 70 }, { value: 91 }, { value: 125 }
      ]
    },
    { 
      id: 2, 
      title: 'Processing Rate', 
      value: '98.2%', 
      trend: 'up', 
      percentage: '4.3', 
      color: '#4cc9f0',
      data: [
        { value: 85 }, { value: 87 }, { value: 88 }, 
        { value: 86 }, { value: 89 }, { value: 90 }, 
        { value: 92 }, { value: 94 }, { value: 98 }
      ]
    },
    { 
      id: 3, 
      title: 'Error Rate', 
      value: '1.8%', 
      trend: 'down', 
      percentage: '0.6', 
      color: '#f72585',
      data: [
        { value: 5 }, { value: 4 }, { value: 4.5 }, 
        { value: 4 }, { value: 3 }, { value: 2.5 }, 
        { value: 2 }, { value: 1.8 }, { value: 1.8 }
      ]
    },
    { 
      id: 4, 
      title: 'Avg. Processing Time', 
      value: '3.2s', 
      trend: 'down', 
      percentage: '8.7', 
      color: '#3f37c9',
      data: [
        { value: 10 }, { value: 8 }, { value: 7 }, 
        { value: 6 }, { value: 5 }, { value: 4.5 }, 
        { value: 4 }, { value: 3.5 }, { value: 3.2 }
      ]
    }
  ];

  // Latest activity data
  const activities = [
    { id: 1, action: 'Data Import', user: 'John Doe', time: '5 minutes ago', status: 'success' },
    { id: 2, action: 'Batch Processing', user: 'Jane Smith', time: '10 minutes ago', status: 'success' },
    { id: 3, action: 'Database Cleanup', user: 'Mike Johnson', time: '1 hour ago', status: 'warning' },
    { id: 4, action: 'Record Update', user: 'Sarah Williams', time: '2 hours ago', status: 'error' },
    { id: 5, action: 'System Backup', user: 'System', time: '6 hours ago', status: 'success' }
  ];

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
                <span className="text-success text-sm">100%</span>
              </div>
              <div className="w-full bg-medium-gray rounded-full h-2 mt-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="bg-light rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Backup Database</span>
                <span className="text-success text-sm">98%</span>
              </div>
              <div className="w-full bg-medium-gray rounded-full h-2 mt-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            
            <div className="bg-light rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Archive Database</span>
                <span className="text-warning text-sm">87%</span>
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
              {activities.map((activity) => (
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
              ))}
            </tbody>
          </table>
          
          <div className="p-4 text-center">
            <button className="btn btn-primary btn-ripple">View All Activity</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;