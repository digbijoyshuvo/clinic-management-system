const express = require('express');
const { protect, requireRole } = require('../middleware/auth');
const {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, requireRole('admin'));

router.route('/staff')
  .get(getStaff)
  .post(createStaff);

router.route('/staff/:id')
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;
