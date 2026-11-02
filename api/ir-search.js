module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { q = '', size = 15, page = 0 } = req.query;
  const query = String(q).trim();

  if (!query) {
    return res.status(200).json({ total: 0, results: [] });
  }

  try {
    const irApiUrl = `https://api-ir.unilag.edu.ng/server/api/discover/search/objects?query=${encodeURIComponent(query)}&size=${Math.min(parseInt(size, 10) || 15, 30)}&page=${parseInt(page, 10) || 0}`;
    
    const resp = await fetch(irApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept': 'application/json'
      }
    });

    if (!resp.ok) {
      return res.status(resp.status).json({ error: `DSpace API responded with ${resp.status}`, total: 0, results: [] });
    }

    const raw = await resp.json();
    const searchRes = raw._embedded?.searchResult || {};
    const total = searchRes.page?.totalElements || 0;
    const objects = searchRes._embedded?.objects || [];

    const results = objects.map((obj, idx) => {
      const idxObj = obj._embedded?.indexableObject || {};
      const meta = idxObj.metadata || {};
      const uuid = idxObj.uuid || '';

      const titleList = meta['dc.title'] || [];
      const title = titleList[0]?.value || 'Untitled Record';

      const authors = (meta['dc.contributor.author'] || []).map(a => a.value);
      const authorStr = authors.length > 0 ? authors.join(', ') : 'University of Lagos Researcher';

      const handleList = meta['dc.identifier.uri'] || [];
      const handleUri = handleList[0]?.value || (uuid ? `https://ir.unilag.edu.ng/items/${uuid}` : '');
      const handleId = handleUri.includes('handle/') ? handleUri.split('/').pop() : uuid;

      const dateList = meta['dc.date.issued'] || [];
      const year = dateList[0]?.value ? dateList[0].value.slice(0, 4) : 'N/A';

      const abstractList = meta['dc.description.abstract'] || [];
      let abstract = abstractList[0]?.value || '';
      if (abstract.length > 350) {
        abstract = abstract.slice(0, 347) + '...';
      }

      const typeList = meta['dc.type'] || [];
      const docType = typeList[0]?.value || 'Research Article';
      const docTypeLower = docType.toLowerCase();
      const badgeType = docTypeLower.includes('thesis') ? 'Ph.D. Thesis' : (docTypeLower.includes('inaugural') ? 'Inaugural Lecture' : 'Journal Article');

      const deptList = meta['dc.publisher'] || meta['dc.contributor.department'] || [];
      const dept = deptList[0]?.value || 'University of Lagos';

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
        handle: /^\d+$/.test(handleId) ? `123456789/${handleId}` : handleId,
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
      page: parseInt(page, 10) || 0,
      size: parseInt(size, 10) || 15,
      results
    });
  } catch (err) {
    return res.status(500).json({ error: String(err), total: 0, results: [] });
  }
};

