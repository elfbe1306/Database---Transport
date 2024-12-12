import React from "react";
import { Header } from "../components/Header";
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Branch_Home_Status.module.css'
import { Branch_Header } from "../components/Branch_Header";

export const Branch_Home_Status = () => {
    return(
        <div>
       <Branch_Header></Branch_Header>
        <div className={styles.Content_Wrapper}>
        <div className={styles.Content}>
            <div className={styles.Wrapper}>
                <div className={styles.TableName}>IMPORT</div>
                <div className={styles.ActionButton}>
                    <div className={styles.search_input_box}>
                    <TfiSearch className={styles.icon} />
                    <input
                        type="text"
                        className={styles.search_input}
                        placeholder="Search..."
                    />
                    </div>
                </div>
            </div>
            <div className={styles.tablewrapper}>
            <div className={styles.divider}></div>
                <table className={styles.branch_product_table}>
                    <thead>
                        <tr>
                            <th>Report's ID</th>
                            <th>Date - Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>RP1001</td>
                            <td>20 /1/2024 - 7 am</td>
                            <td>not started yet </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div className={styles.Content}>
            <div className={styles.Wrapper}>
                <div className={styles.TableName}>RETRIEVE</div>
                <div className={styles.ActionButton}>
                    <div className={styles.search_input_box}>
                    <TfiSearch className={styles.icon} />
                    <input
                        type="text"
                        className={styles.search_input}
                        placeholder="Search..."
                    />
                    </div>
                </div>
            </div>
            <div className={styles.tablewrapper}>
            <div className={styles.divider}></div>
                <table className={styles.branch_product_table}>
                    <thead>
                        <tr>
                            <th>Report's ID</th>
                            <th>Date - Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>RP1001</td>
                            <td>20 /1/2024 - 7 am</td>
                            <td>not started yet </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    </div>
    )
}