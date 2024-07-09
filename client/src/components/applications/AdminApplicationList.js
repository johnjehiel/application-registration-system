import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { APPLICATION_STATUS } from "../Constants";
import InfiniteScroll from 'react-infinite-scroll-component';

const AdminApplicationList = () => {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [applicantNameSearchQuery, setApplicantNameSearchQuery] = useState("");
  const [applicationNameSearchQuery, setApplicationNameSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const openModal = (applicationId) => {
    setShowModal(true);
    setSelectedApplicationId(applicationId);
  };
  const closeModal = () => {
    setShowModal(false);
    setRejectionReason('');
    setSelectedApplicationId('');
  };

  const getApplicationData = async () => {
    if (hasMore == false) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/application-for-admin`, {
        params: { page, pageSize: 5 },
        withCredentials: true, // include credentials in the request
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });

      const data = response.data;

      // const sortedApplicationData = data.applications.sort((a, b) => {
      //   // Convert the event date strings to Date objects and compare them
      //   return new Date(a.createdAt) - new Date(b.createdAt);
      // });
      setApplicationData((prevApplications) => [...prevApplications, ...data.applications]);
      if (applicationData.length + data.applications.length >= data.totalApplications) {
        setHasMore(false);
      }
      setIsLoading(false);


      if (response.status !== 200) {

        throw new Error(response.status);
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login");
      }
    }
  }

  useEffect(() => {

    getApplicationData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])


  const updateApplication = async (applicationId, isApproved) => {
    if (isApproved === APPLICATION_STATUS.RejectedByAdmin) {
      if (rejectionReason.trim() === "") {
        toast.error("Please provide a reason for rejection.");
        return;
      } else {
        setRejectionReason(null);
      }
    }
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/application-edit/${applicationId}`,
        {
          isApproved: isApproved,
          rejectionReason:
            isApproved === APPLICATION_STATUS.ApprovedByAdmin ? null : rejectionReason,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      closeModal();
      // getApplicationData();
      
      toast.success(`Request ${isApproved} Successfull!`);
      handleViewClick(applicationId);
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
  // const handleFilterValues = (values) => {
  //   setFilterValues(values);
  // };

  const handleApplicantNameSearch = (event) => {
    setApplicantNameSearchQuery(event.target.value);
  };
  const handleApplicationNameSearch = (event) => {
    setApplicationNameSearchQuery(event.target.value);
  };

  const filteredApplications = applicationData.filter((applicationData) => {
    const matchApplicantName = applicationData.applicantName.toLowerCase().includes(applicantNameSearchQuery.toLowerCase());
    const matchApplicationName = applicationData.applicationName.toLowerCase().includes(applicationNameSearchQuery.toLowerCase());
    if (matchApplicantName && matchApplicationName) {
      if (filterValue === APPLICATION_STATUS.ApplicationSent) {
        return applicationData.isApproved === APPLICATION_STATUS.ApplicationSent;
      }else if(filterValue === "Approved By HOD and Rejected By HOD") {
        return (applicationData.isApproved === APPLICATION_STATUS.ApprovedByReviewer || applicationData.isApproved === APPLICATION_STATUS.RejectedByReviewer);    
      } else if (filterValue === APPLICATION_STATUS.ApprovedByAdmin) {
        return applicationData.isApproved === APPLICATION_STATUS.ApprovedByAdmin;
      } else if (filterValue === APPLICATION_STATUS.RejectedByAdmin) {
        return applicationData.isApproved === APPLICATION_STATUS.RejectedByAdmin;
      } else {
        return applicationData
      }
    }
    return false
  });

  /*
  const handleEditClick = (applicationId) => {
    navigate(`/bookingsEdit/${applicationId}`)
  };
  */
  const handleViewClick = (applicationId) => {
    navigate(`/application-view/${applicationId}`)
  };
  return (
    <>
      {/* <Index /> */}

      <div className="mt-6">
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
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === "Approved By HOD and Rejected By HOD" ? "bg-indigo-100 text-indigo-800 " : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter("Approved By HOD and Rejected By HOD")}
          >
            Pending
          </button>


          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === APPLICATION_STATUS.ApprovedByAdmin ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter(APPLICATION_STATUS.ApprovedByAdmin)}
          >
            Approved
          </button>
          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === APPLICATION_STATUS.RejectedByAdmin ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800   hover:bg-gray-100"}`}
            onClick={() => handleFilter(APPLICATION_STATUS.RejectedByAdmin)}
          >
            Rejected
          </button>

        </div>
        {showModal && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md w-1/3">
            <h2 className="text-lg font-bold mb-4">Reason for Rejection</h2>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded mb-4 resize-none" 
              placeholder="Enter reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            ></textarea>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                // onClick={handleReject}
                onClick={() =>
                  updateApplication(selectedApplicationId, APPLICATION_STATUS.RejectedByAdmin)
                }
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
        <div className="my-2 flex max-sm:flex-col justify-center">
          <div className="relative w-1/4 max-sm:w-2/3 max-sm:ml-4">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fi fi-rr-circle-user mt-1"></i>
            </span>
            <input
              type="text"
              value={applicantNameSearchQuery}
              onChange={handleApplicantNameSearch}
              placeholder="Search applicant name"
              className="pl-10 pr-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="relative sm:ml-10 w-1/4 max-sm:w-2/3 max-sm:ml-4">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fi fi-rr-form mt-1"></i>
            </span>
            <input
              type="text"
              value={applicationNameSearchQuery}
              onChange={handleApplicationNameSearch}
              placeholder="Search application name"
              className="pl-10 pr-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="container w-full px-4 mx-auto sm:px-8 ">
              <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8 ">
                <div className="inline-block min-w-full border overflow-hidden rounded-lg  shadow-xl shadow-blue-100 ">
                <InfiniteScroll
                  dataLength={applicationData.length}
                  next={() => setPage(prev => prev + 1)}
                  hasMore={hasMore}
                  // loader={<h4>Loading...</h4>}
                  loader={<p className="text-gray-300">Loading...</p>}
                  endMessage={<></>}
                >
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr className="bg-gray-200 border-gray-500  leading-normal  text-center">
                            <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200 w-2/12">
                            Applicant Name
                            </th>
                            <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200 w-2/12">
                            Application Name
                            </th>
                            <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase  border-gray-200 w-4/12">
                            Description
                            </th>
                            <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200 w-1/12">
                            Status
                            </th>
                            <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200 w-3/12">
                            Actions
                            </th>
                        </tr>
                      </thead>
                      <tbody>


                        {Array.isArray(filteredApplications) && filteredApplications.length > 0 ? (
                          filteredApplications.map((application, index) => (

                            <tr key={index} className={`border-gray-200 text-center border-b-2 ${
                              application.isFrozen ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900'
                            }`}>
                              <td className="px-5 py-5 font-bold text-m border-gray-200 w-2/12">
                                <p className="whitespace-no-wrap">
                                  {application.applicantName}
                                </p>
                              </td>
                              <td className="px-5 py-5 font-bold text-m border-gray-200 w-2/12">
                                <p className="whitespace-no-wrap">
                                  {application.applicationName}
                                </p>
                              </td>
                              <td className="px-5 py-5 text-m  border-gray-200 w-4/12">
                                <p className="whitespace-no-wrap">
                                  {application.description}

                                </p>
                              </td>

                              <td className="px-5 py-5 text-m border-gray-200 w-1/12">

                                {application.isApproved === APPLICATION_STATUS.ApprovedByAdmin && (
                
                                  <p className="text-green-600 font-bold whitespace-no-wrap">
                                    {application.isApproved}
                                  </p>
                                )}
                                {(application.isApproved === APPLICATION_STATUS.ApprovedByReviewer &&
                                  <p className="text-blue-600 font-bold  whitespace-no-wrap">
                                  Approved By Reviewer
                                  </p>
                                )}
                                {(application.isApproved === APPLICATION_STATUS.RejectedByReviewer &&  
                                  <p className="text-red-900 font-bold  whitespace-no-wrap">
                                  Rejected By Reviewer
                                  </p>
                                )}

                                {application.isApproved === APPLICATION_STATUS.ApplicationSent && (
                                  <p className="text-red-600 font-bold  whitespace-no-wrap">
                                    Pending
                                  </p>
                                )}

                                {application.isApproved === APPLICATION_STATUS.RejectedByAdmin && (
                                  <p className="text-red-900 font-bold  whitespace-no-wrap">
                                    {application.isApproved}
                                  </p>

                                )}

                              </td>

                              <td className="px-5 py-5 text-m border-gray-200 w-3/12">
                                <button onClick={() => handleViewClick(application._id)} className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"><i className="fi fi-rr-eye"></i></button>
                            
                                {
                                  !application.isFrozen && application.isApproved !== APPLICATION_STATUS.ApprovedByAdmin && 
                                  <button
                                    onClick={() => updateApplication(application._id, APPLICATION_STATUS.ApprovedByAdmin)} className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-green-200 rounded hover:bg-green-300 focus:outline-none"
                                  >
                                      <i className="fi fi-rr-check"></i>
                                  </button>
                                }
                                {
                                  !application.isFrozen && application.isApproved !== APPLICATION_STATUS.RejectedByAdmin && 
                                <button
                                    onClick={() => openModal(application._id)}
                                    className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-red-200 rounded hover:bg-red-300 focus:outline-none"
                                  >
                                    <i className="fi fi-rr-cross"></i>
                                </button>
                                }
                              </td>


                            </tr>
                          ))
                        ) : (

                          <tr className="border-gray-200 border-b justify-center">
                            <td className="px-5 py-5 font-bold text-m bg-white border-gray-200 text-center" colSpan="5">
                              <p className="text-gray-900 whitespace-no-wrap">
                                No Applications found.
                              </p>
                            </td>
                          </tr>
                        )}

                      </tbody>
                    </table>
                  </InfiniteScroll >
                </div>
              </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminApplicationList;
