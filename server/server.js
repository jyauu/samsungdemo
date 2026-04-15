const express = require('express');
const cors = require('cors');
const { scrapeData } = require('./scraper');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/scrape', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing link" });

    try {
        console.log(`[Scraper] Initializing scrape job for: ${url}`);
        const stats = await scrapeData(url);
        res.json(stats);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: Object.keys(e).length ? String(e) : e.message || "Failed to scrape" });
    }
});

app.listen(3001, () => {
    console.log('Scraping backend listening on port 3001');
});
