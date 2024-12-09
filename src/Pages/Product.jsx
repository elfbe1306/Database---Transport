import React from 'react';
import { Header } from '../components/Header';;
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Product.module.css';

export const Product = () => {
  return (
    <div>
      <Header></Header>

      <div className={styles.Content}>
        <div className={styles.Wrapper}>
          <div className={styles.TableName}>PRODUCT</div>
          <div className={styles.ActionButton}>
            <button className={styles.Addbutton}>Add product</button>
            <input type="text" className={styles.search_input}></input>
            <TfiSearch/>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.table_wrapper}>
        <table className={styles.product_table}>
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

              <div className={styles.divider}></div>

              <tbody>
                <tr>
                  <td>MP0001</td>
                  <td>Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml </td>
                  <td>100</td>
                  <td>Sữa rửa mặt</td>
                  <td>20-08-2024</td>
                  <td>09-12-2026</td>
                  <td className={styles.time_left}>2 year</td>
                  <td>08-09-2024</td>
                  <td className={styles.actions}>
                    <button className={styles.edit_button}>✏️</button>
                    <button className={styles.delete_button}>❌</button>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>

    </div>
  )
}
