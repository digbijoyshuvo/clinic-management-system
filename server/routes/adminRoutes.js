const express = require('express');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, isAdmin);

router.route('/staff')
  .get(getStaff)
  .post(createStaff);

router.route('/staff/:id')
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;
