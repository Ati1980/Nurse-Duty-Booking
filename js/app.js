/**
 * Nurse Duty Booking & Roster System
 * Blue Glassmorphism Theme
 * Multi-Role Auth, True Calendar Grid, 2-Round Booking & Shift Optimizer
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
  M: { id: 'M', code: 'ช', name: 'เวรเช้า', time: '08:30 - 16:30 น.', hours: 8, badge: 'shift-m', defaultReq: 2 },
  A: { id: 'A', code: 'บ', name: 'เวรบ่าย', time: '16:30 - 00:30 น.', hours: 8, badge: 'shift-a', defaultReq: 2 },
  N: { id: 'N', code: 'ด', name: 'เวรดึก', time: '00:30 - 08:30 น.', hours: 8, badge: 'shift-n', defaultReq: 1 }
};

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// ลำดับวันตามปฏิทินสากล เริ่มจากวันอาทิตย์ (Sunday)
const CALENDAR_HEADERS = [
  { th: "อา.", en: "Sun", isWeekend: true, headerClass: "bg-rose-100/90 text-rose-800 border-rose-200" },
  { th: "จ.", en: "Mon", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-700 border-slate-200" },
  { th: "อ.", en: "Tue", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-700 border-slate-200" },
  { th: "พ.", en: "Wed", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-700 border-slate-200" },
  { th: "พฤ.", en: "Thu", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-700 border-slate-200" },
  { th: "ศ.", en: "Fri", isWeekend: false, headerClass: "bg-blue-50/90 text-slate-700 border-slate-200" },
  { th: "ส.", en: "Sat", isWeekend: true, headerClass: "bg-amber-100/90 text-amber-800 border-amber-200" }
];

// 2. Application State
let currentUser = null;
let currentYear = 2026;
let currentMonth = 8; // กันยายน (0-indexed: 8)
let currentView = 'matrix'; // 'matrix', 'daily', 'summary', 'vacancies'
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
      else if (hash === 7 && d % 4 === 0) sample[nurse.id][d] = ['M', 'A'];
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
          required: req,
          current: assigned.length,
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
    // Eye open icon with slash
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />`;
  } else {
    input.type = 'password';
    // Eye open icon
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
  }
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

  // Check PIN: default is the nurse's registered PIN (last 4 digits)
  if (enteredPin && enteredPin.trim() !== nurse.pin) {
    alert(`รหัสผ่าน (PIN) ไม่ถูกต้อง (สำหรับ ${nurse.name} รหัสผ่านเริ่มต้นคือ ${nurse.pin})`);
    return false;
  }

  currentUser = {
    role: 'nurse',
    nurseId: nurse.id,
    name: nurse.name
  };
  localStorage.setItem('nurse_current_user', JSON.stringify(currentUser));
  updateAuthUI();
  return true;
}

function loginAsAdmin(username, password) {
  if (!password) {
    alert('กรุณากรอกรหัสผ่าน Admin');
    return false;
  }
  if (username.trim().toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
    currentUser = {
      role: 'admin',
      name: 'ผู้ดูแลระบบ (Admin)'
    };
    localStorage.setItem('nurse_current_user', JSON.stringify(currentUser));
    updateAuthUI();
    return true;
  }
  alert('ชื่อผู้ใช้หรือรหัสผ่าน Admin ไม่ถูกต้อง (รหัสผ่านคือ 1234)');
  return false;
}

function logout() {
  currentUser = null;
  localStorage.removeItem('nurse_current_user');
  updateAuthUI();
}

function updateAuthUI() {
  const loginScreen = document.getElementById('loginScreen');
  const appContainer = document.getElementById('appContainer');
  const userProfileBadge = document.getElementById('userProfileBadge');
  const adminControlsSection = document.getElementById('adminControlsSection');
  const nursePersonalSection = document.getElementById('nursePersonalSection');
  const masterMatrixSection = document.getElementById('masterMatrixSection');

  if (!currentUser) {
    loginScreen.classList.remove('hidden');
    appContainer.classList.add('hidden');
    populateLoginNurseSelect();
  } else {
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');

    if (currentUser.role === 'admin') {
      userProfileBadge.innerHTML = `
        <div class="flex items-center gap-2 bg-blue-900/60 border border-blue-400/40 px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40 animate-pulse"></span>
          <span class="font-bold text-blue-100">👑 ผู้ดูแลระบบ (Admin)</span>
        </div>
      `;
      adminControlsSection.classList.remove('hidden');
      nursePersonalSection.classList.add('hidden');
      masterMatrixSection.classList.remove('hidden');
    } else {
      userProfileBadge.innerHTML = `
        <div class="flex items-center gap-2 bg-blue-900/60 border border-blue-400/40 px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-md shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-sky-300 ring-2 ring-sky-300/40"></span>
          <span class="font-bold text-blue-100">👩‍⚕️ ${currentUser.name}</span>
          <span class="font-mono text-blue-200/80">(${currentUser.nurseId})</span>
        </div>
      `;
      adminControlsSection.classList.add('hidden');
      nursePersonalSection.classList.remove('hidden');
      masterMatrixSection.classList.add('hidden');
    }

    renderActiveView();
  }
}

function populateLoginNurseSelect() {
  const sel = document.getElementById('loginNurseIdSelect');
  if (!sel) return;
  sel.innerHTML = '<option value="">-- เลือกรหัสพยาบาลของคุณ --</option>' + 
    NURSES.map(n => `<option value="${n.id}">[${n.id}] ${n.name}</option>`).join('');

  sel.addEventListener('change', () => {
    const chosen = NURSES.find(n => n.id === sel.value);
    const hint = document.getElementById('nursePinHint');
    if (chosen && hint) {
      hint.innerText = `รหัสผ่านเริ่มต้นของ ${chosen.name} คือเลขท้าย 4 ตัว: ${chosen.pin}`;
      hint.classList.remove('hidden');
    }
  });
}

// 5. Nurse View with True 7-Column Calendar Grid
function renderNurseView() {
  if (!currentUser || currentUser.role !== 'nurse') return;

  const nurseId = currentUser.nurseId;
  const daysCount = getDaysCount(currentYear, currentMonth);
  const firstDayIndex = getFirstDayIndex(currentYear, currentMonth); // 0 = Sunday
  const nurseShifts = monthState.roster[nurseId] || {};

  // Status Banner according to active round
  const statusBanner = document.getElementById('nurseRoundStatusBanner');
  let roundText = '';
  let roundColor = '';

  if (monthState.round === 1) {
    roundText = `
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-2.5">
          <span class="px-3 py-1 rounded-lg font-bold text-xs bg-blue-600 text-white shadow-xs">รอบที่ 1: เปิดจองทั่วไป</span>
          <span class="text-xs text-blue-950 font-medium">คุณสามารถเลือกจองเวรเช้า บ่าย ดึก ในวันที่ต้องการได้อย่างอิสระ</span>
        </div>
        <button onclick="openPersonalBookingModal()" class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition transform hover:-translate-y-0.5">
          + จองเวรของฉัน
        </button>
      </div>`;
    roundColor = 'bg-blue-50/90 border-blue-200';
  } else if (monthState.round === 2) {
    const vacancies = calculateVacancies();
    roundText = `
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-2.5">
          <span class="px-3 py-1 rounded-lg font-bold text-xs bg-amber-500 text-white shadow-xs">รอบที่ 2: เปิดจองเวรที่ยังว่าง</span>
          <span class="text-xs text-amber-950 font-medium">พบเวรที่ยังขาดคนทั้งหมด <b>${vacancies.length} กะ</b> คุณสามารถเลือกรับเวรเพิ่มเติมได้ในส่วนด้านล่าง</span>
        </div>
      </div>`;
    roundColor = 'bg-amber-50/90 border-amber-200';
  } else {
    roundText = `
      <div class="flex items-center gap-2.5">
        <span class="px-3 py-1 rounded-lg font-bold text-xs bg-emerald-600 text-white shadow-xs">ตารางเวรเสร็จสมบูรณ์</span>
        <span class="text-xs text-emerald-950 font-medium">ผู้ดูแลระบบได้ทำการ Optimize และจัดตารางเวรเรียบร้อยแล้ว ด้านล่างคือตารางเวรทางการของคุณ</span>
      </div>`;
    roundColor = 'bg-emerald-50/90 border-emerald-200';
  }

  statusBanner.className = `p-4 rounded-2xl border ${roundColor} mb-6 transition shadow-xs`;
  statusBanner.innerHTML = roundText;

  // Personal Stats Calculation
  let countM = 0, countA = 0, countN = 0;
  for (let d = 1; d <= daysCount; d++) {
    const s = nurseShifts[d] || [];
    if (s.includes('M')) countM++;
    if (s.includes('A')) countA++;
    if (s.includes('N')) countN++;
  }
  const totalShifts = countM + countA + countN;
  const totalHours = totalShifts * 8;

  document.getElementById('nurseStatM').innerText = `${countM} ครั้ง`;
  document.getElementById('nurseStatA').innerText = `${countA} ครั้ง`;
  document.getElementById('nurseStatN').innerText = `${countN} ครั้ง`;
  document.getElementById('nurseStatTotal').innerText = `${totalShifts} เวร (${totalHours} ชม.)`;

  // Render REAL Standard 7-Day Monthly Calendar Grid (Sun to Sat)
  const calHeader = document.getElementById('nurseCalendarHeader');
  let hHtml = '';
  CALENDAR_HEADERS.forEach(ch => {
    hHtml += `
      <div class="p-2.5 text-center text-xs font-bold rounded-xl border ${ch.headerClass} shadow-xs">
        <div>${ch.th}</div>
        <div class="text-[10px] opacity-75 font-normal font-mono">${ch.en}</div>
      </div>
    `;
  });
  calHeader.innerHTML = hHtml;

  const calGrid = document.getElementById('nurseCalendarGrid');
  let calHtml = '';

  // 1. Prepend empty placeholder cells for days before the 1st of the month
  for (let pad = 0; pad < firstDayIndex; pad++) {
    calHtml += `
      <div class="calendar-empty-cell p-2 flex items-start justify-end text-slate-300 text-xs select-none">
        <span class="opacity-40 font-mono">•</span>
      </div>
    `;
  }

  // 2. Render actual days 1 to daysCount
  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay(); // 0 = Sun, 6 = Sat
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const dayShifts = nurseShifts[d] || [];

    let shiftBadges = '';
    dayShifts.forEach(s => {
      if (s === 'M') shiftBadges += `<span class="shift-tag shift-m w-full text-center">☀️ เช้า (08:30-16:30)</span>`;
      if (s === 'A') shiftBadges += `<span class="shift-tag shift-a w-full text-center">⛅ บ่าย (16:30-00:30)</span>`;
      if (s === 'N') shiftBadges += `<span class="shift-tag shift-n w-full text-center">🌙 ดึก (00:30-08:30)</span>`;
    });

    const isEditable = (monthState.round === 1 || monthState.round === 2);
    const clickAttr = isEditable ? `onclick="openCellEditor('${nurseId}', ${d})"` : '';

    const weekendCardStyle = isWeekend 
      ? 'bg-rose-50/60 border-rose-200/80 hover:border-rose-400' 
      : 'glass-card hover:border-blue-400';

    calHtml += `
      <div class="calendar-day-cell rounded-2xl border p-2.5 flex flex-col justify-between shadow-xs transition ${weekendCardStyle} ${isEditable ? 'cursor-pointer' : ''}" ${clickAttr}>
        <div class="flex items-center justify-between pb-1 border-b border-slate-100">
          <span class="text-sm font-black ${isWeekend ? 'text-rose-700' : 'text-slate-800'}">${d}</span>
          <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded ${isWeekend ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}">
            ${CALENDAR_HEADERS[dayOfWeek].th}
          </span>
        </div>
        <div class="mt-1.5 space-y-1">
          ${shiftBadges || `<span class="text-[10px] text-slate-400 italic block text-center py-1">${isEditable ? '+ เลือกเวร' : 'ว่าง'}</span>`}
        </div>
      </div>
    `;
  }

  calGrid.innerHTML = calHtml;

  // Round 2 Vacant Shifts Section
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
        <span class="text-emerald-700 font-bold">🎉 ยอดเยี่ยมมาก! ทุกกะเวลาของเดือนนี้มีพยาบาลครบตามเกณฑ์แล้ว</span>
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
      <div class="bg-white border border-amber-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:border-amber-400 transition">
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-base font-bold text-slate-800">วันที่ ${v.day}</span>
              <span class="text-[11px] px-2 py-0.5 rounded font-semibold ${isWeekend ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}">${CALENDAR_HEADERS[dayOfWeek].th}</span>
            </div>
            <span class="vacant-badge pulse-vacant">ขาดอีก ${v.missing} คน</span>
          </div>

          <div class="flex items-center gap-2 mb-2.5">
            <span class="shift-tag ${SHIFTS[v.shift].badge}">${v.shiftName}</span>
            <span class="text-xs text-slate-500 font-mono">${v.time}</span>
          </div>
        </div>

        <div>
          ${alreadyBooked ? 
            `<button disabled class="w-full py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed">
              ✓ คุณลงเวรนี้แล้ว
            </button>` :
            `<button onclick="claimVacantShift(${v.day}, '${v.shift}')" class="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-sm transition">
              + เลือกรับเวรนี้ (รอบ 2)
            </button>`
          }
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

window.claimVacantShift = function(day, shift) {
  if (!currentUser || currentUser.role !== 'nurse') return;
  const nurseId = currentUser.nurseId;

  if (!monthState.roster[nurseId]) monthState.roster[nurseId] = {};
  if (!monthState.roster[nurseId][day]) monthState.roster[nurseId][day] = [];

  if (!monthState.roster[nurseId][day].includes(shift)) {
    monthState.roster[nurseId][day].push(shift);
  }

  if (!monthState.round2[nurseId]) monthState.round2[nurseId] = {};
  if (!monthState.round2[nurseId][day]) monthState.round2[nurseId][day] = [];
  if (!monthState.round2[nurseId][day].includes(shift)) {
    monthState.round2[nurseId][day].push(shift);
  }

  saveMonthState();
  renderActiveView();
};

// 6. Admin Master View Rendering
function renderAdminView() {
  updateRoundPills();
  if (currentView === 'matrix') renderMatrix();
  else if (currentView === 'daily') renderDailyView();
  else if (currentView === 'summary') renderSummaryView();
  else if (currentView === 'vacancies') renderAdminVacanciesView();
}

function updateRoundPills() {
  const round1Btn = document.getElementById('adminRound1Btn');
  const round2Btn = document.getElementById('adminRound2Btn');
  const roundFinalBtn = document.getElementById('adminRoundFinalBtn');

  const baseClass = "px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border";
  
  round1Btn.className = `${baseClass} ${monthState.round === 1 ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`;
  round2Btn.className = `${baseClass} ${monthState.round === 2 ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`;
  roundFinalBtn.className = `${baseClass} ${monthState.round === 3 ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`;
}

function renderMatrix() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  const thead = document.getElementById('matrixHeader');
  const tbody = document.getElementById('matrixBody');
  const tfoot = document.getElementById('matrixFooter');

  let h = `<tr>
    <th class="sticky-col-1 bg-slate-100 py-3 px-2 text-center w-12 border-r border-slate-300">#</th>
    <th class="sticky-col-2 bg-slate-100 py-3 px-3 text-left w-24 border-r border-slate-300">รหัส</th>
    <th class="sticky-col-3 bg-slate-100 py-3 px-3 text-left w-48 border-r-2 border-slate-300">ชื่อ - นามสกุล</th>`;

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const weekendClass = isWeekend ? 'bg-rose-50 text-rose-700 font-bold' : 'bg-slate-100 text-slate-700';

    h += `<th class="py-2 px-1 text-center min-w-[38px] border-r border-slate-200 ${weekendClass}">
      <div class="text-[10px] opacity-80">${CALENDAR_HEADERS[dayOfWeek].th}</div>
      <div class="text-sm font-bold">${d}</div>
    </th>`;
  }

  h += `
    <th class="py-3 px-2 text-center w-14 bg-sky-100 text-sky-800 border-l-2 border-slate-300">เช้า</th>
    <th class="py-3 px-2 text-center w-14 bg-amber-100 text-amber-800 border-l border-slate-300">บ่าย</th>
    <th class="py-3 px-2 text-center w-14 bg-purple-100 text-purple-800 border-l border-slate-300">ดึก</th>
    <th class="py-3 px-2 text-center w-16 bg-blue-100 text-blue-950 border-l border-slate-300">รวม</th>
  </tr>`;
  thead.innerHTML = h;

  const filteredNurses = NURSES.filter(n => {
    if (!searchQuery) return true;
    return n.name.includes(searchQuery) || n.id.includes(searchQuery);
  });

  let b = '';
  filteredNurses.forEach((nurse, idx) => {
    const nurseShifts = monthState.roster[nurse.id] || {};
    let countM = 0, countA = 0, countN = 0;

    b += `<tr class="hover:bg-blue-50/50 transition">
      <td class="sticky-col-1 bg-white py-2.5 px-2 text-center font-medium text-slate-400 border-r border-slate-200">${idx + 1}</td>
      <td class="sticky-col-2 bg-white py-2.5 px-3 font-mono font-bold text-blue-900 border-r border-slate-200">${nurse.id}</td>
      <td class="sticky-col-3 bg-white py-2.5 px-3 font-medium text-slate-800 border-r-2 border-slate-300 whitespace-nowrap">${nurse.name}</td>`;

    for (let d = 1; d <= daysCount; d++) {
      const dt = new Date(currentYear, currentMonth, d);
      const isWeekend = (dt.getDay() === 0 || dt.getDay() === 6);
      const weekendBg = isWeekend ? 'bg-rose-50/20' : '';
      const dayShifts = nurseShifts[d] || [];

      let tags = '';
      dayShifts.forEach(s => {
        if (s === 'M') { countM++; tags += `<span class="shift-tag shift-m">ช</span>`; }
        if (s === 'A') { countA++; tags += `<span class="shift-tag shift-a">บ</span>`; }
        if (s === 'N') { countN++; tags += `<span class="shift-tag shift-n">ด</span>`; }
      });

      b += `<td class="p-1 text-center border-r border-slate-200 cursor-pointer hover:bg-blue-100/60 transition ${weekendBg}"
               onclick="openCellEditor('${nurse.id}', ${d})">
        <div class="min-h-[26px] flex items-center justify-center gap-0.5 flex-wrap">
          ${tags || '<span class="text-slate-300 text-[10px] font-bold hover:text-blue-600">+</span>'}
        </div>
      </td>`;
    }

    const total = countM + countA + countN;
    b += `
      <td class="py-2 px-1 text-center font-bold text-sky-700 bg-sky-50/50 border-l-2 border-slate-300">${countM}</td>
      <td class="py-2 px-1 text-center font-bold text-amber-700 bg-amber-50/50 border-l border-slate-300">${countA}</td>
      <td class="py-2 px-1 text-center font-bold text-purple-700 bg-purple-50/50 border-l border-slate-300">${countN}</td>
      <td class="py-2 px-1 text-center font-black text-blue-900 bg-blue-50 border-l border-slate-300">${total}</td>
    </tr>`;
  });
  tbody.innerHTML = b;

  let fM = `<tr><td colspan="3" class="sticky-col-1 bg-sky-100 py-1.5 px-3 font-bold text-sky-900 border-r-2 border-slate-300 text-right">รวมเวรเช้า (เป้า ${shiftQuota.M})</td>`;
  let fA = `<tr><td colspan="3" class="sticky-col-1 bg-amber-100 py-1.5 px-3 font-bold text-amber-900 border-r-2 border-slate-300 text-right">รวมเวรบ่าย (เป้า ${shiftQuota.A})</td>`;
  let fN = `<tr><td colspan="3" class="sticky-col-1 bg-purple-100 py-1.5 px-3 font-bold text-purple-900 border-r-2 border-slate-300 text-right">รวมเวรดึก (เป้า ${shiftQuota.N})</td>`;

  let totM = 0, totA = 0, totN = 0;
  for (let d = 1; d <= daysCount; d++) {
    let dM = 0, dA = 0, dN = 0;
    NURSES.forEach(n => {
      const s = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
      if (s.includes('M')) dM++;
      if (s.includes('A')) dA++;
      if (s.includes('N')) dN++;
    });

    totM += dM;
    totA += dA;
    totN += dN;

    const warnM = dM < shiftQuota.M ? 'text-rose-600 bg-rose-50' : 'text-sky-800 bg-sky-50/70';
    const warnA = dA < shiftQuota.A ? 'text-rose-600 bg-rose-50' : 'text-amber-800 bg-amber-50/70';
    const warnN = dN < shiftQuota.N ? 'text-rose-600 bg-rose-50' : 'text-purple-800 bg-purple-50/70';

    fM += `<td class="p-1 text-center font-bold border-r border-slate-200 ${warnM}">${dM || '-'}</td>`;
    fA += `<td class="p-1 text-center font-bold border-r border-slate-200 ${warnA}">${dA || '-'}</td>`;
    fN += `<td class="p-1 text-center font-bold border-r border-slate-200 ${warnN}">${dN || '-'}</td>`;
  }

  fM += `<td class="text-center font-black text-sky-900 bg-sky-100 border-l-2 border-slate-300" colspan="4">${totM} เวร</td></tr>`;
  fA += `<td class="text-center font-black text-amber-900 bg-amber-100 border-l-2 border-slate-300" colspan="4">${totA} เวร</td></tr>`;
  fN += `<td class="text-center font-black text-purple-900 bg-purple-100 border-l-2 border-slate-300" colspan="4">${totN} เวร</td></tr>`;

  tfoot.innerHTML = fM + fA + fN;
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

    let mList = [], aList = [], nList = [];
    NURSES.forEach(nurse => {
      const s = (monthState.roster[nurse.id] && monthState.roster[nurse.id][d]) || [];
      if (s.includes('M')) mList.push(nurse.name);
      if (s.includes('A')) aList.push(nurse.name);
      if (s.includes('N')) nList.push(nurse.name);
    });

    html += `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition">
        <div class="p-3.5 border-b flex items-center justify-between ${isWeekend ? 'bg-rose-50 text-rose-900' : 'bg-slate-50 text-slate-800'}">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold">${d}</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded ${isWeekend ? 'bg-rose-200 text-rose-800' : 'bg-slate-200 text-slate-700'}">${dayName}</span>
          </div>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">${mList.length + aList.length + nList.length} คน</span>
        </div>

        <div class="p-3 space-y-2 flex-1 text-xs">
          <div class="bg-sky-50/80 p-2.5 rounded-xl border border-sky-100">
            <div class="font-bold text-sky-900 mb-1 flex items-center justify-between">
              <span>☀️ เวรเช้า</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${mList.length < shiftQuota.M ? 'bg-rose-200 text-rose-800' : 'bg-sky-200 text-sky-800'}">${mList.length}/${shiftQuota.M}</span>
            </div>
            <div class="text-slate-700 space-y-0.5">
              ${mList.length ? mList.map(name => `<div class="truncate">• ${name}</div>`).join('') : '<span class="text-rose-500 italic">ยังไม่มีพยาบาล</span>'}
            </div>
          </div>

          <div class="bg-amber-50/80 p-2.5 rounded-xl border border-amber-100">
            <div class="font-bold text-amber-900 mb-1 flex items-center justify-between">
              <span>⛅ เวรบ่าย</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${aList.length < shiftQuota.A ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'}">${aList.length}/${shiftQuota.A}</span>
            </div>
            <div class="text-slate-700 space-y-0.5">
              ${aList.length ? aList.map(name => `<div class="truncate">• ${name}</div>`).join('') : '<span class="text-rose-500 italic">ยังไม่มีพยาบาล</span>'}
            </div>
          </div>

          <div class="bg-purple-50/80 p-2.5 rounded-xl border border-purple-100">
            <div class="font-bold text-purple-900 mb-1 flex items-center justify-between">
              <span>🌙 เวรดึก</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${nList.length < shiftQuota.N ? 'bg-rose-200 text-rose-800' : 'bg-purple-200 text-purple-800'}">${nList.length}/${shiftQuota.N}</span>
            </div>
            <div class="text-slate-700 space-y-0.5">
              ${nList.length ? nList.map(name => `<div class="truncate">• ${name}</div>`).join('') : '<span class="text-rose-500 italic">ยังไม่มีพยาบาล</span>'}
            </div>
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

    html += `
      <tr class="hover:bg-blue-50/40 transition">
        <td class="py-2.5 px-4 font-medium text-slate-400">${index + 1}</td>
        <td class="py-2.5 px-4 font-mono font-bold text-blue-900">${nurse.id}</td>
        <td class="py-2.5 px-4 font-semibold text-slate-800">${nurse.name}</td>
        <td class="py-2.5 px-4 text-center text-sky-700 font-bold bg-sky-50/40">${m}</td>
        <td class="py-2.5 px-4 text-center text-amber-700 font-bold bg-amber-50/40">${a}</td>
        <td class="py-2.5 px-4 text-center text-purple-700 font-bold bg-purple-50/40">${n}</td>
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
        <h4 class="text-lg font-bold text-emerald-800 mb-1">🎉 ตารางเวรมีพยาบาลครบทุกกะแล้ว 100%!</h4>
        <p class="text-sm text-emerald-600">ไม่มีเวรที่ขาดคน สามารถสั่งพิมพ์หรือส่งออก Excel ได้ทันที</p>
      </div>`;
    return;
  }

  let html = `
    <div class="mb-4 flex items-center justify-between">
      <div class="text-sm text-slate-600">พบเวรที่ยังขาดพยาบาลทั้งหมด <b class="text-rose-600 font-bold">${vacancies.length} กะ</b></div>
      <button onclick="runOptimization()" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5">
        ⚡ รัน Optimize เติมเต็มเวรเหล่านี้อัตโนมัติ
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">`;

  vacancies.forEach(v => {
    const dt = new Date(currentYear, currentMonth, v.day);
    const dayOfWeek = dt.getDay();

    html += `
      <div class="bg-white border border-rose-200 rounded-2xl p-3.5 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="font-bold text-slate-800 text-sm">วันที่ ${v.day} (${CALENDAR_HEADERS[dayOfWeek].th})</span>
          <span class="vacant-badge">ขาด ${v.missing} คน</span>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <span class="shift-tag ${SHIFTS[v.shift].badge}">${v.shiftName}</span>
          <span class="text-xs text-slate-500">${v.time}</span>
        </div>
        <div class="text-[11px] text-slate-500">
          มีแล้ว: ${v.assigned.length ? v.assigned.map(n => n.name).join(', ') : 'ยังไม่มีพยาบาล'}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

// 7. Optimizer Engine
function runOptimization() {
  const days = getDaysCount(currentYear, currentMonth);
  const optimizedRoster = {};
  NURSES.forEach(n => { optimizedRoster[n.id] = {}; });
  const dutyCounts = {};
  NURSES.forEach(n => { dutyCounts[n.id] = 0; });

  let round1Kept = 0, round2Kept = 0, autoFilled = 0;

  // Step 1: Assign Round 1 requests
  for (let d = 1; d <= days; d++) {
    ['M', 'A', 'N'].forEach(s => {
      const req = shiftQuota[s];
      let assignedCount = 0;
      NURSES.forEach(n => {
        const r1Shifts = (monthState.round1[n.id] && monthState.round1[n.id][d]) || [];
        if (r1Shifts.includes(s) && assignedCount < req) {
          if (!optimizedRoster[n.id][d]) optimizedRoster[n.id][d] = [];
          if (!optimizedRoster[n.id][d].includes(s)) {
            optimizedRoster[n.id][d].push(s);
            dutyCounts[n.id]++;
            assignedCount++;
            round1Kept++;
          }
        }
      });
    });
  }

  // Step 2: Assign Round 2 requests
  for (let d = 1; d <= days; d++) {
    ['M', 'A', 'N'].forEach(s => {
      const req = shiftQuota[s];
      let currentAssigned = 0;
      NURSES.forEach(n => {
        if (optimizedRoster[n.id][d] && optimizedRoster[n.id][d].includes(s)) currentAssigned++;
      });

      NURSES.forEach(n => {
        const r2Shifts = (monthState.round2[n.id] && monthState.round2[n.id][d]) || [];
        if (r2Shifts.includes(s) && currentAssigned < req) {
          if (!optimizedRoster[n.id][d]) optimizedRoster[n.id][d] = [];
          if (!optimizedRoster[n.id][d].includes(s)) {
            optimizedRoster[n.id][d].push(s);
            dutyCounts[n.id]++;
            currentAssigned++;
            round2Kept++;
          }
        }
      });
    });
  }

  // Step 3: Fairly Auto-fill remaining vacant slots
  for (let d = 1; d <= days; d++) {
    ['M', 'A', 'N'].forEach(s => {
      const req = shiftQuota[s];
      let currentAssigned = 0;
      NURSES.forEach(n => {
        if (optimizedRoster[n.id][d] && optimizedRoster[n.id][d].includes(s)) currentAssigned++;
      });

      while (currentAssigned < req) {
        const candidates = NURSES.filter(n => {
          const dayShifts = optimizedRoster[n.id][d] || [];
          if (dayShifts.includes(s)) return false;
          if (dayShifts.length >= 2) return false;

          if (s === 'M' && d > 1) {
            const yShifts = optimizedRoster[n.id][d - 1] || [];
            if (yShifts.includes('N')) return false;
          }
          if (s === 'N' && d < days) {
            const tShifts = optimizedRoster[n.id][d + 1] || [];
            if (tShifts.includes('M')) return false;
          }
          return true;
        });

        if (candidates.length === 0) break;
        candidates.sort((a, b) => dutyCounts[a.id] - dutyCounts[b.id]);
        const chosen = candidates[0];

        if (!optimizedRoster[chosen.id][d]) optimizedRoster[chosen.id][d] = [];
        optimizedRoster[chosen.id][d].push(s);
        dutyCounts[chosen.id]++;
        currentAssigned++;
        autoFilled++;
      }
    });
  }

  const totalRequired = (shiftQuota.M + shiftQuota.A + shiftQuota.N) * days;
  let totalFilled = 0;
  NURSES.forEach(n => {
    for (let d = 1; d <= days; d++) {
      totalFilled += (optimizedRoster[n.id][d] || []).length;
    }
  });
  const avgShifts = (totalFilled / NURSES.length).toFixed(1);

  showOptimizeResultModal({
    totalRequired,
    totalFilled,
    round1Kept,
    round2Kept,
    autoFilled,
    avgShifts,
    newRoster: optimizedRoster
  });
}

function showOptimizeResultModal(stats) {
  const modal = document.getElementById('optimizeModal');
  const body = document.getElementById('optimizeModalBody');
  const coveragePercent = Math.min(100, Math.round((stats.totalFilled / stats.totalRequired) * 100));

  body.innerHTML = `
    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div class="p-3 rounded-2xl bg-blue-50 border border-blue-200">
          <div class="text-xs text-blue-700 font-medium">ครอบคลุมเวร</div>
          <div class="text-2xl font-black text-blue-950">${coveragePercent}%</div>
          <div class="text-[10px] text-blue-600">${stats.totalFilled}/${stats.totalRequired} เวร</div>
        </div>
        <div class="p-3 rounded-2xl bg-indigo-50 border border-indigo-200">
          <div class="text-xs text-indigo-700 font-medium">รอบ 1 ตามขอ</div>
          <div class="text-2xl font-black text-indigo-900">${stats.round1Kept}</div>
          <div class="text-[10px] text-indigo-600">เวร</div>
        </div>
        <div class="p-3 rounded-2xl bg-amber-50 border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">รอบ 2 รับเพิ่ม</div>
          <div class="text-2xl font-black text-amber-900">${stats.round2Kept}</div>
          <div class="text-[10px] text-amber-600">เวร</div>
        </div>
        <div class="p-3 rounded-2xl bg-purple-50 border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">เฉลี่ย/คน</div>
          <div class="text-2xl font-black text-purple-900">${stats.avgShifts}</div>
          <div class="text-[10px] text-purple-600">เวรต่อเดือน</div>
        </div>
      </div>
      <div class="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs space-y-1 text-slate-600">
        <div>✓ นำความประสงค์รอบ 1 และ 2 มาจัดเป็นอันดับแรก</div>
        <div>✓ ป้องกันเวรดึกต่อเช้าในวันถัดไป</div>
        <div>✓ เกลี่ยเวรที่ยังขาดให้พยาบาลที่มีชั่วโมงน้อยที่สุดอย่างเป็นธรรม</div>
      </div>
    </div>
  `;

  window.pendingOptimizedRoster = stats.newRoster;
  modal.classList.remove('hidden');
}

// 8. View Switching & Controllers
function renderActiveView() {
  if (!currentUser) return;
  if (currentUser.role === 'nurse') renderNurseView();
  else renderAdminView();
}

function switchView(view) {
  currentView = view;
  const matrixSec = document.getElementById('matrixViewSection');
  const dailySec = document.getElementById('dailyViewSection');
  const sumSec = document.getElementById('summaryViewSection');
  const vacSec = document.getElementById('vacanciesViewSection');

  const btnM = document.getElementById('viewMatrixBtn');
  const btnD = document.getElementById('viewDailyBtn');
  const btnS = document.getElementById('viewSummaryBtn');
  const btnV = document.getElementById('viewVacanciesBtn');

  matrixSec.classList.add('hidden');
  dailySec.classList.add('hidden');
  sumSec.classList.add('hidden');
  vacSec.classList.add('hidden');

  const inactiveClass = "px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 transition";
  const activeClass = "px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-700 text-white shadow-xs transition";

  btnM.className = inactiveClass;
  btnD.className = inactiveClass;
  btnS.className = inactiveClass;
  btnV.className = inactiveClass;

  if (view === 'matrix') {
    matrixSec.classList.remove('hidden');
    btnM.className = activeClass;
    renderMatrix();
  } else if (view === 'daily') {
    dailySec.classList.remove('hidden');
    btnD.className = activeClass;
    renderDailyView();
  } else if (view === 'summary') {
    sumSec.classList.remove('hidden');
    btnS.className = activeClass;
    renderSummaryView();
  } else if (view === 'vacancies') {
    vacSec.classList.remove('hidden');
    btnV.className = activeClass;
    renderAdminVacanciesView();
  }
}

window.openCellEditor = function(nurseId, day) {
  if (!currentUser) return;
  if (currentUser.role === 'nurse' && currentUser.nurseId !== nurseId) return;

  activeEditNurseId = nurseId;
  activeEditDay = day;
  const nurse = NURSES.find(n => n.id === nurseId);
  if (!nurse) return;

  document.getElementById('cellEditNurseName').innerText = `${nurse.name} (${nurse.id})`;
  document.getElementById('cellEditDateText').innerText = `วันที่ ${day} ${THAI_MONTHS[currentMonth]} ${currentYear + 543}`;

  const currentShifts = (monthState.roster[nurseId] && monthState.roster[nurseId][day]) || [];
  document.getElementById('cellShiftM').checked = currentShifts.includes('M');
  document.getElementById('cellShiftA').checked = currentShifts.includes('A');
  document.getElementById('cellShiftN').checked = currentShifts.includes('N');

  document.getElementById('cellEditModal').classList.remove('hidden');
};

function closeCellEditor() {
  document.getElementById('cellEditModal').classList.add('hidden');
}

// Booking Modal with True Calendar Grid
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
  html += `<div class="col-span-7 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-600 pb-1 border-b border-slate-200 mb-1">`;
  CALENDAR_HEADERS.forEach(ch => {
    html += `<div class="${ch.isWeekend ? 'text-rose-700' : ''}">${ch.th}</div>`;
  });
  html += `</div>`;

  // 2. Prepend empty slots
  for (let pad = 0; pad < firstDayIndex; pad++) {
    html += `<div class="p-1 rounded-lg border border-transparent opacity-0 select-none">•</div>`;
  }

  // 3. Render actual dates
  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    html += `
      <label class="p-2 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition select-none ${isWeekend ? 'bg-rose-50/70 border-rose-200 text-rose-900' : 'bg-white border-slate-200'} has-checked:bg-blue-600 has-checked:border-blue-600 has-checked:text-white hover:border-blue-400">
        <input type="checkbox" name="bookingDates" value="${d}" class="hidden">
        <span class="text-xs font-bold">${d}</span>
      </label>
    `;
  }
  dateCont.innerHTML = html;
}

window.openPersonalBookingModal = function() {
  if (!currentUser || currentUser.role !== 'nurse') return;
  populateBookingModal(currentUser.nurseId);
  document.getElementById('bookingModal').classList.remove('hidden');
};

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
    const total = m + a + n;
    row.push(m, a, n, total, total * 8);
    csv += row.join(',') + '\r\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ตารางเวรพยาบาล_${THAI_MONTHS[currentMonth]}_${currentYear + 543}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function setupEvents() {
  // Nurse Login Form
  document.getElementById('nurseLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('loginNurseIdSelect').value;
    const pin = document.getElementById('loginNursePin').value;
    if (id) loginAsNurse(id, pin);
    else alert('กรุณาเลือกรหัสพยาบาล');
  });

  // Admin Login Form
  document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('loginAdminUser').value;
    const pass = document.getElementById('loginAdminPass').value;
    loginAsAdmin(user, pass);
  });

  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Month navigation
  document.getElementById('monthSelect').addEventListener('change', (e) => {
    currentMonth = parseInt(e.target.value);
    loadMonthState();
    renderActiveView();
  });

  document.getElementById('yearSelect').addEventListener('change', (e) => {
    currentYear = parseInt(e.target.value);
    loadMonthState();
    renderActiveView();
  });

  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    if (currentMonth === 0) { currentMonth = 11; currentYear--; }
    else { currentMonth--; }
    document.getElementById('monthSelect').value = currentMonth;
    document.getElementById('yearSelect').value = currentYear;
    loadMonthState();
    renderActiveView();
  });

  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    if (currentMonth === 11) { currentMonth = 0; currentYear++; }
    else { currentMonth++; }
    document.getElementById('monthSelect').value = currentMonth;
    document.getElementById('yearSelect').value = currentYear;
    loadMonthState();
    renderActiveView();
  });

  // Admin Round Control Buttons
  document.getElementById('adminRound1Btn').addEventListener('click', () => {
    monthState.round = 1;
    saveMonthState();
    renderActiveView();
  });

  document.getElementById('adminRound2Btn').addEventListener('click', () => {
    monthState.round = 2;
    saveMonthState();
    renderActiveView();
  });

  document.getElementById('adminRoundFinalBtn').addEventListener('click', () => {
    monthState.round = 3;
    saveMonthState();
    renderActiveView();
  });

  document.getElementById('adminOptimizeBtn').addEventListener('click', runOptimization);

  document.getElementById('closeOptimizeModalBtn').addEventListener('click', () => {
    document.getElementById('optimizeModal').classList.add('hidden');
  });
  document.getElementById('cancelOptimizeBtn').addEventListener('click', () => {
    document.getElementById('optimizeModal').classList.add('hidden');
  });
  document.getElementById('confirmOptimizeBtn').addEventListener('click', () => {
    if (window.pendingOptimizedRoster) {
      monthState.roster = window.pendingOptimizedRoster;
      monthState.round = 3;
      saveMonthState();
      document.getElementById('optimizeModal').classList.add('hidden');
      renderActiveView();
      alert('บันทึกและนำตารางเวรที่จัดอัตโนมัติไปใช้งานจริงเรียบร้อยแล้ว!');
    }
  });

  // Cell Editor Modal
  document.getElementById('closeCellEditBtn').addEventListener('click', closeCellEditor);
  document.getElementById('saveCellEditBtn').addEventListener('click', () => {
    if (!activeEditNurseId || !activeEditDay) return;
    const shifts = [];
    if (document.getElementById('cellShiftM').checked) shifts.push('M');
    if (document.getElementById('cellShiftA').checked) shifts.push('A');
    if (document.getElementById('cellShiftN').checked) shifts.push('N');

    if (!monthState.roster[activeEditNurseId]) monthState.roster[activeEditNurseId] = {};
    monthState.roster[activeEditNurseId][activeEditDay] = shifts;

    if (monthState.round === 1) {
      if (!monthState.round1[activeEditNurseId]) monthState.round1[activeEditNurseId] = {};
      monthState.round1[activeEditNurseId][activeEditDay] = shifts;
    } else if (monthState.round === 2) {
      if (!monthState.round2[activeEditNurseId]) monthState.round2[activeEditNurseId] = {};
      monthState.round2[activeEditNurseId][activeEditDay] = shifts;
    }

    saveMonthState();
    closeCellEditor();
    renderActiveView();
  });

  document.getElementById('clearCellBtn').addEventListener('click', () => {
    if (!activeEditNurseId || !activeEditDay) return;
    if (monthState.roster[activeEditNurseId]) {
      delete monthState.roster[activeEditNurseId][activeEditDay];
    }
    saveMonthState();
    closeCellEditor();
    renderActiveView();
  });

  // Admin Booking Modal
  document.getElementById('openBookingModalBtn').addEventListener('click', () => {
    populateBookingModal(null);
    document.getElementById('bookingModal').classList.remove('hidden');
  });

  document.getElementById('closeBookingModalBtn').addEventListener('click', () => {
    document.getElementById('bookingModal').classList.add('hidden');
  });

  document.getElementById('cancelBookingBtn').addEventListener('click', () => {
    document.getElementById('bookingModal').classList.add('hidden');
  });

  document.getElementById('quickBookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nurseId = document.getElementById('modalNurseSelect').value;
    const shift = document.querySelector('input[name="modalShift"]:checked').value;
    const dateCheckboxes = document.querySelectorAll('input[name="bookingDates"]:checked');

    if (dateCheckboxes.length === 0) {
      alert('กรุณาเลือกวันที่ต้องการจองเวรอย่างน้อย 1 วัน');
      return;
    }

    if (!monthState.roster[nurseId]) monthState.roster[nurseId] = {};
    dateCheckboxes.forEach(cb => {
      const day = parseInt(cb.value);
      if (!monthState.roster[nurseId][day]) monthState.roster[nurseId][day] = [];
      if (!monthState.roster[nurseId][day].includes(shift)) {
        monthState.roster[nurseId][day].push(shift);
      }
    });

    saveMonthState();
    document.getElementById('bookingModal').classList.add('hidden');
    renderActiveView();
  });

  document.getElementById('selectAllDatesBtn').addEventListener('click', () => {
    const cbs = document.querySelectorAll('input[name="bookingDates"]');
    const allChecked = Array.from(cbs).every(c => c.checked);
    cbs.forEach(c => c.checked = !allChecked);
  });

  const searchInput = document.getElementById('searchNurseInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderActiveView();
    });
  }

  document.getElementById('viewMatrixBtn').addEventListener('click', () => switchView('matrix'));
  document.getElementById('viewDailyBtn').addEventListener('click', () => switchView('daily'));
  document.getElementById('viewSummaryBtn').addEventListener('click', () => switchView('summary'));
  document.getElementById('viewVacanciesBtn').addEventListener('click', () => switchView('vacancies'));

  document.getElementById('exportExcelBtn').addEventListener('click', exportRoster);
  document.getElementById('printBtn').addEventListener('click', () => window.print());

  document.getElementById('resetMonthBtn').addEventListener('click', () => {
    if (confirm(`คุณต้องการล้างข้อมูลเวรทั้งหมดของเดือน ${THAI_MONTHS[currentMonth]} หรือไม่?`)) {
      monthState.round = 1;
      monthState.round1 = {};
      monthState.round2 = {};
      monthState.roster = {};
      saveMonthState();
      renderActiveView();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadMonthState();
  initAuth();
  setupEvents();
});
