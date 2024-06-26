import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { createContext, useEffect, useReducer } from "react";
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
import Signup from "./components/auth/Signup";
import { loadUser } from "./actions/userActions";
import store from "./store";
import {useDispatch,  useSelector } from "react-redux";
import Home from "./components/Home";
// import { CalendarView } from "./components/CalendarView";

export const UserContext = createContext();
const App = () => {
  axios.defaults.withCredentials = true;
  // new
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      store.dispatch(loadUser)
    } catch (error) {
      
    }
  },[])
  const { loading, error, isAuthenticated, user } = useSelector(state => state.authState)
  return (

    <>
      <HelmetProvider>
        {/* <UserContext.Provider value={{ state, dispatch }}> */}
          <Navbar />
          <Routes>
            {/* <Route path="/" element={user. === "admin" ? <AdminDashboard /> : state.userType === "faculty" ? <ApplicantDashboard /> : process.env.REACT_APP_HOD_FEATURE &&  state.userType === "hod" ? <ReviewerDashboard />  : <Navigate to='/login'/>} /> */}
            {/* <Route path="/" element={user?.userType === "admin" ? <AdminDashboard /> : user?.userType === "applicant" ? <ApplicantDashboard /> : process.env.REACT_APP_HOD_FEATURE &&  user?.userType === "reviewer" ? <ReviewerDashboard />  : <Navigate to='/login'/>} /> */}
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" /> } />
            
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            {/* <Route path="/application-form" element={state.userType === "faculty" ? <ApplicationForm/> :  <Navigate to="/" />}/>
            <Route exact path="/application-view/:applicationId" element={<ApplicationView/>} /> */}
            
            {/* YET TO COMPLETE /application-edit */}
            {/* <Route exact path="/application-edit/:applicationId" element={(state.userType === "admin" || (process.env.REACT_APP_HOD_FEATURE &&  state.userType === "hod")) ? <EditApplication/> : <Unauthorized />} /> */}

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
        {/* </UserContext.Provider> */}

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
