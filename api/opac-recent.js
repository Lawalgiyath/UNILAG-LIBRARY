// Vercel Serverless Function: UNILAG Library Recent OPAC Books API
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'data', 'opac_recent_books.json');

  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return res.status(200).json(data);
    } catch (err) {
      console.error('Error reading opac_recent_books.json:', err);
    }
  }

  // Graceful fallback
  res.status(200).json({
    source: 'UNILAG Library Catalogue API',
    last_updated: new Date().toISOString(),
    total: 0,
    books: []
  });
};
