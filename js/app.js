/**
 * =========================================================================
 * 🌐 SYSTEM CONFIGURATION & SUPABASE ENDPOINTS
 * =========================================================================
 */
const SUPABASE_URL = "https://yupjmwhebbxqswyaycwu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_O7kZ4A5COtuL2HkwIjfngA_450o_dk2";

// สร้าง Client สำหรับเชื่อมต่อ Supabase อย่างปลอดภัย
window.supabaseClient = window.supabaseClient || (window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null);
var supabase = window.supabaseClient;

// 1. Data Definitions
const ADMIN_CREDENTIALS = {
  username: "Admin",
  password: "2910"
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
  { id: "6100001", num: 1, name: "น.ส.ภิญญดา คำผาเชื้อ", pin: "1919", order: 1, color: "#c026d3", textColor: "#ffffff", bgSoft: "#fae8ff", border: "#f0abfc" },
  { id: "6100002", num: 2, name: "น.ส.จำปา สิมมา", pin: "1030", order: 2, color: "#dc2626", textColor: "#ffffff", bgSoft: "#fee2e2", border: "#fca5a5" },
  { id: "6100005", num: 3, name: "น.ส.ระวิวรรณ รัตนปัญญา", pin: "1742", order: 3, color: "#0284c7", textColor: "#ffffff", bgSoft: "#e0f2fe", border: "#7dd3fc" },
  { id: "6100013", num: 4, name: "น.ส.หิรัญญา แสนสุข", pin: "3241", order: 4, color: "#f43f5e", textColor: "#ffffff", bgSoft: "#fff1f2", border: "#fecdd3" },
  { id: "6100015", num: 5, name: "น.ส.วชิราพรรณ อานพินิจ", pin: "4955", order: 5, color: "#ea580c", textColor: "#ffffff", bgSoft: "#ffedd5", border: "#fdba74" },
  { id: "6100021", num: 6, name: "น.ส.ประทุมวัน ชัยยันต์", pin: "1979", order: 6, color: "#2563eb", textColor: "#ffffff", bgSoft: "#dbeafe", border: "#93c5fd" },
  { id: "6100057", num: 7, name: "น.ส.วิชชุดา ศรีหลง", pin: "7824", order: 7, color: "#eab308", textColor: "#713f12", bgSoft: "#fef9c3", border: "#fde047" },
  { id: "6100063", num: 8, name: "น.ส.อังสุมาลี เพียอามาตย์", pin: "1119", order: 8, color: "#1e3a8a", textColor: "#ffffff", bgSoft: "#e0e7ff", border: "#a5b4fc" },
  { id: "6100067", num: 10, name: "น.ส.สุชาวดี คำอู", pin: "9689", order: 9, color: "#06b6d4", textColor: "#ffffff", bgSoft: "#cffafe", border: "#67e8f9" },
  { id: "6100068", num: 11, name: "น.ส.ภัทราภรณ์ หล้าหนองเรือ", pin: "1234", order: 10, color: "#f97316", textColor: "#ffffff", bgSoft: "#ffedd5", border: "#fdba74" },
  { id: "6100070", num: 12, name: "น.ส.ปวีณ์ริศา อินทรพิมพ์", pin: "1997", order: 11, color: "#d97706", textColor: "#ffffff", bgSoft: "#fef3c7", border: "#fcd34d" },
  { id: "6100074", num: 13, name: "น.ส.วริศรา ศรีใส", pin: "1010", order: 12, color: "#8b5cf6", textColor: "#ffffff", bgSoft: "#ede9fe", border: "#c4b5fd" },
  { id: "6100076", num: 14, name: "น.ส.วิไลจิตร กุลทวง", pin: "0302", order: 13, color: "#15803d", textColor: "#ffffff", bgSoft: "#dcfce7", border: "#86efac" },
  { id: "6100075", num: 15, name: "น.ส.สิริณญา วิเศษวุธ", pin: "0410", order: 14, color: "#84cc16", textColor: "#1f2937", bgSoft: "#ecfccb", border: "#bef264" }
];

let NURSES = [];

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

loadNurses();

const SHIFTS = {
  M: { id: 'M', code: 'ช', name: 'เวรเช้า', time: '08:30 - 16:30 น.', hours: 8, badge: 'shift-m', icon: '☀️' },
  A: { id: 'A', code: 'บ', name: 'เวรบ่าย', time: '16:30 - 00:30 น.', hours: 8, badge: 'shift-a', icon: '⛅' },
  N: { id: 'N', code: 'ด', name: 'เวรดึก', time: '00:30 - 08:30 น.', hours: 8, badge: 'shift-n', icon: '🌙' }
};

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const CALENDAR_HEADERS = [
  { th: "อาทิตย์", short: "อา.", en: "Sun", isWeekend: true, headerClass: "bg-rose-100/90 text-rose-800 border-rose-300" },
  { th: "จันทร์", short: "จ.", en: "Mon", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-800 border-slate-200" },
  { th: "อังคาร", short: "อ.", en: "Tue", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-800 border-slate-200" },
  { th: "พุธ", short: "พ.", en: "Wed", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-800 border-slate-200" },
  { th: "พฤหัสบดี", short: "พฤ.", en: "Thu", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-800 border-slate-200" },
  { th: "ศุกร์", short: "ศ.", en: "Fri", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-800 border-slate-200" },
  { th: "เสาร์", short: "ส.", en: "Sat", isWeekend: true, headerClass: "bg-purple-100/90 text-purple-800 border-purple-300" }
];

const now = new Date();
const advanceDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
let defaultMonth = advanceDate.getMonth();
let defaultYear = advanceDate.getFullYear();
if (defaultYear < 2026) defaultYear = 2026;
if (defaultYear > 2032) defaultYear = 2032;

function getDefaultShiftModeForMonth(targetMonth) {
  if (targetMonth === 11 || targetMonth === 0 || targetMonth === 1 || targetMonth === 2) {
    return 3;
  }
  return 2;
}

let currentUser = null;
let currentYear = defaultYear;
let currentMonth = defaultMonth;
let activeView = 'dashboard';
let adminActiveSubView = 'matrix';
let dashboardShiftFilter = 'ALL';
let searchQuery = '';

let shiftMode = getDefaultShiftModeForMonth(currentMonth);
let hasAdminUnsavedChanges = false;

let monthState = {
  round: 1,
  round1: {},
  round2: {},
  roster: {},
  isConfirmed: false
};

let activeEditNurseId = null;
let activeEditDay = null;
let pendingShiftSelection = null;
let activeModalShiftContext = null;

let calendarViewMode = 'grid';
try {
  const savedCalView = localStorage.getItem('nurse_cal_view_mode');
  if (savedCalView) calendarViewMode = savedCalView;
} catch (e) { }

let aiEngine = null;
let dutyChartInstance = null;
let syncedNurseShiftsSnapshot = null;
let currentSummaryTab = 'ALL';
let lastKnownRosterHash = "";

function initTheme() {
  try {
    const saved = localStorage.getItem('nurse_roster_theme');
    applyTheme(saved === 'dark');
  } catch (e) {
    applyTheme(false);
  }
}

window.toggleTheme = function () {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(!isDark);
};

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    try { localStorage.setItem('nurse_roster_theme', 'dark'); } catch (e) { }
  } else {
    document.documentElement.classList.remove('dark');
    try { localStorage.setItem('nurse_roster_theme', 'light'); } catch (e) { }
  }

  const icon = isDark ? '☀️' : '🌙';
  const title = isDark ? 'เปลี่ยนเป็นโหมดสว่าง (Light Mode)' : 'เปลี่ยนเป็นโหมดมืด (Dark Mode)';

  const btnMobile = document.getElementById('themeToggleBtnMobile');
  if (btnMobile) { btnMobile.innerText = icon; btnMobile.title = title; }
  const btnDesktop = document.getElementById('themeToggleBtnDesktop');
  if (btnDesktop) { btnDesktop.innerText = icon; btnDesktop.title = title; }

  try {
    if (activeView === 'admin' && typeof renderDutyChart === 'function') {
      renderDutyChart();
    }
  } catch (e) { }
}

initTheme();

// =========================================================================
// 🛠️ CUSTOM SHIFT CONTROLLER & LOGIC (สลับ 2 เวร / 3 เวร ระหว่างเดือน)
// =========================================================================
var customShiftStartDay = 11;
var customShiftDirection = 'to3'; // 'to3' = 2 ไป 3, 'to2' = 3 ลดเหลือ 2

// 1. ฟังก์ชันดึงเวรที่เปิดให้จองในแต่ละวัน
function getActiveShiftsForDay(day) {
  if (shiftMode === 2) {
    return ['M', 'A'];
  }
  if (shiftMode === 3) {
    return ['M', 'A', 'N'];
  }
  if (shiftMode === 'custom') {
    if (customShiftDirection === 'to3') {
      // ก่อนวันตัด = 2 เวร, ตั้งแต่วันตัดเป็นต้นไป = 3 เวร
      return (day < customShiftStartDay) ? ['M', 'A'] : ['M', 'A', 'N'];
    } else if (customShiftDirection === 'to2') {
      // ก่อนวันตัด = 3 เวร, ตั้งแต่วันตัดเป็นต้นไป = 2 เวร (ลดเหลือ 2 เวร)
      return (day < customShiftStartDay) ? ['M', 'A', 'N'] : ['M', 'A'];
    }
  }
  return ['M', 'A', 'N'];
}

// 2. ตรวจว่าเดือนนี้มีเวรดึก (N) ปรากฏอย่างน้อย 1 วันหรือไม่
function monthHasNightShift() {
  if (shiftMode === 2) return false;
  if (shiftMode === 3) return true;
  if (shiftMode === 'custom') {
    var daysCount = (typeof getDaysCount === 'function')
      ? getDaysCount(currentYear, currentMonth)
      : 31;
    if (customShiftDirection === 'to3') {
      return customShiftStartDay <= daysCount;
    } else {
      return customShiftStartDay > 1; // ถ้า to2 และเริ่มลดตั้งแต่วันที่ > 1 แปลว่าช่วงต้นเดือนยังมีเวรดึก
    }
  }
  return true;
}

// 3. ฟังก์ชันเปิดหน้าต่าง Custom Modal
window.openCustomShiftModal = function () {
  var input = document.getElementById('customShiftStartDayInput');
  var daysCount = (typeof getDaysCount === 'function')
    ? getDaysCount(currentYear, currentMonth)
    : 31;

  if (input) {
    input.max = daysCount;
    input.value = customShiftStartDay || 11;
  }

  var radios = document.querySelectorAll('input[name="customShiftDirection"]');
  radios.forEach(function (r) {
    r.checked = (r.value === customShiftDirection);
  });

  var modal = document.getElementById('customShiftModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
};

// 4. ฟังก์ชันปิดหน้าต่าง Custom Modal (ปุ่ม ✕ และปุ่ม ยกเลิก)
window.closeCustomShiftModal = function () {
  var modal = document.getElementById('customShiftModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
};

// 5. ฟังก์ชันบันทึกการตั้งค่า Custom (ปุ่ม ✓ นำไปใช้งาน)
window.applyCustomShiftSettings = function () {
  var input = document.getElementById('customShiftStartDayInput');
  var val = parseInt(input ? input.value : '11', 10);
  var daysCount = (typeof getDaysCount === 'function')
    ? getDaysCount(currentYear, currentMonth)
    : 31;

  var checkedRadio = document.querySelector('input[name="customShiftDirection"]:checked');
  var dir = checkedRadio ? checkedRadio.value : 'to3';

  if (isNaN(val) || val < 1 || val > daysCount) {
    alert('กรุณาระบุวันที่ระหว่าง 1 ถึง ' + daysCount);
    return;
  }

  customShiftStartDay = val;
  customShiftDirection = dir;

  try {
    sessionStorage.setItem('nurse_custom_start_' + currentYear + '_' + currentMonth, val);
    sessionStorage.setItem('nurse_custom_dir_' + currentYear + '_' + currentMonth, dir);
  } catch (e) { }

  window.closeCustomShiftModal();

  if (typeof setShiftMode === 'function') {
    setShiftMode('custom');
  } else {
    shiftMode = 'custom';
    if (typeof updateShiftModeUI === 'function') updateShiftModeUI();
    if (typeof renderPublicDashboard === 'function') renderPublicDashboard();
  }

  var textDesc = (dir === 'to3')
    ? ('วันที่ 1-' + (val - 1) + ' (2 เวร), วันที่ ' + val + '-' + daysCount + ' (3 เวร)')
    : ('วันที่ 1-' + (val - 1) + ' (3 เวร), วันที่ ' + val + '-' + daysCount + ' (ลดเหลือ 2 เวร)');

  if (typeof window.showToast === 'function') {
    window.showToast('🛠️ Custom: ' + textDesc);
  }
};

window.applyCustomShiftSettings = function () {
  const input = document.getElementById('customShiftStartDayInput');
  const val = parseInt(input?.value, 10);
  const daysCount = getDaysCount(currentYear, currentMonth);
  const dir = document.querySelector('input[name="customShiftDirection"]:checked')?.value || 'to3';

  if (isNaN(val) || val < 1 || val > daysCount) {
    alert(`กรุณาระบุวันที่ระหว่าง 1 ถึง ${daysCount}`);
    return;
  }

  customShiftStartDay = val;
  customShiftDirection = dir;

  closeCustomShiftModal();
  setShiftMode('custom');

  const textLabel = (dir === 'to3')
    ? `วันที่ 1-${val - 1} (2 เวร), วันที่ ${val}-${daysCount} (3 เวร)`
    : `วันที่ 1-${val - 1} (3 เวร), วันที่ ${val}-${daysCount} (ลดเหลือ 2 เวร)`;

  window.showToast?.(`🛠️ Custom: ${textLabel}`);
};

function getActiveShifts() {
  return shiftMode === 2 ? ['M', 'A'] : ['M', 'A', 'N'];
}

window.setShiftMode = function (mode) {
  shiftMode = mode;
  try {
    sessionStorage.setItem(`nurse_shift_mode_${currentYear}_${currentMonth}`, mode);
  } catch (e) { }
  updateShiftModeUI();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminView();
  if (activeView === 'excel') renderExcelView('userExcelViewContent');
};

function updateShiftModeUI() {
  const btn2 = document.getElementById('mode2ShiftBtn');
  const btn3 = document.getElementById('mode3ShiftBtn');
  const btnCustom = document.getElementById('modeCustomShiftBtn');
  const textCustom = document.getElementById('customShiftBtnText');

  const activeClass = "px-2.5 py-1 rounded-lg text-xs font-black bg-blue-700 text-white shadow-xs transition cursor-pointer";
  const inactiveClass = "px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-700 transition cursor-pointer";
  const customActiveClass = "px-2.5 py-1 rounded-lg text-xs font-black bg-amber-600 text-white shadow-xs transition flex items-center gap-1 cursor-pointer";

  if (btn2 && btn3) {
    btn2.className = (shiftMode === 2) ? activeClass : inactiveClass;
    btn3.className = (shiftMode === 3) ? activeClass : inactiveClass;
    if (btnCustom) {
      btnCustom.className = (shiftMode === 'custom') ? customActiveClass : inactiveClass;
    }
  }

  // =========================================================================
  // 👉 จุดที่ 3: ปรับข้อความปุ่ม Custom ให้แสดงทั้งทิศทาง (➔ 3 เวร หรือ ➔ 2 เวร) และวันที่
  // =========================================================================
  if (textCustom) {
    if (shiftMode === 'custom') {
      const dirText = (typeof customShiftDirection !== 'undefined' && customShiftDirection === 'to2')
        ? '➔ 2 เวร'
        : '➔ 3 เวร';
      textCustom.innerText = `Custom (${dirText} วันที่ ${customShiftStartDay})`;
    } else {
      textCustom.innerText = 'Custom เวร';
    }
  }

  // ตรวจสอบว่าในเดือนนี้มีเวรดึก (N) เกิดขึ้นหรือไม่
  const hasNightInMonth = (typeof monthHasNightShift === 'function')
    ? monthHasNightShift()
    : (shiftMode !== 2);

  // ควบคุมการแสดงผลเวรดึกใน Modal จองหลายวันพร้อมกัน
  const shiftNContainer = document.getElementById('shiftBtnContainerN') || document.querySelector('input[name="modalShift"][value="N"]')?.closest('label');
  if (shiftNContainer) {
    shiftNContainer.style.display = hasNightInMonth ? 'flex' : 'none';
    if (!hasNightInMonth) {
      const nCb = shiftNContainer.querySelector('input[type="checkbox"]');
      if (nCb) nCb.checked = false;
      shiftNContainer.classList.remove('is-active');
    }
  }

  // ควบคุมการแสดงผลเวรดึกใน Popup เลือกเวรรายวัน
  const cellShiftNCont = document.getElementById('cellShiftNContainer');
  if (cellShiftNCont) {
    cellShiftNCont.style.display = hasNightInMonth ? 'flex' : 'none';
  }

  // การ์ดสถิติเวรดึกในหน้าตารางเวรของฉัน
  const nurseStatN = document.getElementById('nurseStatNCard');
  const nurseStatsGrid = document.getElementById('nursePersonalStatsContainer');
  if (nurseStatN) {
    nurseStatN.style.display = hasNightInMonth ? 'flex' : 'none';
  }
  if (nurseStatsGrid) {
    if (!hasNightInMonth) {
      nurseStatsGrid.className = "grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6";
    } else {
      nurseStatsGrid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6";
    }
  }

  // คอลัมน์เวรดึกในตารางสรุปชั่วโมงเวร
  const summaryNHead = document.getElementById('summaryColNHead');
  if (summaryNHead) {
    summaryNHead.style.display = hasNightInMonth ? '' : 'none';
  }

  const modalShiftCont = document.getElementById('modalShiftOptionsContainer');
  if (modalShiftCont) {
    modalShiftCont.className = (!hasNightInMonth ? 'grid grid-cols-2 gap-2.5' : 'grid grid-cols-3 gap-2.5');
  }

  if (typeof syncShiftToggleVisuals === 'function') {
    syncShiftToggleVisuals();
  }
}

function syncShiftToggleVisuals() {
  const checkboxes = document.querySelectorAll('input[name="modalShift"]');
  checkboxes.forEach(cb => {
    const parent = cb.closest('.shift-toggle-btn');
    if (parent) {
      if (cb.checked) parent.classList.add('is-active');
      else parent.classList.remove('is-active');
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

function updateRealTimeClock() {
  const dateEl = document.getElementById('realTimeClockDate');
  const timeEl = document.getElementById('realTimeClockTime');
  if (!dateEl || !timeEl) return;

  const dNow = new Date();
  const daysOfWeek = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
  const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  const dayName = daysOfWeek[dNow.getDay()];
  const dayNum = dNow.getDate();
  const monthName = thaiMonthsShort[dNow.getMonth()];
  const yearBE = dNow.getFullYear() + 543;

  const hh = String(dNow.getHours()).padStart(2, '0');
  const mm = String(dNow.getMinutes()).padStart(2, '0');
  const ss = String(dNow.getSeconds()).padStart(2, '0');

  dateEl.textContent = `${dayName}ที่ ${dayNum} ${monthName} ${yearBE}`;
  timeEl.textContent = `${hh}:${mm}:${ss} น.`;
}

function getDaysCount(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayIndex(year, month) {
  return new Date(year, month, 1).getDay();
}

function getStorageKey() {
  return `nurse_system_${currentYear}_${currentMonth}`;
}

function saveNurseDraft() {
  if (currentUser && currentUser.role === 'nurse') {
    const draftKey = `nurse_draft_${currentUser.nurseId}_${currentYear}_${currentMonth}`;
    const myShifts = (monthState.roster && monthState.roster[currentUser.nurseId]) || {};
    localStorage.setItem(draftKey, JSON.stringify(myShifts));
  }
}

function saveMonthState() {
  localStorage.setItem(getStorageKey(), JSON.stringify(monthState));
  saveNurseDraft();
  updatePendingShiftBadgeUI();
}

function loadMonthState() {
  const key = getStorageKey();
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      monthState = JSON.parse(saved);
      if (!monthState.roster) monthState.roster = {};
      if (typeof monthState.isConfirmed === 'undefined') monthState.isConfirmed = false;
    } catch (e) {
      monthState = { roster: {}, isConfirmed: false };
    }
  } else {
    monthState = { roster: {}, isConfirmed: false };
  }
}

window.toggleNurseListDropdown = function () {
  const dd = document.getElementById('nurseListDropdown');
  if (dd) dd.classList.toggle('hidden');
};

window.selectNurseForLogin = function (nurseId) {
  const nurse = NURSES.find(n => n.id === nurseId);
  if (!nurse) return;

  const hiddenInput = document.getElementById('modalLoginNurseIdSelect');
  if (hiddenInput) hiddenInput.value = nurse.id;

  const badgeNum = document.getElementById('nurseBadgeNum');
  const badgeName = document.getElementById('nurseBadgeName');
  const badgeId = document.getElementById('nurseBadgeId');
  const card = document.getElementById('nurseSelectedCard');

  if (badgeNum) {
    badgeNum.innerText = nurse.num;
    badgeNum.style.backgroundColor = nurse.color || '#2563eb';
    badgeNum.style.color = nurse.textColor || '#ffffff';
  }
  if (badgeName) badgeName.innerText = nurse.name;
  if (badgeId) badgeId.innerText = nurse.id;
  if (card && nurse.border) {
    card.style.borderColor = nurse.border;
  }

  const dd = document.getElementById('nurseListDropdown');
  if (dd) dd.classList.add('hidden');
  clearKeypadPin();
};

function renderNurseDropdownList() {
  const container = document.getElementById('nurseListDropdown');
  if (!container) return;

  container.innerHTML = NURSES.map(n => `
    <div onclick="selectNurseForLogin('${n.id}')"
      class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition">
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 shadow-xs"
          style="background-color: ${n.color || '#2563eb'}; color: ${n.textColor || '#ffffff'};">
          ${n.num}
        </span>
        <span class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">${n.name}</span>
      </div>
      <span class="text-[10px] font-mono font-bold text-slate-400 shrink-0">${n.id}</span>
    </div>
  `).join('');
}

let keypadCurrentPin = "";
let adminKeypadCurrentPin = "";

function updateKeypadDotsUI() {
  const pinInput = document.getElementById('modalLoginNursePin');
  if (pinInput) pinInput.value = keypadCurrentPin;

  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`pinDot${i}`);
    if (dot) {
      if (i < keypadCurrentPin.length) {
        dot.className = "w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-500 shadow-md shadow-blue-500/40 transform scale-110 transition-all duration-200 animate-pulse";
      } else {
        dot.className = "w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 transition-all duration-200";
      }
    }
  }

  const statusText = document.getElementById('pinLengthStatus');
  if (statusText) statusText.innerText = `${keypadCurrentPin.length} / 4`;
}

window.pressKeypad = function (digit) {
  if (keypadCurrentPin.length < 4) {
    keypadCurrentPin += digit;
    updateKeypadDotsUI();

    if (keypadCurrentPin.length === 4) {
      setTimeout(() => {
        submitKeypadLogin();
      }, 100);
    }
  }
};

window.backspaceKeypadPin = function () {
  if (keypadCurrentPin.length > 0) {
    keypadCurrentPin = keypadCurrentPin.slice(0, -1);
    updateKeypadDotsUI();
  }
};

window.clearKeypadPin = function () {
  keypadCurrentPin = "";
  updateKeypadDotsUI();
};

window.submitKeypadLogin = function () {
  const hiddenInput = document.getElementById('modalLoginNurseIdSelect');
  const nurseId = hiddenInput ? hiddenInput.value : (NURSES[0] && NURSES[0].id);
  if (!nurseId) {
    alert("กรุณาเลือกรหัสพยาบาล");
    return;
  }
  if (keypadCurrentPin.length !== 4) {
    alert("กรุณากรอกรหัสผ่าน PIN ให้ครบ 4 หลัก");
    return;
  }

  const success = loginAsNurse(nurseId, keypadCurrentPin);
  if (!success) {
    clearKeypadPin();
  }
};

window.openNurseLoginModal = function (optionalContext) {
  clearKeypadPin();
  renderNurseDropdownList();

  const modal = document.getElementById('nurseLoginModal');
  const banner = document.getElementById('nurseLoginTargetBanner');

  const currentSelectedId = document.getElementById('modalLoginNurseIdSelect')?.value;
  if (!currentSelectedId && NURSES.length > 0) {
    selectNurseForLogin(NURSES[0].id);
  } else if (currentSelectedId) {
    selectNurseForLogin(currentSelectedId);
  }

  if (optionalContext && optionalContext.day && optionalContext.shift) {
    pendingShiftSelection = optionalContext;
    if (banner) {
      banner.classList.remove('hidden');
      banner.innerHTML = `📌 คุณกำลังจะเลือก: <b>วันที่ ${optionalContext.day} ${SHIFTS[optionalContext.shift].name}</b><br>กรุณากด PIN 4 หลักเพื่อยืนยัน`;
    }
  } else {
    pendingShiftSelection = null;
    if (banner) banner.classList.add('hidden');
  }

  if (modal) modal.classList.remove('hidden');
};

window.closeNurseLoginModal = function () {
  document.getElementById('nurseLoginModal')?.classList.add('hidden');
  const dd = document.getElementById('nurseListDropdown');
  if (dd) dd.classList.add('hidden');
  pendingShiftSelection = null;
  clearKeypadPin();
};

function updateAdminKeypadDotsUI() {
  const passInput = document.getElementById('modalAdminPasswordOnly');
  if (passInput) passInput.value = adminKeypadCurrentPin;

  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`adminPinDot${i}`);
    if (dot) {
      if (i < adminKeypadCurrentPin.length) {
        dot.className = "w-4 h-4 rounded-full bg-indigo-600 border-2 border-indigo-500 shadow-md shadow-indigo-500/40 transform scale-110 transition-all duration-200 animate-pulse";
      } else {
        dot.className = "w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 transition-all duration-200";
      }
    }
  }

  const statusText = document.getElementById('adminPinLengthStatus');
  if (statusText) statusText.innerText = `${adminKeypadCurrentPin.length} / 4`;
}

window.pressAdminKeypad = function (digit) {
  if (adminKeypadCurrentPin.length < 4) {
    adminKeypadCurrentPin += digit;
    updateAdminKeypadDotsUI();

    if (adminKeypadCurrentPin.length === 4) {
      setTimeout(() => {
        submitAdminKeypadLogin();
      }, 100);
    }
  }
};

window.backspaceAdminKeypadPin = function () {
  if (adminKeypadCurrentPin.length > 0) {
    adminKeypadCurrentPin = adminKeypadCurrentPin.slice(0, -1);
    updateAdminKeypadDotsUI();
  }
};

window.clearAdminKeypadPin = function () {
  adminKeypadCurrentPin = "";
  updateAdminKeypadDotsUI();
};

window.submitAdminKeypadLogin = function () {
  if (adminKeypadCurrentPin.length < 4) {
    alert("กรุณากรอกรหัสผ่าน Admin ให้ครบ 4 หลัก");
    return;
  }

  const success = loginAsAdmin(adminKeypadCurrentPin);
  if (!success) {
    clearAdminKeypadPin();
  }
};

window.openAdminLoginModal = function () {
  clearAdminKeypadPin();
  const modal = document.getElementById('adminLoginModal');
  if (modal) modal.classList.remove('hidden');
};

window.closeAdminLoginModal = function () {
  document.getElementById('adminLoginModal')?.classList.add('hidden');
  clearAdminKeypadPin();
};

function initAuth() {
  const savedUser = localStorage.getItem('nurse_current_user');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
    } catch (e) {
      currentUser = null;
    }
  } else {
    currentUser = null;
  }
  updateAuthUI();
}

window.showToast = function (message, duration = 3000) {
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

function triggerFireworks(durationMs = 1800) {
  try {
    const existing = document.getElementById('celebrationFireworksCanvas');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

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

    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#eab308', '#ffffff', '#6366f1'];
    const particles = [];

    function createBurst(x, y, particleCount = 45) {
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6.5 + 2.5;
        particles.push({
          x, y,
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

    createBurst(width * 0.5, height * 0.35, 55);
    setTimeout(() => createBurst(width * 0.25, height * 0.38, 45), 180);
    setTimeout(() => createBurst(width * 0.75, height * 0.36, 45), 320);

    const startTime = performance.now();
    function render() {
      const elapsed = performance.now() - startTime;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.friction; p.vy *= p.friction; p.vy += p.gravity;
        p.x += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) { particles.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (elapsed < durationMs || particles.length > 0) {
        requestAnimationFrame(render);
      } else if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
    requestAnimationFrame(render);
  } catch (err) { }
}

async function loginAsNurse(nurseId, enteredPin) {
  const nurse = NURSES.find(n => n.id === nurseId);
  if (!nurse) { alert('ไม่พบรหัสพยาบาลนี้ในระบบ'); return false; }
  if (enteredPin && enteredPin.trim() !== nurse.pin) { alert(`รหัสผ่าน (PIN) ไม่ถูกต้อง`); return false; }

  currentUser = { role: 'nurse', nurseId: nurse.id, name: nurse.name };
  localStorage.setItem('nurse_current_user', JSON.stringify(currentUser));
  closeNurseLoginModal();
  updateAuthUI();

  // 1. ดึงข้อมูลจริงล่าสุดจาก Supabase ก่อน เพื่อให้ได้ฐานข้อมูลที่ถูกต้องที่สุด
  if (typeof window.fetchRosterFromSheet === 'function') {
    await window.fetchRosterFromSheet(false);
  }

  // 2. บันทึก Snapshot ล่าสุดจาก Supabase ไว้เปรียบเทียบหา Pending Changes
  const serverShifts = (monthState.roster && monthState.roster[nurse.id]) || {};
  syncedNurseShiftsSnapshot = JSON.parse(JSON.stringify(serverShifts));
  localStorage.setItem(`nurse_synced_shifts_${nurse.id}_${currentYear}_${currentMonth}`, JSON.stringify(syncedNurseShiftsSnapshot));

  // 3. ตรวจสอบว่ามี Draft ที่ User เคยเลือกค้างไว้หรือไม่
  const draftKey = `nurse_draft_${nurse.id}_${currentYear}_${currentMonth}`;
  const savedDraft = localStorage.getItem(draftKey);

  if (savedDraft) {
    try {
      // ✅ กรณีมี Draft ค้าง: นำ Draft มาใส่เพื่อให้ User ทำต่อได้
      if (!monthState.roster) monthState.roster = {};
      monthState.roster[nurse.id] = JSON.parse(savedDraft);
    } catch (e) {
      console.error('Error loading nurse draft:', e);
    }
  } else {
    // ✅ กรณีเข้าระบบครั้งแรก (ไม่มี Draft): ให้ยึดตามฐานข้อมูล Supabase เป็นหลัก ไม่เอาค่ามั่วในเครื่องมาแสดง
    if (!monthState.roster) monthState.roster = {};
    monthState.roster[nurse.id] = JSON.parse(JSON.stringify(serverShifts));
  }

  // 4. กรณีที่คลิกเลือกเวรจากหน้าปฏิทินก่อน Login
  if (pendingShiftSelection) {
    const { day, shift } = pendingShiftSelection;
    if (!monthState.roster[nurse.id]) monthState.roster[nurse.id] = {};
    if (!monthState.roster[nurse.id][day]) monthState.roster[nurse.id][day] = [];
    if (!monthState.roster[nurse.id][day].includes(shift)) {
      monthState.roster[nurse.id][day].push(shift);
      saveMonthState();
    }
    pendingShiftSelection = null;
  }

  // 5. บันทึกสถานะและเรนเดอร์หน้าจอ
  saveMonthState();
  renderPublicDashboard();
  switchView('personal');
  updatePendingShiftBadgeUI();

  if (typeof checkAndOpenFastClaimModalOnLogin === 'function') {
    checkAndOpenFastClaimModalOnLogin();
  }

  triggerFireworks(1800);
  return true;
}

function loginAsAdmin(password) {
  if (!password) { alert('กรุณากรอกรหัสผ่าน Admin'); return false; }
  if (password === getAdminPassword()) {
    currentUser = { role: 'admin', name: 'ผู้ดูแลระบบ (Admin)' };
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

window.openAdminChangePasswordModal = function () {
  const modal = document.getElementById('adminChangePasswordModal');
  if (!modal) return;
  document.getElementById('adminCurrentPassword').value = '';
  document.getElementById('adminNewPassword').value = '';
  document.getElementById('adminConfirmPassword').value = '';
  const errorMsg = document.getElementById('adminPasswordErrorMsg');
  if (errorMsg) errorMsg.classList.add('hidden');
  modal.classList.remove('hidden');
};

window.closeAdminChangePasswordModal = function () {
  document.getElementById('adminChangePasswordModal')?.classList.add('hidden');
};

window.handleAdminChangePassword = function (e) {
  if (e) e.preventDefault();
  const currentPass = document.getElementById('adminCurrentPassword')?.value || '';
  const newPass = document.getElementById('adminNewPassword')?.value || '';
  const confirmPass = document.getElementById('adminConfirmPassword')?.value || '';
  const errorMsg = document.getElementById('adminPasswordErrorMsg');

  const showError = (msg) => {
    if (errorMsg) { errorMsg.innerText = msg; errorMsg.classList.remove('hidden'); }
    else alert(msg);
  };

  if (currentPass !== getAdminPassword()) { showError('❌ รหัสผ่านเดิมไม่ถูกต้อง'); return false; }
  if (newPass.length < 4) { showError('❌ รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร'); return false; }
  if (newPass !== confirmPass) { showError('❌ ยืนยันรหัสผ่านใหม่ไม่ตรงกัน'); return false; }

  setAdminPassword(newPass);
  closeAdminChangePasswordModal();
  window.showToast('✓ เปลี่ยนรหัสผ่าน Admin เรียบร้อยแล้ว');
  return true;
};

window.openNurseChangePasswordModal = function () {
  if (!currentUser || currentUser.role !== 'nurse') {
    alert('กรุณาเข้าสู่ระบบในฐานะพยาบาลก่อนเปลี่ยนรหัสผ่าน (PIN)');
    return;
  }
  const modal = document.getElementById('nurseChangePasswordModal');
  if (!modal) return;
  const nurse = NURSES.find(n => n.id === currentUser.nurseId);
  const subTitle = document.getElementById('nurseChangePinSubTitle');
  if (subTitle && nurse) subTitle.innerText = `สำหรับคุณ ${nurse.name} (รหัส ${nurse.id})`;

  document.getElementById('nurseCurrentPin').value = '';
  document.getElementById('nurseNewPin').value = '';
  document.getElementById('nurseConfirmPin').value = '';
  const errorMsg = document.getElementById('nursePasswordErrorMsg');
  if (errorMsg) errorMsg.classList.add('hidden');
  modal.classList.remove('hidden');
};

window.closeNurseChangePasswordModal = function () {
  document.getElementById('nurseChangePasswordModal')?.classList.add('hidden');
};

window.handleNurseChangePassword = function (e) {
  if (e) e.preventDefault();
  if (!currentUser || currentUser.role !== 'nurse') return false;
  const nurse = NURSES.find(n => n.id === currentUser.nurseId);
  if (!nurse) return false;

  const currentPin = document.getElementById('nurseCurrentPin')?.value || '';
  const newPin = document.getElementById('nurseNewPin')?.value || '';
  const confirmPin = document.getElementById('nurseConfirmPin')?.value || '';
  const errorMsg = document.getElementById('nursePasswordErrorMsg');

  const showError = (msg) => {
    if (errorMsg) { errorMsg.innerText = msg; errorMsg.classList.remove('hidden'); }
    else alert(msg);
  };

  if (currentPin.trim() !== nurse.pin) { showError('❌ รหัส PIN เดิมไม่ถูกต้อง'); return false; }
  if (newPin.trim().length < 4) { showError('❌ รหัส PIN ใหม่ต้องมีความยาวอย่างน้อย 4 ตัว'); return false; }
  if (newPin !== confirmPin) { showError('❌ ยืนยัน PIN ใหม่ไม่ตรงกัน'); return false; }

  nurse.pin = newPin.trim();
  saveNurses();
  closeNurseChangePasswordModal();
  window.showToast(`✓ เปลี่ยน PIN สำหรับ ${nurse.name} สำเร็จแล้ว`);
  return true;
};

window.handleLogout = function () {
  currentUser = null;
  localStorage.removeItem('nurse_current_user');
  sessionStorage.removeItem('nurse_current_user');
  activeView = 'dashboard';
  updateAuthUI();
  switchView('dashboard');
  window.showToast('🚪 ออกจากระบบเรียบร้อยแล้ว');
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
      if (userProfileBadge) {
        userProfileBadge.innerHTML = `
          <div class="flex items-center gap-1.5 sm:gap-2 bg-indigo-900/60 border border-white/30 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm min-w-0">
            <span class="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40 shrink-0"></span>
            <span class="font-bold text-white truncate">🛡️ ผู้ดูแลระบบ (Admin)</span>
            <button onclick="openAdminChangePasswordModal()" class="ml-1 px-1.5 py-0.5 bg-amber-400/25 hover:bg-amber-400/45 border border-amber-300/50 rounded-lg text-amber-100 hover:text-white font-bold text-[10px] sm:text-[11px] transition flex items-center gap-1 cursor-pointer shrink-0" title="เปลี่ยนรหัสผ่าน Admin">
              <span>🔑</span><span class="hidden sm:inline">เปลี่ยนรหัส</span>
            </button>
          </div>
        `;
      }
    } else {
      if (headerLogoutText) headerLogoutText.innerText = 'ออกจากระบบ';
      if (userProfileBadge) {
        userProfileBadge.innerHTML = `
          <div class="flex items-center gap-1.5 sm:gap-2 bg-white/20 border border-white/30 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm min-w-0">
            <span class="w-2 h-2 rounded-full bg-emerald-300 ring-2 ring-emerald-300/40 shrink-0"></span>
            <span class="font-bold text-white truncate">👩‍⚕️ ${currentUser.name}</span>
            <span class="font-mono text-blue-100 text-[10px] sm:text-xs shrink-0">(${currentUser.nurseId})</span>
            <button onclick="openNurseChangePasswordModal()" class="ml-1 px-1.5 py-0.5 bg-amber-400/25 hover:bg-amber-400/45 border border-amber-300/50 rounded-lg text-amber-100 hover:text-white font-bold text-[10px] sm:text-[11px] transition flex items-center gap-1 cursor-pointer shrink-0" title="เปลี่ยนรหัสผ่าน / PIN">
              <span>🔑</span><span class="hidden sm:inline">เปลี่ยน PIN</span>
            </button>
          </div>
        `;
      }
    }
  }
  updateNavSwitcher(activeView);
}

function updateNavSwitcher(viewName) {
  const isAdmin = !!(currentUser && currentUser.role === 'admin');

  const btnTopAdmin = document.getElementById('topNavAdminBtn');
  if (btnTopAdmin) {
    if (isAdmin) {
      btnTopAdmin.classList.remove('hidden');
      const textSpan = document.getElementById('topNavAdminBtnText');
      if (textSpan) textSpan.innerText = `ตารางรวม ${NURSES.length} ท่าน`;
    } else {
      btnTopAdmin.classList.add('hidden');
    }
  }

  const topButtons = [
    { id: 'topNavDashboardBtn', target: 'dashboard', activeClass: 'bg-blue-600 text-white border-blue-600 shadow-md', inactiveClass: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50' },
    { id: 'topNavExcelBtn', target: 'excel', activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-md', inactiveClass: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50' },
    { id: 'topNavAdminBtn', target: 'admin', activeClass: 'bg-indigo-600 text-white border-indigo-600 shadow-md', inactiveClass: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-indigo-50' }
  ];

  topButtons.forEach(({ id, target, activeClass, inactiveClass }) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const isActive = (viewName === target);
    btn.className = `${btn.classList.contains('hidden') ? 'hidden ' : ''}flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border shadow-2xs transition active:scale-95 cursor-pointer ${isActive ? activeClass : inactiveClass}`;
  });

  const bottomNavItems = [
    { id: 'bottomNavDashboardBtn', target: 'dashboard', colorClass: 'bg-blue-100/90 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700' },
    { id: 'bottomNavPersonalBtn', target: 'personal', colorClass: 'bg-sky-100/90 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border border-sky-200 dark:border-sky-700' },
    { id: 'bottomNavExcelBtn', target: 'excel', colorClass: 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700' },
    { id: 'bottomNavAdminBtn', target: 'admin', colorClass: 'bg-indigo-100/90 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700' }
  ];

  bottomNavItems.forEach(({ id, target, colorClass }) => {
    const bBtn = document.getElementById(id);
    if (!bBtn) return;
    const isCurrent = (viewName === target);

    if (isCurrent) {
      bBtn.className = `relative flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-150 active:scale-90 font-black shadow-xs ${colorClass}`;
    } else {
      bBtn.className = "relative flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800/50";
    }

    const dot = bBtn.querySelector('.nav-indicator-dot');
    if (dot) {
      if (isCurrent) {
        dot.classList.remove('hidden');
      } else {
        dot.classList.add('hidden');
      }
    }
  });
}

window.switchView = function (viewName) {
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
      if (uSecTitle) uSecTitle.innerText = `สรุปตารางเวร ประจำเดือน ${THAI_MONTHS[currentMonth]} ${currentYear + 543}`;
      renderExcelView('userExcelViewContent');
    }
  }
};

window.setDashboardFilter = function (filter) {
  dashboardShiftFilter = filter;
  ['ALL', 'UNASSIGNED', 'M', 'A', 'N'].forEach(f => {
    const btn = document.getElementById(`filterBtn${f}`);
    if (btn) {
      btn.className = (f === filter)
        ? "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-700 text-white shadow-xs transition"
        : "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition";
    }
  });
  renderPublicDashboard();
};

function renderPublicDashboard() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  const firstDayIndex = getFirstDayIndex(currentYear, currentMonth);

  const subTitle = document.getElementById('dashCalendarSubtitle');
  if (subTitle) {
    const monthName = THAI_MONTHS[currentMonth];
    const yearBE = currentYear + 543;
    subTitle.textContent = `ประจำเดือน ${monthName} ${yearBE} | คลิกเลือกดูหรือจองเวรได้ทันที`;
  }

  const calHeader = document.getElementById('mainCalendarHeader');
  if (calHeader) {
    calHeader.innerHTML = CALENDAR_HEADERS.map(ch => `
      <div class="py-1.5 px-1 sm:py-2.5 sm:px-2 text-center rounded-xl sm:rounded-2xl border ${ch.headerClass} shadow-xs backdrop-blur-sm flex flex-col items-center justify-center">
        <div class="text-xs sm:text-base font-black tracking-tight leading-tight">
          ${ch.th}
        </div>
        <div class="text-[9px] sm:text-xs font-bold opacity-80 font-mono leading-tight mt-0.5">
          ${ch.en}
        </div>
      </div>
    `).join('');
  }

  let totalShiftsCount = 0;
  let unassignedShiftsCount = 0;
  let assignedShiftsCount = 0;
  let totalBookingsCount = 0;

  const calGrid = document.getElementById('mainCalendarGrid');
  let calHtml = '';

  for (let pad = 0; pad < firstDayIndex; pad++) {
    calHtml += `<div class="main-cal-empty-cell p-1 sm:p-2 flex items-start justify-end text-slate-300 select-none"><span class="opacity-25 font-mono text-[9px] sm:text-xs">•</span></div>`;
  }

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    let shiftRowsHtml = '';

    // =========================================================================
    // 👉 ข้อ 2.4: ดึงรายการเวรตามวันที่ d (รองรับทั้งแบบ 2 เวร, 3 เวร และ Custom)
    // =========================================================================
    const activeShiftsThisDay = (typeof getActiveShiftsForDay === 'function')
      ? getActiveShiftsForDay(d)
      : (shiftMode === 2 ? ['M', 'A'] : ['M', 'A', 'N']);

    totalShiftsCount += activeShiftsThisDay.length;

    activeShiftsThisDay.forEach(s => {
      const shiftObj = SHIFTS[s];
      const assigned = [];
      NURSES.forEach(n => {
        const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
        if (shifts.includes(s)) assigned.push(n);
      });

      const count = assigned.length;
      totalBookingsCount += count;
      const isUnassigned = (count === 0);

      if (isUnassigned) unassignedShiftsCount++;
      else assignedShiftsCount++;

      let isVisible = true;
      if (dashboardShiftFilter === 'UNASSIGNED' && !isUnassigned) isVisible = false;
      if (dashboardShiftFilter === 'M' && s !== 'M') isVisible = false;
      if (dashboardShiftFilter === 'A' && s !== 'A') isVisible = false;
      if (dashboardShiftFilter === 'N' && s !== 'N') isVisible = false;

      const rowClass = isUnassigned ? 'cal-shift-row cal-shift-unassigned' : 'cal-shift-row cal-shift-assigned';
      const opacityClass = isVisible ? 'opacity-100' : 'opacity-25 grayscale pointer-events-none';

      shiftRowsHtml += `
        <div class="${rowClass} ${opacityClass} mb-0.5 sm:mb-1 last:mb-0" onclick="handleShiftClick(${d}, '${s}')">
          <div class="flex items-center justify-center sm:justify-between gap-0.5 sm:gap-1">
            <div class="flex items-center gap-0.5 sm:gap-1 font-bold text-[10px] sm:text-xs min-w-0">
              <span class="text-[9px] sm:text-sm shrink-0">${shiftObj.icon}</span>
              <span class="hidden md:inline font-bold">${shiftObj.name}</span>
            </div>
            <span class="font-black text-[8px] sm:text-xs shrink-0 ${isUnassigned ? 'text-rose-600' : 'text-sky-800'}">
              ${count}<span class="text-[7.5px] font-normal">คน</span>
            </span>
          </div>
        </div>
      `;
    });

    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);
    let dayCardStyle = isSunday ? 'bg-rose-50/70 border-rose-200' : (isSaturday ? 'bg-purple-50/75 border-purple-200' : 'glass-card');
    let dateNumColor = isSunday ? 'text-rose-600' : (isSaturday ? 'text-purple-700' : 'text-slate-900');

    calHtml += `
      <div class="main-cal-day-cell border ${dayCardStyle} shadow-2xs">
        <div>
          <div class="flex items-center justify-between pb-1 border-b border-slate-200 mb-1">
            <span class="text-xs sm:text-base md:text-xl font-black ${dateNumColor}">${d}</span>
            <span class="text-[9px] sm:text-xs font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-700">
              ${CALENDAR_HEADERS[dayOfWeek].short}
            </span>
          </div>
          <div class="space-y-0.5 sm:space-y-1">${shiftRowsHtml}</div>
        </div>
      </div>
    `;
  }

  if (calGrid) calGrid.innerHTML = calHtml;

  const statTotal = document.getElementById('dashStatTotal');
  if (statTotal) statTotal.innerText = `${totalShiftsCount} เวร`;
  const statUnassigned = document.getElementById('dashStatUnassigned');
  if (statUnassigned) statUnassigned.innerText = `${unassignedShiftsCount} เวร`;
  const statAssigned = document.getElementById('dashStatAssigned');
  if (statAssigned) statAssigned.innerText = `${assignedShiftsCount} เวร`;
  const statBookings = document.getElementById('dashStatBookings');
  if (statBookings) statBookings.innerText = `${totalBookingsCount} ครั้ง`;

  if (typeof renderPublicDashboardDailyCards === 'function') {
    renderPublicDashboardDailyCards();
  }
  updateCalendarViewDisplay();
}

window.setCalendarViewMode = function (mode) {
  calendarViewMode = mode;
  try { localStorage.setItem('nurse_cal_view_mode', mode); } catch (e) { }
  updateCalendarViewDisplay();
};

function updateCalendarViewDisplay() {
  const dailyCont = document.getElementById('mainCalendarDailyContainer');
  const gridCont = document.getElementById('mainCalendarGridContainer');
  const btnDaily = document.getElementById('calViewDailyBtn');
  const btnGrid = document.getElementById('calViewGridBtn');

  const activeBtnClass = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-blue-700 text-white shadow-xs transition cursor-pointer";
  const inactiveBtnClass = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-700 transition cursor-pointer";

  if (calendarViewMode === 'daily') {
    if (dailyCont) dailyCont.classList.remove('hidden');
    if (gridCont) gridCont.classList.add('hidden');
    if (btnDaily) btnDaily.className = activeBtnClass;
    if (btnGrid) btnGrid.className = inactiveBtnClass;
  } else {
    if (gridCont) gridCont.classList.remove('hidden');
    if (dailyCont) dailyCont.classList.add('hidden');
    if (btnGrid) btnGrid.className = activeBtnClass;
    if (btnDaily) btnDaily.className = inactiveBtnClass;
  }
}

function renderPublicDashboardDailyCards() {
  const dailyContainer = document.getElementById('mainCalendarDailyContainer');
  if (!dailyContainer) return;

  const daysCount = getDaysCount(currentYear, currentMonth);
  let html = '';

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const dayName = CALENDAR_HEADERS[dayOfWeek].th;
    let shiftRowsHtml = '';

    // 👉 ดึงเวรตามวันที่ d
    const activeShiftsThisDay = (typeof getActiveShiftsForDay === 'function')
      ? getActiveShiftsForDay(d)
      : (shiftMode === 2 ? ['M', 'A'] : ['M', 'A', 'N']);

    activeShiftsThisDay.forEach(s => {
      const shiftObj = SHIFTS[s];
      let count = 0;
      NURSES.forEach(n => {
        const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
        if (shifts.includes(s)) count++;
      });

      const isUnassigned = (count === 0);
      if (dashboardShiftFilter === 'UNASSIGNED' && !isUnassigned) return;
      if (dashboardShiftFilter === 'M' && s !== 'M') return;
      if (dashboardShiftFilter === 'A' && s !== 'A') return;
      if (dashboardShiftFilter === 'N' && s !== 'N') return;

      shiftRowsHtml += `
        <div class="flex items-center justify-between p-3 rounded-2xl border bg-white shadow-2xs cursor-pointer" onclick="handleShiftClick(${d}, '${s}')">
          <div class="flex items-center gap-2">
            <span>${shiftObj.icon}</span>
            <span class="font-bold text-xs">${shiftObj.name}</span>
          </div>
          <span class="px-2.5 py-1 rounded-xl text-xs font-black ${isUnassigned ? 'text-rose-600 bg-rose-50' : 'bg-slate-100'}">${count} คน</span>
        </div>
      `;
    });

    html += `
      <div class="glass-card rounded-3xl p-4 border shadow-sm space-y-2">
        <div class="font-bold text-sm">วันที่ ${d} (${dayName})</div>
        <div class="space-y-1.5">${shiftRowsHtml}</div>
      </div>
    `;
  }
  dailyContainer.innerHTML = html;
}

window.handleShiftClick = function (day, shift) {
  const shiftObj = SHIFTS[shift];
  const dt = new Date(currentYear, currentMonth, day);
  const dayName = CALENDAR_HEADERS[dt.getDay()].th;

  if (!currentUser) {
    openNurseLoginModal({ day, shift });
    return;
  }

  if (currentUser.role === 'admin') {
    openAdminShiftQuickManageModal(day, shift);
    return;
  }

  if (currentUser.role === 'nurse') {
    if (monthState && monthState.isConfirmed) {
      window.showToast?.("🔒 ตารางเวรได้รับการยืนยันแล้ว กรุณาเลือกเวรผ่านระบบ CF");
      if (typeof openFastClaimModal === 'function') {
        openFastClaimModal();
      }
      return;
    }

    const nurseId = currentUser.nurseId;
    const userCurrentShifts = (monthState.roster[nurseId] && monthState.roster[nurseId][day]) || [];
    const isAlreadyBooked = userCurrentShifts.includes(shift);

    activeModalShiftContext = { day, shift, nurseId, isAlreadyBooked };

    const modalIcon = document.getElementById('shiftModalIcon');
    const modalTitle = document.getElementById('shiftModalTitle');
    const modalDate = document.getElementById('shiftModalDate');

    if (modalIcon) modalIcon.innerText = shiftObj.icon;
    if (modalTitle) modalTitle.innerText = `${shiftObj.name} (${shiftObj.time})`;
    if (modalDate) modalDate.innerText = `วัน${dayName}ที่ ${day} ${THAI_MONTHS[currentMonth]} ${currentYear + 543}`;

    const bodyEl = document.getElementById('shiftModalBody');
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="p-3 rounded-2xl ${isAlreadyBooked ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-blue-50 text-blue-900 border border-blue-200'} text-xs font-semibold">
          ${isAlreadyBooked ? '✓ คุณเลือกเวรนี้ไว้แล้ว ต้องการยกเลิกหรือไม่?' : `ต้องการเลือกจอง ${shiftObj.name} ในวันนี้หรือไม่?`}
        </div>
      `;
    }

    const footerEl = document.getElementById('shiftModalFooter');
    if (footerEl) {
      footerEl.innerHTML = isAlreadyBooked ? `
        <button onclick="closeShiftActionModal()" class="flex-1 py-2 text-slate-600 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition">ปิด</button>
        <button onclick="confirmToggleShiftBooking(false)" class="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition">🗑️ ยกเลิกเวร</button>
      ` : `
        <button onclick="closeShiftActionModal()" class="flex-1 py-2 text-slate-600 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition">ยกเลิก</button>
        <button onclick="confirmToggleShiftBooking(true)" class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">✓ ยืนยันการเลือก</button>
      `;
    }

    document.getElementById('shiftActionModal')?.classList.remove('hidden');
  }
};

window.closeShiftActionModal = function () {
  document.getElementById('shiftActionModal')?.classList.add('hidden');
  activeModalShiftContext = null;
};

window.openAdminShiftQuickManageModal = function (day, shift) {
  const shiftObj = SHIFTS[shift];
  const dt = new Date(currentYear, currentMonth, day);
  const dayName = CALENDAR_HEADERS[dt.getDay()].th;

  const assignedNurses = NURSES.filter(n => (monthState.roster[n.id] && monthState.roster[n.id][day] || []).includes(shift));

  const modalIcon = document.getElementById('shiftModalIcon');
  const modalTitle = document.getElementById('shiftModalTitle');
  const modalDate = document.getElementById('shiftModalDate');

  if (modalIcon) modalIcon.innerText = shiftObj.icon;
  if (modalTitle) modalTitle.innerText = `🛡️ [Admin] จัดการ ${shiftObj.name}`;
  if (modalDate) modalDate.innerText = `วัน${dayName}ที่ ${day} ${THAI_MONTHS[currentMonth]} ${currentYear + 543} (${shiftObj.time})`;

  const bodyEl = document.getElementById('shiftModalBody');
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div class="space-y-3">
        <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div class="text-xs font-black text-slate-700 dark:text-slate-200 mb-2 flex items-center justify-between">
            <span>👥 พยาบาลที่เข้าเวรนี้ (${assignedNurses.length} ท่าน):</span>
            ${assignedNurses.length === 0 ? '<span class="text-rose-600 text-[11px] font-bold">ยังไม่มีคนเข้าเวร</span>' : ''}
          </div>
          <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
            ${assignedNurses.length > 0 ? assignedNurses.map(n => `
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-white shadow-2xs" style="background-color: ${n.color};">
                <span>#${n.num} ${n.name.split(' ')[0]}</span>
                <button type="button" onclick="adminRemoveNurseFromShift('${n.id}', ${day}, '${shift}')" class="text-white hover:text-rose-200 font-black ml-1 cursor-pointer" title="ลบออกจากเวร">✕</button>
              </span>
            `).join('') : '<span class="text-slate-400 text-xs italic">ไม่มีข้อมูลการจองในเวรนี้</span>'}
          </div>
        </div>

        <div class="p-3 bg-blue-50/70 dark:bg-slate-800/60 rounded-2xl border border-blue-200/80 dark:border-slate-700">
          <label class="block text-xs font-bold text-blue-950 dark:text-blue-300 mb-1.5">➕ เพิ่มพยาบาลเข้าเวรนี้:</label>
          <div class="flex items-center gap-2">
            <select id="adminQuickAssignNurseSelect" class="flex-1 glass-input rounded-xl p-2 text-xs font-bold outline-none text-slate-800 dark:text-slate-100 border border-slate-300 bg-white dark:bg-slate-900">
              <option value="">-- เลือกพยาบาล --</option>
              ${NURSES.map(n => {
      const isAssigned = assignedNurses.some(an => an.id === n.id);
      return `<option value="${n.id}" ${isAssigned ? 'disabled class="text-slate-400"' : ''}>#${n.num} ${n.name} ${isAssigned ? '(อยู่ในเวรแล้ว)' : ''}</option>`;
    }).join('')}
            </select>
            <button type="button" onclick="adminAddNurseToShift(${day}, '${shift}')" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer">
              เพิ่ม
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const footerEl = document.getElementById('shiftModalFooter');
  if (footerEl) {
    footerEl.innerHTML = `
      <button onclick="closeShiftActionModal()" class="flex-1 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition cursor-pointer">ปิดหน้าต่าง</button>
      ${assignedNurses.length > 0 ? `
        <button onclick="adminClearEntireShift(${day}, '${shift}')" class="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer">
          🗑️ ล้างทุกคนในเวรนี้
        </button>
      ` : ''}
    `;
  }

  document.getElementById('shiftActionModal')?.classList.remove('hidden');
};

async function autoSyncAdminChangeToSheet() {
  saveMonthState();
  const isConfirmed = !!(monthState && monthState.isConfirmed);
  const targetTable = isConfirmed ? 'confirmed_roster' : 'bookings';

  try {
    const rowsToInsert = [];
    Object.keys(monthState.roster || {}).forEach(nurseId => {
      const dayObj = monthState.roster[nurseId] || {};
      Object.keys(dayObj).forEach(day => {
        const shifts = dayObj[day] || [];
        if (shifts.length > 0) {
          rowsToInsert.push({
            year: currentYear,
            month: currentMonth,
            day: parseInt(day, 10),
            nurse_id: String(nurseId),
            shifts: shifts,
            ...(isConfirmed ? { claimed_at: new Date().toISOString() } : { updated_at: new Date().toISOString() })
          });
        }
      });
    });

    if (supabase) {
      await supabase.from(targetTable).delete().eq('year', currentYear).eq('month', currentMonth);
      if (rowsToInsert.length > 0) {
        const { error } = await supabase.from(targetTable).insert(rowsToInsert);
        if (error) throw error;
      }
    }
  } catch (e) {
    console.error("Supabase Admin auto-sync error:", e);
  }
}

window.adminAddNurseToShift = function (day, shift) {
  const sel = document.getElementById('adminQuickAssignNurseSelect');
  const nurseId = sel ? sel.value : null;
  if (!nurseId) {
    alert('กรุณาเลือกพยาบาลที่ต้องการเพิ่มเข้าเวร');
    return;
  }

  if (!monthState.roster[nurseId]) monthState.roster[nurseId] = {};
  if (!monthState.roster[nurseId][day]) monthState.roster[nurseId][day] = [];

  if (!monthState.roster[nurseId][day].includes(shift)) {
    monthState.roster[nurseId][day].push(shift);

    autoSyncAdminChangeToSheet();

    renderPublicDashboard();
    if (activeView === 'admin') renderAdminView();
    if (activeView === 'excel') renderExcelView('userExcelViewContent');
    openAdminShiftQuickManageModal(day, shift);
    window.showToast?.('✅ เพิ่มพยาบาลเข้าเวรและบันทึกลงฐานข้อมูลเรียบร้อย');
  }
};

window.adminRemoveNurseFromShift = function (nurseId, day, shift) {
  if (monthState.roster[nurseId] && monthState.roster[nurseId][day]) {
    monthState.roster[nurseId][day] = monthState.roster[nurseId][day].filter(s => s !== shift);
    if (monthState.roster[nurseId][day].length === 0) delete monthState.roster[nurseId][day];

    autoSyncAdminChangeToSheet();

    renderPublicDashboard();
    if (activeView === 'admin') renderAdminView();
    if (activeView === 'excel') renderExcelView('userExcelViewContent');
    openAdminShiftQuickManageModal(day, shift);
    window.showToast?.('🗑️ นำพยาบาลออกจากเวรและอัปเดตเรียบร้อย');
  }
};

window.adminClearEntireShift = function (day, shift) {
  if (!confirm(`คุณต้องการลบพยาบาลทุกคนออกจากเวรนี้ใช่หรือไม่?`)) return;

  NURSES.forEach(n => {
    if (monthState.roster[n.id] && monthState.roster[n.id][day]) {
      monthState.roster[n.id][day] = monthState.roster[n.id][day].filter(s => s !== shift);
      if (monthState.roster[n.id][day].length === 0) delete monthState.roster[n.id][day];
    }
  });

  autoSyncAdminChangeToSheet();

  renderPublicDashboard();
  if (activeView === 'admin') renderAdminView();
  if (activeView === 'excel') renderExcelView('userExcelViewContent');
  closeShiftActionModal();
  window.showToast?.('🗑️ เคลียร์พยาบาลออกจากเวรนี้เรียบร้อยแล้ว');
};

window.confirmToggleShiftBooking = function (addShift) {
  if (currentUser && currentUser.role === 'nurse' && monthState && monthState.isConfirmed) {
    alert("🔒 ตารางเวรประจำเดือนได้รับการยืนยันแล้ว ไม่อนุญาตให้แก้ไขหรือเพิ่มเวรปกติ\nกรุณาเข้าจองผ่าน 'ระบบ CF (Confirm) จองก่อนได้ก่อน'");
    closeShiftActionModal();
    if (typeof openFastClaimModal === 'function') {
      openFastClaimModal();
    }
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
    if (monthState.roster[nurseId][day].length === 0) delete monthState.roster[nurseId][day];
  }

  saveMonthState();
  closeShiftActionModal();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminView();
  if (activeView === 'excel') renderExcelView('userExcelViewContent');
  window.showToast?.(addShift ? '✅ เลือกเวรแล้ว (อย่าลืมกดยืนยันจองตารางเวร)' : '🗑️ ยกเลิกเวรเรียบร้อย');
};

function renderNurseCalendar() {
  if (!currentUser || currentUser.role !== 'nurse') return;
  const nurseId = currentUser.nurseId;
  const daysCount = getDaysCount(currentYear, currentMonth);
  const firstDayIndex = getFirstDayIndex(currentYear, currentMonth);
  const isConfirmed = !!(monthState && monthState.isConfirmed);

  const nurseShifts = monthState.roster[nurseId] || {};
  let countM = 0, countA = 0, countN = 0;
  for (let d = 1; d <= daysCount; d++) {
    const arr = nurseShifts[d] || [];
    if (arr.includes('M')) countM++;
    if (arr.includes('A')) countA++;
    if (arr.includes('N') && shiftMode === 3) countN++;
  }
  const totalShifts = shiftMode === 3 ? (countM + countA + countN) : (countM + countA);

  const elStatM = document.getElementById('nurseStatM');
  if (elStatM) elStatM.innerText = `${countM} ครั้ง`;
  const elStatA = document.getElementById('nurseStatA');
  if (elStatA) elStatA.innerText = `${countA} ครั้ง`;
  const elStatN = document.getElementById('nurseStatN');
  if (elStatN) elStatN.innerText = `${countN} ครั้ง`;
  const elStatTotal = document.getElementById('nurseStatTotal');
  if (elStatTotal) elStatTotal.innerText = `${totalShifts} เวร (${totalShifts * 8} ชม.)`;

  const submitBtn = document.getElementById('submitNurseBookingBtn');
  if (submitBtn) {
    if (isConfirmed) {
      submitBtn.classList.add('hidden');
    } else {
      submitBtn.classList.remove('hidden');
    }
  }

  const calHeader = document.getElementById('nurseCalendarHeader');
  if (calHeader) {
    calHeader.innerHTML = CALENDAR_HEADERS.map(ch => `
      <div class="py-1.5 px-1 sm:py-2 text-center rounded-xl sm:rounded-2xl border ${ch.headerClass} shadow-2xs flex flex-col items-center justify-center">
        <div class="text-xs sm:text-sm font-black tracking-tight leading-tight">${ch.th}</div>
        <div class="text-[9px] sm:text-[10px] font-bold opacity-80 font-mono leading-tight mt-0.5">${ch.en}</div>
      </div>
    `).join('');
  }

  const calGrid = document.getElementById('nurseCalendarGrid');
  let calHtml = '';
  for (let pad = 0; pad < firstDayIndex; pad++) {
    calHtml += `<div class="calendar-empty-cell p-1 sm:p-2 flex items-start justify-end text-slate-300 dark:text-slate-600 select-none"><span class="opacity-25 font-mono text-xs">•</span></div>`;
  }

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);
    const dateNumColor = isSunday ? 'text-rose-600 dark:text-rose-400' : (isSaturday ? 'text-purple-600 dark:text-purple-400' : 'text-slate-800 dark:text-slate-100');
    const dayCardBg = isSunday ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40' : (isSaturday ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40' : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700');

    const dayShifts = nurseShifts[d] || [];
    let shiftsHtml = '';

    if (dayShifts.length > 0) {
      shiftsHtml = `
        <div class="space-y-1.5 mt-1.5">
          ${dayShifts.map(s => {
        const shiftObj = SHIFTS[s] || { name: s, icon: '📅' };
        let badgeStyle = 'bg-slate-100 text-slate-800 border-slate-200';
        if (s === 'M') badgeStyle = 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800';
        else if (s === 'A') badgeStyle = 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800';
        else if (s === 'N') badgeStyle = 'bg-purple-50 text-purple-900 border-purple-200 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-800';

        return `
              <div class="flex items-center gap-1.5 px-2 py-1 rounded-xl text-xs font-bold border shadow-2xs ${badgeStyle}">
                <span class="text-sm shrink-0">${shiftObj.icon}</span>
                <span class="font-bold truncate text-[11px] sm:text-xs">${shiftObj.name}</span>
              </div>
            `;
      }).join('')}
        </div>
      `;
    }

    const cursorStyle = isConfirmed ? 'cursor-default opacity-95' : 'cursor-pointer hover:shadow-md';
    const clickAction = isConfirmed ? `onclick="window.showToast?.('🔒 ตารางเวรยืนยันแล้ว ไม่สามารถแก้ไขได้'); openFastClaimModal();"` : `onclick="openCellEditor('${nurseId}', ${d})"`;
    const titleText = isConfirmed ? `ตารางเวรยืนยันแล้ว (คลิกเพื่อเปิดระบบ CF)` : `คลิกเพื่อแก้ไขหรือจองเวรวันที่ ${d}`;

    calHtml += `
      <div class="calendar-day-cell p-2 sm:p-2.5 rounded-2xl border ${dayCardBg} shadow-2xs transition flex flex-col justify-between ${cursorStyle}"
           ${clickAction}
           title="${titleText}">
        <div>
          <div class="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700/50 mb-1">
            <span class="text-base sm:text-lg md:text-xl font-black ${dateNumColor}">${d}</span>
            <span class="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
              ${CALENDAR_HEADERS[dayOfWeek].short}
            </span>
          </div>
          ${shiftsHtml}
        </div>
      </div>
    `;
  }

  if (calGrid) calGrid.innerHTML = calHtml;
  updatePendingShiftBadgeUI();
  updatePersonalCfBannerBtn();
}

function updateAdminSubViewButtons(activeSub) {
  const tabMap = {
    matrix: 'viewMatrixBtn',
    excel: 'viewExcelBtn',
    daily: 'viewDailyBtn',
    summary: 'viewSummaryBtn',
    vacancies: 'viewVacanciesBtn',
    chart: 'viewChartBtn'
  };

  const activeClass = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-700 text-white shadow-xs transition";
  const inactiveClass = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition";

  Object.entries(tabMap).forEach(([subKey, btnId]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.className = (subKey === activeSub) ? activeClass : inactiveClass;
    }
  });
}

function renderAdminView() {
  const isConfirmed = !!(monthState && monthState.isConfirmed);
  const optBtn = document.getElementById('adminOptimizeBtn');
  const unconfirmBtn = document.getElementById('adminUnconfirmBtn');
  if (optBtn && unconfirmBtn) {
    optBtn.classList.toggle('hidden', isConfirmed);
    unconfirmBtn.classList.toggle('hidden', !isConfirmed);
  }
  renderAdminSubView();
}

function renderAdminSubView() {
  updateAdminSubViewButtons(adminActiveSubView);

  ['matrix', 'excel', 'daily', 'summary', 'vacancies', 'chart'].forEach(v => {
    const sec = document.getElementById(`${v}ViewSection`);
    if (sec) sec.classList.toggle('hidden', v !== adminActiveSubView);
  });

  if (adminActiveSubView === 'matrix') renderMatrix();
  if (adminActiveSubView === 'excel') renderExcelView();
  if (adminActiveSubView === 'daily') renderDailyView();
  if (adminActiveSubView === 'summary') renderSummaryView();
  if (adminActiveSubView === 'vacancies') renderAdminVacanciesView();
  if (adminActiveSubView === 'chart') renderDutyChart();
}

function renderMatrix() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  const thead = document.getElementById('matrixHeader');
  const tbody = document.getElementById('matrixBody');
  const tfoot = document.getElementById('matrixFooter');

  // 1. หัวตาราง (Thead)
  let h = `<tr>
    <th class="sticky-col-1 bg-slate-100 py-3 px-2 text-center w-10 border-r border-slate-300">#</th>
    <th class="sticky-col-2 bg-slate-100 py-3 px-3 text-left w-24 font-mono border-r border-slate-300">รหัส</th>
    <th class="sticky-col-3 bg-slate-100 py-3 px-4 text-left w-48 border-r-2 border-slate-300 whitespace-nowrap">ชื่อ - สกุล</th>`;

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);

    // โทนสีหัวตาราง: วันอาทิตย์ (ส้ม/แดง), วันเสาร์ (ม่วง)
    let thClass = isSunday
      ? 'bg-rose-100 text-rose-800 border-rose-300'
      : (isSaturday ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-slate-100 text-slate-700');

    h += `<th class="p-1.5 text-center min-w-[38px] border-r border-slate-200 ${thClass}">
      <div class="font-extrabold text-xs">${d}</div>
      <div class="text-[10px] font-bold opacity-80">${CALENDAR_HEADERS[dayOfWeek].short}</div>
    </th>`;
  }

  h += `
    <th class="py-3 px-2 text-center bg-sky-100 text-sky-900 border-l-2 border-slate-300 font-bold">ช</th>
    <th class="py-3 px-2 text-center bg-amber-100 text-amber-900 border-l border-slate-300 font-bold">บ</th>
    ${(typeof monthHasNightShift === 'function' ? monthHasNightShift() : shiftMode === 3) ? '<th class="py-3 px-2 text-center bg-purple-100 text-purple-900 border-l border-slate-300 font-bold">ด</th>' : ''}
    <th class="py-3 px-2 text-center bg-blue-100 text-blue-950 border-l border-slate-300 font-extrabold">รวม</th>
  </tr>`;
  if (thead) thead.innerHTML = h;

  // 2. เนื้อหาตารางรายคน (Tbody)
  let b = '';
  NURSES.forEach((nurse, idx) => {
    const nurseShifts = monthState.roster[nurse.id] || {};
    let countM = 0, countA = 0, countN = 0;
    const isEvenRow = (idx % 2 === 1);
    const rowClass = isEvenRow ? 'matrix-row matrix-row-even' : 'matrix-row matrix-row-odd';
    const stickyBg = 'matrix-sticky-cell font-medium';

    b += `<tr class="${rowClass} transition border-b border-slate-200">
      <td class="sticky-col-1 ${stickyBg} py-2 px-2 text-center border-r border-slate-200">
        <span class="nurse-num-badge w-6 h-6 text-xs font-black inline-flex items-center justify-center rounded-lg" style="background-color: ${nurse.color}; color: ${nurse.textColor};" title="หมายเลข ${nurse.num}">
          ${nurse.num}
        </span>
      </td>
      <td class="sticky-col-2 ${stickyBg} py-2.5 px-3 font-mono font-bold text-blue-900 border-r border-slate-200">${nurse.id}</td>
      <td class="sticky-col-3 ${stickyBg} py-2.5 px-3 text-slate-800 border-r-2 border-slate-300 whitespace-nowrap font-bold">${nurse.name}</td>`;

    for (let d = 1; d <= daysCount; d++) {
      const dt = new Date(currentYear, currentMonth, d);
      const dayOfWeek = dt.getDay();
      const isSunday = (dayOfWeek === 0);
      const isSaturday = (dayOfWeek === 6);

      // 👉 ใส่สีคอลัมน์เสาร์/อาทิตย์ตามสีหัววัน (วันเสาร์ = ม่วง, วันอาทิตย์ = แดง/กุหลาบ)
      let colWeekendClass = '';
      if (isSunday) {
        colWeekendClass = 'sunday-cell';
      } else if (isSaturday) {
        colWeekendClass = 'saturday-cell';
      }

      const dayShifts = nurseShifts[d] || [];
      let tags = '';
      dayShifts.forEach(s => {
        if (s === 'M') { countM++; tags += `<span class="shift-tag shift-m">ช</span>`; }
        if (s === 'A') { countA++; tags += `<span class="shift-tag shift-a">บ</span>`; }
        if (s === 'N') { countN++; tags += `<span class="shift-tag shift-n">ด</span>`; }
      });

      b += `<td class="p-1 text-center border-r border-slate-200 cursor-pointer transition ${colWeekendClass}" onclick="openCellEditor('${nurse.id}', ${d})">
        <div class="min-h-[26px] flex items-center justify-center gap-0.5 flex-wrap">
          ${tags || '<span class="text-slate-300 text-[10px] font-bold hover:text-blue-600">+</span>'}
        </div>
      </td>`;
    }

    const hasNight = (typeof monthHasNightShift === 'function' ? monthHasNightShift() : shiftMode === 3);
    const total = hasNight ? (countM + countA + countN) : (countM + countA);

    const styleM = countM === 0 ? 'bg-rose-100/90 text-rose-600 font-black' : 'text-sky-800 font-bold';
    const styleA = countA === 0 ? 'bg-rose-100/90 text-rose-600 font-black' : 'text-amber-800 font-bold';
    const styleN = countN === 0 ? 'bg-rose-100/90 text-rose-600 font-black' : 'text-purple-800 font-bold';
    const styleTotal = total === 0 ? 'bg-rose-200 text-rose-700 font-black ring-1 ring-rose-400 inset-0' : 'bg-blue-50/50 text-blue-950 font-black';

    b += `
      <td class="py-2 px-1 text-center border-l-2 border-slate-300 ${styleM}">${countM}</td>
      <td class="py-2 px-1 text-center border-l border-slate-300 ${styleA}">${countA}</td>
      ${hasNight ? `<td class="py-2 px-1 text-center border-l border-slate-300 ${styleN}">${countN}</td>` : ''}
      <td class="py-2 px-1 text-center border-l border-slate-300 ${styleTotal}">${total}</td>
    </tr>`;
  });
  if (tbody) tbody.innerHTML = b;

  // 3. ท้ายตาราง สรุปยอดเวรต่อวัน (Tfoot)
  let f = `<tr>
    <td colspan="3" class="sticky-col-1 bg-slate-100 py-2.5 px-3 font-bold text-slate-800 text-right border-r-2 border-slate-300">
      จำนวนเวรรวมต่อวัน:
    </td>`;

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isSunday = (dayOfWeek === 0);
    const isSaturday = (dayOfWeek === 6);

    // 👉 พื้นหลังช่องสรุปของเสาร์/อาทิตย์
    let footBg = 'bg-slate-50';
    if (isSunday) footBg = 'bg-rose-100/50 text-rose-900';
    else if (isSaturday) footBg = 'bg-purple-100/50 text-purple-900';

    const dayShiftsAllowed = (typeof getActiveShiftsForDay === 'function')
      ? getActiveShiftsForDay(d)
      : ['M', 'A', 'N'];

    let dayM = 0, dayA = 0, dayN = 0;
    NURSES.forEach(n => {
      const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
      if (shifts.includes('M')) dayM++;
      if (shifts.includes('A')) dayA++;
      if (shifts.includes('N')) dayN++;
    });

    const textDayM = dayM === 0
      ? `<span class="inline-block px-1 rounded bg-rose-200 text-rose-700 font-black">ช: 0</span>`
      : `<span>ช: ${dayM}</span>`;

    const textDayA = dayA === 0
      ? `<span class="inline-block px-1 rounded bg-rose-200 text-rose-700 font-black">บ: 0</span>`
      : `<span>บ: ${dayA}</span>`;

    const textDayN = dayShiftsAllowed.includes('N')
      ? (dayN === 0
        ? `<span class="inline-block px-1 rounded bg-rose-200 text-rose-700 font-black">ด: 0</span>`
        : `<span>ด: ${dayN}</span>`)
      : '';

    f += `<td class="p-1 text-center border-r border-slate-200 text-[10px] space-y-0.5 ${footBg}">
      <div>${textDayM}</div>
      <div>${textDayA}</div>
      ${textDayN ? `<div>${textDayN}</div>` : ''}
    </td>`;
  }

  const hasNight = (typeof monthHasNightShift === 'function' ? monthHasNightShift() : shiftMode === 3);
  f += `<td colspan="${hasNight ? 4 : 3}" class="p-2 text-center text-xs text-slate-500 border-l-2 border-slate-300">รวมทั้งแผนก</td></tr>`;
  if (tfoot) tfoot.innerHTML = f;
}

function renderNurseCardsModern(containerId = 'summaryNurseCardsContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const daysCount = getDaysCount(currentYear, currentMonth);

  const isAdmin = !!(currentUser && currentUser.role === 'admin');
  const isConfirmed = !!(monthState && monthState.isConfirmed);
  const shouldShowCount = isAdmin || isConfirmed;

  const nurseShiftCounts = {};
  NURSES.forEach(n => {
    let count = 0;
    const sObj = (monthState.roster && monthState.roster[n.id]) || {};
    for (let d = 1; d <= daysCount; d++) {
      count += (Array.isArray(sObj[d]) ? sObj[d].length : 0);
    }
    nurseShiftCounts[n.id] = count;
  });

  const half = Math.ceil(NURSES.length / 2);
  const col1 = NURSES.slice(0, half);
  const col2 = NURSES.slice(half);

  const renderCol = (list) => list.map(n => `
    <div class="nurse-card-modern flex items-center justify-between gap-3 p-3">
      <div class="flex items-center gap-3 min-w-0">
        <span class="font-mono text-slate-500 font-bold text-xs w-16 shrink-0">${n.id}</span>
        <span class="nurse-num-badge w-8 h-8 rounded-xl text-sm font-black shrink-0" style="background-color: ${n.color}; color: ${n.textColor};">
          ${n.num}
        </span>
        <span class="font-bold text-slate-800 text-xs sm:text-sm truncate">${n.name}</span>
      </div>
      <div class="shrink-0">
        ${shouldShowCount ? `
          <span class="px-3 py-1 rounded-xl text-xs font-black shadow-xs" style="background-color: ${n.bgSoft}; color: ${n.color}; border: 1px solid ${n.border};">
            ${nurseShiftCounts[n.id]}
          </span>
        ` : `
          <span class="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200" title="รอสรุปหลังจัดเวร">
            -
          </span>
        `}
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="glass-card rounded-3xl p-5 md:p-6 border border-white/80 shadow-md">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <span class="font-black text-xs text-blue-900">🎴 หมายเลข และ รายชื่อพยาบาล</span>
        <span class="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">พยาบาล ${NURSES.length} ท่าน</span>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="space-y-2.5">${renderCol(col1)}</div>
        <div class="space-y-2.5">${renderCol(col2)}</div>
      </div>
    </div>
  `;
}

function renderExcelView(targetContainerId = 'excelRosterContainer') {
  const container = document.getElementById(targetContainerId);
  if (!container) return;

  const daysCount = getDaysCount(currentYear, currentMonth);
  const monthTitle = `ตารางเวรพยาบาล ประจำเดือน ${THAI_MONTHS[currentMonth]} ${currentYear + 543}`;
  const isConfirmed = !!(monthState && monthState.isConfirmed);

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

  // กำหนดแถวเวรที่ต้องแสดงผล: ถ้าเป็นโหมด 2 เวรจะมีแค่ M, A แต่ถ้าเป็นโหมด 3 เวรหรือ custom ให้แสดงแถว N ด้วย
  const hasNightInMonth = (typeof monthHasNightShift === 'function')
    ? monthHasNightShift()
    : (shiftMode !== 2);

  const shiftDefs = !hasNightInMonth
    ? [{ key: 'M', name: 'เช้า', time: '08.30-16.30', icon: '☀️' }, { key: 'A', name: 'บ่าย', time: '16.30-00.30', icon: '⛅' }]
    : [{ key: 'M', name: 'เช้า', time: '08.30-16.30', icon: '☀️' }, { key: 'A', name: 'บ่าย', time: '16.30-00.30', icon: '⛅' }, { key: 'N', name: 'ดึก', time: '00.30-08.30', icon: '🌙' }];

  let tbodyRowsHtml = '';
  shiftDefs.forEach(sDef => {
    let dayTds = '';
    for (let d = 1; d <= daysCount; d++) {
      let cellContent = '-';
      let cellBgClass = '';

      // =========================================================================
      // 👉 ข้อ 2.5: ตรวจสอบเวรรายวัน หากเป็นเวรดึก (N) แต่วันนั้นยังไม่เริ่มมีเวรดึก ให้ปิดช่องเป็นแถบทึบ (-)
      // =========================================================================
      const dayShifts = (typeof getActiveShiftsForDay === 'function')
        ? getActiveShiftsForDay(d)
        : (shiftMode === 2 ? ['M', 'A'] : ['M', 'A', 'N']);

      if (sDef.key === 'N' && !dayShifts.includes('N')) {
        cellContent = '<span class="text-slate-300 dark:text-slate-600 font-bold">-</span>';
        cellBgClass = 'bg-slate-100/70 dark:bg-slate-800/60 select-none';
      } else if (isConfirmed) {
        const assigned = NURSES.filter(n => (monthState.roster[n.id] && monthState.roster[n.id][d] || []).includes(sDef.key));
        if (assigned.length > 0) {
          cellContent = assigned.map(n => `
            <span class="nurse-num-badge w-7 h-7 text-xs font-black shadow-xs inline-flex items-center justify-center rounded-lg" style="background-color: ${n.color}; color: ${n.textColor};">
              ${n.num}
            </span>
          `).join(' ');
        } else {
          cellContent = '<span class="text-rose-500 font-bold text-xs">ว่าง</span>';
        }
      }

      dayTds += `<td class="p-1 text-center border border-slate-300 ${cellBgClass}">${cellContent}</td>`;
    }

    tbodyRowsHtml += `
      <tr>
        <td class="py-2.5 px-3 font-bold text-xs border border-slate-300 bg-slate-50">${sDef.icon} ${sDef.name}</td>
        <td class="py-2.5 px-3 font-mono text-xs border border-slate-300 bg-slate-50">${sDef.time}</td>
        ${dayTds}
      </tr>
    `;
  });

  const cardsContainerId = `${targetContainerId}_cards`;
  container.innerHTML = `
    <div class="glass-card rounded-3xl p-5 md:p-6 border border-white/80 shadow-md">
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <h3 class="text-lg font-black text-slate-900">${monthTitle}</h3>
        <button onclick="exportRoster()" class="px-4 py-2 bg-white border border-slate-300 text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:bg-slate-50 transition">📊 ส่งออก Excel</button>
      </div>
      <div class="overflow-x-auto rounded-2xl border border-slate-300 shadow-xs mb-4">
        <table class="min-w-full text-xs text-left border-collapse bg-white">
          <thead class="bg-slate-100 font-bold border-b border-slate-300">
            <tr>
              <th class="py-2.5 px-3 border border-slate-300">เวร</th>
              <th class="py-2.5 px-3 border border-slate-300">เวลา</th>
              ${thDaysHtml}
            </tr>
          </thead>
          <tbody>${tbodyRowsHtml}</tbody>
        </table>
      </div>
    </div>
    <div id="${cardsContainerId}"></div>
  `;
  renderNurseCardsModern(cardsContainerId);
}

function renderDailyView() {
  const container = document.getElementById('dailyCardsContainer');
  if (!container) return;
  const daysCount = getDaysCount(currentYear, currentMonth);
  let html = '';

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayName = CALENDAR_HEADERS[dt.getDay()].th;
    const mNurses = [], aNurses = [], nNurses = [];

    NURSES.forEach(n => {
      const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
      if (shifts.includes('M')) mNurses.push(n.name);
      if (shifts.includes('A')) aNurses.push(n.name);
      if (shifts.includes('N') && shiftMode === 3) nNurses.push(n.name);
    });

    html += `
      <div class="glass-card rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
        <div class="font-bold text-sm">วันที่ ${d} (${dayName})</div>
        <div class="p-2 bg-sky-50 rounded-xl">☀️ เช้า: ${mNurses.join(', ') || '-'}</div>
        <div class="p-2 bg-amber-50 rounded-xl">⛅ บ่าย: ${aNurses.join(', ') || '-'}</div>
        ${shiftMode === 3 ? `<div class="p-2 bg-purple-50 rounded-xl">🌙 ดึก: ${nNurses.join(', ') || '-'}</div>` : ''}
      </div>
    `;
  }
  container.innerHTML = html;
}

function renderSummaryView() {
  renderNurseCardsModern('summaryNurseCardsContainer');
  const tbody = document.getElementById('summaryTableBody');
  if (!tbody) return;
  const daysCount = getDaysCount(currentYear, currentMonth);
  let html = '';

  NURSES.forEach(nurse => {
    let m = 0, a = 0, n = 0;
    const shiftsObj = monthState.roster[nurse.id] || {};
    for (let d = 1; d <= daysCount; d++) {
      const arr = shiftsObj[d] || [];
      if (arr.includes('M')) m++;
      if (arr.includes('A')) a++;
      if (arr.includes('N') && shiftMode === 3) n++;
    }
    const total = shiftMode === 3 ? (m + a + n) : (m + a);

    html += `
      <tr class="border-b border-slate-200 hover:bg-slate-50 text-xs">
        <td class="p-2.5 text-center font-bold">${nurse.num}</td>
        <td class="p-2.5 font-mono">${nurse.id}</td>
        <td class="p-2.5 font-bold">${nurse.name}</td>
        <td class="p-2.5 text-center text-sky-800">${m}</td>
        <td class="p-2.5 text-center text-amber-800">${a}</td>
        ${shiftMode === 3 ? `<td class="p-2.5 text-center text-purple-800">${n}</td>` : ''}
        <td class="p-2.5 text-center font-black">${total}</td>
        <td class="p-2.5 text-center font-bold text-emerald-800">${total * 8} ชม.</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function renderAdminVacanciesView() {
  const container = document.getElementById('adminVacanciesList');
  if (!container) return;
  const daysCount = getDaysCount(currentYear, currentMonth);
  const unassigned = [];

  for (let d = 1; d <= daysCount; d++) {
    getActiveShifts().forEach(s => {
      const assigned = NURSES.filter(n => (monthState.roster[n.id] && monthState.roster[n.id][d] || []).includes(s));
      if (assigned.length === 0) unassigned.push({ day: d, shift: s });
    });
  }

  if (unassigned.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-emerald-700 bg-emerald-50 rounded-2xl font-bold">🎉 ทุกเวรมีพยาบาลเลือกครบถ้วน</div>`;
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      ${unassigned.map(u => `
        <div class="p-3 bg-white border border-rose-200 rounded-xl text-xs space-y-1">
          <div class="font-bold">วันที่ ${u.day}</div>
          <div class="text-rose-600 font-bold">${SHIFTS[u.shift].name} (ว่าง 0 คน)</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderDutyChart() {
  if (typeof setDutyChartMode === 'function') {
    const btnMap = {
      all: 'btnChartCompareAll',
      individual: 'btnChartIndividual',
      cumulative: 'btnChartCumulative'
    };
    const activeClass = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs transition cursor-pointer";
    const inactiveClass = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition cursor-pointer";
    Object.entries(btnMap).forEach(([key, btnId]) => {
      const btn = document.getElementById(btnId);
      if (btn) btn.className = (key === currentDutyChartMode) ? activeClass : inactiveClass;
    });
  }

  const canvas = document.getElementById('dutyChartCanvas');
  if (!canvas || typeof Chart === 'undefined') return;

  if (dutyChartInstance) {
    dutyChartInstance.destroy();
    dutyChartInstance = null;
  }

  const daysCount = getDaysCount(currentYear, currentMonth);
  const labels = NURSES.map(n => `#${n.num} ${n.name.split(' ')[0]}`);
  const dataM = [], dataA = [], dataN = [];

  NURSES.forEach(n => {
    let m = 0, a = 0, nt = 0;
    const sObj = monthState.roster[n.id] || {};
    for (let d = 1; d <= daysCount; d++) {
      const arr = sObj[d] || [];
      if (arr.includes('M')) m++;
      if (arr.includes('A')) a++;
      if (arr.includes('N') && shiftMode === 3) nt++;
    }
    dataM.push(m);
    dataA.push(a);
    dataN.push(nt);
  });

  const ctx = canvas.getContext('2d');
  dutyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'เวรเช้า (M)', data: dataM, backgroundColor: '#0284c7' },
        { label: 'เวรบ่าย (A)', data: dataA, backgroundColor: '#f59e0b' },
        ...(shiftMode === 3 ? [{ label: 'เวรดึก (N)', data: dataN, backgroundColor: '#8b5cf6' }] : [])
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
    }
  });
}

let currentDutyChartMode = 'all';

window.setDutyChartMode = function (mode) {
  currentDutyChartMode = mode;

  const btnMap = {
    all: 'btnChartCompareAll',
    individual: 'btnChartIndividual',
    cumulative: 'btnChartCumulative'
  };

  const activeClass = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs transition cursor-pointer";
  const inactiveClass = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition cursor-pointer";

  Object.entries(btnMap).forEach(([key, btnId]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.className = (key === mode) ? activeClass : inactiveClass;
    }
  });

  if (typeof renderDutyChart === 'function') {
    renderDutyChart();
  }
};

// 1. ฟังก์ชันอัปเดตสีพื้นหลังและการเรืองแสงของการ์ดตามสถานะ Checkbox
function updateCellEditCardHighlight() {
  const shiftConfigs = [
    {
      cbId: 'cellShiftM',
      activeClasses: ['border-sky-400', 'dark:border-sky-500', 'bg-sky-100/70', 'dark:bg-sky-950/40', 'ring-2', 'ring-sky-300/40']
    },
    {
      cbId: 'cellShiftA',
      activeClasses: ['border-amber-400', 'dark:border-amber-500', 'bg-amber-100/70', 'dark:bg-amber-950/40', 'ring-2', 'ring-amber-300/40']
    },
    {
      cbId: 'cellShiftN',
      activeClasses: ['border-purple-400', 'dark:border-purple-500', 'bg-purple-100/70', 'dark:bg-purple-950/40', 'ring-2', 'ring-purple-300/40']
    }
  ];

  shiftConfigs.forEach(({ cbId, activeClasses }) => {
    const cb = document.getElementById(cbId);
    const card = cb?.closest('label');
    if (card && cb) {
      if (cb.checked) {
        card.classList.add(...activeClasses);
      } else {
        card.classList.remove(...activeClasses);
      }
    }
  });
}

// 2. ดักจับเหตุการณ์คลิกเปลี่ยน Checkbox ให้การ์ดเรืองแสงทันที
['cellShiftM', 'cellShiftA', 'cellShiftN'].forEach(id => {
  document.getElementById(id)?.addEventListener('change', updateCellEditCardHighlight);
});

// 3. ฟังก์ชัน openCellEditor เดิม (เพิ่ม updateCellEditCardHighlight() ก่อนเปิด Modal)
window.openCellEditor = function (nurseId, day) {
  if (currentUser && currentUser.role === 'nurse' && monthState && monthState.isConfirmed) {
    window.showToast?.("🔒 ตารางเวรยืนยันแล้ว กรุณาเลือกเวรผ่านระบบ CF");
    if (typeof openFastClaimModal === 'function') {
      openFastClaimModal();
    }
    return;
  }

  activeEditNurseId = nurseId;
  activeEditDay = day;
  const nurse = NURSES.find(n => n.id === nurseId);

  const nameEl = document.getElementById('cellEditNurseName');
  const dateEl = document.getElementById('cellEditDateText');
  if (nameEl && nurse) nameEl.innerText = `${nurse.name} (${nurse.id})`;
  if (dateEl) dateEl.innerText = `วันที่ ${day} ${THAI_MONTHS[currentMonth]}`;

  const currentShifts = (monthState.roster && monthState.roster[nurseId] && (monthState.roster[nurseId][day] || monthState.roster[nurseId][String(day)])) || [];

  const cbM = document.getElementById('cellShiftM');
  const cbA = document.getElementById('cellShiftA');
  const cbN = document.getElementById('cellShiftN');

  if (cbM) cbM.checked = currentShifts.includes('M');
  if (cbA) cbA.checked = currentShifts.includes('A');
  if (cbN) cbN.checked = currentShifts.includes('N');

  // =========================================================================
  // 👉 ข้อ 2.3: ตรวจสอบรายการเวรที่เปิดในวันนั้น หากไม่มีเวรดึก (N) ให้ซ่อนและเคลียร์ค่า
  // =========================================================================
  const dayAvailableShifts = (typeof getActiveShiftsForDay === 'function')
    ? getActiveShiftsForDay(day)
    : (shiftMode === 2 ? ['M', 'A'] : ['M', 'A', 'N']);

  const cellShiftNCont = document.getElementById('cellShiftNContainer');
  if (cellShiftNCont) {
    const hasNightThisDay = dayAvailableShifts.includes('N');
    cellShiftNCont.style.display = hasNightThisDay ? 'flex' : 'none';
    if (!hasNightThisDay && cbN) {
      cbN.checked = false;
    }
  }

  // อัปเดตไฮไลต์การ์ดตามค่า Checkbox ทันทีก่อนที่โมดอลจะแสดงผล
  if (typeof updateCellEditCardHighlight === 'function') {
    updateCellEditCardHighlight();
  }

  document.getElementById('cellEditModal')?.classList.remove('hidden');
};

function closeCellEditor() {
  document.getElementById('cellEditModal')?.classList.add('hidden');
  activeEditNurseId = null;
  activeEditDay = null;
}
window.closeCellEditor = closeCellEditor;

function saveCellEditor() {
  if (!activeEditNurseId || !activeEditDay) return;

  const newShifts = [];
  if (document.getElementById('cellShiftM')?.checked) newShifts.push('M');
  if (document.getElementById('cellShiftA')?.checked) newShifts.push('A');
  if (shiftMode === 3 && document.getElementById('cellShiftN')?.checked) newShifts.push('N');

  if (!monthState.roster) monthState.roster = {};
  if (!monthState.roster[activeEditNurseId]) monthState.roster[activeEditNurseId] = {};

  if (newShifts.length > 0) {
    monthState.roster[activeEditNurseId][activeEditDay] = newShifts;
  } else {
    delete monthState.roster[activeEditNurseId][activeEditDay];
    delete monthState.roster[activeEditNurseId][String(activeEditDay)];
  }

  saveMonthState();
  closeCellEditor();

  renderNurseCalendar();
  renderPublicDashboard();
  if (typeof renderMatrix === 'function') renderMatrix();
  if (typeof renderAdminView === 'function' && activeView === 'admin') renderAdminView();
  if (typeof renderExcelView === 'function') renderExcelView('userExcelViewContent');
  if (typeof updatePendingShiftBadgeUI === 'function') updatePendingShiftBadgeUI();

  window.showToast?.('💾 อัปเดตเวรแล้ว (อย่าลืมกดปุ่ม "ยืนยันจองตารางเวร")');
}
window.saveCellEditor = saveCellEditor;

function clearCellShifts() {
  if (activeEditNurseId && activeEditDay && monthState.roster && monthState.roster[activeEditNurseId]) {
    delete monthState.roster[activeEditNurseId][activeEditDay];
    delete monthState.roster[activeEditNurseId][String(activeEditDay)];
  }

  saveMonthState();
  closeCellEditor();

  renderNurseCalendar();
  renderPublicDashboard();
  if (typeof renderMatrix === 'function') renderMatrix();
  if (typeof renderAdminView === 'function' && activeView === 'admin') renderAdminView();
  if (typeof renderExcelView === 'function') renderExcelView('userExcelViewContent');
  if (typeof updatePendingShiftBadgeUI === 'function') updatePendingShiftBadgeUI();

  window.showToast?.('🗑️ ลบเวรในวันนี้เรียบร้อยแล้ว');
}
window.clearCellShifts = clearCellShifts;

function openBookingModal() {
  if (currentUser && currentUser.role === 'nurse' && monthState && monthState.isConfirmed) {
    alert("🔒 ตารางเวรประจำเดือนได้รับการยืนยันแล้ว ไม่สามารถจองปกติได้\nกรุณาเข้าจองผ่าน 'ระบบ CF (Confirm) จองก่อนได้ก่อน'");
    if (typeof openFastClaimModal === 'function') {
      openFastClaimModal();
    }
    return;
  }

  const modal = document.getElementById('bookingModal');
  const sel = document.getElementById('modalNurseSelect');

  if (sel) {
    if (currentUser && currentUser.role === 'nurse') {
      const nurse = NURSES.find(n => n.id === currentUser.nurseId);
      sel.innerHTML = `<option value="${nurse.id}">[#${nurse.num}] ${nurse.name} (${nurse.id})</option>`;
      sel.value = currentUser.nurseId;
      sel.disabled = true;
      sel.classList.add('bg-slate-100', 'cursor-not-allowed', 'opacity-85');
    } else {
      sel.disabled = false;
      sel.classList.remove('bg-slate-100', 'cursor-not-allowed', 'opacity-85');
      sel.innerHTML = '<option value="">-- กรุณาเลือกพยาบาล --</option>' +
        NURSES.map(n => `<option value="${n.id}">[#${n.num}] ${n.name} (${n.id})</option>`).join('');
    }
  }

  renderBookingModalDates();
  if (modal) modal.classList.remove('hidden');
}

window.openBookingModal = openBookingModal;
window.openPersonalBookingModal = openBookingModal;

function renderBookingModalDates() {
  const container = document.getElementById('modalDateSelector');
  if (!container) return;

  const daysCount = getDaysCount(currentYear, currentMonth);
  const firstDayIndex = getFirstDayIndex(currentYear, currentMonth);
  let html = '';

  html += `<div class="col-span-7 grid grid-cols-7 gap-1.5 pb-1 mb-1 border-b border-slate-200 dark:border-slate-700">`;
  CALENDAR_HEADERS.forEach(ch => {
    const isWk = ch.isWeekend ? (ch.short === 'อา.' ? 'text-rose-600 dark:text-rose-400' : 'text-purple-600 dark:text-purple-400') : 'text-slate-600 dark:text-slate-300';
    html += `<div class="text-center text-[10px] sm:text-xs font-bold ${isWk}">${ch.short}</div>`;
  });
  html += `</div>`;

  for (let p = 0; p < firstDayIndex; p++) {
    html += `<div class="p-1 min-h-[46px] rounded-xl bg-slate-100/40 dark:bg-slate-800/20 opacity-30 select-none"></div>`;
  }

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    let weekendClass = '';
    if (dayOfWeek === 0) weekendClass = 'is-weekend is-sunday';
    else if (dayOfWeek === 6) weekendClass = 'is-weekend is-saturday';

    html += `
      <div class="booking-date-btn ${weekendClass}" onclick="toggleBookingDateCard(this)">
        <input type="checkbox" name="bookingDays" value="${d}" class="sr-only">
        <span class="text-[10px] font-semibold opacity-70 leading-none">${CALENDAR_HEADERS[dayOfWeek].short}</span>
        <span class="text-sm sm:text-base font-black leading-tight my-0.5">${d}</span>
        <span class="date-check-badge">✓</span>
      </div>
    `;
  }
  container.innerHTML = html;

  const btn = document.getElementById('selectAllDatesBtn');
  if (btn) btn.innerText = 'เลือกทั้งหมด';
}

window.toggleBookingDateCard = function (el) {
  const cb = el.querySelector('input[type="checkbox"]');
  if (cb) {
    cb.checked = !cb.checked;
    if (cb.checked) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  }
};

window.toggleSelectAllDates = function () {
  const cards = document.querySelectorAll('#modalDateSelector .booking-date-btn');
  const allChecked = Array.from(cards).every(c => c.classList.contains('selected'));
  cards.forEach(card => {
    const cb = card.querySelector('input[type="checkbox"]');
    if (allChecked) {
      card.classList.remove('selected');
      if (cb) cb.checked = false;
    } else {
      card.classList.add('selected');
      if (cb) cb.checked = true;
    }
  });
  const btn = document.getElementById('selectAllDatesBtn');
  if (btn) btn.innerText = allChecked ? 'เลือกทั้งหมด' : 'ยกเลิกทั้งหมด';
};

function closeBookingModal() { document.getElementById('bookingModal')?.classList.add('hidden'); }
window.closeBookingModal = closeBookingModal;

function handleQuickBookingSubmit(e) {
  if (e) e.preventDefault();
  const sel = document.getElementById('modalNurseSelect');

  let nurseId = '';
  if (currentUser && currentUser.role === 'nurse') {
    nurseId = currentUser.nurseId;
  } else if (sel) {
    nurseId = sel.value;
  }

  if (!nurseId) {
    alert('กรุณาเลือกพยาบาลผู้จอง');
    return;
  }

  const selectedShifts = Array.from(document.querySelectorAll('input[name="modalShift"]:checked')).map(cb => cb.value);
  if (selectedShifts.length === 0) {
    alert('กรุณาเลือกเวรอย่างน้อย 1 เวร (เช้า, บ่าย หรือดึก)');
    return;
  }

  const selectedDays = Array.from(document.querySelectorAll('input[name="bookingDays"]:checked')).map(cb => parseInt(cb.value, 10));
  if (selectedDays.length === 0) {
    alert('กรุณาเลือกวันที่ต้องการจองอย่างน้อย 1 วัน');
    return;
  }

  if (!monthState.roster) monthState.roster = {};
  if (!monthState.roster[nurseId]) monthState.roster[nurseId] = {};

  selectedDays.forEach(day => {
    if (!monthState.roster[nurseId][day]) monthState.roster[nurseId][day] = [];
    selectedShifts.forEach(shift => {
      if (!monthState.roster[nurseId][day].includes(shift)) {
        monthState.roster[nurseId][day].push(shift);
      }
    });
  });

  if (currentUser && currentUser.role === 'admin') {
    hasAdminUnsavedChanges = true;
  }

  saveMonthState();
  closeBookingModal();

  renderMatrix();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminView();
  if (activeView === 'excel') renderExcelView('userExcelViewContent');

  const submitBtn = document.getElementById('adminSubmitRosterBtn');
  if (submitBtn) {
    submitBtn.classList.add('ring-4', 'ring-amber-400', 'animate-pulse');
  }

  window.showToast?.('✅ เลือกเวรเรียบร้อย (อย่าลืมกดปุ่ม "ยืนยันจองตารางเวร" สีเขียวด้านบน)');
}

window.handleQuickBookingSubmit = handleQuickBookingSubmit;

function updatePendingShiftBadgeUI() {
  const submitBtn = document.getElementById('submitNurseBookingBtn');
  const submitBadge = document.getElementById('submitBtnPendingBadge');
  const bottomBadge = document.getElementById('bottomNavPersonalBadge');

  if (!currentUser || currentUser.role !== 'nurse') {
    if (submitBadge) { submitBadge.innerText = '0'; submitBadge.classList.add('hidden'); submitBadge.style.display = 'none'; }
    if (bottomBadge) { bottomBadge.innerText = '0'; bottomBadge.classList.add('hidden'); bottomBadge.style.display = 'none'; }
    return;
  }

  const nurseId = currentUser.nurseId;
  const currentShifts = (monthState.roster && monthState.roster[nurseId]) || {};
  const snapShifts = syncedNurseShiftsSnapshot || {};
  const daysCount = getDaysCount(currentYear, currentMonth);

  let pendingChangesCount = 0;
  for (let d = 1; d <= daysCount; d++) {
    const curDay = currentShifts[d] || currentShifts[String(d)] || [];
    const snapDay = snapShifts[d] || snapShifts[String(d)] || [];

    const added = curDay.filter(s => !snapDay.includes(s)).length;
    const removed = snapDay.filter(s => !curDay.includes(s)).length;
    pendingChangesCount += (added + removed);
  }

  if (submitBtn) {
    if (pendingChangesCount === 0) {
      submitBtn.classList.add('opacity-40', 'cursor-not-allowed', 'filter', 'grayscale-[30%]');
      submitBtn.setAttribute('data-disabled', 'true');
    } else {
      submitBtn.classList.remove('opacity-40', 'cursor-not-allowed', 'filter', 'grayscale-[30%]');
      submitBtn.removeAttribute('data-disabled');
    }
  }

  if (pendingChangesCount > 0) {
    if (submitBadge) {
      submitBadge.innerText = pendingChangesCount;
      submitBadge.classList.remove('hidden');
      submitBadge.style.display = 'flex';
    }
    if (bottomBadge) {
      bottomBadge.innerText = pendingChangesCount;
      bottomBadge.classList.remove('hidden');
      bottomBadge.style.display = 'flex';
    }
  } else {
    if (submitBadge) {
      submitBadge.innerText = '0';
      submitBadge.classList.add('hidden');
      submitBadge.style.display = 'none';
    }
    if (bottomBadge) {
      bottomBadge.innerText = '0';
      bottomBadge.classList.add('hidden');
      bottomBadge.style.display = 'none';
    }
  }
}

window.openBookingSummaryModal = function () {
  const submitBtn = document.getElementById('submitNurseBookingBtn');
  if (submitBtn && submitBtn.getAttribute('data-disabled') === 'true') {
    if (typeof window.showToast === 'function') {
      window.showToast('⚠️ คุณยังไม่ได้เลือกหรือแก้ไขเวรในเดือนนี้');
    } else {
      alert('คุณยังไม่ได้เลือกหรือแก้ไขเวรในเดือนนี้');
    }
    return;
  }

  currentSummaryTab = 'ALL';
  renderBookingSummaryList();
  document.getElementById('bookingSummaryModal')?.classList.remove('hidden');
};

window.closeBookingSummaryModal = function () {
  document.getElementById('bookingSummaryModal')?.classList.add('hidden');
};

window.setSummaryModalTab = function (tab) {
  currentSummaryTab = tab;
  renderBookingSummaryList();
};

function updateSummaryTabUI(countAll, countAdd, countRemove) {
  const elAll = document.getElementById('tabCountAll');
  const elAdd = document.getElementById('tabCountAdd');
  const elRemove = document.getElementById('tabCountRemove');

  if (elAll) elAll.innerText = countAll;
  if (elAdd) elAdd.innerText = countAdd;
  if (elRemove) elRemove.innerText = countRemove;

  const btnAll = document.getElementById('tabSummaryAllBtn');
  const btnAdd = document.getElementById('tabSummaryAddBtn');
  const btnRemove = document.getElementById('tabSummaryRemoveBtn');

  const activeBase = "flex-1 py-1.5 px-2 rounded-xl text-xs font-black shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer";
  const inactiveBase = "flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer";

  if (btnAll) btnAll.className = (currentSummaryTab === 'ALL') ? `${activeBase} bg-white text-slate-900 dark:bg-slate-700 dark:text-white` : inactiveBase;
  if (btnAdd) btnAdd.className = (currentSummaryTab === 'ADD') ? `${activeBase} bg-emerald-600 text-white shadow-emerald-500/30` : inactiveBase;
  if (btnRemove) btnRemove.className = (currentSummaryTab === 'REMOVE') ? `${activeBase} bg-rose-600 text-white shadow-rose-500/30` : inactiveBase;
}

function renderBookingSummaryList() {
  const container = document.getElementById('bookingSummaryListContainer');
  if (!container || !currentUser || currentUser.role !== 'nurse') return;

  const nurseId = currentUser.nurseId;
  const currentShifts = (monthState.roster && monthState.roster[nurseId]) || {};
  const snapShifts = syncedNurseShiftsSnapshot || {};
  const daysCount = getDaysCount(currentYear, currentMonth);

  const allPendingChanges = [];

  for (let d = 1; d <= daysCount; d++) {
    const curDay = currentShifts[d] || [];
    const snapDay = snapShifts[d] || [];

    curDay.forEach(s => {
      if (!snapDay.includes(s)) {
        allPendingChanges.push({ day: d, shift: s, type: 'ADD' });
      }
    });

    snapDay.forEach(s => {
      if (!curDay.includes(s)) {
        allPendingChanges.push({ day: d, shift: s, type: 'REMOVE' });
      }
    });
  }

  allPendingChanges.sort((a, b) => a.day - b.day);

  const addItems = allPendingChanges.filter(x => x.type === 'ADD');
  const removeItems = allPendingChanges.filter(x => x.type === 'REMOVE');

  updateSummaryTabUI(allPendingChanges.length, addItems.length, removeItems.length);

  let displayItems = allPendingChanges;
  if (currentSummaryTab === 'ADD') displayItems = addItems;
  if (currentSummaryTab === 'REMOVE') displayItems = removeItems;

  if (displayItems.length === 0) {
    const emptyMsg = currentSummaryTab === 'ADD'
      ? 'ไม่มีรายการเวรที่เลือกเพิ่ม'
      : (currentSummaryTab === 'REMOVE' ? 'ไม่มีรายการเวรที่ขอยกเลิก' : 'ไม่มีรายการเปลี่ยนแปลงที่รอยืนยัน');

    container.innerHTML = `
      <div class="p-6 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        ${emptyMsg}
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-1.5 max-h-64 overflow-y-auto pr-1">
      ${displayItems.map(item => {
    const dt = new Date(currentYear, currentMonth, item.day);
    const dayName = CALENDAR_HEADERS[dt.getDay()].th;
    const shiftObj = SHIFTS[item.shift] || { name: item.shift, icon: '📅', time: '' };

    const isAdd = (item.type === 'ADD');
    const actionLabel = isAdd
      ? `<span class="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">➕ จองเพิ่ม</span>`
      : `<span class="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">🗑️ ขอยกเลิก</span>`;

    let badgeBg = 'bg-sky-50 text-sky-800 border-sky-200';
    if (item.shift === 'A') badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
    if (item.shift === 'N') badgeBg = 'bg-purple-50 text-purple-800 border-purple-200';

    return `
          <div class="flex items-center justify-between p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs">
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                ${item.day}
              </span>
              <div>
                <div class="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span>วัน${dayName}ที่ ${item.day} ${THAI_MONTHS[currentMonth]}</span>
                  ${actionLabel}
                </div>
                <div class="text-[10px] text-slate-400 font-mono">${shiftObj.time}</div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-lg text-xs font-bold border ${badgeBg}">
                ${shiftObj.icon} ${shiftObj.name}
              </span>
              <button type="button" onclick="undoPendingShiftChange(${item.day}, '${item.shift}', '${item.type}')"
                class="w-7 h-7 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 border border-slate-200 flex items-center justify-center font-bold text-xs transition cursor-pointer"
                title="ยกเลิกการเปลี่ยนแปลงรายการนี้">
                ✕
              </button>
            </div>
          </div>
        `;
  }).join('')}
    </div>
  `;
}

window.undoPendingShiftChange = function (day, shift, changeType) {
  if (!currentUser || currentUser.role !== 'nurse') return;
  const nurseId = currentUser.nurseId;

  if (!monthState.roster[nurseId]) monthState.roster[nurseId] = {};
  if (!monthState.roster[nurseId][day]) monthState.roster[nurseId][day] = [];

  if (changeType === 'ADD') {
    monthState.roster[nurseId][day] = monthState.roster[nurseId][day].filter(s => s !== shift);
    if (monthState.roster[nurseId][day].length === 0) {
      delete monthState.roster[nurseId][day];
    }
  } else if (changeType === 'REMOVE') {
    if (!monthState.roster[nurseId][day].includes(shift)) {
      monthState.roster[nurseId][day].push(shift);
    }
  }

  saveMonthState();
  renderBookingSummaryList();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminView();
  if (activeView === 'excel') renderExcelView('userExcelViewContent');

  const count = document.getElementById('submitBtnPendingBadge')?.innerText;
  if (!count || count === '0') {
    closeBookingSummaryModal();
  }
};

window.submitNurseBookingToSheet = async function () {
  if (!currentUser || currentUser.role !== 'nurse') return;

  const nurseId = currentUser.nurseId;
  const nurseShifts = (monthState.roster && monthState.roster[nurseId]) || {};
  const daysCount = getDaysCount(currentYear, currentMonth);

  const btnPopup = document.getElementById('btnFinalSubmitBooking');
  if (btnPopup) {
    btnPopup.disabled = true;
    btnPopup.innerHTML = `<span>⏳ กำลังบันทึก...</span>`;
  }

  try {
    if (supabase) {
      await supabase
        .from('bookings')
        .delete()
        .eq('year', currentYear)
        .eq('month', currentMonth)
        .eq('nurse_id', nurseId);

      const rowsToInsert = [];
      for (let d = 1; d <= daysCount; d++) {
        const shifts = nurseShifts[d] || nurseShifts[String(d)] || [];
        if (shifts.length > 0) {
          rowsToInsert.push({
            year: currentYear,
            month: currentMonth,
            day: d,
            nurse_id: nurseId,
            shifts: shifts,
            updated_at: new Date().toISOString()
          });
        }
      }

      if (rowsToInsert.length > 0) {
        const { error } = await supabase.from('bookings').insert(rowsToInsert);
        if (error) throw error;
      }
    }

    window.showToast?.("✅ บันทึกข้อมูลสำเร็จ");
    closeBookingSummaryModal();

    syncedNurseShiftsSnapshot = JSON.parse(JSON.stringify(nurseShifts));
    localStorage.setItem(`nurse_synced_shifts_${nurseId}_${currentYear}_${currentMonth}`, JSON.stringify(syncedNurseShiftsSnapshot));
    updatePendingShiftBadgeUI();

    renderNurseCalendar();
    renderPublicDashboard();
  } catch (err) {
    alert("เกิดข้อผิดพลาด: " + err.message);
  } finally {
    if (btnPopup) {
      btnPopup.disabled = false;
      btnPopup.innerHTML = `<span>💾 ยืนยันการจองตารางเวร</span>`;
    }
  }
};

window.fetchRosterFromSheet = async function (showLoadingToast = false) {
  if (!supabase) return;
  if (showLoadingToast) {
    window.showToast?.("🔄 กำลังโหลดข้อมูลล่าสุดจาก Supabase...");
  }

  try {
    const { data: statusData, error: statusErr } = await supabase
      .from('schedule_status')
      .select('is_confirmed')
      .eq('year', currentYear)
      .eq('month', currentMonth)
      .maybeSingle();

    if (statusErr) console.warn("Fetch schedule_status warning:", statusErr);

    const isConfirmed = statusData ? !!statusData.is_confirmed : false;

    const targetTable = isConfirmed ? 'confirmed_roster' : 'bookings';
    const { data, error } = await supabase
      .from(targetTable)
      .select('day, nurse_id, shifts')
      .eq('year', currentYear)
      .eq('month', currentMonth);

    if (error) throw error;

    const fetchedRoster = {};
    (data || []).forEach(row => {
      if (!fetchedRoster[row.nurse_id]) {
        fetchedRoster[row.nurse_id] = {};
      }
      fetchedRoster[row.nurse_id][row.day] = row.shifts || [];
    });

    const currentRosterStr = JSON.stringify(fetchedRoster);

    if (currentUser && currentUser.role === 'admin' && typeof hasAdminUnsavedChanges !== 'undefined' && hasAdminUnsavedChanges) {
      return;
    }

    if (currentRosterStr !== lastKnownRosterHash) {
      lastKnownRosterHash = currentRosterStr;

      if (!monthState) monthState = {};
      monthState.isConfirmed = isConfirmed;
      monthState.roster = JSON.parse(JSON.stringify(fetchedRoster));

      if (currentUser && currentUser.role === 'nurse') {
        const myShifts = fetchedRoster[currentUser.nurseId] || {};
        syncedNurseShiftsSnapshot = JSON.parse(JSON.stringify(myShifts));
        localStorage.setItem(`nurse_synced_shifts_${currentUser.nurseId}_${currentYear}_${currentMonth}`, JSON.stringify(syncedNurseShiftsSnapshot));

        const draftKey = `nurse_draft_${currentUser.nurseId}_${currentYear}_${currentMonth}`;
        localStorage.removeItem(draftKey);
      }

      localStorage.setItem(getStorageKey(), JSON.stringify(monthState));

      renderPublicDashboard();
      if (activeView === 'personal') renderNurseCalendar();
      if (activeView === 'admin') renderAdminView();
      if (activeView === 'excel') renderExcelView('userExcelViewContent');

      const fastClaimModal = document.getElementById('fastClaimModal');
      if (fastClaimModal && !fastClaimModal.classList.contains('hidden')) {
        renderFastClaimList();
      }

      if (typeof updatePendingShiftBadgeUI === 'function') {
        updatePendingShiftBadgeUI();
      }

      if (showLoadingToast) {
        window.showToast?.("✅ โหลดข้อมูลจาก Supabase สำเร็จ");
      }
    }
  } catch (e) {
    console.error("Fetch roster error from Supabase:", e);
  }
};

setInterval(() => {
  const bookingModal = document.getElementById('bookingModal');
  const cellModal = document.getElementById('cellEditModal');
  const isBookingModalOpen = bookingModal && !bookingModal.classList.contains('hidden');
  const isCellModalOpen = cellModal && !cellModal.classList.contains('hidden');

  if (currentUser && currentUser.role === 'admin' && hasAdminUnsavedChanges) {
    return;
  }

  if (!document.hidden && !isBookingModalOpen && !isCellModalOpen && typeof window.fetchRosterFromSheet === 'function') {
    window.fetchRosterFromSheet(false);
  }
}, 6000);

function roundCustomHalf(val) {
  const floorVal = Math.floor(val);
  const diff = val - floorVal;
  if (diff > 0.5) return Math.ceil(val);
  if (diff < 0.5) return floorVal;
  return Number(val.toFixed(2));
}

function auditRosterIntegrity(rosterToCheck) {
  const violations = [];
  const daysCount = getDaysCount(currentYear, currentMonth);

  NURSES.forEach(n => {
    for (let d = 1; d <= daysCount; d++) {
      const assignedShifts = rosterToCheck[n.id]?.[d] || [];
      const requestedShifts = monthState.raw_roster?.[n.id]?.[d] || [];

      assignedShifts.forEach(s => {
        if (!requestedShifts.includes(s)) {
          violations.push({
            nurseId: n.id,
            nurseName: n.name,
            day: d,
            shift: s
          });
        }
      });
    }
  });

  if (violations.length > 0) {
    console.error("🚨 พบการจัดเวรผิดพลาด (ได้เวรโดยไม่ได้จอง):", violations);
    alert(`⚠️ พบข้อผิดพลาดในการจัดเวร:\nมี ${violations.length} รายการที่พยาบาลได้เวรโดยไม่ได้กดจองมา`);
    return false;
  }
  return true;
}

async function runOptimization() {
  const modal = document.getElementById('optimizeModal');
  const daysCount = getDaysCount(currentYear, currentMonth);
  const activeShifts = getActiveShifts();
  const shiftsPerDay = activeShifts.length;
  const totalSlots = daysCount * shiftsPerDay;

  showActionProgress("ระบบจัดตารางเวรอัตโนมัติ", "กำลังเตรียมฐานข้อมูลคำขอจอง...");
  updateActionProgress(5, "รวบรวมคำขอจองเดิมของพยาบาล...", "เตรียมข้อมูล (5%)", "📋");
  await new Promise(r => setTimeout(r, 120));

  if (!monthState.raw_roster || Object.keys(monthState.raw_roster).length === 0) {
    monthState.raw_roster = JSON.parse(JSON.stringify(monthState.roster || {}));
  }

  const initialRequests = {};
  NURSES.forEach(n => {
    let count = 0;
    const rObj = monthState.raw_roster[n.id] || {};
    for (let d = 1; d <= daysCount; d++) {
      count += (rObj[d] || []).filter(s => activeShifts.includes(s)).length;
    }
    initialRequests[n.id] = count;
  });

  const participatingNurses = NURSES.filter(n => (initialRequests[n.id] || 0) > 0);
  if (participatingNurses.length === 0) {
    closeActionProgress(0);
    alert('⚠️ ยังไม่มีพยาบาลท่านใดกดเลือกเวรในเดือนนี้');
    return;
  }

  let assignedSlotsCount = 0;
  for (let d = 1; d <= daysCount; d++) {
    activeShifts.forEach(s => {
      const hasReq = participatingNurses.some(n => {
        const shifts = (monthState.raw_roster[n.id] && monthState.raw_roster[n.id][d]) || [];
        return shifts.includes(s);
      });
      if (hasReq) assignedSlotsCount++;
    });
  }

  const rawAvg = assignedSlotsCount / participatingNurses.length;
  const targetAvg = roundCustomHalf(rawAvg);

  const optimizedRoster = {};
  NURSES.forEach(n => { optimizedRoster[n.id] = {}; });
  const currentAssignedCount = {};
  participatingNurses.forEach(n => { currentAssignedCount[n.id] = 0; });

  function canAssign(nurseId, day, shift) {
    const todayShifts = optimizedRoster[nurseId][day] || [];
    if (todayShifts.length >= 2) return false;
    if (shift === 'M' && day > 1) {
      const prevShifts = optimizedRoster[nurseId][day - 1] || [];
      if (prevShifts.includes('A') && prevShifts.includes('N')) return false;
    }
    if ((shift === 'A' || shift === 'N') && day < daysCount) {
      const nextShifts = optimizedRoster[nurseId][day + 1] || [];
      const willHaveAN = (shift === 'A' && todayShifts.includes('N')) || (shift === 'N' && todayShifts.includes('A'));
      if (willHaveAN && nextShifts.includes('M')) return false;
    }
    return true;
  }

  const availableSlots = [];
  for (let d = 1; d <= daysCount; d++) {
    activeShifts.forEach(s => {
      const applicants = participatingNurses.filter(n => {
        const userDayShifts = (monthState.raw_roster[n.id] && monthState.raw_roster[n.id][d]) || [];
        return userDayShifts.includes(s);
      });
      if (applicants.length > 0) availableSlots.push({ day: d, shift: s, applicants });
    });
  }

  availableSlots.sort((a, b) => a.applicants.length - b.applicants.length);
  const totalProcessSlots = availableSlots.length;

  for (let idx = 0; idx < totalProcessSlots; idx++) {
    const slot = availableSlots[idx];
    const { day, shift, applicants } = slot;
    const validCandidates = applicants.filter(n => canAssign(n.id, day, shift));

    if (validCandidates.length > 0) {
      validCandidates.sort((a, b) => {
        const dayCountA = (optimizedRoster[a.id][day] || []).length;
        const dayCountB = (optimizedRoster[b.id][day] || []).length;
        if (dayCountA !== dayCountB) return dayCountA - dayCountB;

        const reqA = initialRequests[a.id];
        const reqB = initialRequests[b.id];
        const curA = currentAssignedCount[a.id];
        const curB = currentAssignedCount[b.id];
        const targetA = reqA < targetAvg ? reqA : targetAvg;
        const targetB = reqB < targetAvg ? reqB : targetAvg;

        const aNeedsTarget = curA < targetA;
        const bNeedsTarget = curB < targetB;
        if (aNeedsTarget && !bNeedsTarget) return -1;
        if (!aNeedsTarget && bNeedsTarget) return 1;
        if (curA !== curB) return curA - curB;

        const aBelow = reqA < targetAvg;
        const bBelow = reqB < targetAvg;
        if (aBelow && !bBelow) return -1;
        if (!aBelow && bBelow) return 1;

        return reqB - reqA;
      });

      const winner = validCandidates[0];
      const userRequestedShifts = monthState.raw_roster?.[winner.id]?.[day] || [];
      if (userRequestedShifts.includes(shift)) {
        if (!optimizedRoster[winner.id][day]) optimizedRoster[winner.id][day] = [];
        optimizedRoster[winner.id][day].push(shift);
        currentAssignedCount[winner.id]++;
      }
    }

    if (idx % 2 === 0 || idx === totalProcessSlots - 1) {
      const progressPercent = Math.round(10 + ((idx + 1) / totalProcessSlots) * 75);
      updateActionProgress(
        progressPercent,
        `กำลังจัดสรรเวรวันที่ ${day} (${SHIFTS[shift].name})...`,
        `ประมวลผล ${idx + 1}/${totalProcessSlots} เวร (${progressPercent}%)`,
        "⚙️"
      );
      await new Promise(r => setTimeout(r, 10));
    }
  }

  updateActionProgress(92, "ตรวจสอบความถูกต้องของสิทธิ์และข้อกำหนด 9 ข้อ...", "ตรวจสอบสิทธิ์ (92%)", "🔍");
  await new Promise(r => setTimeout(r, 120));

  if (!auditRosterIntegrity(optimizedRoster)) {
    closeActionProgress(0);
    return;
  }

  window.pendingOptimizedRoster = optimizedRoster;

  updateActionProgress(100, "คำนวณและประมวลผลเสร็จสมบูรณ์!", "เสร็จสิ้น (100%)", "✅");
  await new Promise(r => setTimeout(r, 180));

  closeActionProgress(80);

  renderOptimizationResultModal({
    daysCount,
    shiftsPerDay,
    totalSlots,
    nurseCount: NURSES.length,
    participatingCount: participatingNurses.length,
    targetAvg
  });

  if (modal) modal.classList.remove('hidden');
  window.showToast?.("⚡ จัดสรรตารางเวรตามกติกาเรียบร้อยแล้ว");
}

function renderOptimizationResultModal(data) {
  const modalBody = document.getElementById('optimizeModalBody');
  if (!modalBody) return;

  const daysCount = data.daysCount || getDaysCount(currentYear, currentMonth);
  const activeShifts = getActiveShifts();
  const shiftsPerDay = activeShifts.length;
  const totalMonthShifts = daysCount * shiftsPerDay;

  const sourceRoster = (monthState.raw_roster && Object.keys(monthState.raw_roster).length > 0)
    ? monthState.raw_roster
    : (monthState.roster || {});

  let activeNursesCount = 0;
  NURSES.forEach(n => {
    let userHasShift = false;
    const rObj = sourceRoster[n.id] || {};
    for (let d = 1; d <= daysCount; d++) {
      const sArr = (rObj[d] || []).filter(s => activeShifts.includes(s));
      if (sArr.length > 0) {
        userHasShift = true;
        break;
      }
    }
    if (userHasShift) activeNursesCount++;
  });

  const totalNursesCount = NURSES.length;

  let assignedShiftsCount = 0;
  for (let d = 1; d <= daysCount; d++) {
    activeShifts.forEach(s => {
      const hasApplicants = NURSES.some(n => {
        const shifts = (sourceRoster[n.id] && sourceRoster[n.id][d]) || [];
        return shifts.includes(s);
      });
      if (hasApplicants) {
        assignedShiftsCount++;
      }
    });
  }

  const rawAvg = activeNursesCount > 0 ? (assignedShiftsCount / activeNursesCount) : 0;
  const roundedAvg = data.targetAvg !== undefined ? data.targetAvg : roundCustomHalf(rawAvg);
  const monthName = THAI_MONTHS[currentMonth];

  modalBody.innerHTML = `
    <div class="space-y-4 text-slate-800 dark:text-slate-100">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div class="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200/80 dark:border-slate-700 shadow-2xs">
          <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400">บุคลากรพยาบาล</div>
          <div class="mt-1 flex items-baseline gap-1">
            <span class="text-xl sm:text-2xl font-black text-blue-950 dark:text-blue-300">${activeNursesCount}</span>
            <span class="text-xs text-slate-500 font-bold">/ ${totalNursesCount} ท่าน</span>
          </div>
          <div class="text-[10px] text-blue-700 dark:text-blue-400 font-semibold mt-0.5">
            เลือกจริง ${activeNursesCount} จากทั้งหมด ${totalNursesCount} คน
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 border border-amber-200/80 dark:border-slate-700 shadow-2xs">
          <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400">เวรประจำเดือน ${monthName}</div>
          <div class="mt-1 flex items-baseline gap-1">
            <span class="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-300">${assignedShiftsCount}</span>
            <span class="text-xs text-slate-500 font-bold">/ ${totalMonthShifts} เวร</span>
          </div>
          <div class="text-[10px] text-amber-800 dark:text-amber-400 font-semibold mt-0.5">
            เลือกแล้ว ${assignedShiftsCount} จากทั้งหมด ${totalMonthShifts} เวร
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-slate-700 shadow-2xs">
          <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400">สัดส่วนเวรเฉลี่ยพึงจัด</div>
          <div class="mt-1 flex items-baseline gap-1">
            <span class="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-300">${roundedAvg}</span>
            <span class="text-xs text-slate-500 font-bold">เวร/ท่าน</span>
          </div>
          <div class="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold mt-0.5">
            คำนวณจาก ${assignedShiftsCount} ÷ ${activeNursesCount} = ${rawAvg.toFixed(2)}
          </div>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs shadow-inner">
        <div class="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700 font-black text-slate-900 dark:text-white">
          <span class="text-base">📋</span>
          <span>ข้อกำหนดและหลักเกณฑ์การจัดสรรเวรอัตโนมัติ (Optimization Protocol)</span>
        </div>

        <ol class="space-y-1.5 list-decimal list-inside text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          <li><b>กลุ่มความประสงค์ต่ำกว่าค่าเฉลี่ย (&lt; ${roundedAvg} เวร):</b> ได้รับสิทธิ์จัดสรรก่อนตามทุกเวรที่ระบุความประสงค์ (หากมีคำขอทับซ้อนกันในเวรเดียวกัน ระบบจะเกลี่ยสัดส่วนระหว่างบุคคลอย่างเป็นธรรม)</li>
          <li><b>กลุ่มความประสงค์สูง (≥ ${roundedAvg} เวร):</b> ได้รับการการันตีการจัดสรรเวรขั้นต่ำอย่างน้อย ${roundedAvg} เวรแน่นอน</li>
          <li><b>ลำดับความสำคัญขั้นต้น:</b> ดำเนินการจัดสรรเวรให้แก่กลุ่มพยาบาลที่มีคำขอต่ำกว่าค่าเฉลี่ยเป็นลำดับแรก</li>
          <li><b>ลำดับความสำคัญขั้นถัดไป:</b> ดำเนินการจัดสรรเวรให้แก่กลุ่มพยาบาลที่มีคำขอสูงกว่าค่าเฉลี่ยให้ครบเกณฑ์การันตี</li>
          <li><b>การจัดสรรส่วนเกิน:</b> หากมีเวรคงเหลือจากการจัดสรร จะเกลี่ยให้แก่ผู้ที่ระบุคำขอจำนวนมากที่สุดลดหลั่นลงมาตามสัดส่วน</li>
          <li><b>การสละสิทธิ์:</b> พยาบาลที่ไม่ได้ระบุความประสงค์เข้าเวร (0 เวร) จะไม่ได้รับการจัดสรรเวรประจำเดือน</li>
          <li><b>ความต่อเนื่องของวัน:</b> สงวนสิทธิ์การเกลี่ยเวรเฉพาะภายในวันที่ระบุความประสงค์เท่านั้น (ไม่มีการเกลี่ยเวรข้ามวัน)</li>
          <li><b>ความปลอดภัยและสุขอนามัยในการปฏิบัติงาน:</b> กำหนดเพดานเข้าเวรไม่เกิน 2 เวร/วัน และในกรณีที่ปฏิบัติงานเวรบ่าย (A) ต่อด้วยเวรดึก (N) จะถูกระงับสิทธิ์การเข้าเวรเช้า (M) ในวันถัดไปทันที เพื่อให้มีเวลาพักผ่อนตามเกณฑ์</li>
          <li><b>เวรว่างตามความต้องการ:</b> ช่วงเวลาหรือเวรใดที่ไม่มีผู้ระบุความประสงค์ ระบบจะคงสถานะว่างไว้ โดยไม่บังคับจัดสรรบุคลากรทดแทน</li>
        </ol>
      </div>

      <div class="text-[11px] text-slate-500 dark:text-slate-400 text-center">
        * หากตรวจสอบข้อมูลและหลักเกณฑ์ถูกต้องแล้ว กดปุ่ม <b>"✓ ยืนยันตาราง"</b> เพื่อส่งผลการจัดเวรเข้าสู่ระบบ
      </div>
    </div>
  `;
}

async function confirmOptimization() {
  if (!window.pendingOptimizedRoster) return;

  document.getElementById('optimizeModal')?.classList.add('hidden');
  showActionProgress("กำลังบันทึกตารางเวร", "กำลังส่งข้อมูลเข้า Supabase...");
  updateActionProgress(30, "บันทึกตารางลงหน่วยความจำ...", "Step 1/2", "💾");

  monthState.roster = window.pendingOptimizedRoster;
  monthState.round = 3;
  monthState.isConfirmed = true;
  saveMonthState();

  updateActionProgress(70, "บันทึกเข้าตาราง Confirmed Roster...", "Step 2/2", "☁️");

  try {
    if (supabase) {
      await supabase.from('schedule_status').upsert({ year: currentYear, month: currentMonth, is_confirmed: true });
      await supabase.from('confirmed_roster').delete().eq('year', currentYear).eq('month', currentMonth);

      const rowsToInsert = [];
      Object.keys(monthState.roster || {}).forEach(nurseId => {
        const dayObj = monthState.roster[nurseId] || {};
        Object.keys(dayObj).forEach(day => {
          const shifts = dayObj[day] || [];
          if (shifts.length > 0) {
            rowsToInsert.push({
              year: currentYear,
              month: currentMonth,
              day: parseInt(day, 10),
              nurse_id: String(nurseId),
              shifts: shifts,
              claimed_at: new Date().toISOString()
            });
          }
        });
      });

      if (rowsToInsert.length > 0) {
        const { error } = await supabase.from('confirmed_roster').insert(rowsToInsert);
        if (error) throw error;
      }
    }

    updateActionProgress(100, "เปิดระบบ CF เรียบร้อยแล้ว!", "สำเร็จ", "🎉");
  } catch (e) {
    console.error("Supabase confirm error:", e);
  }

  window.pendingOptimizedRoster = null;
  triggerFireworks(1800);
  closeActionProgress(450);

  renderAdminView();
  renderPublicDashboard();
  updateNavSwitcher(activeView);
}

function cancelOptimization() {
  window.pendingOptimizedRoster = null;

  document.getElementById('optimizeModal')?.classList.add('hidden');
  document.getElementById('actionProgressModal')?.classList.add('hidden');

  showActionProgress("ยกเลิกการจัดสรร", "กำลังคืนค่าข้อมูลการจองเดิม...");
  updateActionProgress(60, "กำลังดึงตารางคำขอของพยาบาลกลับมา...", "คืนค่าข้อมูล", "↩️");

  if (monthState.raw_roster && Object.keys(monthState.raw_roster).length > 0) {
    monthState.roster = JSON.parse(JSON.stringify(monthState.raw_roster));
    saveMonthState();
  }

  updateActionProgress(100, "คืนค่าเดิมเรียบร้อยแล้ว", "เสร็จสิ้น", "✅");
  closeActionProgress(250);

  renderAdminView();
  renderPublicDashboard();
  window.showToast?.('↩️ ยกเลิกผลการจัดเวร และดึงข้อมูลการจองของพยาบาลกลับมาเรียบร้อยแล้ว');
}
window.cancelOptimization = cancelOptimization;

window.handleUnconfirmSchedule = async function () {
  const monthName = THAI_MONTHS[currentMonth];
  const yearBE = currentYear + 543;
  if (!confirm(`คุณต้องการยกเลิกตารางเวรที่จัดแล้ว และกลับไปใช้ข้อมูลการจองเดิมของเดือน ${monthName} ${yearBE} ใช่หรือไม่?`)) return;

  showActionProgress("ยกเลิกตารางเวร", "กำลังคืนค่าข้อมูล...");
  updateActionProgress(50, "กำลังล้างตารางที่จัดสำเร็จใน Supabase...", "ดำเนินการ", "☁️");

  try {
    if (supabase) {
      await supabase.from('schedule_status').upsert({ year: currentYear, month: currentMonth, is_confirmed: false });
      await supabase.from('confirmed_roster').delete().eq('year', currentYear).eq('month', currentMonth);
    }

    monthState.isConfirmed = false;
    if (monthState.raw_roster && Object.keys(monthState.raw_roster).length > 0) {
      monthState.roster = JSON.parse(JSON.stringify(monthState.raw_roster));
    }
    saveMonthState();

    updateActionProgress(100, "กลับสู่โหมดจองปกติเรียบร้อย", "สำเร็จ", "✅");
    closeActionProgress(350);

    renderAdminView();
    renderPublicDashboard();
    updateNavSwitcher(activeView);
  } catch (err) {
    alert("เกิดข้อผิดพลาด: " + err.message);
    closeActionProgress(0);
  }
};

window.restoreOriginalBookingsFromCloud = function () {
  if (typeof window.fetchRosterFromSheet === 'function') {
    window.fetchRosterFromSheet(true);
  }
};

window.handleResetMonth = async function () {
  const monthName = THAI_MONTHS[currentMonth];
  const yearBE = currentYear + 543;
  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการ "ล้างข้อมูลเวรทั้งหมด" ในเดือน ${monthName} ${yearBE}?`)) {
    return;
  }

  showActionProgress("กำลังล้างข้อมูล", "กำลังลบข้อมูลใน Supabase...");
  updateActionProgress(40, "กำลังลบเวรทั้งหมด...", "ดำเนินการ", "🗑️");

  const emptyRoster = {};
  NURSES.forEach(n => { emptyRoster[n.id] = {}; });

  monthState = {
    round: 1,
    round1: {},
    round2: {},
    roster: emptyRoster,
    raw_roster: {},
    isConfirmed: false
  };
  window.pendingOptimizedRoster = null;
  saveMonthState();

  try {
    if (supabase) {
      await supabase.from('bookings').delete().eq('year', currentYear).eq('month', currentMonth);
      await supabase.from('confirmed_roster').delete().eq('year', currentYear).eq('month', currentMonth);
      await supabase.from('schedule_status').upsert({ year: currentYear, month: currentMonth, is_confirmed: false });
    }

    updateActionProgress(100, "ล้างข้อมูลเรียบร้อยแล้ว", "สำเร็จ", "✅");
    closeActionProgress(250);
  } catch (e) {
    console.error("Reset month error:", e);
    closeActionProgress(0);
    alert("เกิดข้อผิดพลาดในการล้างข้อมูล: " + e.message);
  }

  renderPublicDashboard();
  if (typeof renderNurseCalendar === 'function' && activeView === 'personal') renderNurseCalendar();
  if (typeof renderAdminView === 'function' && activeView === 'admin') renderAdminView();
  if (typeof renderExcelView === 'function' && activeView === 'excel') renderExcelView('userExcelViewContent');
  if (typeof updateNavSwitcher === 'function') updateNavSwitcher(activeView);

  window.showToast?.('🗑️ ล้างข้อมูลเวรประจำเดือนใน Supabase เรียบร้อยแล้ว');
};

async function exportRoster() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  const monthName = THAI_MONTHS[currentMonth];
  const yearBE = currentYear + 543;
  const fileNameBase = `ตารางเวรพยาบาล_${monthName}_${yearBE}`;

  if (typeof ExcelJS !== 'undefined') {
    try {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet(`ตารางเวร ${monthName}`);
      ws.addRow([`ตารางเวรพยาบาล ประจำเดือน ${monthName} พ.ศ. ${yearBE}`]);
      ws.addRow(['ลำดับ', 'รหัส', 'ชื่อ - สกุล', ...Array.from({ length: daysCount }, (_, i) => i + 1), 'รวมเวร', 'รวมชั่วโมง']);

      NURSES.forEach((n, idx) => {
        const shifts = monthState.roster[n.id] || {};
        let tot = 0;
        const rowDays = [];
        for (let d = 1; d <= daysCount; d++) {
          const s = shifts[d] || [];
          tot += s.length;
          rowDays.push(s.join('+') || '');
        }
        ws.addRow([idx + 1, n.id, n.name, ...rowDays, tot, tot * 8]);
      });

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileNameBase}.xlsx`;
      link.click();
      window.showToast?.('✅ ส่งออกไฟล์ Excel สำเร็จ');
      return;
    } catch (e) { }
  }
  alert('ไม่สามารถส่งออก Excel ได้');
}

const PRESET_NURSE_COLORS = [
  '#c026d3', '#dc2626', '#0284c7', '#f43f5e', '#ea580c',
  '#2563eb', '#eab308', '#1e3a8a', '#06b6d4', '#f97316',
  '#d97706', '#8b5cf6', '#15803d', '#84cc16', '#475569', '#0d9488'
];

function renderNurseColorPalette() {
  const container = document.getElementById('nurseColorPalette');
  if (!container) return;
  container.innerHTML = PRESET_NURSE_COLORS.map(c => `
    <button type="button" onclick="selectNursePresetColor('${c}')"
      class="w-6 h-6 rounded-lg border-2 border-white shadow-2xs transition transform hover:scale-125 cursor-pointer"
      style="background-color: ${c};" title="${c}"></button>
  `).join('');
}

window.selectNursePresetColor = function (c) {
  const picker = document.getElementById('nurseFormColorPicker');
  if (picker) picker.value = c;
  window.syncNurseColorInput(c);
};

window.openNurseManageModal = function () {
  renderNurseManageList();
  renderNurseColorPalette();
  window.resetNurseForm();
  document.getElementById('nurseManageModal')?.classList.remove('hidden');
};

window.closeNurseManageModal = function () {
  document.getElementById('nurseManageModal')?.classList.add('hidden');
};

function renderNurseManageList() {
  const tbody = document.getElementById('nurseManageTableBody');
  if (!tbody) return;
  const countBadge = document.getElementById('nurseCountBadge');
  if (countBadge) countBadge.textContent = NURSES.length;

  tbody.innerHTML = NURSES.map(n => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs transition">
      <td class="p-2 text-center">
        <span class="nurse-num-badge w-7 h-7 rounded-xl text-xs font-black shadow-xs inline-flex items-center justify-center mx-auto"
              style="background-color: ${n.color || '#2563eb'}; color: ${n.textColor || '#ffffff'};"
              title="หมายเลข ${n.num}">
          ${n.num}
        </span>
      </td>
      <td class="p-2 font-mono text-slate-600 dark:text-slate-300 font-semibold">${n.id}</td>
      <td class="p-2 font-bold text-slate-800 dark:text-slate-100">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-white" style="background-color: ${n.color || '#2563eb'};"></span>
          <span>${n.name}</span>
        </div>
      </td>
      <td class="p-2 text-center font-mono text-slate-600 dark:text-slate-300 font-bold">${n.pin}</td>
      <td class="p-2 text-center">
        <div class="inline-flex items-center gap-1.5 justify-center">
          <button type="button" onclick="editNurse('${n.id}')"
            class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 rounded-lg text-xs font-bold transition cursor-pointer"
            title="แก้ไขข้อมูลพยาบาล">
            ✏️ แก้ไข
          </button>
          <button type="button" onclick="deleteNurse('${n.id}')"
            class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 rounded-lg text-xs font-bold transition cursor-pointer"
            title="ลบพยาบาล">
            🗑️ ลบ
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.editNurse = function (nurseId) {
  const n = NURSES.find(x => x.id === nurseId);
  if (!n) return;
  const idInput = document.getElementById('nurseFormId');
  if (idInput) {
    idInput.value = n.id;
    idInput.readOnly = true;
    idInput.classList.add('bg-slate-100', 'cursor-not-allowed');
  }
  const numInput = document.getElementById('nurseFormNum');
  if (numInput) numInput.value = n.num;
  const nameInput = document.getElementById('nurseFormName');
  if (nameInput) nameInput.value = n.name;
  const pinInput = document.getElementById('nurseFormPin');
  if (pinInput) pinInput.value = n.pin;
  const colorInput = document.getElementById('nurseFormColor');
  if (colorInput) colorInput.value = n.color || '#2563eb';
  const colorPicker = document.getElementById('nurseFormColorPicker');
  if (colorPicker) colorPicker.value = n.color || '#2563eb';

  window.syncNurseColorInput(n.color || '#2563eb');

  const cancelBtn = document.getElementById('cancelEditNurseBtn');
  const saveBtn = document.getElementById('saveNurseBtn');
  if (cancelBtn) cancelBtn.classList.remove('hidden');
  if (saveBtn) saveBtn.textContent = '💾 บันทึกการแก้ไข';

  document.getElementById('nurseManageForm')?.scrollIntoView({ behavior: 'smooth' });
};

window.deleteNurse = function (nurseId) {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบพยาบาลท่านนี้ออกจากระบบ?')) return;
  NURSES = NURSES.filter(x => x.id !== nurseId);
  saveNurses();
  if (monthState.roster && monthState.roster[nurseId]) {
    delete monthState.roster[nurseId];
    saveMonthState();
  }
  renderNurseManageList();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminView();
  if (activeView === 'excel') renderExcelView('userExcelViewContent');
  window.showToast?.('🗑️ ลบพยาบาลออกจากระบบเรียบร้อยแล้ว');
};

window.handleSaveNurse = function (e) {
  e.preventDefault();
  const id = document.getElementById('nurseFormId')?.value.trim();
  const num = parseInt(document.getElementById('nurseFormNum')?.value.trim(), 10);
  const name = document.getElementById('nurseFormName')?.value.trim();
  const pin = document.getElementById('nurseFormPin')?.value.trim();
  const color = document.getElementById('nurseFormColor')?.value.trim() || '#2563eb';

  if (!id || !name || !pin || isNaN(num)) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  const existingIdx = NURSES.findIndex(x => x.id === id);
  const idInput = document.getElementById('nurseFormId');
  const isEditing = idInput && idInput.readOnly;

  const nurseData = {
    id, num, name, pin, color,
    textColor: getContrastColor(color),
    bgSoft: hexToRgba(color, 0.15),
    border: hexToRgba(color, 0.35)
  };

  if (existingIdx !== -1) {
    if (isEditing) {
      NURSES[existingIdx] = nurseData;
      window.showToast?.('✅ อัปเดตข้อมูลพยาบาลเรียบร้อยแล้ว');
    } else {
      alert('รหัสพยาบาลนี้มีอยู่แล้ว');
      return;
    }
  } else {
    NURSES.push(nurseData);
    window.showToast?.('✅ เพิ่มพยาบาลเรียบร้อยแล้ว');
  }

  NURSES.sort((a, b) => a.num - b.num);
  saveNurses();
  renderNurseManageList();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminView();
  if (activeView === 'excel') renderExcelView('userExcelViewContent');
  window.resetNurseForm();
};

window.syncNurseColorInput = function (val) {
  const textInput = document.getElementById('nurseFormColor');
  const badge = document.getElementById('nurseFormPreviewBadge');
  if (textInput) textInput.value = val;
  if (badge) {
    badge.style.backgroundColor = val;
    badge.style.color = getContrastColor(val);
  }
};

window.syncNurseColorPicker = function (val) {
  const picker = document.getElementById('nurseFormColorPicker');
  const badge = document.getElementById('nurseFormPreviewBadge');
  if (picker && /^#[0-9A-Fa-f]{6}$/.test(val)) picker.value = val;
  if (badge) {
    badge.style.backgroundColor = val;
    badge.style.color = getContrastColor(val);
  }
};

window.resetNurseForm = function () {
  document.getElementById('nurseManageForm')?.reset();
  const idInput = document.getElementById('nurseFormId');
  if (idInput) {
    idInput.readOnly = false;
    idInput.classList.remove('bg-slate-100', 'cursor-not-allowed');
  }
  const cancelBtn = document.getElementById('cancelEditNurseBtn');
  const saveBtn = document.getElementById('saveNurseBtn');
  if (cancelBtn) cancelBtn.classList.add('hidden');
  if (saveBtn) saveBtn.textContent = '+ บันทึกพยาบาล';
  window.syncNurseColorInput('#2563eb');
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    shiftMode = getDefaultShiftModeForMonth(currentMonth);
    updateShiftModeUI();

    initTheme();
    loadMonthState();
    initAuth();
    updateCalendarViewDisplay();

    updateRealTimeClock();
    setInterval(updateRealTimeClock, 1000);

    function onMonthYearChanged() {
      const autoMode = getDefaultShiftModeForMonth(currentMonth);
      shiftMode = autoMode;
      updateShiftModeUI();

      loadMonthState();
      updateNavSwitcher(activeView);
      renderPublicDashboard();
      if (activeView === 'personal') renderNurseCalendar();
      if (activeView === 'admin') renderAdminView();
      if (activeView === 'excel') renderExcelView('userExcelViewContent');

      if (typeof window.fetchRosterFromSheet === 'function') {
        window.fetchRosterFromSheet();
      }
    }

    const monthSel = document.getElementById('monthSelect');
    const yearSel = document.getElementById('yearSelect');

    if (monthSel) {
      monthSel.value = currentMonth.toString();
      monthSel.addEventListener('change', (e) => {
        currentMonth = parseInt(e.target.value, 10);
        onMonthYearChanged();
      });
    }

    if (yearSel) {
      yearSel.value = currentYear.toString();
      yearSel.addEventListener('change', (e) => {
        currentYear = parseInt(e.target.value, 10);
        onMonthYearChanged();
      });
    }

    document.getElementById('prevMonthBtn')?.addEventListener('click', () => {
      if (currentMonth === 0) { currentMonth = 11; currentYear--; }
      else currentMonth--;
      if (monthSel) monthSel.value = currentMonth.toString();
      if (yearSel) yearSel.value = currentYear.toString();
      onMonthYearChanged();
    });

    document.getElementById('nextMonthBtn')?.addEventListener('click', () => {
      if (currentMonth === 11) { currentMonth = 0; currentYear++; }
      else currentMonth++;
      if (monthSel) monthSel.value = currentMonth.toString();
      if (yearSel) yearSel.value = currentYear.toString();
      onMonthYearChanged();
    });

    document.getElementById('modalNurseLoginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await loginAsNurse(document.getElementById('modalLoginNurseIdSelect')?.value, document.getElementById('modalLoginNursePin')?.value);
    });

    document.getElementById('modalAdminLoginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      loginAsAdmin(document.getElementById('modalAdminPasswordOnly')?.value);
    });

    document.getElementById('viewMatrixBtn')?.addEventListener('click', () => { adminActiveSubView = 'matrix'; renderAdminSubView(); });
    document.getElementById('viewExcelBtn')?.addEventListener('click', () => { adminActiveSubView = 'excel'; renderAdminSubView(); });
    document.getElementById('viewDailyBtn')?.addEventListener('click', () => { adminActiveSubView = 'daily'; renderAdminSubView(); });
    document.getElementById('viewSummaryBtn')?.addEventListener('click', () => { adminActiveSubView = 'summary'; renderAdminSubView(); });
    document.getElementById('viewVacanciesBtn')?.addEventListener('click', () => { adminActiveSubView = 'vacancies'; renderAdminSubView(); });
    document.getElementById('viewChartBtn')?.addEventListener('click', () => { adminActiveSubView = 'chart'; renderAdminSubView(); });

    document.getElementById('adminSubmitRosterBtn')?.addEventListener('click', handleAdminSubmitRoster);
    document.getElementById('openBookingModalBtn')?.addEventListener('click', openBookingModal);
    document.getElementById('exportExcelBtn')?.addEventListener('click', exportRoster);
    document.getElementById('printBtn')?.addEventListener('click', () => window.print());

    document.getElementById('closeCellEditBtn')?.addEventListener('click', closeCellEditor);
    document.getElementById('saveCellEditBtn')?.addEventListener('click', saveCellEditor);
    document.getElementById('clearCellBtn')?.addEventListener('click', clearCellShifts);

    // =========================================================================
    // 👉 จุดที่เพิ่ม: ดักจับการคลิก Checkbox ของเวร M, A, N ใน Popup ให้การ์ดเรืองแสงทันที
    // =========================================================================
    ['cellShiftM', 'cellShiftA', 'cellShiftN'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', updateCellEditCardHighlight);
    });

    document.getElementById('closeBookingModalBtn')?.addEventListener('click', closeBookingModal);
    document.getElementById('cancelBookingBtn')?.addEventListener('click', closeBookingModal);
    document.getElementById('quickBookingForm')?.addEventListener('submit', handleQuickBookingSubmit);
    document.getElementById('closeOptimizeModalBtn')?.addEventListener('click', cancelOptimization);
    document.getElementById('cancelOptimizeBtn')?.addEventListener('click', cancelOptimization);
    document.getElementById('confirmOptimizeBtn')?.addEventListener('click', confirmOptimization);

    initShiftToggleListeners();
    switchView('dashboard');

    setTimeout(() => {
      if (typeof window.fetchRosterFromSheet === 'function') {
        window.fetchRosterFromSheet();
      }
    }, 400);

  } catch (err) {
    console.error("Initialization Failed:", err);
    renderPublicDashboard();
  }
});

window.handleAdminRefresh = function () {
  if (typeof window.fetchRosterFromSheet === 'function') {
    window.fetchRosterFromSheet(true);
  }
};

window.handleAdminSubmitRoster = async function () {
  if (!currentUser || currentUser.role !== 'admin') return;

  const btn = document.getElementById('adminSubmitRosterBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>⏳ กำลังบันทึก...</span>`;
  }

  try {
    if (supabase) {
      await supabase.from('bookings').delete().eq('year', currentYear).eq('month', currentMonth);
      await supabase.from('schedule_status').upsert({ year: currentYear, month: currentMonth, is_confirmed: false });
      await supabase.from('confirmed_roster').delete().eq('year', currentYear).eq('month', currentMonth);

      const rowsToInsert = [];
      Object.keys(monthState.roster || {}).forEach(nurseId => {
        const dayObj = monthState.roster[nurseId] || {};
        Object.keys(dayObj).forEach(day => {
          const shifts = dayObj[day] || [];
          if (shifts.length > 0) {
            rowsToInsert.push({
              year: currentYear,
              month: currentMonth,
              day: parseInt(day, 10),
              nurse_id: String(nurseId),
              shifts: shifts,
              updated_at: new Date().toISOString()
            });
          }
        });
      });

      if (rowsToInsert.length > 0) {
        const { error } = await supabase.from('bookings').insert(rowsToInsert);
        if (error) throw error;
      }
    }

    monthState.isConfirmed = false;
    hasAdminUnsavedChanges = false;
    saveMonthState();

    window.showToast?.("✅ บันทึกข้อมูลการจองลง Supabase เรียบร้อยแล้ว");
    renderAdminView();
    renderPublicDashboard();
  } catch (err) {
    alert("เกิดข้อผิดพลาด: " + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>💾 ยืนยันจองตารางเวร</span>`;
    }
  }
};

function checkAndOpenFastClaimModalOnLogin() {
  if (!currentUser || currentUser.role !== 'nurse') return;

  if (monthState && monthState.isConfirmed) {
    const vacantSlots = getVacantShifts();
    if (vacantSlots.length > 0) {
      setTimeout(() => {
        openFastClaimModal();
      }, 600);
    } else {
      window.showToast?.("🎉 ตารางเวรเดือนนี้เต็มครบทุกเวรแล้ว");
    }
  }
}

function getVacantShifts() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  const activeShifts = getActiveShifts();
  const vacantList = [];

  for (let d = 1; d <= daysCount; d++) {
    activeShifts.forEach(s => {
      const isBooked = NURSES.some(n => {
        const shifts = (monthState.roster && monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
        return shifts.includes(s);
      });

      if (!isBooked) {
        vacantList.push({ day: d, shift: s });
      }
    });
  }
  return vacantList;
}

window.openFastClaimModal = function () {
  renderFastClaimList();
  document.getElementById('fastClaimModal')?.classList.remove('hidden');
};

window.closeFastClaimModal = function () {
  document.getElementById('fastClaimModal')?.classList.add('hidden');
  updatePersonalCfBannerBtn();
};

function updatePersonalCfBannerBtn() {
  const nurseSection = document.getElementById('nursePersonalSection');
  if (!nurseSection) return;

  let cfBanner = document.getElementById('nursePersonalCfBannerBtn');
  const isConfirmed = !!(monthState && monthState.isConfirmed);
  const vacantList = typeof getVacantShifts === 'function' ? getVacantShifts() : [];

  if (isConfirmed && vacantList.length > 0 && currentUser && currentUser.role === 'nurse') {
    if (!cfBanner) {
      cfBanner = document.createElement('div');
      cfBanner.id = 'nursePersonalCfBannerBtn';
      cfBanner.className = 'mb-4';

      const calGrid = document.getElementById('nurseCalendarGrid');
      if (calGrid && calGrid.parentNode) {
        calGrid.parentNode.insertBefore(cfBanner, calGrid.previousElementSibling || calGrid);
      } else {
        nurseSection.prepend(cfBanner);
      }
    }

    cfBanner.innerHTML = `
      <div onclick="openFastClaimModal()" 
           class="w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25 flex items-center justify-between cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] transition-all">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0">
            ⚡
          </div>
          <div class="text-left">
            <div class="text-xs sm:text-sm font-black flex items-center gap-2">
              <span>ระบบ CF (Confirm) เวรว่าง — จองก่อนได้ก่อน!</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-white text-orange-600 font-extrabold uppercase animate-pulse">Live</span>
            </div>
            <div class="text-[11px] sm:text-xs text-orange-100 font-medium">
              ขณะนี้มีเวรว่างเปิดให้แย่งสิทธิ์คงเหลือ <b class="text-white underline">${vacantList.length} เวร</b> (คลิกที่นี่เพื่อเปิดหน้าต่าง CF)
            </div>
          </div>
        </div>
        <button type="button" class="px-3.5 py-1.5 bg-white text-orange-600 rounded-xl text-xs font-black shadow-sm shrink-0">
          เปิดหน้าต่าง CF
        </button>
      </div>
    `;
    cfBanner.classList.remove('hidden');
  } else {
    if (cfBanner) {
      cfBanner.classList.add('hidden');
    }
  }
}

window.refreshFastClaimVacancies = async function () {
  window.showToast?.("🔄 กำลังเช็กเวรว่างล่าสุด...");
  if (typeof window.fetchRosterFromSheet === 'function') {
    await window.fetchRosterFromSheet(false);
  }
  renderFastClaimList();
};

function renderFastClaimList() {
  const container = document.getElementById('fastClaimListContainer');
  const countBadge = document.getElementById('fastClaimVacantCount');
  if (!container) return;

  const vacantList = getVacantShifts();
  if (countBadge) countBadge.innerText = vacantList.length;

  if (vacantList.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <div class="text-4xl mb-2">🎉</div>
        <div class="font-black text-sm text-slate-700 dark:text-slate-300">ไม่มีเวรว่างคงเหลือในขณะนี้</div>
        <div class="text-xs mt-1">ทุกเวรในเดือนนี้มีพยาบาลเข้าปฏิบัติหน้าที่ครบถ้วนแล้ว</div>
      </div>
    `;
    return;
  }

  container.innerHTML = vacantList.map(v => {
    const dt = new Date(currentYear, currentMonth, v.day);
    const dayName = CALENDAR_HEADERS[dt.getDay()].th;
    const shiftObj = SHIFTS[v.shift] || { name: v.shift, icon: '📅', time: '' };

    let badgeColor = 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-200';
    if (v.shift === 'A') badgeColor = 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200';
    if (v.shift === 'N') badgeColor = 'bg-purple-50 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-200';

    return `
      <div class="group flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-200 shadow-2xs hover:shadow-md">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white flex flex-col items-center justify-center font-black text-sm border border-slate-200 dark:border-slate-600 shrink-0">
            <span class="text-xs">${v.day}</span>
            <span class="text-[9px] font-bold opacity-75 leading-none">${CALENDAR_HEADERS[dt.getDay()].short}</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                วัน${dayName}ที่ ${v.day} ${THAI_MONTHS[currentMonth]}
              </span>
              <span class="px-2 py-0.5 rounded-lg text-xs font-bold border ${badgeColor}">
                ${shiftObj.icon} ${shiftObj.name}
              </span>
            </div>
            <div class="text-[11px] text-slate-400 font-mono mt-0.5">${shiftObj.time}</div>
          </div>
        </div>

        <button type="button" onclick="executeFastClaim(${v.day}, '${v.shift}', this)"
          class="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-xs sm:text-sm font-black shadow-md shadow-orange-500/25 transition-all transform active:scale-95 hover:scale-105 cursor-pointer shrink-0">
          <span class="animate-ping text-xs">⚡</span>
          <span>CF เวรนี้</span>
        </button>
      </div>
    `;
  }).join('');
}

window.executeFastClaim = async function (day, shift, btnElement) {
  if (!currentUser || currentUser.role !== 'nurse') return;
  const nurseId = currentUser.nurseId;

  if (btnElement) {
    btnElement.disabled = true;
    btnElement.innerHTML = `<span class="animate-spin text-xs">⏳</span><span>กำลัง CF...</span>`;
  }

  try {
    if (!supabase) throw new Error("Supabase is not initialized");

    const { data: existingShifts } = await supabase
      .from('confirmed_roster')
      .select('nurse_id, shifts')
      .eq('year', currentYear)
      .eq('month', currentMonth)
      .eq('day', day);

    const isTaken = (existingShifts || []).some(row => (row.shifts || []).includes(shift));
    if (isTaken) {
      alert("🚨 เสียใจด้วยครับ! มีพยาบาลท่านอื่นกด CF เวรนี้ตัดหน้าไปก่อนแล้ว");
      await window.fetchRosterFromSheet(false);
      renderFastClaimList();
      return;
    }

    const currentNurseRow = (existingShifts || []).find(r => r.nurse_id === nurseId);
    let updatedShifts = currentNurseRow ? [...currentNurseRow.shifts, shift] : [shift];

    const { error } = await supabase
      .from('confirmed_roster')
      .upsert({
        year: currentYear,
        month: currentMonth,
        day: day,
        nurse_id: nurseId,
        shifts: updatedShifts,
        claimed_at: new Date().toISOString()
      }, { onConflict: 'year,month,day,nurse_id' });

    if (error) throw error;

    triggerFireworks(1800);
    window.showToast?.(`⚡ คุณ CF เวรวันที่ ${day} สำเร็จแล้ว!`);
    await window.fetchRosterFromSheet(false);
    renderFastClaimList();
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการ CF: " + err.message);
  } finally {
    if (btnElement) {
      btnElement.disabled = false;
      btnElement.innerHTML = `<span>⚡ CF เวรนี้</span>`;
    }
  }
};

function showActionProgress(title, initialStatus = "กำลังเริ่มต้นระบบ...") {
  let modal = document.getElementById('actionProgressModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'actionProgressModal';
    modal.className = 'fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-300';
    modal.innerHTML = `
      <style>
        @keyframes shimmerPulse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .progress-shimmer {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
          animation: shimmerPulse 1.6s infinite;
        }
        .modal-bounce-in {
          animation: popModal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes popModal {
          0% { opacity: 0; transform: scale(0.92) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      </style>
      <div class="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 max-w-sm w-full mx-4 shadow-2xl border border-white/60 dark:border-slate-700/80 text-center modal-bounce-in overflow-hidden">
        <div class="absolute -top-10 -left-10 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -right-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div class="relative w-14 h-14 mx-auto mb-3.5 flex items-center justify-center">
          <div class="absolute inset-0 rounded-2xl bg-blue-600/20 animate-ping"></div>
          <div class="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span id="progressIconBadge" class="text-2xl">⚡</span>
          </div>
        </div>

        <h3 id="progressModalTitle" class="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1">
          ${title}
        </h3>
        <p id="progressModalStatus" class="text-xs font-semibold text-slate-500 dark:text-slate-400 min-h-[18px]">
          ${initialStatus}
        </p>

        <div class="relative w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 my-4 overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700 shadow-inner">
          <div id="progressModalBar" class="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-200 ease-out overflow-hidden" style="width: 5%;">
            <div class="progress-shimmer"></div>
          </div>
        </div>

        <div class="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 px-1">
          <span id="progressModalDetail">เริ่มต้น</span>
          <span id="progressModalPercent" class="text-blue-600 dark:text-blue-400 font-black">5%</span>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const titleEl = document.getElementById('progressModalTitle');
  const statusEl = document.getElementById('progressModalStatus');
  const barEl = document.getElementById('progressModalBar');
  const percentEl = document.getElementById('progressModalPercent');

  if (titleEl) titleEl.innerText = title;
  if (statusEl) statusEl.innerText = initialStatus;
  if (barEl) barEl.style.width = '6%';
  if (percentEl) percentEl.innerText = '6%';

  modal.classList.remove('hidden');
}

function updateActionProgress(percent, statusText, stepDetail = "", icon = "⚡") {
  const barEl = document.getElementById('progressModalBar');
  const statusEl = document.getElementById('progressModalStatus');
  const percentEl = document.getElementById('progressModalPercent');
  const detailEl = document.getElementById('progressModalDetail');
  const iconBadge = document.getElementById('progressIconBadge');

  const p = Math.min(100, Math.max(0, percent));
  if (barEl) barEl.style.width = `${p}%`;
  if (statusEl && statusText) statusEl.innerText = statusText;
  if (percentEl) percentEl.innerText = `${p}%`;
  if (detailEl && stepDetail) detailEl.innerText = stepDetail;
  if (iconBadge && icon) iconBadge.innerText = icon;
}

function closeActionProgress(delayMs = 250) {
  setTimeout(() => {
    const modal = document.getElementById('actionProgressModal');
    if (modal) modal.classList.add('hidden');
  }, delayMs);
}