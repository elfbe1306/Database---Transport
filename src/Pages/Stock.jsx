import React from 'react'
import { Header } from '../components/Header'
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Stock.module.css'

export const Stock = () => {
  return (
   <div>
    <Header></Header>
    <div className={styles.Content}>
      <div className={styles.Wrapper}>
        <div className={styles.TableName}>STOCK</div>
        <div className={styles.ActionButton}>
        <div className={styles.search_input_box}>
          <TfiSearch className={styles.icon} />
          <input 
              type="text" 
              className={styles.search_input} 
              placeholder="Search stock..."
          />
          </div>
        </div>
      </div>
      <div className={styles.table_wrapper} >
      <div className={styles.divider}></div>
        <table className={styles.branch_product_table}>
          <thead>
            <tr>
              <th>Store</th>
              <th>Quantity</th>
              <th>Duration</th>
              <th>Report</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
              <td>Kho Phú Nhuận</td>
              <td>1 thùng</td>
              <td>Tomorrow</td>
              <td>View</td>
              <td>
                <button className={styles.plus_button}>+</button>
              </td>
          </tbody>
        </table>
      </div>
    </div>
   </div>
  )
}
