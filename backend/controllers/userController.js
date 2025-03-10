// controllers/userController.js
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const logger = require("../utils/logger");

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user profile
 * @route   PATCH /api/users/me
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, company, preferences } = req.body;

  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update fields if provided
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (company) user.company = company;

  // Update preferences if provided
  if (preferences) {
    user.preferences = {
      ...user.preferences,
      ...preferences,
    };
  }

  // Save updated user
  await user.save();

  // Return updated user without password
  res.status(200).json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    company: user.company,
    role: user.role,
    preferences: user.preferences,
  });
});

/**
 * @desc    Add payment method
 * @route   POST /api/users/payment-methods
 * @access  Private
 */
exports.addPaymentMethod = asyncHandler(async (req, res) => {
  const { type, cardNumber, expiryDate, nameOnCard, isDefault } = req.body;

  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Create new payment method
  const newPaymentMethod = {
    type: type || "card",
    lastFour: cardNumber ? cardNumber.slice(-4) : "0000",
    expiryDate,
    isDefault: isDefault || false,
    tokenId: "tok_" + Date.now(), // In a real app, this would be a token from a payment provider
  };

  // If this is the first payment method or it's set as default
  if (newPaymentMethod.isDefault) {
    // Set all existing payment methods to not default
    if (user.paymentMethods && user.paymentMethods.length > 0) {
      user.paymentMethods.forEach((method) => {
        method.isDefault = false;
      });
    }
  }

  // Add new payment method
  user.paymentMethods.push(newPaymentMethod);

  // Save user
  await user.save();

  res.status(201).json({
    success: true,
    paymentMethods: user.paymentMethods,
  });
});

/**
 * @desc    Get all payment methods
 * @route   GET /api/users/payment-methods
 * @access  Private
 */
exports.getPaymentMethods = asyncHandler(async (req, res) => {
  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.paymentMethods);
});

/**
 * @desc    Delete payment method
 * @route   DELETE /api/users/payment-methods/:id
 * @access  Private
 */
exports.deletePaymentMethod = asyncHandler(async (req, res) => {
  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find payment method index
  const paymentMethodIndex = user.paymentMethods.findIndex(
    (method) => method._id.toString() === req.params.id
  );

  if (paymentMethodIndex === -1) {
    res.status(404);
    throw new Error("Payment method not found");
  }

  // Remove payment method
  user.paymentMethods.splice(paymentMethodIndex, 1);

  // Save user
  await user.save();

  res.status(200).json({
    success: true,
    message: "Payment method removed",
    paymentMethods: user.paymentMethods,
  });
});

/**
 * @desc    Update payment method
 * @route   PATCH /api/users/payment-methods/:id
 * @access  Private
 */
exports.updatePaymentMethod = asyncHandler(async (req, res) => {
  const { expiryDate, isDefault } = req.body;

  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find payment method
  const paymentMethod = user.paymentMethods.id(req.params.id);

  if (!paymentMethod) {
    res.status(404);
    throw new Error("Payment method not found");
  }

  // Update fields
  if (expiryDate) paymentMethod.expiryDate = expiryDate;

  // Handle default payment method
  if (isDefault && !paymentMethod.isDefault) {
    // Set all to false first
    user.paymentMethods.forEach((method) => {
      method.isDefault = false;
    });
    // Set this one to default
    paymentMethod.isDefault = true;
  }

  // Save user
  await user.save();

  res.status(200).json({
    success: true,
    paymentMethods: user.paymentMethods,
  });
});
