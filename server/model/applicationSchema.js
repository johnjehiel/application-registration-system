const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  { userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER',
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
      default: "Application Sent",
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
    }
  },
  {
    timestamps: true
  }
);

// bookingSchema.index({ eventDate: 1 }, { expireAfterSeconds: 86400 });
const Application = mongoose.model('application', applicationSchema);

module.exports = Application;