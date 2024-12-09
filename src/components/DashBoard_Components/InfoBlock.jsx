import React from 'react'
import styles from '../../Styles/DashBoard_Styles/InfoBlock.module.css'

export const InfoBlock = ({ title, data, headerColor }) => {
  return (
    <div className={styles.info_block} style={{ backgroundColor: headerColor }}>
      <div className={styles.info_header}>
        <span className={styles.info_title}>{title}</span>
        <span className={styles.info_view_all}>View All</span>
      </div>
      <div className={styles.info_data}>
        {data.map((item, index) => (
          <div className={styles.info_item} key={index}>
            <div className={styles.info_indicator} style={{ backgroundColor: item.color }} />
            <div className={styles.info_text}>
              <div className={styles.info_label}>{item.label}</div>
              <div className={styles.info_value}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
