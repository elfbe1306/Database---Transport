import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Export.module.css'
import supabase from '../supabase-client'

export const Export = () => {
  const [exportReport, setExportReport] = useState([]);

  useEffect(() => {
    fetchExportReport();
    fetchTesting();
  }, []);

  const fetchExportReport = async () => {
    const { data, error } = await supabase.from('report').select('*').like('report_id', 'EX%');
    if(error) {
      console.error('Error fetching export report:', error);
    } else {
      setExportReport(data);
    }
  }

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
              <th>Create Date</th>
              <th>Create Time</th>
              <th>Status</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {exportReport.map((report) => (
              <tr key={report.report_id}>
                <td>{report.report_id}</td>
                <td>Warehouse Location</td>
                <td>{report.report_create_date}</td>
                <td>{report.report_create_time}</td>
                <td>{report.status}</td>
                <td>
                  <button className={styles.plus_button}>+</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   </div>
  )
}
