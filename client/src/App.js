import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { createContext, useReducer } from "react";
// importing components
import axios from "axios"
import Navbar from "./components/Navbar";
// import Home from "./components/Home";
// import About from "./components/About";
// import Contact from "./components/Contact";
import Signup from "./components/auth/Signup";
import Logout from "./components/auth/Logout";
import Login from "./components/auth/Login";
import ErrorPage from "./components/ErrorPage";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import Footer from "./components/Footer";
import { initialState, reducer } from "./reducer/UseReducer";



import {  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Unauthorized from "./components/Unauthorized";
// import Events from "./components/bookings/Events";
// import { CalendarView } from "./components/CalendarView";

import ApplicationForm from "./components/bookings/ApplicationForm";
import ApplicationView from "./components/bookings/ApplicationView";
import EditApplication from "./components/bookings/EditApplication";
import ReviewerDashboard from "./components/dashboard/HodDashboard";
import ApplicantDashboard from "./components/dashboard/ApplicantDashboard";
export const UserContext = createContext();
const App = () => {
      const token = (localStorage.getItem("jwtoken"))
      axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
      axios.defaults.withCredentials = true;
    
    const [state, dispatch] = useReducer(reducer, initialState)



  return (

    <>

      <UserContext.Provider value={{ state, dispatch }}>


        <Navbar />
        <Routes>
          <Route path="/" element={state.userType === "admin" ? <AdminDashboard /> : state.userType === "faculty" ? <ApplicantDashboard /> : process.env.REACT_APP_HOD_FEATURE &&  state.userType === "hod" ? <ReviewerDashboard />  : <Login />} />

          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/profile" element={<About />} /> */}
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/calendar" element={<CalendarView />} /> */}
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          {/* <Route path="/passwordReset" element={<PasswordReset />} /> */}
          {/* <Route path="/forgotPassword/:id/:token" element={<ForgotPassword />} /> */}
          {/* <Route path="/events" element={<Events />} /> */}

          {/* <Route path="/passwordReset" element={<PasswordReset />} /> */}
          {/* <Route path="/verifyEmail/:id/:token" element={<VerifySuccess/>} />        */}

          
          <Route path="/application-form" element={state.userType === "faculty" ? <ApplicationForm/> :  <Navigate to="/" />}/>
          <Route exact path="/application-view/:applicationId" element={<ApplicationView/>} />
          {/* YET TO COMPLETE /application-edit */}
          <Route exact path="/application-edit/:applicationId" element={(state.userType === "admin" || (process.env.REACT_APP_HOD_FEATURE &&  state.userType === "hod")) ? <EditApplication/> : <Unauthorized />} />

          {/* <Route path="/halls" element={state.userType === "admin" ? <HallsAdmin/> : <Halls />}/> */}
          {/* <Route exact path="/halls/:hallId/:hallName" element={state.userType === "admin" ?<HallsEdit /> : <Unauthorized />} /> */}
          {/* <Route exact path="/bookingsEdit/:bookingId" element={state.userType === "admin" ? <BookingUpdateFrom/>  : process.env.REACT_APP_HOD_FEATURE &&  state.userType === "hod" ? <BookingUpdateFrom/>  : <Unauthorized />} /> */}
          
          
          {/* <Route exact path="/bookings/:bookingId" element={state.userType === "admin" ? <BookingUpdateFrom/>  : state.userType === "hod" ? <BookingUpdateFrom/>  : <Unauthorized />} /> */}
          {/* <Route path="/hallForm" element={state.userType === "admin" ?<HallForm /> : <Unauthorized />} /> */}

          {/* <Route path="/bookings" element={state.userType === "admin" ? <BookingsAdmin/> : state.userType === "faculty" ? <BookingFaculty/> :  process.env.REACT_APP_HOD_FEATURE && state.userType === "hod" ? <BookingsHod/>  : <Unauthorized />} /> */}
          {/* <Route exact path="/bookingForm/:hallId/:hallName" element={<BookingForm />} /> */}
          {/* <Route path="/bookings" element={<Booking/>} /> */}

          {/* <Route exact path="/bookingsView/:bookingId" element={<BookingsView/>} /> */}
   

          <Route path="/*" element={<ErrorPage />} />
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
    </>
  );
};

export default App;
