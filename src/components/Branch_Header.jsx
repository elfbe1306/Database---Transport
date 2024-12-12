import React from 'react'
import styles from '../Styles/Branch_Header.module.css'
import {Link} from 'react-router-dom';

export const Branch_Header = () => {
  return (
    <div className={styles.Header}>
      <div className={styles.Navi}>
        <Link to=" " className={styles.NaviText}>Dashboard</Link>
        <Link to="/branch-product" className={styles.NaviText}>Products</Link>
        <Link to="/branch-status" className={styles.NaviText}>Status</Link>
        <Link to=" " className={styles.NaviText}>Report</Link>
      </div>
    </div>
  )
}
