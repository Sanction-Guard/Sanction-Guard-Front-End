import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useSearch } from './SearchContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useState } from 'react';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../styles/layouts/ReportsAnalytics.css';

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
  const [lastReportUrl, setLastReportUrl] = useState(null);
  const [lastReportName, setLastReportName] = useState('');
  const { totalSearches, totalMatches, searchResults } = useSearch();

  const matchRate = totalSearches > 0 ? ((10 / totalMatches) * 100).toFixed(2) : 0; //change the logic numerator should be the number of matches above 50%
  const responseTime = (Math.random() * 2 + 1).toFixed(2); // Simulating response time (1-3 sec)

  const generatePDF = () => {
    if (!searchResults || searchResults.length === 0) {
      alert("No data to generate the report.");
      return;
    }

    const matchedResults = searchResults.filter(result => 
      result.similarityPercentage && result.similarityPercentage > 0
    ); // Adjust the condition based on your matching criteria(threashold value)

    const doc = new jsPDF();
    const date = new Date().toLocaleString();

  
    doc.setFontSize(18);
    doc.text('Daily Screening Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Total Searches: ${totalSearches}`, 14, 40);
    doc.text(`Total Matches: ${matchedResults.length}`, 14, 50); // Use filtered list
    doc.text(`Match Rate: ${matchRate}%`, 14, 60);
    doc.text(`Avg Response Time: ${responseTime} sec`, 14, 70);

    if (searchResults && searchResults.length > 0) {
      const tableColumn = ['Reference No.', 'Full Name', 'Date of Birth', 'NIC No.', 'Similarity %'];
      const tableRows = matchedResults.map(result => [
        result.referenceNumber || '-',
        result.fullName || '-',
        result.dateOfBirth || '-',
        result.nicNumber || '-',
        result.similarityPercentage ? result.similarityPercentage + '%' : '-'
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      });
    } else {
      doc.text('No matches found for today.', 14, 80);
    }


    //pdf blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setLastReportUrl(pdfUrl);
    setLastReportName(`screening_report_${date.replace(/[\s:/]/g, '_')}.pdf`);
    doc.save(`screening_report_${date.replace(/[\s:/]/g, '_')}.pdf`);
  };

  //allow to download last generated report
  const handleDownload = () => {
    if (!lastReportUrl) {
      alert("No report available for download.");
      return;
    }
  
    const a = document.createElement('a');
    a.href = lastReportUrl;
    a.download = `screening_report_${new Date().toLocaleDateString().replace(/\//g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  //previewing the pdf
  const handlePreview = () => {
    if (!lastReportUrl) {
      alert("No report available for preview.");
      return;
    }
  
    window.open(lastReportUrl, '_blank');
  };
  

  //second report
  const generateRiskPDF = () => {
    if (!searchResults || searchResults.length === 0) {
      alert("No data to generate the risk report.");
      return;
    }

    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text('Risk Analysis Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Total Searches: ${totalSearches}`, 14, 40);
    
    const tableColumn = ['Reference No.', 'Full Name', 'Similarity %', 'Risk Level'];
    const tableRows = searchResults.map(result => {
      let riskLevel = "Low Risk";
      if (result.similarityPercentage >= 80) {
        riskLevel = "High Risk";
      } else if (result.similarityPercentage >= 50) {
        riskLevel = "Medium Risk";
      }

      return [
        result.referenceNumber || '-',
        result.fullName || '-',
        result.similarityPercentage ? result.similarityPercentage + '%' : '-',
        riskLevel
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    //pdf blob for second pdf
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setLastReportUrl(pdfUrl);
    setLastReportName(`risk_analysis_${date.replace(/[\s:/]/g, '_')}.pdf`);
    doc.save(`risk_analysis_${date.replace(/[\s:/]/g, '_')}.pdf`);
  };

  //compilance report
  const generateComplianceReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text('Compliance Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Total Searches: ${totalSearches}`, 14, 40);
    doc.text(`Total Users Engaged: ${totalMatches}`, 14, 50); // Assuming totalMatches represents active users
    doc.text(`Match Rate: ${matchRate}%`, 14, 60);
    doc.text(`Avg Response Time: ${responseTime} sec`, 14, 70);

    const complianceData = [
      ['Check', 'Status'],
      ['System Uptime', '99.9%'],
      ['Response Time < 3s', responseTime < 3 ? 'Pass' : 'Fail'],
      ['Data Integrity Checks', 'Pass'], // Placeholder values
      ['Failed Compliance Checks', '0'], // You might need real compliance tracking
    ];

    autoTable(doc, {
      startY: 80,
      head: [['Compliance Metric', 'Status']],
      body: complianceData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    //pdf blob for third pdf
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setLastReportUrl(pdfUrl);
    setLastReportName(`Compilance_report_${date.replace(/[\s:/]/g, '_')}.pdf`);
    doc.save(`Compilance_report_${date.replace(/[\s:/]/g, '_')}.pdf`);
  };

  return (
    <div className="reports-container fade-in">
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Generate reports and view analytics for your screening activities.</p>
      </div>
      
      {/* Report generation options */}
      <div className="report-options-grid">
        {/* Screening Summary Card */}
        <Card className="report-card report-option-card slide-up delay-1">
          <Card.Body className="p-4">
            <div className="icon-container" style={{ backgroundColor: 'rgba(67, 97, 238, 0.1)' }}>
              <i className="bi bi-file-earmark-text" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}></i>
            </div>
            <h5 className="font-semibold mb-2">Screening Summary</h5>
            <p className="text-gray-600 mb-4">Daily screening activities and matches</p>
            <Button className="btn btn-primary btn-ripple w-full" onClick={generatePDF}>
              Generate PDF
            </Button>
          </Card.Body>
        </Card>
        
        {/* Risk Analysis Card */}
        <Card className="report-card report-option-card slide-up delay-2">
          <Card.Body className="p-4">
            <div className="icon-container" style={{ backgroundColor: 'rgba(76, 201, 240, 0.1)' }}>
              <i className="bi bi-shield-check" style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}></i>
            </div>
            <h5 className="font-semibold mb-2">Risk Analysis</h5>
            <p className="text-gray-600 mb-4">Risk levels and screening patterns</p>
            <Button className="btn btn-primary btn-ripple w-full" onClick={generateRiskPDF}>
              Generate
            </Button>
          </Card.Body>
        </Card>
        
        {/* Compliance Report Card */}
        <Card className="report-card report-option-card slide-up delay-3">
          <Card.Body className="p-4">
            <div className="icon-container" style={{ backgroundColor: 'rgba(247, 37, 133, 0.1)' }}>
              <i className="bi bi-clipboard-data" style={{ color: 'var(--accent)', fontSize: '1.5rem' }}></i>
            </div>
            <h5 className="font-semibold mb-2">Compliance Report</h5>
            <p className="text-gray-600 mb-4">System usage and compliance tracking</p>
            <Button className="btn btn-primary btn-ripple w-full" onClick={generateComplianceReport}>
              Generate
            </Button>
          </Card.Body>
        </Card>
      </div>

      {/* Generated Reports Section */}
      <Card className="report-card slide-up" style={{ animationDelay: '0.3s' }}>
        <Card.Header className="p-4 border-b">
          <h4 className="font-semibold">Generated Reports</h4>
        </Card.Header>
        <Card.Body className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium mb-1">Latest Screening Report</h4>
              <h5 className="text-gray-600 mb-1">{lastReportName || 'No Report Available'}</h5>
              <small className="text-gray-500">{new Date().toLocaleDateString()}</small>
            </div>
            <div>
              <Button className="btn btn-secondary btn-sm mr-2" onClick={handlePreview} disabled={!lastReportUrl}>
                Preview
              </Button>
              <Button className="btn btn-primary btn-sm" onClick={handleDownload} disabled={!lastReportUrl}>
                Download
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Analytics Dashboard */}
      <div className="mt-6 slide-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
        
        {/* Stats cards */}
        <div className="dashboard-grid">
          {/* Total Screenings Card */}
          <div className="analytics-card slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="stat-label">Total Screenings</div>
            <div className="stat-value">{totalSearches}</div>
            <div className={`trend-indicator ${totalSearches > 10 ? 'trend-up' : 'trend-down'}`}>
              {totalSearches > 10 ? '↑ Increase' : '↓ Decrease'}
            </div>
          </div>
          
          {/* Match Rate Card */}
          <div className="analytics-card slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="stat-label">Match Rate</div>
            <div className="stat-value">{matchRate}%</div>
            <div className={`trend-indicator ${matchRate > 50 ? 'trend-up' : 'trend-down'}`}>
              {matchRate > 50 ? '↑ High' : '↓ Low'}
            </div>
          </div>
          
          {/* Response Time Card */}
          <div className="analytics-card slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="stat-label">Avg Response Time</div>
            <div className="stat-value">{responseTime} sec</div>
            <div className="trend-indicator trend-up">Stable</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsAnalytics;