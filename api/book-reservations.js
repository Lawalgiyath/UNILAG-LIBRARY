// Vercel Serverless Function: Book Reservations API
// Handles GET (list/filter), POST (create reservation for in-person pickup), and POST action (admin status updates)

let inMemoryReservations = [
  {
    id: "UNILAG-PK-9104",
    book_title: "Foundations of Clinical Medicine & Pathology (8th Ed.)",
    author: "Kummar, Abbas & Aster",
    call_number: "WB 100 K96f 2023",
    student_name: "Oluwaseun Adeyemi",
    matric: "190302045",
    email: "o.adeyemi@live.unilag.edu.ng",
    phone: "+234 802 119 4433",
    pickup_date: "2026-11-06",
    pickup_location: "Circulation Desk, Ground Floor, Main Library",
    status: "READY_FOR_PICKUP",
    created_at: "2026-11-04T09:30:00Z",
    loan_period: "14 Days",
    notes: "Book retrieved from Medical Sciences Stack (Floor 2). Kept on Hold Shelf A."
  },
  {
    id: "UNILAG-PK-9105",
    book_title: "Principles of Geotechnical and Foundation Engineering",
    author: "Braja M. Das & Nagaratnam Sivakugan",
    call_number: "TA 775 D37 2021",
    student_name: "Fatima Ibrahim",
    matric: "220401019",
    email: "fatima.ibrahim@student.unilag.edu.ng",
    phone: "+234 814 200 9981",
    pickup_date: "2026-11-07",
    pickup_location: "Circulation Desk, Ground Floor, Main Library",
    status: "RESERVED",
    created_at: "2026-11-05T08:10:00Z",
    loan_period: "14 Days",
    notes: "Reserved online. Staff retrieval in progress."
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Handle action parameter for status updates or creation
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // Check if this is an admin action
    if (body.action) {
      const { id, action, notes } = body;
      const reservation = inMemoryReservations.find(r => r.id === id);
      if (!reservation) {
        return res.status(404).json({ error: `Reservation ${id} not found` });
      }
      if (action === 'READY') {
        reservation.status = 'READY_FOR_PICKUP';
        reservation.notes = notes || 'Book is now on the Hold Shelf at the Circulation Desk (Ground Floor). Ready for collection.';
      } else if (action === 'COLLECTED') {
        reservation.status = 'COLLECTED';
        reservation.notes = notes || 'Collected by student in person at the Circulation Desk. Due in 14 days.';
      } else if (action === 'CANCEL') {
        reservation.status = 'CANCELLED';
        reservation.notes = notes || 'Reservation cancelled by administrator/student.';
      } else if (action === 'DELETE') {
        inMemoryReservations = inMemoryReservations.filter(r => r.id !== id);
      }
      return res.status(200).json({ success: true, message: `Reservation ${id} updated to ${action}`, reservation });
    }

    // New Reservation creation
    const randomId = `UNILAG-PK-${Math.floor(1000 + Math.random() * 9000)}`;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newRes = {
      id: randomId,
      book_title: body.book_title || 'Selected Library Book',
      author: body.author || 'Unknown Author',
      call_number: body.call_number || 'Main Library Stacks',
      student_name: body.student_name || '',
      matric: body.matric || '',
      email: body.email || '',
      phone: body.phone || '',
      pickup_date: body.pickup_date || tomorrow.toISOString().split('T')[0],
      pickup_location: 'Circulation Desk, Ground Floor, Main Library',
      status: 'RESERVED',
      created_at: new Date().toISOString(),
      loan_period: body.loan_period || '14 Days',
      notes: 'Reserved online for in-person pickup. Hold shelf expires in 48 hours.'
    };
    inMemoryReservations.unshift(newRes);
    return res.status(201).json({
      success: true,
      reservation: newRes,
      message: 'Book reserved successfully! Please present your UNILAG ID card and this pickup slip at the Circulation Desk.'
    });
  }

  // GET: list or filter
  const { id, matric } = req.query;
  if (id) {
    const filtered = inMemoryReservations.filter(r => r.id.toUpperCase() === id.toUpperCase());
    return res.status(200).json({ reservations: filtered });
  }
  if (matric) {
    const filtered = inMemoryReservations.filter(r => r.matric.toUpperCase() === matric.toUpperCase());
    return res.status(200).json({ reservations: filtered });
  }

  return res.status(200).json({ reservations: inMemoryReservations });
}
