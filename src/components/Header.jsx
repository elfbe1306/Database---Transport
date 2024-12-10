import React from 'react'
import styles from '../Styles/Header.module.css'

export const Header = () => {
  return (
    <div className={styles.Header}>
      <div className={styles.Navi}>
        <div className={styles.NaviText}>Dashboard</div>
        <div className={styles.NaviText}>Products</div>
        <div className={styles.NaviText}>Export</div>
        <div className={styles.NaviText}>Branch</div>
        <div className={styles.NaviText}>Stock</div>
        <div className={styles.NaviText}>Report</div>
      </div>
    </div>
  )
}
