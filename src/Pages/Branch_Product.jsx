import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Branch_Product.module.css'
import { useParams } from 'react-router-dom';
import supabase from '../supabase-client';

export const Branch_Product = () => {
  const {branch_id} = useParams();
  const [branchName, setBranchName] = useState('');

  useEffect(()=> {
    fetchBranchName();
  }, [])

  const fetchBranchName = async () => {
    const {data, error} = await supabase.rpc('retrieve_warehouse_name', {branch_id});
    if(error) {
      console.error('Error fetching name:', error);
    } else {
      setBranchName(data);
    }
  }

  return (
    <div >
      <Header></Header>
      <div className={styles.Content}>
        <div className={styles.Wrapper}>
        <div className={styles.TableName}>{branchName}'s PRODUCT</div>
        <div className={styles.ActionButton}>
          <button className={styles.Restock}>Restock</button>
          <div className={styles.search_input_box}>
          <TfiSearch className={styles.icon} />
          <input 
              type="text" 
              className={styles.search_input} 
              placeholder="Search products..."
          />
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.table_wrapper} >
        <table className={styles.branch_product_table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Total</th>
              <th>Category</th>
              <th>Production Date</th>
              <th>Expired Date</th>
              <th>Time Left</th>
              <th>Imported Date</th>
              <th>Exported Date</th>
            </tr>
          </thead>
          <tbody>
            <td>MP0001</td>
            <td>Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml</td>
            <td>100</td>
            <td>Sữa rửa mặt</td>
            <td>20 - 08 - 2024</td>
            <td>09 - 12 - 2026</td>
            <td>2 years</td>
            <td>08 - 09 - 2024</td>
            <td>NULL</td>
          </tbody>
        </table>
      </div>

      </div>
    </div>
  )
}
