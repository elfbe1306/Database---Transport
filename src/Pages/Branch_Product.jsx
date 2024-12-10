import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Branch_Product.module.css'
import { useParams } from 'react-router-dom';
import supabase from '../supabase-client';
import { Link } from 'react-router-dom';

export const Branch_Product = () => {
  const {branch_id} = useParams();
  const [branchName, setBranchName] = useState('');
  const [branchPackage, setBranchPackage] = useState([])

  useEffect(()=> {
    fetchBranchName();
    fetchProductInBranch();
  }, [])

  const fetchBranchName = async () => {
    const {data, error} = await supabase.rpc('retrieve_warehouse_name', {branch_id});
    if(error) {
      console.error('Error fetching name:', error);
    } else {
      setBranchName(data);
    }
  }

  const fetchProductInBranch = async () => {
    const {data, error} = await supabase.from('package').select('*').eq('branch_id', branch_id);
    if(error) {
      console.error('Error fetching product from branch:', error);
    } else {
      setBranchPackage(data);
    }
  }

  return (
    <div >
      <Header></Header>
      <div className={styles.Content}>
        <div className={styles.Wrapper}>
        <div className={styles.TableName}>{branchName}'s PRODUCT</div>
        <div className={styles.ActionButton}>
          <Link to={`/dashboard/branch-product/${branch_id}/restock`} className={styles.Restock}>Restock</Link>
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

      <div className={styles.divider}></div>

      <div className={styles.table_wrapper} >
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
              <th>Exported Date</th>
            </tr>
          </thead>
          <tbody>
            {branchPackage.map((pkg) => (
              <tr key={pkg.package_id}>
                <td>{pkg.package_id}</td>
                <td>{pkg.product_name}</td>
                <td>{pkg.product_total}</td>
                <td>{pkg.category}</td>
                <td>{pkg.production_date}</td>
                <td>{pkg.expired_date}</td>
                <td>{pkg.product_time_left}</td>
                <td>{pkg.import_date}</td>
                <td>{pkg.export_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </div>
    </div>
  )
}
