/* eslint-disable no-unused-vars */
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Toaster, toast } from "react-hot-toast";
import { RouterProvider, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Choose} from "./Components/auth/choose";
import {Login} from "./Components/pages/Login";
import{Registraion} from "./Components/pages/Registraion";
import { ForgotPassword } from "./Components/pages/Forgot_password";
import { DashboardLayout } from "./Components/Layout/DasboardLayout";
import { Dashboard } from "./Components/pages/Dashboard";
import { AddUser } from "./Components/pages/AddUser";
import { AddAsset } from "./Components/pages/AddAsset";
import { ViewUsers } from "./Components/pages/ViewUsers";
import { ViewAssets } from "./Components/pages/ViewAssets";
import { AdminProfile } from "./Components/pages/AdminProfile"; 
import {GetUserByCode} from "./Components/pages/GetUserByCode";
import { AllocatedAssets } from "./Components/pages/AllocatedAsset";
import { AvailableAssets } from "./Components/pages/AvailableAsset";
import { GetAssetBySr } from "./Components/pages/GetAssetBySr";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Toaster
  toastOptions={{
    success: {
      style: {
        background: '#d4edda',
        color: '#155724',
      },
    },
    error: {
      style: {
        background: '#f8d7da',
        color: '#721c24',
      },
    },
  }}
/>
     
        <Routes>
        <Route path="/" element={<Choose />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registraion />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="add-user" element={<AddUser />} />
        <Route path="add-asset" element={<AddAsset />} />
        <Route path="users" element={<ViewUsers />} />
        <Route path="assets" element={<ViewAssets />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="userBycode" element={<GetUserByCode />} />
        <Route path="allocated" element={<AllocatedAssets />} />
        <Route path="available" element={<AvailableAssets />} />
        <Route path="search-by-serial" element={<GetAssetBySr />} />
      </Route>
        </Routes>
     
    </>
  );
}

export default App;
