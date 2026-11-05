// Vercel Serverless Function: Studio Bookings API
// Handles GET (list/filter), POST (create booking), and POST action (admin approval)

let inMemoryBookings = [
  {
    id: "STU-8821",
    date: "2026-11-06",
    slot: "11:00 AM – 1:00 PM",
    duration: "2 hours",
    name: "Chukwuemeka Okonkwo",
    matric: "210408012",
    department: "Mass Communication",
    email: "c.okonkwo@live.unilag.edu.ng",
    phone: "+234 812 345 6789",
    purpose: "Podcast Recording (Campus Pulse Series)",
    attendees: 3,
    status: "APPROVED",
    created_at: "2026-11-03T10:15:00Z",
    notes: "Approved by Studio Administrator. Studio Set A reserved."
  },
  {
    id: "STU-8822",
    date: "2026-11-07",
    slot: "2:00 PM – 4:00 PM",
    duration: "2 hours",
    name: "Amina Bello",
    matric: "200805041",
    department: "Creative Arts",
    email: "amina.bello@student.unilag.edu.ng",
    phone: "+234 903 881 2231",
    purpose: "Dissertation Defense Video Presentation",
    attendees: 2,
    status: "PENDING",
    created_at: "2026-11-04T14:20:00Z",
    notes: "Pending admin review. Student requested to reach out to verify supervisor endorsement."
  },
  {
    id: "STU-8823",
    date: "2026-11-09",
    slot: "9:00 AM – 11:00 AM",
    duration: "2 hours",
    name: "Dr. Babatunde Jinadu",
    matric: "STAFF-MC-402",
    department: "Biomedical Engineering",
    email: "bjinadu@unilag.edu.ng",
    phone: "+234 803 555 1212",
    purpose: "Faculty Open Courseware Audio-Visual Lecture",
    attendees: 1,
    status: "APPROVED",
    created_at: "2026-11-04T16:00:00Z",
    notes: "Staff session approved with technical operator assist."
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Handle action parameter for approve/decline
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    
    // Check if this is an admin action
    if (body.action) {
      const { id, action, notes } = body;
      const booking = inMemoryBookings.find(b => b.id === id);
      if (!booking) {
        return res.status(404).json({ error: `Booking ${id} not found` });
      }
      if (action === 'APPROVE') {
        booking.status = 'APPROVED';
        booking.notes = notes || 'Approved by Library Administrator. Access pass granted.';
      } else if (action === 'DECLINE') {
        booking.status = 'DECLINED';
        booking.notes = notes || 'Declined by Administrator. Please contact studio desk.';
      } else if (action === 'COMPLETE') {
        booking.status = 'COMPLETED';
        booking.notes = notes || 'Studio session completed.';
      } else if (action === 'DELETE') {
        inMemoryBookings = inMemoryBookings.filter(b => b.id !== id);
      }
      return res.status(200).json({ success: true, message: `Booking ${id} updated to ${action}`, booking });
    }

    // New Booking creation
    const randomId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: randomId,
      name: body.name || 'Anonymous Student',
      matric: body.matric || '',
      department: body.department || 'General',
      email: body.email || '',
      phone: body.phone || '',
      date: body.date || new Date().toISOString().split('T')[0],
      slot: body.slot || '10:00 AM – 12:00 PM',
      duration: body.duration || '2 hours',
      purpose: body.purpose || 'Academic Media Production',
      attendees: parseInt(body.attendees || 1, 10),
      status: 'PENDING',
      created_at: new Date().toISOString(),
      notes: 'Submitted by student. Awaiting library admin approval.'
    };
    inMemoryBookings.unshift(newBooking);
    return res.status(201).json({
      success: true,
      booking: newBooking,
      message: 'Studio booking submitted. Admin approval required. Please reach out to the Multimedia Studio Administrator to get your booking approved.'
    });
  }

  // GET: list or filter
  const { id, email } = req.query;
  if (id) {
    const filtered = inMemoryBookings.filter(b => b.id.toUpperCase() === id.toUpperCase());
    return res.status(200).json({ bookings: filtered });
  }
  if (email) {
    const filtered = inMemoryBookings.filter(b => b.email.toLowerCase() === email.toLowerCase());
    return res.status(200).json({ bookings: filtered });
  }

  return res.status(200).json({ bookings: inMemoryBookings });
}

