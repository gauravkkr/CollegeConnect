const express = require('express');
const router = express.Router();
const { getListings, getListing, createListing, updateListing, deleteListing } = require('../controllers/listingController');
const auth = require('../middleware/auth');

router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', auth, createListing);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);

module.exports = router;
