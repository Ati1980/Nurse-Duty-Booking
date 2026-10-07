/**
 * Nurse Duty Booking & Roster System
 * Modern Blue Glassmorphism Theme
 * Multi-Role Auth, Live Vacancy Dashboard, True 7-Column Calendar Grid, 
 * 2-Round Booking & Shift Optimizer
 */

// 1. Data Definitions
const ADMIN_CREDENTIALS = {
  username: "Admin",
  password: "1234"
};

const NURSES = [
  { id: "6100001", name: "น.ส.ภิญญดา คำผาเชื้อ", pin: "0001", order: 1 },
  { id: "6100002", name: "น.ส.จำปา สิมมา", pin: "0002", order: 2 },
  { id: "6100005", name: "น.ส.ระวิวรรณ รัตนปัญญา", pin: "0005", order: 3 },
  { id: "6100013", name: "น.ส.หิรัญญา แสนสุข", pin: "0013", order: 4 },
  { id: "6100015", name: "น.ส.วชิราพรรณ อานุพินิจ", pin: "0015", order: 5 },
  { id: "6100021", name: "น.ส.ประทุมวัน ชัยยันต์", pin: "0021", order: 6 },
  { id: "6100057", name: "น.ส.วิชชุดา ศรีหลง", pin: "0057", order: 7 },
  { id: "6100063", name: "น.ส.อังสุมาลี เพียอามาตย์", pin: "0063", order: 8 },
  { id: "6100067", name: "น.ส.สุชาวดี คำอู", pin: "0067", order: 9 },
  { id: "6100068", name: "น.ส.ภัทราภรณ์ หล้าหนองเรือ", pin: "0068", order: 10 },
  { id: "6100070", name: "น.ส.ปวีณ์ริศา อินทรพิมพ์", pin: "0070", order: 11 },
  { id: "6100074", name: "น.ส.วริศรา ศรีใส", pin: "0074", order: 12 },
  { id: "6100076", name: "น.ส.วิไลจิตร กุลทวง", pin: "0076", order: 13 },
  { id: "6100075", name: "น.ส.สิริณญา วิเศษวุธ", pin: "0075", order: 14 }
];

const SHIFTS = {
  M: { id: 'M', code: 'ช', name: 'เวรเช้า', time: '08:30 - 16:30 น.', hours: 8, badge: 'shift-m', icon: '☀️', defaultReq: 2 },
  A: { id: 'A', code: 'บ', name: 'เวรบ่าย', time: '16:30 - 00:30 น.', hours: 8, badge: 'shift-a', icon: '⛅', defaultReq: 2 },
  N: { id: 'N', code: 'ด', name: 'เวรดึก', time: '00:30 - 08:30 น.', hours: 8, badge: 'shift-n', icon: '🌙', defaultReq: 1 }
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

// 2. Application State
let currentUser = null;
let currentYear = 2026;
let currentMonth = 8; // กันยายน (0-indexed: 8)
let activeView = 'dashboard'; // 'dashboard', 'personal', 'admin'
let adminActiveSubView = 'matrix'; // 'matrix', 'daily', 'summary', 'vacancies'
let dashboardShiftFilter = 'ALL'; // 'ALL', 'M', 'A', 'N', 'WEEKEND'
let searchQuery = '';

let shiftQuota = { M: 2, A: 2, N: 1 };

let monthState = {
  round: 1,
  round1: {},
  round2: {},
  roster: {}
};

let activeEditNurseId = null;
let activeEditDay = null;

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

function calculateVacancies() {
  const days = getDaysCount(currentYear, currentMonth);
  const vacancies = [];

  for (let d = 1; d <= days; d++) {
    ['M', 'A', 'N'].forEach(s => {
      const req = shiftQuota[s];
      let assigned = [];

      NURSES.forEach(n => {
        const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
        if (shifts.includes(s)) assigned.push(n);
      });

      if (assigned.length < req) {
        vacancies.push({
          day: d,
          shift: s,
          shiftName: SHIFTS[s].name,
          time: SHIFTS[s].time,
          icon: SHIFTS[s].icon,
          required: req,
          currentCount: assigned.length,
          missing: req - assigned.length,
          assigned: assigned
        });
      }
    });
  }

  return vacancies;
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

window.openNurseLoginModal = function() {
  const modal = document.getElementById('nurseLoginModal');
  const sel = document.getElementById('modalLoginNurseIdSelect');
  const pinInput = document.getElementById('modalLoginNursePin');
  
  sel.innerHTML = NURSES.map(n => `<option value="${n.id}">[${n.id}] ${n.name}</option>`).join('');
  if (pinInput) pinInput.value = '';
  modal.classList.remove('hidden');
};

window.closeNurseLoginModal = function() {
  document.getElementById('nurseLoginModal').classList.add('hidden');
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
  const navMyScheduleBtn = document.getElementById('navMyScheduleBtn');
  const navAdminPortalBtn = document.getElementById('navAdminPortalBtn');

  if (!currentUser) {
    if (unauthButtons) unauthButtons.classList.remove('hidden');
    if (authControls) authControls.classList.add('hidden');
  } else {
    if (unauthButtons) unauthButtons.classList.add('hidden');
    if (authControls) authControls.classList.remove('hidden');

    if (currentUser.role === 'admin') {
      userProfileBadge.innerHTML = `
        <div class="flex items-center gap-2 bg-indigo-900/60 border border-indigo-400/40 px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40 animate-pulse"></span>
          <span class="font-bold text-white">👑 ผู้ดูแลระบบ (Admin)</span>
        </div>
      `;
      if (navMyScheduleBtn) navMyScheduleBtn.classList.add('hidden');
      if (navAdminPortalBtn) navAdminPortalBtn.classList.remove('hidden');
    } else {
      userProfileBadge.innerHTML = `
        <div class="flex items-center gap-2 bg-sky-900/60 border border-sky-400/40 px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-sky-300 ring-2 ring-sky-300/40"></span>
          <span class="font-bold text-white">👩‍⚕️ ${currentUser.name}</span>
          <span class="font-mono text-sky-200">(${currentUser.nurseId})</span>
        </div>
      `;
      if (navMyScheduleBtn) navMyScheduleBtn.classList.remove('hidden');
      if (navAdminPortalBtn) navAdminPortalBtn.classList.add('hidden');
    }
  }
}

// 5. Global View Switching
window.switchView = function(viewName) {
  activeView = viewName;

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
    if (!currentUser || currentUser.role !== 'nurse') {
      openNurseLoginModal();
      return;
    }
    nurseSection.classList.remove('hidden');
    renderNurseCalendar();
  } else if (viewName === 'admin') {
    if (!currentUser || currentUser.role !== 'admin') {
      openAdminLoginModal();
      return;
    }
    adminSection.classList.remove('hidden');
    renderAdminView();
  }
};

// 6. MAIN LIVE VACANCY DASHBOARD (แสดงเฉพาะเวรที่ว่าง วันที่/เวรที่เลือกแล้วให้ซ่อนไว้)
window.setDashboardFilter = function(filter) {
  dashboardShiftFilter = filter;
  ['ALL', 'M', 'A', 'N', 'WEEKEND'].forEach(f => {
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
  const container = document.getElementById('dashboardVacanciesContainer');
  const statTotal = document.getElementById('dashStatTotal');
  const statM = document.getElementById('dashStatM');
  const statA = document.getElementById('dashStatA');
  const statN = document.getElementById('dashStatN');

  const allVacancies = calculateVacancies();
  
  let countM = 0, countA = 0, countN = 0;
  allVacancies.forEach(v => {
    if (v.shift === 'M') countM += v.missing;
    if (v.shift === 'A') countA += v.missing;
    if (v.shift === 'N') countN += v.missing;
  });

  const totalMissing = countM + countA + countN;
  statTotal.innerText = `${totalMissing} เวร`;
  statM.innerText = `${countM} ที่`;
  statA.innerText = `${countA} ที่`;
  statN.innerText = `${countN} ที่`;

  // Render day cards: ONLY show days with vacant shifts, HIDE days/shifts that are completely filled!
  let cardsHtml = '';
  let visibleDaysCount = 0;

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay(); // 0 = Sun .. 6 = Sat
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    // Apply Weekend filter if selected
    if (dashboardShiftFilter === 'WEEKEND' && !isWeekend) {
      continue;
    }

    // Find vacant shifts for this specific day
    const dayVacancies = allVacancies.filter(v => v.day === d);
    
    // Filter by specific shift if selected
    const filteredDayVacancies = dayVacancies.filter(v => {
      if (dashboardShiftFilter === 'ALL' || dashboardShiftFilter === 'WEEKEND') return true;
      return v.shift === dashboardShiftFilter;
    });

    // "วันที่/เวรที่ถูกเลือกให้ซ่อนไว้":
    // If NO vacant shifts on this day (or filtered out) -> DO NOT RENDER THIS DAY!
    if (filteredDayVacancies.length === 0) {
      continue;
    }

    visibleDaysCount++;
    const dayName = CALENDAR_HEADERS[dayOfWeek].th;
    const dayEn = CALENDAR_HEADERS[dayOfWeek].en;

    const weekendBadge = isWeekend 
      ? `<span class="px-2 py-0.5 rounded-lg text-xs font-black bg-rose-500 text-white shadow-xs">วันหยุด</span>`
      : `<span class="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-200 text-slate-700">วันธรรมดา</span>`;

    // Render vacant shift items inside this day card (FILLED SHIFTS ARE NOT INCLUDED!)
    let shiftItemsHtml = '';
    filteredDayVacancies.forEach(v => {
      let shiftColor = '';
      if (v.shift === 'M') shiftColor = 'bg-sky-50 border-sky-300 text-sky-950';
      if (v.shift === 'A') shiftColor = 'bg-amber-50 border-amber-300 text-amber-950';
      if (v.shift === 'N') shiftColor = 'bg-purple-50 border-purple-300 text-purple-950';

      shiftItemsHtml += `
        <div class="p-3 rounded-2xl border ${shiftColor} flex items-center justify-between gap-2 shadow-xs">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">${v.icon}</span>
            <div>
              <div class="font-black text-xs md:text-sm">${v.shiftName} (${v.time.split(' ')[0]})</div>
              <div class="text-[11px] font-semibold text-rose-700">ต้องการอีก <b>${v.missing} คน</b> (มีแล้ว ${v.currentCount}/${v.required})</div>
            </div>
          </div>
          <button onclick="handleQuickBookShift(${v.day}, '${v.shift}')" 
                  class="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs transition transform hover:scale-105 cursor-pointer whitespace-nowrap">
            จองเวรนี้ ➔
          </button>
        </div>
      `;
    });

    cardsHtml += `
      <div class="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-400 transition transform hover:-translate-y-1">
        <div>
          <!-- Day Header: Big Date Number & Big Day Name -->
          <div class="flex items-start justify-between pb-3 border-b border-slate-200/80 mb-3">
            <div>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl md:text-4xl font-black ${isWeekend ? 'text-rose-600' : 'text-slate-900'}">${d}</span>
                <span class="text-base md:text-lg font-black text-slate-800">วัน${dayName}</span>
              </div>
              <div class="text-xs text-slate-500 font-mono">${d} ${THAI_MONTHS[currentMonth]} ${currentYear + 543} (${dayEn})</div>
            </div>
            <div>
              ${weekendBadge}
            </div>
          </div>

          <!-- List of Only Vacant Shifts -->
          <div class="space-y-2.5">
            ${shiftItemsHtml}
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>เวรที่ถูกจองเต็มแล้วถูกซ่อนไว้</span>
          <span class="text-blue-700 font-bold">ว่าง ${filteredDayVacancies.length} กะ</span>
        </div>
      </div>
    `;
  }

  if (visibleDaysCount === 0) {
    if (totalMissing === 0) {
      container.innerHTML = `
        <div class="col-span-full p-12 text-center glass-card rounded-3xl border border-emerald-300 bg-emerald-50/80">
          <div class="text-5xl mb-3">🎉</div>
          <h3 class="text-xl font-black text-emerald-900 mb-1 font-heading">เวรประจำเดือนนี้จัดครบถ้วนสมบูรณ์ 100%!</h3>
          <p class="text-sm text-emerald-700">ไม่มีเวรว่างค้างในแผนกแล้ว ทุกกะมีพยาบาลเข้าเวรครบตามเกณฑ์มาตรฐาน</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="col-span-full p-10 text-center glass-card rounded-3xl border border-slate-200">
          <div class="text-4xl mb-2">🔍</div>
          <p class="text-slate-600 font-bold text-sm">ไม่พบเวรที่ว่างตรงตามเงื่อนไขที่เลือก</p>
        </div>
      `;
    }
  } else {
    container.innerHTML = cardsHtml;
  }
}

window.handleQuickBookShift = function(day, shift) {
  if (!currentUser) {
    // Open nurse login first
    openNurseLoginModal();
    return;
  }
  if (currentUser.role === 'nurse') {
    populateBookingModal(currentUser.nurseId);
    // Pre-check shift and date
    const shiftRadios = document.getElementsByName('modalShift');
    shiftRadios.forEach(r => { if (r.value === shift) r.checked = true; });
    
    // Check specific date checkbox
    setTimeout(() => {
      const dateCheckboxes = document.getElementsByName('bookingDates');
      dateCheckboxes.forEach(cb => { cb.checked = (parseInt(cb.value) === day); });
      document.getElementById('bookingModal').classList.remove('hidden');
    }, 50);
  } else if (currentUser.role === 'admin') {
    openBookingModal();
    const shiftRadios = document.getElementsByName('modalShift');
    shiftRadios.forEach(r => { if (r.value === shift) r.checked = true; });
    setTimeout(() => {
      const dateCheckboxes = document.getElementsByName('bookingDates');
      dateCheckboxes.forEach(cb => { cb.checked = (parseInt(cb.value) === day); });
    }, 50);
  }
};

// 7. NURSE PERSONAL CALENDAR VIEW (ตัวเลขวันที่ใหญ่ขึ้น, วัน ใหญ่ขึ้น, Emojis ขนาดใหญ่)
function renderNurseCalendar() {
  if (!currentUser || currentUser.role !== 'nurse') return;

  const nurseId = currentUser.nurseId;
  const daysCount = getDaysCount(currentYear, currentMonth);
  const firstDayIndex = getFirstDayIndex(currentYear, currentMonth);

  // Status Banner
  const statusBanner = document.getElementById('nurseRoundStatusBanner');
  let roundText = '';
  let roundColor = '';

  if (monthState.round === 1) {
    roundText = `
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-2.5">
          <span class="px-3.5 py-1.5 rounded-xl font-black text-xs bg-blue-700 text-white shadow-xs">รอบที่ 1: เปิดจองทั่วไป</span>
          <span class="text-xs text-blue-950 font-medium">คุณสามารถเลือกจองเวรเช้า บ่าย ดึก ในวันที่ต้องการได้อย่างอิสระ</span>
        </div>
        <button onclick="openPersonalBookingModal()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition">
          + จองเวรของฉัน
        </button>
      </div>`;
    roundColor = 'bg-blue-50/90 border-blue-200';
  } else if (monthState.round === 2) {
    const vacancies = calculateVacancies();
    roundText = `
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-2.5">
          <span class="px-3.5 py-1.5 rounded-xl font-black text-xs bg-amber-500 text-white shadow-xs">รอบที่ 2: เปิดให้เลือกเวรที่ว่าง</span>
          <span class="text-xs text-amber-950 font-medium">มีเวรที่ยังขาดคนจากรอบแรก <b>${vacancies.length} กะ</b> คุณสามารถเลือกช่วยรับเวรเพิ่มได้</span>
        </div>
      </div>`;
    roundColor = 'bg-amber-50/90 border-amber-200';
  } else {
    roundText = `
      <div class="flex items-center gap-2.5">
        <span class="px-3.5 py-1.5 rounded-xl font-black text-xs bg-emerald-600 text-white shadow-xs">ตารางเวรเสร็จสมบูรณ์</span>
        <span class="text-xs text-emerald-950 font-medium">ระบบได้ทำการ Optimize จัดตารางเวรและตรวจสอบความปลอดภัยเรียบร้อยแล้ว</span>
      </div>`;
    roundColor = 'bg-emerald-50/90 border-emerald-200';
  }

  statusBanner.className = `p-4 rounded-2xl border ${roundColor} mb-6 transition shadow-xs`;
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

  // Render 7-Day Monthly Calendar Grid Body: ตัวเลขวันที่ใหญ่ขึ้น (text-2xl md:text-3xl)
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

  // Days 1..daysCount
  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const dayShifts = nurseShifts[d] || [];

    let shiftBadges = '';
    dayShifts.forEach(s => {
      if (s === 'M') shiftBadges += `<span class="shift-tag shift-m w-full text-center text-xs md:text-sm py-1 font-bold flex items-center justify-center gap-1"><span>☀️</span> เช้า (08:30-16:30)</span>`;
      if (s === 'A') shiftBadges += `<span class="shift-tag shift-a w-full text-center text-xs md:text-sm py-1 font-bold flex items-center justify-center gap-1"><span>⛅</span> บ่าย (16:30-00:30)</span>`;
      if (s === 'N') shiftBadges += `<span class="shift-tag shift-n w-full text-center text-xs md:text-sm py-1 font-bold flex items-center justify-center gap-1"><span>🌙</span> ดึก (00:30-08:30)</span>`;
    });

    const isEditable = (monthState.round === 1 || monthState.round === 2);
    const clickAttr = isEditable ? `onclick="openCellEditor('${nurseId}', ${d})"` : '';

    const weekendCardStyle = isWeekend 
      ? 'bg-rose-50/70 border-rose-200/90 hover:border-rose-400' 
      : 'glass-card hover:border-blue-400';

    calHtml += `
      <div class="calendar-day-cell rounded-2xl border p-3 md:p-3.5 flex flex-col justify-between shadow-xs transition ${weekendCardStyle} ${isEditable ? 'cursor-pointer' : ''}" ${clickAttr}>
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <span class="text-2xl md:text-3xl font-black ${isWeekend ? 'text-rose-600' : 'text-slate-900'}">${d}</span>
          <span class="text-xs md:text-sm font-extrabold px-2 py-0.5 rounded-lg ${isWeekend ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}">
            ${CALENDAR_HEADERS[dayOfWeek].short}
          </span>
        </div>
        <div class="mt-2 space-y-1.5">
          ${shiftBadges || `<span class="text-xs text-slate-400 font-medium italic block text-center py-2">${isEditable ? '+ แตะเลือกเวร' : 'ว่าง'}</span>`}
        </div>
      </div>
    `;
  }

  calGrid.innerHTML = calHtml;

  // Round 2 Vacancies Section
  const round2Container = document.getElementById('nurseRound2VacanciesSection');
  if (monthState.round === 2) {
    round2Container.classList.remove('hidden');
    renderNurseRound2Vacancies();
  } else {
    round2Container.classList.add('hidden');
  }
}

function renderNurseRound2Vacancies() {
  const container = document.getElementById('nurseRound2List');
  const vacancies = calculateVacancies();

  if (vacancies.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-500 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <span class="text-emerald-700 font-bold">🎉 เวรเต็มหมดแล้ว! ไม่มีเวรที่ยังขาดคนในรอบนี้</span>
      </div>`;
    return;
  }

  let html = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">`;
  vacancies.forEach(v => {
    const dt = new Date(currentYear, currentMonth, v.day);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    const nurseId = currentUser.nurseId;
    const currentShifts = (monthState.roster[nurseId] && monthState.roster[nurseId][v.day]) || [];
    const alreadyBooked = currentShifts.includes(v.shift);

    html += `
      <div class="p-3.5 rounded-2xl border bg-white shadow-xs flex items-center justify-between gap-3 ${alreadyBooked ? 'border-emerald-300 bg-emerald-50/40' : 'border-amber-200'}">
        <div>
          <div class="flex items-center gap-1.5 mb-1">
            <span class="font-black text-slate-900 text-sm">วันที่ ${v.day} (${CALENDAR_HEADERS[dayOfWeek].short})</span>
            ${isWeekend ? '<span class="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold">ส-อา</span>' : ''}
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-base">${v.icon}</span>
            <span class="font-bold text-slate-800">${v.shiftName}</span>
            <span class="text-slate-500 font-mono text-[11px]">${v.time.split(' ')[0]}</span>
          </div>
          <div class="text-[11px] text-rose-700 mt-1 font-semibold">
            ยังขาด ${v.missing} คน (มีแล้ว ${v.currentCount}/${v.required})
          </div>
        </div>

        <div>
          ${alreadyBooked ? `
            <span class="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1">
              ✓ จองแล้ว
            </span>
          ` : `
            <button onclick="nurseClaimRound2Shift(${v.day}, '${v.shift}')" class="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition transform hover:scale-105">
              + รับเวรนี้
            </button>
          `}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

window.nurseClaimRound2Shift = function(day, shift) {
  if (!currentUser || currentUser.role !== 'nurse') return;
  const nurseId = currentUser.nurseId;
  if (!monthState.roster[nurseId]) monthState.roster[nurseId] = {};
  if (!monthState.roster[nurseId][day]) monthState.roster[nurseId][day] = [];

  if (!monthState.roster[nurseId][day].includes(shift)) {
    monthState.roster[nurseId][day].push(shift);
    if (!monthState.round2[nurseId]) monthState.round2[nurseId] = {};
    if (!monthState.round2[nurseId][day]) monthState.round2[nurseId][day] = [];
    monthState.round2[nurseId][day].push(shift);

    saveMonthState();
    renderNurseCalendar();
  }
};

// 8. ADMIN MASTER MATRIX & CONTROLS
function renderAdminView() {
  renderAdminControls();
  renderAdminSubView();
}

function renderAdminControls() {
  const r1Btn = document.getElementById('adminRound1Btn');
  const r2Btn = document.getElementById('adminRound2Btn');
  const rFinalBtn = document.getElementById('adminRoundFinalBtn');

  const baseClass = "px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border";
  r1Btn.className = `${baseClass} ${monthState.round === 1 ? 'bg-blue-700 text-white border-blue-700 shadow-sm' : 'bg-white text-slate-700 border-slate-300'}`;
  r2Btn.className = `${baseClass} ${monthState.round === 2 ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-white text-slate-700 border-slate-300'}`;
  rFinalBtn.className = `${baseClass} ${monthState.round === 3 ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300'}`;
}

function renderAdminSubView() {
  const views = ['matrix', 'daily', 'summary', 'vacancies'];
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
      <td class="sticky-col-1 ${stickyBg} py-2.5 px-2 text-center text-slate-500 border-r border-slate-200">${idx + 1}</td>
      <td class="sticky-col-2 ${stickyBg} py-2.5 px-3 font-mono font-bold text-blue-900 border-r border-slate-200">${nurse.id}</td>
      <td class="sticky-col-3 ${stickyBg} py-2.5 px-3 text-slate-800 border-r-2 border-slate-300 whitespace-nowrap font-medium">${nurse.name}</td>`;

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
      เวรที่ขาด (ต่อวัน):
    </td>`;

  for (let d = 1; d <= daysCount; d++) {
    let dayM = 0, dayA = 0, dayN = 0;
    NURSES.forEach(n => {
      const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
      if (shifts.includes('M')) dayM++;
      if (shifts.includes('A')) dayA++;
      if (shifts.includes('N')) dayN++;
    });

    const isDeficit = (dayM < shiftQuota.M || dayA < shiftQuota.A || dayN < shiftQuota.N);
    const bgClass = isDeficit ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-600';

    f += `<td class="p-1 text-center border-r border-slate-200 text-[10px] leading-tight ${bgClass}">
      <div>${dayM}/${shiftQuota.M}</div>
      <div>${dayA}/${shiftQuota.A}</div>
      <div>${dayN}/${shiftQuota.N}</div>
    </td>`;
  }

  f += `
    <td colspan="4" class="p-2 text-center text-[10px] text-slate-500 border-l-2 border-slate-300">
      รวมทั้งแผนก
    </td>
  </tr>`;
  tfoot.innerHTML = f;
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

    const isDeficit = (mNurses.length < shiftQuota.M || aNurses.length < shiftQuota.A || nNurses.length < shiftQuota.N);

    html += `
      <div class="glass-card rounded-2xl p-4 border ${isDeficit ? 'border-rose-300' : 'border-slate-200'}">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div>
            <span class="text-xl font-black ${isWeekend ? 'text-rose-600' : 'text-slate-900'}">${d}</span>
            <span class="text-xs font-bold text-slate-700 ml-1">วัน${dayName}</span>
          </div>
          ${isDeficit ? '<span class="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">ยังไม่ครบ</span>' : '<span class="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">ครบถ้วน</span>'}
        </div>

        <div class="space-y-2 text-xs">
          <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
            <div class="font-bold text-sky-900 flex justify-between">
              <span>☀️ เช้า (08:30-16:30)</span>
              <span class="font-mono">${mNurses.length}/${shiftQuota.M}</span>
            </div>
            <div class="text-[11px] text-sky-800 mt-1">${mNurses.join(', ') || '<span class="text-rose-500 font-semibold italic">ขาดคน</span>'}</div>
          </div>

          <div class="p-2 rounded-xl bg-amber-50 border border-amber-200">
            <div class="font-bold text-amber-900 flex justify-between">
              <span>⛅ บ่าย (16:30-00:30)</span>
              <span class="font-mono">${aNurses.length}/${shiftQuota.A}</span>
            </div>
            <div class="text-[11px] text-amber-800 mt-1">${aNurses.join(', ') || '<span class="text-rose-500 font-semibold italic">ขาดคน</span>'}</div>
          </div>

          <div class="p-2 rounded-xl bg-purple-50 border border-purple-200">
            <div class="font-bold text-purple-900 flex justify-between">
              <span>🌙 ดึก (00:30-08:30)</span>
              <span class="font-mono">${nNurses.length}/${shiftQuota.N}</span>
            </div>
            <div class="text-[11px] text-purple-800 mt-1">${nNurses.join(', ') || '<span class="text-rose-500 font-semibold italic">ขาดคน</span>'}</div>
          </div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function renderSummaryView() {
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
        <td class="py-2.5 px-4 font-medium text-slate-500">${index + 1}</td>
        <td class="py-2.5 px-4 font-mono font-bold text-blue-900">${nurse.id}</td>
        <td class="py-2.5 px-4 font-semibold text-slate-800">${nurse.name}</td>
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
  const vacancies = calculateVacancies();

  if (vacancies.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-600 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <h4 class="text-lg font-bold text-emerald-800 mb-1">🎉 ตารางเวรมีพยาบาลครบถ้วน 100%!</h4>
        <p class="text-sm text-emerald-600">ไม่มีเวรที่ขาดคน สามารถปิดรอบและส่งออกตารางเป็นไฟล์ Excel ได้ทันที</p>
      </div>`;
    return;
  }

  let html = `
    <div class="mb-4 flex items-center justify-between">
      <div class="text-sm text-slate-600">เวรที่ยังขาดคนทั้งหมด: <b class="text-rose-600 font-bold">${vacancies.length} กะ</b></div>
      <button onclick="runOptimization()" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5">
        ⚡ รัน Optimize เกลี่ยเวรและเติมเต็มอัตโนมัติ
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">`;

  vacancies.forEach(v => {
    const dt = new Date(currentYear, currentMonth, v.day);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    html += `
      <div class="p-3.5 rounded-2xl border border-rose-200 bg-white shadow-xs">
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-slate-800 text-sm">วันที่ ${v.day} (${CALENDAR_HEADERS[dayOfWeek].short})</span>
          ${isWeekend ? '<span class="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">วันหยุด</span>' : ''}
        </div>
        <div class="text-xs font-semibold text-blue-900 mb-1">${v.shiftName} (${v.time.split(' ')[0]})</div>
        <div class="text-xs text-rose-600 font-bold mb-2">ขาดอีก ${v.missing} คน (มีแล้ว ${v.currentCount}/${v.required})</div>
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

// 9. CELL EDIT MODAL LOGIC
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
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminSubView();
  if (activeView === 'dashboard') renderPublicDashboard();
}

function clearCellShifts() {
  if (!activeEditNurseId || !activeEditDay) return;
  if (monthState.roster[activeEditNurseId]) {
    delete monthState.roster[activeEditNurseId][activeEditDay];
  }
  saveMonthState();
  closeCellEditor();
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminSubView();
  if (activeView === 'dashboard') renderPublicDashboard();
}

// 10. QUICK BOOKING MODAL (WITH ENLARGED DATES)
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

  // 3. Render actual dates with enlarged numbers
  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    html += `
      <label class="p-2 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition select-none ${isWeekend ? 'bg-rose-50/70 border-rose-200 text-rose-900' : 'bg-white border-slate-200'} has-checked:bg-blue-600 has-checked:border-blue-600 has-checked:text-white hover:border-blue-400">
        <input type="checkbox" name="bookingDates" value="${d}" class="hidden">
        <span class="text-sm font-black">${d}</span>
      </label>
    `;
  }
  dateCont.innerHTML = html;
}

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
  if (activeView === 'personal') renderNurseCalendar();
  if (activeView === 'admin') renderAdminSubView();
  if (activeView === 'dashboard') renderPublicDashboard();
}

// 11. AUTOMATED SHIFT OPTIMIZER ALGORITHM
function runOptimization() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  const beforeVacancies = calculateVacancies();

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

  for (let d = 1; d <= daysCount; d++) {
    ['N', 'A', 'M'].forEach(s => {
      const req = shiftQuota[s];
      let assignedNurses = [];
      NURSES.forEach(n => {
        if (optimizedRoster[n.id] && optimizedRoster[n.id][d] && optimizedRoster[n.id][d].includes(s)) {
          assignedNurses.push(n.id);
        }
      });

      let deficit = req - assignedNurses.length;
      if (deficit <= 0) return;

      const candidates = NURSES.filter(n => {
        const todayShifts = (optimizedRoster[n.id] && optimizedRoster[n.id][d]) || [];
        if (todayShifts.length > 0) return false;

        // Rest rules: If shift is M, check yesterday night
        if (s === 'M' && d > 1) {
          const yShifts = (optimizedRoster[n.id] && optimizedRoster[n.id][d - 1]) || [];
          if (yShifts.includes('N')) return false;
        }
        return true;
      });

      candidates.sort((a, b) => nurseDutyCounts[a.id] - nurseDutyCounts[b.id]);

      for (let i = 0; i < deficit && i < candidates.length; i++) {
        const picked = candidates[i];
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
    });
  }

  window.pendingOptimizedRoster = optimizedRoster;

  const modalBody = document.getElementById('optimizeModalBody');
  if (assignedLog.length === 0) {
    modalBody.innerHTML = `
      <div class="p-6 text-center bg-emerald-50 border border-emerald-200 rounded-2xl">
        <h4 class="font-bold text-emerald-800 text-sm mb-1">🎉 ตารางเวรมีพยาบาลครบถ้วนอยู่แล้ว</h4>
        <p class="text-xs text-emerald-600">ไม่ต้องเติมเวรเพิ่มเติม ระบบจัดสมดุลได้ 100%</p>
      </div>`;
  } else {
    let logHtml = `
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-4 text-xs text-blue-900">
        <div class="font-bold mb-1">ผลการประมวลผล:</div>
        <div>ระบบได้จัดพยาบาลเติมเต็มเวรที่ยังขาดไปทั้งหมด <b>${assignedLog.length} ตำแหน่ง</b> โดยกระจายเวรให้พยาบาลที่มีชั่วโมงเวรน้อยที่สุดอย่างเป็นธรรม</div>
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

// 12. EVENT LISTENERS INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  loadMonthState();
  initAuth();

  // Month navigation
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
  document.getElementById('viewDailyBtn')?.addEventListener('click', () => { adminActiveSubView = 'daily'; renderAdminSubView(); });
  document.getElementById('viewSummaryBtn')?.addEventListener('click', () => { adminActiveSubView = 'summary'; renderAdminSubView(); });
  document.getElementById('viewVacanciesBtn')?.addEventListener('click', () => { adminActiveSubView = 'vacancies'; renderAdminSubView(); });

  // Admin Round Control Buttons
  document.getElementById('adminRound1Btn')?.addEventListener('click', () => {
    monthState.round = 1;
    saveMonthState();
    renderAdminControls();
  });
  document.getElementById('adminRound2Btn')?.addEventListener('click', () => {
    monthState.round = 2;
    saveMonthState();
    renderAdminControls();
  });
  document.getElementById('adminRoundFinalBtn')?.addEventListener('click', () => {
    monthState.round = 3;
    saveMonthState();
    renderAdminControls();
  });

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
  document.getElementById('selectAllDatesBtn')?.addEventListener('click', () => {
    const cbs = document.getElementsByName('bookingDates');
    const allChecked = Array.from(cbs).every(c => c.checked);
    cbs.forEach(c => c.checked = !allChecked);
  });

  document.getElementById('closeOptimizeModalBtn')?.addEventListener('click', () => {
    document.getElementById('optimizeModal').classList.add('hidden');
  });
  document.getElementById('cancelOptimizeBtn')?.addEventListener('click', () => {
    document.getElementById('optimizeModal').classList.add('hidden');
  });
  document.getElementById('confirmOptimizeBtn')?.addEventListener('click', confirmOptimization);

  // Initial View
  if (currentUser) {
    if (currentUser.role === 'nurse') switchView('personal');
    else if (currentUser.role === 'admin') switchView('admin');
  } else {
    switchView('dashboard');
  }
});
