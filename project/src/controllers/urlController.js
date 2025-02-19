const { nanoid } = require('nanoid');
const Url = require('../models/Url');

const shortenUrl = async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    new URL(url);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const urlId = nanoid(6);
    const shortUrl = `http://localhost:3000/${urlId}`;

    const urlEntry = new Url({
      urlId,
      originalUrl: url,
      shortUrl,
    });

    await urlEntry.save();

    res.json({
      original_url: url,
      short_url: shortUrl,
      id: urlId
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const redirectToUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ urlId: req.params.id });
    
    if (url) {
      await Url.updateOne(
        { urlId: req.params.id },
        { $inc: { clicks: 1 } }
      );
      return res.redirect(url.originalUrl);
    }
    
    return res.status(404).json({ error: 'URL not found' });
  } catch (error) {
    console.error('Error redirecting to URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const listUrls = async (req, res) => {
  try {
    const urls = await Url.find({}, '-_id urlId originalUrl shortUrl clicks createdAt');
    res.json(urls);
  } catch (error) {
    console.error('Error listing URLs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  shortenUrl,
  redirectToUrl,
  listUrls
};