import React, { useEffect, useState } from "react";
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Branch_Home_Product_Retrieve.module.css';
import { Branch_Header } from "../components/Branch_Header";
import { useParams } from 'react-router-dom';
import supabase from '../supabase-client';

export const Branch_Home_Product_Retrieve = () => {
    const { branch_id } = useParams();
    const [branchStockPackage, setBranchStockPackage] = useState([]);
    const [filteredStockProducts, setFilteredStockProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        fetchStockInBranch();
    }, [branch_id]);

    const fetchStockInBranch = async () => {
			if (!branch_id) {
					console.error('Branch ID is undefined.');
					return;
			}
	
			const { data, error } = await supabase
					.from('stock_product')
					.select(`
							package_id,
							stock_product_total,
							expired_date,
							package (
									product_name,
									category,
									production_date,
									product_time_left,
									import_date
							)
					`)
					.eq('branch_id', branch_id);
	
			if (error) {
					console.error('Error fetching stock product from branch:', error);
			} else {
					const processedData = data.map((item) => ({
							package_id: item.package_id,
							product_name: item.package.product_name,
							stock_product_total: item.stock_product_total,
							category: item.package.category,
							production_date: item.package.production_date,
							expired_date: item.expired_date,
							product_time_left: item.package.product_time_left,
							import_date: item.package.import_date,
					}));
					setBranchStockPackage(processedData);
					setFilteredStockProducts(processedData);
			}
	};
	
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            filterStockProducts(searchQuery);
        }
    };

    const filterStockProducts = (query) => {
        if (query === '') {
            setFilteredStockProducts(branchStockPackage);
        } else {
            const filtered = branchStockPackage.filter(stock =>
                stock.product_name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredStockProducts(filtered);
        }
    };
		
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div>
            <Branch_Header />
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
                                <th>Choose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStockProducts.map(pkg => (
															<tr key={pkg.package_id}>
																	<td>{pkg.package_id}</td>
																	<td>{pkg.product_name}</td>
																	<td>{pkg.stock_product_total}</td>
																	<td>{pkg.category}</td>
																	<td>{pkg.production_date}</td>
																	<td>{pkg.expired_date}</td>
																	<td>{pkg.product_time_left}</td>
																	<td>{pkg.import_date}</td>
																	<td>
																			<input
																					className={styles.check_box}
																					type="checkbox"
																					checked={isChecked}
																					onChange={handleCheckboxChange}
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
