import React from 'react';
import './styles.css';

const InfoBlock = ({ title, data, headerColor }) => {
  return (
    <div className="info-block" style={{ backgroundColor: headerColor }}>
      <div className="info-header">
        <span className="info-title">{title}</span>
        <span className="info-view-all">View All</span>
      </div>
      <div className="info-data">
        {data.map((item, index) => (
          <div className="info-item" key={index}>
            <div className="info-indicator" style={{ backgroundColor: item.color }} />
            <div className="info-text">
              <div className="info-label">{item.label}</div>
              <div className="info-value">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoBlock;

