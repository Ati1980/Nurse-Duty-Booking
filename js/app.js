/**
 * Nurse Duty Booking & Roster System
 * Modern Blue Glassmorphism Theme
 * Multi-Role Auth, Main Monthly Calendar with All Shifts, 
 * Shift Selection by Actual Nurse Count, User-Specific View & Shift Optimizer
 */

// 1. Data Definitions
const ADMIN_CREDENTIALS = {
  username: "Admin",
  password: "1234"
};

const DEFAULT_NURSES = [
  { id: "6100001", num: 1, name: "น.ส.ภิญญดา คำผาเชื้อ", pin: "0001", order: 1, color: "#c026d3", textColor: "#ffffff", bgSoft: "#fae8ff", border: "#f0abfc" }, // สีม่วงมาเจนต้า สดใส ชัดเจน
  { id: "6100002", num: 2, name: "น.ส.จำปา สิมมา", pin: "0002", order: 2, color: "#dc2626", textColor: "#ffffff", bgSoft: "#fee2e2", border: "#fca5a5" }, // สีแดงสดใส แตกต่างจากเลข 1 อย่างชัดเจน
  { id: "6100005", num: 3, name: "น.ส.ระวิวรรณ รัตนปัญญา", pin: "0005", order: 3, color: "#0284c7", textColor: "#ffffff", bgSoft: "#e0f2fe", border: "#7dd3fc" },
  { id: "6100013", num: 4, name: "น.ส.หิรัญญา แสนสุข", pin: "0013", order: 4, color: "#f43f5e", textColor: "#ffffff", bgSoft: "#fff1f2", border: "#fecdd3" },
  { id: "6100015", num: 5, name: "น.ส.วชิราพรรณ อานุพินิจ", pin: "0015", order: 5, color: "#ea580c", textColor: "#ffffff", bgSoft: "#ffedd5", border: "#fdba74" },
  { id: "6100021", num: 6, name: "น.ส.ประทุมวัน ชัยยันต์", pin: "0021", order: 6, color: "#2563eb", textColor: "#ffffff", bgSoft: "#dbeafe", border: "#93c5fd" },
  { id: "6100057", num: 7, name: "น.ส.วิชชุดา ศรีหลง", pin: "0057", order: 7, color: "#eab308", textColor: "#713f12", bgSoft: "#fef9c3", border: "#fde047" },
  { id: "6100063", num: 8, name: "น.ส.อังสุมาลี เพียอามาตย์", pin: "0063", order: 8, color: "#1e3a8a", textColor: "#ffffff", bgSoft: "#e0e7ff", border: "#a5b4fc" },
  { id: "6100067", num: 10, name: "น.ส.สุชาวดี คำอู", pin: "0067", order: 9, color: "#06b6d4", textColor: "#ffffff", bgSoft: "#cffafe", border: "#67e8f9" },
  { id: "6100068", num: 11, name: "น.ส.ภัทราภรณ์ หล้าหนองเรือ", pin: "0068", order: 10, color: "#f97316", textColor: "#ffffff", bgSoft: "#ffedd5", border: "#fdba74" },
  { id: "6100070", num: 12, name: "น.ส.ปวีณ์ริศา อินทรพิมพ์", pin: "0070", order: 11, color: "#d97706", textColor: "#ffffff", bgSoft: "#fef3c7", border: "#fcd34d" },
  { id: "6100074", num: 13, name: "น.ส.วริศรา ศรีใส", pin: "0074", order: 12, color: "#8b5cf6", textColor: "#ffffff", bgSoft: "#ede9fe", border: "#c4b5fd" },
  { id: "6100076", num: 14, name: "น.ส.วิไลจิตร กุลทวง", pin: "0076", order: 13, color: "#15803d", textColor: "#ffffff", bgSoft: "#dcfce7", border: "#86efac" },
  { id: "6100075", num: 15, name: "น.ส.สิริณญา วิเศษวุธ", pin: "0075", order: 14, color: "#84cc16", textColor: "#1f2937", bgSoft: "#ecfccb", border: "#bef264" }
];

let NURSES = [];

// Helper functions for dynamic nurse colors & contrast
function getContrastColor(hex) {
  if (!hex) return '#ffffff';
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 150) ? '#1f2937' : '#ffffff';
}

function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(37, 99, 235, ${alpha})`;
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function loadNurses() {
  const saved = localStorage.getItem('nurse_master_list');
  if (saved) {
    try {
      NURSES = JSON.parse(saved);
      // Migrate nurse 1 and 2 colors if they still have old reddish colors
      if (NURSES.length >= 2) {
        if (NURSES[0].color === '#e11d48') {
          NURSES[0].color = '#c026d3';
          NURSES[0].bgSoft = '#fae8ff';
          NURSES[0].border = '#f0abfc';
          NURSES[0].textColor = '#ffffff';
        }
        if (NURSES[1].color !== '#dc2626') {
          NURSES[1].color = '#dc2626';
          NURSES[1].bgSoft = '#fee2e2';
          NURSES[1].border = '#fca5a5';
          NURSES[1].textColor = '#ffffff';
        }
      }
    } catch (e) {
      NURSES = JSON.parse(JSON.stringify(DEFAULT_NURSES));
    }
  } else {
    NURSES = JSON.parse(JSON.stringify(DEFAULT_NURSES));
    saveNurses();
  }
}

function saveNurses() {
  localStorage.setItem('nurse_master_list', JSON.stringify(NURSES));
}

// Initial nurse load
loadNurses();

// Shift Mode: 2 = 2 เวร/วัน (เช้า, บ่าย), 3 = 3 เวร/วัน (เช้า, บ่าย, ดึก)
let shiftMode = parseInt(localStorage.getItem('nurse_shift_mode') || '3');

function getActiveShifts() {
  return shiftMode === 2 ? ['M', 'A'] : ['M', 'A', 'N'];
}

window.setShiftMode = function(mode) {
  shiftMode = mode;
  localStorage.setItem('nurse_shift_mode', mode);
  updateShiftModeUI();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminView();
};

function updateShiftModeUI() {
  const btn2 = document.getElementById('mode2ShiftBtn');
  const btn3 = document.getElementById('mode3ShiftBtn');
  if (btn2 && btn3) {
    if (shiftMode === 2) {
      btn2.className = "px-3 py-1 rounded-lg text-xs font-black bg-blue-700 text-white shadow-xs transition";
      btn3.className = "px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 transition";
    } else {
      btn3.className = "px-3 py-1 rounded-lg text-xs font-black bg-blue-700 text-white shadow-xs transition";
      btn2.className = "px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 transition";
    }
  }

  // Header shift pills reflect active shift mode
  const headerNPill = document.getElementById('headerShiftNPill');
  if (headerNPill) {
    headerNPill.style.display = (shiftMode === 2 ? 'none' : 'inline-block');
  }

  // Hide or show 'N' (เวรดึก) in quick booking modal
  const shiftNContainer = document.getElementById('shiftBtnContainerN') || document.querySelector('input[name="modalShift"][value="N"]')?.closest('label');
  if (shiftNContainer) {
    shiftNContainer.style.display = (shiftMode === 2 ? 'none' : 'flex');
    if (shiftMode === 2) {
      const nCb = shiftNContainer.querySelector('input[type="checkbox"]');
      if (nCb) nCb.checked = false;
      shiftNContainer.classList.remove('is-active');
    }
  }

  // Hide or show 'N' (เวรดึก) in cell edit modal
  const cellShiftNCont = document.getElementById('cellShiftNContainer');
  if (cellShiftNCont) {
    cellShiftNCont.style.display = (shiftMode === 2 ? 'none' : 'flex');
  }

  // Hide or show 'N' in nurse personal stats cards
  const nurseStatN = document.getElementById('nurseStatNCard');
  const nurseStatsGrid = document.getElementById('nursePersonalStatsContainer');
  if (nurseStatN) {
    nurseStatN.style.display = (shiftMode === 2 ? 'none' : 'block');
  }
  if (nurseStatsGrid) {
    if (shiftMode === 2) {
      nurseStatsGrid.className = "grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6";
    } else {
      nurseStatsGrid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6";
    }
  }

  // Adjust modal shift options container
  const modalShiftCont = document.getElementById('modalShiftOptionsContainer');
  if (modalShiftCont) {
    modalShiftCont.className = (shiftMode === 2 ? 'grid grid-cols-2 gap-2.5' : 'grid grid-cols-3 gap-2.5');
  }
  syncShiftToggleVisuals();
}

function syncShiftToggleVisuals() {
  const checkboxes = document.querySelectorAll('input[name="modalShift"]');
  checkboxes.forEach(cb => {
    const parent = cb.closest('.shift-toggle-btn');
    if (parent) {
      if (cb.checked) {
        parent.classList.add('is-active');
      } else {
        parent.classList.remove('is-active');
      }
    }
  });
}

function initShiftToggleListeners() {
  const cont = document.getElementById('modalShiftOptionsContainer');
  if (!cont || cont.__listenersBound) return;
  cont.__listenersBound = true;
  cont.addEventListener('change', (e) => {
    if (e.target && e.target.name === 'modalShift') {
      syncShiftToggleVisuals();
    }
  });
}

// แสดงวันที่ เวลา แบบ Real-time ทุกหน้า ตรงกลาง กรอบที่ 2
function updateRealTimeClock() {
  const dateEl = document.getElementById('realTimeClockDate');
  const timeEl = document.getElementById('realTimeClockTime');
  if (!dateEl || !timeEl) return;

  const now = new Date();
  const daysOfWeek = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
  const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  const dayName = daysOfWeek[now.getDay()];
  const dayNum = now.getDate();
  const monthName = thaiMonthsShort[now.getMonth()];
  const yearBE = now.getFullYear() + 543;

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  dateEl.textContent = `${dayName}ที่ ${dayNum} ${monthName} ${yearBE}`;
  timeEl.textContent = `${hh}:${mm}:${ss} น.`;
}

const SHIFTS = {
  M: { id: 'M', code: 'ช', name: 'เวรเช้า', time: '08:30 - 16:30 น.', hours: 8, badge: 'shift-m', icon: '☀️' },
  A: { id: 'A', code: 'บ', name: 'เวรบ่าย', time: '16:30 - 00:30 น.', hours: 8, badge: 'shift-a', icon: '⛅' },
  N: { id: 'N', code: 'ด', name: 'เวรดึก', time: '00:30 - 08:30 น.', hours: 8, badge: 'shift-n', icon: '🌙' }
};

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// ลำดับวันตามปฏิทินสากล เริ่มจากวันอาทิตย์ (Sunday) ตัวอักษรใหญ่ชัดเจน
const CALENDAR_HEADERS = [
  { th: "อาทิตย์", short: "อา.", en: "Sun", isWeekend: true, headerClass: "bg-rose-100/90 text-rose-800 border-rose-300" },
  { th: "จันทร์", short: "จ.", en: "Mon", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-800 border-slate-200" },
  { th: "อังคาร", short: "อ.", en: "Tue", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-800 border-slate-200" },
  { th: "พุธ", short: "พ.", en: "Wed", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-800 border-slate-200" },
  { th: "พฤหัสบดี", short: "พฤ.", en: "Thu", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-800 border-slate-200" },
  { th: "ศุกร์", short: "ศ.", en: "Fri", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-800 border-slate-200" },
  { th: "เสาร์", short: "ส.", en: "Sat", isWeekend: true, headerClass: "bg-purple-100/90 text-purple-800 border-purple-300" }
];

// 2. Application State & Dynamic Start Month (ปีเริ่มต้น 2569 / 2026 ถึง 2575 / 2032)
const now = new Date();
let defaultMonth = now.getMonth() + 1; // เดือนปัจจุบัน + 1
let defaultYear = now.getFullYear();
if (defaultMonth > 11) {
  defaultMonth = 0;
  defaultYear++;
}
// Clamp defaultYear to range 2026 - 2032 per requirements
if (defaultYear < 2026) defaultYear = 2026;
if (defaultYear > 2032) defaultYear = 2032;

let currentUser = null;
let currentYear = defaultYear;
let currentMonth = defaultMonth;
let activeView = 'dashboard'; // 'dashboard', 'personal', 'admin'
let adminActiveSubView = 'matrix'; // 'matrix', 'daily', 'summary', 'vacancies'
let dashboardShiftFilter = 'ALL'; // 'ALL', 'UNASSIGNED', 'M', 'A', 'N'
let searchQuery = '';

let monthState = {
  round: 1,
  round1: {},
  round2: {},
  roster: {},
  isConfirmed: false
};

let activeEditNurseId = null;
let activeEditDay = null;

// Context for shift clicked before login
let pendingShiftSelection = null;

// Context for shift quick action modal
let activeModalShiftContext = null;

// 3. Helper Functions
function getDaysCount(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayIndex(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
}

function getStorageKey() {
  return `nurse_system_${currentYear}_${currentMonth}`;
}

function saveMonthState() {
  localStorage.setItem(getStorageKey(), JSON.stringify(monthState));
}

function loadMonthState() {
  // One-time reset of previous mock data so bookings start completely clean (0 booked)
  if (!localStorage.getItem('nurse_booking_v4_clean_reset')) {
    for (let y = 2024; y <= 2035; y++) {
      for (let m = 0; m <= 11; m++) {
        localStorage.removeItem(`nurse_system_${y}_${m}`);
      }
    }
    localStorage.setItem('nurse_booking_v4_clean_reset', 'true');
  }

  const raw = localStorage.getItem(getStorageKey());
  if (raw) {
    try {
      monthState = JSON.parse(raw);
      if (monthState.isConfirmed === undefined) monthState.isConfirmed = false;
    } catch (e) {
      initFreshMonth();
    }
  } else {
    initFreshMonth();
  }
}

function initFreshMonth() {
  monthState = {
    round: 1,
    round1: {},
    round2: {},
    roster: {},
    isConfirmed: false
  };
  saveMonthState();
}

// 4. Authentication Logic & Password Toggle
window.togglePasswordVisibility = function(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input || !icon) return;

  if (input.type === 'password') {
    input.type = 'text';
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />`;
  } else {
    input.type = 'password';
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
  }
};

window.openNurseLoginModal = function(optionalContext) {
  const modal = document.getElementById('nurseLoginModal');
  const sel = document.getElementById('modalLoginNurseIdSelect');
  const pinInput = document.getElementById('modalLoginNursePin');
  const banner = document.getElementById('nurseLoginTargetBanner');
  
  sel.innerHTML = NURSES.map(n => `<option value="${n.id}">[${n.id}] ${n.name}</option>`).join('');
  if (pinInput) pinInput.value = '';

  if (optionalContext && optionalContext.day && optionalContext.shift) {
    pendingShiftSelection = optionalContext;
    banner.classList.remove('hidden');
    banner.innerHTML = `📌 คุณกำลังจะเลือก: <b>วันที่ ${optionalContext.day} ${SHIFTS[optionalContext.shift].name} (${SHIFTS[optionalContext.shift].time.split(' ')[0]})</b><br>กรุณาเลือกรหัสพยาบาลและกรอก PIN เพื่อยืนยันการจองเวรนี้`;
  } else {
    pendingShiftSelection = null;
    banner.classList.add('hidden');
  }

  modal.classList.remove('hidden');
};

window.closeNurseLoginModal = function() {
  document.getElementById('nurseLoginModal').classList.add('hidden');
  pendingShiftSelection = null;
};

window.openAdminLoginModal = function() {
  const modal = document.getElementById('adminLoginModal');
  const passInput = document.getElementById('modalAdminPasswordOnly');
  if (passInput) passInput.value = '';
  modal.classList.remove('hidden');
};

window.closeAdminLoginModal = function() {
  document.getElementById('adminLoginModal').classList.add('hidden');
};

function initAuth() {
  const savedUser = localStorage.getItem('nurse_current_user');
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      currentUser = parsed;
    } catch (e) {
      currentUser = null;
    }
  } else {
    currentUser = null;
  }
  updateAuthUI();
}

window.showToast = function(message, duration = 3000) {
  let toast = document.getElementById('appToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToastNotification';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
};

window.handleAdminRefresh = function() {
  loadMonthState();
  renderAdminView();
  renderPublicDashboard();
  window.showToast('🔄 รีเฟรชและอัปเดตข้อมูลตารางเวรล่าสุดเรียบร้อยแล้ว');
};

function loginAsNurse(nurseId, enteredPin) {
  const nurse = NURSES.find(n => n.id === nurseId);
  if (!nurse) {
    alert('ไม่พบรหัสพยาบาลนี้ในระบบ');
    return false;
  }

  // Check PIN
  if (enteredPin && enteredPin.trim() !== nurse.pin) {
    alert(`รหัสผ่าน (PIN) ไม่ถูกต้อง`);
    return false;
  }

  currentUser = {
    role: 'nurse',
    nurseId: nurse.id,
    name: nurse.name
  };
  localStorage.setItem('nurse_current_user', JSON.stringify(currentUser));
  closeNurseLoginModal();
  updateAuthUI();

  // If there was a pending shift selected before login
  if (pendingShiftSelection) {
    const { day, shift } = pendingShiftSelection;
    if (!monthState.roster[nurse.id]) monthState.roster[nurse.id] = {};
    if (!monthState.roster[nurse.id][day]) monthState.roster[nurse.id][day] = [];
    if (!monthState.roster[nurse.id][day].includes(shift)) {
      monthState.roster[nurse.id][day].push(shift);
      saveMonthState();
    }
    alert(`✓ บันทึกการเลือก ${SHIFTS[shift].name} วันที่ ${day} สำหรับ ${nurse.name} เรียบร้อยแล้ว`);
    pendingShiftSelection = null;
  }

  renderPublicDashboard();
  switchView('personal');
  return true;
}

function loginAsAdmin(password) {
  if (!password) {
    alert('กรุณากรอกรหัสผ่าน Admin');
    return false;
  }
  if (password === ADMIN_CREDENTIALS.password) {
    currentUser = {
      role: 'admin',
      name: 'ผู้ดูแลระบบ (Admin)'
    };
    localStorage.setItem('nurse_current_user', JSON.stringify(currentUser));
    closeAdminLoginModal();
    updateAuthUI();
    switchView('admin');
    return true;
  }
  alert('รหัสผ่าน Admin ไม่ถูกต้อง');
  return false;
}

window.handleLogout = function() {
  currentUser = null;
  localStorage.removeItem('nurse_current_user');
  updateAuthUI();
  switchView('dashboard');
};

window.logout = window.handleLogout;
window.logoutAdmin = window.handleLogout;

function updateAuthUI() {
  const unauthButtons = document.getElementById('unauthButtons');
  const authControls = document.getElementById('authControls');
  const userProfileBadge = document.getElementById('userProfileBadge');
  const headerLogoutText = document.getElementById('headerLogoutBtnText');

  if (!currentUser) {
    if (unauthButtons) unauthButtons.classList.remove('hidden');
    if (authControls) authControls.classList.add('hidden');
  } else {
    if (unauthButtons) unauthButtons.classList.add('hidden');
    if (authControls) authControls.classList.remove('hidden');

    if (currentUser.role === 'admin') {
      if (headerLogoutText) headerLogoutText.innerText = 'ออกจากหน้า Admin';
      userProfileBadge.innerHTML = `
        <div class="flex items-center gap-2 bg-indigo-900/60 border border-white/30 px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40"></span>
          <span class="font-bold text-white">👑 ผู้ดูแลระบบ (Admin)</span>
        </div>
      `;
    } else {
      if (headerLogoutText) headerLogoutText.innerText = 'ออกจากระบบ';
      userProfileBadge.innerHTML = `
        <div class="flex items-center gap-2 bg-white/20 border border-white/30 px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-emerald-300/40"></span>
          <span class="font-bold text-white">👩‍⚕️ ${currentUser.name}</span>
          <span class="font-mono text-blue-100">(${currentUser.nurseId})</span>
        </div>
      `;
    }
    updateNavSwitcher(activeView);
  }
}

// Update Active/Inactive Switcher Buttons in Top Navigation Header
function updateNavSwitcher(viewName) {
  const dashBtn = document.getElementById('navDashboardBtn');
  const personalBtn = document.getElementById('navMyScheduleBtn');
  const excelBtn = document.getElementById('navExcelViewBtn');
  const adminBtn = document.getElementById('navAdminPortalBtn');

  const isConfirmed = !!(monthState && monthState.isConfirmed);
  const isAdmin = !!(currentUser && currentUser.role === 'admin');
  const isNurse = !!(currentUser && currentUser.role === 'nurse');

  const configs = [
    { el: dashBtn, target: 'dashboard', label: 'ปฏิทินหลัก', icon: '📊', isAllowed: true },
    { el: personalBtn, target: 'personal', label: 'ตารางเวรของฉัน', icon: '📅', isAllowed: isNurse },
    { el: excelBtn, target: 'excel', label: 'ตารางตามหมายเลข', icon: '📋', isAllowed: isConfirmed || isAdmin },
    { el: adminBtn, target: 'admin', label: `ตารางรวม ${NURSES.length} ท่าน`, icon: '👑', isAllowed: isAdmin }
  ];

  configs.forEach(({ el, target, label, icon, isAllowed }) => {
    if (!el) return;
    if (!isAllowed) {
      el.className = 'nav-tab-btn hidden';
      return;
    }

    const isActive = (viewName === target);
    if (isActive) {
      el.className = 'nav-tab-btn nav-tab-btn-active';
      el.innerHTML = `
        <span class="text-base sm:text-lg">${icon}</span>
        <span>${label}</span>
        <span class="nav-active-badge">
          <span class="nav-active-dot"></span>
          <span>เปิดอยู่</span>
        </span>
      `;
    } else {
      el.className = 'nav-tab-btn nav-tab-btn-inactive';
      el.innerHTML = `
        <span class="text-base sm:text-lg">${icon}</span>
        <span>${label}</span>
      `;
    }
  });
}

// 5. Global View Switching
window.switchView = function(viewName) {
  // Permission checks
  if (viewName === 'personal' && (!currentUser || currentUser.role !== 'nurse')) {
    openNurseLoginModal();
    return;
  }
  if (viewName === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
    openAdminLoginModal();
    return;
  }
  if (viewName === 'excel') {
    if (!monthState.isConfirmed && (!currentUser || currentUser.role !== 'admin')) {
      alert('ตารางตามหมายเลข (Excel View) จะเปิดให้ดูเมื่อผู้ดูแลระบบได้ยืนยันการจัดตารางเวรทางการแล้วเท่านั้น');
      return;
    }
  }

  activeView = viewName;
  updateNavSwitcher(viewName);

  const publicDashSection = document.getElementById('publicDashboardSection');
  const nurseSection = document.getElementById('nursePersonalSection');
  const adminSection = document.getElementById('adminSection');
  const userExcelSection = document.getElementById('userExcelViewSection');

  // Hide all sections first
  if (publicDashSection) publicDashSection.classList.add('hidden');
  if (nurseSection) nurseSection.classList.add('hidden');
  if (adminSection) adminSection.classList.add('hidden');
  if (userExcelSection) userExcelSection.classList.add('hidden');

  if (viewName === 'dashboard') {
    if (publicDashSection) publicDashSection.classList.remove('hidden');
    renderPublicDashboard();
  } else if (viewName === 'personal') {
    if (nurseSection) nurseSection.classList.remove('hidden');
    renderNurseCalendar();
  } else if (viewName === 'admin') {
    if (adminSection) adminSection.classList.remove('hidden');
    renderAdminView();
  } else if (viewName === 'excel') {
    if (userExcelSection) {
      userExcelSection.classList.remove('hidden');
      const uSecTitle = document.getElementById('userExcelSectionTitle');
      if (uSecTitle) {
        uSecTitle.innerText = `ตารางเวรตามหมายเลข ประจำเดือน ${THAI_MONTHS[currentMonth]} ${currentYear + 543}`;
      }
      renderExcelView('userExcelViewContent');
    }
  }
};

// 6. MAIN MONTHLY CALENDAR DASHBOARD (แสดงทุกวัน ทุกเวร เลือกได้ทุกเวร แสดงจำนวนคนเลือก และเวรที่ไม่มีคนเลือกเด่นชัด ไม่แสดงชื่อในช่อง)
window.setDashboardFilter = function(filter) {
  dashboardShiftFilter = filter;
  ['ALL', 'UNASSIGNED', 'M', 'A', 'N'].forEach(f => {
    const btn = document.getElementById(`filterBtn${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-700 text-white shadow-xs transition";
      } else {
        btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition";
      }
    }
  });
  renderPublicDashboard();
};

function renderPublicDashboard() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  const firstDayIndex = getFirstDayIndex(currentYear, currentMonth);
  const activeShifts = getActiveShifts();

  // Hide or show 'N' filter button based on shift mode
  const nFilterBtn = document.getElementById('filterBtnN');
  if (nFilterBtn) {
    nFilterBtn.style.display = (shiftMode === 2 ? 'none' : 'inline-flex');
  }

  // Render 7-Day Header
  const calHeader = document.getElementById('mainCalendarHeader');
  let hHtml = '';
  CALENDAR_HEADERS.forEach(ch => {
    hHtml += `
      <div class="p-3 md:p-3.5 text-center rounded-2xl border ${ch.headerClass} shadow-xs bg-white/95 backdrop-blur-sm">
        <div class="text-base md:text-lg font-black tracking-wide">${ch.th}</div>
        <div class="text-xs md:text-sm font-bold opacity-75 font-mono">${ch.en}</div>
      </div>
    `;
  });
  calHeader.innerHTML = hHtml;

  // Stat Counters (เปลี่ยนเป็นคำว่า เวร)
  let totalShiftsCount = daysCount * activeShifts.length;
  let unassignedShiftsCount = 0;
  let assignedShiftsCount = 0;
  let totalBookingsCount = 0;

  // Render 7-Day Grid Body
  const calGrid = document.getElementById('mainCalendarGrid');
  let calHtml = '';

  // 1. Pad beginning of month
  for (let pad = 0; pad < firstDayIndex; pad++) {
    calHtml += `
      <div class="main-cal-empty-cell p-3 flex items-start justify-end text-slate-300 select-none">
        <span class="opacity-30 font-mono text-sm">•</span>
      </div>
    `;
  }

  // 2. Render all days 1..daysCount
  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay(); // 0 = Sun .. 6 = Sat
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    let dayHasUnassigned = false;
    let shiftRowsHtml = '';

    // Loop through active shifts (M, A if mode 2, or M, A, N if mode 3)
    activeShifts.forEach(s => {
      const shiftObj = SHIFTS[s];
      const assigned = [];

      NURSES.forEach(n => {
        const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
        if (shifts.includes(s)) assigned.push(n);
      });

      const count = assigned.length;
      totalBookingsCount += count;
      const isUnassigned = (count === 0);

      if (isUnassigned) {
        unassignedShiftsCount++;
        dayHasUnassigned = true;
      } else {
        assignedShiftsCount++;
      }

      // Check Filter
      let isVisible = true;
      if (dashboardShiftFilter === 'UNASSIGNED' && !isUnassigned) isVisible = false;
      if (dashboardShiftFilter === 'M' && s !== 'M') isVisible = false;
      if (dashboardShiftFilter === 'A' && s !== 'A') isVisible = false;
      if (dashboardShiftFilter === 'N' && s !== 'N') isVisible = false;

      // Styling: [โควตาที่ต้องการ: 2 คน] เปลี่ยนเป็นแสดงตามจำนวนพยาบาลที่เลือก
      // และ "ในปฏิทิน ไม่ต้องระบุชื่อ (ระบุเฉพาะใน popup)"
      let rowClass = 'cal-shift-row';
      let statusBadge = '';
      let subText = '';

      if (isUnassigned) {
        // ส่วนเวรใหนที่ยังไม่มีคนเลือกให้แสดงเด่นชัด
        rowClass += ' cal-shift-unassigned';
        statusBadge = `<span class="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow-xs">🚨 ยังไม่มีคนเลือก (0 คน)</span>`;
        subText = `<div class="text-[10px] text-rose-800 font-bold mt-0.5 flex items-center justify-between"><span>⚠️ ยังไม่มีคนเลือก</span><span class="underline">คลิกเพื่อเลือกเวรนี้ ➔</span></div>`;
      } else {
        // แสดงตามจำนวนพยาบาลที่เลือก
        rowClass += ' cal-shift-assigned';
        statusBadge = `<span class="bg-sky-100 text-sky-900 border border-sky-300 text-[10px] px-2 py-0.5 rounded-full font-black">👤 มี ${count} คน</span>`;
        subText = `<div class="text-[10px] text-sky-800 font-medium mt-0.5 flex items-center justify-between"><span>เลือกแล้ว ${count} คน</span><span class="underline text-sky-700">ดูรายชื่อ/เลือกเวร ➔</span></div>`;
      }

      const opacityClass = isVisible ? 'opacity-100' : 'opacity-25 grayscale pointer-events-none';

      shiftRowsHtml += `
        <div class="${rowClass} ${opacityClass}" onclick="handleShiftClick(${d}, '${s}')" title="คลิกเพื่อดูรายชื่อหรือเลือกเวรนี้">
          <div class="flex items-center justify-between gap-1">
            <div class="flex items-center gap-1.5 font-black text-xs text-slate-800">
              <span class="text-base">${shiftObj.icon}</span>
              <span>${shiftObj.name}</span>
            </div>
            ${statusBadge}
          </div>
          ${subText}
        </div>
      `;
    });

    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);

    let dayCardStyle = 'glass-card hover:border-blue-400';
    let dateNumColor = 'text-slate-900';
    let dayBadgeClass = 'bg-slate-100 text-slate-700';

    if (isSunday) {
      dayCardStyle = 'bg-rose-50/70 border-rose-200/90 hover:border-rose-400';
      dateNumColor = 'text-rose-600';
      dayBadgeClass = 'bg-rose-100 text-rose-700';
    } else if (isSaturday) {
      dayCardStyle = 'bg-purple-50/75 border-purple-200/90 hover:border-purple-400';
      dateNumColor = 'text-purple-700';
      dayBadgeClass = 'bg-purple-100 text-purple-700';
    }

    calHtml += `
      <div class="main-cal-day-cell p-3.5 border ${dayCardStyle} shadow-xs">
        <div>
          <!-- Day Header: Big Date Number & Big Day Name -->
          <div class="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-2">
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl md:text-3xl font-black ${dateNumColor}">${d}</span>
              <span class="text-xs md:text-sm font-extrabold px-1.5 py-0.5 rounded ${dayBadgeClass}">
                ${CALENDAR_HEADERS[dayOfWeek].short}
              </span>
            </div>
            <div>
              ${dayHasUnassigned ? '<span class="text-[10px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-full shadow-xs">🚨 มีเวรว่าง</span>' : '<span class="text-[10px] font-bold text-slate-400 font-mono">' + d + '/' + (currentMonth+1) + '</span>'}
            </div>
          </div>

          <!-- All 3 Shifts in this day -->
          <div class="space-y-1.5">
            ${shiftRowsHtml}
          </div>
        </div>

        <div class="mt-2 pt-1 border-t border-slate-100/80 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
          <span>👆 คลิกเลือกได้ทุกเวร</span>
        </div>
      </div>
    `;
  }

  calGrid.innerHTML = calHtml;

  // Update Stat Cards in Header (เปลี่ยนเป็นคำว่า เวร)
  document.getElementById('dashStatTotal').innerText = `${totalShiftsCount} เวร`;
  document.getElementById('dashStatUnassigned').innerText = `${unassignedShiftsCount} เวร`;
  document.getElementById('dashStatAssigned').innerText = `${assignedShiftsCount} เวร`;
  document.getElementById('dashStatBookings').innerText = `${totalBookingsCount} ครั้ง`;
}

// 7. SHIFT CLICK & POPUP MODAL (ระบุรายชื่อพยาบาลเฉพาะใน popup และแสดงตามจำนวนพยาบาล)
window.handleShiftClick = function(day, shift) {
  const shiftObj = SHIFTS[shift];
  const dt = new Date(currentYear, currentMonth, day);
  const dayName = CALENDAR_HEADERS[dt.getDay()].th;

  // Check currently assigned nurses
  const assigned = [];
  NURSES.forEach(n => {
    const shifts = (monthState.roster[n.id] && monthState.roster[n.id][day]) || [];
    if (shifts.includes(shift)) assigned.push(n);
  });

  // If user is NOT logged in: If confirmed, show read-only details; else prompt Nurse login
  if (!currentUser) {
    if (monthState && monthState.isConfirmed) {
      document.getElementById('shiftModalIcon').innerText = shiftObj.icon;
      document.getElementById('shiftModalTitle').innerText = `${shiftObj.name} (${shiftObj.time})`;
      document.getElementById('shiftModalDate').innerText = `วัน${dayName}ที่ ${day} ${THAI_MONTHS[currentMonth]} ${currentYear + 543}`;

      let nursesListHtml = '';
      if (assigned.length > 0) {
        nursesListHtml = `
          <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            ${assigned.map((n, idx) => `
              <div class="flex items-center justify-between py-1.5 px-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">${idx + 1}</span>
                  <span class="font-bold text-slate-800 text-xs">${n.name}</span>
                </div>
                <span class="font-mono text-slate-400 text-[11px]">${n.id}</span>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        nursesListHtml = `
          <div class="p-3 text-center bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl">
            🚨 ยังไม่มีพยาบาลเลือกเวรนี้
          </div>
        `;
      }

      const bodyEl = document.getElementById('shiftModalBody');
      bodyEl.innerHTML = `
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div class="flex justify-between items-center pb-1.5 border-b border-slate-200">
            <span class="text-slate-600 font-medium">จำนวนพยาบาลที่เลือกเวรนี้:</span>
            <span class="font-black text-sm ${assigned.length === 0 ? 'text-rose-600' : 'text-blue-900'}">${assigned.length} ท่าน</span>
          </div>
          <div>
            <span class="text-slate-600 font-bold block mb-1.5">รายชื่อพยาบาลที่เลือกเวรนี้:</span>
            ${nursesListHtml}
          </div>
        </div>
        <div class="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2">
          <span>🔒</span>
          <span>ตารางเวรประจำเดือนนี้ได้รับการยืนยันและประกาศอย่างเป็นทางการแล้ว (ปิดรับการจองหรือแก้ไข)</span>
        </div>
      `;

      const footerEl = document.getElementById('shiftModalFooter');
      footerEl.innerHTML = `
        <button onclick="closeShiftActionModal()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
          ปิดหน้าต่าง
        </button>
      `;

      document.getElementById('shiftActionModal').classList.remove('hidden');
      return;
    }

    openNurseLoginModal({ day, shift });
    return;
  }

  // If logged in as Nurse
  if (currentUser.role === 'nurse') {
    const nurseId = currentUser.nurseId;
    const nurseName = currentUser.name;
    const userCurrentShifts = (monthState.roster[nurseId] && monthState.roster[nurseId][day]) || [];
    const isAlreadyBooked = userCurrentShifts.includes(shift);
    const isConfirmed = !!(monthState && monthState.isConfirmed);

    activeModalShiftContext = { day, shift, nurseId, nurseName, isAlreadyBooked };

    document.getElementById('shiftModalIcon').innerText = shiftObj.icon;
    document.getElementById('shiftModalTitle').innerText = `${shiftObj.name} (${shiftObj.time})`;
    document.getElementById('shiftModalDate').innerText = `วัน${dayName}ที่ ${day} ${THAI_MONTHS[currentMonth]} ${currentYear + 543}`;

    // List of nurses in popup
    let nursesListHtml = '';
    if (assigned.length > 0) {
      nursesListHtml = `
        <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          ${assigned.map((n, idx) => `
            <div class="flex items-center justify-between py-1.5 px-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">${idx + 1}</span>
                <span class="font-bold text-slate-800 text-xs">${n.name}</span>
                ${n.id === nurseId ? '<span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">คุณ</span>' : ''}
              </div>
              <span class="font-mono text-slate-400 text-[11px]">${n.id}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      nursesListHtml = `
        <div class="p-3 text-center bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl">
          🚨 ยังไม่มีพยาบาลเลือกเวรนี้
        </div>
      `;
    }

    let confirmationNotice = '';
    if (isConfirmed) {
      confirmationNotice = `
        <div class="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2">
          <span>🔒</span>
          <span>ตารางเวรประจำเดือนนี้ได้รับการยืนยันและประกาศอย่างเป็นทางการแล้ว (ปิดรับการจองหรือแก้ไข)</span>
        </div>
      `;
    } else {
      confirmationNotice = `
        <div class="p-3 rounded-2xl ${isAlreadyBooked ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-blue-50 border border-blue-200 text-blue-900'} text-xs">
          ${isAlreadyBooked ? `
            <div class="font-bold flex items-center gap-1.5">
              <span>✓ คุณ (${nurseName}) ได้เลือกจองเวรนี้ไว้แล้ว</span>
            </div>
            <div class="text-[11px] mt-1 text-slate-600">คุณสามารถกดยกเลิกเวรนี้ได้หากต้องการเปลี่ยนเวร</div>
          ` : `
            <div class="font-bold">ต้องการเลือกจอง ${shiftObj.name} ในวันนี้หรือไม่?</div>
            <div class="text-[11px] mt-1 text-slate-600">กดยืนยันเพื่อบันทึกการเข้าเวรของคุณเข้าสู่ระบบทันที</div>
          `}
        </div>
      `;
    }

    const bodyEl = document.getElementById('shiftModalBody');
    bodyEl.innerHTML = `
      <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
        <div class="flex justify-between items-center pb-1.5 border-b border-slate-200">
          <span class="text-slate-600 font-medium">จำนวนพยาบาลที่เลือกเวรนี้:</span>
          <span class="font-black text-sm ${assigned.length === 0 ? 'text-rose-600' : 'text-blue-900'}">${assigned.length} ท่าน</span>
        </div>
        <div>
          <span class="text-slate-600 font-bold block mb-1.5">รายชื่อพยาบาลที่เลือกเวรนี้:</span>
          ${nursesListHtml}
        </div>
      </div>
      ${confirmationNotice}
    `;

    const footerEl = document.getElementById('shiftModalFooter');
    if (isConfirmed) {
      footerEl.innerHTML = `
        <button onclick="closeShiftActionModal()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
          ปิดหน้าต่าง
        </button>
      `;
    } else if (isAlreadyBooked) {
      footerEl.innerHTML = `
        <button onclick="closeShiftActionModal()" class="flex-1 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold">
          ปิด
        </button>
        <button onclick="confirmToggleShiftBooking(false)" class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition">
          🗑️ ยกเลิกการเลือกเวรนี้
        </button>
      `;
    } else {
      footerEl.innerHTML = `
        <button onclick="closeShiftActionModal()" class="flex-1 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold">
          ยกเลิก
        </button>
        <button onclick="confirmToggleShiftBooking(true)" class="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow transition">
          ✓ ยืนยันการเลือกเวรนี้
        </button>
      `;
    }

    document.getElementById('shiftActionModal').classList.remove('hidden');
    return;
  }

    // If logged in as Admin: Open booking for vacancy or cell editor
    if (currentUser.role === 'admin') {
      openBookingForVacancy(day, shift);
    }
  };

  window.closeShiftActionModal = function() {
    document.getElementById('shiftActionModal').classList.add('hidden');
    activeModalShiftContext = null;
  };

  window.confirmToggleShiftBooking = function(addShift) {
    if (monthState.isConfirmed && (!currentUser || currentUser.role !== 'admin')) {
      alert('🔒 ตารางเวรประจำเดือนนี้ปิดรับการจองแล้ว');
      return;
    }
    if (!activeModalShiftContext) return;
    const { day, shift, nurseId } = activeModalShiftContext;

    if (!monthState.roster[nurseId]) monthState.roster[nurseId] = {};
    if (!monthState.roster[nurseId][day]) monthState.roster[nurseId][day] = [];

    if (addShift) {
      if (!monthState.roster[nurseId][day].includes(shift)) {
        monthState.roster[nurseId][day].push(shift);
      }
    } else {
      monthState.roster[nurseId][day] = monthState.roster[nurseId][day].filter(s => s !== shift);
    }

    saveMonthState();
    closeShiftActionModal();
    renderPublicDashboard();
    if (activeView === 'personal') renderNurseCalendar();
    if (activeView === 'admin') renderAdminView();
  };

// 8. NURSE PERSONAL CALENDAR VIEW (PAGE หน้า USER จะมองเห็นเฉพาะ USER เลือก)
function renderNurseCalendar() {
  if (!currentUser || currentUser.role !== 'nurse') return;

  const nurseId = currentUser.nurseId;
  const nurseName = currentUser.name;
  const daysCount = getDaysCount(currentYear, currentMonth);
  const firstDayIndex = getFirstDayIndex(currentYear, currentMonth);
  const isConfirmed = !!(monthState && monthState.isConfirmed);

  // Update Section Title with Nurse Name
  const secTitle = document.getElementById('nurseCalendarSectionTitle');
  if (secTitle) {
    secTitle.innerText = `ตารางเวรประจำเดือนของฉัน (${nurseName})`;
  }

  // Status Banner
  const statusBanner = document.getElementById('nurseRoundStatusBanner');
  if (statusBanner) {
    if (isConfirmed) {
      statusBanner.className = `p-4 rounded-2xl border bg-emerald-50/90 border-emerald-300 mb-6 transition shadow-xs`;
      statusBanner.innerHTML = `
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2.5">
            <span class="px-3.5 py-1.5 rounded-xl font-black text-xs bg-emerald-700 text-white shadow-xs">🔒 ยืนยันตารางเวรทางการแล้ว</span>
            <span class="text-xs text-emerald-950 font-bold">ตารางเวรประจำเดือนนี้ได้รับการยืนยันและประกาศอย่างเป็นทางการแล้ว (ปิดรับการจองหรือแก้ไขของเดือนนี้ รอเปิดรอบเดือนถัดไป)</span>
          </div>
          <button onclick="switchView('excel')" class="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer">
            <span>📋</span>
            <span>ดูตารางตามหมายเลข (Excel View)</span>
          </button>
        </div>
      `;
    } else {
      let roundText = `
        <div class="flex items-center gap-2.5">
          <span class="px-3.5 py-1.5 rounded-xl font-black text-xs bg-blue-700 text-white shadow-xs">ตารางเวรส่วนบุคคล</span>
          <span class="text-xs text-blue-950 font-medium">แสดงเฉพาะเวรที่คุณเลือก (คุณสามารถคลิกที่ช่องวันที่เพื่อเพิ่มหรือยกเลิกเวรของคุณได้)</span>
        </div>`;
      statusBanner.className = `p-4 rounded-2xl border bg-blue-50/90 border-blue-200 mb-6 transition shadow-xs`;
      statusBanner.innerHTML = roundText;
    }
  }

  // Handle shortcut & personal booking button
  const personalExcelShortcut = document.getElementById('personalExcelShortcutBtn');
  const personalBookingBtnCont = document.getElementById('personalBookingBtnContainer');

  if (personalExcelShortcut) {
    if (isConfirmed) {
      personalExcelShortcut.classList.remove('hidden');
    } else {
      personalExcelShortcut.classList.add('hidden');
    }
  }

  if (personalBookingBtnCont) {
    if (isConfirmed) {
      personalBookingBtnCont.innerHTML = `
        <button disabled class="px-4 py-2.5 bg-slate-200 text-slate-500 rounded-2xl text-xs sm:text-sm font-bold cursor-not-allowed flex items-center gap-1.5 opacity-80" title="ตารางเวรได้รับการยืนยันแล้ว ปิดรับการจองเพิ่มของเดือนนี้">
          <span>🔒</span>
          <span>ปิดรับการจอง (ยืนยันแล้ว)</span>
        </button>
      `;
    } else {
      personalBookingBtnCont.innerHTML = `
        <button id="personalBookingBtn" onclick="openPersonalBookingModal()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer">
          <span class="text-base sm:text-lg">✍️</span>
          <span>จองหลายวันพร้อมกัน</span>
        </button>
      `;
    }
  }

  // Personal Shift Counts
  const nurseShifts = monthState.roster[nurseId] || {};
  let countM = 0, countA = 0, countN = 0;
  for (let d = 1; d <= daysCount; d++) {
    const arr = nurseShifts[d] || [];
    if (arr.includes('M')) countM++;
    if (arr.includes('A')) countA++;
    if (arr.includes('N') && shiftMode === 3) countN++;
  }
  const totalShifts = shiftMode === 3 ? (countM + countA + countN) : (countM + countA);
  const totalHours = totalShifts * 8;

  document.getElementById('nurseStatM').innerText = `${countM} ครั้ง`;
  document.getElementById('nurseStatA').innerText = `${countA} ครั้ง`;
  const statNEl = document.getElementById('nurseStatN');
  if (statNEl) statNEl.innerText = `${countN} ครั้ง`;
  document.getElementById('nurseStatTotal').innerText = `${totalShifts} เวร (${totalHours} ชม.)`;

  // Render 7-Day Monthly Calendar Grid Header: วัน ใหญ่ขึ้น (text-base md:text-lg)
  const calHeader = document.getElementById('nurseCalendarHeader');
  let hHtml = '';
  CALENDAR_HEADERS.forEach(ch => {
    hHtml += `
      <div class="p-3 md:p-3.5 text-center rounded-2xl border ${ch.headerClass} shadow-xs bg-white/90 backdrop-blur-sm">
        <div class="text-base md:text-lg font-black tracking-wide">${ch.th}</div>
        <div class="text-xs md:text-sm font-bold opacity-75 font-mono">${ch.en}</div>
      </div>
    `;
  });
  calHeader.innerHTML = hHtml;

  // Render 7-Day Monthly Calendar Grid Body: มองเห็นเฉพาะเวรที่ User เลือก
  const calGrid = document.getElementById('nurseCalendarGrid');
  let calHtml = '';

  // Pad beginning of month
  for (let pad = 0; pad < firstDayIndex; pad++) {
    calHtml += `
      <div class="calendar-empty-cell p-2 flex items-start justify-end text-slate-300 select-none">
        <span class="opacity-30 font-mono text-sm">•</span>
      </div>
    `;
  }

  // Days 1..daysCount: Only showing nurse's OWN selected shifts!
  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);
    const dayShifts = nurseShifts[d] || [];

    let shiftBadges = '';
    dayShifts.forEach(s => {
      if (s === 'M') shiftBadges += `<span class="shift-tag shift-m w-full text-center text-xs md:text-sm py-1 font-bold flex items-center justify-center gap-1 shadow-xs"><span>☀️</span> เช้า (08:30-16:30)</span>`;
      if (s === 'A') shiftBadges += `<span class="shift-tag shift-a w-full text-center text-xs md:text-sm py-1 font-bold flex items-center justify-center gap-1 shadow-xs"><span>⛅</span> บ่าย (16:30-00:30)</span>`;
      if (s === 'N' && shiftMode === 3) shiftBadges += `<span class="shift-tag shift-n w-full text-center text-xs md:text-sm py-1 font-bold flex items-center justify-center gap-1 shadow-xs"><span>🌙</span> ดึก (00:30-08:30)</span>`;
    });

    let dayCardStyle = 'glass-card hover:border-blue-400';
    let dateColor = 'text-slate-900';
    let badgeClass = 'bg-slate-100 text-slate-700';

    if (isSunday) {
      dayCardStyle = 'bg-rose-50/70 border-rose-200/90 hover:border-rose-400';
      dateColor = 'text-rose-600';
      badgeClass = 'bg-rose-100 text-rose-700';
    } else if (isSaturday) {
      dayCardStyle = 'bg-purple-50/75 border-purple-200/90 hover:border-purple-400';
      dateColor = 'text-purple-700';
      badgeClass = 'bg-purple-100 text-purple-700';
    }

    let clickAttr = '';
    let emptySlotText = '';
    if (isConfirmed) {
      clickAttr = `onclick="window.showToast('🔒 ตารางเวรประจำเดือนนี้ได้รับการยืนยันทางการแล้ว ปิดรับการแก้ไขหรือจองเพิ่ม')"`;
      emptySlotText = `<span class="text-xs text-slate-300 font-medium italic block text-center py-2">-</span>`;
    } else {
      clickAttr = `onclick="openCellEditor('${nurseId}', ${d})"`;
      emptySlotText = `<span class="text-xs text-slate-400 font-medium italic block text-center py-2 hover:text-blue-600">+ แตะเลือกเวร</span>`;
    }

    calHtml += `
      <div class="calendar-day-cell rounded-2xl border p-3 md:p-3.5 flex flex-col justify-between shadow-xs transition ${dayCardStyle} ${isConfirmed ? 'cursor-default' : 'cursor-pointer'}" ${clickAttr}>
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <span class="text-2xl md:text-3xl font-black ${dateColor}">${d}</span>
          <span class="text-xs md:text-sm font-extrabold px-2 py-0.5 rounded-lg ${badgeClass}">
            ${CALENDAR_HEADERS[dayOfWeek].short}
          </span>
        </div>
        <div class="mt-2 space-y-1.5">
          ${shiftBadges || emptySlotText}
        </div>
      </div>
    `;
  }

  calGrid.innerHTML = calHtml;
}

// 9. ADMIN MASTER MATRIX & CONTROLS
function renderAdminView() {
  renderAdminControls();
  renderAdminSubView();
}

function renderAdminControls() {
  const optBtn = document.getElementById('adminOptimizeBtn');
  const unconfirmBtn = document.getElementById('adminUnconfirmBtn');
  const isConfirmed = !!(monthState && monthState.isConfirmed);

  if (optBtn && unconfirmBtn) {
    if (isConfirmed) {
      optBtn.classList.add('hidden');
      unconfirmBtn.classList.remove('hidden');
    } else {
      optBtn.classList.remove('hidden');
      unconfirmBtn.classList.add('hidden');
    }
  }
}

window.handleUnconfirmSchedule = function() {
  const monthName = THAI_MONTHS[currentMonth];
  const yearBE = currentYear + 543;
  if (confirm(`คุณต้องการยกเลิกการยืนยันตารางเวรประจำเดือน ${monthName} พ.ศ. ${yearBE} ใช่หรือไม่?\n\n(เมื่อยกเลิกแล้ว ระบบจะอนุญาตให้ผู้ดูแลระบบจัดตารางเวรใหม่ และเปิดให้พยาบาลสามารถจองหรือแก้ไขเวรได้อีกครั้ง)`)) {
    monthState.isConfirmed = false;
    saveMonthState();
    renderAdminView();
    renderPublicDashboard();
    updateNavSwitcher(activeView);
    window.showToast('🔓 ปลดล็อกการยืนยันตารางเวรเรียบร้อยแล้ว สามารถจัดตารางใหม่ได้');
  }
};

function renderAdminSubView() {
  const views = ['matrix', 'excel', 'daily', 'summary', 'vacancies'];
  views.forEach(v => {
    const sec = document.getElementById(`${v}ViewSection`);
    if (sec) sec.classList.add('hidden');
    const btn = document.getElementById(`view${v.charAt(0).toUpperCase() + v.slice(1)}Btn`);
    if (btn) {
      if (v === adminActiveSubView) {
        btn.className = "px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-700 text-white shadow-xs transition";
      } else {
        btn.className = "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 transition";
      }
    }
  });

  const activeSec = document.getElementById(`${adminActiveSubView}ViewSection`);
  if (activeSec) activeSec.classList.remove('hidden');

  if (adminActiveSubView === 'matrix') renderMatrix();
  if (adminActiveSubView === 'excel') renderExcelView();
  if (adminActiveSubView === 'daily') renderDailyView();
  if (adminActiveSubView === 'summary') renderSummaryView();
  if (adminActiveSubView === 'vacancies') renderAdminVacanciesView();
}

window.scrollMatrixTo = function(direction) {
  const container = document.getElementById('matrixViewSection');
  if (!container) return;
  if (direction === 'first') {
    container.scrollTo({ left: 0, behavior: 'smooth' });
  } else if (direction === 'prev') {
    container.scrollBy({ left: -260, behavior: 'smooth' });
  } else if (direction === 'next') {
    container.scrollBy({ left: 260, behavior: 'smooth' });
  } else if (direction === 'last') {
    container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
  }
};

function renderMatrix() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  const thead = document.getElementById('matrixHeader');
  const tbody = document.getElementById('matrixBody');
  const tfoot = document.getElementById('matrixFooter');

  // Header Row with Day Names
  let h = `<tr>
    <th class="sticky-col-1 bg-slate-100 py-3 px-2 text-center w-10 border-r border-slate-300">#</th>
    <th class="sticky-col-2 bg-slate-100 py-3 px-3 text-left w-24 font-mono border-r border-slate-300">รหัส</th>
    <th class="sticky-col-3 bg-slate-100 py-3 px-4 text-left w-48 border-r-2 border-slate-300 whitespace-nowrap">ชื่อ - สกุล</th>`;

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);
    let thClass = 'bg-slate-100 text-slate-700';
    if (isSunday) thClass = 'bg-rose-100/90 text-rose-800';
    else if (isSaturday) thClass = 'bg-purple-100/90 text-purple-800';

    h += `<th class="p-1.5 text-center min-w-[38px] border-r border-slate-200 ${thClass}">
      <div class="font-extrabold text-xs">${d}</div>
      <div class="text-[10px] font-bold opacity-80">${CALENDAR_HEADERS[dayOfWeek].short}</div>
    </th>`;
  }

  h += `
    <th class="py-3 px-2 text-center bg-sky-100 text-sky-900 border-l-2 border-slate-300 font-bold">ช</th>
    <th class="py-3 px-2 text-center bg-amber-100 text-amber-900 border-l border-slate-300 font-bold">บ</th>
    ${shiftMode === 3 ? '<th class="py-3 px-2 text-center bg-purple-100 text-purple-900 border-l border-slate-300 font-bold">ด</th>' : ''}
    <th class="py-3 px-2 text-center bg-blue-100 text-blue-950 border-l border-slate-300 font-extrabold">รวม</th>
  </tr>`;
  thead.innerHTML = h;

  // Body Rows with Zebra Striping and Full-Row Hover
  let b = '';
  NURSES.forEach((nurse, idx) => {
    const nurseShifts = monthState.roster[nurse.id] || {};
    let countM = 0, countA = 0, countN = 0;
    const isEvenRow = (idx % 2 === 1);
    const rowClass = isEvenRow ? 'matrix-row matrix-row-even' : 'matrix-row matrix-row-odd';
    const stickyBg = 'matrix-sticky-cell font-medium';

    b += `<tr class="${rowClass} transition border-b border-slate-200">
      <td class="sticky-col-1 ${stickyBg} py-2 px-2 text-center border-r border-slate-200">
        <span class="nurse-num-badge w-6 h-6 text-xs font-black" style="background-color: ${nurse.color}; color: ${nurse.textColor};" title="หมายเลข ${nurse.num}">
          ${nurse.num}
        </span>
      </td>
      <td class="sticky-col-2 ${stickyBg} py-2.5 px-3 font-mono font-bold text-blue-900 border-r border-slate-200">${nurse.id}</td>
      <td class="sticky-col-3 ${stickyBg} py-2.5 px-3 text-slate-800 border-r-2 border-slate-300 whitespace-nowrap font-bold">${nurse.name}</td>`;

    for (let d = 1; d <= daysCount; d++) {
      const dt = new Date(currentYear, currentMonth, d);
      const isSunday = (dt.getDay() === 0);
      const isSaturday = (dt.getDay() === 6);
      let cellStyleClass = '';
      if (isSunday) cellStyleClass = 'weekend-cell';
      else if (isSaturday) cellStyleClass = 'bg-purple-50/40 hover:bg-purple-100/50';

      const dayShifts = nurseShifts[d] || [];

      let tags = '';
      dayShifts.forEach(s => {
        if (s === 'M') { countM++; tags += `<span class="shift-tag shift-m">ช</span>`; }
        if (s === 'A') { countA++; tags += `<span class="shift-tag shift-a">บ</span>`; }
        if (s === 'N' && shiftMode === 3) { countN++; tags += `<span class="shift-tag shift-n">ด</span>`; }
      });

      b += `<td class="p-1 text-center border-r border-slate-200 cursor-pointer transition ${cellStyleClass}"
               onclick="openCellEditor('${nurse.id}', ${d})">
        <div class="min-h-[26px] flex items-center justify-center gap-0.5 flex-wrap">
          ${tags || '<span class="text-slate-300 text-[10px] font-bold hover:text-blue-600">+</span>'}
        </div>
      </td>`;
    }

    const total = shiftMode === 3 ? (countM + countA + countN) : (countM + countA);
    const mBg = isEvenRow ? 'bg-sky-100/70 text-sky-950 font-bold' : 'bg-sky-50/70 text-sky-800 font-bold';
    const aBg = isEvenRow ? 'bg-amber-100/70 text-amber-950 font-bold' : 'bg-amber-50/70 text-amber-800 font-bold';
    const nBg = isEvenRow ? 'bg-purple-100/70 text-purple-950 font-bold' : 'bg-purple-50/70 text-purple-800 font-bold';
    const totBg = isEvenRow ? 'bg-blue-100 text-blue-950 font-black' : 'bg-blue-50 text-blue-900 font-black';

    b += `
      <td class="py-2 px-1 text-center border-l-2 border-slate-300 ${mBg}">${countM}</td>
      <td class="py-2 px-1 text-center border-l border-slate-300 ${aBg}">${countA}</td>
      ${shiftMode === 3 ? `<td class="py-2 px-1 text-center border-l border-slate-300 ${nBg}">${countN}</td>` : ''}
      <td class="py-2 px-1 text-center border-l border-slate-300 ${totBg}">${total}</td>
    </tr>`;
  });
  tbody.innerHTML = b;

  // Footer Row
  let f = `<tr>
    <td colspan="3" class="sticky-col-1 bg-slate-100 py-2.5 px-3 font-bold text-slate-800 text-right border-r-2 border-slate-300">
      จำนวนเวรรวมต่อวัน:
    </td>`;

  for (let d = 1; d <= daysCount; d++) {
    let dayM = 0, dayA = 0, dayN = 0;
    NURSES.forEach(n => {
      const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
      if (shifts.includes('M')) dayM++;
      if (shifts.includes('A')) dayA++;
      if (shifts.includes('N') && shiftMode === 3) dayN++;
    });

    f += `<td class="p-1 text-center border-r border-slate-200 text-[10px] leading-tight bg-slate-50 text-slate-700">
      <div>ช: ${dayM}</div>
      <div>บ: ${dayA}</div>
      ${shiftMode === 3 ? `<div>ด: ${dayN}</div>` : ''}
    </td>`;
  }

  f += `
    <td colspan="${shiftMode === 3 ? 4 : 3}" class="p-2 text-center text-[10px] text-slate-500 border-l-2 border-slate-300">
      รวมทั้งแผนก
    </td>
  </tr>`;
  tfoot.innerHTML = f;
}

// Render 14 Nurse Legend Cards with Vibrant Colors and Shift Counts (ตามแบบ Screenshot 2026-10-08 005135)
function renderNurseCardsModern(containerId = 'summaryNurseCardsContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const daysCount = getDaysCount(currentYear, currentMonth);

  // Compute shift counts for each nurse
  const nurseShiftCounts = {};
  NURSES.forEach(n => {
    let count = 0;
    const sObj = (monthState.roster && monthState.roster[n.id]) || {};
    for (let d = 1; d <= daysCount; d++) {
      count += (sObj[d] || []).length;
    }
    nurseShiftCounts[n.id] = count;
  });

  // Split into 2 balanced columns dynamically
  const half = Math.ceil(NURSES.length / 2);
  const col1 = NURSES.slice(0, half);
  const col2 = NURSES.slice(half);

  const renderCol = (list) => {
    return list.map(n => `
      <div class="nurse-card-modern flex items-center justify-between gap-3 p-3">
        <div class="flex items-center gap-3 min-w-0">
          <span class="font-mono text-slate-500 font-bold text-xs w-16 shrink-0">${n.id}</span>
          <span class="nurse-num-badge w-8 h-8 rounded-xl text-sm font-black shrink-0" 
                style="background-color: ${n.color}; color: ${n.textColor};"
                title="หมายเลข ${n.num}: ${n.name}">
            ${n.num}
          </span>
          <span class="font-bold text-slate-800 text-xs sm:text-sm truncate">${n.name}</span>
        </div>
        <div class="shrink-0">
          <span class="px-3 py-1 rounded-xl text-xs font-black shadow-xs" 
                style="background-color: ${n.bgSoft}; color: ${n.color}; border: 1px solid ${n.border};">
            ${nurseShiftCounts[n.id]}
          </span>
        </div>
      </div>
    `).join('');
  };

  container.innerHTML = `
    <div class="glass-card rounded-3xl p-5 md:p-6 border border-white/80 shadow-md">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 flex-wrap gap-2">
        <div class="flex items-center gap-3">
          <div class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white font-black text-xs shadow-sm flex items-center gap-1.5">
            <span>🎴</span>
            <span>หมายเลข และ รายชื่อพยาบาล</span>
          </div>
        </div>
        <span class="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl">
          พยาบาลวิชาชีพ ${NURSES.length} ท่าน
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="space-y-2.5">
          ${renderCol(col1)}
        </div>
        <div class="space-y-2.5">
          ${renderCol(col2)}
        </div>
      </div>
    </div>
  `;
}

// Render Monthly Excel View with Nurse Number Badges and Notes (ตามแบบ Screenshot 2026-10-08 005135)
function renderExcelView(targetContainerId = 'excelRosterContainer') {
  const container = document.getElementById(targetContainerId);
  if (!container) return;

  const daysCount = getDaysCount(currentYear, currentMonth);
  const monthTitle = `ตารางเวรพยาบาล ประจำเดือน ${THAI_MONTHS[currentMonth]} ${currentYear + 543}`;

  // Days Header
  let thDaysHtml = '';
  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    thDaysHtml += `
      <th class="p-1.5 text-center min-w-[42px] border border-slate-300 font-black text-xs ${isWeekend ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'}">
        <div class="text-xs md:text-sm">${d}</div>
        <div class="text-[9px] font-bold opacity-75">${CALENDAR_HEADERS[dayOfWeek].short}</div>
      </th>
    `;
  }

  // Shifts definition matching Excel table: เช้า (08.30-16.30), บ่าย (16.30-00.30), ดึก (00.30-08.30)
  const allShiftDefs = [
    { key: 'M', name: 'เช้า', time: '08.30-16.30', icon: '☀️', rowBg: 'bg-white' },
    { key: 'A', name: 'บ่าย', time: '16.30-00.30', icon: '⛅', rowBg: 'bg-slate-50/40' },
    { key: 'N', name: 'ดึก', time: '00.30-08.30', icon: '🌙', rowBg: 'bg-white' }
  ];
  const shiftDefs = shiftMode === 2 ? allShiftDefs.slice(0, 2) : allShiftDefs;

  let tbodyRowsHtml = '';
  shiftDefs.forEach(sDef => {
    let dayTds = '';
    for (let d = 1; d <= daysCount; d++) {
      const assignedNurses = [];
      NURSES.forEach(n => {
        const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
        if (shifts.includes(sDef.key)) assignedNurses.push(n);
      });

      let cellContent = '';
      if (assignedNurses.length > 0) {
        cellContent = `
          <div class="flex flex-wrap items-center justify-center gap-1 min-h-[30px]">
            ${assignedNurses.map(n => `
              <span class="nurse-num-badge w-7 h-7 text-xs font-black cursor-pointer shadow-xs transition hover:scale-110" 
                    style="background-color: ${n.color}; color: ${n.textColor};"
                    onclick="handleShiftClick(${d}, '${sDef.key}')"
                    title="${n.name} (${n.id})">
                ${n.num}
              </span>
            `).join('')}
          </div>
        `;
      } else {
        cellContent = `
          <div class="min-h-[30px] flex items-center justify-center">
            <span class="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded cursor-pointer hover:bg-rose-100"
                  onclick="handleShiftClick(${d}, '${sDef.key}')"
                  title="คลิกเพื่อดูรายละเอียด">
              ว่าง
            </span>
          </div>
        `;
      }

      dayTds += `
        <td class="p-1 text-center border border-slate-300 align-middle">
          ${cellContent}
        </td>
      `;
    }

    tbodyRowsHtml += `
      <tr class="${sDef.rowBg} hover:bg-blue-50/50 transition">
        <td class="py-2.5 px-3 font-black text-slate-800 text-xs border border-slate-300 bg-slate-50 sticky left-0 z-10 whitespace-nowrap">
          <span class="mr-1">${sDef.icon}</span>${sDef.name}
        </td>
        <td class="py-2.5 px-3 font-mono text-xs text-slate-600 border border-slate-300 bg-slate-50 whitespace-nowrap font-medium">
          ${sDef.time}
        </td>
        ${dayTds}
      </tr>
    `;
  });

  const cardsContainerId = `${targetContainerId}_cards`;

  let html = `
    <!-- Excel View Card -->
    <div class="glass-card rounded-3xl p-5 md:p-6 border border-white/80 shadow-md">
      
      <!-- Top Title Bar -->
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            📑
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-900 font-heading">${monthTitle}</h3>
            <p class="text-xs text-slate-500">ตารางเวรแสดงปุ่มหมายเลขและสีประจำตัวพนักงานตามแบบฟอร์มแผนก</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="exportRoster()" class="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition">
            📊 ส่งออก Excel
          </button>
          <button onclick="window.print()" class="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition">
            🖨️ พิมพ์ A4
          </button>
        </div>
      </div>

      <!-- Schedule Table with Nurse Number Badges -->
      <div class="overflow-x-auto rounded-2xl border border-slate-300 shadow-xs mb-4">
        <table class="min-w-full text-xs text-left border-collapse bg-white">
          <thead class="bg-slate-100 text-slate-800 uppercase font-black border-b border-slate-300">
            <tr>
              <th class="py-2.5 px-3 text-left w-20 border border-slate-300 bg-slate-100 sticky left-0 z-20">เวร</th>
              <th class="py-2.5 px-3 text-left w-32 border border-slate-300 bg-slate-100">เวลา / วันที่</th>
              ${thDaysHtml}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            ${tbodyRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Department Note from Excel Screenshot -->
      <div class="p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl text-amber-900 text-xs font-black flex items-center gap-2">
        <span class="text-base">📌</span>
        <span>***หมายเหตุ วันที่ 1 และ 15 ส่งรายการ Stock ยา และสั่งซื้อยา</span>
      </div>

    </div>

    <!-- Nurse Legend Cards Container -->
    <div id="${cardsContainerId}"></div>
  `;

  container.innerHTML = html;
  renderNurseCardsModern(cardsContainerId);
}

function renderDailyView() {
  const container = document.getElementById('dailyCardsContainer');
  const daysCount = getDaysCount(currentYear, currentMonth);
  let html = '';

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);
    const dayName = CALENDAR_HEADERS[dayOfWeek].th;

    let dayNumberColor = 'text-slate-900';
    if (isSunday) dayNumberColor = 'text-rose-600';
    else if (isSaturday) dayNumberColor = 'text-purple-700';

    const mNurses = [], aNurses = [], nNurses = [];
    NURSES.forEach(n => {
      const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
      if (shifts.includes('M')) mNurses.push(n.name);
      if (shifts.includes('A')) aNurses.push(n.name);
      if (shifts.includes('N') && shiftMode === 3) nNurses.push(n.name);
    });

    const dayTotalNurses = shiftMode === 2 
      ? (mNurses.length + aNurses.length) 
      : (mNurses.length + aNurses.length + nNurses.length);

    html += `
      <div class="glass-card rounded-2xl p-4 border border-slate-200">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div>
            <span class="text-xl font-black ${dayNumberColor}">${d}</span>
            <span class="text-xs font-bold text-slate-700 ml-1">วัน${dayName}</span>
          </div>
          <span class="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">รวม ${dayTotalNurses} คน</span>
        </div>

        <div class="space-y-2 text-xs">
          <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
            <div class="font-bold text-sky-900 flex justify-between">
              <span>☀️ เช้า (08:30-16:30)</span>
              <span class="font-mono">${mNurses.length} คน</span>
            </div>
            <div class="text-[11px] text-sky-800 mt-1">${mNurses.join(', ') || '<span class="text-slate-400 italic">ไม่มีผู้เลือก</span>'}</div>
          </div>

          <div class="p-2 rounded-xl bg-amber-50 border border-amber-200">
            <div class="font-bold text-amber-900 flex justify-between">
              <span>⛅ บ่าย (16:30-00:30)</span>
              <span class="font-mono">${aNurses.length} คน</span>
            </div>
            <div class="text-[11px] text-amber-800 mt-1">${aNurses.join(', ') || '<span class="text-slate-400 italic">ไม่มีผู้เลือก</span>'}</div>
          </div>

          ${shiftMode === 3 ? `
          <div class="p-2 rounded-xl bg-purple-50 border border-purple-200">
            <div class="font-bold text-purple-900 flex justify-between">
              <span>🌙 ดึก (00:30-08:30)</span>
              <span class="font-mono">${nNurses.length} คน</span>
            </div>
            <div class="text-[11px] text-purple-800 mt-1">${nNurses.join(', ') || '<span class="text-slate-400 italic">ไม่มีผู้เลือก</span>'}</div>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function renderSummaryView() {
  renderNurseCardsModern('summaryNurseCardsContainer');

  const colNHead = document.getElementById('summaryColNHead');
  if (colNHead) {
    colNHead.style.display = (shiftMode === 2 ? 'none' : '');
  }

  const tbody = document.getElementById('summaryTableBody');
  const daysCount = getDaysCount(currentYear, currentMonth);
  let html = '';
  let grandM = 0, grandA = 0, grandN = 0, grandTotal = 0;

  NURSES.forEach((nurse, index) => {
    let m = 0, a = 0, n = 0;
    const shiftsObj = monthState.roster[nurse.id] || {};
    for (let d = 1; d <= daysCount; d++) {
      const arr = shiftsObj[d] || [];
      if (arr.includes('M')) m++;
      if (arr.includes('A')) a++;
      if (arr.includes('N') && shiftMode === 3) n++;
    }
    const totalShifts = shiftMode === 2 ? (m + a) : (m + a + n);
    grandM += m; 
    grandA += a; 
    if (shiftMode === 3) grandN += n; 
    grandTotal += totalShifts;

    const isEven = (index % 2 === 1);
    const rowBg = isEven ? 'bg-slate-50/80 hover:bg-blue-100/60' : 'bg-white hover:bg-blue-100/60';

    html += `
      <tr class="${rowBg} transition border-b border-slate-200">
        <td class="py-2 px-4 text-center">
          <span class="nurse-num-badge w-7 h-7 text-xs font-black shadow-xs" style="background-color: ${nurse.color}; color: ${nurse.textColor};" title="หมายเลข ${nurse.num}">
            ${nurse.num}
          </span>
        </td>
        <td class="py-2.5 px-4 font-mono font-bold text-blue-900">${nurse.id}</td>
        <td class="py-2.5 px-4 font-bold text-slate-800">${nurse.name}</td>
        <td class="py-2.5 px-4 text-center text-sky-800 font-bold bg-sky-50/40">${m}</td>
        <td class="py-2.5 px-4 text-center text-amber-800 font-bold bg-amber-50/40">${a}</td>
        ${shiftMode === 3 ? `<td class="py-2.5 px-4 text-center text-purple-800 font-bold bg-purple-50/40">${n}</td>` : ''}
        <td class="py-2.5 px-4 text-center font-black text-blue-950 bg-blue-50/60">${totalShifts}</td>
        <td class="py-2.5 px-4 text-center font-black text-emerald-800 bg-emerald-50/60">${totalShifts * 8} ชม.</td>
      </tr>
    `;
  });

  html += `
    <tr class="bg-blue-100/70 font-black text-slate-900 border-t-2 border-slate-300">
      <td colspan="3" class="py-3 px-4 text-right">รวมทั้งสิ้นในแผนก:</td>
      <td class="py-3 px-4 text-center text-sky-800 bg-sky-100">${grandM}</td>
      <td class="py-3 px-4 text-center text-amber-800 bg-amber-100">${grandA}</td>
      ${shiftMode === 3 ? `<td class="py-3 px-4 text-center text-purple-800 bg-purple-100">${grandN}</td>` : ''}
      <td class="py-3 px-4 text-center text-blue-950 bg-blue-200/80">${grandTotal}</td>
      <td class="py-3 px-4 text-center text-emerald-900 bg-emerald-100">${grandTotal * 8} ชม.</td>
    </tr>
  `;
  tbody.innerHTML = html;
}

function renderAdminVacanciesView() {
  const container = document.getElementById('adminVacanciesList');
  const daysCount = getDaysCount(currentYear, currentMonth);
  const unassignedList = [];

  for (let d = 1; d <= daysCount; d++) {
    getActiveShifts().forEach(s => {
      const assigned = [];
      NURSES.forEach(n => {
        const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
        if (shifts.includes(s)) assigned.push(n);
      });
      if (assigned.length === 0) {
        unassignedList.push({ day: d, shift: s });
      }
    });
  }

  if (unassignedList.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-600 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <h4 class="text-lg font-bold text-emerald-800 mb-1">🎉 ทุกเวรมีพยาบาลเลือกเข้าเวรครบถ้วน!</h4>
        <p class="text-sm text-emerald-600">ไม่มีเวรที่ยังไม่มีคนเลือก สามารถตรวจสอบและส่งออกตารางเป็นไฟล์ Excel ได้ทันที</p>
      </div>`;
    return;
  }

  let html = `
    <div class="mb-4 flex items-center justify-between">
      <div class="text-sm text-slate-600">เวรที่ยังไม่มีคนเลือกเลย: <b class="text-rose-600 font-bold">${unassignedList.length} เวร</b></div>
      <button onclick="runOptimization()" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5">
        ⚡ รัน Optimize เกลี่ยเวรและเติมเต็มอัตโนมัติ
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">`;

  unassignedList.forEach(v => {
    const dt = new Date(currentYear, currentMonth, v.day);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    html += `
      <div class="p-3.5 rounded-2xl border border-rose-200 bg-white shadow-xs">
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-slate-800 text-sm">วันที่ ${v.day} (${CALENDAR_HEADERS[dayOfWeek].short})</span>
          ${isWeekend ? '<span class="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">วันหยุด</span>' : ''}
        </div>
        <div class="text-xs font-semibold text-blue-900 mb-1">${SHIFTS[v.shift].name} (${SHIFTS[v.shift].time.split(' ')[0]})</div>
        <div class="text-xs text-rose-600 font-bold mb-2">🚨 ยังไม่มีคนเลือก (0 คน)</div>
        <button onclick="openBookingForVacancy(${v.day}, '${v.shift}')" class="w-full py-1.5 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-slate-200">
          + เลือกพยาบาลเข้าเวรนี้
        </button>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

window.openBookingForVacancy = function(day, shift) {
  openBookingModal();
  const checkboxes = document.querySelectorAll('input[name="modalShift"]');
  checkboxes.forEach(cb => {
    cb.checked = (cb.value === shift);
  });
  syncShiftToggleVisuals();
  setTimeout(() => {
    const dateCheckboxes = document.getElementsByName('bookingDates');
    dateCheckboxes.forEach(cb => {
      const isTarget = (parseInt(cb.value) === day);
      cb.checked = isTarget;
      const btn = cb.closest('.booking-date-btn');
      if (btn) {
        if (isTarget) btn.classList.add('selected');
        else btn.classList.remove('selected');
      }
    });
  }, 50);
};

// 10. CELL EDIT MODAL LOGIC (ADMIN MATRIX)
window.openCellEditor = function(nurseId, day) {
  if (monthState.isConfirmed && (!currentUser || currentUser.role !== 'admin')) {
    window.showToast('🔒 ตารางเวรประจำเดือนนี้ได้รับการยืนยันทางการแล้ว ปิดรับการแก้ไขหรือจองเพิ่ม');
    return;
  }

  activeEditNurseId = nurseId;
  activeEditDay = day;

  const nurse = NURSES.find(n => n.id === nurseId);
  const nurseNameEl = document.getElementById('cellEditNurseName');
  const dateTextEl = document.getElementById('cellEditDateText');

  nurseNameEl.innerText = `${nurse.name} (${nurse.id})`;
  const dt = new Date(currentYear, currentMonth, day);
  dateTextEl.innerText = `วันที่ ${day} ${THAI_MONTHS[currentMonth]} ${currentYear + 543} (${CALENDAR_HEADERS[dt.getDay()].th})`;

  const currentShifts = (monthState.roster[nurseId] && monthState.roster[nurseId][day]) || [];
  document.getElementById('cellShiftM').checked = currentShifts.includes('M');
  document.getElementById('cellShiftA').checked = currentShifts.includes('A');
  const nContainer = document.getElementById('cellShiftNContainer');
  if (nContainer) {
    nContainer.style.display = (shiftMode === 2 ? 'none' : 'flex');
  }
  document.getElementById('cellShiftN').checked = (shiftMode === 3 && currentShifts.includes('N'));

  document.getElementById('cellEditModal').classList.remove('hidden');
};

function closeCellEditor() {
  document.getElementById('cellEditModal').classList.add('hidden');
  activeEditNurseId = null;
  activeEditDay = null;
}

function saveCellEditor() {
  if (!activeEditNurseId || !activeEditDay) return;
  if (monthState.isConfirmed && (!currentUser || currentUser.role !== 'admin')) {
    alert('🔒 ตารางเวรประจำเดือนนี้ได้รับการยืนยันทางการแล้ว ปิดรับการแก้ไข');
    return;
  }

  const m = document.getElementById('cellShiftM').checked;
  const a = document.getElementById('cellShiftA').checked;
  const n = (shiftMode === 3) && document.getElementById('cellShiftN').checked;

  const newShifts = [];
  if (m) newShifts.push('M');
  if (a) newShifts.push('A');
  if (n) newShifts.push('N');

  if (!monthState.roster[activeEditNurseId]) {
    monthState.roster[activeEditNurseId] = {};
  }

  if (newShifts.length > 0) {
    monthState.roster[activeEditNurseId][activeEditDay] = newShifts;
  } else {
    delete monthState.roster[activeEditNurseId][activeEditDay];
  }

  saveMonthState();
  closeCellEditor();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminSubView();
}

function clearCellShifts() {
  if (!activeEditNurseId || !activeEditDay) return;
  if (monthState.isConfirmed && (!currentUser || currentUser.role !== 'admin')) {
    alert('🔒 ตารางเวรประจำเดือนนี้ได้รับการยืนยันทางการแล้ว ปิดรับการแก้ไข');
    return;
  }

  if (monthState.roster[activeEditNurseId]) {
    delete monthState.roster[activeEditNurseId][activeEditDay];
  }
  saveMonthState();
  closeCellEditor();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminSubView();
}

// 11. QUICK BOOKING MODAL (WITH ENLARGED DATES)
function openBookingModal() {
  populateBookingModal();
  document.getElementById('bookingModal').classList.remove('hidden');
}

function closeBookingModal() {
  document.getElementById('bookingModal').classList.add('hidden');
}

function populateBookingModal(nurseIdToLock) {
  const sel = document.getElementById('modalNurseSelect');
  if (nurseIdToLock) {
    const n = NURSES.find(x => x.id === nurseIdToLock);
    sel.innerHTML = `<option value="${n.id}">[${n.id}] ${n.name}</option>`;
    sel.disabled = true;
  } else {
    sel.innerHTML = NURSES.map(n => `<option value="${n.id}">[${n.id}] ${n.name}</option>`).join('');
    sel.disabled = false;
  }

  // Set shift mode container & night button display
  const nContainer = document.getElementById('shiftBtnContainerN');
  if (nContainer) {
    nContainer.style.display = (shiftMode === 2 ? 'none' : 'flex');
  }
  const modalShiftCont = document.getElementById('modalShiftOptionsContainer');
  if (modalShiftCont) {
    modalShiftCont.className = (shiftMode === 2 ? 'grid grid-cols-2 gap-2.5' : 'grid grid-cols-3 gap-2.5');
  }

  // Default selection: Morning checked, others unchecked
  const shiftM = document.querySelector('input[name="modalShift"][value="M"]');
  const shiftA = document.querySelector('input[name="modalShift"][value="A"]');
  const shiftN = document.querySelector('input[name="modalShift"][value="N"]');
  if (shiftM) shiftM.checked = true;
  if (shiftA) shiftA.checked = false;
  if (shiftN) shiftN.checked = false;
  syncShiftToggleVisuals();
  initShiftToggleListeners();

  const daysCount = getDaysCount(currentYear, currentMonth);
  const firstDayIndex = getFirstDayIndex(currentYear, currentMonth);
  const dateCont = document.getElementById('modalDateSelector');
  
  let html = '';

  // 1. Calendar day header row
  html += `<div class="col-span-7 grid grid-cols-7 gap-1 text-center text-xs font-black text-slate-700 pb-1.5 border-b border-slate-200 mb-1">`;
  CALENDAR_HEADERS.forEach((ch, idx) => {
    let colorClass = '';
    if (idx === 0) colorClass = 'text-rose-700 font-bold';
    else if (idx === 6) colorClass = 'text-purple-700 font-bold';
    html += `<div class="${colorClass}">${ch.short}</div>`;
  });
  html += `</div>`;

  // 2. Prepend empty slots
  for (let pad = 0; pad < firstDayIndex; pad++) {
    html += `<div class="p-1 rounded-lg border border-transparent opacity-0 select-none">•</div>`;
  }

  // 3. Render actual dates with interactive toggle buttons
  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);
    let weekendClass = '';
    if (isSunday) weekendClass = 'is-sunday';
    else if (isSaturday) weekendClass = 'is-saturday';

    html += `
      <div class="booking-date-btn ${weekendClass}" 
           id="dateBtn_${d}" 
           onclick="toggleDateSelection(this, ${d})"
           title="วันที่ ${d}">
        <input type="checkbox" name="bookingDates" value="${d}" class="sr-only">
        <span class="text-sm md:text-base font-black">${d}</span>
        <span class="date-check-badge">✓</span>
      </div>
    `;
  }
  dateCont.innerHTML = html;

  const selectAllBtn = document.getElementById('selectAllDatesBtn');
  if (selectAllBtn) {
    selectAllBtn.innerText = 'เลือกทั้งหมด';
  }
}

window.toggleDateSelection = function(el, day) {
  const cb = el.querySelector('input[type="checkbox"]');
  if (!cb) return;
  cb.checked = !cb.checked;
  if (cb.checked) {
    el.classList.add('selected');
  } else {
    el.classList.remove('selected');
  }

  // Update select all button text dynamically
  const container = document.getElementById('modalDateSelector');
  if (container) {
    const allBtns = container.querySelectorAll('.booking-date-btn');
    const allSelected = Array.from(allBtns).every(b => b.classList.contains('selected'));
    const selectAllBtn = document.getElementById('selectAllDatesBtn');
    if (selectAllBtn) {
      selectAllBtn.innerText = allSelected ? 'ยกเลิกการเลือกทั้งหมด' : 'เลือกทั้งหมด';
    }
  }
};

window.toggleSelectAllDates = function() {
  const container = document.getElementById('modalDateSelector');
  if (!container) return;
  const cards = container.querySelectorAll('.booking-date-btn');
  const allSelected = Array.from(cards).every(c => c.classList.contains('selected'));

  cards.forEach(c => {
    const cb = c.querySelector('input[type="checkbox"]');
    if (cb) cb.checked = !allSelected;
    if (!allSelected) {
      c.classList.add('selected');
    } else {
      c.classList.remove('selected');
    }
  });

  const selectAllBtn = document.getElementById('selectAllDatesBtn');
  if (selectAllBtn) {
    selectAllBtn.innerText = allSelected ? 'เลือกทั้งหมด' : 'ยกเลิกการเลือกทั้งหมด';
  }
};

window.openPersonalBookingModal = function() {
  if (monthState.isConfirmed && (!currentUser || currentUser.role !== 'admin')) {
    alert('🔒 ตารางเวรประจำเดือนนี้ได้รับการยืนยันและประกาศอย่างเป็นทางการแล้ว ปิดรับการจองสำหรับเดือนนี้ (สามารถเปลี่ยนไปดูหรือจองในเดือนถัดไปได้)');
    return;
  }
  if (!currentUser) {
    openNurseLoginModal();
    return;
  }
  if (currentUser.role === 'nurse') {
    populateBookingModal(currentUser.nurseId);
    document.getElementById('bookingModal').classList.remove('hidden');
  } else {
    openBookingModal();
  }
};

function handleQuickBookingSubmit(e) {
  e.preventDefault();
  if (monthState.isConfirmed && (!currentUser || currentUser.role !== 'admin')) {
    alert('🔒 ตารางเวรประจำเดือนนี้ได้รับการยืนยันและประกาศอย่างเป็นทางการแล้ว ไม่สามารถบันทึกการจองได้');
    return;
  }
  const nurseId = document.getElementById('modalNurseSelect').value;
  const shiftCheckboxes = document.getElementsByName('modalShift');
  const selectedShifts = [];
  shiftCheckboxes.forEach(cb => {
    if (cb.checked) {
      if (shiftMode === 2 && cb.value === 'N') return; // Ignore Night in 2-shift mode
      selectedShifts.push(cb.value);
    }
  });

  if (selectedShifts.length === 0) {
    alert('กรุณาเลือกเวรเวลาที่ต้องการจองอย่างน้อย 1 เวร (เช่น เวรเช้า หรือ เวรบ่าย)');
    return;
  }

  const dateCheckboxes = document.getElementsByName('bookingDates');
  const selectedDates = [];
  dateCheckboxes.forEach(cb => {
    if (cb.checked) selectedDates.push(parseInt(cb.value));
  });

  if (selectedDates.length === 0) {
    alert('กรุณาเลือกวันที่ต้องการจองอย่างน้อย 1 วัน');
    return;
  }

  if (!monthState.roster[nurseId]) monthState.roster[nurseId] = {};

  selectedDates.forEach(d => {
    if (!monthState.roster[nurseId][d]) monthState.roster[nurseId][d] = [];
    selectedShifts.forEach(s => {
      if (!monthState.roster[nurseId][d].includes(s)) {
        monthState.roster[nurseId][d].push(s);
      }
    });
  });

  saveMonthState();
  closeBookingModal();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminSubView();

  const nurse = NURSES.find(n => n.id === nurseId);
  const shiftNames = selectedShifts.map(s => SHIFTS[s].name).join(' + ');
  window.showToast(`✓ บันทึกการจอง ${shiftNames} สำหรับ ${nurse?.name || nurseId} (${selectedDates.length} วัน) เรียบร้อยแล้ว`);
}

// Helper: Check if adding newShift on today satisfies maximum 2 consecutive shifts rule
function isValidShiftAddition(todayShifts, newShift, mode) {
  if (todayShifts.includes(newShift)) return false;
  if (todayShifts.length >= 2) return false; // Strictly max 2 shifts per day
  if (todayShifts.length === 0) return true;

  // If already 1 shift, the second shift must be consecutive
  const existing = todayShifts[0];
  if (mode === 2) {
    // Mode 2: M and A are consecutive
    return (existing === 'M' && newShift === 'A') || (existing === 'A' && newShift === 'M');
  } else {
    // Mode 3: M-A or A-N are consecutive. M-N is NOT consecutive.
    if (existing === 'M') return (newShift === 'A');
    if (existing === 'A') return (newShift === 'M' || newShift === 'N');
    if (existing === 'N') return (newShift === 'A');
  }
  return false;
}

function hasRestConflict(nurseId, d, s, roster, daysCount) {
  if (s === 'M' && d > 1) {
    const yShifts = (roster[nurseId] && roster[nurseId][d - 1]) || [];
    if (yShifts.includes('N')) return true; // Just worked night shift yesterday
  }
  if (s === 'N' && d < daysCount) {
    const tShifts = (roster[nurseId] && roster[nurseId][d + 1]) || [];
    if (tShifts.includes('M')) return true; // Scheduled for morning shift tomorrow
  }
  return false;
}

// 12. AUTOMATED SHIFT OPTIMIZER ALGORITHM (จัดตารางเวรอัตโนมัติ - เกลี่ยเวรเท่าๆ กัน + ต่อเนื่องสูงสุด 2 เวร/วัน)
// 12. AUTOMATED SHIFT OPTIMIZER ALGORITHM (จัดตารางเวรอัตโนมัติ: 1 คนต่อเวร, สูงสุด 2 เวร/วัน, เฉลี่ยตามเป้าหมาย)
function runOptimization() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  const activeShifts = getActiveShifts();
  const shiftsPerDay = activeShifts.length; // 2 in mode 2, 3 in mode 3
  const totalSlots = daysCount * shiftsPerDay;
  const nurseCount = NURSES.length;
  const targetAvg = totalSlots / nurseCount; // (จำนวนวันต่อเดือน x เวรต่อวัน) / จำนวนพยาบาล

  // 1. คำนวณจำนวนเวรเดิมที่พยาบาลแต่ละท่านเลือกไว้ในเดือนนี้
  const initialRequests = {};
  NURSES.forEach(n => {
    let count = 0;
    const rObj = monthState.roster[n.id] || {};
    for (let d = 1; d <= daysCount; d++) {
      const sArr = rObj[d] || [];
      count += sArr.filter(s => activeShifts.includes(s)).length;
    }
    initialRequests[n.id] = count;
  });

  // พยาบาลที่เลือกเวรน้อยกว่าหรือเท่ากับค่าเฉลี่ย (ได้สิทธิ์พิจารณาเวรที่เลือกไว้ก่อน)
  const isBelowAvg = {};
  NURSES.forEach(n => {
    isBelowAvg[n.id] = initialRequests[n.id] <= targetAvg;
  });

  // สร้างตารางผลลัพธ์ใหม่ว่างเปล่า เพื่อให้ได้เป๊ะ 1 คนต่อเวร
  const optimizedRoster = {};
  NURSES.forEach(n => {
    optimizedRoster[n.id] = {};
  });

  const assignedCounts = {};
  NURSES.forEach(n => {
    assignedCounts[n.id] = 0;
  });

  const prunedLog = [];
  const keptLog = [];
  const autoFilledLog = [];

  function getDayShifts(nurseId, day) {
    return optimizedRoster[nurseId][day] || [];
  }

  // Phase 1: คัดเลือกจากคำขอเดิมที่มีคนเลือก (ถ้าเลือกหลายคน คัดเหลือ 1 คนต่อเวร)
  for (let d = 1; d <= daysCount; d++) {
    activeShifts.forEach(s => {
      // ค้นหาพยาบาลทุกคนที่เลือกเวรนี้ในวันที่ d
      const applicants = NURSES.filter(n => {
        const sArr = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
        return sArr.includes(s);
      });

      if (applicants.length > 0) {
        // กรองเฉพาะพยาบาลที่เข้าเงื่อนไข (ไม่เกิน 2 เวร/วัน, เวรต่อเนื่อง, พักผ่อนเพียงพอ)
        const eligible = applicants.filter(n => {
          const today = getDayShifts(n.id, d);
          if (!isValidShiftAddition(today, s, shiftMode)) return false;
          if (hasRestConflict(n.id, d, s, optimizedRoster, daysCount)) return false;
          return true;
        });

        if (eligible.length > 0) {
          // จัดลำดับความสำคัญตามเงื่อนไข:
          // 1. สำคัญที่สุด: ให้พยาบาลที่วันนี้ยังไม่มีเวรเลย (0 เวรวันนี้) ก่อนคนที่มีแล้ว 1 เวร (เพื่อหลีกเลี่ยง 2 เวร/วัน เป็นลำดับสุดท้าย)
          // 2. พยาบาลที่เลือกมาน้อยกว่าหรือเท่ากับค่าเฉลี่ยได้สิทธิ์ก่อน
          // 3. ถ้าสถานะเท่ากัน ให้เฉลี่ยโดยดูจากยอดเวรที่ได้จัดไปแล้ว (คนที่ได้น้อยกว่าได้ก่อน)
          // 4. ดูจากจำนวนที่ขอเริ่มต้น (ขอน้อยกว่าได้ก่อน)
          // 5. สุ่ม tie-breaker เพื่อให้การกด "สุ่มจัดรอบใหม่" ได้ผลลัพธ์กระจายหลากหลาย
          eligible.sort((a, b) => {
            const aToday = getDayShifts(a.id, d).length;
            const bToday = getDayShifts(b.id, d).length;
            if (aToday !== bToday) return aToday - bToday;

            const aBelow = isBelowAvg[a.id];
            const bBelow = isBelowAvg[b.id];
            if (aBelow !== bBelow) return aBelow ? -1 : 1;

            const countDiff = assignedCounts[a.id] - assignedCounts[b.id];
            if (countDiff !== 0) return countDiff;

            const initDiff = initialRequests[a.id] - initialRequests[b.id];
            if (initDiff !== 0) return initDiff;

            return Math.random() - 0.5;
          });

          const winner = eligible[0];
          if (!optimizedRoster[winner.id][d]) optimizedRoster[winner.id][d] = [];
          optimizedRoster[winner.id][d].push(s);
          assignedCounts[winner.id]++;

          if (applicants.length > 1) {
            prunedLog.push({
              day: d,
              shift: s,
              shiftName: SHIFTS[s].name,
              winner: winner,
              totalApplicants: applicants.length,
              competitors: applicants.filter(x => x.id !== winner.id)
            });
          } else {
            keptLog.push({
              day: d,
              shift: s,
              shiftName: SHIFTS[s].name,
              nurse: winner
            });
          }
        }
      }
    });
  }

  // Phase 2: เติมเต็มเวรที่ยังไม่มีพยาบาลเข้าเวร (0 คน) ให้ครบ 1 คนต่อเวร
  for (let d = 1; d <= daysCount; d++) {
    activeShifts.forEach(s => {
      // ตรวจสอบว่าเวรนี้มีพยาบาลได้รับจัดหรือยัง
      const isAssigned = NURSES.some(n => (optimizedRoster[n.id][d] || []).includes(s));
      if (!isAssigned) {
        // ค้นหาพยาบาลที่ว่างและจัดลงเวรนี้ได้ตามกฎ
        const available = NURSES.filter(n => {
          const today = getDayShifts(n.id, d);
          if (!isValidShiftAddition(today, s, shiftMode)) return false;
          if (hasRestConflict(n.id, d, s, optimizedRoster, daysCount)) return false;
          return true;
        });

        if (available.length > 0) {
          // จัดลำดับความสำคัญเพื่อให้ยอดเวรสมดุลใกล้เคียงค่าเฉลี่ยที่สุด:
          // 1. สำคัญที่สุด: ต้องเลือกพยาบาลที่วันนี้ยังไม่มีเวรเลย (0 เวรวันนี้) ก่อนคนที่มี 1 เวร (2 เวรต่อวัน เป็นลำดับสุดท้าย ถ้าไม่มีตัวเลือก)
          // 2. พยาบาลที่ยอดเวรรวมสะสมน้อยที่สุด
          // 3. สุ่ม tie-breaker เพื่อให้การกด "สุ่มจัดรอบใหม่" ได้ผลลัพธ์กระจายหลากหลาย
          available.sort((a, b) => {
            const aToday = getDayShifts(a.id, d).length;
            const bToday = getDayShifts(b.id, d).length;
            if (aToday !== bToday) return aToday - bToday;

            const countDiff = assignedCounts[a.id] - assignedCounts[b.id];
            if (countDiff !== 0) return countDiff;

            return Math.random() - 0.5;
          });

          const picked = available[0];
          if (!optimizedRoster[picked.id][d]) optimizedRoster[picked.id][d] = [];
          optimizedRoster[picked.id][d].push(s);
          assignedCounts[picked.id]++;

          autoFilledLog.push({
            day: d,
            shift: s,
            shiftName: SHIFTS[s].name,
            nurse: picked
          });
        }
      }
    });
  }

  window.pendingOptimizedRoster = optimizedRoster;

  renderOptimizationResultModal({
    daysCount,
    shiftsPerDay,
    totalSlots,
    nurseCount,
    targetAvg,
    initialRequests,
    isBelowAvg,
    assignedCounts,
    prunedLog,
    keptLog,
    autoFilledLog
  });

  document.getElementById('optimizeModal').classList.remove('hidden');
}

function renderOptimizationResultModal(data) {
  const {
    daysCount,
    shiftsPerDay,
    totalSlots,
    nurseCount,
    targetAvg,
    initialRequests,
    isBelowAvg,
    assignedCounts,
    prunedLog,
    keptLog,
    autoFilledLog
  } = data;

  const modalBody = document.getElementById('optimizeModalBody');
  if (!modalBody) return;

  const modeName = shiftsPerDay === 2 ? '2 เวร/วัน (เช้า, บ่าย)' : '3 เวร/วัน (เช้า, บ่าย, ดึก)';

  let html = `
    <!-- Top Summary Banner -->
    <div class="p-4 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-blue-200 rounded-2xl mb-4 text-xs text-blue-950 space-y-2.5">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <span class="font-black text-sm text-blue-900 flex items-center gap-1.5">
          <span>⚙️</span>
          <span>โหมด: ${modeName}</span>
        </span>
        <span class="font-black px-2.5 py-1 bg-emerald-600 text-white rounded-xl text-xs shadow-2xs">
          🎯 โควตา: 1 คนต่อเวร (จัดครบ 100%)
        </span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
        <div class="p-2 bg-white/80 rounded-xl border border-blue-100 shadow-2xs">
          <div class="text-[10px] text-slate-500 font-sans">จำนวนวันในเดือน</div>
          <div class="font-black text-slate-800 text-sm">${daysCount} วัน</div>
        </div>
        <div class="p-2 bg-white/80 rounded-xl border border-blue-100 shadow-2xs">
          <div class="text-[10px] text-slate-500 font-sans">จำนวนเวรรวมทั้งเดือน</div>
          <div class="font-black text-slate-800 text-sm">${totalSlots} เวร</div>
        </div>
        <div class="p-2 bg-white/80 rounded-xl border border-blue-100 shadow-2xs">
          <div class="text-[10px] text-slate-500 font-sans">จำนวนพยาบาล</div>
          <div class="font-black text-slate-800 text-sm">${nurseCount} ท่าน</div>
        </div>
        <div class="p-2 bg-emerald-50 rounded-xl border border-emerald-200 shadow-2xs">
          <div class="text-[10px] text-emerald-700 font-sans font-bold">ค่าเฉลี่ยเป้าหมาย</div>
          <div class="font-black text-emerald-800 text-sm">${targetAvg.toFixed(2)} เวร/คน</div>
        </div>
      </div>

      <div class="text-[11px] text-blue-900 pt-1 border-t border-blue-200/60 leading-relaxed font-sans">
        💡 <b>สูตรคำนวณ:</b> (${daysCount} วัน × ${shiftsPerDay} เวร) ÷ ${nurseCount} พยาบาล = <b>${targetAvg.toFixed(2)} เวร/ท่าน</b>
        <br>
        ระบบได้คัดเลือกเวรที่มีคนเลือกซ้ำให้เหลือเวรละ 1 คน <b>${prunedLog.length} เวร</b> และเกลี่ยเติมเต็มเวรที่ว่าง <b>${autoFilledLog.length} เวร</b> โดยให้สิทธิ์ผู้ที่เลือกน้อยกว่าค่าเฉลี่ยก่อน
      </div>
    </div>

    <!-- Per-Nurse Balance Table -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-xs font-bold text-slate-800">📊 ตารางสรุปการเกลี่ยเวรของพยาบาลทั้ง ${nurseCount} ท่าน:</h4>
        <span class="text-[11px] text-slate-500 font-semibold">เป้าหมาย: ~${Math.floor(targetAvg)}-${Math.ceil(targetAvg)} เวร/คน</span>
      </div>
      <div class="border border-slate-200 rounded-2xl overflow-hidden max-h-52 overflow-y-auto shadow-2xs">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 font-bold text-slate-700 sticky top-0 border-b border-slate-200">
            <tr>
              <th class="p-2 text-center w-12">ลำดับ</th>
              <th class="p-2">พยาบาล</th>
              <th class="p-2 text-center">เลือกก่อนจัด</th>
              <th class="p-2 text-center">จัดจริง</th>
              <th class="p-2 text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
  `;

  NURSES.forEach(n => {
    const init = initialRequests[n.id] || 0;
    const finalCount = assignedCounts[n.id] || 0;
    const below = isBelowAvg[n.id];
    const diff = finalCount - targetAvg;
    const diffStr = diff >= 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;

    let statusBadge = '';
    if (finalCount === Math.round(targetAvg)) {
      statusBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">สมดุลเป๊ะ</span>';
    } else if (finalCount > targetAvg) {
      statusBadge = `<span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">${diffStr}</span>`;
    } else {
      statusBadge = `<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">${diffStr}</span>`;
    }

    html += `
      <tr class="hover:bg-slate-50">
        <td class="p-2 text-center font-mono">
          <span class="nurse-num-badge w-5 h-5 text-[10px] font-black inline-flex items-center justify-center rounded-md" style="background-color: ${n.color}; color: ${n.textColor};">
            ${n.num}
          </span>
        </td>
        <td class="p-2 font-semibold text-slate-800">${n.name} <span class="text-slate-400 font-mono text-[10px]">[${n.id}]</span></td>
        <td class="p-2 text-center font-mono">${init} เวร ${below ? '<span class="text-emerald-600 text-[10px] font-bold" title="เลือกน้อยกว่าค่าเฉลี่ย (ได้สิทธิ์ก่อน)">★</span>' : ''}</td>
        <td class="p-2 text-center font-bold font-mono text-blue-900">${finalCount} เวร (${finalCount * 8} ชม.)</td>
        <td class="p-2 text-center">${statusBadge}</td>
      </tr>
    `;
  });

  html += `
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Accordion / Tabs: Pruned and Auto-Filled Lists -->
    <div class="space-y-2 text-xs">
      <details class="p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
        <summary class="font-bold text-slate-800 flex justify-between items-center select-none">
          <span>✂️ รายการเวรที่คัดเลือกจากคนเลือกซ้ำให้เหลือ 1 คน (${prunedLog.length} เวร)</span>
          <span class="text-[11px] text-blue-600 font-bold">คลิกเพื่อดูรายละเอียด ▾</span>
        </summary>
        <div class="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
  `;

  if (prunedLog.length === 0) {
    html += `<div class="text-slate-400 italic p-2 text-center">ไม่มีเวรที่มีผู้เลือกซ้ำ</div>`;
  } else {
    prunedLog.forEach(item => {
      html += `
        <div class="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
          <div>
            <span class="font-bold text-slate-800">วันที่ ${item.day} ${item.shiftName}</span>
            <span class="text-slate-500 ml-1">(ผู้เลือกทั้งหมด ${item.totalApplicants} คน)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-emerald-700 font-bold">✓ ได้รับเวร:</span>
            <span class="font-bold text-blue-900">${item.winner.name}</span>
          </div>
        </div>
      `;
    });
  }

  html += `
        </div>
      </details>

      <details class="p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
        <summary class="font-bold text-slate-800 flex justify-between items-center select-none">
          <span>➕ รายการเวรที่เติมเต็มอัตโนมัติ (${autoFilledLog.length} เวร)</span>
          <span class="text-[11px] text-blue-600 font-bold">คลิกเพื่อดูรายละเอียด ▾</span>
        </summary>
        <div class="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
  `;

  if (autoFilledLog.length === 0) {
    html += `<div class="text-slate-400 italic p-2 text-center">ไม่มีเวรที่ต้องเติมเต็ม (ครบถ้วนแล้ว)</div>`;
  } else {
    autoFilledLog.forEach(item => {
      html += `
        <div class="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
          <div>
            <span class="font-bold text-slate-800">วันที่ ${item.day} ${item.shiftName}</span>
            <span class="text-rose-500 ml-1">(เดิมว่าง 0 คน)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-blue-700 font-bold">จัดให้:</span>
            <span class="font-bold text-blue-900">${item.nurse.name}</span>
          </div>
        </div>
      `;
    });
  }

  html += `
        </div>
      </details>
    </div>
  `;

  modalBody.innerHTML = html;
}

function confirmOptimization() {
  if (window.pendingOptimizedRoster) {
    monthState.roster = window.pendingOptimizedRoster;
    monthState.round = 3;
    monthState.isConfirmed = true;
    saveMonthState();
    window.pendingOptimizedRoster = null;
    window.showToast('✓ ยืนยันตารางเวรและประกาศเป็นทางการเรียบร้อยแล้ว (ล็อกการจองเดือนนี้)');
  }
  document.getElementById('optimizeModal').classList.add('hidden');
  renderAdminView();
  renderPublicDashboard();
  updateNavSwitcher(activeView);
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'excel') renderExcelView('userExcelViewContent');
}

window.cancelOptimization = function() {
  window.pendingOptimizedRoster = null;
  document.getElementById('optimizeModal').classList.add('hidden');
  window.showToast('↩️ ยกเลิกผลการจัดตารางเวร กลับสู่สถานะเดิม');
};

window.confirmOptimization = confirmOptimization;
window.runOptimization = runOptimization;

function exportRoster() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  let csv = '\uFEFF';
  csv += `"ตารางเวรพยาบาล ประจำเดือน ${THAI_MONTHS[currentMonth]} พ.ศ. ${currentYear + 543}"\r\n\r\n`;
  let header = ['ลำดับ', 'รหัส', 'ชื่อ - สกุล'];
  for (let d = 1; d <= daysCount; d++) header.push(`"วันที่ ${d}"`);
  header.push('เวรเช้า', 'เวรบ่าย', 'เวรดึก', 'รวมเวร', 'รวมชั่วโมง');
  csv += header.join(',') + '\r\n';

  NURSES.forEach((nurse, index) => {
    let row = [index + 1, `"${nurse.id}"`, `"${nurse.name}"`];
    let m = 0, a = 0, n = 0;
    const shifts = monthState.roster[nurse.id] || {};
    for (let d = 1; d <= daysCount; d++) {
      const s = shifts[d] || [];
      let shiftText = [];
      if (s.includes('M')) { m++; shiftText.push('ช'); }
      if (s.includes('A')) { a++; shiftText.push('บ'); }
      if (s.includes('N') && shiftMode === 3) { n++; shiftText.push('ด'); }
      row.push(`"${shiftText.join('+')}"`);
    }
    const tot = shiftMode === 3 ? (m + a + n) : (m + a);
    row.push(m, a, n, tot, tot * 8);
    csv += row.join(',') + '\r\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ตารางเวรพยาบาล_${THAI_MONTHS[currentMonth]}_${currentYear + 543}.csv`;
  link.click();
}

// 13. NURSE MANAGEMENT CRUD LOGIC (เพิ่ม ลบ แก้ไข รายชื่อพยาบาล มีผลทุกหน้าเพจ)
const PALETTE_COLORS = [
  '#c026d3', '#dc2626', '#0284c7', '#f43f5e', '#ea580c',
  '#2563eb', '#eab308', '#1e3a8a', '#06b6d4', '#f97316',
  '#d97706', '#8b5cf6', '#15803d', '#84cc16', '#0d9488', '#ec4899'
];

function initNurseColorPalette() {
  const cont = document.getElementById('nurseColorPalette');
  if (!cont) return;
  cont.innerHTML = PALETTE_COLORS.map(c => `
    <button type="button" onclick="selectNurseColor('${c}')" class="w-6 h-6 rounded-lg border border-white shadow-2xs hover:scale-110 transition cursor-pointer" style="background-color: ${c};" title="${c}"></button>
  `).join('');
}

window.selectNurseColor = function(color) {
  window.syncNurseColorPicker(color);
};

window.syncNurseColorPicker = function(color) {
  const picker = document.getElementById('nurseFormColorPicker');
  const input = document.getElementById('nurseFormColor');
  if (picker) picker.value = color;
  if (input) input.value = color.toUpperCase();
  updateNursePreviewBadge(color);
};

window.syncNurseColorInput = function(color) {
  const input = document.getElementById('nurseFormColor');
  if (input) input.value = color.toUpperCase();
  updateNursePreviewBadge(color);
};

function updateNursePreviewBadge(color) {
  const badge = document.getElementById('nurseFormPreviewBadge');
  if (badge) {
    badge.style.backgroundColor = color;
    badge.style.color = getContrastColor(color);
    const numVal = document.getElementById('nurseFormNum')?.value || '#';
    badge.innerText = numVal;
  }
}

window.openNurseManageModal = function() {
  initNurseColorPalette();
  resetNurseForm();
  renderNurseManageList();
  document.getElementById('nurseManageModal')?.classList.remove('hidden');
};

window.closeNurseManageModal = function() {
  document.getElementById('nurseManageModal')?.classList.add('hidden');
  resetNurseForm();
};

function renderNurseManageList() {
  const countBadge = document.getElementById('nurseCountBadge');
  if (countBadge) countBadge.innerText = NURSES.length;

  const tbody = document.getElementById('nurseManageTableBody');
  if (!tbody) return;

  let html = '';
  NURSES.forEach(n => {
    html += `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-2 px-3 text-center">
          <span class="nurse-num-badge w-6 h-6 text-xs font-black shadow-2xs" style="background-color: ${n.color}; color: ${n.textColor};">
            ${n.num}
          </span>
        </td>
        <td class="py-2 px-3 font-mono font-bold text-blue-900">${n.id}</td>
        <td class="py-2 px-3 font-bold text-slate-800">${n.name}</td>
        <td class="py-2 px-3 text-center font-mono text-slate-500">${n.pin}</td>
        <td class="py-2 px-3 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="editNurse('${n.id}')" class="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition">
              ✏️ แก้ไข
            </button>
            <button onclick="deleteNurse('${n.id}')" class="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition">
              🗑️ ลบ
            </button>
          </div>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

window.resetNurseForm = function() {
  const origId = document.getElementById('editNurseOriginalId');
  if (origId) origId.value = '';
  const formId = document.getElementById('nurseFormId');
  const formNum = document.getElementById('nurseFormNum');
  const formName = document.getElementById('nurseFormName');
  const formPin = document.getElementById('nurseFormPin');

  if (formId) formId.value = '';
  if (formNum) formNum.value = '';
  if (formName) formName.value = '';
  if (formPin) formPin.value = '';
  syncNurseColorPicker('#2563eb');

  const title = document.getElementById('nurseFormTitle');
  if (title) title.innerHTML = `<span>➕</span><span>เพิ่มพยาบาลท่านใหม่</span>`;
  const saveBtn = document.getElementById('saveNurseBtn');
  if (saveBtn) saveBtn.innerHTML = `+ บันทึกพยาบาล`;
  const cancelBtn = document.getElementById('cancelEditNurseBtn');
  if (cancelBtn) cancelBtn.classList.add('hidden');
};

window.editNurse = function(nurseId) {
  const n = NURSES.find(x => x.id === nurseId);
  if (!n) return;

  document.getElementById('editNurseOriginalId').value = n.id;
  document.getElementById('nurseFormId').value = n.id;
  document.getElementById('nurseFormNum').value = n.num;
  document.getElementById('nurseFormName').value = n.name;
  document.getElementById('nurseFormPin').value = n.pin;
  syncNurseColorPicker(n.color);

  const title = document.getElementById('nurseFormTitle');
  if (title) title.innerHTML = `<span>✏️</span><span>แก้ไขข้อมูล: ${n.name}</span>`;
  const saveBtn = document.getElementById('saveNurseBtn');
  if (saveBtn) saveBtn.innerHTML = `💾 บันทึกการแก้ไข`;
  const cancelBtn = document.getElementById('cancelEditNurseBtn');
  if (cancelBtn) cancelBtn.classList.remove('hidden');

  document.getElementById('nurseFormName').focus();
};

window.deleteNurse = function(nurseId) {
  const n = NURSES.find(x => x.id === nurseId);
  if (!n) return;

  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${n.name} [${n.id}] ออกจากระบบ? ข้อมูลการจัดเวรของพยาบาลท่านนี้จะถูกลบไปด้วย`)) {
    return;
  }

  NURSES = NURSES.filter(x => x.id !== nurseId);
  saveNurses();

  // Remove shifts from current month roster
  if (monthState.roster && monthState.roster[nurseId]) {
    delete monthState.roster[nurseId];
    saveMonthState();
  }

  // If current logged in user is this nurse, log them out
  if (currentUser && currentUser.nurseId === nurseId) {
    logout();
  }

  renderNurseManageList();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminView();
  updateAuthUI();
};

window.handleSaveNurse = function(e) {
  e.preventDefault();
  const origId = document.getElementById('editNurseOriginalId').value.trim();
  const id = document.getElementById('nurseFormId').value.trim();
  const num = parseInt(document.getElementById('nurseFormNum').value.trim(), 10);
  const name = document.getElementById('nurseFormName').value.trim();
  const pin = document.getElementById('nurseFormPin').value.trim();
  const color = document.getElementById('nurseFormColor').value.trim() || '#2563eb';

  if (!id || !name || !pin || isNaN(num)) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  const textColor = getContrastColor(color);
  const bgSoft = hexToRgba(color, 0.15);
  const border = hexToRgba(color, 0.35);

  if (origId) {
    // Updating existing nurse
    const idx = NURSES.findIndex(x => x.id === origId);
    if (idx !== -1) {
      if (id !== origId && NURSES.some(x => x.id === id)) {
        alert('รหัสพยาบาลนี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น');
        return;
      }

      NURSES[idx] = {
        ...NURSES[idx],
        id,
        num,
        name,
        pin,
        color,
        textColor,
        bgSoft,
        border
      };

      if (id !== origId && monthState.roster && monthState.roster[origId]) {
        monthState.roster[id] = monthState.roster[origId];
        delete monthState.roster[origId];
        saveMonthState();
      }

      if (currentUser && currentUser.nurseId === origId) {
        currentUser.nurseId = id;
        currentUser.name = name;
        localStorage.setItem('nurse_current_user', JSON.stringify(currentUser));
      }
    }
  } else {
    // Adding new nurse
    if (NURSES.some(x => x.id === id)) {
      alert('รหัสพยาบาลนี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น');
      return;
    }

    const newNurse = {
      id,
      num,
      name,
      pin,
      order: NURSES.length + 1,
      color,
      textColor,
      bgSoft,
      border
    };
    NURSES.push(newNurse);
  }

  // Sort nurses by num
  NURSES.sort((a, b) => a.num - b.num);
  saveNurses();

  resetNurseForm();
  renderNurseManageList();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminView();
  updateAuthUI();
};

// 14. EVENT LISTENERS INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  loadMonthState();
  initAuth();
  updateShiftModeUI();
  updateRealTimeClock();
  setInterval(updateRealTimeClock, 1000);

  // Month navigation: Initialized to defaultMonth (current month + 1)
  function onMonthYearChanged() {
    loadMonthState();
    if (activeView === 'excel' && !monthState.isConfirmed && (!currentUser || currentUser.role !== 'admin')) {
      activeView = 'dashboard';
    }
    updateNavSwitcher(activeView);
    renderPublicDashboard();
    if (activeView === 'personal') renderNurseCalendar();
    if (activeView === 'admin') renderAdminView();
    if (activeView === 'excel') renderExcelView('userExcelViewContent');
  }

  const monthSel = document.getElementById('monthSelect');
  const yearSel = document.getElementById('yearSelect');
  if (monthSel) {
    monthSel.value = currentMonth;
    monthSel.addEventListener('change', (e) => {
      currentMonth = parseInt(e.target.value);
      onMonthYearChanged();
    });
  }

  if (yearSel) {
    yearSel.value = currentYear;
    yearSel.addEventListener('change', (e) => {
      currentYear = parseInt(e.target.value);
      onMonthYearChanged();
    });
  }

  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    if (currentMonth === 0) { currentMonth = 11; currentYear--; }
    else { currentMonth--; }
    if (currentYear < 2026) currentYear = 2026;
    if (monthSel) monthSel.value = currentMonth;
    if (yearSel) yearSel.value = currentYear;
    onMonthYearChanged();
  });

  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    if (currentMonth === 11) { currentMonth = 0; currentYear++; }
    else { currentMonth++; }
    if (currentYear > 2032) currentYear = 2032;
    if (monthSel) monthSel.value = currentMonth;
    if (yearSel) yearSel.value = currentYear;
    onMonthYearChanged();
  });

  // Nurse Modal Login Form Submit
  const modalNurseForm = document.getElementById('modalNurseLoginForm');
  if (modalNurseForm) {
    modalNurseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nurseId = document.getElementById('modalLoginNurseIdSelect').value;
      const pin = document.getElementById('modalLoginNursePin').value;
      loginAsNurse(nurseId, pin);
    });
  }

  // Admin Modal Login Form Submit (Only password field)
  const modalAdminForm = document.getElementById('modalAdminLoginForm');
  if (modalAdminForm) {
    modalAdminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('modalAdminPasswordOnly').value;
      loginAsAdmin(password);
    });
  }

  // Admin Subview Switcher Buttons
  document.getElementById('viewMatrixBtn')?.addEventListener('click', () => { adminActiveSubView = 'matrix'; renderAdminSubView(); });
  document.getElementById('viewExcelBtn')?.addEventListener('click', () => { adminActiveSubView = 'excel'; renderAdminSubView(); });
  document.getElementById('viewDailyBtn')?.addEventListener('click', () => { adminActiveSubView = 'daily'; renderAdminSubView(); });
  document.getElementById('viewSummaryBtn')?.addEventListener('click', () => { adminActiveSubView = 'summary'; renderAdminSubView(); });
  document.getElementById('viewVacanciesBtn')?.addEventListener('click', () => { adminActiveSubView = 'vacancies'; renderAdminSubView(); });

  // Action Buttons
  document.getElementById('adminOptimizeBtn')?.addEventListener('click', runOptimization);
  document.getElementById('openBookingModalBtn')?.addEventListener('click', openBookingModal);
  document.getElementById('exportExcelBtn')?.addEventListener('click', exportRoster);
  document.getElementById('printBtn')?.addEventListener('click', () => window.print());
  document.getElementById('resetMonthBtn')?.addEventListener('click', () => {
    const monthName = THAI_MONTHS[currentMonth];
    const yearBE = currentYear + 543;
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลเวรทั้งหมดประจำเดือน ${monthName} พ.ศ. ${yearBE}?`)) {
      monthState.roster = {};
      saveMonthState();
      renderAdminView();
      renderPublicDashboard();
      alert(`✓ ล้างข้อมูลเวรประจำเดือน ${monthName} พ.ศ. ${yearBE} เรียบร้อยแล้ว`);
    }
  });

  // Nurse Form Num badge sync
  document.getElementById('nurseFormNum')?.addEventListener('input', () => {
    const color = document.getElementById('nurseFormColor')?.value || '#2563eb';
    updateNursePreviewBadge(color);
  });

  // Modals Event Listeners
  document.getElementById('closeCellEditBtn')?.addEventListener('click', closeCellEditor);
  document.getElementById('saveCellEditBtn')?.addEventListener('click', saveCellEditor);
  document.getElementById('clearCellBtn')?.addEventListener('click', clearCellShifts);

  document.getElementById('closeBookingModalBtn')?.addEventListener('click', closeBookingModal);
  document.getElementById('cancelBookingBtn')?.addEventListener('click', closeBookingModal);
  document.getElementById('quickBookingForm')?.addEventListener('submit', handleQuickBookingSubmit);

  document.getElementById('closeOptimizeModalBtn')?.addEventListener('click', () => {
    cancelOptimization();
  });
  document.getElementById('cancelOptimizeBtn')?.addEventListener('click', cancelOptimization);
  document.getElementById('regenerateOptimizeBtn')?.addEventListener('click', runOptimization);
  document.getElementById('confirmOptimizeBtn')?.addEventListener('click', confirmOptimization);

  // Initial View: Keep current session view if user is logged in, or start at dashboard
  initShiftToggleListeners();
  if (currentUser && currentUser.role === 'admin') {
    switchView('admin');
  } else if (currentUser && currentUser.role === 'nurse') {
    switchView('personal');
  } else {
    switchView('dashboard');
  }
});
