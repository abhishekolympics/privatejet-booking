// routes/users.js
const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  addPaymentMethod,
  getPaymentMethods,
  deletePaymentMethod,
  updatePaymentMethod,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const {
  validateProfileUpdate,
  validatePaymentMethod,
} = require("../middleware/validators");

// All routes require authentication
router.use(protect);

// User profile routes
router.get("/me", getUserProfile);
router.patch("/me", validateProfileUpdate, updateProfile);

// Payment method routes
router
  .route("/payment-methods")
  .get(getPaymentMethods)
  .post(validatePaymentMethod, addPaymentMethod);

router
  .route("/payment-methods/:id")
  .patch(updatePaymentMethod)
  .delete(deletePaymentMethod);

module.exports = router;
