import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { createContext, useReducer } from "react";
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
import { initialState, reducer } from "./reducer/UseReducer";

import "react-toastify/dist/ReactToastify.css";
import Unauthorized from "./components/Unauthorized";

import ApplicationForm from "./components/applications/ApplicationForm";
import ApplicationView from "./components/applications/ApplicationView";
import EditApplication from "./components/applications/EditApplication";
import ReviewerDashboard from "./components/dashboard/ReviewerDashboard";
import ApplicantDashboard from "./components/dashboard/ApplicantDashboard";
import './pdfWorker';
// import Home from "./components/Home";
// import About from "./components/About";
// import Signup from "./components/auth/Signup";
// import { CalendarView } from "./components/CalendarView";

export const UserContext = createContext();
const App = () => {
  const token = (localStorage.getItem("jwtoken"))
  axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
      axios.defaults.withCredentials = true;
    
    const [state, dispatch] = useReducer(reducer, initialState)
    
  return (

    <>
      <HelmetProvider>
        <UserContext.Provider value={{ state, dispatch }}>
          <Navbar />
          <Routes>
            <Route path="/" element={state.userType === "admin" ? <AdminDashboard /> : state.userType === "faculty" ? <ApplicantDashboard /> : process.env.REACT_APP_HOD_FEATURE &&  state.userType === "hod" ? <ReviewerDashboard />  : <Login />} />

            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/application-form" element={state.userType === "faculty" ? <ApplicationForm/> :  <Navigate to="/" />}/>
            <Route exact path="/application-view/:applicationId" element={<ApplicationView/>} />
            
            {/* YET TO COMPLETE /application-edit */}
            <Route exact path="/application-edit/:applicationId" element={(state.userType === "admin" || (process.env.REACT_APP_HOD_FEATURE &&  state.userType === "hod")) ? <EditApplication/> : <Unauthorized />} />

            <Route path="/*" element={<ErrorPage />} />
            
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/profile" element={<About />} /> */}
            {/* <Route path="/calendar" element={<CalendarView />} /> */}
            {/* <Route path="/signup" element={<Signup />} /> */}
            {/* <Route path="/passwordReset" element={<PasswordReset />} /> */}
            {/* <Route path="/forgotPassword/:id/:token" element={<ForgotPassword />} /> */}
            {/* <Route path="/passwordReset" element={<PasswordReset />} /> */}
            {/* <Route path="/verifyEmail/:id/:token" element={<VerifySuccess/>} />        */}

          </Routes>
          
        <Footer/>
        </UserContext.Provider>

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
