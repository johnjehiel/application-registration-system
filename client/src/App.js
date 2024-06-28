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
// import { initialState, reducer } from "./reducer/UseReducer";

import "react-toastify/dist/ReactToastify.css";
// import Unauthorized from "./components/Unauthorized";

import ApplicationForm from "./components/applications/ApplicationForm";
import ApplicationView from "./components/applications/ApplicationView";
// import EditApplication from "./components/applications/EditApplication";
import ReviewerDashboard from "./components/dashboard/ReviewerDashboard";
import ApplicantDashboard from "./components/dashboard/ApplicantDashboard";
import './pdfWorker';
// import Home from "./components/Home";
// import About from "./components/About";
import Signup from "./components/auth/Signup";
import { loadUser } from "./actions/userActions";
import store from "./store";
import { useSelector } from "react-redux";
// import Home from "./components/Home";
import ProtectedRoute from "./route/ProtectedRoute";
// import { CalendarView } from "./components/CalendarView";

export const UserContext = createContext();
const App = () => {
  const { user, isAuthenticated } = useSelector(state => state.authState)
  axios.defaults.withCredentials = true;
  useEffect(() => {
    // if (isAuthenticated) {
      store.dispatch(loadUser)
    // }
  },[])
  return (

    <>
      <HelmetProvider>
          <Navbar />
          <Routes>
            {/* <Route path="/" element={user.role === "admin" ? <AdminDashboard /> : state.role === "applicant" ? <ApplicantDashboard /> : process.env.REACT_APP_HOD_FEATURE &&  state.role === "hod" ? <ReviewerDashboard />  : <Navigate to='/login'/>} /> */}
            <Route path="/" element={user?.role === "admin" ? <ProtectedRoute allowedRoles={['admin']} ><AdminDashboard /></ProtectedRoute> 
                                    : user?.role === "applicant" ? <ProtectedRoute allowedRoles={['applicant']} ><ApplicantDashboard /></ProtectedRoute> 
                                    : user?.role === "reviewer" ? <ProtectedRoute allowedRoles={['reviewer']} ><ReviewerDashboard /></ProtectedRoute>  
                                    : <Navigate to='/login'/>} />
            {/* <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" /> } /> */}
            
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/application-form" element={<ProtectedRoute allowedRoles={['applicant']}><ApplicationForm/></ProtectedRoute>}/>
            <Route exact path="/application-view/:applicationId" element={<ProtectedRoute allowedRoles={['applicant', "reviewer", "admin"]}><ApplicationView/></ProtectedRoute>} />
            
            {/* YET TO COMPLETE /application-edit */}
            {/* <Route exact path="/application-edit/:applicationId" element={(state.role === "admin" || (process.env.REACT_APP_HOD_FEATURE &&  state.role === "hod")) ? <EditApplication/> : <Unauthorized />} /> */}

            <Route path="/*" element={<ErrorPage />} />
            
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/profile" element={<About />} /> */}
            {/* <Route path="/calendar" element={<CalendarView />} /> */}
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/passwordReset" element={<PasswordReset />} /> */}
            {/* <Route path="/forgotPassword/:id/:token" element={<ForgotPassword />} /> */}
            {/* <Route path="/passwordReset" element={<PasswordReset />} /> */}
            {/* <Route path="/verifyEmail/:id/:token" element={<VerifySuccess/>} />        */}

          </Routes>
          
        <Footer/>

        <ToastContainer
          position="bottom-left"
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
