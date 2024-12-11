import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import styles from '../Styles/Branch_List.module.css'
import { TfiSearch } from 'react-icons/tfi'
import supabase from '../supabase-client'
import { Link } from 'react-router-dom'

export const Branch_List = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWarehouse();
  }, [])

  const fetchWarehouse = async () => {
    try {
      const { data: branchIds, error: branchError } = await supabase
        .from('branch_warehouse')
        .select('branch_id');
  
      if (branchError) throw branchError;

      const branchIdArray = branchIds.map((item) => item.branch_id);

      const { data, error } = await supabase
        .from('warehouse')
        .select('w_id, w_name, w_location, w_area, w_email, w_phoneno, employee(fullname)')
        .in('w_id', branchIdArray)
        .order('w_id', { ascending: true });
  
      if (error) throw error;

      const filteredData = data.filter((house) =>
        house.w_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      setWarehouses(filteredData);
      console.log(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      fetchWarehouse();
    }
  };
  useEffect(() => {
    if (searchQuery === '') {
      fetchWarehouse();
    }
  }, [searchQuery]);

  return (
    <div>
      <Header></Header>

      <div className={styles.Content}>
        <div className={styles.Wrapper}>
          <div className={styles.TableName}>WAREHOUSE</div>
          <div className={styles.ActionButton}>
          <div className={styles.search_input_box}>
              <TfiSearch className={styles.icon}/>
              <input 
                type="text" 
                className={styles.search_input} 
                placeholder="Search branch..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
              />
            </div>
          </div>
        </div>

        <div className={styles.table_wrapper}>
        <div className={styles.divider}></div>
          <table className={styles.branch_table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Area</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Manager</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((house) => (
                <tr key={house.w_id}>
                  <td>{house.w_id}</td>
                  <td><Link to={`/dashboard/branch-product/${house.w_id}`} className={styles.Link}>{house.w_name}</Link></td>
                  <td>{house.w_location}</td>
                  <td>{house.w_area}</td>
                  <td>{house.w_email}</td>
                  <td>{house.w_phoneno}</td>
                  <td>{house.employee?.fullname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
