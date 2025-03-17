import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../styles/layouts/ReportsAnalytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ReportsAnalytics() {
  // Sample chart data for demonstration
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Screenings',
        data: [1245, 1890, 2356, 2789, 3102, 3450],
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Matches',
        data: [42, 58, 65, 81, 75, 90],
        borderColor: 'var(--accent)',
        backgroundColor: 'rgba(247, 37, 133, 0.1)',
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="reports-container fade-in">
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Reports and Analytics</h1>
        <p className="text-gray-600">Generate reports and view analytics for your screening activities.</p>
      </div>
      
      {/* Report generation options */}
      <div className="report-options-grid">
        <Card className="report-card report-option-card slide-up delay-1">
          <Card.Body className="p-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: 'rgba(67, 97, 238, 0.1)' }}
            >
              <i className="bi bi-file-earmark-text" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}></i>
            </div>
            <h5 className="font-semibold mb-2">Screening Summary</h5>
            <p className="text-gray-600 mb-4">Daily screening activities and matches</p>
            <Button className="btn btn-primary btn-ripple w-full">Generate</Button>
          </Card.Body>
        </Card>
        
        <Card className="report-card report-option-card slide-up delay-2">
          <Card.Body className="p-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: 'rgba(76, 201, 240, 0.1)' }}
            >
              <i className="bi bi-shield-check" style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}></i>
            </div>
            <h5 className="font-semibold mb-2">Risk Analysis</h5>
            <p className="text-gray-600 mb-4">Risk levels and screening patterns</p>
            <Button className="btn btn-primary btn-ripple w-full">Generate</Button>
          </Card.Body>
        </Card>
        
        <Card className="report-card report-option-card slide-up delay-3">
          <Card.Body className="p-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: 'rgba(247, 37, 133, 0.1)' }}
            >
              <i className="bi bi-clipboard-data" style={{ color: 'var(--accent)', fontSize: '1.5rem' }}></i>
            </div>
            <h5 className="font-semibold mb-2">Compliance Report</h5>
            <p className="text-gray-600 mb-4">System usage and compliance tracking</p>
            <Button className="btn btn-primary btn-ripple w-full">Generate</Button>
          </Card.Body>
        </Card>
      </div>

      {/* Generated Reports Section */}
      <Card className="report-card slide-up" style={{ animationDelay: '0.3s' }}>
        <Card.Header className="p-4 border-b">
          <h4 className="font-semibold">Generated Reports</h4>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="report-item flex justify-between items-center p-4">
            <div>
              <h5 className="font-medium mb-1">March 2024 Compliance Report</h5>
              <small className="text-gray-500">Generated on Mar 15, 2024</small>
            </div>
            <div className="report-item-actions">
              <Button className="btn btn-secondary btn-sm mr-2">Preview</Button>
              <Button className="btn btn-primary btn-sm">Download</Button>
            </div>
          </div>
          
          <div className="report-item flex justify-between items-center p-4">
            <div>
              <h5 className="font-medium mb-1">Q1 2024 Risk Analysis</h5>
              <small className="text-gray-500">Generated on Mar 1, 2024</small>
            </div>
            <div className="report-item-actions">
              <Button className="btn btn-secondary btn-sm mr-2">Preview</Button>
              <Button className="btn btn-primary btn-sm">Download</Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Analytics Dashboard Section */}
      <div className="mt-6 slide-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
        
        {/* Chart */}
        <div className="chart-container mb-4">
          <h4 className="font-medium mb-3">Screening Activity</h4>
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  backgroundColor: 'white',
                  titleColor: 'var(--dark)',
                  bodyColor: 'var(--dark)',
                  borderColor: 'var(--light-gray)',
                  borderWidth: 1,
                  padding: 10,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  usePointStyle: true,
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              }
            }} 
          />
        </div>
        
        {/* Stats cards */}
        <div className="dashboard-grid">
          <div className="analytics-card slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="stat-label">Total Screenings</div>
            <div className="stat-value">12,458</div>
            <div className="trend-indicator trend-up">↑ 12% from last month</div>
          </div>
          
          <div className="analytics-card slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="stat-label">Match Rate</div>
            <div className="stat-value">2.4%</div>
            <div className="trend-indicator trend-down">↓ 0.5% from last month</div>
          </div>
          
          <div className="analytics-card slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="stat-label">Average Response Time</div>
            <div className="stat-value">1.2s</div>
            <div className="trend-indicator trend-up">↑ 15% faster</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsAnalytics;