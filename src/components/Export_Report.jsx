import React, { useEffect } from 'react'
import styles from '../Styles/Export_Report.module.css'

export const Export_Report = (props) => {
  console.log(props)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.company}>
            <div className={styles.company_name}>Công ty TNHH Băng Áo Đen</div>
            <br/>
            <div className={styles.city}>Thành phố Hồ Chí Minh</div>
        </div>
        <div className={styles.title}>
            <div className={styles.text}>PHIẾU XUẤT KHO</div>
            <div className={styles.details}>
                <p className={styles.date}>{props.reportCreateDate}</p>
                <p>Số phiếu: PN15/001</p>
            </div>
        </div>
        <div className={styles.form_info}>
            <div className={styles.form_no}>Mẫu số: 01 - VT</div>
            <br/>
            <div className={styles.form_text}>(Ban hành theo QĐ số: 48/2006/QĐ/BTC ngày 14/09/2006 của Bộ trưởng BTC)</div>
        </div>
      </div>

      <table className={styles.info_table}>
        <tr>
          <td>Họ và tên người giao: {props.driverFullName}</td>
        </tr>
        <tr>
          <td>Nhập tại kho: {props.warehouseName}</td>
        </tr>
        <tr>
          <td>Địa điểm: {props.warehouseLocation}</td>
        </tr>
      </table>

      <table className={styles.product_table}>
        <tr>
          <td className={styles.number}>STT</td>
          <td className={styles.brand_name}>Tên nhãn hiệu, qui cách, phẩm chất vật tư (sản phẩm,hàng hoá)</td>
          <td className={styles.id}>Mã số</td>
          <td className={styles.unit}>Đơn vị tính</td>
          <td className={styles.quantity}>Số lượng</td>
        </tr>
        {props.products.map((pkg, index) => (
          <tr key={pkg.package?.package_id}>
            <td>{index + 1}</td>
            <td>{pkg.package?.product_name}</td>
            <td>{pkg.package?.package_id}</td>
            <td>Chai</td>
            <td>{pkg.package?.product_total}</td>
          </tr>
        ))}
      </table>

      <table className={styles.signature}>
        <tr>
          <td>NGƯỜI LẬP PHIẾU</td>
          <td>NGƯỜI GIAO HÀNG</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Nguyễn Văn C</td>
          <td>Nguyễn Văn B</td>
        </tr>
      </table>
    </div>
  )
}
