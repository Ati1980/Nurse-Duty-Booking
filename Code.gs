/**
 * =========================================================================
 * ระบบฐานข้อมูลจองเวรพยาบาล (Google Sheets Database Backend)
 * Nurse Duty Booking System - Google Apps Script Backend V7.0
 * =========================================================================
 * 
 * 📌 คำแนะนำการติดตั้ง:
 * 1. เปิด Google Sheet ที่คุณต้องการใช้เป็นฐานข้อมูล
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) -> "Apps Script"
 * 3. ลบโค้ดเดิมทั้งหมดออก แล้ววางโค้ดนี้ลงไปแทน
 * 4. กดปุ่ม "บันทึก" (รูปแผ่นดิสก์)
 * 5. กดปุ่ม "ทำให้ใช้งานได้" (Deploy) -> "การทำให้ใช้งานได้รายการใหม่" (New deployment)
 *    - เลือกประเภท: "เว็บแอปพลิเคชัน" (Web app)
 *    - คำอธิบาย: Nurse Duty Booking API
 *    - ทำงานในฐานะ: "ฉัน" (Me)
 *    - ผู้ที่มีสิทธิ์เข้าถึง: "ทุกคน" (Anyone) **สำคัญมาก!**
 * 6. คัดลอก URL ของเว็บแอป (ขึ้นต้นด้วย https://script.google.com/macros/s/.../exec)
 *    นำไปใส่ที่ตัวแปร GAS_API_URL ในไฟล์ js/app.js
 * =========================================================================
 */

// โฟลเดอร์ Google Drive สำหรับเก็บไฟล์สำรอง Excel (ถ้าต้องการเปลี่ยน ให้ใส่ ID โฟลเดอร์ที่นี่)
var DEFAULT_DRIVE_FOLDER_ID = "1AagYBbJahbhkg9b8zEq-4K3EThnvKpiR";

// ชื่อแท็บใน Google Sheets
var SHEET_BOOKINGS = "Bookings";          // ตารางฐานข้อมูลการจองเวร (Relational Table)
var SHEET_MATRIX   = "ตารางเวร_Matrix";   // ตารางแสดงผลเวรรายเดือนแบบ Matrix
var SHEET_NURSES   = "Nurses";            // รายชื่อพยาบาล
var SHEET_CONFIG   = "Config";            // การตั้งค่าระบบ

/**
 * ฟังก์ชันช่วยเปิด Spreadsheet
 */
function getDb() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {}
  
  var propId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (propId) {
    return SpreadsheetApp.openById(propId);
  }
  throw new Error("กรุณาเชื่อมโยง Apps Script กับ Google Sheet หรือตั้งค่า SPREADSHEET_ID");
}

/**
 * สร้างและเตรียมตารางใน Google Sheet อัตโนมัติ หากยังไม่มี
 */
function setupDatabase() {
  var ss = getDb();
  
  // 1. ตาราง Bookings (ฐานข้อมูลหลัก)
  var sheetBookings = ss.getSheetByName(SHEET_BOOKINGS);
  if (!sheetBookings) {
    sheetBookings = ss.insertSheet(SHEET_BOOKINGS);
    sheetBookings.appendRow([
      "Timestamp", "Year", "Month", "Day", "NurseId", "NurseName", "Shifts", "Status", "UpdatedAt"
    ]);
    sheetBookings.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#2563eb").setFontColor("#ffffff");
    sheetBookings.setFrozenRows(1);
  }
  
  // 2. ตาราง Nurses
  var sheetNurses = ss.getSheetByName(SHEET_NURSES);
  if (!sheetNurses) {
    sheetNurses = ss.insertSheet(SHEET_NURSES);
    sheetNurses.appendRow(["Num", "NurseId", "Name", "PIN", "Color"]);
    sheetNurses.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#0284c7").setFontColor("#ffffff");
    sheetNurses.setFrozenRows(1);
  }
  
  // 3. ตาราง Matrix
  var sheetMatrix = ss.getSheetByName(SHEET_MATRIX);
  if (!sheetMatrix) {
    sheetMatrix = ss.insertSheet(SHEET_MATRIX);
    sheetMatrix.appendRow(["ลำดับ", "รหัส", "ชื่อ - สกุล"]);
    sheetMatrix.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#1e3a8a").setFontColor("#ffffff");
    sheetMatrix.setFrozenRows(1);
  }
  
  return { status: "success", message: "Database setup completed successfully." };
}

/**
 * =========================================================================
 * GET: ดึงข้อมูลการจองเวรจาก Google Sheets
 * =========================================================================
 */
function doGet(e) {
  try {
    setupDatabase();
    var ss = getDb();
    var params = (e && e.parameter) ? e.parameter : {};
    
    // ตรวจสอบปีและเดือนที่ต้องการดึง
    var targetYear = params.year ? parseInt(params.year, 10) : null;
    var targetMonth = params.month !== undefined ? parseInt(params.month, 10) : null;
    
    var sheetBookings = ss.getSheetByName(SHEET_BOOKINGS);
    var data = sheetBookings.getDataRange().getValues();
    
    // Header อยู่ที่แถว index 0
    // Col 0: Timestamp, 1: Year, 2: Month, 3: Day, 4: NurseId, 5: NurseName, 6: Shifts, 7: Status, 8: UpdatedAt
    var rosterMap = {}; // รูปแบบ: { "nurse_system_YEAR_MONTH": { roster: { nurseId: { day: ["M", "A"] } } } }
    var currentMonthRoster = {};
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rYear = parseInt(row[1], 10);
      var rMonth = parseInt(row[2], 10);
      var rDay = parseInt(row[3], 10);
      var rNurseId = String(row[4]).trim();
      var rShiftsStr = String(row[6]).trim();
      var rStatus = String(row[7]).trim();
      
      if (!rNurseId || rStatus === "Cancelled" || !rShiftsStr) continue;
      
      var shiftsArr = rShiftsStr.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
      if (shiftsArr.length === 0) continue;
      
      var monthKey = "nurse_system_" + rYear + "_" + rMonth;
      if (!rosterMap[monthKey]) {
        rosterMap[monthKey] = {
          round: 1,
          round1: {},
          round2: {},
          roster: {},
          isConfirmed: false
        };
      }
      if (!rosterMap[monthKey].roster[rNurseId]) {
        rosterMap[monthKey].roster[rNurseId] = {};
      }
      rosterMap[monthKey].roster[rNurseId][rDay] = shiftsArr;
      
      // ถ้าตรงกับ targetYear & targetMonth
      if (targetYear !== null && targetMonth !== null && rYear === targetYear && rMonth === targetMonth) {
        if (!currentMonthRoster[rNurseId]) currentMonthRoster[rNurseId] = {};
        currentMonthRoster[rNurseId][rDay] = shiftsArr;
      }
    }
    
    // ดึงค่า PropertiesService เดิมเพื่อความเข้ากันได้
    var propStore = PropertiesService.getScriptProperties().getProperties();
    var responseStore = {};
    for (var k in propStore) {
      responseStore[k] = propStore[k];
    }
    
    // นำข้อมูลจริงจาก Google Sheets Bookings ผนวกเข้ากับ response
    for (var mKey in rosterMap) {
      responseStore[mKey] = JSON.stringify(rosterMap[mKey]);
    }
    
    var outputPayload = {
      status: "success",
      source: "google_sheets_database",
      timestamp: new Date().toISOString(),
      store: responseStore,
      roster: currentMonthRoster
    };
    
    // ถ้าฝั่ง Client ขอแบบ Store Object โดยตรง
    if (!params.action) {
      return ContentService.createTextOutput(JSON.stringify(responseStore))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify(outputPayload))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * =========================================================================
 * POST: บันทึก / แก้ไข / เพิ่ม / ลด เวรลง Google Sheets
 * =========================================================================
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    setupDatabase();
    var ss = getDb();
    
    var payloadRaw = "";
    if (e.parameter && e.parameter.data) {
      payloadRaw = e.parameter.data;
    } else if (e.postData && e.postData.contents) {
      payloadRaw = e.postData.contents;
    }
    
    var payload = JSON.parse(payloadRaw);
    
    // -----------------------------------------------------------------------
    // Action 1: บันทึกไฟล์ Excel สำรองลง Google Drive
    // -----------------------------------------------------------------------
    if (payload.action === "save_excel_to_drive") {
      var folderId = payload.folderId || DEFAULT_DRIVE_FOLDER_ID;
      var fileName = payload.fileName || ("ตารางเวรพยาบาล_" + new Date().getTime() + ".xlsx");
      var base64Data = payload.fileBase64;
      
      var folder = DriveApp.getFolderById(folderId);
      var decodedBytes = Utilities.base64Decode(base64Data);
      var blob = Utilities.newBlob(decodedBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
      var file = folder.createFile(blob);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        fileId: file.getId(),
        fileName: fileName,
        fileUrl: file.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // -----------------------------------------------------------------------
    // Action 2: เพิ่ม / ลด เวรรายบุคคล (Single Shift Update)
    // -----------------------------------------------------------------------
    if (payload.action === "update_nurse_shifts") {
      var year = parseInt(payload.year, 10);
      var month = parseInt(payload.month, 10);
      var day = parseInt(payload.day, 10);
      var nurseId = String(payload.nurseId).trim();
      var nurseName = String(payload.nurseName || "").trim();
      var shifts = payload.shifts || []; // Array เช่น ["M"], ["M", "A"] หรือ [] เพื่อยกเลิก
      
      var sheetBookings = ss.getSheetByName(SHEET_BOOKINGS);
      var data = sheetBookings.getDataRange().getValues();
      var foundRowIdx = -1;
      
      for (var i = 1; i < data.length; i++) {
        var rY = parseInt(data[i][1], 10);
        var rM = parseInt(data[i][2], 10);
        var rD = parseInt(data[i][3], 10);
        var rNId = String(data[i][4]).trim();
        if (rY === year && rM === month && rD === day && rNId === nurseId) {
          foundRowIdx = i + 1; // 1-based index
          break;
        }
      }
      
      var nowStr = new Date();
      var shiftsStr = Array.isArray(shifts) ? shifts.join(",") : String(shifts);
      
      if (shifts && shifts.length > 0) {
        if (foundRowIdx > 0) {
          // อัปเดตแถวเดิม
          sheetBookings.getRange(foundRowIdx, 6).setValue(nurseName || sheetBookings.getRange(foundRowIdx, 6).getValue());
          sheetBookings.getRange(foundRowIdx, 7).setValue(shiftsStr);
          sheetBookings.getRange(foundRowIdx, 8).setValue("Active");
          sheetBookings.getRange(foundRowIdx, 9).setValue(nowStr);
        } else {
          // เพิ่มแถวใหม่
          sheetBookings.appendRow([
            nowStr, year, month, day, nurseId, nurseName, shiftsStr, "Active", nowStr
          ]);
        }
      } else {
        // ลดเวร / ยกเลิกเวรในวันนี้
        if (foundRowIdx > 0) {
          sheetBookings.deleteRow(foundRowIdx);
        }
      }
      
      updateMatrixView(ss, year, month);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "update_nurse_shifts",
        nurseId: nurseId,
        day: day,
        shifts: shifts
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // -----------------------------------------------------------------------
    // Action 3: จองเวรหลายวันพร้อมกัน (Batch Booking จาก Popup Modal)
    // -----------------------------------------------------------------------
    if (payload.action === "batch_booking") {
      var bYear = parseInt(payload.year, 10);
      var bMonth = parseInt(payload.month, 10);
      var bNurseId = String(payload.nurseId).trim();
      var bNurseName = String(payload.nurseName || "").trim();
      var bookings = payload.bookings || []; // Array: [{ day: 1, shifts: ["M"] }, ...]
      
      var sBookings = ss.getSheetByName(SHEET_BOOKINGS);
      var sData = sBookings.getDataRange().getValues();
      var rowMap = {};
      
      for (var j = 1; j < sData.length; j++) {
        var ry = parseInt(sData[j][1], 10);
        var rm = parseInt(sData[j][2], 10);
        var rd = parseInt(sData[j][3], 10);
        var rn = String(sData[j][4]).trim();
        if (ry === bYear && rm === bMonth && rn === bNurseId) {
          rowMap[rd] = j + 1;
        }
      }
      
      var nowTime = new Date();
      bookings.forEach(function(item) {
        var d = parseInt(item.day, 10);
        var shStr = Array.isArray(item.shifts) ? item.shifts.join(",") : String(item.shifts);
        if (item.shifts && item.shifts.length > 0) {
          if (rowMap[d]) {
            sBookings.getRange(rowMap[d], 6).setValue(bNurseName);
            sBookings.getRange(rowMap[d], 7).setValue(shStr);
            sBookings.getRange(rowMap[d], 8).setValue("Active");
            sBookings.getRange(rowMap[d], 9).setValue(nowTime);
          } else {
            sBookings.appendRow([
              nowTime, bYear, bMonth, d, bNurseId, bNurseName, shStr, "Active", nowTime
            ]);
          }
        } else if (rowMap[d]) {
          sBookings.deleteRow(rowMap[d]);
        }
      });
      
      updateMatrixView(ss, bYear, bMonth);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "batch_booking",
        count: bookings.length
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // -----------------------------------------------------------------------
    // Action 4: ซิงค์ข้อมูลทั้งเดือน / ล้างเวรทั้งเดือน (Full Month Sync / Reset)
    // -----------------------------------------------------------------------
    if (payload.action === "sync_month_roster") {
      var sYear = parseInt(payload.year, 10);
      var sMonth = parseInt(payload.month, 10);
      var roster = payload.roster || {};
      
      saveRosterToBookingsSheet(ss, sYear, sMonth, roster);
      updateMatrixView(ss, sYear, sMonth);
      
      // บันทึกสำเนาลง PropertiesService ด้วยเพื่อความรวดเร็ว
      var mPropKey = "nurse_system_" + sYear + "_" + sMonth;
      var propVal = JSON.stringify({
        round: 1,
        round1: {},
        round2: {},
        roster: roster,
        isConfirmed: false
      });
      PropertiesService.getScriptProperties().setProperty(mPropKey, propVal);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "sync_month_roster",
        year: sYear,
        month: sMonth
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // -----------------------------------------------------------------------
    // Default Fallback: จัดการข้อมูล Object Key-Value (Backward Compatibility)
    // -----------------------------------------------------------------------
    for (var key in payload) {
      if (key.indexOf("nurse_system_") === 0) {
        try {
          var parts = key.split("_");
          var pYear = parseInt(parts[2], 10);
          var pMonth = parseInt(parts[3], 10);
          var monthData = JSON.parse(payload[key]);
          if (monthData && monthData.roster) {
            saveRosterToBookingsSheet(ss, pYear, pMonth, monthData.roster);
            updateMatrixView(ss, pYear, pMonth);
          }
        } catch (pe) {}
      }
      if (typeof payload[key] === "string") {
        PropertiesService.getScriptProperties().setProperty(key, payload[key]);
      } else {
        PropertiesService.getScriptProperties().setProperty(key, JSON.stringify(payload[key]));
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data synchronized to Google Sheets successfully."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * ฟังก์ชันบันทึก Roster ลงในแท็บ Bookings
 */
function saveRosterToBookingsSheet(ss, year, month, roster) {
  var sheet = ss.getSheetByName(SHEET_BOOKINGS);
  if (!sheet) return;
  
  var data = sheet.getDataRange().getValues();
  // ลบแถวเดิมของปีและเดือนนี้ออก (ลบจากล่างขึ้นบน)
  for (var i = data.length - 1; i >= 1; i--) {
    var rY = parseInt(data[i][1], 10);
    var rM = parseInt(data[i][2], 10);
    if (rY === year && rM === month) {
      sheet.deleteRow(i + 1);
    }
  }
  
  // เพิ่มแถวใหม่ที่มีเวร
  var rowsToAppend = [];
  var now = new Date();
  
  for (var nurseId in roster) {
    var daysObj = roster[nurseId] || {};
    for (var day in daysObj) {
      var shifts = daysObj[day] || [];
      if (shifts.length > 0) {
        rowsToAppend.push([
          now,
          year,
          month,
          parseInt(day, 10),
          nurseId,
          "", // NurseName (ดึงจาก Master หรือปล่อยว่าง)
          shifts.join(","),
          "Active",
          now
        ]);
      }
    }
  }
  
  if (rowsToAppend.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAppend.length, 9).setValues(rowsToAppend);
  }
}

/**
 * ฟังก์ชันสร้าง/อัปเดตตารางแสดงผลแบบ Matrix ในแท็บ "ตารางเวร_Matrix"
 */
function updateMatrixView(ss, year, month) {
  try {
    var sheetMatrix = ss.getSheetByName(SHEET_MATRIX);
    if (!sheetMatrix) return;
    
    var sheetBookings = ss.getSheetByName(SHEET_BOOKINGS);
    var bData = sheetBookings.getDataRange().getValues();
    
    // คำนวณจำนวนวันในเดือน
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // รวบรวมเวร: nurseShifts[nurseId][day] = "M,A"
    var nurseShifts = {};
    var nurseNames = {};
    
    for (var i = 1; i < bData.length; i++) {
      var rY = parseInt(bData[i][1], 10);
      var rM = parseInt(bData[i][2], 10);
      var rD = parseInt(bData[i][3], 10);
      var rNId = String(bData[i][4]).trim();
      var rName = String(bData[i][5]).trim();
      var rSh = String(bData[i][6]).trim();
      var rSt = String(bData[i][7]).trim();
      
      if (rY === year && rM === month && rSt !== "Cancelled" && rSh) {
        if (!nurseShifts[rNId]) nurseShifts[rNId] = {};
        nurseShifts[rNId][rD] = rSh;
        if (rName) nurseNames[rNId] = rName;
      }
    }
    
    // ล้างข้อมูลเดิมในแท็บ Matrix
    sheetMatrix.clearContents();
    
    // สร้างหัวตาราง
    var headers = ["ลำดับ", "รหัสพยาบาล", "ชื่อ - นามสกุล"];
    for (var d = 1; d <= daysInMonth; d++) {
      headers.push(String(d));
    }
    headers.push("รวมเวร");
    headers.push("รวมชั่วโมง");
    
    sheetMatrix.appendRow(headers);
    sheetMatrix.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#1e3a8a")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");
      
    // รายชื่อพยาบาลจากแท็บ Nurses หรือจาก Default
    var sNurses = ss.getSheetByName(SHEET_NURSES);
    var nData = sNurses ? sNurses.getDataRange().getValues() : [];
    var nursesList = [];
    
    if (nData.length > 1) {
      for (var n = 1; n < nData.length; n++) {
        nursesList.push({
          num: nData[n][0],
          id: String(nData[n][1]).trim(),
          name: nData[n][2]
        });
      }
    } else {
      // ถ้าไม่มีในชีต Nurses ให้ดึง NurseId จากที่มีการจอง
      var numCount = 1;
      for (var idKey in nurseShifts) {
        nursesList.push({
          num: numCount++,
          id: idKey,
          name: nurseNames[idKey] || idKey
        });
      }
    }
    
    var matrixRows = [];
    nursesList.forEach(function(nurse, idx) {
      var row = [nurse.num || (idx + 1), nurse.id, nurse.name || nurseNames[nurse.id] || ""];
      var totalShifts = 0;
      
      for (var day = 1; day <= daysInMonth; day++) {
        var sh = (nurseShifts[nurse.id] && nurseShifts[nurse.id][day]) ? nurseShifts[nurse.id][day] : "";
        row.push(sh);
        if (sh) {
          totalShifts += sh.split(",").length;
        }
      }
      row.push(totalShifts);
      row.push(totalShifts * 8);
      matrixRows.push(row);
    });
    
    if (matrixRows.length > 0) {
      sheetMatrix.getRange(2, 1, matrixRows.length, headers.length).setValues(matrixRows);
      sheetMatrix.getRange(2, 1, matrixRows.length, 1).setHorizontalAlignment("center");
      sheetMatrix.getRange(2, 2, matrixRows.length, 1).setHorizontalAlignment("center");
      sheetMatrix.getRange(2, 4, matrixRows.length, daysInMonth + 2).setHorizontalAlignment("center");
    }
  } catch (err) {
    console.warn("Matrix update error:", err);
  }
}

