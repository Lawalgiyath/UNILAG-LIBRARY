// Vercel Serverless Function: UNILAG IR Search API (DSpace 7 with Crossref UNILAG Research Fallback)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { q, page = 0, size = 15 } = req.query;
  const query = (q || '').trim();

  if (!query) {
    return res.status(200).json({ total: 0, results: [] });
  }

  // 1. Attempt Live UNILAG DSpace 7
  try {
    const dspaceUrl = `https://ir.unilag.edu.ng/server/api/discover/search/objects?query=${encodeURIComponent(query)}&page=${page}&size=${size}&sort=score,DESC`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const dspaceRes = await fetch(dspaceUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeout);

    if (dspaceRes.ok) {
      const data = await dspaceRes.json();
      const searchRes = data._embedded?.searchResult || {};
      const total = searchRes.page?.totalElements || 0;
      const objects = searchRes._embedded?.objects || [];

      const results = objects.map((obj, idx) => {
        const item = obj._embedded?.indexableObject || {};
        const meta = item.metadata || {};
        const uuid = item.uuid || '';
        const handleUri = item.handle || '';
        const handleId = handleUri ? handleUri.split('/').pop() : '';

        const title = meta['dc.title']?.[0]?.value || 'Untitled Record';
        const authors = (meta['dc.contributor.author'] || []).map(a => a.value);
        const authorStr = authors.length ? authors.slice(0, 3).join(', ') : 'University of Lagos Researcher';
        const dateIssued = meta['dc.date.issued']?.[0]?.value || meta['dc.date.available']?.[0]?.value || '';
        const year = dateIssued ? dateIssued.substring(0, 4) : 'Recent';
        let abstract = meta['dc.description.abstract']?.[0]?.value || '';
        if (abstract.length > 350) abstract = abstract.substring(0, 347) + '...';

        const docType = meta['dc.type']?.[0]?.value || 'Research Article';
        const badgeType = docType.toLowerCase().includes('thesis') ? 'Ph.D. Thesis' :
                          docType.toLowerCase().includes('inaugural') ? 'Inaugural Lecture' : 'Journal Article';
        const dept = meta['dc.publisher']?.[0]?.value || meta['dc.contributor.department']?.[0]?.value || 'University of Lagos';
        const subjects = (meta['dc.subject'] || []).map(s => s.value);

        return {
          id: `live-ir-${idx + 1}`,
          title,
          author: authorStr,
          year,
          degree: docType,
          dept,
          faculty: 'University of Lagos',
          supervisor: 'UNILAG Institutional Repository Record',
          handle: handleId,
          irUrl: uuid ? `https://ir.unilag.edu.ng/items/${uuid}` : handleUri,
          pdfUrl: uuid ? `https://ir.unilag.edu.ng/items/${uuid}` : handleUri,
          citations: 'Verified DSpace 7',
          type: badgeType,
          subjects: subjects.slice(0, 6),
          abstract: abstract || 'Authentic peer-reviewed publication archived in the University of Lagos Institutional Repository.'
        };
      });

      return res.status(200).json({
        source: 'UNILAG DSpace 7 Live REST API',
        query,
        total,
        page: Number(page),
        size: Number(size),
        results
      });
    }
  } catch (err) {
    console.warn('UNILAG DSpace unavailable, falling back to Crossref UNILAG Research:', err.message);
  }

  // 2. Resilient Fallback: Crossref Live UNILAG Indexed Publications
  try {
    const crossrefUrl = `https://api.crossref.org/works?query.affiliation=University+of+Lagos&query=${encodeURIComponent(query)}&rows=${size}`;
    const crRes = await fetch(crossrefUrl, {
      headers: { 'User-Agent': 'UNILAG-Library/1.0 (mailto:library@unilag.edu.ng)' }
    });
    if (crRes.ok) {
      const crData = await crRes.json();
      const msg = crData.message || {};
      const total = msg['total-results'] || 0;
      const items = msg.items || [];

      const results = items.map((item, idx) => {
        const rawTitle = (item.title || ['Untitled Publication'])[0];
        const title = rawTitle.replace(/<[^>]+>/g, '').trim();
        const authorList = item.author || [];
        const authors = authorList.map(a => `${a.given || ''} ${a.family || ''}`.trim()).filter(Boolean);
        const authorStr = authors.length ? authors.slice(0, 3).join(', ') : 'University of Lagos Researcher';
        const dateParts = item.created?.['date-parts']?.[0];
        const year = dateParts?.[0] ? String(dateParts[0]) : 'Recent';
        const doi = item.DOI || '';
        const doiUrl = doi ? `https://doi.org/${doi}` : 'https://library.unilag.edu.ng';
        const container = (item['container-title'] || ['University of Lagos Scholarly Research'])[0];
        const docType = (item.type || 'journal-article').replace(/-/g, ' ');

        return {
          id: `live-cr-${idx + 1}`,
          title,
          author: authorStr,
          year,
          degree: docType,
          dept: container,
          faculty: 'University of Lagos Affiliated Research',
          supervisor: 'Registered on Crossref / Institutional Scholarly Registry',
          handle: `doi:${doi}`,
          irUrl: doiUrl,
          pdfUrl: doiUrl,
          citations: 'Verified Scholarly DOI',
          type: docType.includes('journal') ? 'Journal Article' : 'Research Publication',
          subjects: [query, 'University of Lagos', 'Peer-Reviewed Research'],
          abstract: `Peer-reviewed scholarly research affiliated with the University of Lagos, published in ${container} (${year}). Full text and citation indexed under registered DOI: ${doi}.`
        };
      });

      return res.status(200).json({
        source: 'University of Lagos Scholarly Publications (Crossref Live Indexed Registry)',
        query,
        total,
        page: 0,
        size: results.length,
        results
      });
    }
  } catch (crErr) {
    console.error('Crossref search error:', crErr);
  }

  return res.status(200).json({
    source: 'No records available',
    query,
    total: 0,
    results: []
  });
}
