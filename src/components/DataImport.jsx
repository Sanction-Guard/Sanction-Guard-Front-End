import React, { useState } from 'react';
import { Container, Card, Button, Badge, ProgressBar, Table } from 'react-bootstrap';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../styles/layouts/DataImport.css';

function DataImport() {
  // Sample data for recent imports
  const recentImports = [
    { id: 1, filename: 'customer_list_2023.csv', status: 'completed', date: 'Mar 15, 2023', records: 2345, matchRate: 98.2 },
    { id: 2, filename: 'vendors_q2.xlsx', status: 'processing', date: 'Mar 17, 2023', records: 789, progress: 65 },
    { id: 3, filename: 'international_entities.csv', status: 'error', date: 'Mar 10, 2023', records: 1267, error: 'Format validation failed' }
  ];

  // State for active tab
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="data-import-container fade-in">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Data Import</h1>
        <p className="text-gray-600">Import and manage your data files.</p>
      </div>

      {/* Tab Navigation */}
      <div className="import-tabs mb-4">
        <button 
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload New File
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Import History
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Import Settings
        </button>
      </div>

      {/* Upload Tab Content */}
      {activeTab === 'upload' && (
        <div className="slide-up">
          <Card className="mb-4 upload-card">
            <Card.Body>
              <div className="text-center p-4 border-2 border-dashed rounded upload-area">
                <div 
                  className="w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-3"
                  style={{ backgroundColor: 'var(--primary-light)', opacity: '0.2' }}
                >
                  <i className="bi bi-cloud-upload fs-2" style={{ color: 'var(--primary)' }}></i>
                </div>
                <h3 className="font-semibold mb-2">Drag and drop files here</h3>
                <p className="text-gray-600 mb-3">or click to browse your files</p>
                <Button className="btn btn-primary btn-ripple">Select Files</Button>
                <p className="text-xs text-gray-500 mt-3">Supported formats: CSV, XLSX, JSON</p>
              </div>
            </Card.Body>
          </Card>

          <Card className="dashboard-card">
            <Card.Header className="bg-light">
              <h3 className="font-semibold">Import Options</h3>
            </Card.Header>
            <Card.Body>
              <div className="form-group mb-3">
                <label className="form-label mb-1 font-medium">Import Type</label>
                <select className="form-control">
                  <option>Entity Data</option>
                  <option>Transaction Data</option>
                  <option>User Accounts</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label className="form-label mb-1 font-medium">Data Handling</label>
                <select className="form-control">
                  <option>Append to existing data</option>
                  <option>Replace existing data</option>
                  <option>Update matched records</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label mb-1 font-medium">Validation Level</label>
                <select className="form-control">
                  <option>Standard</option>
                  <option>Strict</option>
                  <option>Minimal</option>
                </select>
              </div>
            </Card.Body>
            <Card.Footer className="bg-light">
              <Button className="btn btn-primary btn-ripple">Start Import</Button>
              <Button className="btn btn-secondary ml-2">Save Settings</Button>
            </Card.Footer>
          </Card>
        </div>
      )}

      {/* History Tab Content */}
      {activeTab === 'history' && (
        <div className="slide-up">
          <Card className="dashboard-card">
            <Card.Header className="bg-light">
              <h3 className="font-semibold">Recent Imports</h3>
            </Card.Header>
            <Card.Body>
              {recentImports.map((item) => (
                <Card key={item.id} className={`mb-3 import-history-card border-left-${item.status === 'error' ? 'danger' : item.status === 'processing' ? 'primary' : 'success'}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1 font-medium">{item.filename}</h5>
                        <p className="text-sm text-gray-600 mb-0">{item.records} records • {item.date}</p>
                      </div>
                      <span className={`status-badge ${item.status}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    {item.status === 'processing' && (
                      <div className="mt-3 pt-3 border-t w-full">
                        <div className="w-full bg-medium-gray rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">{item.progress}% complete</p>
                      </div>
                    )}
                    
                    {item.status === 'completed' && (
                      <div className="mt-3 pt-3 border-t w-full">
                        <div className="d-flex justify-content-between">
                          <span className="text-sm">Match Rate: <strong>{item.matchRate}%</strong></span>
                          <Button className="btn-sm btn-primary">View Report</Button>
                        </div>
                      </div>
                    )}
                    
                    {item.status === 'error' && (
                      <div className="mt-3 pt-3 border-t w-full">
                        <div className="bg-light p-2 rounded text-danger">
                          <i className="bi bi-exclamation-circle mr-2"></i>
                          {item.error}
                        </div>
                        <div className="mt-2 text-right">
                          <Button className="btn-sm btn-secondary mr-2">View Details</Button>
                          <Button className="btn-sm btn-primary">Try Again</Button>
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
            <Card.Footer className="bg-light text-center">
              <Button className="btn btn-primary btn-ripple">View All Imports</Button>
            </Card.Footer>
          </Card>
        </div>
      )}

      {/* Settings Tab Content */}
      {activeTab === 'settings' && (
        <div className="slide-up">
          <Card className="dashboard-card">
            <Card.Header className="bg-light">
              <h3 className="font-semibold">Default Import Settings</h3>
            </Card.Header>
            <Card.Body>
              <div className="form-group mb-4">
                <label className="form-label mb-1 font-medium">Default File Format</label>
                <select className="form-control">
                  <option>CSV</option>
                  <option>Excel (XLSX)</option>
                  <option>JSON</option>
                </select>
              </div>
              
              <div className="form-group mb-4">
                <label className="form-label mb-1 font-medium">CSV Delimiter</label>
                <select className="form-control">
                  <option>Comma (,)</option>
                  <option>Semicolon (;)</option>
                  <option>Tab</option>
                </select>
              </div>
              
              <div className="form-group mb-4">
                <label className="form-label mb-1 font-medium">Date Format</label>
                <select className="form-control">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              
              <div className="form-check mb-4">
                <input type="checkbox" className="form-check-input" id="headerRow" defaultChecked />
                <label className="form-check-label ml-2" htmlFor="headerRow">First row contains headers</label>
              </div>
              
              <div className="form-check mb-4">
                <input type="checkbox" className="form-check-input" id="autoMap" defaultChecked />
                <label className="form-check-label ml-2" htmlFor="autoMap">Automatically map columns</label>
              </div>
              
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="validation" defaultChecked />
                <label className="form-check-label ml-2" htmlFor="validation">Validate data before import</label>
              </div>
            </Card.Body>
            <Card.Footer className="bg-light">
              <Button className="btn btn-primary btn-ripple">Save Settings</Button>
              <Button className="btn btn-secondary ml-2">Reset to Defaults</Button>
            </Card.Footer>
          </Card>
        </div>
      )}
    </div>
  );
}

export default DataImport;