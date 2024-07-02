import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
// import { UserContext } from "./../../App";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import MetaData from "../layouts/MetaData";
import { clearAuthError, login } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
// import CaptchaComponent from "../CaptchaComponent";

const Login = () => {

  // const { dispatch } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();
  
  const { loading, error, isAuthenticated, user } = useSelector(state => state.authState);
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // new
  const loginUser = (e) => {
    e.preventDefault();

      if (!email) {
        emailRef.current.focus();
        return toast.error("email field is empty");
      }
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        emailRef.current.focus();
        return toast.error("Kindly provide a valid email address.");
      }

      if (!password) {
        passwordRef.current.focus();
        return toast.error("password field is empty");
      }
      if (password.toString().length < 7) {
        passwordRef.current.focus();
        return toast.error("Password must contain at least 7 characters");
      }

      try {
        setIsLoading(true);
        dispatch(login(email, password));
      } catch (error) {}
      finally {
        setIsLoading(false);
      }
      if (user) toast.success("Logged In Successfully")
  }

  useEffect(() => {
        console.log([error, isAuthenticated, dispatch, navigate])
        if(isAuthenticated) {
            navigate('/')
            return ;
        }
        if(error)  {
            toast(error, {
                // position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearAuthError) }
            })
            return
        }
    },[])
  return (
    <>
    <MetaData title={`Sign In`} />
    {(isLoading || isAuthenticated) ? (
      <LoadingSpinner />
    ) :
      <section className="text-gray-600 body-font min-h-screen flex items-center justify-center bg-white">
        <div className="lg:w-2/6 md:w-1/2  bg-white shadow-2xl shadow-blue-200 rounded-lg p-8 flex flex-col md:ml-auto md:mr-auto mt-10 md:mt-0">
          <form method="POST">
            {/* <h2 className="text-gray-900 font-medium text-3xl title-font mt-10 mb-5">
              Login
            </h2> */}



            <h3 className="text-3xl my-8 sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
              Sign <span className="text-indigo-600">In</span>
            </h3>


            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold"
              >
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                placeholder="Email"
                ref={emailRef}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div className="relative mb-4">
              <label
                htmlFor="password"
                className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold"
              >
                Password
              </label>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                ref={passwordRef}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            {/* <div className="my-4">
              <p className="text-s text-red-600	 font-bold">
                {authStatus}
              </p>
            </div> */}


            {/* <div className="my-4">
                <Link to="/passwordReset" className=" text-m font-bold  hover:underline">
                    Forgot Your Password?

                  </Link>
            </div> */}

            {/* <CaptchaComponent /> */}

            <div className="mx-auto w-fit">
              <div className="mx-auto">
                <button
                  type="submit"
                  onClick={loginUser}
                  className="text-white bg-indigo-600 shadow focus:shadow-outline focus:outline-none border-0 py-2 px-10 font-bold  hover:bg-indigo-800 rounded text-lg"
                  // disabled={loading}
                >
                  Login
                </button>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-m">
                Don't have an account yet?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  {" "}
                  Sign Up
                </Link>
              </p>
            </div>
          </form>

        </div>
      </section>
    }
    </>
  );
};

export default Login;