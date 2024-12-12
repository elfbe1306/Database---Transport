import React from 'react'
import styles from '../Styles/QRCode.module.css'
import QRCode from 'react-qr-code'

export const QRCodeProduct = (props) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.tableQR}>
        <thead>
          <tr>
            <th className={styles.product}>Product</th>
            <th className={styles.QRi}>QR Image</th>
        </tr>
        </thead>
        <tbody>
          {props.products.map((pkg) => (
            <tr key={pkg.package?.package_id}>
              <td>{pkg.package?.product_name}</td>
              <td>
                <QRCode
                  size={256}
                  style={{ height: "200", maxWidth: "100%", width: "100%" }}
                  value={pkg.package?.package_id}
                  viewBox={`0 0 256 256`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
