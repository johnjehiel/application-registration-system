const Application = require('../model/applicationSchema');
const User = require('../model/userSchema');
const { APPLICATION_STATUS, ROLES } = require('../utils/Constants');

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
    } = req.body;
    const title = req.file?.originalname;
    const filename =  req.file?.filename;

    const pdfFile = {title, filename};
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(422).json({ error: 'user not found' });
    }

    if (!applicantName || !phoneNumber || !applicationName || !description ) {
      return res.status(422).json({ error: "Please fill all details" });

    }

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
  } catch (error) {
    next(error);
  }
};

const getApplicationByUserId = async (req, res, next) => {
  try {
    const userId = req.user._id
    const application = await Application.find({ userId }).populate({
      path: 'userId',
      select: '-password'
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ application });
  } catch (error) {
    next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId).populate({
      path: 'userId',
      select: '-password -cpassword -tokens -verifyToken'
    });
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
      reviewerUpdatedAt,
      adminUpdatedAt,
      isFrozen
    } = req.body;

    let newReviewerUpdatedAt;
    let newAdminUpdatedAt;
    if (req.user.role === ROLES.reviewer) {
      newReviewerUpdatedAt = new Date();
    } else {
      newReviewerUpdatedAt = reviewerUpdatedAt;
    }
    if (req.user.role === ROLES.admin) {
      newAdminUpdatedAt = new Date();
    } else {
      newAdminUpdatedAt = adminUpdatedAt;
    }

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
        adminUpdatedAt: newAdminUpdatedAt,
        reviewerUpdatedAt: newReviewerUpdatedAt,
        isFrozen
      },
      { new: true },
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application updated successfully', application});
  } catch (error) {
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
      adminUpdatedAt,
      reviewerUpdatedAt,
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
        adminUpdatedAt,
        reviewerUpdatedAt,
        isFrozen
      },
      { new: true },
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application updated successfully', application});
  } catch (error) {
    console.log(error);
  }
};


const getApplicationForReviewer = async (req, res, next) => {
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
      select: '-password -cpassword -tokens -verifyToken'
    });
    
    res.json({ applications });

  } catch (error) {
    next(error);
  }
};


module.exports = { createNewApplication, getApplications, getApplicationByUserId, getApplicationById,  updateApplication, freezeApplication, getApplicationForReviewer, getApplicationForAdmin };
