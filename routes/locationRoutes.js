require('dotenv').config();
const express = require('express');

const router = express.Router();

router.get('/autocomplete', async (req, res) => {
    const { text } = req.query;
    const apiKey = process.env.GEOAPIFY_API_KEY;
    
    if (!text) {
        return res.status(400).json({ error: 'Text query is required' });
    }
    if (!apiKey) {
        return res.status(500).json({ error: 'Missing API key' });
    }

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${apiKey}`;

    try {
       
        const response = await fetch(url); 
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Geoapify API error: ${JSON.stringify(data)}`);
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching location data:', error.message);
        res.status(500).json({ error: 'Failed to fetch location data', details: error.message });
    }
});

module.exports = router;