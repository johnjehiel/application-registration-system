
import React, { useEffect, useState } from "react";
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

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };
  /*
  const PostData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const {
      name,
      email,
      phone,
      userType,
      institution,
      department,
      adminKey,
      password,
      cpassword,
    } = user;

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/register`,
        {
          name,
          email,
          phone,
          userType,
          institution,
          department,
          adminKey,
          password,
          cpassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsLoading(false);
      toast.success("Sign Up Successfull!");

      navigate("/login");
    } catch (error) {
      if (error.response.status === 422 && error.response) {
        setIsLoading(false);
        const data = error.response.data;
        setAuthStatus(data.error);
      }
    }
  };
*/
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(state => state.authState);

  const submitHandler = (e) => {
        console.log("SUbmitting");
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', user.name)
        formData.append('email', user.email)
        formData.append('password', user.password)
        formData.append('phone', user.phone);
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
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearAuthError) }
            })
            return
        }
    },[error, isAuthenticated, dispatch, navigate])

  return (
    <>
      <MetaData title={"Sign up"} />
      {(isLoading || loading) ? (
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
                  type="tel"
                  pattern="[0-9]{10}"
                  required
                  value={user.phone}
                  onChange={handleInputs}
                  id="phone"
                  name="phone"
                  placeholder="Phone"
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
