/**
 * ข้อมูลพยาบาล 14 ท่าน, กะเวลา, และบัญชีผู้ดูแลระบบ
 */

export const ADMIN_CREDENTIALS = {
  username: "Admin",
  password: "1234"
};

export const SHIFTS = {
  M: {
    id: 'M',
    code: 'ช',
    name: 'เวรเช้า',
    time: '08:30 - 16:30 น.',
    hours: 8,
    badgeClass: 'shift-m',
    color: '#0284c7',
    defaultReq: 2
  },
  A: {
    id: 'A',
    code: 'บ',
    name: 'เวรบ่าย',
    time: '16:30 - 00:30 น.',
    hours: 8,
    badgeClass: 'shift-a',
    color: '#d97706',
    defaultReq: 2
  },
  N: {
    id: 'N',
    code: 'ด',
    name: 'เวรดึก',
    time: '00:30 - 08:30 น.',
    hours: 8,
    badgeClass: 'shift-n',
    color: '#7c3aed',
    defaultReq: 1
  }
};

export const NURSES = [
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

export const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// ลำดับวันตามปฏิทินสากล เริ่มจากวันอาทิตย์ (Sunday)
export const CALENDAR_DAYS = [
  { th: "อา.", en: "Sun", isWeekend: true },
  { th: "จ.", en: "Mon", isWeekend: false },
  { th: "อ.", en: "Tue", isWeekend: false },
  { th: "พ.", en: "Wed", isWeekend: false },
  { th: "พฤ.", en: "Thu", isWeekend: false },
  { th: "ศ.", en: "Fri", isWeekend: false },
  { th: "ส.", en: "Sat", isWeekend: true }
];
