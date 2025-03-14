// controllers/partnerController.js
const Partner = require('../models/Partner');
const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
const emailService = require('../utils/emailService');

/**
 * @desc    Get all partners
 * @route   GET /api/partners
 * @access  Public
 */
exports.getPartners = asyncHandler(async (req, res) => {
  try {
    // Filter by partner type if provided
    const filter = {};
    if (req.query.partnerType) {
      filter.partnerType = req.query.partnerType;
    }
    
    const partners = await Partner.find(filter).sort({ name: 1 });
    
    res.status(200).json(partners);
  } catch (error) {
    logger.error(`Error fetching partners: ${error.message}`);
    res.status(500);
    throw new Error('Error fetching partners');
  }
});

/**
 * @desc    Get partner by ID
 * @route   GET /api/partners/:id
 * @access  Public
 */
exports.getPartnerById = asyncHandler(async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }
    
    res.status(200).json(partner);
  } catch (error) {
    logger.error(`Error fetching partner by ID: ${error.message}`);
    if (error.message === 'Partner not found') {
      res.status(404);
      throw new Error('Partner not found');
    } else {
      res.status(500);
      throw new Error('Error fetching partner details');
    }
  }
});

/**
 * @desc    Search partners
 * @route   GET /api/partners/search
 * @access  Public
 */
exports.searchPartners = asyncHandler(async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(200).json([]);
    }
    
    // Search by name, description, services, etc.
    const partners = await Partner.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { partnerType: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
        { fullDescription: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { services: { $elemMatch: { $regex: q, $options: 'i' } } }
      ]
    }).sort({ name: 1 });
    
    res.status(200).json(partners);
  } catch (error) {
    logger.error(`Error searching partners: ${error.message}`);
    res.status(500);
    throw new Error('Error searching partners');
  }
});

/**
 * @desc    Contact partner
 * @route   POST /api/partners/:id/contact
 * @access  Private
 */
exports.contactPartner = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, subject, message, partnerName } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error('Please provide name, email, subject, and message');
    }
    
    // Get partner details
    const partner = await Partner.findOne({ name: partnerName });
    
    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }
    
    // Create email content
    const emailText = `
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Subject: ${subject}
      
      Message:
      ${message}
      
      This message was sent via the PrivateJet platform.
    `;
    
    const emailHtml = `
      <h2>New contact request from PrivateJet</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr/>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br/>')}</p>
      <hr/>
      <p><em>This message was sent via the PrivateJet platform.</em></p>
    `;
    
    // Send email to partner
    await emailService.sendEmail({
      to: partner.email || 'partners@privatejet.com', // Fallback if partner email not available
      subject: `New Contact Request: ${subject}`,
      text: emailText,
      html: emailHtml
    });
    
    // Send confirmation email to user
    await emailService.sendEmail({
      to: email,
      subject: `Your message to ${partner.name} has been sent`,
      text: `
        Dear ${name},
        
        Thank you for contacting ${partner.name} through PrivateJet platform.
        
        Your message has been forwarded, and they will respond to you directly.
        
        Regards,
        The PrivateJet Team
      `,
      html: `
        <h2>Message Sent</h2>
        <p>Dear ${name},</p>
        <p>Thank you for contacting ${partner.name} through PrivateJet platform.</p>
        <p>Your message has been forwarded, and they will respond to you directly.</p>
        <p>Regards,<br/>The PrivateJet Team</p>
      `
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Contact request sent successfully' 
    });
  } catch (error) {
    logger.error(`Error sending contact request: ${error.message}`);
    if (error.message.includes('Please provide')) {
      res.status(400);
      throw new Error(error.message);
    } else if (error.message === 'Partner not found') {
      res.status(404);
      throw new Error('Partner not found');
    } else {
      res.status(500);
      throw new Error('Error sending contact request');
    }
  }
});