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
  const [exportProduct, setExportProduct] = useState([]);

  useEffect(() => {
    fetchBranchName();
    fetchProductInBranch();
    fetchWarehouse();
    fetchExportProduct();
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

  const fetchExportProduct = async () => {
    const { data, error } = await supabase.from('export_report_has_package').select('*');
    if(error) {
      console.error("Error fetching Export Product" , error);
    } else {
      setExportProduct(data);
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

    try {
        // Generate new report_id with format EX####
        const { data: existingReports, error: reportError } = await supabase
            .from('report')
            .select('report_id');

        if (reportError) {
            console.error('Error fetching reports:', reportError);
            return;
        }

        const existingIds = existingReports.map((r) => r.report_id);
        let nextId = 1;

        while (existingIds.includes(`EX${nextId.toString().padStart(4, '0')}`)) {
            nextId++;
        }

        const reportId = `EX${nextId.toString().padStart(4, '0')}`;
        const employeeId = 'MH1000';
        const currentDate = new Date();
        const reportCreateDate = currentDate.toISOString().split('T')[0];
        const reportCreateTime = currentDate.toTimeString().split(' ')[0];

        let missingProducts = []; // To track which products were not found
        let successfullyMatchedProducts = [];

        // Loop through selected products
        for (const product of selectedProducts) {
            // Query for matching products
            const { data: matchingProducts, error: productError } = await supabase
                .from('package')
                .select('*')
                .eq('product_name', product.name)
                .neq('package_id', product.package_id)
                .gt('product_time_left', 90)
                .is('branch_id', null);

            if (productError) {
                console.error('Error fetching matching products:', productError);
                return;
            }

            if (matchingProducts.length === 0) {
                // If no matching products found, add to missingProducts
                missingProducts.push(product.name);
            } else {
                // Add the product to successfullyMatchedProducts if it's found
                successfullyMatchedProducts.push(product.name);
            }
        }

        // If we found any missing products, alert the user and cancel the report creation
        if (missingProducts.length > 0) {
            alert(`The following products were not found: ${missingProducts.join(', ')}`);
            return; // Cancel report creation and stop further execution
        }

        // Insert the report first to ensure it exists
        const { data: insertedReport, error: insertReportError } = await supabase
            .from('report')
            .insert({
                report_id: reportId,
                employee_id: employeeId,
                report_create_date: reportCreateDate,
                report_create_time: reportCreateTime,
                status: "Not Started"
            })
            .single(); // Ensure we get back a single inserted report

        if (insertReportError) {
            console.error('Error creating report:', insertReportError);
            return;
        }

        // Insert into the export_report table
        const { error: exportReportInsertError } = await supabase
            .from('export_report')
            .insert({
                export_report_id: reportId, // Use the same reportId
            });

        if (exportReportInsertError) {
            console.error('Error creating export report:', exportReportInsertError);
            return;
        }

        // Now that the report is created, proceed with the update of the packages
        for (const product of successfullyMatchedProducts) {
            const { data: matchingProducts, error: productError } = await supabase
                .from('package')
                .select('*')
                .eq('product_name', product)
                .neq('package_id', product.package_id)
                .gt('product_time_left', 90)
                .is('branch_id', null);

            if (productError) {
                console.error('Error fetching matching products:', productError);
                return;
            }

            const matchedProduct = matchingProducts.reduce((leastTimeLeft, currentProduct) =>
                currentProduct.product_time_left < leastTimeLeft.product_time_left ? currentProduct : leastTimeLeft
            );

            // Update the matched product
            const { error: updateError } = await supabase
                .from('package')
                .update({
                    export_date: reportCreateDate,
                    branch_id: branch_id,
                    employee_id: employeeId,
                })
                .eq('package_id', matchedProduct.package_id);

            if (updateError) {
                console.error('Error updating package:', updateError);
                return;
            }

            // Insert into export_report_has_package to associate report_id with package_id
            const { error: insertPackageError } = await supabase
                .from('export_report_has_package')
                .insert({
                    export_report_id: reportId, // Use the reportId from the inserted report
                    package_id: matchedProduct.package_id
                });

            if (insertPackageError) {
                console.error('Error inserting into export_report_has_package:', insertPackageError);
                return;
            }
        }

        alert('Report and packages created successfully:', reportId);
        handleCloseModal(); // Close the modal after successful creation
    } catch (err) {
        console.error('Error in handleSubmit:', err);
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
              {filteredProducts.map(pkg => {
                const isExported = exportProduct.some(exp => exp.package_id === pkg.package_id);
                return (
                  <tr key={pkg.package_id}>
                    <td>{pkg.package_id}</td>
                    <td>
                      <p style={{ color: isExported ? 'red' : 'inherit',}}>
                        {pkg.product_name}
                      </p>
                    </td>
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
                        onChange={() =>
                          handleCheckboxChange(pkg.package_id, pkg.product_name, pkg.product_total)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
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
