import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Container, Row, Col, Modal, ProgressBar, Alert } from 'react-bootstrap';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../styles/layouts/DataImport.css';

/**
 * DataImport Component - CSV Import Only
 * 
 * This component handles CSV file uploads for sanctions list data 
 * and displays import history.
 */
function DataImport() {
  // ==================== STATE VARIABLES ====================
  
  // File upload states
  const [files, setFiles] = useState([]); // Selected files to upload
  const [isDragging, setIsDragging] = useState(false); // For drag & drop UI feedback
  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'
  const [showModal, setShowModal] = useState(false); // Controls upload confirmation modal
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress percentage
  
  // Import history states
  const [recentImports, setRecentImports] = useState([]); // List of recent imports
  const [showHistoryModal, setShowHistoryModal] = useState(false); // Controls history modal
  
  // Notification states
  const [errorMessage, setErrorMessage] = useState(''); // Error message to display
  const [successMessage, setSuccessMessage] = useState(''); // Success message to display
  
  // Reference to the hidden file input element
  const fileInputRef = useRef(null);
  
  /**
   * Effect: Fetch recent imports when component mounts
   */
  useEffect(() => {
    fetchRecentImports();
  }, []);
  
  /**
   * Fetches the list of recent imports from the server
   */
  const fetchRecentImports = async () => {
    try {
      // Use full URL path as in SearchScreen.jsx
      const response = await fetch('http://54.197.3.150:3001/api/imports/recent');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setRecentImports(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to fetch recent imports:', error);
      setErrorMessage('Failed to load recent import history. Click to retry.');
      setRecentImports([]); // Set to empty array to prevent undefined errors
    }
  };
  
  /**
   * Formats a timestamp as a relative time (e.g. "5 mins ago")
   * @param {string|Date} timestamp - The timestamp to format
   * @returns {string} Formatted time string
   */
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} mins ago`;
    } else {
      const diffHours = Math.round(diffMins / 60);
      if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else {
        const diffDays = Math.round(diffHours / 24);
        return `${diffDays} days ago`;
      }
    }
  };
  
  /**
   * Gets the appropriate CSS class for a status badge
   * @param {string} status - Status string ('completed', 'failed', etc.)
   * @returns {string} CSS class name for the badge
   */
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'danger';
      case 'processing':
        return 'warning';
      default:
        return 'info';
    }
  };
  
  /**
   * Gets a user-friendly status text from status code
   * @param {string} status - Status string from the API
   * @returns {string} User-friendly status text
   */
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      default:
        return 'Pending';
    }
  };
  
  // ==================== DRAG & DROP HANDLERS ====================
  
  /**
   * Handles dragover event for file drop area
   * @param {DragEvent} e - Drag event
   */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  /**
   * Handles dragenter event for file drop area
   * @param {DragEvent} e - Drag event
   */
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  /**
   * Handles dragleave event for file drop area
   * @param {DragEvent} e - Drag event
   */
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  /**
   * Handles drop event for file drop area
   * @param {DragEvent} e - Drop event
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);
  
  /**
   * Triggers the hidden file input click event
   */
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };
  
  /**
   * Handles file selection from the file input
   * @param {Event} e - Change event from file input
   */
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  
  /**
   * Processes selected files, validates they are CSV files, and prepares for upload
   * @param {Array} selectedFiles - Array of File objects
   */
  const handleFiles = (selectedFiles) => {
    // Filter for only CSV files
    const validFiles = selectedFiles.filter(file => {
      const fileType = file.type.toLowerCase();
      const fileExt = file.name.split('.').pop().toLowerCase();
      
      return fileType === 'text/csv' || 
             fileType === 'application/vnd.ms-excel' ||
             fileExt === 'csv';
    });
    
    if (validFiles.length === 0) {
      setErrorMessage('Please select only CSV files. Other file types are not supported.');
      return;
    }
    
    if (validFiles.length > 5) {
      setErrorMessage('Maximum 5 files can be uploaded at once.');
      return;
    }
    
    setFiles(validFiles);
    setShowModal(true);
    setUploadProgress(0);
    setErrorMessage('');
  };
  
  /**
   * Uploads selected CSV files to the server
   * Shows progress and handles response
   */
  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Create a reference to store the interval
    let progressInterval;
    
    // Create an AbortController for the timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      setUploadStatus('uploading');
      
      // Store the interval in a variable so we can clear it later
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          return prev < 90 ? prev + 10 : prev;
        });
      }, 500);
      
      // Make the API call with timeout
      const response = await fetch('http://54.197.3.150:3001/api/imports/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal // Add the abort signal
      });
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      // Clear the progress interval
      clearInterval(progressInterval);
      
      // Parse the response safely
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, create a generic error object
        responseData = { error: 'Failed to parse server response' };
      }
      
      if (!response.ok) {
        // Safely create an error message
        const errorMsg = responseData?.error || `Upload failed with status ${response.status}`;
        throw new Error(errorMsg);
      }
      
      // Set progress to 100% when done
      setUploadProgress(100);
      
      setUploadStatus('success');
      setSuccessMessage('CSV files uploaded successfully! They are now being processed.');
      setShowModal(false);
      
      // Refresh the recent imports list
      fetchRecentImports();
      
      // Reset file selection state after a delay
      setTimeout(() => {
        setFiles([]);
        setUploadStatus(null);
      }, 3000);
      
      // Set up a simple timer to check for updates after a delay
      setTimeout(() => {
        fetchRecentImports();
      }, 5000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Check if it's an abort error
      if (error.name === 'AbortError') {
        console.error('Request timed out');
        if (progressInterval) clearInterval(progressInterval);
        setUploadStatus('error');
        setErrorMessage('The upload request timed out. Please try again or check your network connection.');
        setShowModal(false);
        setUploadProgress(0);
        return;
      }
      
      // Make sure to clear the interval to stop progress updates
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      setUploadStatus('error');
      
      // Create an error message as a string
      let errorMessage = 'Failed to upload files. Please try again.';
      
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('duplicate') || error.message.includes('already been imported')) {
          errorMessage = 'Duplicate file detected. The selected file(s) appear to have already been imported.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrorMessage(errorMessage);
      
      // Close the modal and reset upload progress
      setShowModal(false);
      setUploadProgress(0);
    }
  };
  
  /**
   * Cancels the current upload process
   */
  const cancelUpload = () => {
    setShowModal(false);
    setFiles([]);
    setUploadStatus(null);
  };
  
  /**
   * Shows the import history modal
   */
  const viewImportHistory = () => {
    setShowHistoryModal(true);
  };
  
  /**
   * Retries fetching recent imports after an error
   */
  const handleRetryFetch = () => {
    fetchRecentImports();
  };
  
  // ==================== COMPONENT RENDER ====================
  
  return (
    <div className="data-import-container fade-in">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">CSV Sanctions List Import</h1>
        <p className="text-gray-600">Import and manage sanctions list data from CSV files.</p>
      </div>
      
      {/* Error and Success Messages */}
      {errorMessage && (
        <Alert 
          variant="danger" 
          onClick={errorMessage.includes('retry') ? handleRetryFetch : undefined}
          style={errorMessage.includes('retry') ? {cursor: 'pointer'} : {}}
          dismissible
          onClose={() => setErrorMessage('')} 
          className="mb-4"
        >
          {errorMessage}
          {errorMessage.includes('duplicate') && (
            <div className="mt-2">
              <ul className="mb-0 ps-3">
                <li>Please check the import history for existing entries</li>
                <li>Consider using a different file or modifying the file content if you need to re-import</li>
              </ul>
            </div>
          )}
          {errorMessage.includes('retry') && 
            <span className="float-end"><i className="bi bi-arrow-clockwise"></i> Click to retry</span>
          }
        </Alert>
      )}
      
      {successMessage && (
        <Alert 
          variant="success" 
          onClose={() => setSuccessMessage('')} 
          dismissible
          className="mb-4"
        >
          {successMessage}
        </Alert>
      )}
      
      {/* Upload Card */}
      <Card 
        className={`mb-4 upload-card slide-up ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Card.Body>
          <div className="text-center p-4 border-2 border-dashed rounded upload-area">
            {/* Icon container with styling */}
            <div 
              className="w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-3"
              style={{ backgroundColor: 'var(--primary-light)', opacity: '0.2' }}
            >
              <i className="bi bi-filetype-csv fs-2" style={{ color: 'var(--primary)' }}></i>
            </div>
            
            <h3 className="font-semibold mb-2">
              {isDragging ? 'Drop CSV files here' : 'Upload CSV sanctions list files'}
            </h3>
            <p className="text-gray-600 mb-3">
              Drag and drop or click to select CSV files
            </p>
            
            <div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".csv,text/csv,application/vnd.ms-excel"
                style={{ display: 'none' }}
              />
              <Button 
                className="btn btn-primary btn-ripple me-2"
                onClick={handleFileSelect}
              >
                Select CSV Files
              </Button>
              <Button 
                className="btn btn-secondary"
                onClick={viewImportHistory}
              >
                Import History
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Imports Section */}
      <div className="mt-6 slide-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-semibold mb-3">Recent Imports</h2>
        
        <Row className="dashboard-grid">
          {recentImports.length > 0 ? (
            recentImports.slice(0, 4).map((importItem, index) => (
              <Col md={6} className="mb-4" key={importItem._id || index}>
                <Card className="dashboard-card h-100" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="font-medium mb-2">{importItem.filename}</h5>
                        <p className="text-gray-600">
                          {importItem.entriesUpdated || 'N/A'} entries updated
                        </p>
                        <small className="text-gray-500">
                          {formatTimeAgo(importItem.createdAt)}
                        </small>
                      </div>
                      
                      {/* Icon container */}
                      <div 
                        className="p-3 rounded-full"
                        style={{ backgroundColor: 'var(--primary-light)', opacity: '0.2' }}
                      >
                        <i className="bi bi-filetype-csv" style={{ color: 'var(--primary)' }}></i>
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="mt-3 pt-3 border-t">
                      <span className={`status-badge ${getStatusBadgeClass(importItem.status)}`}>
                        {getStatusText(importItem.status)}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col md={12}>
              <Card className="dashboard-card">
                <Card.Body className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
                  <p className="text-gray-600">No recent imports found</p>
                  <p className="text-gray-500 small">Upload CSV files to see them here</p>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
        
        {/* Refresh / View All button */}
        <div className="text-center mt-4">
          <Button 
            className="btn btn-secondary btn-ripple me-2"
            onClick={() => fetchRecentImports()}
          >
            <i className="bi bi-arrow-clockwise me-2"></i> Refresh
          </Button>
          <Button 
            className="btn btn-primary btn-ripple"
            onClick={viewImportHistory}
          >
            View All Import History
          </Button>
        </div>
      </div>
      
      {/* Upload Confirmation Modal */}
      <Modal 
        show={showModal} 
        onHide={cancelUpload}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm CSV Import</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are about to import the following CSV files:</p>
          <ul className="mt-2 mb-3">
            {files.map((file, index) => (
              <li key={index} className="mb-1">
                <i className="bi bi-filetype-csv me-2"></i>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
          
          {uploadStatus === 'uploading' && (
            <div className="mt-3">
              <p>Uploading... {uploadProgress}%</p>
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`}
                animated
                variant="primary" 
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={cancelUpload}
            disabled={uploadStatus === 'uploading'}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={uploadFiles}
            disabled={uploadStatus === 'uploading'}
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload and Process'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Import History Modal */}
      <Modal 
        show={showHistoryModal} 
        onHide={() => setShowHistoryModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>CSV Import History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {recentImports.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Status</th>
                    <th>Entries</th>
                    <th>Date</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {recentImports.map((importItem, index) => (
                    <tr key={importItem._id || index}>
                      <td>{importItem.filename}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(importItem.status)}`}>
                          {getStatusText(importItem.status)}
                        </span>
                      </td>
                      <td>{importItem.entriesUpdated || 'N/A'}</td>
                      <td>{new Date(importItem.createdAt).toLocaleString()}</td>
                      <td>{importItem.fileSize ? `${(importItem.fileSize/1024).toFixed(2)} KB` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <p className="text-gray-600">No import history found</p>
              <p className="text-gray-500 small">Upload CSV files to see them here</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowHistoryModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DataImport;