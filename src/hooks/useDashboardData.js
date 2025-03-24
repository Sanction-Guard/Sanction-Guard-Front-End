// src/hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import databaseStatusService from '../services/databaseStatusService';
import auditLogService from '../services/auditLogService';
import searchPerformanceService from '../services/searchPerformanceService';

/**
 * Custom hook for fetching and managing dashboard data
 * @param {Object} options - Configuration options
 * @param {number} options.refreshInterval - Data refresh interval in ms (default: 60000ms)
 * @param {boolean} options.autoRefresh - Whether to auto-refresh data (default: true)
 * @returns {Object} Dashboard data and control functions
 */
const useDashboardData = (options = {}) => {
  const { 
    refreshInterval = 60000, 
    autoRefresh = true 
  } = options;
  
  // Dashboard metrics state
  const [metrics, setMetrics] = useState({
    totalRecords: {
      current: 0,
      trend: 'up',
      percentage: '0.0',
      data: []
    },
    processingTime: {
      current: 0,
      trend: 'down',
      percentage: '0.0',
      data: []
    }
  });
  
  // Database status state
  const [dbStatus, setDbStatus] = useState({
    overall: 'unknown',
    details: {
      main: { status: 'unknown', health: 0 },
      backup: { status: 'unknown', health: 0 },
      archive: { status: 'unknown', health: 0 }
    }
  });
  
  // Recent activity state
  const [activities, setActivities] = useState([]);
  
  // Loading state
  const [loading, setLoading] = useState(true);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch metrics
      const perfMetrics = await dashboardService.fetchPerformanceMetrics();
      
      // Process total records data
      const recordsData = perfMetrics.totalRecords.history.map(item => ({
        value: item.value
      }));
      
      // Calculate trend for total records
      const recordsHistory = perfMetrics.totalRecords.history;
      let recordsTrend = 'stable';
      let recordsPercentage = '0.0';
      
      if (recordsHistory.length >= 2) {
        const current = recordsHistory[recordsHistory.length - 1].value;
        const previous = recordsHistory[recordsHistory.length - 2].value;
        
        recordsTrend = current > previous ? 'up' : current < previous ? 'down' : 'stable';
        
        if (previous > 0) {
          const change = ((current - previous) / previous) * 100;
          recordsPercentage = Math.abs(change).toFixed(1);
        }
      }
      
      // Process processing time data
      const timeData = perfMetrics.processingTime.history.map(item => ({
        value: item.value
      }));
      
      // Calculate trend for processing time
      const timeHistory = perfMetrics.processingTime.history;
      let timeTrend = 'stable';
      let timePercentage = '0.0';
      
      if (timeHistory.length >= 2) {
        const current = timeHistory[timeHistory.length - 1].value;
        const previous = timeHistory[timeHistory.length - 2].value;
        
        // For processing time, lower is better, so down is positive
        timeTrend = current < previous ? 'down' : current > previous ? 'up' : 'stable';
        
        if (previous > 0) {
          const change = ((previous - current) / previous) * 100;
          timePercentage = Math.abs(change).toFixed(1);
        }
      }
      
      // Update metrics state
      setMetrics({
        totalRecords: {
          current: perfMetrics.totalRecords.current,
          trend: recordsTrend,
          percentage: recordsPercentage,
          data: recordsData
        },
        processingTime: {
          current: perfMetrics.processingTime.current.toFixed(1),
          trend: timeTrend,
          percentage: timePercentage,
          data: timeData
        }
      });
      
      // Fetch database status
      const dbStatusData = await databaseStatusService.checkAllDatabaseStatus();
      setDbStatus({
        overall: dbStatusData.overall,
        details: {
          main: dbStatusData.details['Main Database'],
          backup: dbStatusData.details['Backup Database'],
          archive: dbStatusData.details['Archive Database']
        }
      });
      
      // Fetch recent activities
      const recentActivities = await auditLogService.getRecentActivities(5);
      setActivities(recentActivities);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh if enabled
    let intervalId = null;
    if (autoRefresh) {
      intervalId = setInterval(fetchDashboardData, refreshInterval);
    }
    
    // Cleanup interval on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, refreshInterval]);
  
  // Manually refresh data
  const refreshData = () => {
    fetchDashboardData();
  };
  
  return {
    metrics,
    dbStatus,
    activities,
    loading,
    error,
    refreshData
  };
};

export default useDashboardData;