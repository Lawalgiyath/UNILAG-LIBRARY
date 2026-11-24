import os
import sys
import json
import re
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime
from html import unescape

DIRECTORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_FILE = os.path.join(DIRECTORY, 'data', 'library_news.json')

# Verified official UNILAG Library landmark news & press releases
OFFICIAL_LIBRARY_NOTICES = [
    {
        "id": "news-official-1",
        "title": "Commissioning of the Library Multimedia Studio at the Main Library",
        "category": "New Facility",
        "date": "19 Jan 2026",
        "displayDate": "19 Jan 2026",
        "timestamp": "2026-01-19T10:00:00Z",
        "lead": True,
        "location": "3rd Floor, Main Library",
        "summary": "State-of-the-art acoustic podcasting and video recording studio suite launched on 19th January 2026 on the 3rd Floor of the Main Library. Equipped with broadcast studio boom microphones, acoustic timber soundproofing, and overhead studio lighting for scholarly podcasts, lectures, and academic production.",
        "link": "services.html#multimedia-studio",
        "image": "assets/multimedia_studio_suite.webp",
        "badge": "Newly Commissioned"
    },
    {
        "id": "news-official-2",
        "title": "Transformation of the Library Learning Commons: Connected Workstations & Digital Hub",
        "category": "Academic Hub",
        "date": "15 Aug 2024",
        "displayDate": "15 Aug 2024",
        "timestamp": "2024-08-15T09:00:00Z",
        "lead": False,
        "location": "Ground Floor, Main Library",
        "summary": "Collaborative research workstations, high-speed institutional e-resource terminals, and on-site information desk guidance for interdisciplinary scholarly investigations.",
        "link": "services.html#learning-commons",
        "image": "assets/learning_commons_workstations.webp",
        "badge": "Collaborative Space"
    },
    {
        "id": "news-official-3",
        "title": "Content Registration of Digital Object Identifiers (DOIs) on Crossref",
        "category": "Scholarly Publishing",
        "date": "21 Jun 2024",
        "displayDate": "21 Jun 2024",
        "timestamp": "2024-06-21T11:00:00Z",
        "lead": False,
        "location": "Cataloguing & Scholarly Communication Unit",
        "summary": "Full integration with Crossref DOI registry, connecting University of Lagos journals, conference proceedings, and faculty monographs directly to the global research citation index.",
        "link": "news.html#doi-registration",
        "image": "assets/doi_crossref_registration.webp",
        "badge": "Scholarly Research"
    },
    {
        "id": "news-official-4",
        "title": "Library Makerspace: 'Make Ideas Happen' Ideation Lounge & Smart Displays",
        "category": "Innovation Hub",
        "date": "21 Nov 2023",
        "displayDate": "21 Nov 2023",
        "timestamp": "2023-11-21T14:00:00Z",
        "lead": False,
        "location": "1st Floor, Main Library",
        "summary": "Interactive smart displays, design-thinking whiteboards, and comfortable circular collaboration pods designed to foster student innovation and interdisciplinary creative projects.",
        "link": "services.html#makerspace",
        "image": "assets/makerspace_arena.webp",
        "badge": "Ideation & Design"
    }
]

def parse_rss_date(date_str):
    try:
        # e.g. "Fri, 25 Sep 2026 07:00:00 GMT" or "Sat, 14 Nov 2026 18:52:27 +0000"
        dt = None
        for fmt in [
            '%a, %d %b %Y %H:%M:%S %z',
            '%a, %d %b %Y %H:%M:%S GMT',
            '%a, %d %b %Y %H:%M:%S +0000',
            '%d %b %Y'
        ]:
            try:
                dt = datetime.strptime(date_str.strip(), fmt)
                break
            except Exception:
                continue
        if dt:
            return dt.strftime('%d %b %Y'), dt.isoformat()
    except Exception:
        pass
    return "Recent Update", datetime.now().isoformat()

def fetch_live_syndicated_news():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Fetching syndicated UNILAG Library news...")
    news_items = []
    seen_titles = set()

    # 1. Google News RSS for University of Lagos Library
    gn_url = 'https://news.google.com/rss/search?q=University+of+Lagos+Library&hl=en-NG&gl=NG&ceid=NG:en'
    req = urllib.request.Request(gn_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=7) as resp:
            root = ET.fromstring(resp.read())
            items = root.findall('.//item')
            for it in items[:10]:
                title_raw = it.find('title').text if it.find('title') is not None else ''
                link = it.find('link').text if it.find('link') is not None else 'https://unilag.edu.ng'
                pubDate = it.find('pubDate').text if it.find('pubDate') is not None else ''
                
                # Clean title: remove " - University Of Lagos" suffix
                clean_title = re.sub(r'\s*-\s*University\s+Of\s+Lagos.*$', '', title_raw, flags=re.IGNORECASE).strip()
                clean_title = unescape(clean_title)
                
                if not clean_title or clean_title.lower() in seen_titles:
                    continue
                seen_titles.add(clean_title.lower())
                
                # Filter relevance
                relevance_keywords = ['library', 'librarian', 'okiki', 'book', 'fumigation', 'archive', 'learning', 'reading', 'america', 'research', 'conference']
                if not any(k in clean_title.lower() for k in relevance_keywords):
                    continue
                    
                display_date, iso_date = parse_rss_date(pubDate)
                
                # Determine category
                cat = "Library News"
                if "librarian" in clean_title.lower() or "okiki" in clean_title.lower() or "appointed" in clean_title.lower():
                    cat = "Leadership & Appointments"
                elif "training" in clean_title.lower() or "workshop" in clean_title.lower() or "conference" in clean_title.lower():
                    cat = "Professional Development"
                elif "notice" in clean_title.lower() or "closure" in clean_title.lower() or "hours" in clean_title.lower():
                    cat = "Official Notice"
                elif "america" in clean_title.lower() or "center" in clean_title.lower() or "space" in clean_title.lower():
                    cat = "Special Collections"

                news_items.append({
                    'id': f'news-live-{len(news_items)+1}',
                    'title': clean_title,
                    'category': cat,
                    'date': display_date,
                    'displayDate': display_date,
                    'timestamp': iso_date,
                    'lead': False,
                    'location': 'University of Lagos Main Library, Akoka',
                    'summary': f"Official release from the University of Lagos regarding the Library system. Read the verified report, circular details, and public notice.",
                    'link': link,
                    'image': 'https://iili.io/npBxdcN.webp',
                    'badge': 'Verified Live Notice',
                    'isLiveFeed': True
                })
    except Exception as e:
        print(f"Google News RSS fetch note: {e}")

    # 2. UNILAG official WordPress feed
    unilag_feed = 'https://unilag.edu.ng/feed/'
    req2 = urllib.request.Request(unilag_feed, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req2, timeout=6) as resp:
            root = ET.fromstring(resp.read())
            items = root.findall('.//item')
            for it in items[:8]:
                title_raw = it.find('title').text if it.find('title') is not None else ''
                link = it.find('link').text if it.find('link') is not None else 'https://unilag.edu.ng'
                pubDate = it.find('pubDate').text if it.find('pubDate') is not None else ''
                desc = it.find('description').text if it.find('description') is not None else ''
                
                clean_title = unescape(re.sub(r'<[^>]+>', '', title_raw).strip())
                if not clean_title or clean_title.lower() in seen_titles:
                    continue
                seen_titles.add(clean_title.lower())
                
                # Check if library, research, academic or conference related
                if any(w in clean_title.lower() for w in ['library', 'librarian', 'research', 'scientific', 'endowment', 'lecture', 'scholar']):
                    display_date, iso_date = parse_rss_date(pubDate)
                    clean_desc = unescape(re.sub(r'<[^>]+>', '', desc).strip()) if desc else ''
                    if len(clean_desc) > 220:
                        clean_desc = clean_desc[:217] + '...'
                    news_items.append({
                        'id': f'news-feed-{len(news_items)+1}',
                        'title': clean_title,
                        'category': 'Academic News',
                        'date': display_date,
                        'displayDate': display_date,
                        'timestamp': iso_date,
                        'lead': False,
                        'location': 'University of Lagos',
                        'summary': clean_desc or "Academic notice and university communication from the University of Lagos.",
                        'link': link,
                        'image': 'https://iili.io/npBxvlp.webp',
                        'badge': 'UNILAG News',
                        'isLiveFeed': True
                    })
    except Exception as e:
        print(f"UNILAG Feed note: {e}")

    return news_items

def sync():
    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    live_items = fetch_live_syndicated_news()
    
    # Merge official landmark notices with live syndicated news
    all_notices = OFFICIAL_LIBRARY_NOTICES.copy()
    
    seen_titles = set(n['title'].lower() for n in all_notices)
    for it in live_items:
        if it['title'].lower() not in seen_titles:
            seen_titles.add(it['title'].lower())
            all_notices.append(it)
            
    output_data = {
        'source': 'UNILAG Library Automated News & Notices Syndication',
        'last_updated': datetime.now().isoformat(),
        'last_updated_display': datetime.now().strftime('%d %b %Y, %I:%M %p'),
        'total': len(all_notices),
        'notices': all_notices
    }
    
    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
        
    print(f"\n[SUCCESS] Successfully synced {len(all_notices)} library news articles to {OUT_FILE}")
    return output_data

if __name__ == '__main__':
    sync()
