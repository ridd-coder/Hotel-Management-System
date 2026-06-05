require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express    = require('express');
const mysql2     = require('mysql2');
const cors       = require('cors');
const path       = require('path');
const bcrypt     = require('bcrypt');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ── DB Connection (pool for concurrency) ───────────────────────────────────
const pool = mysql2.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || 'Gungun18',
  database: process.env.DB_NAME     || 'hotel_management',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
}).promise();

// ── Health / DB-Status ──────────────────────────────────────────────────────
app.get('/db-status', async (req, res) => {
  try {
    const [[row]] = await pool.query('SELECT 1+1 AS result');
    const [[dbRow]] = await pool.query('SELECT DATABASE() AS db, @@hostname AS host');
    res.json({
      connected:  true,
      insertTest: true,
      selectTest: true,
      message:    'Database connected successfully',
      database:   dbRow.db,
      host:       dbRow.host,
      recordId:   row.result
    });
  } catch (err) {
    res.json({ connected: false, message: 'Database connection failed: ' + err.message });
  }
});

// ── Default Route ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ═══════════════════════════════════════════════════════════════════════════
// GUEST AUTH
// ═══════════════════════════════════════════════════════════════════════════

// Register
app.post('/register', async (req, res) => {
  const { name, phone, email, address, id_proof, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }
  try {
    const [[existing]] = await pool.query('SELECT guest_id FROM guest WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO guest (name, phone, email, address, id_proof, password) VALUES (?,?,?,?,?,?)',
      [name, phone || null, email, address || null, id_proof || null, hashed]
    );
    res.json({ success: true, message: 'Registered successfully.', guest_id: result.insertId });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  try {
    const [[guest]] = await pool.query('SELECT * FROM guest WHERE email = ?', [email]);
    if (!guest) {
      return res.status(401).json({ success: false, message: 'Email not found.' });
    }
    // Support both hashed and plain-text passwords (legacy)
    let match = false;
    if (guest.password) {
      try {
        match = await bcrypt.compare(password, guest.password);
      } catch {
        match = (password === guest.password);
      }
    } else {
      match = true; // No password set – allow
    }
    if (!match) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }
    res.json({
      success:   true,
      message:   'Login successful.',
      guest_id:  guest.guest_id,
      name:      guest.name,
      email:     guest.email
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// HOTELS
// ═══════════════════════════════════════════════════════════════════════════

// GET all hotels
app.get('/hotels', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hotel ORDER BY hotel_id');
    res.json(rows);
  } catch (err) {
    console.error('GET /hotels ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET hotels (admin route alias)
app.get('/admin/hotels', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hotel ORDER BY hotel_id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add hotel
app.post('/admin/addHotel', async (req, res) => {
  const { name, location, contact, rating } = req.body;
  if (!name || !location) {
    return res.status(400).json({ success: false, message: 'Name and location are required.' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO hotel (name, location, contact, rating) VALUES (?,?,?,?)',
      [name, location, contact || null, rating || null]
    );
    res.json({ success: true, hotel_id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE hotel
app.delete('/admin/deleteHotel/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM hotel WHERE hotel_id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ROOMS
// ═══════════════════════════════════════════════════════════════════════════

// GET rooms for a hotel (public)
app.get('/rooms/:hotel_id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM room WHERE hotel_id = ? ORDER BY room_id',
      [req.params.hotel_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single room by room_id (fallback when hotel_id is unknown)
app.get('/room/:room_id', async (req, res) => {
  try {
    const [[row]] = await pool.query(
      'SELECT * FROM room WHERE room_id = ?',
      [req.params.room_id]
    );
    if (!row) return res.status(404).json({ error: 'Room not found.' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/admin/rooms/:hotel_id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM room WHERE hotel_id = ? ORDER BY room_id',
      [req.params.hotel_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all rooms
app.get('/admin/allRooms', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, h.name AS hotel_name
       FROM room r LEFT JOIN hotel h ON r.hotel_id = h.hotel_id
       ORDER BY r.hotel_id, r.room_id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add room
app.post('/admin/addRoom', async (req, res) => {
  const { hotel_id, room_type, price_per_night, availability_status } = req.body;
  if (!hotel_id || !room_type) {
    return res.status(400).json({ success: false, message: 'Hotel ID and room type are required.' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO room (hotel_id, room_type, price_per_night, availability_status) VALUES (?,?,?,?)',
      [hotel_id, room_type, price_per_night || 0, availability_status || 'Available']
    );
    res.json({ success: true, room_id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE room
app.delete('/admin/deleteRoom/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM room WHERE room_id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// BOOKING SERVICES
// ═══════════════════════════════════════════════════════════════════════════

// GET all booking services
app.get('/services', async (req, res) => {
  try {
    // Try the `service` table first; fall back gracefully
    const [rows] = await pool.query('SELECT * FROM service ORDER BY service_id');
    res.json(rows);
  } catch (err) {
    // If `service` table doesn't exist, return empty array
    res.json([]);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// RESERVATIONS / BOOKINGS
// ═══════════════════════════════════════════════════════════════════════════

// GET bookings for a guest
app.get('/getMyBookings/:guest_id', async (req, res) => {
  try {
    const guestId = req.params.guest_id;
    let rows;
    if (guestId == 0) {
      // Admin: all bookings with guest name
      [rows] = await pool.query(
        `SELECT r.*, g.name AS guest_name, g.email
         FROM reservation r
         LEFT JOIN guest g ON r.guest_id = g.guest_id
         ORDER BY r.booking_id DESC`
      );
    } else {
      [rows] = await pool.query(
        `SELECT r.*, g.name AS guest_name, g.email
         FROM reservation r
         LEFT JOIN guest g ON r.guest_id = g.guest_id
         WHERE r.guest_id = ?
         ORDER BY r.booking_id DESC`,
        [guestId]
      );
    }
    // Normalise date fields
    const formatted = rows.map(r => ({
      ...r,
      check_in:     r.check_in  ? new Date(r.check_in).toISOString().split('T')[0]  : null,
      check_out:    r.check_out ? new Date(r.check_out).toISOString().split('T')[0] : null,
      booking_id:   r.booking_id,
      total_amount: r.total_amount,
      status:       r.status
    }));
    res.json(formatted);
  } catch (err) {
    console.error('GET /getMyBookings ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET all bookings (admin)
app.get('/admin/allBookings', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, g.name AS guest_name, g.email
       FROM reservation r
       LEFT JOIN guest g ON r.guest_id = g.guest_id
       ORDER BY r.booking_id DESC`
    );
    const formatted = rows.map(r => ({
      ...r,
      check_in:  r.check_in  ? new Date(r.check_in).toISOString().split('T')[0]  : null,
      check_out: r.check_out ? new Date(r.check_out).toISOString().split('T')[0] : null,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST save/create booking
app.post('/saveBooking', async (req, res) => {
  const { guest_id, room_id, check_in, check_out, services } = req.body;
  // Sanitise total_amount — it may arrive as "1,500" (formatted) or a number
  const total_amount = parseFloat(
    String(req.body.total_amount || '0').replace(/,/g, '')
  ) || 0;

  if (!guest_id || !room_id || !check_in || !check_out) {
    return res.status(400).json({ success: false, message: 'Missing required booking fields.' });
  }
  if (total_amount <= 0) {
    return res.status(400).json({ success: false, message: 'Total amount must be greater than 0.' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert reservation
    const [result] = await conn.query(
      `INSERT INTO reservation (guest_id, room_id, check_in, check_out, status, total_amount)
       VALUES (?,?,?,?,'Pending',?)`,
      [guest_id, room_id, check_in, check_out, total_amount || 0]
    );
    const booking_id = result.insertId;

    // Mark room as Booked
    await conn.query(
      "UPDATE room SET availability_status = 'Booked' WHERE room_id = ?",
      [room_id]
    );

    // Insert booking_services (junction table: booking_id + service_id)
    if (services && services.length > 0) {
      for (const svc of services) {
        if (svc.service_id) {
          // Use service_id FK if provided
          await conn.query(
            'INSERT IGNORE INTO booking_services (booking_id, service_id) VALUES (?,?)',
            [booking_id, svc.service_id]
          );
        }
      }
    }

    await conn.commit();
    res.json({ success: true, booking_id });
  } catch (err) {
    await conn.rollback();
    console.error('POST /saveBooking ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// POST cancel booking
app.post('/cancelBooking/:id', async (req, res) => {
  const bookingId = req.params.id;
  try {
    const [[booking]] = await pool.query(
      'SELECT room_id FROM reservation WHERE booking_id = ?',
      [bookingId]
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    await pool.query(
      "UPDATE reservation SET status = 'Cancelled' WHERE booking_id = ?",
      [bookingId]
    );
    // Free up the room
    await pool.query(
      "UPDATE room SET availability_status = 'Available' WHERE room_id = ?",
      [booking.room_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('POST /cancelBooking ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT
// ═══════════════════════════════════════════════════════════════════════════

// POST save payment
app.post('/savePayment', async (req, res) => {
  const { booking_id, amount, payment_method } = req.body;
  if (!booking_id || !amount) {
    return res.status(400).json({ success: false, message: 'Payment details incomplete.' });
  }
  try {
    // Insert into payment table
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD for DATE column
    await pool.query(
      `INSERT INTO payment (booking_id, amount, payment_method, payment_status, payment_date)
       VALUES (?,?,?,'Paid', ?)`,
      [booking_id, amount, payment_method || 'Card', today]
    );
    // Update reservation to Confirmed
    await pool.query(
      "UPDATE reservation SET status = 'Confirmed' WHERE booking_id = ?",
      [booking_id]
    );
    res.json({ success: true, message: 'Payment successful.' });
  } catch (err) {
    console.error('POST /savePayment ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// RECEIPT
// ═══════════════════════════════════════════════════════════════════════════

app.get('/receipt/:booking_id', async (req, res) => {
  const bookingId = req.params.booking_id;
  try {
    // Reservation + guest
    const [[r]] = await pool.query(
      `SELECT res.*, g.name AS guest_name, g.email,
              rm.price_per_night, rm.room_type,
              p.payment_method, p.payment_status, p.payment_date, p.amount AS paid_amount
       FROM reservation res
       LEFT JOIN guest   g  ON res.guest_id = g.guest_id
       LEFT JOIN room    rm ON res.room_id  = rm.room_id
       LEFT JOIN payment p  ON p.booking_id = res.booking_id
       WHERE res.booking_id = ?
       LIMIT 1`,
      [bookingId]
    );

    if (!r) return res.status(404).json({ error: 'Booking not found.' });

    // Services — join booking_services (junction) with service table
    let services = [];
    try {
      const [svcRows] = await pool.query(
        `SELECT s.service_name, s.cost
         FROM booking_services bs
         JOIN service s ON bs.service_id = s.service_id
         WHERE bs.booking_id = ?`,
        [bookingId]
      );
      services = svcRows;
    } catch { services = []; }

    const checkIn  = r.check_in  ? new Date(r.check_in)  : null;
    const checkOut = r.check_out ? new Date(r.check_out) : null;
    const nights   = (checkIn && checkOut)
      ? Math.max(1, Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)))
      : 0;
    const pricePerNight = parseFloat(r.price_per_night || 0);
    const roomSubtotal  = pricePerNight * nights;
    const serviceTotal  = services.reduce((sum, s) => sum + parseFloat(s.cost || 0), 0);
    const grandTotal    = r.paid_amount || (roomSubtotal + serviceTotal);

    res.json({
      booking_id:     r.booking_id,
      guest_name:     r.guest_name,
      email:          r.email,
      room_id:        r.room_id,
      room_type:      r.room_type,
      check_in:       checkIn  ? checkIn.toISOString().split('T')[0]  : null,
      check_out:      checkOut ? checkOut.toISOString().split('T')[0] : null,
      nights,
      price_per_night: pricePerNight,
      room_subtotal:   roomSubtotal,
      services,
      service_total:   serviceTotal,
      grand_total:     grandTotal,
      payment_method:  r.payment_method  || 'N/A',
      payment_status:  r.payment_status  || 'Pending',
      payment_date:    r.payment_date
        ? new Date(r.payment_date).toLocaleDateString('en-IN')
        : 'N/A'
    });
  } catch (err) {
    console.error('GET /receipt ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// STAFF (admin)
// ═══════════════════════════════════════════════════════════════════════════

app.get('/admin/staff', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, h.name AS hotel_name FROM staff s
       LEFT JOIN hotel h ON s.hotel_id = h.hotel_id
       ORDER BY s.staff_id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/admin/addStaff', async (req, res) => {
  const { name, role, salary, shift, hotel_id } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Staff name is required.' });
  try {
    const [result] = await pool.query(
      'INSERT INTO staff (name, role, salary, shift, hotel_id) VALUES (?,?,?,?,?)',
      [name, role || null, salary || 0, shift || null, hotel_id || null]
    );
    res.json({ success: true, staff_id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/admin/deleteStaff/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM staff WHERE staff_id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// LEGACY /insert (backward-compatible)
// ═══════════════════════════════════════════════════════════════════════════
app.post('/insert', async (req, res) => {
  const { name, phone, email, address, id_proof } = req.body;
  try {
    await pool.query(
      'INSERT INTO guest (name, phone, email, address, id_proof) VALUES (?,?,?,?,?)',
      [name, phone, email, address, id_proof]
    );
    res.json({ success: true, message: 'Guest added successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ LuxeStay server running → http://localhost:${PORT}`);
  console.log(`   DB: ${process.env.DB_NAME} @ ${process.env.DB_HOST}`);
});