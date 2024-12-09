import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Pages/Login";
import { DashBoard } from "./Pages/DashBoard";
import PrivateRoute from "./components/PrivateRoute";
import { Product } from "./Pages/Product";

function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<PrivateRoute> <DashBoard/> </PrivateRoute>}/>
        <Route path="/dashboard/product" element={<PrivateRoute> <Product/> </PrivateRoute>}/>
      </Routes>
    </div>
  );
}

export default App;