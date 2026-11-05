/**
 * UNILAG Library Booking & Reservation System
 * 1. Book Borrowing & In-Person Pickup Reservations
 * 2. Multimedia Studio Booking & Admin Approval Flow
 */

(function () {
  'use strict';

  // Inject Booking Modals into DOM
  function injectModals() {
    if (document.getElementById('booking-modals-container')) return;

    const container = document.createElement('div');
    container.id = 'booking-modals-container';
    container.innerHTML = `
      <!-- ============ BOOK RESERVATION MODAL ============ -->
      <div class="bk-modal-backdrop" id="bookReserveModal" aria-hidden="true" role="dialog">
        <div class="bk-modal">
          <div class="bk-modal-head">
            <div>
              <span class="bk-kicker">University of Lagos Library</span>
              <h2>Reserve Book for In-Person Pickup</h2>
            </div>
            <button class="bk-close" onclick="window.closeBookReserveModal()" aria-label="Close">&times;</button>
          </div>
          
          <div class="bk-modal-body" id="bookModalBody">
            <div class="bk-summary-box" id="bookSummaryBox">
              <!-- Injected dynamically -->
            </div>

            <div class="bk-notice-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C0000" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div>
                <strong>In-Person Collection Policy:</strong>
                <p>Books reserved online must be collected <strong>in person</strong> at the <strong>Circulation Desk (Ground Floor, Main Library, Akoka)</strong>. You must present your valid UNILAG student/staff ID card. Reserved items are held for 48 hours.</p>
              </div>
            </div>

            <form id="bookReserveForm" onsubmit="window.submitBookReservation(event)">
              <div class="bk-form-grid">
                <div class="bk-field">
                  <label for="bkStudentName">Full Name *</label>
                  <input type="text" id="bkStudentName" required placeholder="e.g. Adebayo Babatunde" autocomplete="name">
                </div>
                <div class="bk-field">
                  <label for="bkMatric">UNILAG Matric No. / Staff ID *</label>
                  <input type="text" id="bkMatric" required placeholder="e.g. 210408012" autocomplete="off">
                </div>
                <div class="bk-field">
                  <label for="bkEmail">University / Personal Email *</label>
                  <input type="email" id="bkEmail" required placeholder="e.g. b.adebayo@live.unilag.edu.ng" autocomplete="email">
                </div>
                <div class="bk-field">
                  <label for="bkPhone">Phone / WhatsApp Number *</label>
                  <input type="tel" id="bkPhone" required placeholder="e.g. 0812 345 6789">
                </div>
                <div class="bk-field">
                  <label for="bkPickupDate">Intended In-Person Pickup Date *</label>
                  <input type="date" id="bkPickupDate" required>
                </div>
                <div class="bk-field">
                  <label for="bkPickupLocation">Pickup Location</label>
                  <input type="text" id="bkPickupLocation" readonly value="Circulation Desk, Ground Floor, Main Library">
                </div>
              </div>

              <div class="bk-actions">
                <button type="button" class="btn btn--ghost" onclick="window.closeBookReserveModal()">Cancel</button>
                <button type="submit" class="btn" id="bkSubmitBtn" style="background:#6C0000;color:#fff">Confirm In-Person Reservation &rarr;</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- ============ MULTIMEDIA STUDIO BOOKING MODAL ============ -->
      <div class="bk-modal-backdrop" id="studioBookingModal" aria-hidden="true" role="dialog">
        <div class="bk-modal">
          <div class="bk-modal-head">
            <div>
              <span class="bk-kicker">Modern Library Facilities</span>
              <h2>Book the Multimedia Studio</h2>
            </div>
            <button class="bk-close" onclick="window.closeStudioBookingModal()" aria-label="Close">&times;</button>
          </div>

          <div class="bk-modal-body" id="studioModalBody">
            <div class="bk-studio-banner">
              <div>
                <strong>Acoustic Recording &amp; Podcast Suite</strong>
                <p>Broadcast microphones on boom arms, acoustic timber wall styling, studio lighting grid, and high-speed research terminals.</p>
              </div>
            </div>

            <div class="bk-notice-box bk-notice-warn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6C0000" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <div>
                <strong>Admin Approval Required:</strong>
                <p>Submitting this form records your slot in <strong>PENDING</strong> status. An administrator must approve your booking in the staff portal before your session is confirmed. <strong>You must reach out to the studio desk to get approved.</strong></p>
              </div>
            </div>

            <form id="studioBookingForm" onsubmit="window.submitStudioBooking(event)">
              <div class="bk-form-grid">
                <div class="bk-field">
                  <label for="stName">Full Name *</label>
                  <input type="text" id="stName" required placeholder="e.g. Oluwaseun Adeleke">
                </div>
                <div class="bk-field">
                  <label for="stMatric">Matric No. / Staff ID *</label>
                  <input type="text" id="stMatric" required placeholder="e.g. 200805041">
                </div>
                <div class="bk-field">
                  <label for="stDept">Department / Faculty *</label>
                  <input type="text" id="stDept" required placeholder="e.g. Mass Communication / Arts">
                </div>
                <div class="bk-field">
                  <label for="stEmail">UNILAG / Contact Email *</label>
                  <input type="email" id="stEmail" required placeholder="e.g. o.adeleke@live.unilag.edu.ng">
                </div>
                <div class="bk-field">
                  <label for="stPhone">Phone / WhatsApp *</label>
                  <input type="tel" id="stPhone" required placeholder="e.g. 0802 345 6789">
                </div>
                <div class="bk-field">
                  <label for="stDate">Session Date *</label>
                  <input type="date" id="stDate" required>
                </div>
                <div class="bk-field">
                  <label for="stSlot">Time Slot *</label>
                  <select id="stSlot" required>
                    <option value="9:00 AM – 11:00 AM">9:00 AM – 11:00 AM (Morning Slot)</option>
                    <option value="11:30 AM – 1:30 PM">11:30 AM – 1:30 PM (Midday Slot)</option>
                    <option value="2:00 PM – 4:00 PM" selected>2:00 PM – 4:00 PM (Afternoon Slot)</option>
                    <option value="4:00 PM – 5:30 PM">4:00 PM – 5:30 PM (Evening Slot)</option>
                  </select>
                </div>
                <div class="bk-field">
                  <label for="stDuration">Allocated Duration *</label>
                  <select id="stDuration" required>
                    <option value="1 hour">1 Hour</option>
                    <option value="1.5 hours">1.5 Hours</option>
                    <option value="2 hours" selected>2 Hours (Standard)</option>
                    <option value="3 hours">3 Hours (Doctoral / Faculty Project)</option>
                  </select>
                </div>
                <div class="bk-field">
                  <label for="stAttendees">Number of Attendees / Guests *</label>
                  <select id="stAttendees" required>
                    <option value="1">1 Person (Solo Recording / Monologue)</option>
                    <option value="2" selected>2 Persons (1-on-1 Interview)</option>
                    <option value="3">3 Persons (Panel Discussion)</option>
                    <option value="4">4 Persons (Full Studio Suite)</option>
                  </select>
                </div>
                <div class="bk-field" style="grid-column: 1 / -1">
                  <label for="stPurpose">Session Purpose &amp; Description *</label>
                  <input type="text" id="stPurpose" required placeholder="e.g. Academic Podcast on Sustainable Urban Architecture in Lagos">
                </div>
              </div>

              <div class="bk-actions">
                <button type="button" class="btn btn--ghost" onclick="window.closeStudioBookingModal()">Cancel</button>
                <button type="submit" class="btn" id="stSubmitBtn" style="background:#6C0000;color:#fff">Submit Booking Request &rarr;</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- ============ LEARNING COMMONS APPLICATION MODAL ============ -->
      <div class="bk-modal-backdrop" id="commonsBookingModal" aria-hidden="true" role="dialog">
        <div class="bk-modal">
          <div class="bk-modal-head">
            <div>
              <span class="bk-kicker">Ground Floor &bull; Main Library, Akoka</span>
              <h2>Apply to Use Learning Commons</h2>
            </div>
            <button class="bk-close" onclick="window.closeCommonsBookingModal()" aria-label="Close">&times;</button>
          </div>

          <div class="bk-modal-body" id="commonsModalBody">
            <div class="bk-studio-banner" style="background:#f4ece1;border-color:rgba(108,0,0,0.2)">
              <div>
                <strong style="color:#6C0000">Digital Research Workstations, Pod Seats &amp; Reference Advisory</strong>
                <p style="color:rgba(13,11,10,0.78)">Ground Floor digital nerve center of the Main Library. High-speed research PCs with direct access to ScienceDirect, JSTOR, UNILAG IR, and collaborative study pod seats.</p>
              </div>
            </div>

            <div style="background:#fff;border:1px solid rgba(108,0,0,0.2);border-radius:4px;padding:12px 16px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
              <div>
                <span class="mono" style="font-size:0.75rem;color:#6C0000;font-weight:700;display:block">Official UNILAG Google Form</span>
                <span style="font-size:0.83rem;color:rgba(13,11,10,0.75)">You can also submit directly via the official library registration form.</span>
              </div>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfyy9b8otic_G_r5i-IR--uB7m4f2SrDiqfs1OA2AWheGlSug/viewform?pli=1&pli=1" target="_blank" rel="noopener" class="btn btn--sm" style="background:#6C0000;color:#fff;font-size:0.75rem;padding:6px 14px;text-decoration:none">Open Google Form &rarr;</a>
            </div>

            <form id="commonsBookingForm" onsubmit="window.submitCommonsBooking(event)">
              <div class="bk-form-grid">
                <div class="bk-field">
                  <label for="cmName">Full Name *</label>
                  <input type="text" id="cmName" required placeholder="e.g. Chinelo Okonkwo">
                </div>
                <div class="bk-field">
                  <label for="cmMatric">Matric No. / Staff ID *</label>
                  <input type="text" id="cmMatric" required placeholder="e.g. 210902034">
                </div>
                <div class="bk-field">
                  <label for="cmDept">Faculty &amp; Department *</label>
                  <input type="text" id="cmDept" required placeholder="e.g. Computer Sciences / Science">
                </div>
                <div class="bk-field">
                  <label for="cmEmail">UNILAG / Contact Email *</label>
                  <input type="email" id="cmEmail" required placeholder="e.g. c.okonkwo@live.unilag.edu.ng">
                </div>
                <div class="bk-field">
                  <label for="cmPhone">Phone / WhatsApp *</label>
                  <input type="tel" id="cmPhone" required placeholder="e.g. 0803 123 4567">
                </div>
                <div class="bk-field">
                  <label for="cmDate">Requested Date *</label>
                  <input type="date" id="cmDate" required>
                </div>
                <div class="bk-field">
                  <label for="cmSlot">Time Slot *</label>
                  <select id="cmSlot" required>
                    <option value="8:30 AM – 11:30 AM">8:30 AM – 11:30 AM (Morning Session)</option>
                    <option value="12:00 PM – 3:00 PM" selected>12:00 PM – 3:00 PM (Afternoon Session)</option>
                    <option value="3:30 PM – 6:30 PM">3:30 PM – 6:30 PM (Evening Session)</option>
                    <option value="6:30 PM – 8:30 PM">6:30 PM – 8:30 PM (Night Session)</option>
                  </select>
                </div>
                <div class="bk-field">
                  <label for="cmStation">Station / Facility Requested *</label>
                  <select id="cmStation" required>
                    <option value="Digital Research Workstation (High-Speed PC)" selected>Digital Research Workstation (High-Speed PC)</option>
                    <option value="Collaborative Pod Seat (Group Study / Team)">Collaborative Pod Seat (Group Study / Team)</option>
                    <option value="Postgraduate Dissertation / Thesis Terminal">Postgraduate Dissertation / Thesis Terminal</option>
                    <option value="Reference Librarian 1-on-1 Advisory">Reference Librarian 1-on-1 Advisory</option>
                  </select>
                </div>
                <div class="bk-field" style="grid-column: 1 / -1">
                  <label for="cmPurpose">Purpose of Study / Research Topic *</label>
                  <input type="text" id="cmPurpose" required placeholder="e.g. Systematic literature review on renewable energy storage in West Africa">
                </div>
              </div>

              <div class="bk-actions">
                <button type="button" class="btn btn--ghost" onclick="window.closeCommonsBookingModal()">Cancel</button>
                <button type="submit" class="btn" id="cmSubmitBtn" style="background:#6C0000;color:#fff">Submit Application Pass &rarr;</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Set default pickup date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const bkDate = document.getElementById('bkPickupDate');
    if (bkDate) bkDate.value = dateStr;
    const stDate = document.getElementById('stDate');
    if (stDate) stDate.value = dateStr;
    const cmDate = document.getElementById('cmDate');
    if (cmDate) cmDate.value = dateStr;
  }

  // Current active book being reserved
  let activeBook = null;

  window.openBookReserveModal = function (bookJson) {
    injectModals();
    try {
      activeBook = typeof bookJson === 'string' ? JSON.parse(bookJson) : bookJson;
    } catch (e) {
      activeBook = { title: 'University Library Book', author: 'University Collection', callNo: 'Main Stacks' };
    }

    const box = document.getElementById('bookSummaryBox');
    if (box && activeBook) {
      box.innerHTML = `
        <div style="font-size:.76rem;color:#6C0000;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">Selected Catalogue Item</div>
        <h3 style="font-family:'Instrument Serif',Georgia,serif;font-size:1.35rem;margin:0 0 6px">${activeBook.title || 'Unknown Title'}</h3>
        <div style="font-size:.84rem;color:rgba(13,11,10,.7);display:flex;gap:12px;flex-wrap:wrap">
          <span><strong>Author:</strong> ${activeBook.author || 'UNILAG Library'}</span>
          <span>&bull;</span>
          <span><strong>Call No:</strong> <code style="background:#eee;padding:1px 6px">${activeBook.callNo || 'Stacks'}</code></span>
          <span>&bull;</span>
          <span><strong>Location:</strong> Main Library, Akoka</span>
        </div>
      `;
    }

    const modal = document.getElementById('bookReserveModal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
  };

  window.closeBookReserveModal = function () {
    const modal = document.getElementById('bookReserveModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  window.submitBookReservation = async function (e) {
    e.preventDefault();
    const btn = document.getElementById('bkSubmitBtn');
    if (btn) btn.disabled = true;

    const payload = {
      book_title: activeBook ? activeBook.title : 'University Book',
      author: activeBook ? activeBook.author : 'UNILAG Library',
      call_number: activeBook ? activeBook.callNo : 'Stacks',
      student_name: document.getElementById('bkStudentName').value.trim(),
      matric: document.getElementById('bkMatric').value.trim(),
      email: document.getElementById('bkEmail').value.trim(),
      phone: document.getElementById('bkPhone').value.trim(),
      pickup_date: document.getElementById('bkPickupDate').value,
      loan_period: '14 Days'
    };

    let reservation = null;
    try {
      const res = await fetch('/api/book-reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        reservation = data.reservation;
      }
    } catch (err) {
      console.warn('API offline, generating local reservation slip:', err);
    }

    // Local fallback if API is in offline mode
    if (!reservation) {
      const localId = `UNILAG-PK-${Math.floor(1000 + Math.random() * 9000)}`;
      reservation = {
        ...payload,
        id: localId,
        status: 'RESERVED',
        pickup_location: 'Circulation Desk, Ground Floor, Main Library'
      };
      // Save in localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('unilag_book_reservations') || '[]');
        saved.unshift(reservation);
        localStorage.setItem('unilag_book_reservations', JSON.stringify(saved));
      } catch (e) { }
    }

    // Render Confirmation Slip
    const bodyEl = document.getElementById('bookModalBody');
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="bk-slip">
          <div class="bk-slip-head">
            <div>
              <span class="mono" style="font-size:.7rem;color:#6C0000;font-weight:700">UNIVERSITY OF LAGOS LIBRARY</span>
              <h2 style="font-family:'Instrument Serif',Georgia,serif;font-size:1.6rem;margin:4px 0">In-Person Book Collection Slip</h2>
            </div>
            <div class="bk-barcode mono">${reservation.id}</div>
          </div>

          <div class="bk-slip-details">
            <div class="bk-slip-row">
              <span>Reservation Ref:</span>
              <strong class="mono" style="color:#6C0000;font-size:1.05rem">${reservation.id}</strong>
            </div>
            <div class="bk-slip-row">
              <span>Status:</span>
              <span class="s-badge s-badge-gold">READY FOR RETRIEVAL</span>
            </div>
            <div class="bk-slip-row">
              <span>Book Title:</span>
              <strong>${reservation.book_title}</strong>
            </div>
            <div class="bk-slip-row">
              <span>Author:</span>
              <span>${reservation.author}</span>
            </div>
            <div class="bk-slip-row">
              <span>Call Number:</span>
              <code class="mono" style="background:#eee;padding:2px 8px">${reservation.call_number}</code>
            </div>
            <div class="bk-slip-row">
              <span>Student / Borrower:</span>
              <span>${reservation.student_name} (${reservation.matric})</span>
            </div>
            <div class="bk-slip-row">
              <span>Pickup Date:</span>
              <strong>${reservation.pickup_date} (Between 9:00 AM – 4:00 PM)</strong>
            </div>
            <div class="bk-slip-row">
              <span>Collection Desk:</span>
              <strong>Circulation Desk, Ground Floor, Main Library, Akoka</strong>
            </div>
          </div>

          <div class="bk-notice-box" style="margin-top:16px">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C0000" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div>
              <strong>Important Collection Reminder:</strong>
              <p>You must come in person to collect your book. Present this reference code along with your physical UNILAG Student ID card at the Circulation Desk. Books remain on hold for 48 hours.</p>
            </div>
          </div>

          <div class="bk-actions" style="margin-top:20px">
            <button class="btn btn--sm" onclick="window.print()" style="background:#6C0000;color:#fff">Print / Save Slip</button>
            <button class="btn btn--sm btn--ghost" onclick="window.closeBookReserveModal()">Done</button>
          </div>
        </div>
      `;
    }
  };

  /* ============ STUDIO BOOKING SYSTEM ============ */

  window.openStudioBookingModal = function () {
    injectModals();
    const modal = document.getElementById('studioBookingModal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
  };

  window.closeStudioBookingModal = function () {
    const modal = document.getElementById('studioBookingModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  window.submitStudioBooking = async function (e) {
    e.preventDefault();
    const btn = document.getElementById('stSubmitBtn');
    if (btn) btn.disabled = true;

    const payload = {
      name: document.getElementById('stName').value.trim(),
      matric: document.getElementById('stMatric').value.trim(),
      department: document.getElementById('stDept').value.trim(),
      email: document.getElementById('stEmail').value.trim(),
      phone: document.getElementById('stPhone').value.trim(),
      date: document.getElementById('stDate').value,
      slot: document.getElementById('stSlot').value,
      duration: document.getElementById('stDuration').value,
      attendees: document.getElementById('stAttendees').value,
      purpose: document.getElementById('stPurpose').value.trim()
    };

    let booking = null;
    try {
      const res = await fetch('/api/studio-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        booking = data.booking;
      }
    } catch (err) {
      console.warn('Studio API offline, creating local booking record:', err);
    }

    if (!booking) {
      const localId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
      booking = {
        ...payload,
        id: localId,
        status: 'PENDING',
        created_at: new Date().toISOString()
      };
      try {
        const saved = JSON.parse(localStorage.getItem('unilag_studio_bookings') || '[]');
        saved.unshift(booking);
        localStorage.setItem('unilag_studio_bookings', JSON.stringify(saved));
      } catch (e) { }
    }

    // Render Approval-Required Confirmation Screen
    const bodyEl = document.getElementById('studioModalBody');
    if (bodyEl) {
      const mailtoLink = `mailto:studio@library.unilag.edu.ng?subject=Approval%20Request%20for%20Multimedia%20Studio%20Booking%20${booking.id}&body=Dear%20Multimedia%20Studio%20Administrator,%0D%0A%0D%0AI%20have%20submitted%20a%20booking%20request%20for%20the%20Multimedia%20Studio%20(Ref:%20${booking.id})%20scheduled%20for%20${encodeURIComponent(booking.date)}%20during%20the%20${encodeURIComponent(booking.slot)}%20slot.%0D%0A%0D%0AMy%20details:%0D%0AName:%20${encodeURIComponent(booking.name)}%0D%0AMatric/Staff%20ID:%20${encodeURIComponent(booking.matric)}%0D%0ADepartment:%20${encodeURIComponent(booking.department)}%0D%0APurpose:%20${encodeURIComponent(booking.purpose)}%0D%0A%0D%0APlease%20review%20and%20approve%20this%20session%20in%20the%20admin%20portal.%0D%0A%0D%0AThank%20you.`;

      bodyEl.innerHTML = `
        <div class="bk-slip">
          <div class="bk-slip-head">
            <div>
              <span class="mono" style="font-size:.7rem;color:#6C0000;font-weight:700">UNIVERSITY OF LAGOS LIBRARY</span>
              <h2 style="font-family:'Instrument Serif',Georgia,serif;font-size:1.6rem;margin:4px 0">Multimedia Studio Booking Request</h2>
            </div>
            <div class="bk-barcode mono">${booking.id}</div>
          </div>

          <!-- Pending Alert Banner -->
          <div class="bk-status-banner">
            <div class="bk-status-pill pending">STATUS: PENDING ADMIN APPROVAL</div>
            <h3 style="margin:8px 0 4px;font-family:'Instrument Serif',Georgia,serif;font-size:1.3rem">Action Required to Confirm Booking</h3>
            <p style="font-size:.88rem;color:rgba(13,11,10,.8);margin:0;line-height:1.5">
              Your studio session has been logged under Reference <strong>${booking.id}</strong>. 
              <strong>To have your session approved</strong>, an administrator must accept your request in the staff portal. Please reach out to the studio desk using the quick-contact button below.
            </p>
          </div>

          <div class="bk-slip-details" style="margin-top:16px">
            <div class="bk-slip-row">
              <span>Booking Reference:</span>
              <strong class="mono" style="color:#6C0000;font-size:1.1rem">${booking.id}</strong>
            </div>
            <div class="bk-slip-row">
              <span>Scheduled Date:</span>
              <strong>${booking.date}</strong>
            </div>
            <div class="bk-slip-row">
              <span>Time Slot &amp; Duration:</span>
              <strong>${booking.slot} (${booking.duration})</strong>
            </div>
            <div class="bk-slip-row">
              <span>Session Purpose:</span>
              <span>${booking.purpose}</span>
            </div>
            <div class="bk-slip-row">
              <span>Student / Lead:</span>
              <span>${booking.name} (${booking.matric}) &bull; ${booking.department}</span>
            </div>
            <div class="bk-slip-row">
              <span>Facility:</span>
              <span>Library Multimedia Studio (3rd Floor)</span>
            </div>
          </div>

          <div class="bk-reachout-box">
            <h4 style="margin:0 0 6px;color:#6C0000;font-size:1rem">Reach Out for Admin Approval:</h4>
            <p style="font-size:.85rem;margin:0 0 12px;color:rgba(13,11,10,.75)">
              1. <strong>Email Studio Desk:</strong> Send a pre-filled confirmation email to <code>studio@library.unilag.edu.ng</code>.<br>
              2. <strong>In-Person Walk-in:</strong> Visit the Automation &amp; Multimedia Studio Office (3rd Floor, Main Library) quoting Ref <strong>${booking.id}</strong>.
            </p>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <a href="${mailtoLink}" class="btn btn--sm" style="background:#6C0000;color:#fff;text-decoration:none">
                Reach Out via Email for Approval &rarr;
              </a>
              <a href="https://wa.me/2349063969206?text=Hello%20UNILAG%20Library%20Admin,%20I%20have%20submitted%20Multimedia%20Studio%20Booking%20${booking.id}%20and%20request%20approval." target="_blank" rel="noopener" class="btn btn--sm btn--ghost" style="text-decoration:none">
                Contact via WhatsApp &rarr;
              </a>
            </div>
          </div>

          <div class="bk-actions" style="margin-top:20px">
            <button class="btn btn--sm" onclick="window.print()" style="background:#f4ece1;color:#6C0000;border:1px solid rgba(108,0,0,.3)">Print Booking Slip</button>
            <button class="btn btn--sm btn--ghost" onclick="window.closeStudioBookingModal()">Close</button>
          </div>
        </div>
      `;
    }
  };


  /* ============ LEARNING COMMONS APPLICATION SYSTEM ============ */
  window.openCommonsBookingModal = function () {
    injectModals();
    const modal = document.getElementById('commonsBookingModal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
  };

  window.closeCommonsBookingModal = function () {
    const modal = document.getElementById('commonsBookingModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  window.submitCommonsBooking = async function (e) {
    e.preventDefault();
    const btn = document.getElementById('cmSubmitBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Submitting Application...';
    }

    const payload = {
      name: (document.getElementById('cmName') || {}).value || 'Student',
      matric: (document.getElementById('cmMatric') || {}).value || '',
      department: (document.getElementById('cmDept') || {}).value || '',
      email: (document.getElementById('cmEmail') || {}).value || '',
      phone: (document.getElementById('cmPhone') || {}).value || '',
      date: (document.getElementById('cmDate') || {}).value || '',
      slot: (document.getElementById('cmSlot') || {}).value || '12:00 PM – 3:00 PM',
      station: (document.getElementById('cmStation') || {}).value || 'Digital Research Workstation',
      purpose: (document.getElementById('cmPurpose') || {}).value || 'Academic Research'
    };

    let booking = null;
    try {
      const res = await fetch('/api/commons-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        booking = data.booking;
      }
    } catch (err) {
      console.warn('Commons API offline, creating local booking record:', err);
    }

    if (!booking) {
      const rnd = Math.floor(1000 + Math.random() * 9000);
      booking = {
        id: `COMMONS-2026-${rnd}`,
        ...payload,
        status: 'CONFIRMED',
        created_at: new Date().toISOString()
      };
      try {
        const saved = JSON.parse(localStorage.getItem('unilag_commons_bookings') || '[]');
        saved.unshift(booking);
        localStorage.setItem('unilag_commons_bookings', JSON.stringify(saved));
      } catch (e) {}
    }

    const bodyEl = document.getElementById('commonsModalBody');
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div style="padding:10px 0">
          <div class="bk-success-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <div>
              <span class="bk-kicker" style="color:#2e7d32">Application Received &amp; Confirmed</span>
              <h2 style="font-family:'Instrument Serif',Georgia,serif;font-size:1.6rem;margin:4px 0">Learning Commons Access Pass</h2>
            </div>
          </div>

          <div class="bk-barcode-box">
            <span class="mono" style="font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(13,11,10,.6)">Ground Floor Access Reference</span>
            <div class="bk-barcode mono">${booking.id}</div>
            <p style="font-size:.82rem;margin:6px 0 0;color:rgba(13,11,10,.7)">Keep this code handy. Present upon arrival at the Information Desk.</p>
          </div>

          <div class="bk-details-list">
            <div class="bk-d-row">
              <span>Pass Reference:</span>
              <strong class="mono" style="color:#6C0000;font-size:1.1rem">${booking.id}</strong>
            </div>
            <div class="bk-d-row">
              <span>Facility / Station:</span>
              <strong>${booking.station}</strong>
            </div>
            <div class="bk-d-row">
              <span>Allocated Date:</span>
              <strong>${booking.date}</strong>
            </div>
            <div class="bk-d-row">
              <span>Session Time Slot:</span>
              <strong>${booking.slot}</strong>
            </div>
            <div class="bk-d-row">
              <span>Applicant Name:</span>
              <span>${booking.name} (${booking.matric}) &bull; ${booking.department}</span>
            </div>
            <div class="bk-d-row">
              <span>Location:</span>
              <strong>Ground Floor, Main Library, Akoka</strong>
            </div>
          </div>

          <div class="bk-reachout-box">
            <h4 style="margin:0 0 6px;color:#6C0000;font-size:1rem">Arrival Instructions:</h4>
            <p style="font-size:.85rem;margin:0 0 12px;color:rgba(13,11,10,.75)">
              Proceed directly to the <strong>Information Desk (Ground Floor, Main Library)</strong>. Show this reference pass along with your physical UNILAG Student / Staff ID card to the on-duty librarian.
            </p>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfyy9b8otic_G_r5i-IR--uB7m4f2SrDiqfs1OA2AWheGlSug/viewform?pli=1&pli=1" target="_blank" rel="noopener" class="btn btn--sm" style="background:#6C0000;color:#fff;text-decoration:none">
                Also Open Official Google Form &rarr;
              </a>
              <button class="btn btn--sm" onclick="window.print()" style="background:#f4ece1;color:#6C0000;border:1px solid rgba(108,0,0,.3)">Print Pass Slip</button>
              <button class="btn btn--sm btn--ghost" onclick="window.closeCommonsBookingModal()">Done</button>
            </div>
          </div>
        </div>
      `;
    }
  };

  // Wire buttons on page load
  document.addEventListener('DOMContentLoaded', function () {
    injectModals();

    // Wire any "Book studio session" or "#multimedia-studio" button
    // Wire any "Apply to use Learning Commons" or "#learning-commons" button
    document.querySelectorAll('a[href*="#learning-commons"], [data-open-commons]').forEach(el => {
      if (el.textContent.toLowerCase().includes('apply') || el.hasAttribute('data-open-commons')) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          window.openCommonsBookingModal();
        });
      }
    });

    document.querySelectorAll('a[href*="#multimedia-studio"], [data-open-studio]').forEach(el => {
      if (el.textContent.toLowerCase().includes('book') || el.hasAttribute('data-open-studio')) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          window.openStudioBookingModal();
        });
      }
    });
  });
})();

