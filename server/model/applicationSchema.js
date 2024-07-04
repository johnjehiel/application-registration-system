const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../utils/Constants');

const applicationSchema = new mongoose.Schema(
  { userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tempuser',
    required: true
  },
    applicantName: {
      type: String,
      required: true
    },
    applicationName: {
        type: String,
        required: true
      },
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: Number,
      required: true
    },
    altNumber: {
      type: Number
    },
    description: {
        type: String,
        required: true
    },
    rejectionReason: {
      type: String,
    },
    isApproved: {
      default: APPLICATION_STATUS.ApplicationSent,
      type: String,
      required: true
    },
    pdfFile: {
      title: {
        type: String,
        required: true
      },
      filename: {
        type: String,
        required: true
      }
    },
    isFrozen: {
      type: Boolean,
      default: false,
      required: true
    },
    reviewerUpdatedAt: {
      type: Date
    },
    adminUpdatedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.pre('save', function (next) {
  const application = this;

  if (application.isModified('isApproved')) {
    if (application.isApproved === APPLICATION_STATUS.ApprovedByReviewer || application.isApproved === APPLICATION_STATUS.RejectedByReviewer) {
      application.reviewerUpdatedAt = new Date();
    } else if (application.isApproved === APPLICATION_STATUS.ApprovedByAdmin || application.isApproved === APPLICATION_STATUS.RejectedByAdmin) {
      application.adminUpdatedAt = new Date();
    }
  }

  next();
});

// bookingSchema.index({ eventDate: 1 }, { expireAfterSeconds: 86400 });
const Application = mongoose.model('application', applicationSchema);

module.exports = Application;