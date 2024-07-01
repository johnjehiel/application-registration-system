
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import MetaData from "../layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, register } from "../../actions/userActions";

const Signup = () => {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const cpasswordRef = useRef(null);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(state => state.authState);

  const submitHandler = (e) => {
      e.preventDefault();

      const { name, email, password, phone, cpassword } = user;
      if (!name) {
        nameRef.current.focus();
        return toast.error("Name field is empty");
      }
      // const nameRegex = /^[\w'.]+\s[\w'.]+\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*$/;
      const nameRegex = /^[a-zA-Z'.]+\s[a-zA-Z'.]+(?:\s[a-zA-Z'.]*){0,4}$/;

      if (!nameRegex.test(name)) {
        nameRef.current.focus();
        return toast.error("Kindly provide a valid name.");
      }

      if (!email) {
        emailRef.current.focus();
        return toast.error("email field is empty");
      }
      const emailRegex = /^\S+@\S+\.\S+$/;
    
      if (!emailRegex.test(email)) {
        emailRef.current.focus();
        return toast.error("Kindly provide a valid email address.");
      }

      if (!phone) {
        phoneRef.current.focus();
        return toast.error("phone field is empty");
      }
      if (phone.length !== 10) {
        phoneRef.current.focus();
        return toast.error("Kindly enter a valid 10-digit phone number.");
      }

      if (!password) {
        passwordRef.current.focus();
        return toast.error("password field is empty");
      }
      if (password.length < 7) {
        passwordRef.current.focus();
        return toast.error("Password must contain at least 7 characters");
      }

      if (password !== cpassword) {
        cpasswordRef.current.focus();
        return toast.error("Password and confirm password arent equal");
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('phone', phone);
      dispatch(register(formData))
      setIsLoading(false);
    }

    useEffect(()=>{
        if(isAuthenticated) {
            navigate('/');
            return
        }
        if(error)  {
            toast(error, {
                // position: toast.POSITION.TOP_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearAuthError) }
            })
            if (error === "name already exists") {
              nameRef.current.focus();
            } else if (error === "email already exists") {
              emailRef.current.focus();
            } else if (error === "phone number already exists") {
              phoneRef.current.focus();
            }
            return
        }
    },[error, isAuthenticated, dispatch, navigate])

  return (
    <>
      <MetaData title={"Sign up"} />
      {(isLoading) ? (
        <LoadingSpinner />
      ) : (
        <section className="text-gray-600 body-font my-10  min-h-screen flex items-center justify-center bg-white">
          <div className="lg:w-2/6 md:w-1/2 my-10 bg-white shadow-2xl shadow-blue-200 rounded-lg p-8 flex flex-col md:ml-auto md:mr-auto mt-10 md:mt-0">
            <form method="POST">
              <h3 className="text-3xl my-8 sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
                Sign <span className="text-indigo-600">Up</span>
              </h3>
              <div className="relative mb-4">
                <label
                  htmlFor="full-name"
                  className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={user.name}
                  onChange={handleInputs}
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  ref={nameRef}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="email"
                  className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={user.email}
                  onChange={handleInputs}
                  id="email"
                  name="email"
                  placeholder="Email"
                  ref={emailRef}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>

              <div className="relative mb-4">
                <label
                  htmlFor="phone"
                  className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold">
                  Phone
                </label>
                <input
                  type="number"
                  pattern="[0-9]{10}"
                  required
                  value={user.phone}
                  onChange={handleInputs}
                  id="phone"
                  name="phone"
                  placeholder="Phone"
                  ref={phoneRef}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>

              <div className="relative mb-4">
                <label
                  htmlFor="password"
                  className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold">
                  Password
                </label>
                <input
                  required
                  value={user.password}
                  onChange={handleInputs}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  ref={passwordRef}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>

              <div className="relative mb-4">
                <label
                  htmlFor="cpassword"
                  className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold">
                  Confirm Password
                </label>
                <input
                  required
                  value={user.cpassword}
                  onChange={handleInputs}
                  type="password"
                  id="cpassword"
                  name="cpassword"
                  placeholder="Confirm Password"
                  ref={cpasswordRef}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>

              <div className="my-4">
                <p className="text-s text-red-600	 font-bold">{authStatus}</p>
              </div>
              <div className="mx-auto w-fit">
                <div className="mx-auto">
                  <button
                    type="submit"
                    onClick={submitHandler}
                    className="text-white bg-indigo-600 shadow focus:shadow-outline focus:outline-none border-0 py-2 px-10 font-bold  hover:bg-indigo-800 rounded text-lg"
                    // disabled={loading}
                    >
                    Sign Up
                  </button>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-m">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    {" "}
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Signup;
