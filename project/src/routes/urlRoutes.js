const express = require('express');
const router = express.Router();
const { shortenUrl, redirectToUrl, listUrls } = require('../controllers/urlController');

router.post('/shorten', shortenUrl);
router.get('/urls/list', listUrls);
router.get('/:id', redirectToUrl);

module.exports = router;