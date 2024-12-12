import React from 'react'
import styles from '../Styles/QRCode.module.css'

export const QRCode = () => {
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
          <tr>
            <td>hhhdshfdjfhsdjfhsdjfhdsjfhdsjhfdshfdshfdjhfjdhfds</td>
            <td>hhhfhsdjkfhjkdfhdsjkfhh</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
