import InfoBlock from "./Overview";
import React from 'react';
import './App.css';
import Modal from "./Modal";
import './Modal.css'

function App(){
  const productData = [
    { label: 'AVAILABLE', value: 4000, color: '#4096FF' },
    { label: 'EXPIRED PRODUCTS', value: 100, color: '#DC4446' },
  ];

  const exportData = [
    { label: 'READY TO DELIVERY', value: 23, color: '#4096FF' },
    { label: 'DELIVERING', value: 12, color: '#69B1FF' },
    { label: 'CANCEL', value: 3, color: '#DC4446' },
  ];
  return (
    <>
    <div className="wrapper">
      <InfoBlock title="PRODUCTS" data={productData} headerColor="#C5D2E4" />
      <InfoBlock title="EXPORT" data={exportData} headerColor="#CAE3C2" />
    </div>
      <Modal></Modal>
    </>
  );
};

export default App;