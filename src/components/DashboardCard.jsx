import React, { useState } from 'react';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Animation.css';

const DashboardCard = ({ title, value, trend, percentage, color, data }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Define gradient colors based on the card's primary color
  const gradientStart = color || '#4361ee';
  const gradientEnd = `${gradientStart}20`; // Adding 20 for transparency
  
  // Sample data for the sparkline
  const sparklineData = data || [
    { value: 30 },
    { value: 40 },
    { value: 35 },
    { value: 50 },
    { value: 45 },
    { value: 60 },
    { value: 75 },
    { value: 68 },
    { value: 80 }
  ];
  
  // Determine trend direction and class
  const getTrendClass = () => {
    if (trend === 'up') return 'trend-up';
    if (trend === 'down') return 'trend-down';
    return '';
  };
  
  // Determine trend icon
  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '';
  };
  
  return (
    <div 
      className="card analytics-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderTop: `4px solid ${color || '#4361ee'}`,
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 20px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-600 mb-1">{title}</h3>
          <div className="stat-value" style={{ color: color || '#212529' }}>{value}</div>
          <div className="flex items-center mt-1">
            <span className={`trend-indicator ${getTrendClass()}`}>
              {getTrendIcon()} {percentage}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
        
        <div 
          className="w-16 h-16 flex items-center justify-center rounded-full"
          style={{ 
            backgroundColor: `${color}15`, // Very light version of the color
            transition: 'all 0.3s ease'
          }}
        >
          {/* You can replace this with any icon */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={color || '#4361ee'} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        </div>
      </div>
      
      {/* Sparkline chart */}
      <div 
        className="h-12 mt-4 overflow-hidden"
        style={{ opacity: isHovered ? 1 : 0.7, transition: 'all 0.3s ease' }}
      >
        <svg width="100%" height="100%" viewBox="0 0 180 40" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={gradientStart} stopOpacity="0.4" />
              <stop offset="100%" stopColor={gradientEnd} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path 
            d={`
              M0 40
              ${sparklineData.map((d, i) => 
                `L${(i * 180) / (sparklineData.length - 1)} ${40 - (d.value / 100) * 40}`
              ).join(' ')}
              L180 40 Z
            `}
            fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
          />
          
          {/* Line */}
          <path 
            d={`
              M0 ${40 - (sparklineData[0].value / 100) * 40}
              ${sparklineData.map((d, i) => 
                `L${(i * 180) / (sparklineData.length - 1)} ${40 - (d.value / 100) * 40}`
              ).join(' ')}
            `}
            fill="none"
            stroke={color || '#4361ee'}
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

export default DashboardCard;