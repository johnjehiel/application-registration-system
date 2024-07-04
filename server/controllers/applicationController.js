const Application = require('../model/applicationSchema');
const User = require('../model/userSchema');
const nodemailer = require("nodemailer");
const { APPLICATION_STATUS } = require('../utils/Constants');


 // transporter for sending email
 const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:process.env.SENDER_EMAIL,
    pass:process.env.SENDER_PASSWORD
  }
})

const generateBookingEmailTemplate = (eventName, bookedHallName, organizingClub, institution, department, bookingId) => {
  return `


  <head>
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <style>
    a,
    a:link,
    a:visited {
      text-decoration: none;
      color: #00788a;
    }
  
    a:hover {
      text-decoration: underline;
    }
  
    h2,
    h2 a,
    h2 a:visited,
    h3,
    h3 a,
    h3 a:visited,
    h4,
    h5,
    h6,
    .t_cht {
      color: #000 !important;
    }
  
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td {
      line-height: 100%;
    }
  
    .ExternalClass {
      width: 100%;
    }
  </style>
  </head>
  
  <body style="font-size: 1.25rem;font-family: 'Roboto', sans-serif;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px; background-color: #FAFAFA; width: 75%; max-width: 1280px; min-width: 600px; margin-right: auto; margin-left: auto">
  <table cellpadding="12" cellspacing="0" width="100%" bgcolor="#FAFAFA" style="border-collapse: collapse;margin: auto">

    <tbody>
    <tr>
      <td style="padding: 50px; background-color: #fff; max-width: 660px">
        <table width="100%" style="">
          <tr>
            <td style="text-align:center">
            <h1 style="font-size: 30px; color: #4f46e5; margin-top: 0;">New Booking Request</h1> 
            <h1 style="font-size: 30px; color: #202225; margin-top: 0;">Hello Admin</h1>
              <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; margin-left: auto; margin-right: auto">A new booking has been requested on our platform. Please review the booking details provided below and click the button to view the booking.</p>
               <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Booking Details</h1>
              <div style="text-align: justify; margin:20px; display: flex;">
                
                <div style="flex: 1; margin-right: 20px;">
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">EVENT NAME	 :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">HALL NAME	 :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">ORGANIZING CLUB	 :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">INSTITUTION :</h1>
                       <h1 style="font-size: 20px; color: #202225; margin-top: 0;">DEPARTMENT :</h1>
                 
                </div>
                <div style="flex: 1;">
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventName}</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${bookedHallName}</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${organizingClub}</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${institution}</h1>
                       <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${department}</h1>
              
                </div>
              </div>
              
              <a href="${process.env.CLIENT_URL}/bookingsView/${bookingId}" style="background-color: #4f46e5; color: #fff; padding: 8px 24px; border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">View Booking</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>

  </table>
  </body>


  `;
};

const createNewApplication = async (req, res, next) => {

  let characterLimit = 300;

  try {
    const {
      userId,
      applicantName,
      applicationName,
      email,
      phoneNumber,
      altNumber,
      description,
      // isApproved
    } = req.body;
    //  console.log(req.body);
    const title = req.file?.originalname;
    const filename =  req.file?.filename;

    const pdfFile = {title, filename};
    
    // console.log(pdfFile);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(422).json({ error: 'user not found' });
    }

    if (!applicantName || !phoneNumber || !applicationName || !description ) {
      return res.status(422).json({ error: "Please fill all details" });

    }
    // Regular expression to validate full name with at least two words separated by a space

    // const nameRegex = /^[\w'.]+\s[\w'.]+\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*$/;
    const nameRegex = /^[a-zA-Z'.]+\s[a-zA-Z'.]+(?:\s[a-zA-Z'.]*){0,4}$/;
    
    if (!nameRegex.test(applicantName)) {
      return res.status(422).json({ error: "Invalid Applicant Name" });
    }     

    // Phone validation
    if (phoneNumber.length !== 10) {
      return res.status(422).json({ error: "Enter a valid 10-digit phone number" });
    }

    if (altNumber && altNumber.length !== 10) {
      return res.status(422).json({ error: "Enter a valid 10-digit alternate number" });
    }   

    if (!description) {
      return res.status(422).json({ error: "Description is empty" });
    }

    if (description.length > characterLimit) {
      return res.status(422).json({ error: "Description character limit exceeded" });
    }

    if (!pdfFile) {
      return res.status(422).json({ error: "File is empty" });
    }

    const application = new Application({
      userId:user._id,
      applicantName,
      applicationName,
      email,
      phoneNumber,
      altNumber,
      pdfFile,
      description,
      // isApproved
    });
    await application.save();

    res.status(201).json({ message: 'Application created successfully' });
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find().populate({
      path: 'userId',
      select: '-password -cpassword -tokens -verifyToken' // Exclude the password and cpassword fields
    });
    
    res.json({ applications });
    // console.log(applications);
  } catch (error) {
    next(error);
  }
};

const getApplicationByUserId = async (req, res, next) => {
  try {
    // const { userId } = req.params;
    const userId = req.user._id
    const application = await Application.find({ userId }).populate({
      path: 'userId',
      select: '-password' // Exclude the password and cpassword fields
    });
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return res.status(400).json({ message: 'Invalid userId' });
    // }
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ application });
  } catch (error) {
    next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  // console.log("function called");
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId).populate({
      path: 'userId',
      select: '-password -cpassword -tokens -verifyToken' // Exclude the password and cpassword fields
    });

    // console.log(application);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ application });
  } catch (error) {
    next(error);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const {
      applicantName,
      applicationName,
      email,
      phoneNumber,
      altNumber,
      description,
      rejectionReason,
      isApproved,
      isFrozen
    } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        applicantName,
        applicationName,
        email,
        phoneNumber,
        altNumber,
        description,
        isApproved,
        rejectionReason,
        isFrozen
      },
      { new: true },
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Send email based on the updated approval status
    // if (isApproved === 'Approved By Admin') {
    //   // Send email for approval
    //   sendApprovalEmail(booking, bookingId);
    // } else if (isApproved === 'Rejected By Admin') {
    //   // Send email for rejection
    //   sendRejectionEmail(booking, bookingId , rejectionReason);
    // }

    res.json({ message: 'Application updated successfully', application});
  } catch (error) {
    // next(error);
    console.log(error);
  }
};


const freezeApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const {
      applicantName,
      applicationName,
      email,
      phoneNumber,
      altNumber,
      description,
      rejectionReason,
      isApproved,
      isFrozen
    } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        applicantName,
        applicationName,
        email,
        phoneNumber,
        altNumber,
        description,
        isApproved,
        rejectionReason,
        isFrozen
      },
      { new: true },
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application updated successfully', application});
  } catch (error) {
    // next(error);
    console.log(error);
  }
};


const getApplicationForReviewer = async (req, res, next) => {
  // console.log(hodDepartment);
  try {
    const application = await Application.find();

    res.json({ application });
  } catch (error) {
    next(error);
  }
};

const getApplicationForAdmin = async (req, res, next) => {
  try {
    let statusArray = [APPLICATION_STATUS.ApplicationSent, APPLICATION_STATUS.ApprovedByReviewer, APPLICATION_STATUS.RejectedByReviewer, APPLICATION_STATUS.ApprovedByAdmin, APPLICATION_STATUS.RejectedByAdmin];
    const adminEmail = req.user.email;
    const userId = req.user._id;

    const applications = await Application.find({
       isApproved: { $in: statusArray }
  }
    ).populate({
      path: 'userId',
      select: '-password -cpassword -tokens -verifyToken' // Exclude the password and cpassword fields
    });
    
    res.json({ applications });

  } catch (error) {
    next(error);
  }
};

    const sendApprovalEmail = async (booking, bookingId) => {
      try {
    
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: booking.email, // Use the user's email associated with the booking
          subject: 'Booking Request Approved',
          html: sendApprovalEmailTemplate(booking.eventName, booking.bookedHallName, booking.organizingClub, booking.institution, booking.department, bookingId),
        };
    
        await transporter.sendMail(mailOptions);
      } catch (error) {
        // next(error);
        console.log(error);
      }
    };


    const sendRejectionEmail = async (booking,  bookingId ,rejectionReason) => {
      try {
       
    
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: booking.email, // Use the user's email associated with the booking
          subject: "Booking Request Rejected",
          html: sendRejectionEmailTemplate(booking.eventName, booking.bookedHallName, booking.organizingClub, booking.institution, booking.department, bookingId ,rejectionReason),
        };
    
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };

    const sendRejectionEmailTemplate = (eventName, bookedHallName, organizingClub, institution, department, bookingId ,rejectionReason) => {
      return `
    

      <head>
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
      <style>
        a,
        a:link,
        a:visited {
          text-decoration: none;
          color: #00788a;
        }
      
        a:hover {
          text-decoration: underline;
        }
      
        h2,
        h2 a,
        h2 a:visited,
        h3,
        h3 a,
        h3 a:visited,
        h4,
        h5,
        h6,
        .t_cht {
          color: #000 !important;
        }
      
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td {
          line-height: 100%;
        }
      
        .ExternalClass {
          width: 100%;
        }
      </style>
      </head>
      
      <body style="font-size: 1.25rem;font-family: 'Roboto', sans-serif;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px; background-color: #FAFAFA; width: 75%; max-width: 1280px; min-width: 600px; margin-right: auto; margin-left: auto">
      <table cellpadding="12" cellspacing="0" width="100%" bgcolor="#FAFAFA" style="border-collapse: collapse;margin: auto">
  
        <tbody>
        <tr>
          <td style="padding: 50px; background-color: #fff; max-width: 660px">
            <table width="100%" style="">
              <tr>
                <td style="text-align:center">
                 
                  <h1 style="font-size: 30px; color: #ef4444; margin-top: 0;">Booking Request Rejected</h1>
                  
                  <h1 style="font-size: 30px; color: #202225; margin-top: 0;">Hello User</h1>
                  <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; margin-left: auto; margin-right: auto">Your booking request has been rejected due to following reason. Please review the booking details provided below and click the button below to view the booking.</p>
                    <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Reason for Rejection</h1>
                  <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; text-align: left;">${rejectionReason}</p>
                   <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Booking Details</h1>
                  
                  <div style="text-align: justify; margin:20px; display: flex;">
                    
                    <div style="flex: 1; margin-right: 20px;">
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">EVENT NAME	 :</h1>
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">HALL NAME	 :</h1>
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">ORGANIZING CLUB	 :</h1>
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">INSTITUTION :</h1>
                           <h1 style="font-size: 20px; color: #202225; margin-top: 0;">DEPARTMENT :</h1>
                     
                    </div>
                    <div style="flex: 1;">
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventName}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${bookedHallName}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${organizingClub}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${institution}</h1>
                         <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${department}</h1>
                
                  </div>
                  </div>
                  
                  <a href="${process.env.CLIENT_URL}/bookingsView/${bookingId}"  style="background-color: #4f46e5; color: #fff; padding: 8px 24px; border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">View Booking</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
  
      </table>
      </body>
  
  
  
      `;
    };

    const sendApprovalEmailTemplate = (eventName, bookedHallName, organizingClub, institution, department, bookingId) => {
      return `
    

      <head>
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
      <style>
        a,
        a:link,
        a:visited {
          text-decoration: none;
          color: #00788a;
        }
      
        a:hover {
          text-decoration: underline;
        }
      
        h2,
        h2 a,
        h2 a:visited,
        h3,
        h3 a,
        h3 a:visited,
        h4,
        h5,
        h6,
        .t_cht {
          color: #000 !important;
        }
      
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td {
          line-height: 100%;
        }
      
        .ExternalClass {
          width: 100%;
        }
      </style>
      </head>
      
      <body style="font-size: 1.25rem;font-family: 'Roboto', sans-serif;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px; background-color: #FAFAFA; width: 75%; max-width: 1280px; min-width: 600px; margin-right: auto; margin-left: auto">
      <table cellpadding="12" cellspacing="0" width="100%" bgcolor="#FAFAFA" style="border-collapse: collapse;margin: auto">
  
        <tbody>
        <tr>
          <td style="padding: 50px; background-color: #fff; max-width: 660px">
            <table width="100%" style="">
              <tr>
                <td style="text-align:center">
                 
                  <h1 style="font-size: 30px; color: #16a34a; margin-top: 0;">Booking Request Approved</h1>
                  
                  <h1 style="font-size: 30px; color: #202225; margin-top: 0;">Hello User</h1>
                  <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; margin-left: auto; margin-right: auto">Your booking request has been approved. Please review the booking details provided below and click the button below to view the booking.</p>
                   <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">Booking Details</h1>
                  
                  <div style="text-align: justify; margin:20px; display: flex;">
                    
                    <div style="flex: 1; margin-right: 20px;">
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">EVENT NAME	 :</h1>
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">HALL NAME	 :</h1>
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">ORGANIZING CLUB	 :</h1>
                      <h1 style="font-size: 20px; color: #202225; margin-top: 0;">INSTITUTION :</h1>
                           <h1 style="font-size: 20px; color: #202225; margin-top: 0;">DEPARTMENT :</h1>
                     
                    </div>
                    <div style="flex: 1;">
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${eventName}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${bookedHallName}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${organizingClub}</h1>
                    <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${institution}</h1>
                         <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${department}</h1>
                
                  </div>
                  </div>
                  
                  <a href="${process.env.CLIENT_URL}/bookingsView/${bookingId}"  style="background-color: #4f46e5; color: #fff; padding: 8px 24px; border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">View Booking</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
  
      </table>
      </body>
  
  
      `;
    };



module.exports = { createNewApplication, getApplications, getApplicationByUserId, getApplicationById,  updateApplication, freezeApplication, getApplicationForReviewer, getApplicationForAdmin };
