import React from 'react'
import ReviewerApplicationList from '../bookings/ReviewerApplicationList';
// import Events from '../bookings/Events'

const ReviewerDashboard = () => {
  return (
    <><div className='mt-6 min-h-screen'>

      <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl text-center text-gray-800 font-black leading-7 ml-3 md:leading-10">
        Reviewer  <span className="text-indigo-700">Dashboard</span> </h1>


        <div className=''>
          <ReviewerApplicationList/>
          {/* <Index/> */}
        </div>

    </div>
    </>
  )
}

export default ReviewerDashboard;