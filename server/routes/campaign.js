const express = require('express');
const router = express.Router();
const  { createSegment, previewAudience, createCampaign, getAllCampaigns, getAllSegments, handleDeliveryReceipt} = require('../controllers/campaign')

// Segment routes
router.post('/segments', createSegment);
router.post('/segments/preview', previewAudience);
router.get('/segments', getAllSegments);

// Campaign routes
router.post('/', createCampaign);
router.get('/', getAllCampaigns);
router.post('/delivery-receipt', handleDeliveryReceipt);

module.exports = router;