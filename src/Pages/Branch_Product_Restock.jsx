import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Branch_Product_Restock.module.css';
import { useParams } from 'react-router-dom';
import supabase from '../supabase-client';

export const Branch_Product_Restock = () => {
  const { branch_id } = useParams();
  const [branchName, setBranchName] = useState('');
  const [branchPackage, setBranchPackage] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBranchName();
    fetchProductInBranch();
  }, [branch_id]); 

  const fetchBranchName = async () => {
    const { data, error } = await supabase.rpc('retrieve_warehouse_name', { branch_id });
    if (error) {
      console.error('Error fetching name:', error);
    } else {
      setBranchName(data);
    }
  }

  const fetchProductInBranch = async () => {
    const { data, error } = await supabase.from('package').select('*').eq('branch_id', branch_id);
    if (error) {
      console.error('Error fetching product from branch:', error);
    } else {
      setBranchPackage(data);
      setFilteredProducts(data); // Initially set filtered products to all products
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); 
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      filterProducts(searchQuery);
    }
  };

  const filterProducts = (query) => {
    if (query === '') {
      setFilteredProducts(branchPackage); 
    } else {
      const filtered = branchPackage.filter(pkg =>
        pkg.product_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  // Handle checkbox for each row (by package_id)
  const handleCheckboxChange = (packageId) => {
    setFilteredProducts(prevState => 
      prevState.map(pkg =>
        pkg.package_id === packageId
          ? { ...pkg, isChecked: !pkg.isChecked }
          : pkg
      )
    );
  };

  return (
    <div>
      <Header />
      <div className={styles.Content}>
        <div className={styles.Wrapper}>
          <div className={styles.TableName}>{branchName}'s PRODUCT</div>
          <div className={styles.ActionButton}>
            <button className={styles.Create}>Create Report</button>
            <div className={styles.search_input_box}>
              <TfiSearch className={styles.icon} />
              <input 
                type="text" 
                className={styles.search_input} 
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit} 
              />
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.table_wrapper}>
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
                <th>Checkbox</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(pkg => (
                <tr key={pkg.package_id}>
                  <td>{pkg.package_id}</td>
                  <td>{pkg.product_name}</td>
                  <td>{pkg.product_total}</td>
                  <td>{pkg.category}</td>
                  <td>{pkg.production_date}</td>
                  <td>{pkg.expired_date}</td>
                  <td>{pkg.product_time_left}</td>
                  <td>{pkg.import_date}</td>
                  <td>
                    <input 
                      className={styles.check_box}
                      type="checkbox" 
                      checked={pkg.isChecked || false}
                      onChange={() => handleCheckboxChange(pkg.package_id)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
