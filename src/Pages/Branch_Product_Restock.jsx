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
  const [warehouses, setWarehouses] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [address, setAddress] = useState({ location: '', area: '' });

  useEffect(() => {
    fetchBranchName();
    fetchProductInBranch();
    fetchWarehouse();
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
      setFilteredProducts(data);
    }
  }

  const fetchWarehouse = async () => {
    const { data, error } = await supabase.from('warehouse').select('w_id, w_name, w_location, w_area').eq('w_id', branch_id);
    if (error) {
      console.error('Error fetching warehouse from branch:', error);
    } else {
      if (data.length > 0) {
        const warehouse = data[0]; 
        setWarehouses(data);
        setAddress({
          location: warehouse.w_location,
          area: warehouse.w_area
        });
      } else {
        console.error('No warehouse found for the branch');
      }
    }
  };
  

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

  const handleCheckboxChange = (packageId, productName, productTotal) => {
    setFilteredProducts(prevState => 
      prevState.map(pkg =>
        pkg.package_id === packageId
          ? { ...pkg, isChecked: !pkg.isChecked }
          : pkg
      )
    );

    if (selectedProducts.some(product => product.package_id === packageId)) {
      setSelectedProducts(prevState => 
        prevState.filter(product => product.package_id !== packageId)
      );
    } else {
      setSelectedProducts(prevState => [
        ...prevState,
        { package_id: packageId, name: productName, total: productTotal }
      ]);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  

    if (error) {
      console.error('Error creating report:', error);
    } else {
      console.log('Report created successfully:', data);
      handleCloseModal(); 
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.Content}>
        <div className={styles.Wrapper}>
          <div className={styles.TableName}>{branchName}'s PRODUCT</div>
          <div className={styles.ActionButton}>
            <button className={styles.Create} onClick={handleOpenModal}>Create Report</button>
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

        <div className={styles.table_wrapper}>
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
                      onChange={() => handleCheckboxChange(pkg.package_id, pkg.product_name, pkg.product_total)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.CreateReportModalOverlay} onClick={handleOverlayClick}>
          <div className={styles.CreateReportModal}>
            <h2 className={styles.CreateReportModalTitle}>Report</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Product Name</label>
                <p className={styles.ProductDisplay}>
                  {selectedProducts.map(product => (
                    <span key={product.package_id}>
                      {product.name}<br />
                    </span>
                  ))}
                </p>
              </div>

              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Address</label>
                <p className={styles.AddressDisplay}>
                  {address.location && <span>{address.location}, {address.area}</span>}
                </p>
              </div>

              <div className={styles.ModalActions}>
                <button type="submit" className={styles.SaveButton}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
