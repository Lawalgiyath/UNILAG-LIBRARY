// Vercel Serverless Function: Accredited Journals Search & Directory API
import fs from 'fs';
import path from 'path';

let cachedCatalog = null;

function getCatalog() {
  if (cachedCatalog) return cachedCatalog;
  try {
    const p = path.join(process.cwd(), 'data', 'accredited_journals_catalog.json');
    if (fs.existsSync(p)) {
      cachedCatalog = JSON.parse(fs.readFileSync(p, 'utf8'));
      return cachedCatalog;
    }
  } catch (e) {
    console.error('Error reading journals catalog:', e);
  }
  return [];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const catalog = getCatalog();
  const q = (req.query.q || '').toLowerCase().trim();
  const faculty = (req.query.faculty || 'ALL').trim();
  const index = (req.query.index || 'ALL').toUpperCase().trim();
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);

  let filtered = catalog.filter(j => {
    // Keyword match
    const matchesQ = !q ||
      j.title.toLowerCase().includes(q) ||
      (j.issn && j.issn.toLowerCase().includes(q)) ||
      (j.publisher && j.publisher.toLowerCase().includes(q)) ||
      (j.faculty && j.faculty.toLowerCase().includes(q)) ||
      (j.scope && j.scope.toLowerCase().includes(q));

    // Faculty filter
    const matchesFac = faculty === 'ALL' || (j.faculty && j.faculty.toLowerCase().includes(faculty.toLowerCase()));

    // Index filter
    let matchesIdx = true;
    if (index === 'Q1') {
      matchesIdx = j.quartile === 'Q1';
    } else if (index === 'SCOPUS') {
      matchesIdx = (j.index || []).includes('SCOPUS');
    } else if (index === 'WOS') {
      matchesIdx = (j.index || []).includes('WOS');
    } else if (index === 'DOAJ') {
      matchesIdx = (j.index || []).includes('DOAJ');
    } else if (index === 'AJOL') {
      matchesIdx = (j.index || []).includes('AJOL');
    }

    return matchesQ && matchesFac && matchesIdx;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return res.status(200).json({
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
    journals: paginated
  });
}
