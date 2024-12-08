import React, { useState } from "react";
import TableComponent from "./TableComponent";
import "./Modal.css";

export default function Modal() {
  const [showAssignContainer, setShowAssignContainer] = useState(false);

  const toggleAssignContainer = () => {
    setShowAssignContainer(!showAssignContainer);
  };
  if(showAssignContainer){
    document.body.classList.add('active-modal')
  }else{
    document.body.classList.remove('active-modal')
  }
  const rowData1 = [
    { store: "Nguyen Van Troi", product: "Candid Retinol Essence 0.5", total: "1", choose: "View branch", top: 100 },
    { store: "Nguyen Van Troi", product: "Candid Retinol Essence 1", total: "2", choose: null, top: 142 },
    { store: "To Hien Thanh", product: "Candid AHA & PHA Exfoliating Gel", total: "4", choose: null, top: 188 },
  ];
  const rowData2 = [
    { store: "Nguyen Van Troi", quantity: "5 cartons", duration: "Tomorrow", top: 100 },
    { store: "Nguyen Trai", quantity: "6 cartons", duration: "Today", top: 142 },
    { store: "To Hien Thanh", quantity: "3 cartons", duration: "4 days next", top: 188 },
  ];

  return (
    <>
      <div className="bigTable">
        <TableComponent title="NEED TO BE RESTOCKED" rowData={rowData1} lastColumnType="choose" backgroundColor="#FFFFE8B8" />  
        <TableComponent 
          title="STOCK" 
          rowData={rowData2} 
          lastColumnType="assign" 
          backgroundColor="#ABD6D9BA"
          toggleAssignContainer={toggleAssignContainer}
        />
      </div>

      {showAssignContainer && (
        <div className="modal">
          <div onClick={toggleAssignContainer} className="overlay"></div>
            <div className="assign-container">
              <div className="assign-header">ASSIGN</div>
              <div className="input-box driver-box"></div>
              <div className="input-box time-box"></div>
              <div className="arrow-icon time-arrow"></div>
              <div className="input-box note-box"></div>
              <div className="arrow-icon driver-arrow"></div>
              <div className="label driver-label">Driver</div>
              <div className="label time-label">Time</div>
              <div className="label note-label">Note <br />(if needed)</div>
              <div className="save-button"></div>
              <div className="save-text" onClick={toggleAssignContainer}>Save</div>
            </div>
        </div>
      )}
    </>
  );
}