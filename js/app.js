/**
 * Nurse Duty Booking & Roster System
 * Modern Blue Glassmorphism Theme
 * Multi-Role Auth, Main Monthly Calendar with All Shifts, 
 * Shift Selection by Actual Nurse Count, User-Specific View & Shift Optimizer
 * Github Start Line No.5325
 */

// 1. Data Definitions
const ADMIN_CREDENTIALS = {
  username: "Admin",
  password: "1234"
};

function getAdminPassword() {
  try {
    return localStorage.getItem('nurse_admin_password') || ADMIN_CREDENTIALS.password;
  } catch (e) {
    return ADMIN_CREDENTIALS.password;
  }
}

function setAdminPassword(newPassword) {
  try {
    localStorage.setItem('nurse_admin_password', newPassword);
  } catch (e) {
    console.error('Failed to save admin password:', e);
  }
}

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

// 1. Core Shift & Calendar Definitions
// Shift Mode: 2 = 2 เวร/วัน (เช้า, บ่าย), 3 = 3 เวร/วัน (เช้า, บ่าย, ดึก)
let shiftMode = parseInt(localStorage.getItem('nurse_shift_mode') || '3');

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
let activeView = 'dashboard'; // 'dashboard', 'personal', 'admin', 'excel'
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

// Calendar View Mode: 'grid' (default: fits mobile 100% without slide) vs 'daily'
let calendarViewMode = 'grid';
try {
  const savedCalView = localStorage.getItem('nurse_cal_view_mode');
  if (savedCalView) calendarViewMode = savedCalView;
} catch (e) {}

// ==================== THEME MANAGEMENT (DARK MODE) ====================
function initTheme() {
  try {
    const saved = localStorage.getItem('nurse_roster_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? (saved === 'dark') : prefersDark;
    applyTheme(isDark);
  } catch (e) {
    applyTheme(false);
  }
}

window.toggleTheme = function() {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(!isDark);
};

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    try { localStorage.setItem('nurse_roster_theme', 'dark'); } catch (e) {}
  } else {
    document.documentElement.classList.remove('dark');
    try { localStorage.setItem('nurse_roster_theme', 'light'); } catch (e) {}
  }

  const icon = isDark ? '☀️' : '🌙';
  const title = isDark ? 'เปลี่ยนเป็นโหมดสว่าง (Light Mode)' : 'เปลี่ยนเป็นโหมดมืด (Dark Mode)';

  const btnMobile = document.getElementById('themeToggleBtnMobile');
  if (btnMobile) {
    btnMobile.innerText = icon;
    btnMobile.title = title;
  }
  const btnDesktop = document.getElementById('themeToggleBtnDesktop');
  if (btnDesktop) {
    btnDesktop.innerText = icon;
    btnDesktop.title = title;
  }

  // Refresh admin duty chart if currently rendered in admin view
  try {
    if (activeView === 'admin' && typeof renderDutyChart === 'function') {
      renderDutyChart();
    }
  } catch (e) {}
}

// Immediately apply theme
initTheme();

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

  // Header shift pills reflect active shift mode & fit mobile screen width without slide
  const headerNPill = document.getElementById('headerShiftNPill');
  const headerContainer = document.getElementById('headerShiftPillsContainer');
  if (headerNPill) {
    headerNPill.style.display = (shiftMode === 2 ? 'none' : 'flex');
  }
  if (headerContainer) {
    if (shiftMode === 2) {
      headerContainer.classList.remove('grid-cols-3');
      headerContainer.classList.add('grid-cols-2');
    } else {
      headerContainer.classList.remove('grid-cols-2');
      headerContainer.classList.add('grid-cols-3');
    }
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

// ==================== CELEBRATORY FIREWORKS EFFECT (1-2 SECONDS) ====================
function triggerFireworks(durationMs = 1800) {
  try {
    const existing = document.getElementById('celebrationFireworksCanvas');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'celebrationFireworksCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const colors = [
      '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', 
      '#ec4899', '#06b6d4', '#eab308', '#ffffff', '#6366f1'
    ];

    const particles = [];

    function createBurst(x, y, particleCount = 45) {
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6.5 + 2.5;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.5 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
          gravity: 0.12,
          friction: 0.96
        });
      }
    }

    // Launch multiple celebratory bursts across the screen
    createBurst(width * 0.5, height * 0.35, 55);
    setTimeout(() => createBurst(width * 0.25, height * 0.38, 45), 180);
    setTimeout(() => createBurst(width * 0.75, height * 0.36, 45), 320);
    setTimeout(() => createBurst(width * 0.5, height * 0.22, 50), 500);

    const startTime = performance.now();
    let animId;

    function render(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (elapsed < durationMs || particles.length > 0) {
        animId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animId);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    }

    animId = requestAnimationFrame(render);

    // Safety cleanup timeout
    setTimeout(() => {
      cancelAnimationFrame(animId);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }, durationMs + 400);

  } catch (err) {
    console.error('Fireworks animation error:', err);
  }
}
window.triggerFireworks = triggerFireworks;

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
  triggerFireworks(1800);
  return true;
}

function loginAsAdmin(password) {
  if (!password) {
    alert('กรุณากรอกรหัสผ่าน Admin');
    return false;
  }
  if (password === getAdminPassword()) {
    currentUser = {
      role: 'admin',
      name: 'ผู้ดูแลระบบ (Admin)'
    };
    localStorage.setItem('nurse_current_user', JSON.stringify(currentUser));
    closeAdminLoginModal();
    updateAuthUI();
    switchView('admin');
    triggerFireworks(1800);
    return true;
  }
  alert('รหัสผ่าน Admin ไม่ถูกต้อง');
  return false;
}

// ==================== ADMIN PASSWORD CHANGE ====================
window.openAdminChangePasswordModal = function() {
  const modal = document.getElementById('adminChangePasswordModal');
  if (!modal) return;
  const curInp = document.getElementById('adminCurrentPassword');
  const newInp = document.getElementById('adminNewPassword');
  const confInp = document.getElementById('adminConfirmPassword');
  if (curInp) curInp.value = '';
  if (newInp) newInp.value = '';
  if (confInp) confInp.value = '';
  const errorMsg = document.getElementById('adminPasswordErrorMsg');
  if (errorMsg) {
    errorMsg.innerText = '';
    errorMsg.classList.add('hidden');
  }
  modal.classList.remove('hidden');
  setTimeout(() => { curInp?.focus(); }, 100);
};

window.closeAdminChangePasswordModal = function() {
  const modal = document.getElementById('adminChangePasswordModal');
  if (modal) modal.classList.add('hidden');
};

window.handleAdminChangePassword = function(e) {
  if (e) e.preventDefault();
  const currentPass = document.getElementById('adminCurrentPassword')?.value || '';
  const newPass = document.getElementById('adminNewPassword')?.value || '';
  const confirmPass = document.getElementById('adminConfirmPassword')?.value || '';
  const errorMsg = document.getElementById('adminPasswordErrorMsg');

  const showError = (msg) => {
    if (errorMsg) {
      errorMsg.innerText = msg;
      errorMsg.classList.remove('hidden');
    } else {
      alert(msg);
    }
  };

  if (currentPass !== getAdminPassword()) {
    showError('❌ รหัสผ่านเดิมไม่ถูกต้อง');
    return false;
  }

  if (newPass.length < 4) {
    showError('❌ รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
    return false;
  }

  if (newPass !== confirmPass) {
    showError('❌ ยืนยันรหัสผ่านใหม่ไม่ตรงกัน');
    return false;
  }

  setAdminPassword(newPass);
  closeAdminChangePasswordModal();
  if (typeof window.showToast === 'function') {
    window.showToast('✓ เปลี่ยนรหัสผ่าน Admin เรียบร้อยแล้ว');
  } else {
    alert('✓ เปลี่ยนรหัสผ่าน Admin เรียบร้อยแล้ว');
  }
  return true;
};

// ==================== NURSE PASSWORD (PIN) CHANGE ====================
window.openNurseChangePasswordModal = function() {
  if (!currentUser || currentUser.role !== 'nurse') {
    alert('กรุณาเข้าสู่ระบบในฐานะพยาบาลก่อนเปลี่ยนรหัสผ่าน (PIN)');
    return;
  }
  const modal = document.getElementById('nurseChangePasswordModal');
  if (!modal) return;
  const nurse = NURSES.find(n => n.id === currentUser.nurseId);
  const subTitle = document.getElementById('nurseChangePinSubTitle');
  if (subTitle && nurse) {
    subTitle.innerText = `สำหรับคุณ ${nurse.name} (รหัส ${nurse.id})`;
  }
  const curInp = document.getElementById('nurseCurrentPin');
  const newInp = document.getElementById('nurseNewPin');
  const confInp = document.getElementById('nurseConfirmPin');
  if (curInp) curInp.value = '';
  if (newInp) newInp.value = '';
  if (confInp) confInp.value = '';
  const errorMsg = document.getElementById('nursePasswordErrorMsg');
  if (errorMsg) {
    errorMsg.innerText = '';
    errorMsg.classList.add('hidden');
  }
  modal.classList.remove('hidden');
  setTimeout(() => { curInp?.focus(); }, 100);
};

window.closeNurseChangePasswordModal = function() {
  const modal = document.getElementById('nurseChangePasswordModal');
  if (modal) modal.classList.add('hidden');
};

window.handleNurseChangePassword = function(e) {
  if (e) e.preventDefault();
  if (!currentUser || currentUser.role !== 'nurse') {
    alert('กรุณาเข้าสู่ระบบในฐานะพยาบาลก่อน');
    return false;
  }
  const nurse = NURSES.find(n => n.id === currentUser.nurseId);
  if (!nurse) {
    alert('ไม่พบข้อมูลพยาบาลในระบบ');
    return false;
  }

  const currentPin = document.getElementById('nurseCurrentPin')?.value || '';
  const newPin = document.getElementById('nurseNewPin')?.value || '';
  const confirmPin = document.getElementById('nurseConfirmPin')?.value || '';
  const errorMsg = document.getElementById('nursePasswordErrorMsg');

  const showError = (msg) => {
    if (errorMsg) {
      errorMsg.innerText = msg;
      errorMsg.classList.remove('hidden');
    } else {
      alert(msg);
    }
  };

  if (currentPin.trim() !== nurse.pin) {
    showError('❌ รหัส PIN เดิมไม่ถูกต้อง');
    return false;
  }

  if (newPin.trim().length < 4) {
    showError('❌ รหัส PIN ใหม่ต้องมีความยาวอย่างน้อย 4 ตัว');
    return false;
  }

  if (newPin !== confirmPin) {
    showError('❌ ยืนยัน PIN ใหม่ไม่ตรงกัน');
    return false;
  }

  nurse.pin = newPin.trim();
  saveNurses();
  closeNurseChangePasswordModal();
  if (typeof window.showToast === 'function') {
    window.showToast(`✓ เปลี่ยน PIN สำหรับ ${nurse.name} สำเร็จแล้ว`);
  } else {
    alert(`✓ เปลี่ยน PIN สำหรับ ${nurse.name} สำเร็จแล้ว`);
  }
  return true;
};

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

  const unauthButtonsMobile = document.getElementById('unauthButtonsMobile');
  const authControlsMobile = document.getElementById('authControlsMobile');
  const userProfileBadgeMobile = document.getElementById('userProfileBadgeMobile');

  if (!currentUser) {
    if (unauthButtons) unauthButtons.classList.remove('hidden');
    if (authControls) authControls.classList.add('hidden');
    if (unauthButtonsMobile) unauthButtonsMobile.classList.remove('hidden');
    if (authControlsMobile) authControlsMobile.classList.add('hidden');
  } else {
    if (unauthButtons) unauthButtons.classList.add('hidden');
    if (authControls) authControls.classList.remove('hidden');
    if (unauthButtonsMobile) unauthButtonsMobile.classList.add('hidden');
    if (authControlsMobile) authControlsMobile.classList.remove('hidden');
  }

  const unauthExcelBtn = document.getElementById('unauthExcelBtn');
  if (unauthExcelBtn) {
    if (!currentUser && monthState && monthState.isConfirmed) {
      unauthExcelBtn.classList.remove('hidden');
    } else {
      unauthExcelBtn.classList.add('hidden');
    }
  }

  if (currentUser) {
    if (currentUser.role === 'admin') {
      if (headerLogoutText) headerLogoutText.innerText = 'ออกจากหน้า Admin';
      if (userProfileBadge) {
        userProfileBadge.innerHTML = `
          <div class="flex items-center gap-1.5 sm:gap-2 bg-indigo-900/60 border border-white/30 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm min-w-0">
            <span class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40 shrink-0"></span>
            <span class="font-bold text-white truncate">🛡️ ผู้ดูแลระบบ (Admin)</span>
            <button onclick="openAdminChangePasswordModal()" class="ml-1 px-1.5 py-0.5 bg-amber-400/25 hover:bg-amber-400/45 border border-amber-300/50 rounded-lg text-amber-100 hover:text-white font-bold text-[10px] sm:text-[11px] transition flex items-center gap-1 cursor-pointer shrink-0" title="เปลี่ยนรหัสผ่าน Admin">
              <span>🔑</span>
              <span class="hidden sm:inline">เปลี่ยนรหัส</span>
            </button>
          </div>
        `;
      }
      if (userProfileBadgeMobile) {
        userProfileBadgeMobile.innerHTML = `
          <div class="flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-white min-w-0 flex-1">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-base sm:text-lg shrink-0">🛡️</span>
              <div class="min-w-0">
                <div class="font-black tracking-tight leading-tight">ผู้ดูแลระบบ (Admin)</div>
                <div class="text-[10px] text-blue-100 font-mono font-normal">สิทธิ์ผู้ดูแลระบบ</div>
              </div>
            </div>
            <button onclick="openAdminChangePasswordModal()" class="px-2.5 py-1 bg-amber-400/30 hover:bg-amber-400/50 border border-amber-300/50 rounded-lg text-white font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer">
              <span>🔑</span>
              <span>เปลี่ยนรหัส</span>
            </button>
          </div>
        `;
      }
    } else {
      if (headerLogoutText) headerLogoutText.innerText = 'ออกจากระบบ';
      if (userProfileBadge) {
        userProfileBadge.innerHTML = `
          <div class="flex items-center gap-1.5 sm:gap-2 bg-white/20 border border-white/30 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm min-w-0">
            <span class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-300 ring-2 ring-emerald-300/40 shrink-0"></span>
            <span class="font-bold text-white truncate">👩‍⚕️ ${currentUser.name}</span>
            <span class="font-mono text-blue-100 text-[10px] sm:text-xs shrink-0">(${currentUser.nurseId})</span>
            <button onclick="openNurseChangePasswordModal()" class="ml-1 px-1.5 py-0.5 bg-amber-400/25 hover:bg-amber-400/45 border border-amber-300/50 rounded-lg text-amber-100 hover:text-white font-bold text-[10px] sm:text-[11px] transition flex items-center gap-1 cursor-pointer shrink-0" title="เปลี่ยนรหัสผ่าน / PIN">
              <span>🔑</span>
              <span class="hidden sm:inline">เปลี่ยน PIN</span>
            </button>
          </div>
        `;
      }
      if (userProfileBadgeMobile) {
        userProfileBadgeMobile.innerHTML = `
          <div class="flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-white min-w-0 flex-1">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-base sm:text-lg shrink-0">👩‍⚕️</span>
              <div class="min-w-0">
                <div class="font-black tracking-tight leading-tight whitespace-normal">${currentUser.name}</div>
                <div class="text-[10px] text-blue-100 font-mono font-normal">รหัสพยาบาล: ${currentUser.nurseId}</div>
              </div>
            </div>
            <button onclick="openNurseChangePasswordModal()" class="px-2.5 py-1 bg-amber-400/30 hover:bg-amber-400/50 border border-amber-300/50 rounded-lg text-white font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer">
              <span>🔑</span>
              <span>เปลี่ยน PIN</span>
            </button>
          </div>
        `;
      }
    }
  }
  updateNavSwitcher(activeView);
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
    { el: excelBtn, target: 'excel', label: 'สรุปตารางเวร', icon: '📋', isAllowed: true },
    { el: adminBtn, target: 'admin', label: `ตารางรวม ${NURSES.length} ท่าน`, icon: '🛡️', isAllowed: isAdmin }
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
        <span class="text-xs sm:text-base leading-none shrink-0">${icon}</span>
        <span class="truncate">${label}</span>
        <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 shadow-xs shrink-0 animate-pulse ml-0.5"></span>
      `;
    } else {
      el.className = 'nav-tab-btn nav-tab-btn-inactive';
      el.innerHTML = `
        <span class="text-xs sm:text-base leading-none shrink-0">${icon}</span>
        <span class="truncate">${label}</span>
      `;
    }
  });

  // Sync Fixed Mobile Bottom Navigation Bar (Thumb Zone)
  const bottomNavItems = [
    { id: 'bottomNavDashboardBtn', target: 'dashboard' },
    { id: 'bottomNavPersonalBtn', target: 'personal' },
    { id: 'bottomNavExcelBtn', target: 'excel' },
    { id: 'bottomNavAdminBtn', target: 'admin' }
  ];
  bottomNavItems.forEach(({ id, target }) => {
    const bBtn = document.getElementById(id);
    if (!bBtn) return;
    const isTargetActive = (viewName === target);
    if (isTargetActive) {
      bBtn.className = "flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition text-blue-600 dark:text-blue-400 font-black bg-blue-50/80 dark:bg-blue-950/60 shadow-2xs active:scale-95 cursor-pointer";
    } else {
      bBtn.className = "flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-700 dark:hover:text-slate-200 active:scale-95 cursor-pointer";
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

  activeView = viewName;
  updateNavSwitcher(viewName);

  const publicDashSection = document.getElementById('publicDashboardSection');
  const nurseSection = document.getElementById('nursePersonalSection');
  const adminSection = document.getElementById('adminSection');
  const userExcelSection = document.getElementById('userExcelViewSection');

  // Strictly hide all main sections first so no other views or matrix tables leak through
  [publicDashSection, nurseSection, adminSection, userExcelSection].forEach(sec => {
    if (sec) {
      sec.classList.add('hidden');
      sec.style.setProperty('display', 'none', 'important');
    }
  });

  if (viewName === 'dashboard') {
    if (publicDashSection) {
      publicDashSection.classList.remove('hidden');
      publicDashSection.style.setProperty('display', 'block', 'important');
    }
    renderPublicDashboard();
  } else if (viewName === 'personal') {
    if (nurseSection) {
      nurseSection.classList.remove('hidden');
      nurseSection.style.setProperty('display', 'block', 'important');
    }
    renderNurseCalendar();
  } else if (viewName === 'admin') {
    if (adminSection) {
      adminSection.classList.remove('hidden');
      adminSection.style.setProperty('display', 'flex', 'important');
    }
    renderAdminView();
  } else if (viewName === 'excel') {
    if (userExcelSection) {
      userExcelSection.classList.remove('hidden');
      userExcelSection.style.setProperty('display', 'flex', 'important');
      const uSecTitle = document.getElementById('userExcelSectionTitle');
      if (uSecTitle) {
        uSecTitle.innerText = `สรุปตารางเวร ประจำเดือน ${THAI_MONTHS[currentMonth]} ${currentYear + 543}`;
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
      } else if (f === 'UNASSIGNED') {
        btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition flex items-center gap-1";
      } else {
        btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition";
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

  // Hide or show Excel View shortcut on public dashboard based on confirmation
  const dashExcelBtn = document.getElementById('dashExcelShortcutBtn');
  if (dashExcelBtn) {
    if (monthState && monthState.isConfirmed) {
      dashExcelBtn.classList.remove('hidden');
    } else {
      dashExcelBtn.classList.add('hidden');
    }
  }

  // Render 7-Day Header (Fit mobile without slide)
  const calHeader = document.getElementById('mainCalendarHeader');
  let hHtml = '';
  CALENDAR_HEADERS.forEach(ch => {
    hHtml += `
      <div class="p-1 sm:p-2 md:p-2.5 text-center rounded-lg sm:rounded-2xl border ${ch.headerClass} shadow-2xs bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm">
        <div class="text-[11px] sm:text-base md:text-lg font-black tracking-tight leading-tight">
          <span class="sm:hidden">${ch.short}</span>
          <span class="hidden sm:inline">${ch.th}</span>
        </div>
        <div class="text-[8px] sm:text-xs font-bold opacity-75 font-mono leading-tight">
          <span class="sm:hidden">${ch.en.slice(0, 2)}</span>
          <span class="hidden sm:inline">${ch.en}</span>
        </div>
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
      <div class="main-cal-empty-cell p-1 sm:p-2 flex items-start justify-end text-slate-300 select-none">
        <span class="opacity-25 font-mono text-[9px] sm:text-xs">•</span>
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

      // Styling: ในปฏิทิน ให้แสดงแค่จำนวนคนจอง ว่ามีกี่คน ให้ fit กับขนาด mobile ไม่ต้อง slide
      let rowClass = 'cal-shift-row';
      if (isUnassigned) {
        rowClass += ' cal-shift-unassigned';
      } else {
        rowClass += ' cal-shift-assigned';
      }

      const opacityClass = isVisible ? 'opacity-100' : 'opacity-25 grayscale pointer-events-none';

      shiftRowsHtml += `
        <div class="${rowClass} ${opacityClass} mb-0.5 sm:mb-1 last:mb-0" onclick="handleShiftClick(${d}, '${s}')" title="${shiftObj.name}: ${count} คน (แตะเพื่อดูรายละเอียด/จอง)">
          <div class="flex items-center justify-center sm:justify-between gap-0.5 sm:gap-1">
            <div class="flex items-center gap-0.5 sm:gap-1 font-bold text-[10px] sm:text-xs min-w-0">
              <span class="text-[9px] sm:text-sm shrink-0 leading-none">${shiftObj.icon}</span>
              <span class="hidden md:inline font-bold text-slate-800 dark:text-slate-100">${shiftObj.name}</span>
              <span class="hidden sm:inline md:hidden font-bold text-slate-800 dark:text-slate-100">${shiftObj.code}</span>
            </div>
            <span class="font-black text-[8px] sm:text-xs tracking-tighter shrink-0 ${isUnassigned ? 'text-rose-600 dark:text-rose-300' : 'text-sky-800 dark:text-sky-200'}">
              ${count}<span class="text-[7.5px] sm:text-xs font-normal">คน</span>
            </span>
          </div>
        </div>
      `;
    });

    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);

    let dayCardStyle = 'glass-card hover:border-blue-400';
    let dateNumColor = 'text-slate-900 dark:text-slate-100';
    let dayBadgeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

    if (isSunday) {
      dayCardStyle = 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200/90 dark:border-rose-900/60 hover:border-rose-400';
      dateNumColor = 'text-rose-600 dark:text-rose-400';
      dayBadgeClass = 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300';
    } else if (isSaturday) {
      dayCardStyle = 'bg-purple-50/75 dark:bg-purple-950/20 border-purple-200/90 dark:border-purple-900/60 hover:border-purple-400';
      dateNumColor = 'text-purple-700 dark:text-purple-400';
      dayBadgeClass = 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300';
    }

    calHtml += `
      <div class="main-cal-day-cell border ${dayCardStyle} shadow-2xs">
        <div>
          <!-- Day Header: Date Number & Day Abbreviation Badge -->
          <div class="flex items-center justify-between pb-1 border-b border-slate-200/70 dark:border-slate-800/80 mb-1">
            <span class="text-xs sm:text-base md:text-xl font-black ${dateNumColor}">${d}</span>
            <span class="text-[9px] sm:text-xs font-bold px-1 py-0.2 rounded ${dayBadgeClass}">
              ${CALENDAR_HEADERS[dayOfWeek].short}
            </span>
          </div>

          <!-- All Active Shifts in this day (Only Shift & Count) -->
          <div class="space-y-0.5 sm:space-y-1">
            ${shiftRowsHtml}
          </div>
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

  // Render Mobile Agenda Cards (มุมมองรายวัน - Matches Image 3)
  renderPublicDashboardDailyCards(activeShifts);

  // Sync Calendar View Mode (รายวัน vs ตาราง 7 วัน)
  updateCalendarViewDisplay();
}

// ==================== CALENDAR VIEW SWITCHER (รายวัน vs ตาราง 7 วัน) ====================
window.setCalendarViewMode = function(mode) {
  calendarViewMode = mode;
  try {
    localStorage.setItem('nurse_cal_view_mode', mode);
  } catch (e) {}
  updateCalendarViewDisplay();
};

function updateCalendarViewDisplay() {
  const dailyBtn = document.getElementById('calViewDailyBtn');
  const gridBtn = document.getElementById('calViewGridBtn');
  const dailyCont = document.getElementById('mainCalendarDailyContainer');
  const gridCont = document.getElementById('mainCalendarGridContainer');

  if (calendarViewMode === 'daily') {
    if (dailyBtn) dailyBtn.className = "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-blue-700 text-white shadow-xs transition cursor-pointer";
    if (gridBtn) gridBtn.className = "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition cursor-pointer";
    if (dailyCont) dailyCont.classList.remove('hidden');
    if (gridCont) gridCont.classList.add('hidden');
  } else {
    if (gridBtn) gridBtn.className = "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-blue-700 text-white shadow-xs transition cursor-pointer";
    if (dailyBtn) dailyBtn.className = "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition cursor-pointer";
    if (gridCont) gridCont.classList.remove('hidden');
    if (dailyCont) dailyCont.classList.add('hidden');
  }
}

// Render Mobile Agenda Cards (มุมมองรายวัน - Matches Image 3)
function renderPublicDashboardDailyCards(activeShifts) {
  const dailyContainer = document.getElementById('mainCalendarDailyContainer');
  if (!dailyContainer) return;

  const daysCount = getDaysCount(currentYear, currentMonth);
  let html = '';

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const dayName = CALENDAR_HEADERS[dayOfWeek].th;
    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);

    let dayCardBorder = 'border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60';
    let dateBadgeBg = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700';
    let dayTitleColor = 'text-slate-900 dark:text-white';
    let dayBadge = '';

    if (isSunday) {
      dayCardBorder = 'border-rose-200/90 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10';
      dateBadgeBg = 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      dayTitleColor = 'text-rose-600 dark:text-rose-400';
      dayBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">อาทิตย์</span>';
    } else if (isSaturday) {
      dayCardBorder = 'border-purple-200/90 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/10';
      dateBadgeBg = 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      dayTitleColor = 'text-purple-700 dark:text-purple-400';
      dayBadge = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">เสาร์</span>';
    }

    // Build shift rows for this day
    let shiftRowsHtml = '';
    let visibleShiftsCount = 0;

    activeShifts.forEach(s => {
      const shiftObj = SHIFTS[s];
      const assigned = [];
      NURSES.forEach(n => {
        const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
        if (shifts.includes(s)) assigned.push(n);
      });

      const count = assigned.length;
      const isUnassigned = (count === 0);

      // Check Dashboard Filter
      if (dashboardShiftFilter === 'UNASSIGNED' && !isUnassigned) return;
      if (dashboardShiftFilter === 'M' && s !== 'M') return;
      if (dashboardShiftFilter === 'A' && s !== 'A') return;
      if (dashboardShiftFilter === 'N' && s !== 'N') return;

      visibleShiftsCount++;

      // Shift row styling
      let rowBorder = 'border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800';
      let nurseBadgesHtml = '';

      if (isUnassigned) {
        rowBorder = 'border-rose-200 dark:border-rose-900/60 bg-rose-50/35 dark:bg-rose-950/20 hover:bg-rose-50/70 dark:hover:bg-rose-950/40';
        nurseBadgesHtml = `
          <span class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900/70">
            <span>○</span>
            <span>เวรว่าง (แตะเพื่อจอง)</span>
          </span>
        `;
      } else {
        nurseBadgesHtml = assigned.map(n => {
          const nurseNum = n.id.replace(/\D/g, '') || n.id;
          const cleanName = n.name.replace(/^พว\.\s*/, '');
          const badgeBg = n.color || '#2563eb';
          return `
            <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl text-white shadow-2xs transition transform hover:scale-105"
                  style="background-color: ${badgeBg};">
              <span class="opacity-90 font-mono">#${nurseNum}</span>
              <span>${cleanName}</span>
            </span>
          `;
        }).join('');
      }

      // Person count badge
      const countBadge = isUnassigned
        ? `<span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">0 คน</span>`
        : `<span class="px-2.5 py-1 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600">${count} คน</span>`;

      // Shift time display
      let timeStr = '08:30';
      if (s === 'A') timeStr = '16:30';
      if (s === 'N') timeStr = '00:30';

      shiftRowsHtml += `
        <div class="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border ${rowBorder} transition cursor-pointer gap-2 shadow-2xs"
             onclick="handleShiftClick(${d}, '${s}')" title="แตะเพื่อดูรายชื่อหรือเลือกจองเวรนี้">
          <div class="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-xl sm:text-2xl">${shiftObj.icon}</span>
              <span class="font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100">${shiftObj.name}</span>
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">(${timeStr})</span>
            </div>

            <!-- Nurse Badges -->
            <div class="flex items-center gap-1.5 flex-wrap">
              ${nurseBadgesHtml}
            </div>
          </div>

          <div class="shrink-0">
            ${countBadge}
          </div>
        </div>
      `;
    });

    if (visibleShiftsCount === 0 && dashboardShiftFilter !== 'ALL') {
      continue;
    }

    html += `
      <div class="glass-card rounded-3xl p-4 sm:p-5 border ${dayCardBorder} shadow-sm space-y-3">
        <!-- Day Card Header -->
        <div class="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${dateBadgeBg} border flex items-center justify-center font-black text-lg sm:text-xl shadow-inner shrink-0">
              ${d}
            </div>
            <div>
              <div class="font-black text-base sm:text-lg ${dayTitleColor} font-heading flex items-center gap-2">
                <span>${dayName}</span>
                ${dayBadge}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ${d} ${THAI_MONTHS[currentMonth]} ${currentYear + 543}
              </div>
            </div>
          </div>
        </div>

        <!-- Shift Rows -->
        <div class="space-y-2 pt-0.5">
          ${shiftRowsHtml}
        </div>
      </div>
    `;
  }

  if (!html) {
    html = `
      <div class="glass-card rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
        <div class="text-3xl mb-2">🔍</div>
        <div class="font-bold text-sm">ไม่พบเวรที่ตรงกับตัวกรองที่เลือก</div>
      </div>
    `;
  }

  dailyContainer.innerHTML = html;
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

      const bodyEl = document.getElementById('shiftModalBody');
      bodyEl.innerHTML = `
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-slate-600 dark:text-slate-300 font-medium">จำนวนพยาบาลที่เลือกเวรนี้:</span>
            <span class="font-black text-sm ${assigned.length === 0 ? 'text-rose-500 dark:text-rose-400' : 'text-blue-900 dark:text-blue-300'}">${assigned.length} ท่าน</span>
          </div>
          ${assigned.length === 0 ? `
            <div class="p-2.5 text-center bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 font-bold text-xs rounded-xl">
              เวรว่าง (ยังไม่มีพยาบาลเลือกเวรนี้)
            </div>
          ` : `
            <div class="p-2.5 text-center bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-sky-800 dark:text-sky-300 font-semibold text-xs rounded-xl">
              ✓ มีพยาบาลเลือกเวรนี้แล้ว ${assigned.length} ท่าน
            </div>
          `}
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
      <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-slate-600 dark:text-slate-300 font-medium">จำนวนพยาบาลที่เลือกเวรนี้:</span>
          <span class="font-black text-sm ${assigned.length === 0 ? 'text-rose-500 dark:text-rose-400' : 'text-blue-900 dark:text-blue-300'}">${assigned.length} ท่าน</span>
        </div>
        ${assigned.length === 0 ? `
          <div class="p-2.5 text-center bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 font-bold text-xs rounded-xl">
            เวรว่าง (ยังไม่มีพยาบาลเลือกเวรนี้)
          </div>
        ` : `
          <div class="p-2.5 text-center bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-sky-800 dark:text-sky-300 font-semibold text-xs rounded-xl">
            ✓ มีพยาบาลเลือกเวรนี้แล้ว ${assigned.length} ท่าน
          </div>
        `}
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
            <span>สรุปตารางเวร</span>
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

  // Render 7-Day Monthly Calendar Grid Header: Fit to mobile without slide
  const calHeader = document.getElementById('nurseCalendarHeader');
  let hHtml = '';
  CALENDAR_HEADERS.forEach(ch => {
    hHtml += `
      <div class="p-1 sm:p-2 md:p-2.5 text-center rounded-lg sm:rounded-2xl border ${ch.headerClass} shadow-2xs bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm">
        <div class="text-[11px] sm:text-base md:text-lg font-black tracking-tight leading-tight">
          <span class="sm:hidden">${ch.short}</span>
          <span class="hidden sm:inline">${ch.th}</span>
        </div>
        <div class="text-[8px] sm:text-xs font-bold opacity-75 font-mono leading-tight">
          <span class="sm:hidden">${ch.en.slice(0, 2)}</span>
          <span class="hidden sm:inline">${ch.en}</span>
        </div>
      </div>
    `;
  });
  calHeader.innerHTML = hHtml;

  // Render 7-Day Monthly Calendar Grid Body: แสดงแบบ Icon ใน mobile
  const calGrid = document.getElementById('nurseCalendarGrid');
  let calHtml = '';

  // Pad beginning of month
  for (let pad = 0; pad < firstDayIndex; pad++) {
    calHtml += `
      <div class="calendar-empty-cell p-1 sm:p-2 flex items-start justify-end text-slate-300 select-none">
        <span class="opacity-25 font-mono text-[9px] sm:text-xs">•</span>
      </div>
    `;
  }

  // Days 1..daysCount: Only showing nurse's OWN selected shifts as Icons on mobile!
  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);
    const dayShifts = nurseShifts[d] || [];

    let shiftBadges = '';
    if (dayShifts.length > 0) {
      shiftBadges = `<div class="flex items-center justify-center gap-1 flex-wrap sm:flex-col sm:space-y-1">`;
      dayShifts.forEach(s => {
        if (s === 'M') {
          shiftBadges += `
            <span class="shift-tag shift-m py-0.5 px-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1 shadow-2xs w-auto sm:w-full" title="เวรเช้า (08:30-16:30)">
              <span class="text-xs sm:text-sm leading-none">☀️</span>
              <span class="hidden sm:inline font-bold">เช้า</span>
            </span>
          `;
        }
        if (s === 'A') {
          shiftBadges += `
            <span class="shift-tag shift-a py-0.5 px-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1 shadow-2xs w-auto sm:w-full" title="เวรบ่าย (16:30-00:30)">
              <span class="text-xs sm:text-sm leading-none">⛅</span>
              <span class="hidden sm:inline font-bold">บ่าย</span>
            </span>
          `;
        }
        if (s === 'N' && shiftMode === 3) {
          shiftBadges += `
            <span class="shift-tag shift-n py-0.5 px-1 sm:py-1 sm:px-2 rounded-md sm:rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1 shadow-2xs w-auto sm:w-full" title="เวรดึก (00:30-08:30)">
              <span class="text-xs sm:text-sm leading-none">🌙</span>
              <span class="hidden sm:inline font-bold">ดึก</span>
            </span>
          `;
        }
      });
      shiftBadges += `</div>`;
    }

    let dayCardStyle = 'glass-card hover:border-blue-400';
    let dateColor = 'text-slate-900 dark:text-slate-100';
    let badgeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

    if (isSunday) {
      dayCardStyle = 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200/90 dark:border-rose-900/60 hover:border-rose-400';
      dateColor = 'text-rose-600 dark:text-rose-400';
      badgeClass = 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300';
    } else if (isSaturday) {
      dayCardStyle = 'bg-purple-50/75 dark:bg-purple-950/20 border-purple-200/90 dark:border-purple-900/60 hover:border-purple-400';
      dateColor = 'text-purple-700 dark:text-purple-400';
      badgeClass = 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300';
    }

    let clickAttr = '';
    let emptySlotText = '';
    if (isConfirmed) {
      clickAttr = `onclick="window.showToast('🔒 ตารางเวรประจำเดือนนี้ได้รับการยืนยันทางการแล้ว ปิดรับการแก้ไขหรือจองเพิ่ม')"`;
      emptySlotText = `<span class="text-[10px] sm:text-xs text-slate-300 dark:text-slate-600 font-medium block text-center py-1">-</span>`;
    } else {
      clickAttr = `onclick="openCellEditor('${nurseId}', ${d})"`;
      emptySlotText = `
        <span class="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium block text-center py-0.5 sm:py-1 hover:text-blue-600">
          <span class="sm:hidden font-black text-xs text-blue-500/70">+</span>
          <span class="hidden sm:inline italic">+ แตะเลือกเวร</span>
        </span>
      `;
    }

    calHtml += `
      <div class="calendar-day-cell border p-1 sm:p-2.5 md:p-3 flex flex-col justify-between shadow-2xs transition ${dayCardStyle} ${isConfirmed ? 'cursor-default' : 'cursor-pointer'}" ${clickAttr}>
        <div class="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <span class="text-xs sm:text-base md:text-xl font-black ${dateColor}">${d}</span>
          <span class="text-[9px] sm:text-xs font-bold px-1 py-0.2 rounded ${badgeClass}">
            ${CALENDAR_HEADERS[dayOfWeek].short}
          </span>
        </div>
        <div class="mt-1">
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
  const views = ['matrix', 'excel', 'daily', 'summary', 'vacancies', 'chart'];
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
  if (adminActiveSubView === 'chart') renderDutyChart();
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
  const isConfirmed = !!(monthState && monthState.isConfirmed);

  // Update Status Badge if on User Excel View Section
  const statusBadge = document.getElementById('userExcelStatusBadge');
  if (statusBadge) {
    if (isConfirmed) {
      statusBadge.className = "text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1";
      statusBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span><span>ประกาศตารางทางการแล้ว</span>`;
    } else {
      statusBadge.className = "text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1";
      statusBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span><span>รอดำเนินการจัดตารางเวรอัตโนมัติ</span>`;
    }
  }

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
      let cellContent = '';
      if (!isConfirmed) {
        // ให้ว่างไว้จนกว่าจะกด จัดตารางเวรอัตโนมัติ
        cellContent = `
          <div class="min-h-[30px] flex items-center justify-center text-slate-300 font-bold select-none">
            -
          </div>
        `;
      } else {
        const assignedNurses = [];
        NURSES.forEach(n => {
          const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
          if (shifts.includes(sDef.key)) assignedNurses.push(n);
        });

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

  // Informational banner for user when schedule is unconfirmed
  const userNoticeHtml = !isConfirmed ? `
    <div class="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 text-xs mb-4 flex items-start gap-3 shadow-2xs">
      <span class="text-2xl">📢</span>
      <div>
        <div class="font-bold text-sm text-amber-950">ยังไม่ได้ดำเนินการจัดตารางเวรอัตโนมัติ (Automated Shift Optimizer)</div>
        <div class="mt-1 leading-relaxed text-slate-700">
          ขณะนี้ตารางเวรตามหมายเลขประจำเดือนนี้ยังไม่ได้ผ่านการจัดตารางเวรอัตโนมัติและกดยืนยันจากผู้ดูแลระบบ (Admin)
          เนื้อหาตารางจึงแสดงเป็นช่องว่าง โปรดรอผู้ดูแลระบบดำเนินการจัดตารางเวรให้เรียบร้อย
        </div>
      </div>
    </div>
  ` : '';

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

      ${userNoticeHtml}

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

// 9.5 ADMIN DUTY ANALYTICS & VISUALIZATION (ศูนย์วิเคราะห์และสถิติตารางเวร)
// โหมด: 1. เปรียบเทียบทุกคน (รายเดือน), 2. แต่ละคน (รายเดือน 12 เดือน), 3. ยอดเวรสะสม (Cumulative)
let chartDisplayMode = 'compare_monthly'; // 'compare_monthly', 'individual_monthly', 'cumulative'
let chartSelectedMonth = currentMonth;
let chartSelectedNurseId = 'ALL';
let chartCumulativeSubMode = 'total_bar'; // 'total_bar' (สะสมทุกคน 14 ท่าน), 'trend_line' (แนวโน้มสะสม 12 เดือน)
let dutyChartInstance = null;

window.setChartDisplayMode = function(mode) {
  chartDisplayMode = mode;
  
  // Update Tab Buttons UI
  const tabCompare = document.getElementById('chartTabCompareMonthlyBtn');
  const tabIndiv = document.getElementById('chartTabIndividualMonthlyBtn');
  const tabCumul = document.getElementById('chartTabCumulativeBtn');

  const activeClass = "px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 bg-blue-600 text-white shadow-xs cursor-pointer";
  const inactiveClass = "px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-50 cursor-pointer";

  if (tabCompare) tabCompare.className = (mode === 'compare_monthly') ? activeClass : inactiveClass;
  if (tabIndiv) tabIndiv.className = (mode === 'individual_monthly') ? activeClass : inactiveClass;
  if (tabCumul) tabCumul.className = (mode === 'cumulative') ? activeClass : inactiveClass;

  renderDutyChart();
};

window.setChartSelectedMonth = function(m) {
  chartSelectedMonth = parseInt(m, 10);
  renderDutyChart();
};

window.setChartSelectedNurse = function(nurseId) {
  chartSelectedNurseId = nurseId;
  renderDutyChart();
};

window.setChartCumulativeSubMode = function(subMode) {
  chartCumulativeSubMode = subMode;
  renderDutyChart();
};

// Helper: Read roster for any month
function getRosterForMonth(year, month) {
  if (month === currentMonth && year === currentYear && monthState && monthState.roster) {
    return monthState.roster;
  }
  const key = `nurse_system_${year}_${month}`;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return parsed.roster || {};
    } catch (e) {
      return {};
    }
  }
  return {};
}

// Helper: Gather 12-month roster statistics for all nurses
function getYearlyRosterStats() {
  const stats = {};
  NURSES.forEach(n => {
    stats[n.id] = [];
  });

  for (let m = 0; m < 12; m++) {
    const roster = getRosterForMonth(currentYear, m);
    const daysInM = getDaysCount(currentYear, m);

    NURSES.forEach(n => {
      const nurseShifts = roster[n.id] || {};
      let countM = 0, countA = 0, countN = 0;
      for (let d = 1; d <= daysInM; d++) {
        const shifts = nurseShifts[d] || [];
        if (shifts.includes('M')) countM++;
        if (shifts.includes('A')) countA++;
        if (shifts.includes('N') && shiftMode === 3) countN++;
      }
      const tot = (shiftMode === 3) ? (countM + countA + countN) : (countM + countA);
      stats[n.id].push({ M: countM, A: countA, N: countN, tot });
    });
  }

  return stats;
}

window.renderDutyChart = renderDutyChart;

function renderDutyChart() {
  const canvas = document.getElementById('dutyChartCanvas');
  if (!canvas) return;

  const filtersBar = document.getElementById('chartSubFilterControls');
  const kpiContainer = document.getElementById('chartKpiCardsContainer');
  const titleEl = document.getElementById('chartCanvasTitle');
  const subtitleEl = document.getElementById('chartCanvasSubtitle');
  const tableContainer = document.getElementById('chartSummaryTableContainer');

  // Legend night pill
  const legNight = document.getElementById('chartLegendNight');
  if (legNight) legNight.style.display = (shiftMode === 2 ? 'none' : 'inline-flex');
  const legTarget = document.getElementById('chartLegendTarget');
  if (legTarget) legTarget.style.display = (chartDisplayMode === 'individual_monthly' ? 'none' : 'inline-flex');

  const yearlyStats = getYearlyRosterStats();

  let chartLabels = [];
  let chartDatasets = [];
  let chartIsStacked = true;
  let summaryTableHtml = '';

  // =========================================================================
  // VIEW 1: เปรียบเทียบทุกคน (รายเดือน) - Stacked Bars per Nurse + Average Target Line
  // =========================================================================
  if (chartDisplayMode === 'compare_monthly') {
    // 1. Context Filters Toolbar: Month Selector
    if (filtersBar) {
      filtersBar.innerHTML = `
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-bold text-slate-700">📅 เลือกเดือน:</span>
          <div class="inline-flex items-center gap-1 bg-white border border-slate-300 rounded-xl p-0.5 shadow-2xs">
            <button onclick="setChartSelectedMonth(Math.max(0, chartSelectedMonth - 1))" 
                    class="p-1 px-2.5 hover:bg-slate-100 rounded-lg text-slate-700 font-bold transition cursor-pointer" title="เดือนก่อนหน้า">◀</button>
            <select onchange="setChartSelectedMonth(this.value)" 
                    class="rounded-lg px-2.5 py-1 text-xs font-black text-blue-900 border-none outline-none cursor-pointer bg-transparent">
              ${THAI_MONTHS.map((name, idx) => `
                <option value="${idx}" ${idx === chartSelectedMonth ? 'selected' : ''}>
                  ${name} (${idx + 1}/${currentYear + 543})
                </option>
              `).join('')}
            </select>
            <button onclick="setChartSelectedMonth(Math.min(11, chartSelectedMonth + 1))" 
                    class="p-1 px-2.5 hover:bg-slate-100 rounded-lg text-slate-700 font-bold transition cursor-pointer" title="เดือนถัดไป">▶</button>
          </div>
          <button onclick="setChartSelectedMonth(${currentMonth})" 
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${chartSelectedMonth === currentMonth ? 'bg-blue-600 text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50'}">
            📅 เดือนปัจจุบัน (${THAI_MONTHS[currentMonth]})
          </button>
        </div>
      `;
    }

    // 2. Data Calculation
    const mCounts = [];
    const aCounts = [];
    const nCounts = [];
    const totCounts = [];
    const nurseRows = [];

    let totalMonthShifts = 0;
    let maxNurse = { name: '-', tot: -1 };
    let minNurse = { name: '-', tot: 99999 };

    NURSES.forEach(n => {
      const monthData = yearlyStats[n.id][chartSelectedMonth] || { M: 0, A: 0, N: 0, tot: 0 };
      mCounts.push(monthData.M);
      aCounts.push(monthData.A);
      nCounts.push(monthData.N);
      totCounts.push(monthData.tot);

      totalMonthShifts += monthData.tot;

      if (monthData.tot > maxNurse.tot) {
        maxNurse = { name: n.name, tot: monthData.tot, num: n.num };
      }
      if (monthData.tot < minNurse.tot) {
        minNurse = { name: n.name, tot: monthData.tot, num: n.num };
      }

      nurseRows.push({
        nurse: n,
        M: monthData.M,
        A: monthData.A,
        N: monthData.N,
        tot: monthData.tot
      });

      const shortName = n.name.replace(/^(น\.ส\.|นาง|นาย)\s*/, '').split(' ')[0] || n.name;
      chartLabels.push(`#${n.num} ${shortName}`);
    });

    const targetAvg = NURSES.length > 0 ? (totalMonthShifts / NURSES.length) : 0;
    if (minNurse.tot === 99999) minNurse = { name: '-', tot: 0, num: 0 };

    // 3. Titles
    if (titleEl) titleEl.innerText = `👥 เปรียบเทียบจำนวนเวรพยาบาลทั้ง ${NURSES.length} ท่าน ประจำเดือน ${THAI_MONTHS[chartSelectedMonth]} ${currentYear + 543}`;
    if (subtitleEl) subtitleEl.innerText = `(กราฟแท่งแบบซ้อนแยกตามกะ เช้า/บ่าย/ดึก พร้อมเส้นเป้าหมายค่าเฉลี่ยแผนก)`;

    // 4. KPI Cards
    if (kpiContainer) {
      kpiContainer.innerHTML = `
        <div class="glass-card rounded-2xl p-4 border border-blue-200/60 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-blue-900">🏢 เวรทั้งหมดในเดือนนี้</span>
            <span class="text-lg">📋</span>
          </div>
          <div class="text-2xl font-black text-blue-950">${totalMonthShifts} <span class="text-xs font-bold text-blue-700">เวร</span></div>
          <div class="text-[11px] text-slate-500 font-medium mt-0.5">รวมชั่วโมง: ${totalMonthShifts * 8} ชม.</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-rose-200/60 bg-gradient-to-br from-rose-50/70 to-orange-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-rose-900">🎯 ค่าเฉลี่ยเวรต่อคน</span>
            <span class="text-lg">⚖️</span>
          </div>
          <div class="text-2xl font-black text-rose-950">${targetAvg.toFixed(1)} <span class="text-xs font-bold text-rose-700">เวร/ท่าน</span></div>
          <div class="text-[11px] text-slate-500 font-medium mt-0.5">เกณฑ์จัดเวรที่เท่าเทียม</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-emerald-200/60 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-emerald-900">🥇 ผู้เข้าเวรสูงสุด</span>
            <span class="text-lg">🔝</span>
          </div>
          <div class="text-2xl font-black text-emerald-950">${maxNurse.tot} <span class="text-xs font-bold text-emerald-700">เวร</span></div>
          <div class="text-[11px] text-slate-600 font-bold truncate mt-0.5">${maxNurse.num ? '#' + maxNurse.num + ' ' : ''}${maxNurse.name}</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-amber-200/60 bg-gradient-to-br from-amber-50/70 to-yellow-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-amber-900">📉 ผู้เข้าเวรต่ำสุด</span>
            <span class="text-lg">🔻</span>
          </div>
          <div class="text-2xl font-black text-amber-950">${minNurse.tot} <span class="text-xs font-bold text-amber-700">เวร</span></div>
          <div class="text-[11px] text-slate-600 font-bold truncate mt-0.5">${minNurse.num ? '#' + minNurse.num + ' ' : ''}${minNurse.name}</div>
        </div>
      `;
    }

    // 5. Datasets (Stacked Bar + Target Line)
    chartIsStacked = true;
    chartDatasets = [
      {
        type: 'bar',
        label: 'เวรเช้า (M)',
        data: mCounts,
        backgroundColor: '#0284c7',
        borderRadius: 4,
        stack: 'duty_stack'
      },
      {
        type: 'bar',
        label: 'เวรบ่าย (A)',
        data: aCounts,
        backgroundColor: '#f59e0b',
        borderRadius: 4,
        stack: 'duty_stack'
      }
    ];

    if (shiftMode === 3) {
      chartDatasets.push({
        type: 'bar',
        label: 'เวรดึก (N)',
        data: nCounts,
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
        stack: 'duty_stack'
      });
    }

    // Reference Target Line
    chartDatasets.push({
      type: 'line',
      label: 'ค่าเฉลี่ยเป้าหมาย',
      data: Array(NURSES.length).fill(parseFloat(targetAvg.toFixed(1))),
      borderColor: '#ef4444',
      borderWidth: 2.5,
      borderDash: [6, 4],
      pointRadius: 0,
      fill: false,
      stack: 'none'
    });

    // 6. Summary Table
    let rowsHtml = '';
    nurseRows.forEach((r, idx) => {
      const isEven = (idx % 2 === 1);
      const rowBg = isEven ? 'bg-slate-50/70' : 'bg-white';
      const diff = r.tot - targetAvg;
      let balanceBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">🟢 ตามเป้าหมาย</span>`;
      if (diff >= 2) {
        balanceBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">🟠 สูงกว่าเฉลี่ย (+${diff.toFixed(1)})</span>`;
      } else if (diff <= -2) {
        balanceBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">🔵 ต่ำกว่าเฉลี่ย (${diff.toFixed(1)})</span>`;
      }

      rowsHtml += `
        <tr class="${rowBg} hover:bg-blue-50/60 transition border-b border-slate-100">
          <td class="py-2.5 px-3 text-center">
            <span class="nurse-num-badge w-6 h-6 text-xs font-black shadow-2xs" 
                  style="background-color: ${r.nurse.color}; color: ${getContrastColor(r.nurse.color)};">
              ${r.nurse.num}
            </span>
          </td>
          <td class="py-2.5 px-3 font-mono font-bold text-blue-900">${r.nurse.id}</td>
          <td class="py-2.5 px-3 font-bold text-slate-800">${r.nurse.name}</td>
          <td class="py-2.5 px-3 text-center text-sky-800 font-bold bg-sky-50/40">${r.M}</td>
          <td class="py-2.5 px-3 text-center text-amber-800 font-bold bg-amber-50/40">${r.A}</td>
          ${shiftMode === 3 ? `<td class="py-2.5 px-3 text-center text-purple-800 font-bold bg-purple-50/40">${r.N}</td>` : ''}
          <td class="py-2.5 px-3 text-center font-black text-blue-950 bg-blue-50/80">${r.tot}</td>
          <td class="py-2.5 px-3 text-center font-mono text-slate-600">${r.tot * 8} ชม.</td>
          <td class="py-2.5 px-3 text-center">${balanceBadge}</td>
        </tr>
      `;
    });

    summaryTableHtml = `
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 flex-wrap gap-2">
        <h4 class="text-xs md:text-sm font-black text-slate-900 flex items-center gap-1.5">
          <span>📊</span>
          <span>ตารางแจกแจงเวรพยาบาล ประจำเดือน ${THAI_MONTHS[chartSelectedMonth]} ${currentYear + 543}</span>
        </h4>
        <span class="text-xs text-slate-500 font-bold">รวมทั้งหมด ${totalMonthShifts} เวร</span>
      </div>
      <table class="min-w-full text-left text-xs border-collapse">
        <thead class="bg-slate-100 text-slate-700 font-black border-b border-slate-300">
          <tr>
            <th class="py-2.5 px-3 text-center w-12">#</th>
            <th class="py-2.5 px-3 w-24">รหัส</th>
            <th class="py-2.5 px-3">ชื่อ - สกุล</th>
            <th class="py-2.5 px-3 text-center text-sky-900 bg-sky-100/60 w-24">☀️ เวรเช้า (M)</th>
            <th class="py-2.5 px-3 text-center text-amber-900 bg-amber-100/60 w-24">⛅ เวรบ่าย (A)</th>
            ${shiftMode === 3 ? '<th class="py-2.5 px-3 text-center text-purple-900 bg-purple-100/60 w-24">🌙 เวรดึก (N)</th>' : ''}
            <th class="py-2.5 px-3 text-center text-blue-950 bg-blue-100/80 w-24">รวมเวร</th>
            <th class="py-2.5 px-3 text-center w-24">รวมชั่วโมง</th>
            <th class="py-2.5 px-3 text-center w-36">สถานะเทียบค่าเฉลี่ย</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
        <tfoot class="bg-slate-100 font-black text-slate-800 border-t-2 border-slate-300">
          <tr>
            <td colspan="3" class="py-2.5 px-3 text-right">รวมทั้งสิ้นในเดือนนี้:</td>
            <td class="py-2.5 px-3 text-center text-sky-900 font-black">${mCounts.reduce((a,b)=>a+b,0)}</td>
            <td class="py-2.5 px-3 text-center text-amber-900 font-black">${aCounts.reduce((a,b)=>a+b,0)}</td>
            ${shiftMode === 3 ? `<td class="py-2.5 px-3 text-center text-purple-900 font-black">${nCounts.reduce((a,b)=>a+b,0)}</td>` : ''}
            <td class="py-2.5 px-3 text-center text-blue-950 font-black">${totalMonthShifts}</td>
            <td class="py-2.5 px-3 text-center font-mono font-black">${totalMonthShifts * 8} ชม.</td>
            <td class="py-2.5 px-3 text-center text-slate-500 font-normal">เฉลี่ย ${targetAvg.toFixed(1)}/ท่าน</td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  // =========================================================================
  // VIEW 2: แต่ละคน (รายเดือน 12 เดือน) - Grouped / Stacked Bars + Monthly Line
  // =========================================================================
  else if (chartDisplayMode === 'individual_monthly') {
    // 1. Context Filters Toolbar: Nurse Selector + Quick Chips
    if (filtersBar) {
      const quickChipsHtml = NURSES.map(n => `
        <button type="button" onclick="setChartSelectedNurse('${n.id}')"
                class="px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${chartSelectedNurseId === n.id ? 'ring-2 ring-blue-600 bg-blue-50 text-blue-900 border-blue-400' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}"
                title="${n.name}">
          <span class="nurse-num-badge w-4 h-4 text-[9px] font-black inline-flex items-center justify-center rounded-sm"
                style="background-color: ${n.color}; color: ${getContrastColor(n.color)};">
            ${n.num}
          </span>
          <span>${n.name.split(' ')[0]}</span>
        </button>
      `).join('');

      filtersBar.innerHTML = `
        <div class="flex items-center gap-2.5 flex-wrap w-full">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-700">👩‍⚕️ เลือกพยาบาล:</span>
            <select id="chartNurseSelect" onchange="setChartSelectedNurse(this.value)" 
                    class="glass-input rounded-xl px-3 py-1.5 text-xs font-bold text-blue-900 outline-none cursor-pointer">
              <option value="ALL" ${chartSelectedNurseId === 'ALL' ? 'selected' : ''}>🏢 รวมทั้งแผนก (Department Total)</option>
              ${NURSES.map(n => `<option value="${n.id}" ${n.id === chartSelectedNurseId ? 'selected' : ''}>#${n.num} ${n.name}</option>`).join('')}
            </select>
          </div>
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button type="button" onclick="setChartSelectedNurse('ALL')"
                    class="px-2.5 py-1 rounded-xl text-xs font-bold transition border cursor-pointer ${chartSelectedNurseId === 'ALL' ? 'ring-2 ring-blue-600 bg-blue-50 text-blue-900 border-blue-400' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}">
              🏢 รวมแผนก
            </button>
            ${quickChipsHtml}
          </div>
        </div>
      `;
    }

    // 2. Data Calculation across 12 months
    chartLabels = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const mCounts = [];
    const aCounts = [];
    const nCounts = [];
    const totCounts = [];
    const monthlyRows = [];

    let yearTot = 0;
    let yearM = 0;
    let yearA = 0;
    let yearN = 0;
    let peakMonth = { name: '-', val: 0 };

    for (let m = 0; m < 12; m++) {
      let mVal = 0, aVal = 0, nVal = 0;
      if (chartSelectedNurseId === 'ALL') {
        NURSES.forEach(n => {
          const d = yearlyStats[n.id][m];
          mVal += d.M; aVal += d.A; nVal += d.N;
        });
      } else {
        const d = yearlyStats[chartSelectedNurseId] ? yearlyStats[chartSelectedNurseId][m] : { M: 0, A: 0, N: 0 };
        mVal = d.M; aVal = d.A; nVal = d.N;
      }

      const tot = (shiftMode === 3) ? (mVal + aVal + nVal) : (mVal + aVal);
      mCounts.push(mVal);
      aCounts.push(aVal);
      nCounts.push(nVal);
      totCounts.push(tot);

      yearTot += tot;
      yearM += mVal;
      yearA += aVal;
      yearN += nVal;

      if (tot > peakMonth.val) {
        peakMonth = { name: THAI_MONTHS[m], val: tot };
      }

      monthlyRows.push({
        monthName: THAI_MONTHS[m],
        monthIndex: m,
        M: mVal,
        A: aVal,
        N: nVal,
        tot: tot
      });
    }

    const selectedNurseObj = NURSES.find(n => n.id === chartSelectedNurseId);
    const targetLabel = (chartSelectedNurseId === 'ALL') ? 'รวมทั้งแผนก' : `${selectedNurseObj?.name} (หมายเลข ${selectedNurseObj?.num})`;

    // 3. Titles
    if (titleEl) titleEl.innerText = `👩‍⚕️ สถิติการเข้าเวรรายเดือน: ${targetLabel} ประจำปี พ.ศ. ${currentYear + 543}`;
    if (subtitleEl) subtitleEl.innerText = `(แสดงแจกแจงเวรแต่ละกะ ☀️ เช้า, ⛅ บ่าย, 🌙 ดึก และเส้นแนวโน้มผลรวมทั้ง 12 เดือน)`;

    // 4. KPI Cards
    if (kpiContainer) {
      kpiContainer.innerHTML = `
        <div class="glass-card rounded-2xl p-4 border border-blue-200/60 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-blue-900">🏆 เวรรวมทั้งปี</span>
            <span class="text-lg">🌟</span>
          </div>
          <div class="text-2xl font-black text-blue-950">${yearTot} <span class="text-xs font-bold text-blue-700">เวร</span></div>
          <div class="text-[11px] text-slate-500 font-medium mt-0.5">รวมทั้งปี: ${yearTot * 8} ชั่วโมง</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-indigo-200/60 bg-gradient-to-br from-indigo-50/70 to-blue-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-indigo-900">📊 เฉลี่ยต่อเดือน</span>
            <span class="text-lg">📈</span>
          </div>
          <div class="text-2xl font-black text-indigo-950">${(yearTot / 12).toFixed(1)} <span class="text-xs font-bold text-indigo-700">เวร/เดือน</span></div>
          <div class="text-[11px] text-slate-500 font-medium mt-0.5">เฉลี่ย: ${((yearTot * 8) / 12).toFixed(1)} ชม./เดือน</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-emerald-200/60 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-emerald-900">🔥 เดือนที่เวรสูงสุด</span>
            <span class="text-lg">📅</span>
          </div>
          <div class="text-2xl font-black text-emerald-950">${peakMonth.val} <span class="text-xs font-bold text-emerald-700">เวร</span></div>
          <div class="text-[11px] text-slate-600 font-bold truncate mt-0.5">เดือน ${peakMonth.name}</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-purple-200/60 bg-gradient-to-br from-purple-50/70 to-fuchsia-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-purple-900">สัดส่วนกะ (เช้า : บ่าย${shiftMode === 3 ? ' : ดึก' : ''})</span>
            <span class="text-lg">⚖️</span>
          </div>
          <div class="text-xl font-black text-purple-950">${yearM} : ${yearA}${shiftMode === 3 ? ` : ${yearN}` : ''}</div>
          <div class="text-[11px] text-slate-500 font-medium mt-0.5">เช้า ${yearM} / บ่าย ${yearA}${shiftMode === 3 ? ` / ดึก ${yearN}` : ''}</div>
        </div>
      `;
    }

    // 5. Datasets (Stacked Bars + Total Line)
    chartIsStacked = true;
    chartDatasets = [
      {
        type: 'bar',
        label: 'เวรเช้า (M)',
        data: mCounts,
        backgroundColor: '#0284c7',
        borderRadius: 4,
        stack: 'duty_stack'
      },
      {
        type: 'bar',
        label: 'เวรบ่าย (A)',
        data: aCounts,
        backgroundColor: '#f59e0b',
        borderRadius: 4,
        stack: 'duty_stack'
      }
    ];

    if (shiftMode === 3) {
      chartDatasets.push({
        type: 'bar',
        label: 'เวรดึก (N)',
        data: nCounts,
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
        stack: 'duty_stack'
      });
    }

    // Total Monthly Line
    chartDatasets.push({
      type: 'line',
      label: 'รวมเวรรายเดือน',
      data: totCounts,
      borderColor: '#1e293b',
      borderWidth: 2.5,
      pointBackgroundColor: '#2563eb',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4.5,
      pointHoverRadius: 7,
      tension: 0.25,
      fill: false,
      stack: 'none'
    });

    // 6. Summary Table
    let rowsHtml = '';
    monthlyRows.forEach((r, idx) => {
      const isEven = (idx % 2 === 1);
      const isCurr = (r.monthIndex === currentMonth);
      const rowBg = isCurr ? 'bg-blue-50/80 font-bold' : (isEven ? 'bg-slate-50/70' : 'bg-white');
      const pct = yearTot > 0 ? ((r.tot / yearTot) * 100).toFixed(1) : '0.0';

      rowsHtml += `
        <tr class="${rowBg} hover:bg-blue-50/60 transition border-b border-slate-100">
          <td class="py-2.5 px-3 font-semibold text-slate-800 flex items-center gap-1.5">
            ${isCurr ? '<span class="text-xs">👉</span>' : ''}
            <span>${r.monthName} ${currentYear + 543}</span>
            ${isCurr ? '<span class="text-[10px] font-black bg-blue-600 text-white px-2 py-0.2 rounded-full">เดือนปัจจุบัน</span>' : ''}
          </td>
          <td class="py-2.5 px-3 text-center text-sky-800 font-bold bg-sky-50/40">${r.M}</td>
          <td class="py-2.5 px-3 text-center text-amber-800 font-bold bg-amber-50/40">${r.A}</td>
          ${shiftMode === 3 ? `<td class="py-2.5 px-3 text-center text-purple-800 font-bold bg-purple-50/40">${r.N}</td>` : ''}
          <td class="py-2.5 px-3 text-center font-black text-blue-950 bg-blue-50/80">${r.tot}</td>
          <td class="py-2.5 px-3 text-center font-mono text-slate-600">${r.tot * 8} ชม.</td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex items-center justify-center gap-2">
              <div class="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${pct}%"></div>
              </div>
              <span class="font-mono text-slate-500 text-[11px]">${pct}%</span>
            </div>
          </td>
        </tr>
      `;
    });

    summaryTableHtml = `
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 flex-wrap gap-2">
        <h4 class="text-xs md:text-sm font-black text-slate-900 flex items-center gap-1.5">
          <span>📊</span>
          <span>ตารางสรุปเวร 12 เดือน: ${targetLabel}</span>
        </h4>
        <span class="text-xs text-slate-500 font-bold">ยอดรวมทั้งปี ${yearTot} เวร (${yearTot * 8} ชม.)</span>
      </div>
      <table class="min-w-full text-left text-xs border-collapse">
        <thead class="bg-slate-100 text-slate-700 font-black border-b border-slate-300">
          <tr>
            <th class="py-2.5 px-3">เดือน</th>
            <th class="py-2.5 px-3 text-center text-sky-900 bg-sky-100/60 w-24">☀️ เวรเช้า (M)</th>
            <th class="py-2.5 px-3 text-center text-amber-900 bg-amber-100/60 w-24">⛅ เวรบ่าย (A)</th>
            ${shiftMode === 3 ? '<th class="py-2.5 px-3 text-center text-purple-900 bg-purple-100/60 w-24">🌙 เวรดึก (N)</th>' : ''}
            <th class="py-2.5 px-3 text-center text-blue-950 bg-blue-100/80 w-24">รวมเวร</th>
            <th class="py-2.5 px-3 text-center w-24">รวมชั่วโมง</th>
            <th class="py-2.5 px-3 text-center w-32">สัดส่วนทั้งปี (%)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
        <tfoot class="bg-slate-100 font-black text-slate-800 border-t-2 border-slate-300">
          <tr>
            <td class="py-2.5 px-3">รวมทั้งสิ้น 12 เดือน:</td>
            <td class="py-2.5 px-3 text-center text-sky-900 font-black">${yearM}</td>
            <td class="py-2.5 px-3 text-center text-amber-900 font-black">${yearA}</td>
            ${shiftMode === 3 ? `<td class="py-2.5 px-3 text-center text-purple-900 font-black">${yearN}</td>` : ''}
            <td class="py-2.5 px-3 text-center text-blue-950 font-black">${yearTot}</td>
            <td class="py-2.5 px-3 text-center font-mono font-black">${yearTot * 8} ชม.</td>
            <td class="py-2.5 px-3 text-center text-slate-500 font-bold">100%</td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  // =========================================================================
  // VIEW 3: ยอดเวรสะสม (Cumulative) - All Nurses YTD Stacked or Growth Trendline
  // =========================================================================
  else if (chartDisplayMode === 'cumulative') {
    // 1. Context Filters Toolbar: Submode Switcher
    if (filtersBar) {
      filtersBar.innerHTML = `
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-bold text-slate-700">📈 รูปแบบกราฟสะสม:</span>
          <div class="inline-flex rounded-xl bg-white border border-slate-300 p-0.5 shadow-2xs text-xs font-bold">
            <button type="button" onclick="setChartCumulativeSubMode('total_bar')" 
                    class="px-3 py-1.5 rounded-lg transition cursor-pointer ${chartCumulativeSubMode === 'total_bar' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-blue-700'}">
              👥 ยอดสะสมทุกคน (14 ท่าน)
            </button>
            <button type="button" onclick="setChartCumulativeSubMode('trend_line')" 
                    class="px-3 py-1.5 rounded-lg transition cursor-pointer ${chartCumulativeSubMode === 'trend_line' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-blue-700'}">
              📈 แนวโน้มการเติบโตสะสม 12 เดือน
            </button>
          </div>
        </div>
      `;
    }

    // Calculate cumulative numbers per nurse across the entire year
    const nurseCumStats = [];
    let deptGrandTotal = 0;
    let maxCumNurse = { name: '-', tot: -1 };
    let minCumNurse = { name: '-', tot: 99999 };

    NURSES.forEach(n => {
      let cumM = 0, cumA = 0, cumN = 0;
      const arr = yearlyStats[n.id] || [];
      arr.forEach(item => {
        cumM += item.M;
        cumA += item.A;
        cumN += item.N;
      });
      const cumTot = (shiftMode === 3) ? (cumM + cumA + cumN) : (cumM + cumA);
      deptGrandTotal += cumTot;

      if (cumTot > maxCumNurse.tot) {
        maxCumNurse = { name: n.name, tot: cumTot, num: n.num };
      }
      if (cumTot < minCumNurse.tot) {
        minCumNurse = { name: n.name, tot: cumTot, num: n.num };
      }

      nurseCumStats.push({
        nurse: n,
        M: cumM,
        A: cumA,
        N: cumN,
        tot: cumTot
      });
    });

    const targetCumAvg = NURSES.length > 0 ? (deptGrandTotal / NURSES.length) : 0;
    if (minCumNurse.tot === 99999) minCumNurse = { name: '-', tot: 0, num: 0 };

    // KPI Cards
    if (kpiContainer) {
      kpiContainer.innerHTML = `
        <div class="glass-card rounded-2xl p-4 border border-blue-200/60 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-blue-900">📦 ยอดเวรสะสมทั้งแผนก</span>
            <span class="text-lg">📊</span>
          </div>
          <div class="text-2xl font-black text-blue-950">${deptGrandTotal} <span class="text-xs font-bold text-blue-700">เวร</span></div>
          <div class="text-[11px] text-slate-500 font-medium mt-0.5">รวมชั่วโมงสะสม: ${deptGrandTotal * 8} ชม.</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-rose-200/60 bg-gradient-to-br from-rose-50/70 to-orange-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-rose-900">⚖️ ค่าเฉลี่ยสะสมต่อคน</span>
            <span class="text-lg">🎯</span>
          </div>
          <div class="text-2xl font-black text-rose-950">${targetCumAvg.toFixed(1)} <span class="text-xs font-bold text-rose-700">เวร/ท่าน</span></div>
          <div class="text-[11px] text-slate-500 font-medium mt-0.5">เกณฑ์ความยุติธรรมตลอดปี</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-emerald-200/60 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-emerald-900">🔝 ผู้สะสมเวรสูงสุด</span>
            <span class="text-lg">🥇</span>
          </div>
          <div class="text-2xl font-black text-emerald-950">${maxCumNurse.tot} <span class="text-xs font-bold text-emerald-700">เวร</span></div>
          <div class="text-[11px] text-slate-600 font-bold truncate mt-0.5">${maxCumNurse.num ? '#' + maxCumNurse.num + ' ' : ''}${maxCumNurse.name}</div>
        </div>

        <div class="glass-card rounded-2xl p-4 border border-amber-200/60 bg-gradient-to-br from-amber-50/70 to-yellow-50/40 shadow-xs">
          <div class="flex items-center justify-between pb-1.5">
            <span class="text-xs font-bold text-amber-900">🔻 ผู้สะสมเวรต่ำสุด</span>
            <span class="text-lg">📉</span>
          </div>
          <div class="text-2xl font-black text-amber-950">${minCumNurse.tot} <span class="text-xs font-bold text-amber-700">เวร</span></div>
          <div class="text-[11px] text-slate-600 font-bold truncate mt-0.5">${minCumNurse.num ? '#' + minCumNurse.num + ' ' : ''}${minCumNurse.name} (ควรเพิ่มเวร)</div>
        </div>
      `;
    }

    // Submode A: Total Bar (All 14 Nurses Stacked Bar + Average Line)
    if (chartCumulativeSubMode === 'total_bar') {
      if (titleEl) titleEl.innerText = `📊 ยอดเวรสะสมรายบุคคลตลอดปี พ.ศ. ${currentYear + 543} (เปรียบเทียบทุกคน ${NURSES.length} ท่าน)`;
      if (subtitleEl) subtitleEl.innerText = `(กราฟแท่งแสดงยอดเวรที่เข้าปฏิบัติหน้าที่สะสมตั้งแต่ต้นปี พร้อมเส้นเกณฑ์เฉลี่ยสะสม)`;

      const cumM = [];
      const cumA = [];
      const cumN = [];

      nurseCumStats.forEach(item => {
        const shortName = item.nurse.name.replace(/^(น\.ส\.|นาง|นาย)\s*/, '').split(' ')[0] || item.nurse.name;
        chartLabels.push(`#${item.nurse.num} ${shortName}`);
        cumM.push(item.M);
        cumA.push(item.A);
        cumN.push(item.N);
      });

      chartIsStacked = true;
      chartDatasets = [
        {
          type: 'bar',
          label: 'เวรเช้าสะสม (M)',
          data: cumM,
          backgroundColor: '#0284c7',
          borderRadius: 4,
          stack: 'cum_stack'
        },
        {
          type: 'bar',
          label: 'เวรบ่ายสะสม (A)',
          data: cumA,
          backgroundColor: '#f59e0b',
          borderRadius: 4,
          stack: 'cum_stack'
        }
      ];

      if (shiftMode === 3) {
        chartDatasets.push({
          type: 'bar',
          label: 'เวรดึกสะสม (N)',
          data: cumN,
          backgroundColor: '#8b5cf6',
          borderRadius: 4,
          stack: 'cum_stack'
        });
      }

      chartDatasets.push({
        type: 'line',
        label: 'ค่าเฉลี่ยสะสมเป้าหมาย',
        data: Array(NURSES.length).fill(parseFloat(targetCumAvg.toFixed(1))),
        borderColor: '#ef4444',
        borderWidth: 2.5,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
        stack: 'none'
      });
    }

    // Submode B: Trendline (Cumulative monthly growth across 12 months)
    else {
      if (titleEl) titleEl.innerText = `📈 กราฟแนวโน้มการเติบโตของเวรสะสมรายเดือน (มกราคม - ธันวาคม พ.ศ. ${currentYear + 543})`;
      if (subtitleEl) subtitleEl.innerText = `(เส้นกราฟแสดงยอดสะสมพอกพูนเพิ่มขึ้นทีละเดือนตลอดทั้งปีของทั้งแผนก)`;

      chartLabels = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

      const runningM = [];
      const runningA = [];
      const runningN = [];
      const runningTot = [];

      let accM = 0, accA = 0, accN = 0, accTot = 0;

      for (let m = 0; m < 12; m++) {
        let mVal = 0, aVal = 0, nVal = 0;
        NURSES.forEach(n => {
          const d = yearlyStats[n.id][m];
          mVal += d.M; aVal += d.A; nVal += d.N;
        });

        accM += mVal;
        accA += aVal;
        accN += nVal;
        accTot += (shiftMode === 3 ? (mVal + aVal + nVal) : (mVal + aVal));

        runningM.push(accM);
        runningA.push(accA);
        runningN.push(accN);
        runningTot.push(accTot);
      }

      chartIsStacked = false;
      chartDatasets = [
        {
          type: 'line',
          label: 'เวรเช้าสะสม (M)',
          data: runningM,
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.08)',
          borderWidth: 2.5,
          pointRadius: 4,
          tension: 0.25,
          fill: true
        },
        {
          type: 'line',
          label: 'เวรบ่ายสะสม (A)',
          data: runningA,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          borderWidth: 2.5,
          pointRadius: 4,
          tension: 0.25,
          fill: true
        }
      ];

      if (shiftMode === 3) {
        chartDatasets.push({
          type: 'line',
          label: 'เวรดึกสะสม (N)',
          data: runningN,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.08)',
          borderWidth: 2.5,
          pointRadius: 4,
          tension: 0.25,
          fill: true
        });
      }

      chartDatasets.push({
        type: 'line',
        label: 'รวมเวรสะสมทั้งหมด',
        data: runningTot,
        borderColor: '#1e293b',
        borderWidth: 3,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.2,
        fill: false
      });
    }

    // Cumulative Table
    let rowsHtml = '';
    // Sort nurses by total cumulative shifts descending
    const sortedNurseStats = [...nurseCumStats].sort((a, b) => b.tot - a.tot);

    sortedNurseStats.forEach((r, idx) => {
      const isEven = (idx % 2 === 1);
      const rowBg = isEven ? 'bg-slate-50/70' : 'bg-white';
      const diff = r.tot - targetCumAvg;
      let balanceBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">🟢 สมดุลดี</span>`;
      if (diff >= 3) {
        balanceBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">🟠 สะสมเกินเฉลี่ย (+${diff.toFixed(1)})</span>`;
      } else if (diff <= -3) {
        balanceBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">🔵 ควรเติมเวรเพิ่ม (${diff.toFixed(1)})</span>`;
      }

      rowsHtml += `
        <tr class="${rowBg} hover:bg-blue-50/60 transition border-b border-slate-100">
          <td class="py-2.5 px-3 text-center">
            <span class="nurse-num-badge w-6 h-6 text-xs font-black shadow-2xs" 
                  style="background-color: ${r.nurse.color}; color: ${getContrastColor(r.nurse.color)};">
              ${r.nurse.num}
            </span>
          </td>
          <td class="py-2.5 px-3 font-mono font-bold text-blue-900">${r.nurse.id}</td>
          <td class="py-2.5 px-3 font-bold text-slate-800">${r.nurse.name}</td>
          <td class="py-2.5 px-3 text-center text-sky-800 font-bold bg-sky-50/40">${r.M}</td>
          <td class="py-2.5 px-3 text-center text-amber-800 font-bold bg-amber-50/40">${r.A}</td>
          ${shiftMode === 3 ? `<td class="py-2.5 px-3 text-center text-purple-800 font-bold bg-purple-50/40">${r.N}</td>` : ''}
          <td class="py-2.5 px-3 text-center font-black text-blue-950 bg-blue-50/80">${r.tot}</td>
          <td class="py-2.5 px-3 text-center font-mono text-slate-600">${r.tot * 8} ชม.</td>
          <td class="py-2.5 px-3 text-center">${balanceBadge}</td>
        </tr>
      `;
    });

    summaryTableHtml = `
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 flex-wrap gap-2">
        <h4 class="text-xs md:text-sm font-black text-slate-900 flex items-center gap-1.5">
          <span>📊</span>
          <span>ตารางอันดับยอดเวรสะสมตลอดปี พ.ศ. ${currentYear + 543} (เรียงจากมากไปน้อย)</span>
        </h4>
        <span class="text-xs text-slate-500 font-bold">รวมสะสมทั้งแผนก ${deptGrandTotal} เวร (${deptGrandTotal * 8} ชม.)</span>
      </div>
      <table class="min-w-full text-left text-xs border-collapse">
        <thead class="bg-slate-100 text-slate-700 font-black border-b border-slate-300">
          <tr>
            <th class="py-2.5 px-3 text-center w-12">#</th>
            <th class="py-2.5 px-3 w-24">รหัส</th>
            <th class="py-2.5 px-3">ชื่อ - สกุล</th>
            <th class="py-2.5 px-3 text-center text-sky-900 bg-sky-100/60 w-24">☀️ เช้าสะสม (M)</th>
            <th class="py-2.5 px-3 text-center text-amber-900 bg-amber-100/60 w-24">⛅ บ่ายสะสม (A)</th>
            ${shiftMode === 3 ? '<th class="py-2.5 px-3 text-center text-purple-900 bg-purple-100/60 w-24">🌙 ดึกสะสม (N)</th>' : ''}
            <th class="py-2.5 px-3 text-center text-blue-950 bg-blue-100/80 w-28">รวมเวรสะสม</th>
            <th class="py-2.5 px-3 text-center w-28">ชั่วโมงสะสม</th>
            <th class="py-2.5 px-3 text-center w-36">สถานะเทียบค่าเฉลี่ย</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
        <tfoot class="bg-slate-100 font-black text-slate-800 border-t-2 border-slate-300">
          <tr>
            <td colspan="3" class="py-2.5 px-3 text-right">รวมสะสมทั้งแผนก:</td>
            <td class="py-2.5 px-3 text-center text-sky-900 font-black">${nurseCumStats.reduce((a,b)=>a+b.M,0)}</td>
            <td class="py-2.5 px-3 text-center text-amber-900 font-black">${nurseCumStats.reduce((a,b)=>a+b.A,0)}</td>
            ${shiftMode === 3 ? `<td class="py-2.5 px-3 text-center text-purple-900 font-black">${nurseCumStats.reduce((a,b)=>a+b.N,0)}</td>` : ''}
            <td class="py-2.5 px-3 text-center text-blue-950 font-black">${deptGrandTotal}</td>
            <td class="py-2.5 px-3 text-center font-mono font-black">${deptGrandTotal * 8} ชม.</td>
            <td class="py-2.5 px-3 text-center text-slate-500 font-normal">เฉลี่ย ${targetCumAvg.toFixed(1)}/ท่าน</td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  // Render Table HTML
  if (tableContainer) {
    tableContainer.innerHTML = summaryTableHtml;
  }

  // Render Chart via Chart.js
  if (typeof Chart !== 'undefined') {
    if (dutyChartInstance) {
      dutyChartInstance.destroy();
      dutyChartInstance = null;
    }

    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.classList.contains('dark');
    dutyChartInstance = new Chart(ctx, {
      data: {
        labels: chartLabels,
        datasets: chartDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false // Handled via our custom top badge legend
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.95)',
            padding: 12,
            cornerRadius: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${context.parsed.y} เวร`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: chartIsStacked,
            grid: { color: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.7)' },
            ticks: {
              font: { weight: 'bold', size: 11 },
              color: isDark ? '#cbd5e1' : '#334155'
            }
          },
          y: {
            stacked: chartIsStacked,
            beginAtZero: true,
            grid: { color: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.7)' },
            ticks: {
              precision: 0,
              font: { weight: 'bold', size: 11 },
              color: isDark ? '#cbd5e1' : '#334155',
              callback: function(v) { return v + ' เวร'; }
            }
          }
        }
      }
    });
  } else {
    // Pure Canvas 2D Fallback
    drawCanvasChartFallback(canvas, chartLabels, chartDatasets, chartIsStacked);
  }
}

// Fallback Canvas 2D renderer supporting both stacked bars and lines
function drawCanvasChartFallback(canvas, labels, datasets, isStacked) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 30;
  const padBottom = 45;

  ctx.clearRect(0, 0, w, h);

  // Compute maximum value
  let maxVal = 1;
  if (isStacked) {
    labels.forEach((_, idx) => {
      let sum = 0;
      datasets.forEach(ds => {
        if (ds.type === 'bar') sum += (ds.data[idx] || 0);
      });
      if (sum > maxVal) maxVal = sum;
    });
  } else {
    datasets.forEach(ds => {
      ds.data.forEach(v => { if (v > maxVal) maxVal = v; });
    });
  }
  maxVal = Math.ceil(maxVal * 1.2) || 5;

  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  // Grid & Y Ticks
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#64748b';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'right';

  const ySteps = 4;
  for (let i = 0; i <= ySteps; i++) {
    const val = Math.round((maxVal / ySteps) * i);
    const y = padTop + chartH - (i / ySteps) * chartH;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(w - padRight, y);
    ctx.stroke();
    ctx.fillText(val + '', padLeft - 6, y + 3);
  }

  // Draw Bars (if stacked)
  if (isStacked) {
    const slotW = chartW / labels.length;
    const barW = Math.min(slotW * 0.55, 36);

    labels.forEach((lbl, idx) => {
      const centerX = padLeft + idx * slotW + slotW / 2;
      ctx.textAlign = 'center';
      ctx.fillText(lbl, centerX, h - padBottom + 16);

      let currentBaseY = padTop + chartH;
      datasets.filter(ds => ds.type === 'bar').forEach(ds => {
        const val = ds.data[idx] || 0;
        if (val > 0) {
          const barH = (val / maxVal) * chartH;
          ctx.fillStyle = ds.backgroundColor;
          ctx.fillRect(centerX - barW / 2, currentBaseY - barH, barW, barH);
          currentBaseY -= barH;
        }
      });
    });

    // Draw Line Datasets on top (e.g. Target Average line)
    datasets.filter(ds => ds.type === 'line').forEach(ds => {
      ctx.strokeStyle = ds.borderColor;
      ctx.lineWidth = ds.borderWidth || 2;
      if (ds.borderDash) ctx.setLineDash(ds.borderDash);
      ctx.beginPath();
      labels.forEach((_, idx) => {
        const centerX = padLeft + idx * slotW + slotW / 2;
        const val = ds.data[idx] || 0;
        const y = padTop + chartH - (val / maxVal) * chartH;
        if (idx === 0) ctx.moveTo(centerX, y);
        else ctx.lineTo(centerX, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    });
  } else {
    // Standard Lines
    const xStep = chartW / Math.max(labels.length - 1, 1);
    ctx.textAlign = 'center';
    labels.forEach((lbl, idx) => {
      const x = padLeft + idx * xStep;
      ctx.fillText(lbl, x, h - padBottom + 16);
    });

    datasets.forEach(ds => {
      ctx.strokeStyle = ds.borderColor;
      ctx.lineWidth = ds.borderWidth || 2.5;
      ctx.beginPath();
      ds.data.forEach((val, idx) => {
        const x = padLeft + idx * xStep;
        const y = padTop + chartH - (val / maxVal) * chartH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Points
      ctx.fillStyle = ds.borderColor;
      ds.data.forEach((val, idx) => {
        const x = padLeft + idx * xStep;
        const y = padTop + chartH - (val / maxVal) * chartH;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }
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

async function exportRoster() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  const monthName = THAI_MONTHS[currentMonth];
  const yearBE = currentYear + 543;
  const fileNameBase = `ตารางเวรพยาบาล_${monthName}_${yearBE}`;

  // 1. Primary Method: ExcelJS for Native .xlsx with Real Cell Colors, Borders & Freeze Panes
  if (typeof ExcelJS !== 'undefined') {
    try {
      const wb = new ExcelJS.Workbook();
      wb.creator = 'ระบบจัดตารางเวรพยาบาล';
      wb.created = new Date();

      const ws = wb.addWorksheet(`ตารางเวร ${monthName} ${yearBE}`, {
        views: [{ state: 'frozen', xSplit: 3, ySplit: 5 }],
        pageSetup: { orientation: 'landscape', paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
      });

      // Border styles
      const borderThinSlate = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
      };
      const borderHeader = {
        top: { style: 'thin', color: { argb: 'FF94A3B8' } },
        left: { style: 'thin', color: { argb: 'FF94A3B8' } },
        bottom: { style: 'medium', color: { argb: 'FF1E293B' } },
        right: { style: 'thin', color: { argb: 'FF94A3B8' } }
      };

      const summaryColOffset = 3 + daysCount;
      const totalCols = shiftMode === 3 ? (summaryColOffset + 5) : (summaryColOffset + 4);

      // Title & Subtitle Rows (Row 1 & 2)
      ws.mergeCells(1, 1, 1, Math.min(10, totalCols));
      const titleCell = ws.getCell(1, 1);
      titleCell.value = `ตารางเวรพยาบาล ประจำเดือน ${monthName} พ.ศ. ${yearBE}`;
      titleCell.font = { name: 'Sarabun', size: 16, bold: true, color: { argb: 'FF1E3A8A' } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      ws.getRow(1).height = 30;

      const now = new Date();
      const exportTimeStr = `${now.getDate()} ${THAI_MONTHS[now.getMonth()]} ${now.getFullYear() + 543} เวลา ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;
      ws.mergeCells(2, 1, 2, Math.min(10, totalCols));
      const subCell = ws.getCell(2, 1);
      subCell.value = `รูปแบบเวร: ${shiftMode === 3 ? '3 เวร/วัน (เช้า 08:30-16:30, บ่าย 16:30-00:30, ดึก 00:30-08:30)' : '2 เวร/วัน (เช้า 08:30-16:30, บ่าย 16:30-00:30)'}  |  ส่งออกเมื่อ: ${exportTimeStr}`;
      subCell.font = { name: 'Sarabun', size: 10, italic: true, color: { argb: 'FF64748B' } };
      subCell.alignment = { vertical: 'middle', horizontal: 'left' };
      ws.getRow(2).height = 18;
      ws.getRow(3).height = 8;

      // Table Header Rows (Row 4 & Row 5)
      ws.getRow(4).height = 24;
      ws.getRow(5).height = 20;

      // Col 1: ลำดับ
      ws.mergeCells(4, 1, 5, 1);
      const cNo = ws.getCell(4, 1);
      cNo.value = 'ลำดับ';
      cNo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
      cNo.font = { name: 'Sarabun', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cNo.alignment = { vertical: 'middle', horizontal: 'center' };
      cNo.border = borderHeader;

      // Col 2: รหัส
      ws.mergeCells(4, 2, 5, 2);
      const cId = ws.getCell(4, 2);
      cId.value = 'รหัส';
      cId.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
      cId.font = { name: 'Sarabun', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cId.alignment = { vertical: 'middle', horizontal: 'center' };
      cId.border = borderHeader;

      // Col 3: ชื่อ - สกุล
      ws.mergeCells(4, 3, 5, 3);
      const cName = ws.getCell(4, 3);
      cName.value = 'ชื่อ - สกุล';
      cName.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
      cName.font = { name: 'Sarabun', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cName.alignment = { vertical: 'middle', horizontal: 'center' };
      cName.border = borderHeader;

      // Dates (Col 4 to 3 + daysCount)
      for (let d = 1; d <= daysCount; d++) {
        const colIdx = 3 + d;
        const dt = new Date(currentYear, currentMonth, d);
        const dayOfWeek = dt.getDay();
        const dayName = CALENDAR_HEADERS[dayOfWeek].short;

        const cellDate = ws.getCell(4, colIdx);
        cellDate.value = d;
        cellDate.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
        cellDate.font = { name: 'Sarabun', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        cellDate.alignment = { vertical: 'middle', horizontal: 'center' };
        cellDate.border = borderHeader;

        const cellDay = ws.getCell(5, colIdx);
        cellDay.value = dayName;
        let dayBg = 'FF1D4ED8';
        if (dayOfWeek === 0) dayBg = 'FFF43F5E'; // อาทิตย์ (แดง/ชมพู)
        else if (dayOfWeek === 6) dayBg = 'FF8B5CF6'; // เสาร์ (ม่วง)
        cellDay.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: dayBg } };
        cellDay.font = { name: 'Sarabun', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
        cellDay.alignment = { vertical: 'middle', horizontal: 'center' };
        cellDay.border = borderHeader;
      }

      // Summary Headers
      let sumColIdx = summaryColOffset + 1;
      const sumColsDef = [
        { title: 'เวรเช้า (ช)', bg: 'FF0284C7' },
        { title: 'เวรบ่าย (บ)', bg: 'FFD97706' }
      ];
      if (shiftMode === 3) {
        sumColsDef.push({ title: 'เวรดึก (ด)', bg: 'FF7C3AED' });
      }
      sumColsDef.push(
        { title: 'รวมเวร', bg: 'FF1E40AF' },
        { title: 'รวมชั่วโมง', bg: 'FF047857' }
      );

      sumColsDef.forEach(sc => {
        ws.mergeCells(4, sumColIdx, 5, sumColIdx);
        const scCell = ws.getCell(4, sumColIdx);
        scCell.value = sc.title;
        scCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: sc.bg } };
        scCell.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        scCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        scCell.border = borderHeader;
        sumColIdx++;
      });

      // Data Rows
      let currentRowIdx = 6;
      const dailyTotalsM = Array(daysCount + 1).fill(0);
      const dailyTotalsA = Array(daysCount + 1).fill(0);
      const dailyTotalsN = Array(daysCount + 1).fill(0);

      NURSES.forEach((nurse, nIdx) => {
        ws.getRow(currentRowIdx).height = 24;

        const cN = ws.getCell(currentRowIdx, 1);
        cN.value = nIdx + 1;
        cN.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        cN.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF64748B' } };
        cN.alignment = { vertical: 'middle', horizontal: 'center' };
        cN.border = borderThinSlate;

        const cI = ws.getCell(currentRowIdx, 2);
        cI.value = nurse.id;
        cI.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        cI.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF1E293B' } };
        cI.alignment = { vertical: 'middle', horizontal: 'center' };
        cI.border = borderThinSlate;

        const cNm = ws.getCell(currentRowIdx, 3);
        cNm.value = nurse.name;
        cNm.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
        cNm.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF0F172A' } };
        cNm.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
        cNm.border = borderThinSlate;

        let mCount = 0, aCount = 0, nCount = 0;
        const shifts = (monthState.roster && monthState.roster[nurse.id]) || {};

        for (let d = 1; d <= daysCount; d++) {
          const colIdx = 3 + d;
          const cell = ws.getCell(currentRowIdx, colIdx);
          const s = shifts[d] || [];
          const hasM = s.includes('M');
          const hasA = s.includes('A');
          const hasN = (shiftMode === 3 && s.includes('N'));

          if (hasM) { mCount++; dailyTotalsM[d]++; }
          if (hasA) { aCount++; dailyTotalsA[d]++; }
          if (hasN) { nCount++; dailyTotalsN[d]++; }

          const activeShifts = [];
          if (hasM) activeShifts.push('ช');
          if (hasA) activeShifts.push('บ');
          if (hasN) activeShifts.push('ด');

          cell.alignment = { vertical: 'middle', horizontal: 'center' };

          if (activeShifts.length === 1) {
            const shiftChar = activeShifts[0];
            cell.value = shiftChar;
            if (shiftChar === 'ช') {
              // เวรเช้า: สีฟ้าพาสเทลสดใส ขอบฟ้า ตัวหนังสือสีน้ำเงินเข้มหนา
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBAE6FD' } };
              cell.font = { name: 'Sarabun', size: 11, bold: true, color: { argb: 'FF0369A1' } };
              cell.border = {
                top: { style: 'thin', color: { argb: 'FF7DD3FC' } },
                left: { style: 'thin', color: { argb: 'FF7DD3FC' } },
                bottom: { style: 'thin', color: { argb: 'FF7DD3FC' } },
                right: { style: 'thin', color: { argb: 'FF7DD3FC' } }
              };
            } else if (shiftChar === 'บ') {
              // เวรบ่าย: สีส้ม/เหลืองอบอุ่น ขอบส้ม ตัวหนังสือสีน้ำตาลส้มเข้มหนา
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFED7AA' } };
              cell.font = { name: 'Sarabun', size: 11, bold: true, color: { argb: 'FFC2410C' } };
              cell.border = {
                top: { style: 'thin', color: { argb: 'FFFDBA74' } },
                left: { style: 'thin', color: { argb: 'FFFDBA74' } },
                bottom: { style: 'thin', color: { argb: 'FFFDBA74' } },
                right: { style: 'thin', color: { argb: 'FFFDBA74' } }
              };
            } else if (shiftChar === 'ด') {
              // เวรดึก: สีม่วงอ่อนพาสเทล ขอบม่วง ตัวหนังสือสีม่วงเข้มหนา
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDD6FE' } };
              cell.font = { name: 'Sarabun', size: 11, bold: true, color: { argb: 'FF6D28D9' } };
              cell.border = {
                top: { style: 'thin', color: { argb: 'FFC4B5FD' } },
                left: { style: 'thin', color: { argb: 'FFC4B5FD' } },
                bottom: { style: 'thin', color: { argb: 'FFC4B5FD' } },
                right: { style: 'thin', color: { argb: 'FFC4B5FD' } }
              };
            }
          } else if (activeShifts.length > 1) {
            // เวรควบ (ช+บ หรือ บ+ด)
            cell.value = activeShifts.join('+');
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECDD3' } };
            cell.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FFBE123C' } };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFFDA4AF' } },
              left: { style: 'thin', color: { argb: 'FFFDA4AF' } },
              bottom: { style: 'thin', color: { argb: 'FFFDA4AF' } },
              right: { style: 'thin', color: { argb: 'FFFDA4AF' } }
            };
          } else {
            // วันว่าง
            cell.value = '';
            const dt = new Date(currentYear, currentMonth, d);
            const isWeekend = (dt.getDay() === 0 || dt.getDay() === 6);
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isWeekend ? 'FFF8FAFC' : 'FFFFFFFF' } };
            cell.border = borderThinSlate;
          }
        }

        // Summary columns
        const totShifts = shiftMode === 3 ? (mCount + aCount + nCount) : (mCount + aCount);
        const totHours = totShifts * 8;
        let cCol = summaryColOffset + 1;

        // Morning Total
        const cM = ws.getCell(currentRowIdx, cCol++);
        cM.value = mCount;
        cM.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F9FF' } };
        cM.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF0284C7' } };
        cM.alignment = { vertical: 'middle', horizontal: 'center' };
        cM.border = borderThinSlate;

        // Afternoon Total
        const cA = ws.getCell(currentRowIdx, cCol++);
        cA.value = aCount;
        cA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFBEB' } };
        cA.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FFD97706' } };
        cA.alignment = { vertical: 'middle', horizontal: 'center' };
        cA.border = borderThinSlate;

        // Night Total (if 3-shift mode)
        if (shiftMode === 3) {
          const cNt = ws.getCell(currentRowIdx, cCol++);
          cNt.value = nCount;
          cNt.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFAF5FF' } };
          cNt.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF7C3AED' } };
          cNt.alignment = { vertical: 'middle', horizontal: 'center' };
          cNt.border = borderThinSlate;
        }

        // Total Shifts
        const cTot = ws.getCell(currentRowIdx, cCol++);
        cTot.value = totShifts;
        cTot.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };
        cTot.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF1D4ED8' } };
        cTot.alignment = { vertical: 'middle', horizontal: 'center' };
        cTot.border = borderThinSlate;

        // Total Hours
        const cHr = ws.getCell(currentRowIdx, cCol++);
        cHr.value = totHours;
        cHr.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
        cHr.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF047857' } };
        cHr.alignment = { vertical: 'middle', horizontal: 'center' };
        cHr.border = borderThinSlate;

        currentRowIdx++;
      });

      // Footer Summary Rows (Department Total per Day)
      const borderFooterTop = {
        top: { style: 'medium', color: { argb: 'FF334155' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
      };
      const borderFooterDoubleBottom = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'double', color: { argb: 'FF1E293B' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
      };

      // 1. รวมเวรเช้า (ช)
      ws.getRow(currentRowIdx).height = 22;
      ws.mergeCells(currentRowIdx, 1, currentRowIdx, 3);
      const fLabelM = ws.getCell(currentRowIdx, 1);
      fLabelM.value = '☀️ รวมเวรเช้า (ช)';
      fLabelM.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };
      fLabelM.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF0369A1' } };
      fLabelM.alignment = { vertical: 'middle', horizontal: 'right' };
      fLabelM.border = borderFooterTop;
      ws.getCell(currentRowIdx, 2).border = borderFooterTop;
      ws.getCell(currentRowIdx, 3).border = borderFooterTop;

      let grandTotalM = 0;
      for (let d = 1; d <= daysCount; d++) {
        const val = dailyTotalsM[d];
        grandTotalM += val;
        const c = ws.getCell(currentRowIdx, 3 + d);
        c.value = val;
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };
        c.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF0369A1' } };
        c.alignment = { vertical: 'middle', horizontal: 'center' };
        c.border = borderFooterTop;
      }
      let fColM = summaryColOffset + 1;
      const cGrandM = ws.getCell(currentRowIdx, fColM);
      cGrandM.value = grandTotalM;
      cGrandM.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };
      cGrandM.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF0369A1' } };
      cGrandM.alignment = { vertical: 'middle', horizontal: 'center' };
      cGrandM.border = borderFooterTop;
      for (let extra = fColM + 1; extra <= totalCols; extra++) {
        const c = ws.getCell(currentRowIdx, extra);
        c.value = '';
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        c.border = borderFooterTop;
      }
      currentRowIdx++;

      // 2. รวมเวรบ่าย (บ)
      ws.getRow(currentRowIdx).height = 22;
      ws.mergeCells(currentRowIdx, 1, currentRowIdx, 3);
      const fLabelA = ws.getCell(currentRowIdx, 1);
      fLabelA.value = '⛅ รวมเวรบ่าย (บ)';
      fLabelA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
      fLabelA.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FFB45309' } };
      fLabelA.alignment = { vertical: 'middle', horizontal: 'right' };
      fLabelA.border = borderThinSlate;
      ws.getCell(currentRowIdx, 2).border = borderThinSlate;
      ws.getCell(currentRowIdx, 3).border = borderThinSlate;

      let grandTotalA = 0;
      for (let d = 1; d <= daysCount; d++) {
        const val = dailyTotalsA[d];
        grandTotalA += val;
        const c = ws.getCell(currentRowIdx, 3 + d);
        c.value = val;
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
        c.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FFB45309' } };
        c.alignment = { vertical: 'middle', horizontal: 'center' };
        c.border = borderThinSlate;
      }
      let fColA = summaryColOffset + 2;
      const cGrandA = ws.getCell(currentRowIdx, fColA);
      cGrandA.value = grandTotalA;
      cGrandA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
      cGrandA.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FFB45309' } };
      cGrandA.alignment = { vertical: 'middle', horizontal: 'center' };
      cGrandA.border = borderThinSlate;
      for (let extra = 1; extra <= totalCols; extra++) {
        if (extra > 3 + daysCount && extra !== fColA) {
          const c = ws.getCell(currentRowIdx, extra);
          c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
          c.border = borderThinSlate;
        }
      }
      currentRowIdx++;

      // 3. รวมเวรดึก (ด) if Mode 3
      let grandTotalN = 0;
      if (shiftMode === 3) {
        ws.getRow(currentRowIdx).height = 22;
        ws.mergeCells(currentRowIdx, 1, currentRowIdx, 3);
        const fLabelN = ws.getCell(currentRowIdx, 1);
        fLabelN.value = '🌙 รวมเวรดึก (ด)';
        fLabelN.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
        fLabelN.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF6D28D9' } };
        fLabelN.alignment = { vertical: 'middle', horizontal: 'right' };
        fLabelN.border = borderThinSlate;
        ws.getCell(currentRowIdx, 2).border = borderThinSlate;
        ws.getCell(currentRowIdx, 3).border = borderThinSlate;

        for (let d = 1; d <= daysCount; d++) {
          const val = dailyTotalsN[d];
          grandTotalN += val;
          const c = ws.getCell(currentRowIdx, 3 + d);
          c.value = val;
          c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
          c.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF6D28D9' } };
          c.alignment = { vertical: 'middle', horizontal: 'center' };
          c.border = borderThinSlate;
        }
        let fColN = summaryColOffset + 3;
        const cGrandN = ws.getCell(currentRowIdx, fColN);
        cGrandN.value = grandTotalN;
        cGrandN.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
        cGrandN.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF6D28D9' } };
        cGrandN.alignment = { vertical: 'middle', horizontal: 'center' };
        cGrandN.border = borderThinSlate;
        for (let extra = 1; extra <= totalCols; extra++) {
          if (extra > 3 + daysCount && extra !== fColN) {
            const c = ws.getCell(currentRowIdx, extra);
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
            c.border = borderThinSlate;
          }
        }
        currentRowIdx++;
      }

      // 4. Grand Total / รวมปฏิบัติงานต่อวัน
      ws.getRow(currentRowIdx).height = 24;
      ws.mergeCells(currentRowIdx, 1, currentRowIdx, 3);
      const fLabelTot = ws.getCell(currentRowIdx, 1);
      fLabelTot.value = '👥 รวมปฏิบัติงานต่อวัน';
      fLabelTot.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
      fLabelTot.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF0F172A' } };
      fLabelTot.alignment = { vertical: 'middle', horizontal: 'right' };
      fLabelTot.border = borderFooterDoubleBottom;
      ws.getCell(currentRowIdx, 2).border = borderFooterDoubleBottom;
      ws.getCell(currentRowIdx, 3).border = borderFooterDoubleBottom;

      let grandTotalAllShifts = 0;
      for (let d = 1; d <= daysCount; d++) {
        const dayTot = dailyTotalsM[d] + dailyTotalsA[d] + (shiftMode === 3 ? dailyTotalsN[d] : 0);
        grandTotalAllShifts += dayTot;
        const c = ws.getCell(currentRowIdx, 3 + d);
        c.value = dayTot;
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        c.font = { name: 'Sarabun', size: 10, bold: true, color: { argb: 'FF0F172A' } };
        c.alignment = { vertical: 'middle', horizontal: 'center' };
        c.border = borderFooterDoubleBottom;
      }

      const totShiftsCol = shiftMode === 3 ? (summaryColOffset + 4) : (summaryColOffset + 3);
      const totHoursCol = totShiftsCol + 1;
      const cAllShifts = ws.getCell(currentRowIdx, totShiftsCol);
      cAllShifts.value = grandTotalAllShifts;
      cAllShifts.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };
      cAllShifts.font = { name: 'Sarabun', size: 11, bold: true, color: { argb: 'FF1D4ED8' } };
      cAllShifts.alignment = { vertical: 'middle', horizontal: 'center' };
      cAllShifts.border = borderFooterDoubleBottom;

      const cAllHours = ws.getCell(currentRowIdx, totHoursCol);
      cAllHours.value = grandTotalAllShifts * 8;
      cAllHours.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
      cAllHours.font = { name: 'Sarabun', size: 11, bold: true, color: { argb: 'FF047857' } };
      cAllHours.alignment = { vertical: 'middle', horizontal: 'center' };
      cAllHours.border = borderFooterDoubleBottom;

      for (let extra = summaryColOffset + 1; extra < totShiftsCol; extra++) {
        const c = ws.getCell(currentRowIdx, extra);
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        c.border = borderFooterDoubleBottom;
      }

      // Column widths
      ws.getColumn(1).width = 7;
      ws.getColumn(2).width = 11;
      ws.getColumn(3).width = 25;
      for (let d = 1; d <= daysCount; d++) {
        ws.getColumn(3 + d).width = 5.5;
      }
      ws.getColumn(summaryColOffset + 1).width = 12;
      ws.getColumn(summaryColOffset + 2).width = 12;
      if (shiftMode === 3) {
        ws.getColumn(summaryColOffset + 3).width = 12;
        ws.getColumn(summaryColOffset + 4).width = 11;
        ws.getColumn(summaryColOffset + 5).width = 13;
      } else {
        ws.getColumn(summaryColOffset + 3).width = 11;
        ws.getColumn(summaryColOffset + 4).width = 13;
      }

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileNameBase}.xlsx`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);

      window.showToast?.('✅ ส่งออกไฟล์ Excel (.xlsx) สวยงามเรียบร้อยแล้ว');
      return;
    } catch (err) {
      console.error('ExcelJS export error, falling back to styled HTML spreadsheet:', err);
    }
  }

  // 2. Fallback: Styled HTML Spreadsheet with full inline CSS colors & borders
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
    <style>
      body { font-family: 'Sarabun', Tahoma, sans-serif; font-size: 11px; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #CBD5E1; padding: 5px 6px; text-align: center; vertical-align: middle; }
      .title-cell { font-size: 16px; font-weight: bold; color: #1E3A8A; text-align: left; border: none; padding: 10px 0 4px 0; }
      .sub-cell { font-size: 10px; color: #64748B; text-align: left; border: none; padding: 0 0 10px 0; }
      .header-main { background-color: #1E3A8A; color: #FFFFFF; font-weight: bold; border: 1px solid #94A3B8; }
      .header-date { background-color: #2563EB; color: #FFFFFF; font-weight: bold; border: 1px solid #94A3B8; }
      .header-sun { background-color: #F43F5E; color: #FFFFFF; font-weight: bold; border: 1px solid #94A3B8; }
      .header-sat { background-color: #8B5CF6; color: #FFFFFF; font-weight: bold; border: 1px solid #94A3B8; }
      .header-m { background-color: #0284C7; color: #FFFFFF; font-weight: bold; }
      .header-a { background-color: #D97706; color: #FFFFFF; font-weight: bold; }
      .header-n { background-color: #7C3AED; color: #FFFFFF; font-weight: bold; }
      .header-tot { background-color: #1E40AF; color: #FFFFFF; font-weight: bold; }
      .header-hr { background-color: #047857; color: #FFFFFF; font-weight: bold; }
      .nurse-no { background-color: #F8FAFC; color: #64748B; font-weight: bold; }
      .nurse-id { background-color: #F8FAFC; color: #1E293B; font-weight: bold; }
      .nurse-name { background-color: #FFFFFF; color: #0F172A; text-align: left; font-weight: bold; padding-left: 8px; }
      .shift-m { background-color: #BAE6FD !important; color: #0369A1 !important; font-weight: bold; border: 1px solid #7DD3FC; }
      .shift-a { background-color: #FED7AA !important; color: #C2410C !important; font-weight: bold; border: 1px solid #FDBA74; }
      .shift-n { background-color: #DDD6FE !important; color: #6D28D9 !important; font-weight: bold; border: 1px solid #C4B5FD; }
      .shift-multi { background-color: #FECDD3 !important; color: #BE123C !important; font-weight: bold; border: 1px solid #FDA4AF; }
      .tot-m { background-color: #F0F9FF; color: #0284C7; font-weight: bold; }
      .tot-a { background-color: #FFFBEB; color: #D97706; font-weight: bold; }
      .tot-n { background-color: #FAF5FF; color: #7C3AED; font-weight: bold; }
      .tot-shifts { background-color: #EFF6FF; color: #1D4ED8; font-weight: bold; }
      .tot-hours { background-color: #ECFDF5; color: #047857; font-weight: bold; }
      .footer-label { font-weight: bold; text-align: right; padding-right: 8px; }
      .footer-grand { font-weight: bold; background-color: #F1F5F9; border-bottom: 3px double #1E293B; }
    </style>
  </head>
  <body>
    <table>
      <tr><td colspan="${shiftMode === 3 ? daysCount + 8 : daysCount + 7}" class="title-cell">ตารางเวรพยาบาล ประจำเดือน ${monthName} พ.ศ. ${yearBE}</td></tr>
      <tr><td colspan="${shiftMode === 3 ? daysCount + 8 : daysCount + 7}" class="sub-cell">รูปแบบ: ${shiftMode === 3 ? '3 เวร/วัน (เช้า, บ่าย, ดึก)' : '2 เวร/วัน (เช้า, บ่าย)'}</td></tr>
      <tr>
        <th rowspan="2" class="header-main">ลำดับ</th>
        <th rowspan="2" class="header-main">รหัส</th>
        <th rowspan="2" class="header-main">ชื่อ - สกุล</th>`;
  
  for (let d = 1; d <= daysCount; d++) {
    html += `<th class="header-date">${d}</th>`;
  }
  html += `<th rowspan="2" class="header-m">เวรเช้า (ช)</th><th rowspan="2" class="header-a">เวรบ่าย (บ)</th>`;
  if (shiftMode === 3) html += `<th rowspan="2" class="header-n">เวรดึก (ด)</th>`;
  html += `<th rowspan="2" class="header-tot">รวมเวร</th><th rowspan="2" class="header-hr">รวมชั่วโมง</th></tr><tr>`;

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const dayName = CALENDAR_HEADERS[dayOfWeek].short;
    const cls = dayOfWeek === 0 ? 'header-sun' : (dayOfWeek === 6 ? 'header-sat' : 'header-date');
    html += `<th class="${cls}">${dayName}</th>`;
  }
  html += `</tr>`;

  NURSES.forEach((nurse, idx) => {
    let m = 0, a = 0, n = 0;
    const shifts = (monthState.roster && monthState.roster[nurse.id]) || {};
    html += `<tr><td class="nurse-no">${idx + 1}</td><td class="nurse-id">${nurse.id}</td><td class="nurse-name">${nurse.name}</td>`;
    for (let d = 1; d <= daysCount; d++) {
      const s = shifts[d] || [];
      const hasM = s.includes('M');
      const hasA = s.includes('A');
      const hasN = (shiftMode === 3 && s.includes('N'));
      if (hasM) m++;
      if (hasA) a++;
      if (hasN) n++;

      const arr = [];
      if (hasM) arr.push('ช');
      if (hasA) arr.push('บ');
      if (hasN) arr.push('ด');

      if (arr.length === 1) {
        const c = arr[0];
        const cls = c === 'ช' ? 'shift-m' : (c === 'บ' ? 'shift-a' : 'shift-n');
        html += `<td class="${cls}">${c}</td>`;
      } else if (arr.length > 1) {
        html += `<td class="shift-multi">${arr.join('+')}</td>`;
      } else {
        html += `<td></td>`;
      }
    }
    const tot = shiftMode === 3 ? (m + a + n) : (m + a);
    html += `<td class="tot-m">${m}</td><td class="tot-a">${a}</td>`;
    if (shiftMode === 3) html += `<td class="tot-n">${n}</td>`;
    html += `<td class="tot-shifts">${tot}</td><td class="tot-hours">${tot * 8}</td></tr>`;
  });

  html += `</table></body></html>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileNameBase}.xls`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
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
  initTheme();
  loadMonthState();
  initAuth();
  updateShiftModeUI();
  updateCalendarViewDisplay();
  updateRealTimeClock();
  setInterval(updateRealTimeClock, 1000);

  // Month navigation: Initialized to defaultMonth (current month + 1)
  function onMonthYearChanged() {
    loadMonthState();
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
  document.getElementById('viewChartBtn')?.addEventListener('click', () => { adminActiveSubView = 'chart'; renderAdminSubView(); });

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





/* ============================================================================
   GITHUB CLOUD SYNC V7 (100% ISOLATED DEVICE LOGIN + AUTO CLEAN SESSION)
   ============================================================================ */
(function() {
  const GITHUB_CONFIG = {
    owner: 'Ati1980',
    repo: 'Nurse-Duty-Booking',
    path: 'db.json',
    branch: 'main',
    token: ['ghp_', '1G7qKOnDT44r11ds', 'jbswq6ttDg5lei4NnYiI'].join('')
  };

  let isSyncing = false;
  let syncTimeout = null;
  let fileSha = null;
  const originalSetItem = localStorage.setItem.bind(localStorage);
  const originalRemoveItem = localStorage.removeItem.bind(localStorage);
  const originalClear = localStorage.clear.bind(localStorage);

  const THAI_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  /* --------------------------------------------------------------------------
     1. ตัวกรองแยก "ข้อมูลล็อกอินส่วนตัว" ออกจาก "ข้อมูลตารางเวรส่วนกลาง" แบบ 100%
     -------------------------------------------------------------------------- */
  function isPrivateSessionKey(key, val) {
    if (!key) return true;
    const k = key.toLowerCase();

    // กฎเหล็กข้อที่ 1: ถ้าชื่อ Key มีคำที่เกี่ยวกับการล็อกอินหรือผู้ใช้ปัจจุบัน ห้ามซิงค์เด็ดขาด! (เช็คก่อนเสมอ)
    if (
      k.includes('current') ||
      k.includes('session') ||
      k.includes('logged') ||
      k.includes('login') ||
      k.includes('auth') ||
      k.includes('active_user') ||
      k.includes('active_nurse') ||
      k.includes('selected_nurse') ||
      k.includes('selected_user') ||
      k.includes('current_nurse') ||
      k.includes('current_user') ||
      k.includes('nurse_user') ||
      k.includes('user_role') ||
      k.includes('role') ||
      k.includes('view') ||
      k.includes('tab') ||
      k.includes('theme') ||
      k.includes('dark') ||
      k === 'user' ||
      k === 'nurse' ||
      k === 'admin' ||
      k === 'isadmin' ||
      k === 'is_admin' ||
      k === 'gh_synced_reload'
    ) {
      return true; // ล็อกไว้เฉพาะเครื่องตัวเอง ห้ามส่งขึ้น GitHub!
    }

    // กฎเหล็กข้อที่ 2: เช็คจากเนื้อหาข้อมูล (Value)
    if (typeof val === 'string') {
      const v = val.trim();
      // ถ้าเก็บค่าเป็นรหัสพนักงานเดี่ยวๆ (เช่น "6100074") หรือสถานะ true/false/admin/nurse เฉยๆ แปลว่าเป็น Session
      if (
        /^\d{5,10}$/.test(v) ||
        /^"\d{5,10}"$/.test(v) ||
        v === 'true' ||
        v === 'false' ||
        v === 'admin' ||
        v === 'nurse' ||
        v === 'user' ||
        v === 'guest'
      ) {
        return true;
      }

      // ถ้าเป็น Object JSON ของพยาบาลคนเดียวที่กำลังล็อกอินอยู่ (ไม่ใช่ Array รายชื่อทั้งหมด และไม่ใช่ตารางเวร)
      if (v.startsWith('{') && v.endsWith('}')) {
        try {
          const obj = JSON.parse(v);
          if (obj && !Array.isArray(obj)) {
            const keys = Object.keys(obj);
            // ถ้าใน Object มีแค่ข้อมูลคนๆ เดียว เช่น { id: "6100074", name: "น.ส.วริศรา...", role: "nurse" }
            const hasSingleUserProps = (obj.id || obj.code || obj.empId || obj.staffId || obj.username || obj.role);
            const isNotScheduleMap = !keys.some( prop => /^\d{4}-\d{2}/.test(prop) || prop.includes('202') || prop.includes('256') );
            if (hasSingleUserProps && isNotScheduleMap && keys.length <= 12) {
              return true; // เป็นข้อมูลคนที่กำลังล็อกอิน ห้ามซิงค์!
            }
          }
        } catch (e) {}
      }
    }

    return false; // ข้อมูลตารางเวร, PIN ทั้งหมด, การตั้งค่าเวร ให้ซิงค์ตามปกติ
  }

  // ฟังก์ชันทำความสะอาดก้อน JSON (กรณีแอปเก็บ currentUser ซ้อนไว้ในก้อนข้อมูลรวม)
  function sanitizeJsonValue(val) {
    if (typeof val !== 'string') return val;
    const v = val.trim();
    if (v.startsWith('{') && v.endsWith('}')) {
      try {
        const obj = JSON.parse(v);
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
          const sessionProps = [
            'currentUser', 'currentNurse', 'loggedInUser', 'loggedInNurse',
            'activeUser', 'activeNurse', 'selectedNurse', 'selectedNurseId',
            'currentUserId', 'currentNurseId', 'isAdmin', 'isLoggedIn',
            'role', 'currentRole', 'authUser', 'session', 'userSession'
          ];
          let modified = false;
          sessionProps.forEach(prop => {
            if (prop in obj && obj[prop] !== null) {
              obj[prop] = null;
              modified = true;
            }
          });
          if (modified) return JSON.stringify(obj);
        }
      } catch (e) {}
    }
    return val;
  }

  // ล้างสถานะ Login ในเครื่องเมื่อเปิดเว็บครั้งแรกในแท็บใหม่ (เพื่อให้เครื่องอื่นที่ก๊อปปี้ลิงก์ไปเปิด ไม่ติด Login ค้าง)
  function ensureFreshDeviceSession() {
    if (!sessionStorage.getItem('device_login_active')) {
      // ถ้าเพิ่งเปิดลิงก์เข้ามาใหม่ในเครื่องนี้ ให้ลบเฉพาะค่า Login ที่อาจหลงเหลือมาจาก db.json เก่าออกทันที
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k);
        if (isPrivateSessionKey(k, v)) {
          keysToRemove.push(k);
        } else {
          // ถ้าเป็นก้อนข้อมูลรวม ให้ล้างเฉพาะฟิลด์ currentUser ข้างใน
          const cleaned = sanitizeJsonValue(v);
          if (cleaned !== v) originalSetItem(k, cleaned);
        }
      }
      keysToRemove.forEach(k => originalRemoveItem(k));
      sessionStorage.setItem('device_login_active', '1');
    }
  }
  ensureFreshDeviceSession();

  /* --------------------------------------------------------------------------
     2. การตั้งค่า UI (ซ่อนเวรดึกเมื่อเลือกโหมด 2 เวร + เดือนเริ่มต้น + บังคับกรอก PIN)
     -------------------------------------------------------------------------- */
  function injectSafeStyles() {
    if (document.getElementById('nurse-custom-fixes')) return;
    const style = document.createElement('style');
    style.id = 'nurse-custom-fixes';
    style.textContent = `
      .night-card-row-fix {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 16px !important;
        flex-wrap: nowrap !important;
      }
      .night-card-row-fix > *:first-child {
        flex-shrink: 0 !important;
        margin-bottom: 0 !important;
      }
      .night-card-hide-2shift {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function applySafeUIFixes() {
    try {
      injectSafeStyles();
      const bodyText = document.body ? document.body.innerText : '';
      const is2Shift = bodyText.includes('โหมด: 2 เวร') ||
                       bodyText.includes('2 เวร/วัน') ||
                       (bodyText.includes('เวรเช้า (M)') && bodyText.includes('เวรบ่าย (A)') && !bodyText.includes('เวรดึก (N)'));

      const spans = document.querySelectorAll('div, span, p');
      for (let i = 0; i < spans.length; i++) {
        const el = spans[i];
        if (el.children.length === 0 && el.textContent.trim() === 'เวรดึกของฉัน') {
          const textGroup = el.parentElement;
          const card = textGroup ? textGroup.parentElement : null;
          if (card && card.children.length >= 2) {
            card.classList.add('night-card-row-fix');
            if (is2Shift) {
              card.classList.add('night-card-hide-2shift');
            } else {
              card.classList.remove('night-card-hide-2shift');
            }
          }
        }
        if (is2Shift && el.children.length === 0 && el.textContent.includes('ทุกเวร (เช้า/บ่าย/ดึก)')) {
          el.textContent = el.textContent.replace('ทุกเวร (เช้า/บ่าย/ดึก)', 'ทุกเวร (เช้า/บ่าย)');
        }
      }

      let selectedMonthName = null;
      let selectedYearText = null;
      const selects = document.querySelectorAll('select');
      selects.forEach(sel => {
        if (sel.selectedIndex >= 0 && sel.options[sel.selectedIndex]) {
          const txt = sel.options[sel.selectedIndex].text.trim();
          const matchedMonth = THAI_MONTHS.find(m => txt.includes(m));
          if (matchedMonth) selectedMonthName = matchedMonth;
          if (/^25\d{2}$/.test(txt)) selectedYearText = txt;
        }
      });

      if (selectedMonthName) {
        for (let i = 0; i < spans.length; i++) {
          const el = spans[i];
          if (el.children.length === 0 && el.textContent.includes('ประจำเดือน') && el.textContent.includes('คลิกเลือกดูหรือจองเวร')) {
            const targetTxt = `ประจำเดือน ${selectedMonthName} ${selectedYearText || '2569'} | คลิกเลือกดูหรือจองเวรได้ทันที`;
            if (el.textContent.trim() !== targetTxt) {
              el.textContent = targetTxt;
            }
          }
        }
      }
    } catch (e) {}
  }

  function setInitialNextMonth() {
    try {
      if (sessionStorage.getItem('init_next_month_done')) return;
      sessionStorage.setItem('init_next_month_done', '1');

      const nextDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
      const nextMonthName = THAI_MONTHS[nextDate.getMonth()];
      const selects = document.querySelectorAll('select');

      selects.forEach(sel => {
        const opts = Array.from(sel.options);
        const targetOpt = opts.find(o => o.text.trim() === nextMonthName);
        if (targetOpt && sel.value !== targetOpt.value) {
          sel.value = targetOpt.value;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      setTimeout(applySafeUIFixes, 200);
    } catch (e) {}
  }

  document.addEventListener('click', function(e) {
    setTimeout(applySafeUIFixes, 150);

    const btn = e.target.closest('button, input[type="submit"], a, [role="button"]');
    if (!btn) return;
    const text = (btn.textContent || btn.value || '').trim();

    if (text.includes('เข้าสู่ระบบจองเวร') || text.includes('ยืนยันรหัส')) {
      const visiblePinInputs = Array.from(document.querySelectorAll('input[type="password"], input[placeholder*="PIN"]'))
        .filter(el => el.offsetParent !== null);

      if (visiblePinInputs.length > 0) {
        const pinInput = visiblePinInputs[0];
        if (!(pinInput.value || '').trim()) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          pinInput.focus();
          alert('กรุณากรอกรหัสผ่าน PIN ก่อนเข้าสู่ระบบ');
          return false;
        }
      }
    }
  }, true);

  document.addEventListener('change', function() {
    setTimeout(applySafeUIFixes, 100);
  });

  /* --------------------------------------------------------------------------
     3. ระบบซิงค์ GitHub (บันทึกและดึงเฉพาะตารางเวร ไม่เอา Login มาปน)
     -------------------------------------------------------------------------- */
  let badgeHideTimer = null;
  function showSyncStatus(text, bgColor = 'rgba(30, 58, 138, 0.85)', autoHide = true) {
    let badge = document.getElementById('gh-sync-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'gh-sync-badge';
      badge.style.cssText = 'position:fixed;bottom:12px;right:12px;padding:6px 14px;border-radius:20px;color:#fff;font-size:12px;z-index:99999;backdrop-filter:blur(8px);box-shadow:0 4px 12px rgba(0,0,0,0.25);transition:opacity 0.4s, background 0.3s;font-family:sans-serif;pointer-events:none;opacity:1;';
      document.body.appendChild(badge);
    }
    clearTimeout(badgeHideTimer);
    badge.style.opacity = '1';
    badge.style.background = bgColor;
    badge.textContent = text;
    if (autoHide) {
      badgeHideTimer = setTimeout(() => { badge.style.opacity = '0'; }, 3500);
    }
  }

  function utf8ToBase64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1)));
  }
  function base64ToUtf8(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str.replace(/\s/g, '')), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  }

  async function pullFromGitHub(isBackgroundCheck = false) {
    if (isSyncing) return;
    try {
      if (!isBackgroundCheck) {
        showSyncStatus('🔄 กำลังซิงค์ตารางเวร...', 'rgba(30, 58, 138, 0.85)', false);
      }
      const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}?ref=${GITHUB_CONFIG.branch}&t=${Date.now()}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `token ${GITHUB_CONFIG.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (res.status === 404) {
        await pushToGitHub();
        return;
      }
      if (!res.ok) return;

      const fileData = await res.json();
      if (isBackgroundCheck && fileSha && fileData.sha === fileSha) {
        return;
      }

      fileSha = fileData.sha;
      const cloudStore = JSON.parse(base64ToUtf8(fileData.content));

      let hasChanges = false;
      let needsCleanPush = false;
      isSyncing = true;

      for (const [key, val] of Object.entries(cloudStore)) {
        // ถ้าในไฟล์ db.json มีคีย์ Login ติดมา ให้ลบทิ้งจากเครื่องและสั่งทำความสะอาด db.json
        if (isPrivateSessionKey(key, val)) {
          needsCleanPush = true;
          continue;
        }
        const cleanVal = sanitizeJsonValue(val);
        if (cleanVal !== val) needsCleanPush = true;

        if (localStorage.getItem(key) !== cleanVal) {
          originalSetItem(key, cleanVal);
          hasChanges = true;
        }
      }
      isSyncing = false;

      if (needsCleanPush) {
        pushToGitHub();
      }

      if (hasChanges && !sessionStorage.getItem('gh_synced_reload')) {
        sessionStorage.setItem('gh_synced_reload', '1');
        showSyncStatus('🔔 อัปเดตตารางเวรใหม่แล้ว...', 'rgba(16, 185, 129, 0.95)', false);
        setTimeout(() => location.reload(), 400);
      } else {
        sessionStorage.removeItem('gh_synced_reload');
        if (!isBackgroundCheck) {
          showSyncStatus('☁️ ข้อมูลตารางเวรเป็นปัจจุบันแล้ว', 'rgba(16, 185, 129, 0.85)', true);
        }
      }
    } catch (err) {
      isSyncing = false;
    }
  }

  async function pushToGitHub() {
    if (isSyncing) return;
    try {
      isSyncing = true;
      showSyncStatus('⏳ กำลังบันทึกตารางเวรออนไลน์...', 'rgba(30, 58, 138, 0.85)', false);
      const sharedData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k);
        if (!isPrivateSessionKey(k, v)) {
          sharedData[k] = sanitizeJsonValue(v);
        }
      }

      const apiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
      const checkRes = await fetch(`${apiUrl}?ref=${GITHUB_CONFIG.branch}&t=${Date.now()}`, {
        headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` }
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        fileSha = checkData.sha;
      }

      const body = {
        message: 'Auto-sync shared duty data (clean session)',
        content: utf8ToBase64(JSON.stringify(sharedData, null, 2)),
        branch: GITHUB_CONFIG.branch
      };
      if (fileSha) body.sha = fileSha;

      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_CONFIG.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const resData = await res.json();
        fileSha = resData.content.sha;
        showSyncStatus('✅ บันทึกข้อมูลออนไลน์เรียบร้อย', 'rgba(16, 185, 129, 0.85)', true);
      }
    } catch (err) {
      showSyncStatus('❌ บันทึกออนไลน์ไม่สำเร็จ', 'rgba(220, 38, 38, 0.85)', true);
    } finally {
      isSyncing = false;
    }
  }

  localStorage.setItem = function(key, value) {
    originalSetItem(key, value);
    setTimeout(applySafeUIFixes, 100);
    if (!isSyncing && !isPrivateSessionKey(key, value)) {
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(pushToGitHub, 1000);
    }
  };

  localStorage.removeItem = function(key) {
    originalRemoveItem(key);
    setTimeout(applySafeUIFixes, 100);
    if (!isSyncing && !isPrivateSessionKey(key, '')) {
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(pushToGitHub, 1000);
    }
  };

  localStorage.clear = function() {
    originalClear();
  };

  window.addEventListener('load', () => {
    setTimeout(setInitialNextMonth, 300);
    setTimeout(applySafeUIFixes, 500);
    pullFromGitHub(false);
  });

  setInterval(() => {
    if (!document.hidden) pullFromGitHub(true);
  }, 12000);
})();
