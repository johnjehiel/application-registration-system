import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";
import axios from "axios";
import { parseISO } from 'date-fns';

const EditApplication = () => {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState("");
  const { applicationId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [applicationData, setApplicationData] = useState(
    {
      applicantName: "",
      applicationName: "",
      email: "",
      phoneNumber: "",
      altNumber: "",
      description: "",
      isApproved:"",
      rejectionReason: ""
    });



  const getApplicationById = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/application-view/${applicationId}`, {
        withCredentials: true, // include credentials in the request
        headers: {
          Accept: "application/json",

          "Content-Type": "application/json",
        },
      });

      const data = response.data.application;
      //consolelog(data);

      // setApplicationData(data)
      setIsLoading(false);
      setApplicationData({
        ...applicationData,
        applicantName: data.applicantName,
        applicationName: data.applicationName,
        email: data.userId.email,
        phoneNumber: data.phoneNumber,
        description: data.description,
        altNumber: data.altNumber,
        isApproved:data.isApproved,
        rejectionReason: data.rejectionReason
      });

      setIsLoading(false);
      
    } catch (error) {
      console.log(error);      
      // navigate("/login");
    }
  };

  useEffect(() => {
    
    getApplicationById();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle change here

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setApplicationData({ ...applicationData, [name]: value });
  };

  //consolelog(applicationData);

  // send to backend

  const submitApplication = async (e) => {
    e.preventDefault();
    const {
        applicantName,
        applicationName,
        email,
        phoneNumber,
        altNumber,
        description,
        isApproved,
        rejectionReason } = applicationData;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/application-edit/${applicationId}`,
        {
            applicantName,
            applicationName,
            email,
            phoneNumber,
            altNumber,
            description,
            isApproved,
            rejectionReason
        },
        {
          withCredentials: true, // To include credentials in the request
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (!data) {
        toast.error("Error while updating!")
        // //consolelog("Message not send");
      } else {
        toast.success("application updated successfully!")
        // alert("Message send");
        navigate("/")
        // setApplicationData({ ...applicationData });
      }
    } catch (error) {
      if (error.response.status === 422 && error.response) {
        const data = error.response.data;
        setAuthStatus(data.error);
      } 
        console.error(error);
    }
  };






  return (
    <>
    {isLoading ? (
      <LoadingSpinner />
    )    : (
    <div>
      <div className="max-w-screen-md mx-auto p-5 my-10 bg-white shadow-2xl shadow-blue-200">
        <div className="text-center mb-16">
          <p className="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
            Update Booking
          </p>
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
          Update <span className="text-indigo-600">Booking </span>
          </h3>
        </div>

        <form method="POST" className="w-full">


          <div className="flex flex-wrap -mx-3 mb-6">


            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                htmlFor="grid-event-manager"
              >
                Event Coordinator Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-event-manager"
                type="text"
                value={applicationData.eventManager}
                name="eventManager"
                onChange={handleInputs}
                placeholder="Event Coordinator Name"
              />
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>


            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-event-name"
              >
                Event Name
              </label>
              <input
                value={applicationData.eventName}
                name="eventName"
                onChange={handleInputs}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-event-name"
                type="text"
                placeholder="Event Name"
              />
            </div>
          </div>




          <div className="flex flex-wrap -mx-3 mb-6">


                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-organizing-club"
                      >
                        Organizing Club
                      </label>
                      <input
                        value={applicationData.organizingClub}
                        name="organizingClub"
                        onChange={handleInputs}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-organizing-club"
                        type="text"
                        placeholder="Organizing Club"
                      />
                      {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                    </div>



         

                <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-event-date-type"
                    >
                      Event Date Type
                    </label>
                    

                    <select
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="eventDateType"
                            name="eventDateType"
                            value={applicationData.eventDateType}
                            onChange={handleInputs}>
                            <option value="">Select</option>
                            <option value="half">Half Day</option>
                            <option value="full">Full Day</option>
                            <option value="multiple">Miltiple Days</option>
                          </select>

                     </div>


          </div>






          {applicationData.eventDateType === "multiple" && (



<div className="flex flex-wrap -mx-3 mb-6">

<div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-event-date"
              >
                Event Start Date
              </label>
              <input
                value={applicationData.eventStartDate}
                name="eventStartDate"
                onChange={handleInputs}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-event-date"
                type="date"
                placeholder="Event Date"
                min={new Date().toISOString().split("T")[0]}

              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-event-start-date"
              >
                Event End Date
              </label>
              <input
                value={applicationData.eventEndDate}
                name="eventEndDate"
                onChange={handleInputs}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-event-end-date"
                type="date"
                placeholder="Event Date"
                min={new Date().toISOString().split("T")[0]}

              />
            </div>
</div>



      )
      }









            <div className="flex flex-wrap -mx-3 mb-6">

            {(applicationData.eventDateType === "full" || applicationData.eventDateType === "half") &&(
                <div className="w-full md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-event-date"
                  >
                    Event Date
                  </label>
                  <input
                    value={applicationData.eventDate}
                    name="eventDate"
                    onChange={handleInputs}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-event-date"
                    type="date"
                    placeholder="Event Date"
                    min={new Date().toISOString().split("T")[0]}

                  />
                </div>

            )}
            
   
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                htmlFor="grid-hall-name"
              >
                Hall Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-300 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-hall-name"
                type="text"
                value={applicationData.bookedHallName}
                name="bookedHallName"
                onChange={handleInputs}
                placeholder="Hall Name"
                disabled
              />
            </div>
          </div>

            



          {applicationData.eventDateType === "half" && (

          <div className="flex flex-wrap -mx-3 mb-6">


            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                htmlFor="grid-start-time"
              >
                Start Time
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-start-time"
                type="time"
                value={applicationData.startTime}
                name="startTime"
                onChange={handleInputs}
                placeholder="Start Time"
              />
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-end-time"
              >
                End Time
              </label>
              <input
                value={applicationData.endTime}
                name="endTime"
                onChange={handleInputs}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-end-time"
                type="time"
                placeholder="End Time"
              />
            </div>
          </div>


          )}
        


          <div className="flex flex-wrap -mx-3 mb-6">


            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                htmlFor="grid-phone-number"
              >
                Phone Number
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                htmlFor="grid-alt-number"
              >
                Alternate Number
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-alt-number"
                type="number"
                value={applicationData.altNumber}
                name="altNumber"
                onChange={handleInputs}
                placeholder="Alternate Number"

              />
            </div>
          </div>














          <div className="my-4">
              <p className="text-s text-red-600	 font-bold">{authStatus}</p>
            </div>








          <div className="flex flex-wrap -mx-3 mb-6">
            {/* <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Your Message
              </label>
              <textarea
                value={applicationData.message}
                name="message"
                onChange={handleInputs}
                rows="10"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              ></textarea>
            </div> */}

            <div className="flex justify-between w-full px-3">
              <button
                onClick={submitApplication}
                className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
                type="submit"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
          )}
          </>
  );
};

export default EditApplication;
