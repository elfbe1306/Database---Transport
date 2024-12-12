import React, { useState }  from 'react'
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/Header.module.css'
import {Link} from 'react-router-dom';
import { RiArrowDownSLine } from "react-icons/ri";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Khởi tạo hook navigate
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    navigate('/'); 
  };

  const getFormattedDate = () => {
    const today = new Date();
    
    // Các mảng để lưu tên tháng và tên thứ
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[today.getDay()]; // Lấy tên thứ
    const day = today.getDate(); // Ngày
    const monthName = months[today.getMonth()]; // Lấy tên tháng
    const year = today.getFullYear(); // Năm

    return `${dayName} ${day} ${monthName} ${year}`;
  };

  const imageURL = 'https://i.pinimg.com/736x/47/2e/88/472e8814226087eefe4a580999d6a0cc.jpg';
  return (
    <div className={styles.Header}>
      <div className={styles.Navi}>
        <Link to="/dashboard" className={styles.NaviText}>Dashboard</Link>
        <Link to="/dashboard/product" className={styles.NaviText}>Products</Link>
        <Link to="/dashboard/export" className={styles.NaviText}>Export</Link>
        <Link to="/dashboard/branch" className={styles.NaviText}>Branch</Link>
        <Link to="/dashboard/stock" className={styles.NaviText}>Stock</Link>
        <Link to="" className={styles.NaviText}>Report</Link>
      </div>
      <div className={styles.Date_andIcon}> 
        <div className={styles.Date}>{getFormattedDate()}</div>
        <div className={styles.icon}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
          <path d="M15.025 3.63751C10.8875 3.63751 7.52499 7.00001 7.52499 11.1375V14.75C7.52499 15.5125 7.19999 16.675 6.81249 17.325L5.37499 19.7125C4.48749 21.1875 5.09999 22.825 6.72499 23.375C12.1125 25.175 17.925 25.175 23.3125 23.375C24.825 22.875 25.4875 21.0875 24.6625 19.7125L23.225 17.325C22.85 16.675 22.525 15.5125 22.525 14.75V11.1375C22.525 7.01251 19.15 3.63751 15.025 3.63751Z" stroke="#4A628A" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round"/>
          <path d="M17.3374 3.99999C16.9499 3.88749 16.5499 3.79999 16.1374 3.74999C14.9374 3.59999 13.7874 3.68749 12.7124 3.99999C13.0749 3.07499 13.9749 2.42499 15.0249 2.42499C16.0749 2.42499 16.9749 3.07499 17.3374 3.99999Z" stroke="#4A628A" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18.7749 23.825C18.7749 25.8875 17.0874 27.575 15.0249 27.575C13.9999 27.575 13.0499 27.15 12.3749 26.475C11.6999 25.8 11.2749 24.85 11.2749 23.825" stroke="#4A628A" stroke-width="3" stroke-miterlimit="10"/>
        </svg>
        </div>
      </div>
      <div className={styles.account} onClick={handleToggle}>
        <img className={styles.imghe}
          src={imageURL}
          alt="Product"
        />
        
        <div className={styles.accountWrapper}>
          <div className={styles.accountRole}>
            <div className={styles.accountName}> Huynh Ngoc Nhon</div>
            <div className={styles.accountDes}> Manager</div>
            {isOpen && (
              <div className={styles.dropdown}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Log out
                </button>
            </div>
            )}
          </div>
          <div>
          <RiArrowDownSLine className={styles.arrow}/>
          </div>
        </div>
      </div>
    </div>
  )
}
