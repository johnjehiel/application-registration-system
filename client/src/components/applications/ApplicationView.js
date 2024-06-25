import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";
import axios from "axios";
import { parseISO, format } from "date-fns";
import { UserContext } from "../../App";
import { Document, Page } from 'react-pdf';

// import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import {
  RequestSent,
  ApprovedByAdmin,
  ApprovedByHod,
  RejectedByAdmin,
  RejectedByHod,
} from "../Steps";
import PdfComp from "../pdfComp";


const ApplicationView = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [applicationData, setApplicationData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { state } = useContext(UserContext);

  const openModal = (applicationId) => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRejectionReason("");
  };

  const getApplicationById = async () => {

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/application-view/${applicationId}`,
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data.application;
      setApplicationData(data);
      // console.log(applicationData.pdfFile)
      setIsLoading(false);
    } catch (error) {
      navigate("/");
    }
  };

  const updateApplication = async (applicationId, isApproved) => {
    if (isApproved === "Rejected By Admin") {
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
            isApproved === "Approved By Admin" ? null : rejectionReason,
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
      getApplicationById();

      toast.success(`Application ${isApproved} Successfull!`);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
      navigate("/");
    } catch (error) {
    }
  };
  /* NO Need of edit for now 
  const handleEditClick = (applicationId) => {
    navigate(`/application-edit/${applicationId}`);
  };
  */

  useEffect(() => {
    getApplicationById();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="max-w-screen-md mx-auto p-5 my-10 bg-white shadow-2xl shadow-blue-200">
            <div className="text-center mb-16">
              <p className="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
                View Application
              </p>
              <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
                View <span className="text-indigo-600"> Application </span>
              </h3>
            </div>
            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <h1
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    htmlFor="grid-event-manager">
                    Applicant Name
                  </h1>
                  <p
                    className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-event-manager">
                    {applicationData.applicantName}
                  </p>
                  {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <h1
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-event-name">
                    Application Name
                  </h1>
                  <p
                    className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-event-name">
                    {applicationData.applicationName}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <h1
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    htmlFor="grid-phone-number">
                    Phone Number
                  </h1>
                  <p
                    className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-phone-number">
                    {applicationData.phoneNumber}
                  </p>
                  {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                </div>
                {
                  applicationData?.altNumber &&   
                  <div className="w-full md:w-1/2 px-3">
                    <h1
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                      htmlFor="grid-alt-number">
                      Alternate Number
                    </h1>
                    <p
                      className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-alt-number">
                      {applicationData.altNumber}
                    </p>
                  </div>
                }
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-6 md:mb-0">
                  <h1
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    htmlFor="grid-description">
                    Description
                  </h1>
                  <p
                    className="appearance-none block w-full h-fit text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-description">
                    {applicationData.description}
                  </p>
                  {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <h1
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    htmlFor="grid-phone-number">
                    Requested By
                  </h1>
                  <p
                    className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-phone-number">
                    {applicationData.userId.name}
                  </p>
                  {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <h1
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    htmlFor="grid-alt-number">
                    Application Created At
                  </h1>
                  <p
                    className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-alt-number">
                    {format(
                      parseISO(applicationData.createdAt),
                      "EEEE dd-MM-yyyy hh:mm aa"
                    )}
                  </p>
                </div>
              </div>
              {/* pdf viewing format 1 */}
              {applicationData.pdfFile && applicationData.pdfFile.filename && (
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <h1 className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Attached File
                    </h1>
                    <div className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <Document
                        file={`${process.env.REACT_APP_SERVER_URL}/uploads/${applicationData.pdfFile.filename}`}
                        onLoadSuccess={({ numPages }) => console.log(`Loaded PDF with ${numPages} pages.`)}
                        >
                        <Page pageNumber={1} />
                      </Document>
                    </div>
                  </div>
                </div>
              )}

              {/* pdf viewing format 2 */}
              {
                applicationData.pdfFile  && applicationData.pdfFile.filename && (
                  <PdfComp fileURL={`${process.env.REACT_APP_SERVER_URL}/uploads/${applicationData.pdfFile.filename}`}/>
                )
              }

              {applicationData.rejectionReason && (
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3 mb-6 md:mb-0">
                    <h1
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                      htmlFor="grid-phone-number">
                      Reason For Rejection
                    </h1>
                    <p className="text-s text-red-600	 font-bold">
                      {applicationData.rejectionReason}
                    </p>
                    {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                  </div>
                </div>
              )}

              <div className="mt-6 ">
                {/* <div>
                              <p className="text-m  text-xl sm:text-3xl md:text-4xl  lg:text-3xl xl:text-3xl  text-zinc-700 font-bold ">Status</p>
                            </div> */}
                {applicationData.isApproved === "Approved By Admin" && (
                  <ApprovedByAdmin />
                )}
                {applicationData.isApproved === "Approved By HOD" && (
                  <ApprovedByHod />
                )}
                {applicationData.isApproved === "Rejected By HOD" && (
                  <RejectedByHod />
                )}
                {applicationData.isApproved === "Rejected By Admin" && (
                  <RejectedByAdmin />
                )}
                {applicationData.isApproved === "Application Sent" && <RequestSent />}
              </div>
              <div className="px-5 py-5 text-l flex font-bold  bg-white justify-between border-gray-200">
                
                {state.userType === "admin" && (
                  <>
                    {
                      applicationData.isApproved !== "Approved By Admin" &&
                      <button
                        onClick={() =>
                          updateApplication(applicationData._id, "Approved By Admin")
                        }
                        className="   leading-none text-gray-600 py-3 px-5 bg-green-200 rounded hover:bg-green-300 focus:outline-none">
                        Approve
                      </button>
                    }
                    {
                      applicationData.isApproved !== "Rejected By Admin" &&
                      <button
                        onClick={() => openModal(applicationData._id)}
                        className="   leading-none text-gray-600 py-3 px-5 bg-red-200 rounded hover:bg-red-300 focus:outline-none">
                        Reject
                      </button>
                    }
                  </>
                )}

                {state.userType === "hod" && (
                  <>
                    {/* <button
                      onClick={() => handleEditClick(applicationData._id)}
                      className="   leading-none text-gray-600 py-3 px-5 bg-yellow-200 rounded hover:bg-yellow-300 focus:outline-none">
                      Edit
                    </button> */}

                    <button
                      onClick={() =>
                        updateApplication(applicationData._id, "Approved By HOD")
                      }
                      className="   leading-none text-gray-600 py-3 px-5 bg-green-200 rounded hover:bg-green-300 focus:outline-none">
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateApplication(applicationData._id, "Rejected By HOD")
                      }
                      className="   leading-none text-gray-600 py-3 px-5 bg-red-200 rounded hover:bg-red-300 focus:outline-none">
                      Reject
                    </button>

                    {/* <button
                  onClick={() => deleteBooking(applicationData._id)}
                  // onClick={() => handleDeleteModal(applicationData._id)}
                   className="   leading-none text-gray-600 py-3 px-5 bg-red-400 rounded hover:bg-red-500 focus:outline-none">Delete</button>
            */}
                  </>
                )}

              </div>
            </form>
          </div>
        </div>
      )}
      
      {showModal && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md w-1/3">
            <h2 className="text-lg font-bold mb-4">Reason for Rejection</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4 resize-none"
              placeholder="Enter reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}></textarea>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={closeModal}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                // onClick={handleReject}
                onClick={() =>
                  updateApplication(applicationData._id, "Rejected By Admin")
                }>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      
    </>
  );
};
export default ApplicationView;
