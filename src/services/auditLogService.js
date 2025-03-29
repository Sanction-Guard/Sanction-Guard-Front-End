// src/services/auditLogService.js
import axios from 'axios';

const API_BASE_URL = axios.create({
  baseURL: 'http://54.197.3.150:3001/api',
  httpAgent: new (require('https').Agent)({
    rejectUnauthorized: false
  })
});

/**
 * Fetch audit logs from API
 * @param {Object} options - Options for fetching logs
 * @param {number} options.limit - Max number of logs to fetch
 * @param {string} options.sortBy - Field to sort by (default: 'timestamp')
 * @param {string} options.sortOrder - Sort order ('asc' or 'desc')
 * @returns {Promise<Array>} Array of audit logs
 */
export const fetchAuditLogs = async ({ limit = 50, sortBy = 'timestamp', sortOrder = 'desc' } = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs`);
    
    let logs = response.data;
    
    // Sort logs
    logs = logs.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (sortOrder === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
    
    // Limit logs
    logs = logs.slice(0, limit);
    
    // Cache logs to localStorage for offline access
    localStorage.setItem('cachedAuditLogs', JSON.stringify(logs));
    
    return logs;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    
    // Return cached logs if available
    const cachedLogs = localStorage.getItem('cachedAuditLogs');
    if (cachedLogs) {
      return JSON.parse(cachedLogs);
    }
    
    return [];
  }
};

/**
 * Transform audit logs to activity format for dashboard
 * @param {Array} logs - Raw audit logs
 * @param {number} limit - Max number of activities to return
 * @returns {Array} Formatted activities
 */
export const transformLogsToActivities = (logs, limit = 5) => {
  if (!logs || !Array.isArray(logs)) return [];
  
  return logs.slice(0, limit).map(log => ({
    id: log._id || `log-${Math.random().toString(36).substr(2, 9)}`,
    action: getActionFromLog(log),
    user: log.userId || 'System',
    time: getRelativeTime(log.timestamp),
    status: getStatusFromLog(log),
    details: getLogDetails(log)
  }));
};

/**
 * Extract action label from log object
 * @param {Object} log - Audit log
 * @returns {string} Descriptive action
 */
const getActionFromLog = (log) => {
  if (!log.action) return 'System Event';
  
  // Fix potential typos or formatting issues
  let action = log.action.replace('?', '');
  
  // Map API actions to user-friendly labels
  const actionMap = {
    'search': 'Search',
    'import': 'Data Import',
    'export': 'Data Export',
    'update': 'Record Update',
    'delete': 'Record Deletion',
    'login': 'User Login',
    'logout': 'User Logout'
  };
  
  return actionMap[action.toLowerCase()] || action;
};

/**
 * Get relative time string from timestamp
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Relative time description
 */
const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'unknown time';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHr / 24);
  
  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

/**
 * Determine status badge from log
 * @param {Object} log - Audit log
 * @returns {string} Status (success, warning, error)
 */
const getStatusFromLog = (log) => {
  // If there's an explicit status, use it
  if (log.status) return log.status;
  
  // Infer status from other properties
  if (log.error) return 'error';
  if (log.warning) return 'warning';
  
  // Default to success
  return 'success';
};

/**
 * Extract meaningful details from log
 * @param {Object} log - Audit log
 * @returns {string} Details string
 */
const getLogDetails = (log) => {
  if (log.searchTerm) return `Query: "${log.searchTerm}"`;
  if (log.details) return log.details;
  if (log.message) return log.message;
  
  return '';
};

/**
 * Create an audit log entry (sends to API & caches locally)
 * @param {Object} logEntry - Log entry to create
 * @returns {Promise<Object>} Created log entry
 */
export const createAuditLog = async (logEntry) => {
  const entry = {
    ...logEntry,
    timestamp: new Date().toISOString()
  };
  
  try {
    const response = await axios.post(`${API_BASE_URL}/audit-logs`, entry);
    return response.data;
  } catch (error) {
    console.error('Error creating audit log:', error);
    
    // Store locally for potential future sync
    const offlineLogs = JSON.parse(localStorage.getItem('offlineAuditLogs') || '[]');
    offlineLogs.push(entry);
    localStorage.setItem('offlineAuditLogs', JSON.stringify(offlineLogs));
    
    return entry;
  }
};

/**
 * Get recent activities for dashboard display
 * @param {number} limit - Max number of activities
 * @returns {Promise<Array>} Recent activities
 */
export const getRecentActivities = async (limit = 5) => {
  const logs = await fetchAuditLogs({ limit });
  return transformLogsToActivities(logs, limit);
};

export default {
  fetchAuditLogs,
  transformLogsToActivities,
  createAuditLog,
  getRecentActivities
};