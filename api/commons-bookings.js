// Vercel Serverless Function: Learning Commons Applications API
// Handles GET (list/filter) and POST (submit new application)

let inMemoryCommons = [
  {
    id: "COMMONS-2026-3011",
    date: "2026-11-06",
    slot: "12:00 PM – 3:00 PM",
    station: "Digital Research Workstation (High-Speed PC)",
    name: "Chinelo Okonkwo",
    matric: "210902034",
    department: "Computer Sciences",
    email: "c.okonkwo@live.unilag.edu.ng",
    phone: "+234 803 123 4567",
    purpose: "Literature review on renewable energy microgrids",
    status: "CONFIRMED",
    created_at: "2026-11-04T11:00:00Z",
    notes: "Allocated Workstation PC-08, Ground Floor."
  },
  {
    id: "COMMONS-2026-3012",
    date: "2026-11-07",
    slot: "8:30 AM – 11:30 AM",
    station: "Collaborative Pod Seat (Group Study / Team)",
    name: "Tunde Adeyemi",
    matric: "200401088",
    department: "Economics",
    email: "t.adeyemi@student.unilag.edu.ng",
    phone: "+234 818 992 4432",
    purpose: "Econometric modeling for final year project",
    status: "CONFIRMED",
    created_at: "2026-11-04T15:30:00Z",
    notes: "Allocated Pod Seat P-03."
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
    const { status, search } = req.query || {};
    let filtered = [...inMemoryCommons];
    if (status && status !== 'ALL') {
      filtered = filtered.filter(b => b.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(b =>
        (b.name && b.name.toLowerCase().includes(q)) ||
        (b.matric && b.matric.toLowerCase().includes(q)) ||
        (b.id && b.id.toLowerCase().includes(q)) ||
        (b.department && b.department.toLowerCase().includes(q))
      );
    }
    return res.status(200).json({ count: filtered.length, bookings: filtered });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const rnd = Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: `COMMONS-2026-${rnd}`,
      name: body.name || 'Anonymous Student',
      matric: body.matric || '',
      department: body.department || 'General',
      email: body.email || '',
      phone: body.phone || '',
      date: body.date || new Date().toISOString().split('T')[0],
      slot: body.slot || '12:00 PM – 3:00 PM',
      station: body.station || 'Digital Research Workstation (High-Speed PC)',
      purpose: body.purpose || 'Academic Study',
      status: 'CONFIRMED',
      created_at: new Date().toISOString(),
      notes: 'Confirmed. Present ID card at Information Desk, Ground Floor.'
    };

    inMemoryCommons.unshift(newBooking);
    return res.status(201).json({
      success: true,
      booking: newBooking,
      message: 'Learning Commons application confirmed. Present your pass at the Ground Floor Information Desk.'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
