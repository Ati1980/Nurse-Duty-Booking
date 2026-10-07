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

const NURSES = [
  { id: "6100001", num: 1, name: "น.ส.ภิญญดา คำผาเชื้อ", pin: "0001", order: 1, color: "#e11d48", textColor: "#ffffff", bgSoft: "#ffe4e6", border: "#fda4af" },
  { id: "6100002", num: 2, name: "น.ส.จำปา สิมมา", pin: "0002", order: 2, color: "#dc2626", textColor: "#ffffff", bgSoft: "#fee2e2", border: "#fca5a5" },
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
  { th: "เสาร์", short: "ส.", en: "Sat", isWeekend: true, headerClass: "bg-amber-100/90 text-amber-800 border-amber-300" }
];

// 2. Application State & Dynamic Start Month (เดือนเริ่มต้น = เดือนปัจจุบัน + 1 เช่น ตุลาคม -> พฤศจิกายน)
const now = new Date();
let defaultMonth = now.getMonth() + 1; // เดือนปัจจุบัน + 1
let defaultYear = now.getFullYear();
if (defaultMonth > 11) {
  defaultMonth = 0;
  defaultYear++;
}

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
  roster: {}
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
  const raw = localStorage.getItem(getStorageKey());
  if (raw) {
    try {
      monthState = JSON.parse(raw);
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
    round1: generateSampleRound1(),
    round2: {},
    roster: {}
  };
  monthState.roster = JSON.parse(JSON.stringify(monthState.round1));
  saveMonthState();
}

function generateSampleRound1() {
  const days = getDaysCount(currentYear, currentMonth);
  const sample = {};
  NURSES.forEach((nurse, idx) => {
    sample[nurse.id] = {};
    for (let d = 1; d <= days; d++) {
      const hash = (idx * 7 + d * 13) % 15;
      if (hash === 1) sample[nurse.id][d] = ['M'];
      else if (hash === 3) sample[nurse.id][d] = ['A'];
      else if (hash === 5) sample[nurse.id][d] = ['N'];
    }
  });
  return sample;
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
      currentUser = JSON.parse(savedUser);
    } catch (e) {
      currentUser = null;
    }
  }
  updateAuthUI();
}

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

window.logout = function() {
  currentUser = null;
  localStorage.removeItem('nurse_current_user');
  updateAuthUI();
  switchView('dashboard');
};

function updateAuthUI() {
  const unauthButtons = document.getElementById('unauthButtons');
  const authControls = document.getElementById('authControls');
  const userProfileBadge = document.getElementById('userProfileBadge');

  if (!currentUser) {
    if (unauthButtons) unauthButtons.classList.remove('hidden');
    if (authControls) authControls.classList.add('hidden');
  } else {
    if (unauthButtons) unauthButtons.classList.add('hidden');
    if (authControls) authControls.classList.remove('hidden');

    if (currentUser.role === 'admin') {
      userProfileBadge.innerHTML = `
        <div class="flex items-center gap-2 bg-indigo-900/60 border border-white/30 px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40 animate-pulse"></span>
          <span class="font-bold text-white">👑 ผู้ดูแลระบบ (Admin)</span>
        </div>
      `;
    } else {
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
  const adminBtn = document.getElementById('navAdminPortalBtn');

  const configs = [
    { el: dashBtn, target: 'dashboard', label: 'ปฏิทินหลัก', icon: '📊', isAllowed: true },
    { el: personalBtn, target: 'personal', label: 'ตารางเวรของฉัน', icon: '📅', isAllowed: !!(currentUser && currentUser.role === 'nurse') },
    { el: adminBtn, target: 'admin', label: 'ตารางรวม 14 ท่าน', icon: '📋', isAllowed: !!(currentUser && currentUser.role === 'admin') }
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

  activeView = viewName;
  updateNavSwitcher(viewName);

  const publicDashSection = document.getElementById('publicDashboardSection');
  const nurseSection = document.getElementById('nursePersonalSection');
  const adminSection = document.getElementById('adminSection');

  // Hide all sections first
  publicDashSection.classList.add('hidden');
  nurseSection.classList.add('hidden');
  adminSection.classList.add('hidden');

  if (viewName === 'dashboard') {
    publicDashSection.classList.remove('hidden');
    renderPublicDashboard();
  } else if (viewName === 'personal') {
    nurseSection.classList.remove('hidden');
    renderNurseCalendar();
  } else if (viewName === 'admin') {
    adminSection.classList.remove('hidden');
    renderAdminView();
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
  let totalShiftsCount = daysCount * 3;
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

    // Loop through all 3 shifts (M, A, N)
    ['M', 'A', 'N'].forEach(s => {
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

    const weekendCardStyle = isWeekend 
      ? 'bg-rose-50/70 border-rose-200/90 hover:border-rose-400' 
      : 'glass-card hover:border-blue-400';

    calHtml += `
      <div class="main-cal-day-cell p-3.5 border ${weekendCardStyle} shadow-xs">
        <div>
          <!-- Day Header: Big Date Number & Big Day Name -->
          <div class="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-2">
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl md:text-3xl font-black ${isWeekend ? 'text-rose-600' : 'text-slate-900'}">${d}</span>
              <span class="text-xs md:text-sm font-extrabold px-1.5 py-0.5 rounded ${isWeekend ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}">
                ${CALENDAR_HEADERS[dayOfWeek].short}
              </span>
            </div>
            <div>
              ${dayHasUnassigned ? '<span class="text-[10px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">🚨 มีเวรว่าง</span>' : '<span class="text-[10px] font-bold text-slate-400 font-mono">' + d + '/' + (currentMonth+1) + '</span>'}
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

  // If user is NOT logged in: Prompt Nurse login modal with this shift pre-selected
  if (!currentUser) {
    openNurseLoginModal({ day, shift });
    return;
  }

  // If logged in as Nurse
  if (currentUser.role === 'nurse') {
    const nurseId = currentUser.nurseId;
    const nurseName = currentUser.name;
    const userCurrentShifts = (monthState.roster[nurseId] && monthState.roster[nurseId][day]) || [];
    const isAlreadyBooked = userCurrentShifts.includes(shift);

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

    const footerEl = document.getElementById('shiftModalFooter');
    if (isAlreadyBooked) {
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

  // Update Section Title with Nurse Name
  const secTitle = document.getElementById('nurseCalendarSectionTitle');
  if (secTitle) {
    secTitle.innerText = `ตารางเวรประจำเดือนของฉัน (${nurseName})`;
  }

  // Status Banner
  const statusBanner = document.getElementById('nurseRoundStatusBanner');
  let roundText = `
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-2.5">
        <span class="px-3.5 py-1.5 rounded-xl font-black text-xs bg-blue-700 text-white shadow-xs">ตารางเวรส่วนบุคคล</span>
        <span class="text-xs text-blue-950 font-medium">แสดงเฉพาะเวรที่คุณเลือก (คุณสามารถคลิกที่ช่องวันที่เพื่อเพิ่มหรือยกเลิกเวรของคุณได้)</span>
      </div>
      <button onclick="openPersonalBookingModal()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition">
        + จองเวรของฉัน
      </button>
    </div>`;
  statusBanner.className = `p-4 rounded-2xl border bg-blue-50/90 border-blue-200 mb-6 transition shadow-xs`;
  statusBanner.innerHTML = roundText;

  // Personal Shift Counts
  const nurseShifts = monthState.roster[nurseId] || {};
  let countM = 0, countA = 0, countN = 0;
  for (let d = 1; d <= daysCount; d++) {
    const arr = nurseShifts[d] || [];
    if (arr.includes('M')) countM++;
    if (arr.includes('A')) countA++;
    if (arr.includes('N')) countN++;
  }
  const totalShifts = countM + countA + countN;
  const totalHours = totalShifts * 8;

  document.getElementById('nurseStatM').innerText = `${countM} ครั้ง`;
  document.getElementById('nurseStatA').innerText = `${countA} ครั้ง`;
  document.getElementById('nurseStatN').innerText = `${countN} ครั้ง`;
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
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const dayShifts = nurseShifts[d] || [];

    let shiftBadges = '';
    dayShifts.forEach(s => {
      if (s === 'M') shiftBadges += `<span class="shift-tag shift-m w-full text-center text-xs md:text-sm py-1 font-bold flex items-center justify-center gap-1 shadow-xs"><span>☀️</span> เช้า (08:30-16:30)</span>`;
      if (s === 'A') shiftBadges += `<span class="shift-tag shift-a w-full text-center text-xs md:text-sm py-1 font-bold flex items-center justify-center gap-1 shadow-xs"><span>⛅</span> บ่าย (16:30-00:30)</span>`;
      if (s === 'N') shiftBadges += `<span class="shift-tag shift-n w-full text-center text-xs md:text-sm py-1 font-bold flex items-center justify-center gap-1 shadow-xs"><span>🌙</span> ดึก (00:30-08:30)</span>`;
    });

    const weekendCardStyle = isWeekend 
      ? 'bg-rose-50/70 border-rose-200/90 hover:border-rose-400' 
      : 'glass-card hover:border-blue-400';

    calHtml += `
      <div class="calendar-day-cell rounded-2xl border p-3 md:p-3.5 flex flex-col justify-between shadow-xs transition ${weekendCardStyle} cursor-pointer" onclick="openCellEditor('${nurseId}', ${d})">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <span class="text-2xl md:text-3xl font-black ${isWeekend ? 'text-rose-600' : 'text-slate-900'}">${d}</span>
          <span class="text-xs md:text-sm font-extrabold px-2 py-0.5 rounded-lg ${isWeekend ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}">
            ${CALENDAR_HEADERS[dayOfWeek].short}
          </span>
        </div>
        <div class="mt-2 space-y-1.5">
          ${shiftBadges || `<span class="text-xs text-slate-400 font-medium italic block text-center py-2 hover:text-blue-600">+ แตะเลือกเวร</span>`}
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
  // Round status pills removed per user request
}

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
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const thClass = isWeekend ? 'bg-rose-100/90 text-rose-800' : 'bg-slate-100 text-slate-700';

    h += `<th class="p-1.5 text-center min-w-[38px] border-r border-slate-200 ${thClass}">
      <div class="font-extrabold text-xs">${d}</div>
      <div class="text-[10px] font-bold opacity-80">${CALENDAR_HEADERS[dayOfWeek].short}</div>
    </th>`;
  }

  h += `
    <th class="py-3 px-2 text-center bg-sky-100 text-sky-900 border-l-2 border-slate-300 font-bold">ช</th>
    <th class="py-3 px-2 text-center bg-amber-100 text-amber-900 border-l border-slate-300 font-bold">บ</th>
    <th class="py-3 px-2 text-center bg-purple-100 text-purple-900 border-l border-slate-300 font-bold">ด</th>
    <th class="py-3 px-2 text-center bg-blue-100 text-blue-950 border-l border-slate-300 font-extrabold">รวม</th>
  </tr>`;
  thead.innerHTML = h;

  // Filter nurses by search query
  const filteredNurses = NURSES.filter(n => {
    if (!searchQuery) return true;
    return n.name.includes(searchQuery) || n.id.includes(searchQuery);
  });

  // Body Rows with Zebra Striping and Full-Row Hover
  let b = '';
  filteredNurses.forEach((nurse, idx) => {
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
      const isWeekend = (dt.getDay() === 0 || dt.getDay() === 6);
      const weekendClass = isWeekend ? 'weekend-cell' : '';
      const dayShifts = nurseShifts[d] || [];

      let tags = '';
      dayShifts.forEach(s => {
        if (s === 'M') { countM++; tags += `<span class="shift-tag shift-m">ช</span>`; }
        if (s === 'A') { countA++; tags += `<span class="shift-tag shift-a">บ</span>`; }
        if (s === 'N') { countN++; tags += `<span class="shift-tag shift-n">ด</span>`; }
      });

      b += `<td class="p-1 text-center border-r border-slate-200 cursor-pointer transition ${weekendClass}"
               onclick="openCellEditor('${nurse.id}', ${d})">
        <div class="min-h-[26px] flex items-center justify-center gap-0.5 flex-wrap">
          ${tags || '<span class="text-slate-300 text-[10px] font-bold hover:text-blue-600">+</span>'}
        </div>
      </td>`;
    }

    const total = countM + countA + countN;
    const mBg = isEvenRow ? 'bg-sky-100/70 text-sky-950 font-bold' : 'bg-sky-50/70 text-sky-800 font-bold';
    const aBg = isEvenRow ? 'bg-amber-100/70 text-amber-950 font-bold' : 'bg-amber-50/70 text-amber-800 font-bold';
    const nBg = isEvenRow ? 'bg-purple-100/70 text-purple-950 font-bold' : 'bg-purple-50/70 text-purple-800 font-bold';
    const totBg = isEvenRow ? 'bg-blue-100 text-blue-950 font-black' : 'bg-blue-50 text-blue-900 font-black';

    b += `
      <td class="py-2 px-1 text-center border-l-2 border-slate-300 ${mBg}">${countM}</td>
      <td class="py-2 px-1 text-center border-l border-slate-300 ${aBg}">${countA}</td>
      <td class="py-2 px-1 text-center border-l border-slate-300 ${nBg}">${countN}</td>
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
      if (shifts.includes('N')) dayN++;
    });

    f += `<td class="p-1 text-center border-r border-slate-200 text-[10px] leading-tight bg-slate-50 text-slate-700">
      <div>ช: ${dayM}</div>
      <div>บ: ${dayA}</div>
      <div>ด: ${dayN}</div>
    </td>`;
  }

  f += `
    <td colspan="4" class="p-2 text-center text-[10px] text-slate-500 border-l-2 border-slate-300">
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

  // Split into 2 columns: column 1 (numbers 1..7) & column 2 (numbers 8..15) as in screenshot
  const col1 = NURSES.slice(0, 7);
  const col2 = NURSES.slice(7);

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
          <p class="text-xs text-slate-500 font-medium">ปุ่มสีประจำตัวพนักงาน สดใส สาย Modern (ตามแบบแผนก)</p>
        </div>
        <span class="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl">
          พยาบาลวิชาชีพ 14 ท่าน
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
function renderExcelView() {
  const container = document.getElementById('excelRosterContainer');
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
  const shiftDefs = [
    { key: 'M', name: 'เช้า', time: '08.30-16.30', icon: '☀️', rowBg: 'bg-white' },
    { key: 'A', name: 'บ่าย', time: '16.30-00.30', icon: '⛅', rowBg: 'bg-slate-50/40' },
    { key: 'N', name: 'ดึก', time: '00.30-08.30', icon: '🌙', rowBg: 'bg-white' }
  ];

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
              <span class="nurse-num-badge w-7 h-7 text-xs font-black cursor-pointer shadow-xs" 
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
                  title="คลิกเพื่อเลือกเวร">
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
    <div id="excelViewNurseCardsContainer"></div>
  `;

  container.innerHTML = html;
  renderNurseCardsModern('excelViewNurseCardsContainer');
}

function renderDailyView() {
  const container = document.getElementById('dailyCardsContainer');
  const daysCount = getDaysCount(currentYear, currentMonth);
  let html = '';

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const dayName = CALENDAR_HEADERS[dayOfWeek].th;

    const mNurses = [], aNurses = [], nNurses = [];
    NURSES.forEach(n => {
      const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
      if (shifts.includes('M')) mNurses.push(n.name);
      if (shifts.includes('A')) aNurses.push(n.name);
      if (shifts.includes('N')) nNurses.push(n.name);
    });

    html += `
      <div class="glass-card rounded-2xl p-4 border border-slate-200">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div>
            <span class="text-xl font-black ${isWeekend ? 'text-rose-600' : 'text-slate-900'}">${d}</span>
            <span class="text-xs font-bold text-slate-700 ml-1">วัน${dayName}</span>
          </div>
          <span class="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">รวม ${mNurses.length + aNurses.length + nNurses.length} คน</span>
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

          <div class="p-2 rounded-xl bg-purple-50 border border-purple-200">
            <div class="font-bold text-purple-900 flex justify-between">
              <span>🌙 ดึก (00:30-08:30)</span>
              <span class="font-mono">${nNurses.length} คน</span>
            </div>
            <div class="text-[11px] text-purple-800 mt-1">${nNurses.join(', ') || '<span class="text-slate-400 italic">ไม่มีผู้เลือก</span>'}</div>
          </div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function renderSummaryView() {
  renderNurseCardsModern('summaryNurseCardsContainer');

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
      if (arr.includes('N')) n++;
    }
    const totalShifts = m + a + n;
    grandM += m; grandA += a; grandN += n; grandTotal += totalShifts;

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
        <td class="py-2.5 px-4 text-center text-purple-800 font-bold bg-purple-50/40">${n}</td>
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
      <td class="py-3 px-4 text-center text-purple-800 bg-purple-100">${grandN}</td>
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
    ['M', 'A', 'N'].forEach(s => {
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
  const shiftRadios = document.getElementsByName('modalShift');
  shiftRadios.forEach(r => { if (r.value === shift) r.checked = true; });
  setTimeout(() => {
    const dateCheckboxes = document.getElementsByName('bookingDates');
    dateCheckboxes.forEach(cb => { cb.checked = (parseInt(cb.value) === day); });
  }, 50);
};

// 10. CELL EDIT MODAL LOGIC (ADMIN MATRIX)
window.openCellEditor = function(nurseId, day) {
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
  document.getElementById('cellShiftN').checked = currentShifts.includes('N');

  document.getElementById('cellEditModal').classList.remove('hidden');
};

function closeCellEditor() {
  document.getElementById('cellEditModal').classList.add('hidden');
  activeEditNurseId = null;
  activeEditDay = null;
}

function saveCellEditor() {
  if (!activeEditNurseId || !activeEditDay) return;

  const m = document.getElementById('cellShiftM').checked;
  const a = document.getElementById('cellShiftA').checked;
  const n = document.getElementById('cellShiftN').checked;

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

  const daysCount = getDaysCount(currentYear, currentMonth);
  const firstDayIndex = getFirstDayIndex(currentYear, currentMonth);
  const dateCont = document.getElementById('modalDateSelector');
  
  let html = '';

  // 1. Calendar day header row
  html += `<div class="col-span-7 grid grid-cols-7 gap-1 text-center text-xs font-black text-slate-700 pb-1.5 border-b border-slate-200 mb-1">`;
  CALENDAR_HEADERS.forEach(ch => {
    html += `<div class="${ch.isWeekend ? 'text-rose-700' : ''}">${ch.short}</div>`;
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
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    html += `
      <div class="booking-date-btn ${isWeekend ? 'is-weekend' : ''}" 
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
  const nurseId = document.getElementById('modalNurseSelect').value;
  const shiftRadios = document.getElementsByName('modalShift');
  let selectedShift = 'M';
  shiftRadios.forEach(r => { if (r.checked) selectedShift = r.value; });

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
    if (!monthState.roster[nurseId][d].includes(selectedShift)) {
      monthState.roster[nurseId][d].push(selectedShift);
    }
  });

  saveMonthState();
  closeBookingModal();
  renderPublicDashboard();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminSubView();
}

// 12. AUTOMATED SHIFT OPTIMIZER ALGORITHM
function runOptimization() {
  const daysCount = getDaysCount(currentYear, currentMonth);

  const optimizedRoster = JSON.parse(JSON.stringify(monthState.roster));
  const assignedLog = [];

  const nurseDutyCounts = {};
  NURSES.forEach(n => {
    let c = 0;
    const sObj = optimizedRoster[n.id] || {};
    for (let d = 1; d <= daysCount; d++) {
      c += (sObj[d] || []).length;
    }
    nurseDutyCounts[n.id] = c;
  });

  // Balance out any unassigned shift
  for (let d = 1; d <= daysCount; d++) {
    ['N', 'A', 'M'].forEach(s => {
      let assignedNurses = [];
      NURSES.forEach(n => {
        if (optimizedRoster[n.id] && optimizedRoster[n.id][d] && optimizedRoster[n.id][d].includes(s)) {
          assignedNurses.push(n.id);
        }
      });

      // Target at least 1 nurse if unassigned
      if (assignedNurses.length === 0) {
        const candidates = NURSES.filter(n => {
          const todayShifts = (optimizedRoster[n.id] && optimizedRoster[n.id][d]) || [];
          if (todayShifts.length > 0) return false;

          if (s === 'M' && d > 1) {
            const yShifts = (optimizedRoster[n.id] && optimizedRoster[n.id][d - 1]) || [];
            if (yShifts.includes('N')) return false;
          }
          return true;
        });

        candidates.sort((a, b) => nurseDutyCounts[a.id] - nurseDutyCounts[b.id]);

        if (candidates.length > 0) {
          const picked = candidates[0];
          if (!optimizedRoster[picked.id]) optimizedRoster[picked.id] = {};
          if (!optimizedRoster[picked.id][d]) optimizedRoster[picked.id][d] = [];
          optimizedRoster[picked.id][d].push(s);
          nurseDutyCounts[picked.id]++;

          assignedLog.push({
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

  const modalBody = document.getElementById('optimizeModalBody');
  if (assignedLog.length === 0) {
    modalBody.innerHTML = `
      <div class="p-6 text-center bg-emerald-50 border border-emerald-200 rounded-2xl">
        <h4 class="font-bold text-emerald-800 text-sm mb-1">🎉 ตารางเวรมีพยาบาลเลือกเข้าเวรครบถ้วนทุกเวรแล้ว</h4>
        <p class="text-xs text-emerald-600">ไม่มีเวรที่ว่างค้าง ระบบมีความสมดุลเรียบร้อย</p>
      </div>`;
  } else {
    let logHtml = `
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-4 text-xs text-blue-900">
        <div class="font-bold mb-1">ผลการประมวลผล:</div>
        <div>ระบบได้จัดพยาบาลเติมเต็มเวรที่ยังไม่มีคนเลือกไปทั้งหมด <b>${assignedLog.length} ตำแหน่ง</b> โดยกระจายเวรให้พยาบาลที่มีชั่วโมงเวรน้อยที่สุดอย่างเป็นธรรม</div>
      </div>
      <div class="max-h-60 overflow-y-auto space-y-2 pr-1">`;

    assignedLog.forEach(log => {
      logHtml += `
        <div class="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs">
          <div>
            <span class="font-bold text-slate-800">วันที่ ${log.day}</span>
            <span class="text-slate-500 ml-1">(${log.shiftName})</span>
          </div>
          <div class="font-semibold text-blue-800">
            ${log.nurse.name} <span class="text-slate-400 font-mono text-[11px]">[${log.nurse.id}]</span>
          </div>
        </div>
      `;
    });
    logHtml += `</div>`;
    modalBody.innerHTML = logHtml;
  }

  document.getElementById('optimizeModal').classList.remove('hidden');
}

function confirmOptimization() {
  if (window.pendingOptimizedRoster) {
    monthState.roster = window.pendingOptimizedRoster;
    monthState.round = 3;
    saveMonthState();
    window.pendingOptimizedRoster = null;
  }
  document.getElementById('optimizeModal').classList.add('hidden');
  renderAdminView();
  renderPublicDashboard();
}

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
      if (s.includes('N')) { n++; shiftText.push('ด'); }
      row.push(`"${shiftText.join('+')}"`);
    }
    const tot = m + a + n;
    row.push(m, a, n, tot, tot * 8);
    csv += row.join(',') + '\r\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ตารางเวรพยาบาล_${THAI_MONTHS[currentMonth]}_${currentYear + 543}.csv`;
  link.click();
}

// 13. EVENT LISTENERS INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  loadMonthState();
  initAuth();

  // Month navigation: Initialized to defaultMonth (current month + 1)
  const monthSel = document.getElementById('monthSelect');
  const yearSel = document.getElementById('yearSelect');
  if (monthSel) {
    monthSel.value = currentMonth;
    monthSel.addEventListener('change', (e) => {
      currentMonth = parseInt(e.target.value);
      loadMonthState();
      renderPublicDashboard();
      if (activeView === 'personal') renderNurseCalendar();
      if (activeView === 'admin') renderAdminView();
    });
  }

  if (yearSel) {
    yearSel.value = currentYear;
    yearSel.addEventListener('change', (e) => {
      currentYear = parseInt(e.target.value);
      loadMonthState();
      renderPublicDashboard();
      if (activeView === 'personal') renderNurseCalendar();
      if (activeView === 'admin') renderAdminView();
    });
  }

  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    if (currentMonth === 0) { currentMonth = 11; currentYear--; }
    else { currentMonth--; }
    monthSel.value = currentMonth;
    yearSel.value = currentYear;
    loadMonthState();
    renderPublicDashboard();
    if (activeView === 'personal') renderNurseCalendar();
    if (activeView === 'admin') renderAdminView();
  });

  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    if (currentMonth === 11) { currentMonth = 0; currentYear++; }
    else { currentMonth++; }
    monthSel.value = currentMonth;
    yearSel.value = currentYear;
    loadMonthState();
    renderPublicDashboard();
    if (activeView === 'personal') renderNurseCalendar();
    if (activeView === 'admin') renderAdminView();
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
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลเวรทั้งหมดในเดือนนี้?')) {
      monthState.roster = {};
      saveMonthState();
      renderAdminView();
      renderPublicDashboard();
    }
  });

  // Search Nurse Input
  document.getElementById('searchNurseInput')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    if (adminActiveSubView === 'matrix') renderMatrix();
  });

  // Modals Event Listeners
  document.getElementById('closeCellEditBtn')?.addEventListener('click', closeCellEditor);
  document.getElementById('saveCellEditBtn')?.addEventListener('click', saveCellEditor);
  document.getElementById('clearCellBtn')?.addEventListener('click', clearCellShifts);

  document.getElementById('closeBookingModalBtn')?.addEventListener('click', closeBookingModal);
  document.getElementById('cancelBookingBtn')?.addEventListener('click', closeBookingModal);
  document.getElementById('quickBookingForm')?.addEventListener('submit', handleQuickBookingSubmit);

  document.getElementById('closeOptimizeModalBtn')?.addEventListener('click', () => {
    document.getElementById('optimizeModal').classList.add('hidden');
  });
  document.getElementById('cancelOptimizeBtn')?.addEventListener('click', () => {
    document.getElementById('optimizeModal').classList.add('hidden');
  });
  document.getElementById('confirmOptimizeBtn')?.addEventListener('click', confirmOptimization);

  // Initial View: Always start with the Main Monthly Calendar Dashboard
  switchView('dashboard');
});
