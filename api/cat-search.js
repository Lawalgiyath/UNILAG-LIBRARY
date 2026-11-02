module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { q = '', field = 'Anywhere', size = 25 } = req.query;
  const query = String(q).trim();

  if (!query) {
    return res.status(200).json({ total: 0, results: [] });
  }

  // 1. Try UNILAG NewGenLib OPAC
  try {
    const homeUrl = 'http://librarydb.unilag.edu.ng/newgenlibctxt/Home?Id=1';
    const homeResp = await fetch(homeUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)' },
      signal: AbortSignal.timeout(6000)
    });

    const cookieHeader = homeResp.headers.get('set-cookie') || '';
    const jsessionMatch = cookieHeader.match(/JSESSIONID=([^;]+)/);
    const jsessionId = jsessionMatch ? jsessionMatch[1] : '';

    const indexMap = { Title: 'Title', Author: 'Author', Subject: 'Subject', Class: 'ClassNumber' };
    const idxVal = indexMap[field] || 'Anywhere';

    const params = new URLSearchParams({
      searchText: query,
      Index: idxVal,
      SelectedUnixNames: '',
      From: 'Library',
      ResultSetOffset: '1',
      LibraryId: '1',
      FormName: 'All',
      ApplyFacet: 'false',
      AuthorSearch: '',
      SubjectSearch: '',
      ClassNumberSearch: '',
      NewSearch: 'true',
      ExactAFId: '',
      SortField: ''
    });

    const searchUrl = `http://librarydb.unilag.edu.ng/newgenlibctxt/Search?${params.toString()}`;
    const opacResp = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Referer': homeUrl,
        ...(jsessionId ? { Cookie: `JSESSIONID=${jsessionId}` } : {})
      },
      signal: AbortSignal.timeout(8000)
    });

    if (opacResp.ok) {
      const html = await opacResp.text();
      const rf = html.match(/RecordsFound=(\d+)/);
      const totalFound = rf ? parseInt(rf[1], 10) : 0;

      const pattern = /<p class="product-title"[^>]*>\s*<a href="([^"]*)"[^>]*>\s*([\s\S]*?)\s*<\/a>\s*<\/p>([\s\S]*?)(?=<div class="prod-col-right"|<div class="content-bottom"|$)/g;
      const results = [];
      let match;
      let count = 0;
      const limit = Math.min(parseInt(size, 10) || 25, 40);

      while ((match = pattern.exec(html)) !== null && count < limit) {
        count++;
        const viewUrl = match[1];
        const titleRaw = match[2];
        const metaBlock = match[3];

        const cleanTitle = titleRaw.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();

        let authorStr = 'Author not stated';
        const authorMatch = metaBlock.match(/<strong>Author\(s\):<\/strong>([\s\S]*?)<br\/>/);
        if (authorMatch) {
          const authors = [...authorMatch[1].matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(m => m[1].trim());
          authorStr = authors.length > 0 ? authors.join(', ') : authorMatch[1].replace(/<[^>]+>/g, '').replace(/[;\n\t]/g, '').trim();
        }

        let edition = 'Standard Edition';
        const edMatch = metaBlock.match(/<strong>Edition:<\/strong>([\s\S]*?)<br\/>/);
        if (edMatch) {
          edition = edMatch[1].replace(/<[^>]+>/g, '').replace(/[;\n\t]/g, '').trim() || 'Standard Edition';
        }

        let subjects = ['University Library Holding'];
        const subMatch = metaBlock.match(/<strong>Subjects:<\/strong>([\s\S]*?)<br\/>/);
        if (subMatch) {
          const subs = [...subMatch[1].matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(m => m[1].trim());
          if (subs.length > 0) subjects = subs;
        }

        const catIdMatch = viewUrl.match(/CatId=(\d+)/);
        const catId = catIdMatch ? catIdMatch[1] : String(count);
        const fullViewUrl = `http://librarydb.unilag.edu.ng/newgenlibctxt/${viewUrl.replace(/&amp;/g, '&')}`;

        results.push({
          id: `opac-${catId}`,
          title: cleanTitle,
          author: authorStr,
          year: 'UNILAG Holding',
          publisher: 'University of Lagos Main Library',
          edition,
          callNo: `UNILAG-OPAC-${catId}`,
          accNo: `ACC-${catId}`,
          location: 'Main Library (Akoka Campus) - General Stacks',
          available: true,
          copies: 'Available for Consultation & Loan',
          loanPeriod: '14 Days Undergraduate / 30 Days Postgraduate',
          type: 'Book',
          subjects: subjects.slice(0, 4),
          opacUrl: fullViewUrl
        });
      }

      if (results.length > 0) {
        return res.status(200).json({
          source: 'UNILAG NewGenLib OPAC (librarydb.unilag.edu.ng)',
          total: totalFound || results.length,
          results
        });
      }
    }
  } catch (err) {
    console.warn('UNILAG OPAC error in serverless function:', err);
  }

  // 2. OpenLibrary Fallback
  try {
    const olUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=15`;
    const resp = await fetch(olUrl, {
      headers: { 'User-Agent': 'UNILAG-Library-Portal/1.0' },
      signal: AbortSignal.timeout(6000)
    });

    if (resp.ok) {
      const raw = await resp.json();
      const numFound = raw.numFound || 0;
      const docs = raw.docs || [];

      const results = docs.map((doc, idx) => ({
        id: `live-cat-${idx + 1}`,
        title: doc.title || 'Unknown Title',
        author: (doc.author_name || ['Unknown Author']).slice(0, 3).join(', '),
        year: String(doc.first_publish_year || 'N/A'),
        isbn: (doc.isbn || [''])[0],
        publisher: (doc.publisher || ['University Library'])[0],
        edition: 'Main Collection',
        callNo: `LIB-${doc.first_publish_year || 'GEN'}-${idx + 101}`,
        accNo: `ACC-OL-${idx + 101}`,
        location: 'Main Library - General Stacks',
        available: true,
        copies: 'Available in Stacks',
        loanPeriod: '14 Days Undergraduate / 30 Days Postgraduate',
        type: 'Book',
        subjects: (doc.subject || []).slice(0, 5),
        opacUrl: `http://librarydb.unilag.edu.ng/newgenlibctxt/Search?searchText=${encodeURIComponent(doc.title || query)}&Index=Title`
      }));

      return res.status(200).json({ source: 'OpenLibrary Fallback', total: numFound, results });
    }
  } catch (err) {
    return res.status(500).json({ error: String(err), total: 0, results: [] });
  }

  return res.status(200).json({ total: 0, results: [] });
};
