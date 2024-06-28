import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
// import { format } from "date-fns"
import { APPLICATION_STATUS } from "../Constants";
// import { useSelector } from "react-redux";

// import BookingForm from "./BookingForm";
// import {ApplicationSent , ApprovedByAdmin,ApprovedByReviewerStep,RejectedByAdmin,ApprovedByReviewerStep} from "../Steps"
const ReviewerApplicationList = () => {
  // const { user, isAuthenticated } = useSelector(state => state.authState);
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("all");
  // const [emailVerified, setEmailVerified] = useState(false);



  // const userContact = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getdata`, {
  //       withCredentials: true, // include credentials in the request
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = response.data;
  //     //consolelog(data);

  //     if(data.emailVerified){
  //       setEmailVerified(true)
  //     }

  //     setIsLoading(false);

  //     if (response.status !== 200) {
  //       throw new Error(response.error);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   userContact();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const getApplicationData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/application-for-reviewer`, {
        withCredentials: true, // include credentials in the request
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });

      const data = response.data;
      //consolelog(data);

      const sortedApplicationData = data.application.sort((a, b) => {
        // Convert the event date strings to Date objects and compare them
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      setApplicationData(sortedApplicationData);

      // setApplicationData(data.bookings);
      setIsLoading(false);


      if (response.status !== 200) {

        throw new Error(response.status);
      }
    } catch (error) {
      //consolelog(error);
      if (error.response.status === 401) {
      //   toast.warn("Unauthorized Access! Please Login!", {
      //     toastId: 'Unauthorized'
      // })
        navigate("/login");
      }
    }
  };


  useEffect(() => {
      
      getApplicationData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // navigate(`/bookingForm/${hallId}/${hallName}`)


  const updateApplication = async (applicationId, isApproved) => {
    setIsLoading(true);

    try {
      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/application-edit/${applicationId}`, {
        isApproved: isApproved
      }, {
        withCredentials: true, // include credentials in the request
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      
      getApplicationData();
      toast.success(`Request ${isApproved} Successfull!`)

      if (response.status !== 200) {
        throw new Error(response.error);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (value) => {
    setFilterValue(value);
  };

  const filteredApplications = Object.values(applicationData).filter((applicationData) => {
    if (filterValue === APPLICATION_STATUS.ApplicationSent) {
      return applicationData.isApproved === APPLICATION_STATUS.ApplicationSent;
    } else if (filterValue === APPLICATION_STATUS.ApprovedByReviewer) {
      return applicationData.isApproved === APPLICATION_STATUS.ApprovedByReviewer;
    }else if (filterValue === APPLICATION_STATUS.ApprovedByAdmin) {
      return applicationData.isApproved === APPLICATION_STATUS.ApprovedByAdmin;
    }else if (filterValue === APPLICATION_STATUS.RejectedByReviewer) {
      return applicationData.isApproved === APPLICATION_STATUS.RejectedByReviewer;
    }else if (filterValue === APPLICATION_STATUS.RejectedByAdmin) {
      return applicationData.isApproved === APPLICATION_STATUS.RejectedByAdmin;
    }else {
      return applicationData
    }
  });

  const handleViewClick = (applicationId) => {
    navigate(`/application-view/${applicationId}`)
  };

  // const handleEditClick = (applicationId) => {
  //   navigate(`/application-edit/${applicationId}`)
  // };

  return (
    <>

      <div className="mt-6 min-h-screen">
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-3xl text-center text-gray-800 font-black leading-7 ml-3 md:leading-10">
          Application<span className="text-indigo-700"> Requests</span>  </h1>
          
          <div className="flex flex-wrap my-8 justify-center">
          <button
            className={`rounded-full px-4 py-2 mx-4  focus:outline-none ${filterValue === "all" ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter("all")}
          >
            All
          </button>
          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === APPLICATION_STATUS.ApplicationSent ? "bg-indigo-100 text-indigo-800 " : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter(APPLICATION_STATUS.ApplicationSent)}
          >
            Pending
          </button>
          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === APPLICATION_STATUS.ApprovedByReviewer ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter(APPLICATION_STATUS.ApprovedByReviewer)}
          >
            Forwarded To Admin
          </button>
          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === APPLICATION_STATUS.RejectedByReviewer ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800   hover:bg-gray-100"}`}
            onClick={() => handleFilter(APPLICATION_STATUS.RejectedByReviewer)}
          >
            Rejected By Reviewer
          </button>
          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === APPLICATION_STATUS.ApprovedByAdmin ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter(APPLICATION_STATUS.ApprovedByAdmin)}
          >
            Approved By Admin
          </button>
          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === APPLICATION_STATUS.RejectedByAdmin ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800   hover:bg-gray-100"}`}
            onClick={() => handleFilter(APPLICATION_STATUS.RejectedByAdmin)}
          >
            Rejected By Admin
          </button>
        </div>


          
          {isLoading ? (
            <LoadingSpinner />
          ) : (
          

            <div className="container w-full px-4 mx-auto sm:px-8 ">
            <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8 ">
              <div className="inline-block min-w-full border overflow-hidden rounded-lg  shadow-xl shadow-blue-100 ">
                <table className="min-w-full leading-normal    ">
                  <thead>
                    <tr className="bg-gray-200 border-gray-500  leading-normal  text-center">
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200">
                        Application Name
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase  border-gray-200">
                        Description
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200">
                        Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200">
                        Actions
                        </th>
                    </tr>
                  </thead>
                  <tbody>


                    {Array.isArray(filteredApplications) && filteredApplications.length > 0 ? (
                      filteredApplications.map((application) => (
                        // <div key={application._id} className="my-2 ">

                        <tr key={application._id} className="border-gray-200 text-center border-b-2  ">
                          <td className="px-5 py-5 font-bold text-m  bg-white  border-gray-200">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {application.applicationName}
                            </p>
                          </td>
                          <td className="px-5 py-5 text-m bg-white  border-gray-200">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {application.description}

                            </p>
                          </td>

                          <td className="px-5 py-5 text-m bg-white  border-gray-200">

                            {application.isApproved === APPLICATION_STATUS.ApprovedByAdmin && (
                              // <ApprovedByAdmin />
                              <p className="text-green-600 font-bold whitespace-no-wrap">
                                {application.isApproved}
                              </p>
                              // <p className="text-m text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-3xl text-green-500 font-black">
                              // </p>
                            )}
                            {application.isApproved === APPLICATION_STATUS.ApprovedByReviewer && (
                              // <ApprovedByReviewerStep />
                              <p className="text-blue-600 font-bold  whitespace-no-wrap">
                                {/* {application.isApproved} */}
                                Forwarded To Admin
                              </p>
                            )}

                          {application.isApproved === APPLICATION_STATUS.RejectedByReviewer && (
                              <p className="text-red-900 font-bold  whitespace-no-wrap">
                                {/* {application.isApproved} */}
                                Rejected By Reviewer
                              </p>

                            )}

                            {application.isApproved === APPLICATION_STATUS.RejectedByAdmin && (
                              <p className="text-red-900 font-bold  whitespace-no-wrap">
                                {application.isApproved}
                              </p>

                            )}
                          {application.isApproved === APPLICATION_STATUS.ApplicationSent && (
                              <p className="text-orange-600 font-bold  whitespace-no-wrap">
                              {/* {application.isApproved} */}
                                Pending
                              </p>

                            )}
                            
                          </td>


                          <td className="px-5 py-5 text-m bg-white  border-gray-200">
                            <button onClick={() => handleViewClick(application._id)} className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">View</button>
                            
                            {/* EDIT BUTTON 
                            <button onClick={() => handleEditClick(application._id)}
                              className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-yellow-200 rounded hover:bg-yellow-300  focus:outline-none">Edit</button> */}
                            
                            {
                              application.isApproved !== APPLICATION_STATUS.ApprovedByAdmin && 
                              application.isApproved !== APPLICATION_STATUS.RejectedByAdmin &&
                              application.isApproved !== APPLICATION_STATUS.ApprovedByReviewer &&
                              <button
                                onClick={() => updateApplication(application._id, APPLICATION_STATUS.ApprovedByReviewer)} className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-green-200 rounded hover:bg-green-300 focus:outline-none">Approve</button>
                            }
                            {
                              application.isApproved !== APPLICATION_STATUS.ApprovedByAdmin && 
                              application.isApproved !== APPLICATION_STATUS.RejectedByAdmin &&
                              application.isApproved !== APPLICATION_STATUS.RejectedByReviewer &&
                              <button
                                onClick={() => updateApplication(application._id, APPLICATION_STATUS.RejectedByReviewer)} className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-red-200 rounded hover:bg-red-300 focus:outline-none">Reject</button>
                            }
                          </td>

                        </tr>
                        // </div>
                      ))
                    ) : (

                      <tr className="border-gray-200 border-b justify-center">
                        <td className="px-5 py-5 font-bold text-m bg-white border-gray-200 text-center" colSpan="7">
                          <p className="text-gray-900 whitespace-no-wrap">
                            No Applications found.
                          </p>
                        </td>
                      </tr>


                      // <h2 className="text-2xl font-bold text-zinc-700  text-center mt-10">No applications Requests found.</h2>

                    )}

                  </tbody>
                </table>
              </div>
            </div>
        </div>




          )}


      </div>
    </>
  );
};

export default ReviewerApplicationList;
