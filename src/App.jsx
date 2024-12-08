import React from 'react'
import { TfiSearch } from "react-icons/tfi";
import './App.css'
//import supabase from './supabase-client'

function App() {
  return (
  <>
    <div className="Header">
      <div className="Navi">
        <div className="NaviText">Dashboard</div>
        <div className="NaviText">Products</div>
        <div className="NaviText">Export</div>
        <div className="NaviText">Branch</div>
        <div className="NaviText">Stock</div>
        <div className="NaviText">Report</div>
      </div>
    </div>

    <div className="Content">
      <div className="Wrapper">
        <div className="TableName">PRODUCT</div>
        <div className="ActionButton">
          <button className="Addbutton">Add product</button>
          <input type="text" className='search-input'></input>
          <TfiSearch/>
        </div>
      </div>

      <div className="divider"></div>

      <div className="table-wrapper">
      <table className="product-table">
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
              <tr>
                <td>MP0001</td>
                <td>Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml</td>
                <td>100</td>
                <td>Sữa rửa mặt</td>
                <td>20-08-2024</td>
                <td>09-12-2026</td>
                <td className="time-left">2 year</td>
                <td>08-09-2024</td>
                <td>NULL</td>
                <td className="actions">
                  <button className="edit-button">✏️</button>
                  <button className="delete-button">❌</button>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>
  </>
  )
}

export default App;



