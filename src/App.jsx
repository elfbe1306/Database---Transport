import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Pages/Login";
import { DashBoard } from "./Pages/DashBoard";

function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<DashBoard/>}/>
      </Routes>
    </div>
  );
}

export default App;