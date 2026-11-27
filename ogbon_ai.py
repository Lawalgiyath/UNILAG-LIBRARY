# -*- coding: utf-8 -*-
"""
Ogbon (University of Lagos Library Agentic AI Engine)
Python 3.6.9+ stdlib-only implementation with live tool orchestration:
  - UNILAG Library Institutional Knowledge Base (FAQ, policies, spaces, databases)
  - Accredited Publishing Advisor (8,000+ Scopus, WoS & AJOL journals)
  - UNILAG OPAC & Institutional Repository / Crossref search
  - Live Internet Academic Search via OpenAlex API
  - Live Concept Reference via Wikipedia API
  - Optional Cloud LLM synthesis (GEMINI_API_KEY / OPENAI_API_KEY) with rich deterministic fallback
"""

import concurrent.futures
import datetime
import html
import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
CONFIG_FILE = os.path.join(DATA_DIR, 'ogbon_config.json')
JOURNALS_FILE = os.path.join(DATA_DIR, 'accredited_journals_catalog.json')

USER_AGENT = 'UNILAG-Library-Ogbon/1.0 (https://library.unilag.edu.ng; mailto:library@unilag.edu.ng)'

# Institutional Knowledge Base for University of Lagos Main Library & Branches
KNOWLEDGE_BASE = [
    {
        'id': 'hours_access',
        'title': 'Opening Hours & Library Access Policy',
        'category': 'Hours & Access',
        'url': 'services.html',
        'keywords': [
            'hour', 'hours', 'open', 'opening', 'close', 'closing', 'time', 'schedule',
            'weekend', 'saturday', 'sunday', '24', 'reading room', 'access', 'id card',
            'admittance', 'register', 'registration', 'visitor', 'holiday'
        ],
        'content': (
            'UNILAG Main Library (Akoka) opening hours: Monday to Friday, 8:00 AM - 9:00 PM; '
            'Saturday, 9:00 AM - 5:00 PM; closed on Sundays and Public Holidays. '
            'The 24-Hour Reading Room remains open round the clock (including examination periods). '
            'Faculty and College Libraries generally operate Monday to Friday, 8:00 AM - 4:00 PM. '
            'Entry requires a valid UNILAG Student/Staff ID Card or an official Library Admittance Card '
            'issued after library registration at Readers Services.'
        )
    },
    {
        'id': 'borrowing_fines',
        'title': 'Borrowing Privileges, Loan Periods & Overdue Fines',
        'category': 'Borrowing & Circulation',
        'url': 'help.html#faqs',
        'keywords': [
            'borrow', 'borrowing', 'loan', 'renew', 'renewal', 'fine', 'fines', 'overdue',
            'return', 'book', 'books', 'limit', 'privilege', 'undergraduate', 'postgraduate',
            'staff', 'lost', 'reserve', 'short loan', 'circulation'
        ],
        'content': (
            'Borrowing limits by patron category: Undergraduate students may borrow up to 4 books '
            'for 14 days (2 weeks). Postgraduate students, Academic Staff, and Senior Administrative Staff '
            'may borrow up to 10 books for 28 days (4 weeks). Reserved / Short-Loan texts are restricted '
            'to in-library use or 2-hour/overnight loan. Overdue fines: N20 per day for regular books, '
            'N50 per hour/day for reserved books. Lost books attract a N1,000 processing fee plus full '
            'replacement cost of the current edition. One renewal is permitted if no other patron has placed a hold.'
        )
    },
    {
        'id': 'multimedia_studio',
        'title': 'Multimedia Studio (3rd Floor, Main Library)',
        'category': 'Spaces & Facilities',
        'url': 'services.html',
        'keywords': [
            'studio', 'multimedia', 'podcast', 'video', 'recording', 'audio', 'voiceover',
            'camera', 'green screen', 'edit', 'editing', '3rd floor', 'third floor', 'booking',
            'reserve studio', 'book studio', 'january 2026'
        ],
        'content': (
            'Located on the 3rd Floor of the Main Library and commissioned on January 19, 2026, '
            'the UNILAG Library Multimedia Studio provides acoustic podcasting booths, 4K video lecture '
            'recording, green screen backdrops, studio lighting, and post-production editing workstations. '
            'UNILAG students, researchers, and faculty can request studio sessions through the Services '
            '& Modern Spaces reservation portal (services.html). Bookings require valid UNILAG credentials '
            'and adherence to academic content guidelines.'
        )
    },
    {
        'id': 'learning_commons_makerspace',
        'title': 'Learning Commons, Makerspace & Study Spaces',
        'category': 'Spaces & Facilities',
        'url': 'services.html',
        'keywords': [
            'space', 'spaces', 'commons', 'learning commons', 'makerspace', '3d print',
            'prototype', 'arduino', 'group study', 'discussion', 'pod', 'wifi', 'power',
            'ground floor', '1st floor', 'first floor', 'postgraduate commons', 'seat', 'booking'
        ],
        'content': (
            'The Learning Commons on the Ground Floor offers collaborative discussion pods, '
            'ergonomic seating, high-speed campus Wi-Fi, and reliable power outlets for group work. '
            'The Library Makerspace on the 1st Floor provides 3D printing, electronics prototyping kits, '
            'and design stations for STEM and interdisciplinary innovation. Dedicated Quiet Reading Halls '
            'and the Postgraduate Research Commons are also reservable via services.html.'
        )
    },
    {
        'id': 'departments_gandhi',
        'title': 'Library Departments & Gandhi Memorial Research Library',
        'category': 'About & Collections',
        'url': 'departments.html',
        'keywords': [
            'department', 'departments', 'division', 'gandhi', 'africana', 'rare book',
            'theses', 'thesis', 'dissertation', 'archive', 'collection development',
            'technical services', 'readers services', 'systems', 'digital services', '1968'
        ],
        'content': (
            'The University Library operates four core divisions: Collection Development, Technical Services, '
            'Readers Services, and Systems & Digital Services. The Gandhi Memorial Research Library '
            '(opened October 2, 1968; see archives.html) houses Africana collections, rare books, UNILAG '
            'theses and dissertations, government publications, and special archival manuscripts for '
            'postgraduate and faculty researchers.'
        )
    },
    {
        'id': 'faculties_museum',
        'title': '19 Faculty Libraries & UNILAG Library Museum',
        'category': 'Branches & Heritage',
        'url': 'libraries.html',
        'keywords': [
            'faculty', 'faculties', 'branch', 'branches', 'college of medicine', 'idi-araba',
            'law library', 'engineering', 'education', 'science', 'museum', 'artefact', 'artefacts',
            'heritage', '123', 'pharmacy', 'environmental', 'management sciences'
        ],
        'content': (
            'Beyond the Main Library at Akoka, UNILAG Library coordinates 19 Faculty and College Libraries '
            '(libraries.html), including Law, Engineering, Education, Science, Social Sciences, Arts, '
            'Management Sciences, Environmental Sciences, Pharmacy, Dental Sciences, Basic Medical Sciences, '
            'and Clinical Sciences (College of Medicine, Idi-Araba). The UNILAG Library Museum (museum.html) '
            'curates over 123 historical, cultural, and institutional artefacts.'
        )
    },
    {
        'id': 'eresources_iglibrary',
        'title': 'Subscribed E-Resources, Databases & iGLibrary Remote Access',
        'category': 'E-Resources & Databases',
        'url': 'databases.html',
        'keywords': [
            'database', 'databases', 'eresource', 'e-resources', 'scopus', 'sciencedirect',
            'jstor', 'ebsco', 'proquest', 'research4life', 'hinari', 'agora', 'heinonline',
            'lexisnexis', 'ieee', 'springer', 'wiley', 'emerald', 'iglibrary', 'remote',
            'off campus', 'off-campus', 'login', 'password', 'ebook', 'oer', 'ajol', 'doaj'
        ],
        'content': (
            'UNILAG provides access to 15+ major scholarly databases (databases.html): Scopus, ScienceDirect, '
            'JSTOR, EBSCOhost, ProQuest, Research4Life (HINARI, AGORA, OARE, ARDI, GOALI), HeinOnline, '
            'LexisNexis, IEEE Xplore, Emerald Insight, SpringerLink, Wiley Online Library, Taylor & Francis, '
            'AJOL, and DOAJ. iGLibrary e-books can be accessed on campus or remotely via institutional credentials '
            'provided by the Systems & Digital Services Unit (help.html or library@unilag.edu.ng).'
        )
    },
    {
        'id': 'publishing_turnitin',
        'title': 'Where to Publish, Accredited Journals & Turnitin Plagiarism Check',
        'category': 'Research & Publishing',
        'url': 'journals-accredited.html',
        'keywords': [
            'publish', 'publishing', 'accredited', 'turnitin', 'plagiarism', 'similarity',
            'orcid', 'scopus journal', 'ajol journal', 'predatory', 'impact factor', 'citescore',
            'quartile', 'affiliation', 'research ethics'
        ],
        'content': (
            'The Where to Publish directory (journals-accredited.html) helps UNILAG scholars discover over '
            '8,000 accredited journals indexed in Scopus, Web of Science, and AJOL by title, ISSN, faculty, '
            'discipline, Quartile (Q1-Q4), CiteScore, and JIF. For academic integrity, Turnitin similarity '
            'checks are coordinated through Postgraduate School and Library Research Support (help.html#research). '
            'Always list affiliation consistently as "University of Lagos, Akoka, Lagos, Nigeria".'
        )
    },
    {
        'id': 'contact_support',
        'title': 'Contacting Librarians, Research Consultation & Library Desk',
        'category': 'Help & Contact',
        'url': 'contact.html',
        'keywords': [
            'contact', 'email', 'librarian', 'ask a librarian', 'help', 'support', 'location',
            'address', 'akoka', 'yaba', 'consultation', 'literature search', 'reference'
        ],
        'content': (
            'Main Library address: University of Lagos Main Library, Akoka, Yaba, Lagos, Nigeria. '
            'Official email: library@unilag.edu.ng. Patrons can submit reference queries, schedule '
            '1-on-1 literature search consultations, or report access issues using Help & FAQs (help.html) '
            'or the Contact form (contact.html).'
        )
    }
]


_LOCAL_CATALOG_CACHE = None


def _get_local_journal_catalog():
    global _LOCAL_CATALOG_CACHE
    if _LOCAL_CATALOG_CACHE is not None:
        return _LOCAL_CATALOG_CACHE
    try:
        with open(JOURNALS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if not isinstance(data, list):
            data = []
    except Exception:
        data = []
    for item in data:
        if '_search_blob' not in item:
            idx_val = item.get('index', [])
            idx_str = ' '.join(idx_val) if isinstance(idx_val, list) else str(idx_val)
            item['_title_lc'] = str(item.get('title', '')).lower()
            item['_fac_lc'] = str(item.get('faculty', '')).lower()
            item['_search_blob'] = ' '.join([
                str(item.get('title', '')),
                str(item.get('issn', '')),
                str(item.get('publisher', '')),
                str(item.get('discipline', '')),
                str(item.get('scope', '')),
                str(item.get('faculty', '')),
                str(item.get('quartile', '')),
                idx_str
            ]).lower()
    _LOCAL_CATALOG_CACHE = data
    return _LOCAL_CATALOG_CACHE


def _http_get_json(url, timeout=8, headers=None):
    hdrs = {'User-Agent': USER_AGENT, 'Accept': 'application/json'}
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(url, headers=hdrs)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read().decode('utf-8', errors='replace')
    return json.loads(raw)


def _http_post_json(url, payload, timeout=18, headers=None):
    hdrs = {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
    }
    if headers:
        hdrs.update(headers)
    body = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers=hdrs, method='POST')
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read().decode('utf-8', errors='replace')
    return json.loads(raw)


def _tokenize(text):
    return [t for t in re.findall(r'[a-z0-9\-]{2,}', (text or '').lower())
            if t not in ('the', 'and', 'for', 'with', 'that', 'this', 'from', 'what', 'how',
                         'where', 'when', 'why', 'can', 'does', 'are', 'about', 'into', 'your',
                         'unilag', 'library', 'please', 'tell', 'give', 'need', 'want', 'find')]


def tool_library_faq(query, limit=4):
    """Search institutional UNILAG Library FAQ & policy knowledge base."""
    qlc = (query or '').lower()
    tokens = _tokenize(query)
    scored = []
    for entry in KNOWLEDGE_BASE:
        score = 0
        title_lc = entry['title'].lower()
        body_lc = entry['content'].lower()
        kw_list = entry['keywords']
        for kw in kw_list:
            if kw in qlc:
                score += 12 if ' ' in kw else 8
        for tok in tokens:
            if tok in title_lc:
                score += 6
            if any(tok == k or tok in k for k in kw_list):
                score += 5
            if tok in body_lc:
                score += 2
        if score > 0:
            scored.append((score, entry))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in scored[:limit]]


def tool_search_accredited_journals(query, catalog_loader=None, faculty=None, limit=8):
    """Search UNILAG-accredited Scopus, WoS & AJOL journals catalog."""
    catalog = catalog_loader() if catalog_loader else _get_local_journal_catalog()
    if not catalog:
        return []

    tokens = _tokenize(query)
    # Remove common publishing stop-words so subject tokens stand out
    pub_stop = set(['publish', 'publishing', 'journal', 'journals', 'paper', 'manuscript',
                    'article', 'scopus', 'ajol', 'accredited', 'where', 'best', 'good',
                    'high', 'impact', 'quartile', 'submit', 'research'])
    subject_tokens = [t for t in tokens if t not in pub_stop]
    if not subject_tokens:
        subject_tokens = tokens

    qlc = ' '.join(subject_tokens)
    fac_lc = (faculty or '').strip().lower()

    results = []
    for j in catalog:
        if fac_lc and fac_lc not in j.get('_fac_lc', str(j.get('faculty', '')).lower()):
            continue
        blob = j.get('_search_blob', '')
        title_lc = j.get('_title_lc', str(j.get('title', '')).lower())
        if subject_tokens:
            matched = sum(1 for t in subject_tokens if t in blob)
            if matched == 0:
                continue
            score = matched * 10
            if qlc and qlc in title_lc:
                score += 25
            for t in subject_tokens:
                if t in title_lc:
                    score += 8
        else:
            score = 1
        # Boost higher quartile & Scopus/CiteScore slightly
        q = str(j.get('quartile', '')).upper()
        if q == 'Q1':
            score += 4
        elif q == 'Q2':
            score += 2
        cs = j.get('citescore')
        try:
            cs_val = float(cs) if cs is not None else 0.0
        except Exception:
            cs_val = 0.0
        results.append((score, cs_val, j))

    results.sort(key=lambda x: (x[0], x[1]), reverse=True)
    out = []
    for _, _, j in results[:limit]:
        out.append({
            'title': j.get('title', ''),
            'issn': j.get('issn', ''),
            'publisher': j.get('publisher', ''),
            'index': j.get('index', []),
            'quartile': j.get('quartile', ''),
            'citescore': j.get('citescore'),
            'jif': j.get('jif'),
            'openAccess': bool(j.get('openAccess')),
            'faculty': j.get('faculty', ''),
            'discipline': j.get('discipline', ''),
            'scope': j.get('scope', ''),
            'url': j.get('url', '')
        })
    return out


def _reconstruct_openalex_abstract(inv_idx):
    if not inv_idx or not isinstance(inv_idx, dict):
        return ''
    pos_words = []
    for word, positions in inv_idx.items():
        if not isinstance(positions, list):
            continue
        for pos in positions:
            if pos < 120:
                pos_words.append((pos, word))
    if not pos_words:
        return ''
    pos_words.sort(key=lambda x: x[0])
    text = ' '.join(w for _, w in pos_words)
    return (text[:420] + '...') if len(text) > 420 else text


def tool_search_openalex(query, limit=5):
    """Live internet scholarly literature search via OpenAlex API."""
    clean_q = re.sub(r'\s+', ' ', (query or '').strip())
    if not clean_q:
        return []
    url = 'https://api.openalex.org/works?search={0}&per-page={1}&sort=relevance_score:desc'.format(
        urllib.parse.quote(clean_q), int(limit)
    )
    try:
        data = _http_get_json(url, timeout=8)
    except Exception:
        return []

    works = []
    for w in data.get('results', [])[:limit]:
        authors = []
        for a in (w.get('authorships') or [])[:3]:
            name = (a.get('author') or {}).get('display_name')
            if name:
                authors.append(name)
        if len(w.get('authorships') or []) > 3:
            authors.append('et al.')
        source_obj = ((w.get('primary_location') or {}).get('source') or {})
        venue = source_obj.get('display_name') or ''
        doi = w.get('doi') or ''
        oa_url = ((w.get('open_access') or {}).get('oa_url')) or ((w.get('primary_location') or {}).get('landing_page_url')) or doi
        abstract = _reconstruct_openalex_abstract(w.get('abstract_inverted_index'))
        works.append({
            'title': w.get('display_name') or w.get('title') or 'Untitled Work',
            'authors': ', '.join(authors) if authors else 'Unknown Author',
            'year': w.get('publication_year') or '',
            'venue': venue,
            'cited_by': w.get('cited_by_count') or 0,
            'doi': doi,
            'url': oa_url or doi,
            'is_oa': bool((w.get('open_access') or {}).get('is_oa')),
            'abstract': abstract
        })
    return works


def tool_search_wikipedia(query, limit=2):
    """Live internet encyclopedia concept grounding via Wikipedia API."""
    clean_q = re.sub(r'\s+', ' ', (query or '').strip())
    if not clean_q:
        return []
    search_url = (
        'https://en.wikipedia.org/w/api.php?action=query&list=search'
        '&srsearch={0}&srlimit={1}&format=json&utf8=1'
    ).format(urllib.parse.quote(clean_q), int(limit))
    try:
        sdata = _http_get_json(search_url, timeout=6)
    except Exception:
        return []

    hits = (sdata.get('query') or {}).get('search', [])[:limit]
    if not hits:
        return []

    titles = [h.get('title', '') for h in hits if h.get('title')]
    if not titles:
        return []

    extract_url = (
        'https://en.wikipedia.org/w/api.php?action=query&prop=extracts|info'
        '&exintro=1&explaintext=1&inprop=url&titles={0}&format=json&utf8=1'
    ).format(urllib.parse.quote('|'.join(titles)))
    pages_by_title = {}
    try:
        edata = _http_get_json(extract_url, timeout=6)
        for _, p in ((edata.get('query') or {}).get('pages') or {}).items():
            if p.get('title'):
                pages_by_title[p['title']] = p
    except Exception:
        pass

    results = []
    for h in hits:
        title = h.get('title', '')
        page = pages_by_title.get(title, {})
        extract = (page.get('extract') or '').strip()
        if not extract:
            snippet = re.sub(r'<[^>]+>', '', h.get('snippet', ''))
            extract = html.unescape(snippet)
        if len(extract) > 650:
            extract = extract[:647].rstrip() + '...'
        url = page.get('fullurl') or ('https://en.wikipedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')))
        results.append({
            'title': title,
            'extract': extract,
            'url': url
        })
    return results


def tool_search_opac_and_ir(query, opac_fn=None, ir_fn=None, limit=5):
    """Query UNILAG OPAC physical/ebook catalog and UNILAG Institutional Repository."""
    opac_items = []
    ir_items = []
    clean_q = (query or '').strip()
    if not clean_q:
        return {'opac': [], 'ir': []}

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        fut_opac = pool.submit(opac_fn, clean_q, 'Anywhere', limit) if opac_fn else None
        fut_ir = pool.submit(ir_fn, clean_q, limit) if ir_fn else None
        if fut_opac:
            try:
                res = fut_opac.result(timeout=7)
                if isinstance(res, dict):
                    opac_items = (res.get('results') or [])[:limit]
            except Exception:
                opac_items = []
        if fut_ir:
            try:
                res = fut_ir.result(timeout=7)
                if isinstance(res, dict):
                    ir_items = (res.get('results') or [])[:limit]
            except Exception:
                ir_items = []
    return {'opac': opac_items, 'ir': ir_items}


def _classify_intent(query, requested_mode='auto'):
    mode = (requested_mode or 'auto').strip().lower()
    if mode in ('study', 'publish', 'faq'):
        return mode

    qlc = (query or '').lower()
    faq_kw = (
        'hour', 'open', 'close', 'fine', 'borrow', 'loan', 'renew', 'card', 'id ',
        'studio', 'multimedia', 'makerspace', 'learning commons', 'gandhi', 'museum',
        'turnitin', 'database', 'iglibrary', 'remote', 'off-campus', 'off campus',
        'access', 'login', 'password', 'contact', 'email', 'floor', '24-hour',
        '24 hour', 'faculty librar', 'rule', 'policy', 'admittance'
    )
    pub_kw = (
        'where to publish', 'publish', 'publishing', 'journal', 'journals', 'ajol',
        'quartile', 'q1', 'q2', 'citescore', 'impact factor', 'jif', 'issn',
        'accredited', 'manuscript', 'submit paper', 'predatory', 'scopus journal'
    )
    study_kw = (
        'study', 'explain', 'what is', 'how does', 'how do', 'define', 'summarize',
        'summary', 'compare', 'quiz', 'exam', 'revision', 'concept', 'theory',
        'literature review', 'research on', 'articles on', 'papers on', 'mechanism',
        'analysis', 'thesis', 'history of', 'advantages', 'disadvantages'
    )

    faq_score = sum(1 for k in faq_kw if k in qlc)
    pub_score = sum(1 for k in pub_kw if k in qlc)
    study_score = sum(1 for k in study_kw if k in qlc)

    if pub_score > max(faq_score, study_score) and pub_score > 0:
        return 'publish'
    if faq_score > study_score and faq_score > 0:
        return 'faq'
    if study_score > 0:
        return 'study'
    return 'auto'


def _load_llm_config():
    """Check environment variables or data/ogbon_config.json for optional LLM API keys."""
    cfg = {}
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                loaded = json.load(f)
            if isinstance(loaded, dict):
                cfg = loaded
        except Exception:
            cfg = {}
    gemini_key = os.environ.get('GEMINI_API_KEY') or cfg.get('gemini_api_key', '')
    openai_key = os.environ.get('OPENAI_API_KEY') or cfg.get('openai_api_key', '')
    gemini_model = os.environ.get('OGBON_GEMINI_MODEL') or cfg.get('gemini_model', 'gemini-2.0-flash')
    openai_model = os.environ.get('OGBON_OPENAI_MODEL') or cfg.get('openai_model', 'gpt-4o-mini')
    return {
        'gemini_key': (gemini_key or '').strip(),
        'openai_key': (openai_key or '').strip(),
        'gemini_model': gemini_model,
        'openai_model': openai_model
    }


def _call_optional_llm(query, mode, tool_context, history=None):
    """Optionally synthesize a conversational reply using Gemini or OpenAI if key is configured."""
    cfg = _load_llm_config()
    if not cfg['gemini_key'] and not cfg['openai_key']:
        return None, None

    system_prompt = (
        "You are Ogbon (Agbaye/Yoruba: Wisdom), the official Agentic AI Research, Study & Library "
        "Assistant of the University of Lagos (UNILAG) Library, Akoka, Lagos, Nigeria.\n"
        "Guidelines:\n"
        "1. Rely ONLY on the verified UNILAG knowledge base, journal catalog, OPAC/IR records, OpenAlex "
        "papers, and Wikipedia extracts provided in the TOOL OUTPUTS below. Never invent statistics, DOIs, "
        "library hours, fines, or journal metrics.\n"
        "2. Do not use emojis anywhere.\n"
        "3. Format clearly with Markdown headings, bullet lists, and clickable [title](url) links.\n"
        "4. In 'study' mode, teach the concept step by step, cite peer-reviewed OpenAlex papers + UNILAG holdings, "
        "and end with 3 self-test revision questions.\n"
        "5. In 'publish' mode, rank the verified accredited journals with ISSN, Publisher, Quartile, CiteScore/JIF, "
        "Open Access status, and give actionable manuscript submission guidance.\n"
        "6. In 'faq' mode, answer directly with exact floors, loan limits, fines, hours, and relevant page links."
    )

    hist_lines = []
    if isinstance(history, list):
        for turn in history[-6:]:
            if isinstance(turn, dict) and turn.get('content'):
                role = 'User' if turn.get('role') == 'user' else 'Ogbon'
                hist_lines.append('{0}: {1}'.format(role, str(turn['content'])[:400]))

    user_prompt = (
        "Active Mode: {0}\n"
        "Conversation History:\n{1}\n\n"
        "User Request: {2}\n\n"
        "VERIFIED TOOL OUTPUTS:\n{3}"
    ).format(mode, '\n'.join(hist_lines) if hist_lines else '(none)', query, json.dumps(tool_context, ensure_ascii=False))

    if cfg['gemini_key']:
        url = (
            'https://generativelanguage.googleapis.com/v1beta/models/{0}:generateContent?key={1}'
        ).format(urllib.parse.quote(cfg['gemini_model']), urllib.parse.quote(cfg['gemini_key']))
        payload = {
            'systemInstruction': {'parts': [{'text': system_prompt}]},
            'contents': [{'role': 'user', 'parts': [{'text': user_prompt}]}],
            'generationConfig': {'temperature': 0.35, 'maxOutputTokens': 1400}
        }
        try:
            res = _http_post_json(url, payload, timeout=18)
            candidates = res.get('candidates') or []
            if candidates:
                parts = (candidates[0].get('content') or {}).get('parts') or []
                txt = ''.join(p.get('text', '') for p in parts).strip()
                if txt:
                    return txt, 'gemini:' + cfg['gemini_model']
        except Exception:
            pass

    if cfg['openai_key']:
        url = 'https://api.openai.com/v1/chat/completions'
        payload = {
            'model': cfg['openai_model'],
            'temperature': 0.35,
            'max_tokens': 1400,
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt}
            ]
        }
        try:
            res = _http_post_json(
                url,
                payload,
                timeout=18,
                headers={'Authorization': 'Bearer ' + cfg['openai_key']}
            )
            choices = res.get('choices') or []
            if choices:
                txt = ((choices[0].get('message') or {}).get('content') or '').strip()
                if txt:
                    return txt, 'openai:' + cfg['openai_model']
        except Exception:
            pass

    return None, None


def _build_deterministic_reply(query, mode, ctx):
    """Synthesize a crisp, well-structured Markdown academic response from retrieved tool outputs."""
    faq_hits = ctx.get('faq') or []
    journal_hits = ctx.get('journals') or []
    openalex_hits = ctx.get('openalex') or []
    wiki_hits = ctx.get('wikipedia') or []
    opac_hits = (ctx.get('opac_ir') or {}).get('opac') or []
    ir_hits = (ctx.get('opac_ir') or {}).get('ir') or []

    sections = []

    # 1. FAQ / Policy Section
    if faq_hits and (mode == 'faq' or mode == 'auto'):
        top = faq_hits[0]
        sections.append('### {0}\n{1}\n\n- Reference page: [{0}]({2})'.format(
            top['title'], top['content'], top['url']
        ))
        if len(faq_hits) > 1:
            related = ['[{0}]({1}) — {2}'.format(x['title'], x['url'], x['content'][:160].rstrip() + '...')
                       for x in faq_hits[1:3]]
            sections.append('### Related Library Policies & Services\n' + '\n'.join('- ' + r for r in related))

    # 2. Publishing Advisor Section
    if journal_hits and (mode == 'publish' or (mode == 'auto' and not faq_hits)):
        lines = []
        for idx, j in enumerate(journal_hits[:6], 1):
            metrics = []
            if j.get('quartile'):
                metrics.append(str(j['quartile']))
            if j.get('citescore') is not None:
                metrics.append('CiteScore {0}'.format(j['citescore']))
            if j.get('jif') is not None:
                metrics.append('JIF {0}'.format(j['jif']))
            idx_list = j.get('index') or []
            idx_str = ', '.join(idx_list) if isinstance(idx_list, list) else str(idx_list)
            if idx_str:
                metrics.append(idx_str)
            metrics.append('Open Access' if j.get('openAccess') else 'Subscription / Hybrid')
            title_part = '[{0}]({1})'.format(j['title'], j['url']) if j.get('url') else '**{0}**'.format(j['title'])
            lines.append(
                '{0}. {1} (ISSN: `{2}` | {3}) — {4}. *Faculty:* {5}; *Discipline:* {6}.'.format(
                    idx,
                    title_part,
                    j.get('issn') or 'N/A',
                    j.get('publisher') or 'Publisher N/A',
                    ' | '.join(metrics),
                    j.get('faculty') or 'Multidisciplinary',
                    j.get('discipline') or 'General'
                )
            )
        sections.append('### Recommended UNILAG-Accredited Journals\n' + '\n'.join(lines))
        sections.append(
            '### Publishing Checklist for UNILAG Researchers\n'
            '- Verify journal scope and APC requirements on the publisher page before submission.\n'
            '- Use standard institutional affiliation: `University of Lagos, Akoka, Lagos, Nigeria`.\n'
            '- Run manuscript similarity checks via [Turnitin & Research Support](help.html#research) and explore full filters in [Where to Publish](journals-accredited.html).'
        )

    # 3. Concept Grounding (Wikipedia) for Study & Auto
    if wiki_hits:
        w = wiki_hits[0]
        sections.append('### Concept Overview: {0}\n{1}\n\n- Source: [Wikipedia — {0}]({2})'.format(
            w['title'], w['extract'], w['url']
        ))

    # 4. Live Peer-Reviewed Literature (OpenAlex)
    if openalex_hits:
        paper_lines = []
        for idx, p in enumerate(openalex_hits[:5], 1):
            meta = []
            if p.get('authors'):
                meta.append(p['authors'])
            if p.get('year'):
                meta.append(str(p['year']))
            if p.get('venue'):
                meta.append(p['venue'])
            meta.append('{0} citations'.format(p.get('cited_by', 0)))
            if p.get('is_oa'):
                meta.append('Open Access')
            link = '[{0}]({1})'.format(p['title'], p['url']) if p.get('url') else '**{0}**'.format(p['title'])
            line = '{0}. {1} ({2})'.format(idx, link, '; '.join(meta))
            if p.get('abstract'):
                line += '\n   *Summary:* {0}'.format(p['abstract'][:240].rstrip() + ('...' if len(p['abstract']) > 240 else ''))
            paper_lines.append(line)
        sections.append('### Peer-Reviewed Research (Live OpenAlex Search)\n' + '\n'.join(paper_lines))

    # 5. UNILAG Local Catalog & Institutional Repository
    if opac_hits or ir_hits:
        local_lines = []
        for b in opac_hits[:3]:
            avail = 'Available' if b.get('available') else 'Check status'
            link = '[{0}]({1})'.format(b.get('title', 'Catalog Item'), b.get('opacUrl') or 'search.html')
            local_lines.append('- **OPAC Holding:** {0} — {1} ({2}, Call No: `{3}`, {4})'.format(
                link,
                b.get('author') or 'UNILAG Library',
                b.get('location') or 'Main Library',
                b.get('callNo') or 'See OPAC',
                avail
            ))
        for doc in ir_hits[:3]:
            link = '[{0}]({1})'.format(doc.get('title', 'UNILAG Work'), doc.get('irUrl') or 'search.html')
            local_lines.append('- **UNILAG Research / Crossref:** {0} ({1}, {2})'.format(
                link,
                doc.get('author') or 'UNILAG Researcher',
                doc.get('year') or 'N/A'
            ))
        sections.append('### UNILAG Library Catalog & Institutional Output\n' + '\n'.join(local_lines))

    # 6. Study Companion Questions when in study mode
    if mode == 'study':
        topic = wiki_hits[0]['title'] if wiki_hits else re.sub(r'^(explain|study|what is|summarize|quiz me on)\s+', '', query.strip(), flags=re.I)
        sections.append(
            '### Study Companion: Active Recall Questions\n'
            '1. What core problem or mechanism defines **{0}**, and what assumptions limit its scope?\n'
            '2. Compare the methodology in the top OpenAlex paper above with an alternative approach you have studied in class.\n'
            '3. How could **{0}** be applied to a Nigerian or West African empirical dataset or local case study?'.format(topic or 'this topic')
        )

    if not sections:
        return (
            'I searched the UNILAG Library Knowledge Base, Accredited Journals catalog, UNILAG OPAC, '
            'OpenAlex, and Wikipedia for **"{0}"**, but did not find strong direct matches.\n\n'
            'Try refining your question with:\n'
            '- A specific discipline or manuscript topic (e.g. *renewable energy microgrids*, *Nigerian corporate law*)\n'
            '- A study concept (e.g. *Explain CRISPR-Cas9 mechanism and recent papers*)\n'
            '- A library service query (e.g. *What are the Multimedia Studio booking rules and borrowing limits?*)\n\n'
            'You can also reach a human librarian directly at [Ask a Librarian](ask.html).'
        ).format(query)

    return '\n\n'.join(sections)


def _sanitize_url(url):
    u = (url or '').strip()
    if u.startswith(('https://', 'http://', '/', './')):
        return html.escape(u, quote=True)
    if re.match(r'^[a-zA-Z0-9_\-]+\.html(\?[^\s]*)?(#[^\s]*)?$', u):
        return html.escape(u, quote=True)
    return ''


def _format_inline_md(text):
    escaped = html.escape(text)
    # Links: [label](url)
    def repl_link(m):
        label = m.group(1)
        safe_u = _sanitize_url(html.unescape(m.group(2)))
        if not safe_u:
            return label
        target = ' target="_blank" rel="noopener noreferrer"' if safe_u.startswith('http') else ''
        return '<a href="{0}"{1}>{2}</a>'.format(safe_u, target, label)

    escaped = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', repl_link, escaped)
    escaped = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', escaped)
    escaped = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', escaped)
    escaped = re.sub(r'`([^`]+)`', r'<code>\1</code>', escaped)
    return escaped


def markdown_to_html(md_text):
    """Lightweight safe Markdown -> HTML converter with zero external dependencies."""
    lines = (md_text or '').splitlines()
    out = []
    list_type = None

    def close_list():
        nonlocal list_type
        if list_type:
            out.append('</{0}>'.format(list_type))
            list_type = None

    for raw in lines:
        line = raw.rstrip()
        stripped = line.strip()
        if not stripped:
            close_list()
            continue
        if stripped.startswith('### '):
            close_list()
            out.append('<h4>{0}</h4>'.format(_format_inline_md(stripped[4:])))
        elif stripped.startswith('## '):
            close_list()
            out.append('<h3>{0}</h3>'.format(_format_inline_md(stripped[3:])))
        elif stripped.startswith('# '):
            close_list()
            out.append('<h3>{0}</h3>'.format(_format_inline_md(stripped[2:])))
        elif re.match(r'^[-*]\s+', stripped):
            if list_type != 'ul':
                close_list()
                list_type = 'ul'
                out.append('<ul>')
            item_txt = re.sub(r'^[-*]\s+', '', stripped)
            out.append('<li>{0}</li>'.format(_format_inline_md(item_txt)))
        elif re.match(r'^\d+\.\s+', stripped):
            if list_type != 'ol':
                close_list()
                list_type = 'ol'
                out.append('<ol>')
            item_txt = re.sub(r'^\d+\.\s+', '', stripped)
            out.append('<li>{0}</li>'.format(_format_inline_md(item_txt)))
        else:
            close_list()
            out.append('<p>{0}</p>'.format(_format_inline_md(stripped)))

    close_list()
    return '\n'.join(out)


def _collect_sources(ctx):
    sources = []
    seen = set()

    def add_src(kind, title, url, meta=''):
        key = (kind, title)
        if key in seen or not title:
            return
        seen.add(key)
        sources.append({'type': kind, 'title': title, 'url': url, 'meta': meta})

    for f in (ctx.get('faq') or [])[:3]:
        add_src('UNILAG Policy', f['title'], f['url'], f['category'])
    for j in (ctx.get('journals') or [])[:4]:
        meta_parts = [p for p in [j.get('quartile'), 'ISSN ' + j['issn'] if j.get('issn') else ''] if p]
        add_src('Accredited Journal', j['title'], j.get('url') or 'journals-accredited.html', ' | '.join(meta_parts))
    for p in (ctx.get('openalex') or [])[:4]:
        meta = '{0} ({1})'.format(p.get('year') or 'N/A', '{0} cites'.format(p.get('cited_by', 0)))
        add_src('OpenAlex Paper', p['title'], p.get('url') or '', meta)
    for w in (ctx.get('wikipedia') or [])[:2]:
        add_src('Wikipedia', w['title'], w['url'], 'Concept Reference')
    opac_ir = ctx.get('opac_ir') or {}
    for b in (opac_ir.get('opac') or [])[:3]:
        add_src('UNILAG OPAC', b.get('title', ''), b.get('opacUrl') or 'opac.html', b.get('callNo') or 'Library Book')
    for d in (opac_ir.get('ir') or [])[:3]:
        add_src('UNILAG Research', d.get('title', ''), d.get('irUrl') or 'ir.html', str(d.get('year') or ''))
    return sources


def _suggest_followups(mode, query):
    if mode == 'faq':
        return [
            'How many books can an undergraduate borrow and what are the fines?',
            'How do I book the 3rd-floor Multimedia Studio?',
            'How do I access iGLibrary and Scopus off-campus?'
        ]
    if mode == 'publish':
        return [
            'Filter for Q1 Open Access Scopus journals in my field',
            'What are the Turnitin similarity requirements at UNILAG?',
            'Find recent OpenAlex papers on this topic for literature review'
        ]
    if mode == 'study':
        return [
            'Generate 5 harder exam questions with marking points on this topic',
            'Find accredited Scopus/AJOL journals to publish research on this topic',
            'Check UNILAG Library borrowing rules for reserve textbooks'
        ]
    return [
        'Explain this concept as a study guide with key papers and quiz questions',
        'Where should I publish research on this topic?',
        'What are UNILAG Library hours and Multimedia Studio rules?'
    ]


def get_status():
    cfg = _load_llm_config()
    catalog = _get_local_journal_catalog()
    llm_provider = None
    if cfg['gemini_key']:
        llm_provider = 'gemini:' + cfg['gemini_model']
    elif cfg['openai_key']:
        llm_provider = 'openai:' + cfg['openai_model']
    return {
        'name': 'Ogbon',
        'tagline': 'UNILAG Library Agentic AI (FAQ, Study Companion, Live Web & Publishing Advisor)',
        'status': 'online',
        'llm_synthesis': llm_provider or 'deterministic-agentic-fallback',
        'knowledge_base_entries': len(KNOWLEDGE_BASE),
        'accredited_journals_indexed': len(catalog),
        'tools': [
            'library_faq',
            'accredited_journals',
            'unilag_opac_and_ir',
            'openalex_live_search',
            'wikipedia_live_search'
        ]
    }


def run_agent(query, mode='auto', history=None, faculty=None,
              catalog_loader=None, opac_fn=None, ir_fn=None):
    """
    Execute Ogbon's agentic pipeline:
      1. Intent classification & tool plan selection
      2. Parallel execution of selected live & local tools
      3. LLM synthesis (if configured) or structured deterministic response
    """
    t0 = time.time()
    clean_q = re.sub(r'\s+', ' ', (query or '').strip())
    if not clean_q:
        return {
            'error': 'Please enter a question, study topic, or journal query for Ogbon.'
        }

    resolved_mode = _classify_intent(clean_q, requested_mode=mode)
    ctx = {
        'faq': [],
        'journals': [],
        'openalex': [],
        'wikipedia': [],
        'opac_ir': {'opac': [], 'ir': []}
    }
    tools_used = []

    # Decide tool plan based on resolved_mode & query signals
    run_faq = resolved_mode in ('faq', 'auto')
    run_journals = resolved_mode in ('publish', 'auto')
    run_openalex = resolved_mode in ('study', 'publish', 'auto')
    run_wiki = resolved_mode in ('study', 'auto')
    run_opac = resolved_mode in ('study', 'auto')

    # Keep FAQ tight so simple policy queries stay super fast, while still offering live search in auto/study
    if resolved_mode == 'faq':
        run_journals = False
        run_openalex = False
        run_wiki = False
        run_opac = False

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        futs = {}
        if run_faq:
            futs['faq'] = pool.submit(tool_library_faq, clean_q, 4)
        if run_journals:
            futs['journals'] = pool.submit(tool_search_accredited_journals, clean_q, catalog_loader, faculty, 6)
        if run_openalex:
            futs['openalex'] = pool.submit(tool_search_openalex, clean_q, 5)
        if run_wiki:
            futs['wikipedia'] = pool.submit(tool_search_wikipedia, clean_q, 2)
        if run_opac:
            futs['opac_ir'] = pool.submit(tool_search_opac_and_ir, clean_q, opac_fn, ir_fn, 4)

        for key, fut in futs.items():
            try:
                res = fut.result(timeout=10)
                ctx[key] = res
                if key == 'opac_ir':
                    if res.get('opac') or res.get('ir'):
                        tools_used.append('unilag_opac_and_ir')
                elif res:
                    tools_used.append(key)
            except Exception:
                pass

    # If FAQ mode found nothing in KB, automatically fall back to live web + OPAC
    if resolved_mode == 'faq' and not ctx['faq']:
        resolved_mode = 'auto'
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
            f_oa = pool.submit(tool_search_openalex, clean_q, 4)
            f_wk = pool.submit(tool_search_wikipedia, clean_q, 1)
            f_op = pool.submit(tool_search_opac_and_ir, clean_q, opac_fn, ir_fn, 3)
            try:
                ctx['openalex'] = f_oa.result(timeout=8)
                if ctx['openalex']:
                    tools_used.append('openalex')
            except Exception:
                pass
            try:
                ctx['wikipedia'] = f_wk.result(timeout=6)
                if ctx['wikipedia']:
                    tools_used.append('wikipedia')
            except Exception:
                pass
            try:
                ctx['opac_ir'] = f_op.result(timeout=8)
                if ctx['opac_ir'].get('opac') or ctx['opac_ir'].get('ir'):
                    tools_used.append('unilag_opac_and_ir')
            except Exception:
                pass

    llm_md, llm_engine = _call_optional_llm(clean_q, resolved_mode, ctx, history=history)
    if llm_md:
        reply_md = llm_md
        engine_used = llm_engine
    else:
        reply_md = _build_deterministic_reply(clean_q, resolved_mode, ctx)
        engine_used = 'ogbon-agentic-synthesizer'

    elapsed_ms = int((time.time() - t0) * 1000)
    return {
        'agent': 'Ogbon',
        'mode': resolved_mode,
        'requested_mode': mode,
        'engine': engine_used,
        'elapsed_ms': elapsed_ms,
        'tools_used': tools_used,
        'reply_markdown': reply_md,
        'reply_html': markdown_to_html(reply_md),
        'sources': _collect_sources(ctx),
        'suggestions': _suggest_followups(resolved_mode, clean_q)
    }
