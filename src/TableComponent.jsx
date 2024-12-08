import React from "react";
import "./styles.css";

const TableComponent = ({ title, rowData, lastColumnType, backgroundColor, toggleAssignContainer }) => {
  return (
    <div className="background-block" style={{background: backgroundColor }}>
      {[49, 96, 140, 184, 228, 272, 316, 360, 404].map((top, index) => (
        <div key={index} className="divider" style={{ top }}></div>
      ))}

      {/* Header */}
      <div className="header" style={{ top: 62 }}>
        <div className="header-item">STORE</div>
        <div className="header-item">
          {lastColumnType === "assign" ? "QUANTITY" : "PRODUCT"}
        </div>
        <div className="header-item">
          {lastColumnType === "assign" ? "DURATION" : "TOTAL"}
        </div>
        <div className="header-item">
          {lastColumnType === "assign" ? "ASSIGN" : "CHOOSE"}
        </div>
      </div>

      {/* Rows */}
      {rowData.map((row, index) => (
        <div className="row" style={{ top: row.top }} key={index}>
          <div className="row-item store">{row.store}</div>
          <div className="row-item product">
            {lastColumnType === "assign" ? row.quantity : row.product}
          </div>
          <div className="row-item total">
            {lastColumnType === "assign" ? row.duration : row.total}
          </div>
          <div className="row-item choose">
            {lastColumnType === "assign" ? (<button className="assign-button" onClick={toggleAssignContainer}>+</button>) : (row.choose)}
          </div>
        </div>
      ))}

      {/* Title */}
      <div className="title" style={{ top: 17 }}>
        <span className="title-text">{title}</span>
        <span className="view-all">View All</span>
      </div>
    </div>
  );
};

export default TableComponent;
