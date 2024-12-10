import React from 'react'
import { Header } from '../components/Header'
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Export.module.css'
export const Export = () => {
  return (
    <div>
    <Header></Header>
    <div className={styles.Content}>
      <div className={styles.Wrapper}>
        <div className={styles.TableName}>EXPORT</div>
        <div className={styles.ActionButton}>
        <div className={styles.search_input_box}>
          <TfiSearch className={styles.icon} />
          <input 
              type="text" 
              className={styles.search_input} 
              placeholder="Search report..."
          />
          </div>
        </div>
      </div>
      <div className={styles.table_wrapper} >
      <div className={styles.divider}></div>
        <table className={styles.branch_product_table}>
          <thead>
            <tr>
              <th>Report's ID</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
              <td>RP1001</td>
              <td>Kho Phú Nhuận</td>
              <td>not started yet</td>
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
