import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Pages/Login";
import { DashBoard } from "./Pages/DashBoard";
import PrivateRoute from "./components/PrivateRoute";
import { Product } from "./Pages/Product";
import { Branch_List } from "./Pages/Branch_List";
import { Branch_Product } from "./Pages/Branch_Product";
import { Branch_Product_Restock } from "./Pages/Branch_Product_Restock";
import { Export } from "./Pages/Export";
import { Stock } from "./Pages/Stock";
import { Branch_Home_Product } from "./Pages/Branch_Home_Product";
import { Branch_Home_Product_Retrieve } from "./Pages/Branch_Home_Product_Retrieve";
import { Branch_Home_Status } from "./Pages/Branch_Home_Status";

function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<PrivateRoute> <DashBoard/> </PrivateRoute>}/>
        <Route path="/dashboard/product" element={<PrivateRoute> <Product/> </PrivateRoute>}/>
        <Route path="/dashboard/branch" element={<PrivateRoute> <Branch_List/> </PrivateRoute>}/>
        <Route path="/dashboard/branch-product/:branch_id" element={<PrivateRoute> <Branch_Product/> </PrivateRoute>}/>
        <Route path="/dashboard/branch-product/:branch_id/restock" element={<PrivateRoute> <Branch_Product_Restock/> </PrivateRoute>}/>
        <Route path="/dashboard/export" element={<PrivateRoute> <Export/> </PrivateRoute>}/>
        <Route path="/dashboard/stock" element={<PrivateRoute> <Stock/> </PrivateRoute>}/>

        <Route path="/branch-product/:branchID" element={<PrivateRoute> <Branch_Home_Product/> </PrivateRoute>}/>
        <Route path="/branch-product-retrieve" element={<PrivateRoute> <Branch_Home_Product_Retrieve/> </PrivateRoute>}/>
        <Route path="/branch-status" element={<PrivateRoute> <Branch_Home_Status/> </PrivateRoute>}/>
      </Routes>
    </div>
  );
}

export default App;

