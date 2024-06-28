import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";
import axios from "axios";

import notVerified from "../../assets/notVerified.jpg";
import MetaData from "../layouts/MetaData";
import { useSelector } from 'react-redux';

// const ApplicationForm = () => {
//   return <h1>applicantion form</h1>
// }

const ApplicationForm = () => {
  const { loading, error, isAuthenticated, user } = useSelector(state => state.authState)
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState("");
//   const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [applicationData, setApplicationData] = useState({
    userId: user ? user._id : "",
    applicantName: user ? user.name : "",
    applicationName: "",
    email: user ? user.email : "",
    role: user ? user.role : "",
    phoneNumber: user ? user.phone : "",
    altNumber: "",
    description: "",
    // isApproved: "",
  });
  let characterLimit = 300;

//   const userContact = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_SERVER_URL}/getdata`,
//         {
//           withCredentials: true, // include credentials in the request
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     //   console.log("response.data", response.data);
//       const data = response.data;
//       //consolelog(data);

//       let status;
//       // if(data.role === "admin"){
//       //   status = APPLICATION_STATUS.ApprovedByAdmin
//       // }else if (data.role === "hod"){
//       //   status = APPLICATION_STATUS.ApprovedByReviewer
//       // }

// //       if (data.emailVerified) {
// //         setEmailVerified(true);
// //       }

//       setApplicationData({
//         ...applicationData,
//         userId: data._id,
//         applicantName: data.name,
//         email: data.email,
//         // department: data.department,
//         // institution: data.institution,
//         role: data.role,
//         description: data.description,
//         isApproved: status,
//         phoneNumber: data.phone.toString(),
//       });

//       setIsLoading(false);

//       if (response.status !== 200) {
//         throw new Error(response.error);
//       }
//     } catch (error) {
//       // //consolelog(error);
//       navigate("/login");
//     }
//   };

  const InitializeApplicationData = () => {
    setApplicationData({
        ...applicationData,
        userId: user ? user._id : "",
        applicantName: user ? user.name : "",
        email: user ? user.email : "",
        role: user ? user.role : "",
        phoneNumber: user ? user.phone.toString() : "",
    })
  }
  useEffect(() => {
    setIsLoading(true);
    InitializeApplicationData();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

//   // handle change here

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setApplicationData({ ...applicationData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      setFile(null);
    } else {
      setFile(selectedFile);
    }
  };

  // send to backend

  const submitForm = async (e) => {
    e.preventDefault();
    // console.log(file);
    setIsLoading(true);
    const {
      applicantName,
      applicationName,
      userId,
      email,
      role,
      phoneNumber,
      altNumber,
      description,
      // isApproved,
    } = applicationData;
    console.log(applicationData)
    if (!applicantName || !phoneNumber || !applicationName) {
        setIsLoading(false);
        return toast.error("Please fill all details");
    }
    // Regular expression to validate full name with at least two words separated by a space

    const nameRegex = /^[\w'.]+\s[\w'.]+\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*$/;

    if (!nameRegex.test(applicantName)) {
        setIsLoading(false);
        return toast.error("Please enter your full Event Coordinator name");
    }     

    // Phone validation
    if (phoneNumber.length !== 10) {
        console.log("phone" + phoneNumber.length)
        setIsLoading(false);
        return toast.error("Please enter a valid 10-digit phone number");
    }

    if (altNumber && altNumber.length !== 10) {
        setIsLoading(false);
        return toast.error("Please enter a valid 10-digit alternate number");
    }

    if (description.length > characterLimit) {
        setIsLoading(false);
        return toast.error("Description character limit exceeded");
    }

    if (!file) {
      setIsLoading(false);
      return toast.error("No pdf file uploaded");
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/application-form`,
        {
          userId,
          applicantName,
          applicationName,
          email,
          role,
          phoneNumber,
          altNumber,
          file,
          description,
          // isApproved,
        },
        {
          withCredentials: true, // To include credentials in the request
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );

      const data = response.data;
      if (data.message === "Application created successfully") {
        // console.log(response.data);
        toast.success("Application created successfully!");
        navigate("/");
      } else {
        toast.error("Application not sent!");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          const data = error.response.data;
          // Handle validation errors
          // You can set specific error messages for different fields if needed
          if (data && data.error) {
            const errorMessage = data.error;
            setAuthStatus(errorMessage);
            toast.error(errorMessage);
          }
        } else if (error.response.status === 403) {
          toast.error("Unauthorized request!");
        } else {
          console.error(error);
          toast.error("An error occurred while creating the application.");
        }
      } else {
        console.error(error);
        toast.error("An error occurred while creating the application.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <MetaData title={`Application Form`} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="max-w-screen-md mx-auto p-5 my-10 bg-white shadow-2xl shadow-blue-200">
            <div className="text-center mb-16">
              <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
                Application <span className="text-indigo-600">Form </span>
              </h3>
            </div>

            <form method="POST" className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    htmlFor="grid-event-manager">
                    Applicant Name
                  </label>
                  <input
                    // className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
                    id="grid-event-manager"
                    type="text"
                    value={applicationData.applicantName}
                    name="applicantName"
                    onChange={handleInputs}
                    placeholder="Applicant Name"
                  />
                  {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                </div>

                <div className="w-full md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    htmlFor="grid-alt-number">
                    Application Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
                    id="grid-alt-number"
                    type="text"
                    value={applicationData.applicationName}
                    name="applicationName"
                    onChange={handleInputs}
                    placeholder="Application Name"
                  />
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    htmlFor="grid-phone-number">
                    Phone Number
                  </label>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
                    id="grid-phone-number"
                    type="number"
                    value={applicationData.phoneNumber}
                    name="phoneNumber"
                    onChange={handleInputs}
                    placeholder="Phone Number"
                  />
                  {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                </div>

                <div className="w-full md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    htmlFor="grid-alt-number">
                    Alternate Number
                  </label>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
                    id="grid-alt-number"
                    type="number"
                    value={applicationData.altNumber}
                    name="altNumber"
                    onChange={handleInputs}
                    placeholder="Alternate Number"
                  />
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-6 md:mb-0">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="description">
                    Description
                </label>
                <textarea
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-nones focus:border-gray-500"
                    id="description"
                    name="description"
                    value={applicationData.description}
                    onChange={handleInputs}
                    placeholder="Enter a description"
                    rows="5"
                />
                <p className="text-gray-600 text-xs italic">
                    {applicationData.description ? applicationData.description.length : 0} / 300 words
                </p>
                {applicationData.description?.length > characterLimit && (
                    <p className="text-red-500 text-xs italic">
                    character limit exceeded!
                    </p>
                )}
                </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="file-upload"
                  >
                    Upload PDF
                  </label>
                  <input
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="my-4">
                <p className="text-s text-red-600	 font-bold">{authStatus}</p>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="flex justify-between w-full px-3">
                  <button
                    // onClick={handleConfirmModal}
                    onClick={submitForm}
                    className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
                    type="submit">
                    Send Request
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )
      }
    </>
  );
};

export default ApplicationForm;
