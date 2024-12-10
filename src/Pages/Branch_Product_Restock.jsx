import React, { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Branch_Product_Restock.module.css'
import { useParams } from 'react-router-dom';
import supabase from '../supabase-client';

export const Branch_Product_Restock = () => {
  const {branch_id} = useParams()
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



  const [isChecked, setIsChecked] = useState(false);
  // Hàm xử lý khi checkbox được thay đổi
  const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
  };
  
  return (
    <div >
      <Header></Header>
      <div className={styles.Content}>
        <div className={styles.Wrapper}>
        <div className={styles.TableName}>{branchName}'S PRODUCT</div>
        <div className={styles.ActionButton}>
          <button className={styles.Create}>Create Report</button>
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
              <th></th>
              <th></th>
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
            <td>
            <input className={styles.check_box}
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={handleCheckboxChange} 
              />
            </td>
          </tbody>
          <tbody>
            <td>MP0002</td>
            <td>Toner</td>
            <td>5</td>
            <td>Toner</td>
            <td>20 - 08 - 2024</td>
            <td>09 - 12 - 2026</td>
            <td>2 years</td>
            <td>08 - 09 - 2024</td>
            <td>
            <input className={styles.check_box}
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={handleCheckboxChange} 
              />
            </td>
          </tbody>
        </table>
      </div>

      </div>
    </div>
  )
}
