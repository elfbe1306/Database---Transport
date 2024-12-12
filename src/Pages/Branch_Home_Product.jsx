import React, { useEffect, useState } from 'react';
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Branch_Home_Product.module.css';
import { Branch_Header } from '../components/Branch_Header';
import { useParams } from 'react-router-dom';
import supabase from '../supabase-client';

export const Branch_Home_Product = () => {
    const { branch_id } = useParams();
		console.log('Branch ID:', branch_id);
    const [branchPackage, setBranchPackage] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
  
    useEffect(() => {
    
      fetchProductInBranch();
    }, [branch_id]);
  
    
  
    const fetchProductInBranch = async () => {
      const { data, error } = await supabase.from('package').select('*').eq('branch_id', branch_id);
      if (error) {
        console.error('Error fetching product from branch:', error);
      } else {
        setBranchPackage(data);
        setFilteredProducts(data);
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
	
		// Calculate Product Time Left
		const handleProductTimeLeft = async () => {
			try {
					const { data, error } = await supabase.rpc('calculate_product_time_left');
					if (error) {
							console.error('Error updating product time left:', error);
							alert('An error occurred while updating the product time left.');
					} else {
							console.log('Product time left updated:', data);
							alert('Product time left updated successfully!');
							await fetchProductInBranch(); // Refresh product data after update
					}
			} catch (err) {
					console.error('Unexpected error during time left update:', err);
					alert('An unexpected error occurred.');
			}
	};
	

  return (
    <div>
   <Branch_Header></Branch_Header>
    <div className={styles.Content}>
        <div className={styles.Wrapper}>
            <div className={styles.TableName}>PRODUCT</div>
            <div className={styles.ActionButton}>
							<button className={styles.UpdateProductTimeLeftButton} onClick={handleProductTimeLeft}>
								Update Time Left
							</button>
							<div className={styles.Retrieve}>Retrieve</div>
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
										</tr>
									))}
                </tbody>
            </table>
        </div>
    </div>
</div>
  )
}
