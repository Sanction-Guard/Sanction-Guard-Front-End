import React, { useState, useRef } from 'react';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/Form.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';

const ModernDataImport = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };
  
  // Handle file input change
  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };
  
  // Process files
  const handleFiles = (newFiles) => {
    // Filter out duplicates
    const uniqueFiles = newFiles.filter(file => 
      !files.some(existingFile => existingFile.name === file.name)
    );
    
    // Add files to state
    setFiles([...files, ...uniqueFiles]);
    
    // Initialize progress for each file
    const newProgress = { ...uploadProgress };
    uniqueFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);
    
    // Simulate upload progress
    uniqueFiles.forEach(file => {
      simulateFileUpload(file);
    });
  };
  
  // Simulate file upload with progress
  const simulateFileUpload = (file) => {
    const totalTime = 2000 + Math.random() * 3000; // Random time between 2-5 seconds
    const intervalTime = 100;
    const steps = totalTime / intervalTime;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min(Math.round((currentStep / steps) * 100), 100);
      
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: progress
      }));
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Check if all files are done
        const allDone = Object.values(uploadProgress).every(p => p >= 100);
        if (allDone) {
          simulateImport();
        }
      }
    }, intervalTime);
  };
  
  // Simulate the import process
  const simulateImport = () => {
    setImportStatus('validating');
    
    setTimeout(() => {
      setImportStatus('processing');
      
      setTimeout(() => {
        setImportStatus('completed');
      }, 3000);
    }, 2000);
  };
  
  // Remove file
  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
    setUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };
  
  // Clear everything and reset
  const resetImport = () => {
    setFiles([]);
    setUploadProgress({});
    setImportStatus(null);
  };
  
  // Get file type icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['csv', 'xlsx', 'xls'].includes(extension)) {
      return (
        <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return (
        <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (['pdf'].includes(extension)) {
      return (
        <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };
  
  // Get status for the import process
  const getImportStatusContent = () => {
    switch(importStatus) {
      case 'validating':
        return (
          <div className="card p-4 mt-4 border-l-4 border-primary slide-up">
            <div className="flex items-center">
              <div className="loading-spinner mr-3"></div>
              <div>
                <h3 className="font-medium">Validating Files</h3>
                <p className="text-sm text-gray-600">Checking file integrity and format...</p>
              </div>
            </div>
          </div>
        );
      case 'processing':
        return (
          <div className="card p-4 mt-4 border-l-4 border-primary slide-up">
            <div className="flex items-center">
              <div className="loading-spinner mr-3"></div>
              <div>
                <h3 className="font-medium">Processing Data</h3>
                <p className="text-sm text-gray-600">Importing records into the database...</p>
              </div>
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className="card p-4 mt-4 border-l-4 border-success slide-up">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white mr-3">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Import Completed</h3>
                <p className="text-sm text-gray-600">Successfully imported {files.length} files with {files.length * 125} records.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={resetImport} className="btn btn-primary">Start New Import</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="data-import-container fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Data Import</h1>
        <p className="text-gray-600">Upload and import data files into your system.</p>
      </div>
      
      {/* Upload area */}
      {files.length === 0 && (
        <div 
          className={`card p-8 text-center border-2 border-dashed transition-all ${
            isDragging 
              ? 'border-primary bg-primary bg-opacity-5' 
              : 'border-gray-300 hover:border-primary'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
          <p className="text-gray-600 mb-4">or click to browse files from your computer</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="px-3 py-1 bg-light rounded-full text-sm text-gray-600">CSV</span>
            <span className="px-3 py-1 bg-light rounded-full text-sm text-gray-600">XLSX</span>
            <span className="px-3 py-1 bg-light rounded-full text-sm text-gray-600">XML</span>
            <span className="px-3 py-1 bg-light rounded-full text-sm text-gray-600">JSON</span>
          </div>
          
          <button 
            onClick={() => fileInputRef.current.click()} 
            className="btn btn-primary btn-ripple"
          >
            Browse Files
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
      )}
      
      {/* File list */}
      {files.length > 0 && (
        <div className="card">
          <div className="p-4 border-b border-light-gray">
            <h3 className="font-medium">Uploaded Files ({files.length})</h3>
          </div>
          
          <div className="p-4">
            {files.map((file, index) => (
              <div 
                key={file.name} 
                className="flex items-center p-3 border rounded-md mb-3 bg-white hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mr-3">
                  {getFileIcon(file.name)}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-sm">{file.name}</h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="mx-2">•</span>
                    <span>{file.type || 'Unknown type'}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[file.name] || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-3 flex items-center">
                  {uploadProgress[file.name] === 100 ? (
                    <span className="text-success">
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : (
                    <span className="text-gray-500">{uploadProgress[file.name]}%</span>
                  )}
                  <button 
                    onClick={() => removeFile(file.name)}
                    className="ml-3 text-gray-400 hover:text-danger transition-colors p-1"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-between mt-4">
              <button 
                onClick={() => fileInputRef.current.click()} 
                className="btn btn-sm btn-secondary"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add More Files
              </button>
              
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                className="hidden"
                onChange={handleFileInputChange}
              />
              
              {!importStatus && (
                <button 
                  className="btn btn-primary"
                  onClick={() => simulateImport()}
                  disabled={Object.values(uploadProgress).some(progress => progress < 100)}
                >
                  Start Import
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Import status */}
      {getImportStatusContent()}
      
      {/* Import history */}
      <div className="card mt-6">
        <div className="p-4 border-b border-light-gray">
          <h3 className="font-medium">Recent Imports</h3>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="bg-light">
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Files</th>
              <th className="text-left py-3 px-4 font-medium">Records</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-light transition-colors">
              <td className="py-3 px-4">2023-05-12 09:45 AM</td>
              <td className="py-3 px-4">3 files</td>
              <td className="py-3 px-4">1,245 records</td>
              <td className="py-3 px-4">
                <span className="status-badge healthy">Completed</span>
              </td>
              <td className="py-3 px-4">
                <button className="text-primary hover:underline">View Details</button>
              </td>
            </tr>
            <tr className="border-b hover:bg-light transition-colors">
              <td className="py-3 px-4">2023-05-10 02:30 PM</td>
              <td className="py-3 px-4">1 file</td>
              <td className="py-3 px-4">567 records</td>
              <td className="py-3 px-4">
                <span className="status-badge healthy">Completed</span>
              </td>
              <td className="py-3 px-4">
                <button className="text-primary hover:underline">View Details</button>
              </td>
            </tr>
            <tr className="border-b hover:bg-light transition-colors">
              <td className="py-3 px-4">2023-05-08 11:20 AM</td>
              <td className="py-3 px-4">2 files</td>
              <td className="py-3 px-4">890 records</td>
              <td className="py-3 px-4">
                <span className="status-badge danger">Failed</span>
              </td>
              <td className="py-3 px-4">
                <button className="text-primary hover:underline">View Error Log</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModernDataImport;