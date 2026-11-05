// Vercel Serverless Function: UNILAG Library CMS Content API
// Handles GET (load page content) and POST (update/create/delete/reorder sections)
import fs from 'fs';
import path from 'path';

let defaultCMS = {
  pages: {
    "index.html": [
      {
        id: "sec-home-studio",
        title: "Library Multimedia Studio",
        eyebrow: "New Space · 3rd Floor",
        body: "Located on the 3rd Floor of the Main Library. Equipped with professional broadcast microphones, acoustic wood paneling, bi-directional recording zones, and 4K video recording equipment. Designed to support faculty open courseware, student podcasting, academic dissertations, and digital scholarship.",
        media: {
          url: "https://iili.io/nPRQAMJ.webp",
          caption: "Library Multimedia Studio, 3rd Floor, Main Library",
          shape: "arch",
          radius: "60px 60px 0 0",
          aspect_ratio: "16/10",
          placement: "media-right"
        },
        cta: {
          text: "Book Studio Session",
          url: "services.html#multimedia-studio",
          style: "solid"
        },
        position: "middle",
        order: 1,
        status: "published"
      }
    ],
    "services.html": [
      {
        id: "sec-serv-makerspace",
        title: "Makerspace & Creative Innovation Lab",
        eyebrow: "Collaborative Workspace",
        body: "A dynamic collaborative space on the 1st Floor fostering design thinking, hardware prototyping, and interdisciplinary problem solving. Features collaborative circular seating, interactive smart boards, and presentation facilities.",
        media: {
          url: "https://iili.io/nPR09pS.webp",
          caption: "Makerspace Innovation Arena, Main Library",
          shape: "editorial",
          radius: "4px",
          aspect_ratio: "16/10",
          placement: "media-left"
        },
        cta: {
          text: "Visit Makerspace",
          url: "services.html#makerspace",
          style: "ghost"
        },
        position: "middle",
        order: 1,
        status: "published"
      }
    ],
    "about.html": [],
    "libraries.html": [],
    "databases.html": [],
    "oer.html": []
  }
};

let inMemoryCMS = { ...defaultCMS };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    const { page } = req.query;
    if (page) {
      const sections = inMemoryCMS.pages?.[page] || [];
      return res.status(200).json({ page, sections });
    }
    return res.status(200).json(inMemoryCMS);
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { page, sections, action, section } = body;

    if (!page) {
      return res.status(400).json({ error: "Page identifier required" });
    }

    if (!inMemoryCMS.pages[page]) {
      inMemoryCMS.pages[page] = [];
    }

    // Save entire array of sections for a page
    if (Array.isArray(sections)) {
      inMemoryCMS.pages[page] = sections;
      return res.status(200).json({
        success: true,
        message: `Sections updated for ${page}`,
        page,
        sections: inMemoryCMS.pages[page]
      });
    }

    // Add or update a single section
    if (action === 'save_section' && section) {
      const existingIdx = inMemoryCMS.pages[page].findIndex(s => s.id === section.id);
      if (existingIdx >= 0) {
        inMemoryCMS.pages[page][existingIdx] = section;
      } else {
        if (!section.id) section.id = `sec-${Date.now()}`;
        inMemoryCMS.pages[page].push(section);
      }
      return res.status(200).json({
        success: true,
        message: `Section ${section.id} saved`,
        page,
        sections: inMemoryCMS.pages[page]
      });
    }

    // Delete a section
    if (action === 'delete_section' && body.id) {
      inMemoryCMS.pages[page] = inMemoryCMS.pages[page].filter(s => s.id !== body.id);
      return res.status(200).json({
        success: true,
        message: `Section ${body.id} removed`,
        page,
        sections: inMemoryCMS.pages[page]
      });
    }

    return res.status(400).json({ error: "Invalid CMS action" });
  }
}

