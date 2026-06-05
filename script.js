/**
 * LuxeStay — Shared Frontend Script
 * Handles: Auth, Booking, Cancel, Toast notifications, Booking-page init
 */

const API = "http://localhost:4000";

// ═══════════════════════════════════════════════════════════════════════
// GUEST AUTH
// ═══════════════════════════════════════════════════════════════════════

async function loginGuest() {
  const email    = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    showToast("Please enter email and password.", "error");
    return;
  }

  try {
    const res  = await fetch(`${API}/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      showToast(data.message || "Login failed.", "error");
      return;
    }

    localStorage.setItem("guest_id",    data.guest_id);
    localStorage.setItem("guest_name",  data.name);
    localStorage.setItem("guest_email", data.email);

    showToast(`Welcome back, ${data.name}!`, "success");
    setTimeout(() => { window.location.href = "mybookings.html"; }, 1000);
  } catch {
    showToast("Server unreachable. Make sure Node.js is running on port 4000.", "error");
  }
}

async function addGuest() {
  const name            = document.getElementById("newName")?.value?.trim();
  const phone           = document.getElementById("newPhone")?.value?.trim();
  const email           = document.getElementById("newEmail")?.value?.trim();
  const address         = document.getElementById("newAddress")?.value?.trim();
  const id_proof        = document.getElementById("newIdProof")?.value?.trim();
  const password        = document.getElementById("newPassword")?.value;
  const confirmPassword = document.getElementById("confirmPassword")?.value;

  if (!name || !email || !password) {
    showToast("Name, email and password are required.", "error");
    return;
  }
  if (password !== confirmPassword) {
    showToast("Passwords do not match.", "error");
    return;
  }
  if (password.length < 6) {
    showToast("Password must be at least 6 characters.", "error");
    return;
  }

  try {
    const res  = await fetch(`${API}/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, phone, email, address, id_proof, password })
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      showToast(data.message || "Registration failed.", "error");
      return;
    }

    localStorage.setItem("guest_id",    data.guest_id);
    localStorage.setItem("guest_name",  name);
    localStorage.setItem("guest_email", email);

    showToast("Account created! Redirecting to your bookings…", "success");
    setTimeout(() => { window.location.href = "mybookings.html"; }, 1200);
  } catch {
    showToast("Server unreachable. Make sure Node.js is running on port 4000.", "error");
  }
}

// ═══════════════════════════════════════════════════════════════════════
// BOOKING
// ═══════════════════════════════════════════════════════════════════════

async function saveBooking() {
  const guest_id = localStorage.getItem("guest_id");
  if (!guest_id) {
    showToast("Please login before booking.", "error");
    setTimeout(() => { window.location.href = "login.html"; }, 1000);
    return;
  }

  const room_id   = localStorage.getItem("selected_room_id");
  const check_in  = document.getElementById("checkIn")?.value;
  const check_out = document.getElementById("checkOut")?.value;

  // Read grand total from the display span (not the hidden input, which may lag)
  const grandTotalEl  = document.getElementById("grandTotal");
  const totalAmountEl = document.getElementById("totalAmount");
  
  // Safely strip commas before parsing
  let total_amount = 0;
  if (grandTotalEl) {
    total_amount = parseFloat(grandTotalEl.innerText.replace(/,/g, '')) || 0;
  } else if (totalAmountEl) {
    total_amount = parseFloat(totalAmountEl.value) || 0;
  }

  // Validations
  if (!room_id)   { showToast("No room selected. Go back and choose a room.", "error"); return; }
  if (!check_in)  { showToast("Please select a check-in date.", "error"); return; }
  if (!check_out) { showToast("Please select a check-out date.", "error"); return; }

  const ciDate = new Date(check_in);
  const coDate = new Date(check_out);
  if (coDate <= ciDate) {
    showToast("Check-out must be after check-in.", "error");
    return;
  }
  if (total_amount <= 0) {
    showToast("Amount is 0. Please check dates.", "error");
    return;
  }

  // Collect selected services — include service_id for DB junction table
  const services = [];
  document.querySelectorAll(".serviceCheck:checked").forEach(c => {
    services.push({
      service_id:   parseInt(c.getAttribute("data-service-id") || "0"),
      service_name: c.getAttribute("data-name"),
      cost:         parseFloat(c.getAttribute("data-cost") || "0")
    });
  });

  // Disable button while submitting
  const btn = document.querySelector("button[onclick='saveBooking()']");
  if (btn) { btn.disabled = true; btn.textContent = "Saving…"; }

  try {
    const res  = await fetch(`${API}/saveBooking`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ guest_id, room_id, check_in, check_out, total_amount, services })
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      showToast(data.message || "Booking failed.", "error");
      if (btn) { btn.disabled = false; btn.innerHTML = "Proceed to Payment"; }
      return;
    }

    localStorage.setItem("booking_id", data.booking_id);
    localStorage.setItem("last_total",  total_amount);

    showToast("Booking confirmed! Proceeding to payment…", "success");
    setTimeout(() => { window.location.href = "payment.html"; }, 1000);
  } catch {
    showToast("Server unreachable. Check Node.js on port 4000.", "error");
    if (btn) { btn.disabled = false; btn.innerHTML = "Proceed to Payment"; }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// CANCEL BOOKING
// ═══════════════════════════════════════════════════════════════════════

async function cancelBooking(booking_id) {
  if (!confirm(`Cancel booking #${booking_id}? This cannot be undone.`)) return;
  try {
    const res  = await fetch(`${API}/cancelBooking/${booking_id}`, { method: "POST" });
    const data = await res.json();

    if (!res.ok || !data.success) {
      showToast(data.message || "Could not cancel booking.", "error");
      return;
    }

    showToast("Booking cancelled.", "success");
    if (typeof fetchBookings === "function") fetchBookings();
  } catch {
    showToast("Server unreachable.", "error");
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════

function showToast(message, type = "info") {
  document.querySelectorAll(".luxe-toast").forEach(t => t.remove());

  const colors = {
    success: { bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.5)",  color: "#6ee7b7", icon: "✅" },
    error:   { bg: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.5)", color: "#fca5a5", icon: "❌" },
    info:    { bg: "rgba(96,165,250,0.15)",  border: "rgba(96,165,250,0.5)",  color: "#93c5fd", icon: "ℹ️" }
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement("div");
  toast.className = "luxe-toast";
  toast.style.cssText = `
    position:fixed; bottom:28px; right:28px; z-index:99999;
    padding:14px 22px; border-radius:10px; max-width:400px;
    background:${c.bg}; border:1px solid ${c.border}; color:${c.color};
    font-size:0.88rem; font-weight:600; backdrop-filter:blur(12px);
    box-shadow:0 8px 32px rgba(0,0,0,0.4); animation: toastIn 0.3s ease;
  `;
  toast.textContent = `${c.icon}  ${message}`;

  if (!document.getElementById("toast-keyframes")) {
    const style = document.createElement("style");
    style.id = "toast-keyframes";
    style.textContent = `
      @keyframes toastIn  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      @keyframes toastOut { from { opacity:1; }                              to { opacity:0; transform:translateY(16px); } }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "toastOut 0.4s ease forwards";
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ═══════════════════════════════════════════════════════════════════════
// BOOKING PAGE INITIALISATION (only runs on booking.html)
// ═══════════════════════════════════════════════════════════════════════

window.addEventListener("DOMContentLoaded", () => {
  // Guard: only run on booking.html (which has #pricePerNight)
  const priceEl = document.getElementById("pricePerNight");
  if (!priceEl) return;

  const roomId    = localStorage.getItem("selected_room_id");
  const hotelId   = localStorage.getItem("selected_hotel_id");
  const guestName = localStorage.getItem("guest_name");
  const guestId   = localStorage.getItem("guest_id");

  // Populate guest info
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val || "—"; };
  setEl("guestName",      guestName || "Guest");
  setEl("guestIdDisplay", guestId);
  setEl("selectedRoomId", roomId);

  if (!roomId) {
    showToast("No room selected. Please choose a room first.", "error");
    setTimeout(() => { window.location.href = "hotels.html"; }, 2000);
    return;
  }

  if (!guestId) {
    showToast("Please login to continue with your booking.", "error");
    setTimeout(() => { window.location.href = "login.html"; }, 2000);
    return;
  }

  // Set today as minimum check-in date
  const today = new Date().toISOString().split("T")[0];
  const checkInEl  = document.getElementById("checkIn");
  const checkOutEl = document.getElementById("checkOut");
  if (checkInEl)  checkInEl.min  = today;
  if (checkOutEl) checkOutEl.min = today;

  // Fetch room price — try by hotel_id first, fall back to single-room API
  const roomFetchUrl = hotelId && hotelId !== "0"
    ? `${API}/rooms/${hotelId}`
    : `${API}/room/${roomId}`;

  fetch(roomFetchUrl)
    .then(r => r.json())
    .then(data => {
      // data is either an array (rooms by hotel) or a single room object
      const room = Array.isArray(data)
        ? data.find(r => r.room_id == roomId)
        : (data.room_id == roomId ? data : null);

      if (room) {
        const price = parseFloat(room.price_per_night);
        priceEl.innerText = price.toLocaleString("en-IN");
        const summaryPrice = document.getElementById("summaryPrice");
        if (summaryPrice) summaryPrice.innerText = price.toLocaleString("en-IN");
        // Store for use in updateTotals
        priceEl.setAttribute("data-price", price);
      } else {
        showToast("Could not load room price. Check that the hotel is correct.", "error");
      }
    })
    .catch(() => showToast("Failed to fetch room details.", "error"));

  // Fetch available services and render checkboxes with service_id
  fetch(`${API}/services`)
    .then(r => r.json())
    .then(services => {
      const list = document.getElementById("serviceList");
      if (!list) return;
      if (!services || !services.length) {
        list.innerHTML = "<p style='color:var(--muted);'>No extra services available.</p>";
        return;
      }
      list.innerHTML = services.map(s => `
        <label style="display:flex;align-items:center;gap:12px;margin-bottom:12px;cursor:pointer;padding:8px 12px;border-radius:8px;border:1px solid var(--border);transition:border-color 0.2s;">
          <input type="checkbox" class="serviceCheck"
            data-service-id="${s.service_id}"
            data-name="${s.service_name}"
            data-cost="${s.cost}"
            style="width:16px;height:16px;accent-color:#c9a84c;">
          <span style="flex:1;">${s.service_name}</span>
          <span style="color:var(--primary-light);font-weight:600;">₹${parseFloat(s.cost).toLocaleString("en-IN")}</span>
        </label>
      `).join("");
    })
    .catch(() => {
      const list = document.getElementById("serviceList");
      if (list) list.innerHTML = "<p style='color:var(--muted);'>Services could not be loaded.</p>";
    });

  // Night calculation: fires on date change
  function recalcNights() {
    const ci = new Date(checkInEl?.value);
    const co = new Date(checkOutEl?.value);

    if (!checkInEl?.value || !checkOutEl?.value) return;
    if (isNaN(ci) || isNaN(co)) return;

    // Auto-fix: if checkout ≤ checkin, push checkout one day ahead
    if (co <= ci) {
      const nextDay = new Date(ci);
      nextDay.setDate(nextDay.getDate() + 1);
      checkOutEl.value = nextDay.toISOString().split("T")[0];
      checkOutEl.min   = checkOutEl.value;
    }

    const nights = Math.max(0, Math.round(
      (new Date(checkOutEl.value) - new Date(checkInEl.value)) / (1000 * 60 * 60 * 24)
    ));

    setEl("nights",        nights);
    setEl("summaryNights", nights);

    // Trigger updateTotals (defined in booking.html inline script)
    if (typeof updateTotals === "function") updateTotals();
  }

  if (checkInEl) {
    checkInEl.addEventListener("change", () => {
      // Push checkout minimum forward when check-in changes
      if (checkOutEl) {
        const nextDay = new Date(checkInEl.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutEl.min = nextDay.toISOString().split("T")[0];
        // If existing checkout is now invalid, clear it
        if (checkOutEl.value && new Date(checkOutEl.value) <= new Date(checkInEl.value)) {
          checkOutEl.value = "";
          setEl("nights",        "0");
          setEl("summaryNights", "0");
          if (typeof updateTotals === "function") updateTotals();
          return;
        }
      }
      recalcNights();
    });
  }

  if (checkOutEl) {
    checkOutEl.addEventListener("change", recalcNights);
  }
});
