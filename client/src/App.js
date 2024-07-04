import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { createContext, useEffect } from "react";
import {  ToastContainer } from "react-toastify";
import { HelmetProvider } from 'react-helmet-async'
// importing components
import axios from "axios"
import Navbar from "./components/Navbar";
import Logout from "./components/auth/Logout";
import Login from "./components/auth/Login";
import ErrorPage from "./components/ErrorPage";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import Footer from "./components/Footer";

import "react-toastify/dist/ReactToastify.css";

import ApplicationForm from "./components/applications/ApplicationForm";
import ApplicationView from "./components/applications/ApplicationView";
import ReviewerDashboard from "./components/dashboard/ReviewerDashboard";
import ApplicantDashboard from "./components/dashboard/ApplicantDashboard";
import Signup from "./components/auth/Signup";
import { loadUser } from "./actions/userActions";
import store from "./store";
import { useSelector } from "react-redux";
import ProtectedRoute from "./route/ProtectedRoute";
import { ROLES } from "./components/Constants";
import LoadingSpinner from "./components/LoadingSpinner";

export const UserContext = createContext();
const App = () => {
  const { user, loading } = useSelector(state => state.authState)
  axios.defaults.withCredentials = true;
  useEffect(() => {
      store.dispatch(loadUser)
  },[])
  return (

    <>
      <HelmetProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={user?.role === ROLES.admin ? <ProtectedRoute allowedRoles={[ROLES.admin]} ><AdminDashboard /></ProtectedRoute> 
                                    : user?.role === ROLES.applicant ? <ProtectedRoute allowedRoles={[ROLES.applicant]} ><ApplicantDashboard /></ProtectedRoute> 
                                    : user?.role === ROLES.reviewer ? <ProtectedRoute allowedRoles={[ROLES.reviewer]} ><ReviewerDashboard /></ProtectedRoute>  
                                    : loading ? <LoadingSpinner /> :<Navigate to='/login'/>} />
            
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/application-form" element={<ProtectedRoute allowedRoles={[ROLES.applicant]}><ApplicationForm/></ProtectedRoute>}/>
            <Route exact path="/application-view/:applicationId" element={<ProtectedRoute allowedRoles={[ROLES.applicant, ROLES.reviewer, ROLES.admin]}><ApplicationView/></ProtectedRoute>} />
            <Route path="/*" element={<ErrorPage />} />

          </Routes>
          
        <Footer/>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </HelmetProvider>
    </>
  );
};

export default App;
