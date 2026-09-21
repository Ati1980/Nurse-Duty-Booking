/**
 * Nurse Duty Booking & Roster System
 * Multi-Role (Nurse Personal View / Admin Master View)
 * 2-Round Booking Process & Automatic Shift Optimizer
 */

// 1. Data Definitions
const ADMIN_CREDENTIALS = {
  username: "Admin",
  password: "1234"
};

const NURSES = [
  { id: "6100001", name: "น.ส.ภิญญดา คำผาเชื้อ", order: 1 },
  { id: "6100002", name: "น.ส.จำปา สิมมา", order: 2 },
  { id: "6100005", name: "น.ส.ระวิวรรณ รัตนปัญญา", order: 3 },
  { id: "6100013", name: "น.ส.หิรัญญา แสนสุข", order: 4 },
  { id: "6100015", name: "น.ส.วชิราพรรณ อานุพินิจ", order: 5 },
  { id: "6100021", name: "น.ส.ประทุมวัน ชัยยันต์", order: 6 },
  { id: "6100057", name: "น.ส.วิชชุดา ศรีหลง", order: 7 },
  { id: "6100063", name: "น.ส.อังสุมาลี เพียอามาตย์", order: 8 },
  { id: "6100067", name: "น.ส.สุชาวดี คำอู", order: 9 },
  { id: "6100068", name: "น.ส.ภัทราภรณ์ หล้าหนองเรือ", order: 10 },
  { id: "6100070", name: "น.ส.ปวีณ์ริศา อินทรพิมพ์", order: 11 },
  { id: "6100074", name: "น.ส.วริศรา ศรีใส", order: 12 },
  { id: "6100076", name: "น.ส.วิไลจิตร กุลทวง", order: 13 },
  { id: "6100075", name: "น.ส.สิริณญา วิเศษวุธ", order: 14 }
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

const THAI_DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

// 2. Application State
let currentUser = null; // { role: 'admin' } or { role: 'nurse', nurseId: '6100001', name: '...' }
let currentYear = 2026;
let currentMonth = 8; // กันยายน (0-indexed: 8)
let currentView = 'matrix'; // 'matrix', 'daily', 'summary', 'vacancies'
let searchQuery = '';

// Shift Target Quota per day
let shiftQuota = { M: 2, A: 2, N: 1 };

// Month Configuration & Booking Data
// Format: {
//   round: 1, // 1: Round 1, 2: Round 2, 3: Finalized/Optimized
//   round1: { [nurseId]: { [day]: ['M', 'A'] } },
//   round2: { [nurseId]: { [day]: ['N'] } },
//   roster: { [nurseId]: { [day]: ['M', 'A', 'N'] } } // Current active or optimized roster
// }
let monthState = {
  round: 1,
  round1: {},
  round2: {},
  roster: {}
};

// Editing cell tracking
let activeEditNurseId = null;
let activeEditDay = null;

// 3. Helper Functions
function getDaysCount(year, month) {
  return new Date(year, month + 1, 0).getDate();
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
      console.error("Error loading month state:", e);
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
  // Initialize current roster from round 1
  monthState.roster = JSON.parse(JSON.stringify(monthState.round1));
  saveMonthState();
}

// Generate realistic initial bookings for Round 1
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

// Calculate vacant shifts based on target quota
function calculateVacancies() {
  const days = getDaysCount(currentYear, currentMonth);
  const vacancies = []; // [{ day, shift: 'M', shiftName: 'เวรเช้า', required: 2, current: 1, missing: 1, assignedNurses: [] }]

  for (let d = 1; d <= days; d++) {
    ['M', 'A', 'N'].forEach(s => {
      const req = shiftQuota[s];
      let assigned = [];

      NURSES.forEach(n => {
        const shifts = (monthState.roster[n.id] && monthState.roster[n.id][d]) || [];
        if (shifts.includes(s)) {
          assigned.push(n);
        }
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

// 4. Authentication Logic
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

function loginAsNurse(nurseId) {
  const nurse = NURSES.find(n => n.id === nurseId);
  if (!nurse) {
    alert('ไม่พบรหัสพยาบาลนี้ในระบบ กรุณาตรวจสอบรหัสอีกครั้ง');
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
    // Show Login Screen
    loginScreen.classList.remove('hidden');
    appContainer.classList.add('hidden');
    populateLoginNurseSelect();
  } else {
    // Show App
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');

    // Update Profile badge
    if (currentUser.role === 'admin') {
      userProfileBadge.innerHTML = `
        <div class="flex items-center gap-2 bg-purple-900/40 border border-purple-400/30 px-3 py-1.5 rounded-xl text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40"></span>
          <span class="font-bold text-purple-100">👑 ผู้ดูแลระบบ (Admin)</span>
        </div>
      `;
      adminControlsSection.classList.remove('hidden');
      nursePersonalSection.classList.add('hidden');
      masterMatrixSection.classList.remove('hidden');
    } else {
      userProfileBadge.innerHTML = `
        <div class="flex items-center gap-2 bg-teal-900/40 border border-teal-400/30 px-3 py-1.5 rounded-xl text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-teal-300 ring-2 ring-teal-300/40"></span>
          <span class="font-bold text-teal-100">👩‍⚕️ ${currentUser.name}</span>
          <span class="font-mono text-teal-200/80">(${currentUser.nurseId})</span>
        </div>
      `;
      adminControlsSection.classList.add('hidden');
      nursePersonalSection.classList.remove('hidden');
      masterMatrixSection.classList.add('hidden'); // Nurses only see their own view
    }

    renderActiveView();
  }
}

function populateLoginNurseSelect() {
  const sel = document.getElementById('loginNurseIdSelect');
  if (!sel) return;
  sel.innerHTML = '<option value="">-- เลือกรหัสพยาบาลของคุณ --</option>' + 
    NURSES.map(n => `<option value="${n.id}">[${n.id}] ${n.name}</option>`).join('');
}

// 5. Nurse Personal View Rendering
function renderNurseView() {
  if (!currentUser || currentUser.role !== 'nurse') return;

  const nurseId = currentUser.nurseId;
  const daysCount = getDaysCount(currentYear, currentMonth);
  const nurseShifts = monthState.roster[nurseId] || {};

  // Status Banner according to active round
  const statusBanner = document.getElementById('nurseRoundStatusBanner');
  let roundText = '';
  let roundColor = '';

  if (monthState.round === 1) {
    roundText = `
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-lg font-bold text-xs bg-indigo-100 text-indigo-800 border border-indigo-200">รอบที่ 1: เปิดจองทั่วไป</span>
          <span class="text-xs text-indigo-950">คุณสามารถเลือกจองเวรเช้า บ่าย ดึก ในวันที่ต้องการได้อย่างอิสระ</span>
        </div>
        <button onclick="openPersonalBookingModal()" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition">
          + จองเวรของฉัน
        </button>
      </div>`;
    roundColor = 'bg-indigo-50 border-indigo-200';
  } else if (monthState.round === 2) {
    const vacancies = calculateVacancies();
    roundText = `
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-100 text-amber-800 border border-amber-200">รอบที่ 2: เปิดจองเวรที่ยังว่าง</span>
          <span class="text-xs text-amber-950">พบเวรที่ยังขาดคนทั้งหมด <b>${vacancies.length} กะ</b> คุณสามารถเลือกรับเวรเพิ่มเติมได้ด้านล่างนี้</span>
        </div>
      </div>`;
    roundColor = 'bg-amber-50 border-amber-200';
  } else {
    roundText = `
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-1 rounded-lg font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-200">ตารางเวรเสร็จสมบูรณ์</span>
        <span class="text-xs text-emerald-950">ผู้ดูแลระบบได้ทำการ Optimize และจัดตารางเวรเรียบร้อยแล้ว ตารางด้านล่างคือตารางเวรทางการของคุณ</span>
      </div>`;
    roundColor = 'bg-emerald-50 border-emerald-200';
  }

  statusBanner.className = `p-4 rounded-xl border ${roundColor} mb-6 transition`;
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

  // Render Personal Monthly Calendar Grid
  const calGrid = document.getElementById('nurseCalendarGrid');
  let calHtml = '';

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const dayShifts = nurseShifts[d] || [];

    let shiftBadges = '';
    dayShifts.forEach(s => {
      if (s === 'M') shiftBadges += `<span class="shift-tag shift-m">☀️ เช้า (08:30-16:30)</span>`;
      if (s === 'A') shiftBadges += `<span class="shift-tag shift-a">⛅ บ่าย (16:30-00:30)</span>`;
      if (s === 'N') shiftBadges += `<span class="shift-tag shift-n">🌙 ดึก (00:30-08:30)</span>`;
    });

    const isEditable = (monthState.round === 1 || monthState.round === 2);
    const clickAttr = isEditable ? `onclick="openCellEditor('${nurseId}', ${d})"` : '';

    calHtml += `
      <div class="bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-between min-h-[95px] shadow-xs hover:shadow-md transition ${isEditable ? 'cursor-pointer hover:border-teal-500' : ''}" ${clickAttr}>
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <span class="text-sm font-bold text-slate-800">${d}</span>
          <span class="text-[11px] font-semibold px-2 py-0.5 rounded ${isWeekend ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}">
            ${THAI_DAYS[dayOfWeek]}
          </span>
        </div>
        <div class="mt-2 space-y-1">
          ${shiftBadges || `<span class="text-[11px] text-slate-400 italic">${isEditable ? '+ คลิกเพื่อเลือกเวร' : 'ไม่มีเวร'}</span>`}
        </div>
      </div>
    `;
  }
  calGrid.innerHTML = calHtml;

  // Round 2 Vacant Shifts Section (Shown in Round 2 for Nurses)
  const round2Container = document.getElementById('nurseRound2VacanciesSection');
  if (monthState.round === 2) {
    round2Container.classList.remove('hidden');
    renderNurseRound2Vacancies();
  } else {
    round2Container.classList.add('hidden');
  }
}

// Render Vacant Shifts specifically for Round 2 booking
function renderNurseRound2Vacancies() {
  const container = document.getElementById('nurseRound2List');
  const vacancies = calculateVacancies();

  if (vacancies.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-500 bg-emerald-50 border border-emerald-200 rounded-xl">
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
      <div class="bg-white border border-amber-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between hover:border-amber-400 transition">
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-base font-bold text-slate-800">วันที่ ${v.day}</span>
              <span class="text-[11px] px-2 py-0.5 rounded font-semibold ${isWeekend ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}">${THAI_DAYS[dayOfWeek]}</span>
            </div>
            <span class="vacant-badge pulse-vacant">ขาดอีก ${v.missing} คน</span>
          </div>

          <div class="flex items-center gap-2 mb-3">
            <span class="shift-tag ${SHIFTS[v.shift].badge}">${v.shiftName}</span>
            <span class="text-xs text-slate-500 font-mono">${v.time}</span>
          </div>

          <div class="text-[11px] text-slate-500 mb-3">
            พยาบาลที่มีเวรแล้ว: ${v.assigned.length ? v.assigned.map(n => n.name).join(', ') : 'ยังไม่มี'}
          </div>
        </div>

        <div>
          ${alreadyBooked ? 
            `<button disabled class="w-full py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold cursor-not-allowed">
              ✓ คุณลงเวรนี้แล้ว
            </button>` :
            `<button onclick="claimVacantShift(${v.day}, '${v.shift}')" class="w-full py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-lg text-xs font-bold shadow-sm transition">
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

// Nurse Claims Vacant Shift in Round 2
window.claimVacantShift = function(day, shift) {
  if (!currentUser || currentUser.role !== 'nurse') return;
  const nurseId = currentUser.nurseId;

  if (!monthState.roster[nurseId]) monthState.roster[nurseId] = {};
  if (!monthState.roster[nurseId][day]) monthState.roster[nurseId][day] = [];

  if (!monthState.roster[nurseId][day].includes(shift)) {
    monthState.roster[nurseId][day].push(shift);
  }

  // Also record into round2 bookings
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

  const baseClass = "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border";
  
  round1Btn.className = `${baseClass} ${monthState.round === 1 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`;
  round2Btn.className = `${baseClass} ${monthState.round === 2 ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`;
  roundFinalBtn.className = `${baseClass} ${monthState.round === 3 ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`;
}

// Render Master Matrix Table for Admin
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
    const weekendClass = isWeekend ? 'bg-rose-50/80 text-rose-700 font-bold' : 'bg-slate-100 text-slate-700';

    h += `<th class="py-2 px-1 text-center min-w-[38px] border-r border-slate-200 ${weekendClass}">
      <div class="text-[10px] opacity-80">${THAI_DAYS[dayOfWeek]}</div>
      <div class="text-sm font-bold">${d}</div>
    </th>`;
  }

  h += `
    <th class="py-3 px-2 text-center w-14 bg-sky-100 text-sky-800 border-l-2 border-slate-300" title="เวรเช้า (08:30-16:30)">เช้า</th>
    <th class="py-3 px-2 text-center w-14 bg-amber-100 text-amber-800 border-l border-slate-300" title="เวรบ่าย (16:30-00:30)">บ่าย</th>
    <th class="py-3 px-2 text-center w-14 bg-purple-100 text-purple-800 border-l border-slate-300" title="เวรดึก (00:30-08:30)">ดึก</th>
    <th class="py-3 px-2 text-center w-16 bg-teal-100 text-teal-900 border-l border-slate-300" title="รวมเวรทั้งหมด">รวม</th>
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

    b += `<tr class="hover:bg-teal-50/40 transition">
      <td class="sticky-col-1 bg-white py-2.5 px-2 text-center font-medium text-slate-400 border-r border-slate-200">${idx + 1}</td>
      <td class="sticky-col-2 bg-white py-2.5 px-3 font-mono font-bold text-teal-800 border-r border-slate-200">${nurse.id}</td>
      <td class="sticky-col-3 bg-white py-2.5 px-3 font-medium text-slate-800 border-r-2 border-slate-300 whitespace-nowrap">${nurse.name}</td>`;

    for (let d = 1; d <= daysCount; d++) {
      const dt = new Date(currentYear, currentMonth, d);
      const isWeekend = (dt.getDay() === 0 || dt.getDay() === 6);
      const weekendBg = isWeekend ? 'bg-rose-50/20' : '';
      const dayShifts = nurseShifts[d] || [];

      let tags = '';
      dayShifts.forEach(s => {
        if (s === 'M') { countM++; tags += `<span class="shift-tag shift-m" title="เวรเช้า 08:30-16:30">ช</span>`; }
        if (s === 'A') { countA++; tags += `<span class="shift-tag shift-a" title="เวรบ่าย 16:30-00:30">บ</span>`; }
        if (s === 'N') { countN++; tags += `<span class="shift-tag shift-n" title="เวรดึก 00:30-08:30">ด</span>`; }
      });

      b += `<td class="p-1 text-center border-r border-slate-200 cursor-pointer hover:bg-teal-100/60 transition ${weekendBg}"
               onclick="openCellEditor('${nurse.id}', ${d})">
        <div class="min-h-[26px] flex items-center justify-center gap-0.5 flex-wrap">
          ${tags || '<span class="text-slate-300 text-[10px] font-bold hover:text-teal-600">+</span>'}
        </div>
      </td>`;
    }

    const total = countM + countA + countN;
    b += `
      <td class="py-2 px-1 text-center font-bold text-sky-700 bg-sky-50/50 border-l-2 border-slate-300">${countM}</td>
      <td class="py-2 px-1 text-center font-bold text-amber-700 bg-amber-50/50 border-l border-slate-300">${countA}</td>
      <td class="py-2 px-1 text-center font-bold text-purple-700 bg-purple-50/50 border-l border-slate-300">${countN}</td>
      <td class="py-2 px-1 text-center font-black text-teal-900 bg-teal-50 border-l border-slate-300">${total}</td>
    </tr>`;
  });
  tbody.innerHTML = b;

  // Footer: Shift Daily Totals & Quota Check
  let fM = `<tr><td colspan="3" class="sticky-col-1 bg-sky-100 py-1.5 px-3 font-bold text-sky-900 border-r-2 border-slate-300 text-right">รวมเวรเช้า (ต้องการ ${shiftQuota.M})</td>`;
  let fA = `<tr><td colspan="3" class="sticky-col-1 bg-amber-100 py-1.5 px-3 font-bold text-amber-900 border-r-2 border-slate-300 text-right">รวมเวรบ่าย (ต้องการ ${shiftQuota.A})</td>`;
  let fN = `<tr><td colspan="3" class="sticky-col-1 bg-purple-100 py-1.5 px-3 font-bold text-purple-900 border-r-2 border-slate-300 text-right">รวมเวรดึก (ต้องการ ${shiftQuota.N})</td>`;

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

// Render Daily View for Admin
function renderDailyView() {
  const container = document.getElementById('dailyCardsContainer');
  const daysCount = getDaysCount(currentYear, currentMonth);
  let html = '';

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const dayName = THAI_DAYS[dayOfWeek];

    let mList = [], aList = [], nList = [];
    NURSES.forEach(nurse => {
      const s = (monthState.roster[nurse.id] && monthState.roster[nurse.id][d]) || [];
      if (s.includes('M')) mList.push(nurse.name);
      if (s.includes('A')) aList.push(nurse.name);
      if (s.includes('N')) nList.push(nurse.name);
    });

    html += `
      <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition">
        <div class="p-3 border-b flex items-center justify-between ${isWeekend ? 'bg-rose-50/90 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-800'}">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold">${d}</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded ${isWeekend ? 'bg-rose-200 text-rose-800' : 'bg-slate-200 text-slate-700'}">${dayName}</span>
          </div>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">${mList.length + aList.length + nList.length} คน</span>
        </div>

        <div class="p-3 space-y-2 flex-1 text-xs">
          <!-- Morning -->
          <div class="bg-sky-50/70 p-2 rounded-lg border border-sky-100">
            <div class="font-bold text-sky-900 mb-1 flex items-center justify-between">
              <span>☀️ เช้า</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${mList.length < shiftQuota.M ? 'bg-rose-200 text-rose-800' : 'bg-sky-200 text-sky-800'}">${mList.length}/${shiftQuota.M}</span>
            </div>
            <div class="text-slate-700 space-y-0.5">
              ${mList.length ? mList.map(name => `<div class="truncate">• ${name}</div>`).join('') : '<span class="text-rose-500 italic font-medium">ยังไม่มีพยาบาล</span>'}
            </div>
          </div>

          <!-- Afternoon -->
          <div class="bg-amber-50/70 p-2 rounded-lg border border-amber-100">
            <div class="font-bold text-amber-900 mb-1 flex items-center justify-between">
              <span>⛅ บ่าย</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${aList.length < shiftQuota.A ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'}">${aList.length}/${shiftQuota.A}</span>
            </div>
            <div class="text-slate-700 space-y-0.5">
              ${aList.length ? aList.map(name => `<div class="truncate">• ${name}</div>`).join('') : '<span class="text-rose-500 italic font-medium">ยังไม่มีพยาบาล</span>'}
            </div>
          </div>

          <!-- Night -->
          <div class="bg-purple-50/70 p-2 rounded-lg border border-purple-100">
            <div class="font-bold text-purple-900 mb-1 flex items-center justify-between">
              <span>🌙 ดึก</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${nList.length < shiftQuota.N ? 'bg-rose-200 text-rose-800' : 'bg-purple-200 text-purple-800'}">${nList.length}/${shiftQuota.N}</span>
            </div>
            <div class="text-slate-700 space-y-0.5">
              ${nList.length ? nList.map(name => `<div class="truncate">• ${name}</div>`).join('') : '<span class="text-rose-500 italic font-medium">ยังไม่มีพยาบาล</span>'}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

// Render Summary View for Admin
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
    const totalHours = totalShifts * 8;

    grandM += m;
    grandA += a;
    grandN += n;
    grandTotal += totalShifts;

    html += `
      <tr class="hover:bg-slate-50">
        <td class="py-2.5 px-4 font-medium text-slate-400">${index + 1}</td>
        <td class="py-2.5 px-4 font-mono font-bold text-teal-700">${nurse.id}</td>
        <td class="py-2.5 px-4 font-semibold text-slate-800">${nurse.name}</td>
        <td class="py-2.5 px-4 text-center text-sky-700 font-bold bg-sky-50/40">${m}</td>
        <td class="py-2.5 px-4 text-center text-amber-700 font-bold bg-amber-50/40">${a}</td>
        <td class="py-2.5 px-4 text-center text-purple-700 font-bold bg-purple-50/40">${n}</td>
        <td class="py-2.5 px-4 text-center font-black text-teal-800 bg-teal-50/60">${totalShifts}</td>
        <td class="py-2.5 px-4 text-center font-black text-emerald-800 bg-emerald-50/60">${totalHours} ชม.</td>
      </tr>
    `;
  });

  html += `
    <tr class="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
      <td colspan="3" class="py-3 px-4 text-right">รวมทั้งสิ้นในแผนก:</td>
      <td class="py-3 px-4 text-center text-sky-800 bg-sky-100">${grandM}</td>
      <td class="py-3 px-4 text-center text-amber-800 bg-amber-100">${grandA}</td>
      <td class="py-3 px-4 text-center text-purple-800 bg-purple-100">${grandN}</td>
      <td class="py-3 px-4 text-center text-teal-900 bg-teal-100">${grandTotal}</td>
      <td class="py-3 px-4 text-center text-emerald-900 bg-emerald-100">${grandTotal * 8} ชม.</td>
    </tr>
  `;

  tbody.innerHTML = html;
}

// Render Vacancies View for Admin
function renderAdminVacanciesView() {
  const container = document.getElementById('adminVacanciesList');
  const vacancies = calculateVacancies();

  if (vacancies.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-600 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <h4 class="text-lg font-bold text-emerald-800 mb-1">🎉 ตารางเวรมีพยาบาลครบทุกกะแล้ว 100%!</h4>
        <p class="text-sm text-emerald-600">ไม่มีเวรที่ขาดคน สามารถกดปิดรอบและสั่งพิมพ์หรือส่งออก Excel ได้ทันที</p>
      </div>`;
    return;
  }

  let html = `
    <div class="mb-4 flex items-center justify-between">
      <div class="text-sm text-slate-600">พบเวรที่ยังขาดพยาบาลทั้งหมด <b class="text-rose-600 font-bold">${vacancies.length} กะ</b></div>
      <button onclick="runOptimization()" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5">
        ⚡ รัน Optimize เติมเต็มเวรเหล่านี้อัตโนมัติ
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">`;

  vacancies.forEach(v => {
    const dt = new Date(currentYear, currentMonth, v.day);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    html += `
      <div class="bg-white border border-rose-200 rounded-xl p-3.5 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="font-bold text-slate-800 text-sm">วันที่ ${v.day} (${THAI_DAYS[dayOfWeek]})</span>
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

// 7. Automatic Optimizer Algorithm
function runOptimization() {
  const days = getDaysCount(currentYear, currentMonth);

  // Initialize new optimized roster
  const optimizedRoster = {};
  NURSES.forEach(n => {
    optimizedRoster[n.id] = {};
  });

  // Track shift count per nurse for fair balancing
  const dutyCounts = {};
  NURSES.forEach(n => { dutyCounts[n.id] = 0; });

  let round1Kept = 0;
  let round2Kept = 0;
  let autoFilled = 0;

  // Step 1: Assign Round 1 requests
  for (let d = 1; d <= days; d++) {
    ['M', 'A', 'N'].forEach(s => {
      const req = shiftQuota[s];
      let assignedCount = 0;

      // Check nurses who requested in Round 1
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

  // Step 2: Assign Round 2 requests for vacant slots
  for (let d = 1; d <= days; d++) {
    ['M', 'A', 'N'].forEach(s => {
      const req = shiftQuota[s];
      // Count current assigned
      let currentAssigned = 0;
      NURSES.forEach(n => {
        if (optimizedRoster[n.id][d] && optimizedRoster[n.id][d].includes(s)) currentAssigned++;
      });

      // Check nurses who requested in Round 2
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

  // Step 3: Fairly Auto-fill any remaining vacant slots
  for (let d = 1; d <= days; d++) {
    ['M', 'A', 'N'].forEach(s => {
      const req = shiftQuota[s];
      let currentAssigned = 0;
      NURSES.forEach(n => {
        if (optimizedRoster[n.id][d] && optimizedRoster[n.id][d].includes(s)) currentAssigned++;
      });

      while (currentAssigned < req) {
        // Find best candidate among the 14 nurses:
        // 1. Not already on shift 's' on day d
        // 2. Safe resting: if 'M', not on 'N' yesterday; if 'N', not on 'M' tomorrow
        // 3. Lowest total duty count so far
        const candidates = NURSES.filter(n => {
          const dayShifts = optimizedRoster[n.id][d] || [];
          if (dayShifts.includes(s)) return false; // Already on this shift
          if (dayShifts.length >= 2) return false; // Max 2 shifts per day

          // Safety: Night then Morning next day
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

        if (candidates.length === 0) break; // No candidate available

        // Sort by lowest duty count
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

  // Calculate optimization stats
  const totalRequired = (shiftQuota.M + shiftQuota.A + shiftQuota.N) * days;
  let totalFilled = 0;
  NURSES.forEach(n => {
    for (let d = 1; d <= days; d++) {
      totalFilled += (optimizedRoster[n.id][d] || []).length;
    }
  });

  const avgShifts = (totalFilled / NURSES.length).toFixed(1);

  // Show Optimization Modal with preview & approval
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
        <div class="p-3 rounded-xl bg-teal-50 border border-teal-200">
          <div class="text-xs text-teal-700 font-medium">ครอบคลุมเวรทุกกะ</div>
          <div class="text-2xl font-black text-teal-900">${coveragePercent}%</div>
          <div class="text-[10px] text-teal-600">${stats.totalFilled}/${stats.totalRequired} เวร</div>
        </div>

        <div class="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
          <div class="text-xs text-indigo-700 font-medium">ความต้องการรอบ 1</div>
          <div class="text-2xl font-black text-indigo-900">${stats.round1Kept}</div>
          <div class="text-[10px] text-indigo-600">จัดตามที่เลือก</div>
        </div>

        <div class="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <div class="text-xs text-amber-700 font-medium">รับเวรเพิ่มรอบ 2</div>
          <div class="text-2xl font-black text-amber-900">${stats.round2Kept}</div>
          <div class="text-[10px] text-amber-600">จัดตามที่ลงชื่อ</div>
        </div>

        <div class="p-3 rounded-xl bg-purple-50 border border-purple-200">
          <div class="text-xs text-purple-700 font-medium">เกลี่ยเฉลี่ย/คน</div>
          <div class="text-2xl font-black text-purple-900">${stats.avgShifts}</div>
          <div class="text-[10px] text-purple-600">เวรต่อเดือน</div>
        </div>
      </div>

      <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
        <div class="font-bold text-slate-800 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          เกณฑ์ความปลอดภัยและสวัสดิภาพการทำงาน:
        </div>
        <div class="text-slate-600 space-y-1">
          <div>✓ อิงตามความประสงค์ในรอบที่ 1 และรอบที่ 2 เป็นลำดับแรก</div>
          <div>✓ หลีกเลี่ยงเวรดึกต่อด้วยเวรเช้าในวันถัดไป</div>
          <div>✓ กระจายเวรที่ขาดให้พยาบาลที่มีชั่วโมงเวรสะสมน้อยที่สุดอย่างเท่าเทียม</div>
        </div>
      </div>
    </div>
  `;

  // Store temporary optimized roster for confirmation
  window.pendingOptimizedRoster = stats.newRoster;

  modal.classList.remove('hidden');
}

// 8. View Switching & Controllers
function renderActiveView() {
  if (!currentUser) return;
  if (currentUser.role === 'nurse') {
    renderNurseView();
  } else {
    renderAdminView();
  }
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

  const inactiveClass = "px-3 py-1 rounded-md text-xs font-semibold text-slate-600 hover:text-teal-700 transition";
  const activeClass = "px-3 py-1 rounded-md text-xs font-semibold bg-teal-600 text-white shadow-sm transition";

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

// Cell Editor Modal
window.openCellEditor = function(nurseId, day) {
  if (!currentUser) return;
  // If nurse, can only edit their own cell
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

// Quick Booking Modal Handler
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
  const dateCont = document.getElementById('modalDateSelector');
  let html = '';

  for (let d = 1; d <= daysCount; d++) {
    const dt = new Date(currentYear, currentMonth, d);
    const dayOfWeek = dt.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    html += `
      <label class="p-2 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition select-none ${isWeekend ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'} has-checked:bg-teal-600 has-checked:border-teal-600 has-checked:text-white">
        <input type="checkbox" name="bookingDates" value="${d}" class="hidden">
        <span class="text-[10px] font-medium opacity-80">${THAI_DAYS[dayOfWeek]}</span>
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

// Export to CSV with UTF-8 BOM
function exportRoster() {
  const daysCount = getDaysCount(currentYear, currentMonth);
  let csv = '\uFEFF';

  csv += `"ตารางเวรพยาบาล ประจำเดือน ${THAI_MONTHS[currentMonth]} พ.ศ. ${currentYear + 543}"\r\n`;
  csv += `"กะเวร: ช = เวรเช้า (08:30-16:30), บ = เวรบ่าย (16:30-00:30), ด = เวรดึก (00:30-08:30)"\r\n\r\n`;

  let header = ['ลำดับ', 'รหัส', 'ชื่อ - สกุล'];
  for (let d = 1; d <= daysCount; d++) {
    header.push(`"วันที่ ${d}"`);
  }
  header.push('เวรเช้า(ครั้ง)', 'เวรบ่าย(ครั้ง)', 'เวรดึก(ครั้ง)', 'รวมเวร', 'รวมชั่วโมง');
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

// Event Listeners Setup
function setupEvents() {
  // Login Form Handlers
  document.getElementById('nurseLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('loginNurseIdSelect').value;
    if (id) loginAsNurse(id);
    else alert('กรุณาเลือกรหัสพยาบาล');
  });

  document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('loginAdminUser').value;
    const pass = document.getElementById('loginAdminPass').value;
    loginAsAdmin(user, pass);
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Month & Year Selector
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

  // Optimize Trigger Button
  document.getElementById('adminOptimizeBtn').addEventListener('click', runOptimization);

  // Optimize Confirm Modal
  document.getElementById('closeOptimizeModalBtn').addEventListener('click', () => {
    document.getElementById('optimizeModal').classList.add('hidden');
  });
  document.getElementById('cancelOptimizeBtn').addEventListener('click', () => {
    document.getElementById('optimizeModal').classList.add('hidden');
  });
  document.getElementById('confirmOptimizeBtn').addEventListener('click', () => {
    if (window.pendingOptimizedRoster) {
      monthState.roster = window.pendingOptimizedRoster;
      monthState.round = 3; // Finalized
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

    // Also update respective round tracking
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

      if (monthState.round === 1) {
        if (!monthState.round1[nurseId]) monthState.round1[nurseId] = {};
        if (!monthState.round1[nurseId][day]) monthState.round1[nurseId][day] = [];
        if (!monthState.round1[nurseId][day].includes(shift)) monthState.round1[nurseId][day].push(shift);
      } else if (monthState.round === 2) {
        if (!monthState.round2[nurseId]) monthState.round2[nurseId] = {};
        if (!monthState.round2[nurseId][day]) monthState.round2[nurseId][day] = [];
        if (!monthState.round2[nurseId][day].includes(shift)) monthState.round2[nurseId][day].push(shift);
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

  // Search input
  const searchInput = document.getElementById('searchNurseInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderActiveView();
    });
  }

  // Admin View Switching
  document.getElementById('viewMatrixBtn').addEventListener('click', () => switchView('matrix'));
  document.getElementById('viewDailyBtn').addEventListener('click', () => switchView('daily'));
  document.getElementById('viewSummaryBtn').addEventListener('click', () => switchView('summary'));
  document.getElementById('viewVacanciesBtn').addEventListener('click', () => switchView('vacancies'));

  // Export & Print
  document.getElementById('exportExcelBtn').addEventListener('click', exportRoster);
  document.getElementById('printBtn').addEventListener('click', () => window.print());

  // Reset
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

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadMonthState();
  initAuth();
  setupEvents();
});
