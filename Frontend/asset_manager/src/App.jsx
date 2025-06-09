/* eslint-disable no-unused-vars */
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { RouterProvider, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Choose} from "./Components/auth/choose";
import {Login} from "./Components/pages/Login";
import{Registraion} from "./Components/pages/Registraion";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      
        <Routes>
        <Route path="/" element={<Choose />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registraion />} />
        <Route path="/dashboard" element={<div>dashboard</div>} />
        </Routes>
     
    </>
  );
}

export default App;
