import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Product.module.css';
import supabase from '../supabase-client';

export const Product = () => {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [total, setTotal] = useState('');
  const [productionDate, setProductionDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  useEffect(() => {
    fetchPackages();
    fetchCategory();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase.from('package').select('package_id, product_name, product_total, category, production_date, expired_date, product_time_left, import_date, export_date');
      if (error) {
        console.error('Error fetching packages:', error);
      } else {
        setPackages(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleProductTimeLeft = async () => {
    try {
      const { data, error } = await supabase.rpc('calculate_product_time_left');
      if (error) {
        console.error('Error updating product time left:', error);
      } else {
        console.log('Product time left updated:', data);
        fetchPackages();
        alert('Product time left updated successfully!');
      }
    } catch (err) {
      console.error('Unexpected error during time left update:', err);
      alert('An error occurred while updating the product time left.');
    }
  };

  const fetchCategory = async () => {
    const { data, error } = await supabase.rpc('get_all_categories')
    if (error) {
      console.error('Error getting categories:', error);
    } else {
      setCategories(data)
      console.log('Categories: ', categories);
    }
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form fields
    if (!productName || !selectedCategory || !total || !productionDate || !expirationDate) {
      alert('All fields are required, and category cannot be empty.');
      return;
    }
  
    // Generate the package_id based on the category
    let packagePrefix = selectedCategory.includes('Nước hoa') ? 'NH' : 'MP';
    let newPackageId;
  
    // Fetch the highest package_id in the database
    const { data, error } = await supabase
      .from('package')
      .select('package_id')
      .ilike('package_id', `${packagePrefix}%`) // Find all package_ids starting with the selected prefix
      .order('package_id', { ascending: false }) // Order by package_id in descending order
      .limit(1); // Limit to just the highest package_id
  
    if (error) {
      console.error('Error fetching highest package_id:', error);
      alert('Error fetching package ID');
      return;
    }
  
    if (data && data.length > 0) {
      // Extract the last 4 digits from the highest package_id and increment
      const lastPackageId = data[0].package_id;
      const lastNumber = parseInt(lastPackageId.slice(2), 10); // Remove the prefix (NH or MP)
      const newNumber = String(lastNumber + 1).padStart(4, '0'); // Increment and pad with leading zeros
      newPackageId = `${packagePrefix}${newNumber}`;
    } else {
      // If no matching package_id exists, start from 0001
      newPackageId = `${packagePrefix}0001`;
    }
  
    // Insert the new package into the database
    const { data: insertData, error: insertError } = await supabase.from('package').insert([
      {
        package_id: newPackageId, // Use the generated package_id
        product_name: productName,
        category: selectedCategory,
        product_total: total,
        production_date: productionDate,
        expired_date: expirationDate,
      },
    ]).select();
  
    if (insertError) {
      console.log('Error saving product: ' + insertError.message);
    } else {
      console.log('Product saved:', insertData);
      setProductName('');
      setSelectedCategory('');
      setTotal('');
      setProductionDate('');
      setExpirationDate('');
      alert('Product saved successfully!');
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

  return (
    <div>
      <Header />

      <div className={styles.Content}>
        <div className={styles.Wrapper}>
          <div className={styles.TableName}>PRODUCT</div>
          <div className={styles.ActionButton}>
            <button className={styles.UpdateProductTimeLeftButton} onClick={handleProductTimeLeft}>
              Update Time Left
            </button>
            <button className={styles.Addbutton} onClick={handleOpenModal}>
              Add product
            </button>
            <input type="text" className={styles.search_input} placeholder="Search products..." />
            <TfiSearch />
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.table_wrapper}>
          <table className={styles.product_table}>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.package_id}>
                  <td>{pkg.package_id}</td>
                  <td>{pkg.product_name}</td>
                  <td>{pkg.product_total}</td>
                  <td>{pkg.category}</td>
                  <td>{pkg.production_date}</td>
                  <td>{pkg.expired_date}</td>
                  <td className={styles.time_left}>{pkg.product_time_left}</td>
                  <td>{pkg.import_date}</td>
                  <td>{pkg.export_date}</td>
                  <td className={styles.actions}>
                    <button className={styles.edit_button}>✏️</button>
                    <button className={styles.delete_button}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className={styles.AddProductModalOverlay} onClick={handleOverlayClick}>
          <div className={styles.AddProductModal}>
            <h2 className={styles.AddProductModalTitle}>New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Product Name</label>
                <input 
                  type="text" 
                  className={styles.Input} 
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Category</label>
                <select
                  className={styles.SelectInput}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select a category</option>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.category_name} value={category.category_name}>
                        {category.category_name}
                      </option>
                    ))
                  ) : (
                    <option value="">No categories available</option>
                  )}
                </select>
              </div>

              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Total</label>
                <input 
                  type="number" 
                  className={styles.Input} 
                  placeholder="Enter total quantity" 
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
              </div>

              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Production Date</label>
                <input 
                  type="date" 
                  className={styles.Input} 
                  value={productionDate}
                  onChange={(e) => setProductionDate(e.target.value)}
                />
              </div>

              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Expiration Date</label>
                <input 
                  type="date" 
                  className={styles.Input} 
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
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