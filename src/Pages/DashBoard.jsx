import React, { useEffect } from 'react';
// import supabase from '../supabase-client';
import { Header } from '../components/Header';
import { InfoBlock } from '../components/DashBoard_Components/InfoBlock';
import styles from '../Styles/DashBoard_Styles/DashBoard.module.css';

export const DashBoard = () => {
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
    <div>
      <Header></Header>

      <div className={styles.wrapper}>
        <InfoBlock title="PRODUCTS" data={productData} headerColor="#C5D2E4" />
        <InfoBlock title="EXPORT" data={exportData} headerColor="#CAE3C2" />
      </div>

    </div>
  )
}
