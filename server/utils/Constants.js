const ROLES = {
    admin: "admin",
    reviewer: "reviewer",
    applicant: "applicant"
}

const APPLICATION_STATUS = {
    ApplicationSent: "Application Sent",
    ApprovedByAdmin: "Approved By Admin",
    ApprovedByReviewer: "Approved By Reviewer",
    RejectedByAdmin: "Rejected By Admin",
    RejectedByReviewer: "Rejected By Reviewer"
}

module.exports = { ROLES, APPLICATION_STATUS };