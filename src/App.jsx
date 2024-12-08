import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Pages/Login";
import { DashBoard } from "./Pages/DashBoard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<PrivateRoute> <DashBoard/> </PrivateRoute>}/>
      </Routes>
    </div>
  );
}

export default App;