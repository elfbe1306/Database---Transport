import React, {useState} from "react";
import { Header } from "../components/Header";
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Branch_Home_Product_Retrieve.module.css'
import { Branch_Header } from "../components/Branch_Header";

export const Branch_Home_Product_Retrieve = () =>{
    const [isChecked, setIsChecked] = useState(false);

    // Hàm xử lý khi checkbox được thay đổi
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    
    return (
      <div>
        <Branch_Header></Branch_Header>
        <div className={styles.Content}>
            <div className={styles.Wrapper}>
                <div className={styles.TableName}>PRODUCT</div>
                <div className={styles.ActionButton}>
                    <div className={styles.Create}>Create Report</div>
                    <div className={styles.search_input_box}>
                    <TfiSearch className={styles.icon} />
                    <input
                        type="text"
                        className={styles.search_input}
                        placeholder="Search products..."
                    />
                    </div>
                </div>
            </div>
            <div className={styles.tablewrapper}>
            <div className={styles.divider}></div>
                <table className={styles.branch_product_table}>
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
                            <th>Choose</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>MP0001</td>
                            <td>Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml</td>
                            <td>100</td>
                            <td>Sữa rửa mặt</td>
                            <td>20 - 08 - 2024</td>
                            <td>09 - 12 - 2026</td>
                            <td>2 years</td>
                            <td>08 - 09 - 2024</td>
                            <td>
                                <input
                                    className={styles.check_box}
                                    type="checkbox"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
} 