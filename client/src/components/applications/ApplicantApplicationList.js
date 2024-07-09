import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingSpinner from "../LoadingSpinner";
import { APPLICATION_STATUS } from "../Constants";

const ApplicantApplicationList = () => {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const getApplicationData = async (userId) => {
    if (hasMore == false) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/applicant-applications`, {
        params: { page, pageSize: 5 },
        withCredentials: true, // include credentials in the request
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });

      const data = response.data;
      setApplicationData((prevApplications) => [...prevApplications, ...data.applications]);
      if (applicationData.length + data.applications.length >= data.totalApplications) {
        setHasMore(false);
      }

      setIsLoading(false);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };



  useEffect(() => {
    getApplicationData();
    // console.log("applications", applicationData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleFilter = (value) => {
    setFilterValue(value);
  };
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleViewClick = (applicationId) => {
    navigate(`/application-view/${applicationId}`)
  };

  const filteredApplications = applicationData.filter((applicationData) => {
    const matchesSearch = applicationData.applicationName.toLowerCase().includes(searchQuery.toLowerCase());
    if (matchesSearch) {
      if (filterValue === APPLICATION_STATUS.ApplicationSent) {
        return applicationData.isApproved === APPLICATION_STATUS.ApplicationSent;
      } else if (filterValue === APPLICATION_STATUS.ApprovedByReviewer) {
        return applicationData.isApproved === APPLICATION_STATUS.ApprovedByReviewer;
      } else if (filterValue === APPLICATION_STATUS.ApprovedByAdmin) {
        return applicationData.isApproved === APPLICATION_STATUS.ApprovedByAdmin;
      } else if (filterValue === APPLICATION_STATUS.RejectedByAdmin) {
        return applicationData.isApproved === APPLICATION_STATUS.RejectedByAdmin;
      } else if (filterValue === APPLICATION_STATUS.RejectedByReviewer) {
        return applicationData.isApproved === APPLICATION_STATUS.RejectedByReviewer;
      } else {
        return applicationData;
      }
    }
    return false;
  });

 
  return (
    <>

      <div className="mt-6 min-h-screen">
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-3xl text-center text-gray-800 font-black leading-7 ml-3 md:leading-10">
          Your<span className="text-indigo-700"> Applications</span> </h1>


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
          
        <div>
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
          </div>

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

        <div className="my-2 flex max-sm:flex-col justify-center">
        <div className="relative sm:ml-10 w-1/4 max-sm:w-2/3 max-sm:ml-4">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fi fi-rr-form mt-1"></i>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search application name"
              className="pl-10 pr-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) 
        : 
        ( 
         
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
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200 w-3/12">
                        Application Name
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase  border-gray-200 w-5/12">
                        Description
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200 w-2/12">
                        Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200 w-2/12">
                        Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>

                    { filteredApplications.length > 0 ? (
                        filteredApplications.map((application, index) => (

                        <tr key={index} className={`border-gray-200 text-center border-b-2 ${
                          application.isFrozen ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900'
                        }`}>
                            <td className="px-5 py-5 font-bold text-m border-gray-200 w-3/12">
                            <p className="whitespace-no-wrap">
                                {application.applicationName}
                            </p>
                            </td>
                            <td className="px-5 py-5 text-m border-gray-200 w-5/12">
                            <p className="whitespace-no-wrap">
                                {application.description}

                            </p>
                            </td>

                            <td className="px-5 py-5 text-m border-gray-200 w-2/12">

                            {application.isApproved === APPLICATION_STATUS.ApprovedByAdmin && (

                                <p className="text-green-600 font-bold whitespace-no-wrap">
                                {application.isApproved}
                                </p>

                            )}
                            {application.isApproved === APPLICATION_STATUS.ApprovedByReviewer && (
                                <p className="text-blue-600 font-bold  whitespace-no-wrap">
                                Forwarded To Admin
                                </p>
                            )}

                            {application.isApproved === APPLICATION_STATUS.RejectedByReviewer && (
                                <p className="text-red-900 font-bold  whitespace-no-wrap">
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
                                Pending
                                </p>
                                )
                            }

                            </td>


                            <td className="px-5 py-5 text-m border-gray-200 w-2/12">
                            <button onClick={() => handleViewClick(application._id)} className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"><i className="fi fi-rr-eye"></i></button>
                            </td>

                        </tr>
                        ))
                    ) : (

                        <tr className="border-gray-200 border-b justify-center">
                        <td className="px-5 py-5 font-bold text-m bg-white border-gray-200 text-center" colSpan="4">
                            <p className="text-gray-900 whitespace-no-wrap">
                            No Applications Requests found.
                            </p>
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </InfiniteScroll>
                </div>
            </div>
         </div>
        )
        }
      </div>
    </>
  );
};

export default ApplicantApplicationList;