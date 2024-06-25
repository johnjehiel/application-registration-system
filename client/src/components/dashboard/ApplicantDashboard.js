import React from 'react'
import ApplicantApplicationList from '../applications/ApplicantApplicationList'
import MetaData from '../layouts/MetaData'
// import BookingFaculty from '../bookings/BookingsFaculty'

const ApplicantDashboard = () => {
  return (
    <>
      <div className='mt-6 min-h-screen'>

        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl text-center text-gray-800 font-black leading-7 ml-3 md:leading-10">
        Applicant  <span className="text-indigo-700">Dashboard</span> </h1>

          <div className='m-3'>
          <MetaData title={"Application Registration System"} />
            <ApplicantApplicationList />
          </div>
      
      </div>
    </>
  )
}

export default ApplicantDashboard