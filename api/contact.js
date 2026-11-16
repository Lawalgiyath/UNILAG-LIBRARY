// Vercel Serverless Function: Contact Inquiries API
// Handles GET (list messages) and POST (submit new inquiry or update status)

let inMemoryMessages = [
  {
    id: "MSG-9421",
    name: "Dr. Folashade Adeyemi",
    email: "fadeyemi@unilag.edu.ng",
    subject: "Faculty Recommendation: iGLibrary EBA Archive Titles Access",
    message: "Good day, I am requesting guidance on accessing the full Evidence Based Acquisitions collection on iGLibrary for our postgraduate seminar in Faculty of Management Sciences. Please confirm remote authentication options.",
    status: "UNREAD",
    created_at: "2026-11-14T09:30:00Z"
  },
  {
    id: "MSG-9418",
    name: "Ibrahim Musa",
    email: "imusa2024@live.unilag.edu.ng",
    subject: "Research Consultation for Final Year Project",
    message: "Hello Library Team, I would like to book a research consultation with the Engineering Liaison Librarian to locate Scopus-indexed conference papers for renewable solar systems in Nigeria.",
    status: "RESOLVED",
    created_at: "2026-11-13T14:15:00Z"
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      total: inMemoryMessages.length,
      messages: inMemoryMessages
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};

    // Admin action (resolve/delete)
    if (body.action) {
      const { action, id } = body;
      if (action === 'RESOLVE') {
        const item = inMemoryMessages.find(m => m.id === id);
        if (item) item.status = 'RESOLVED';
      } else if (action === 'UNRESOLVE') {
        const item = inMemoryMessages.find(m => m.id === id);
        if (item) item.status = 'UNREAD';
      } else if (action === 'DELETE') {
        inMemoryMessages = inMemoryMessages.filter(m => m.id !== id);
      }
      return res.status(200).json({ success: true, message: `Action ${action} processed` });
    }

    // New inquiry submission
    const newMsg = {
      id: "MSG-" + Math.floor(1000 + Math.random() * 9000),
      name: body.name || "Anonymous",
      email: body.email || "",
      subject: body.subject || "General Inquiry",
      message: body.message || "",
      status: "UNREAD",
      created_at: new Date().toISOString()
    };

    inMemoryMessages.unshift(newMsg);
    return res.status(201).json({
      success: true,
      message: "Your message has been sent to the University of Lagos Library administration. We will get back to you shortly.",
      inquiry: newMsg
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
