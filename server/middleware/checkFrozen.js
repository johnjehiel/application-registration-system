// middleware/checkFrozen.js
const Application = require('../model/applicationSchema');

const checkFrozen = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (application && application.isFrozen) {
      return res.status(403).json({ message: 'Application is frozen and cannot be modified' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkFrozen;
