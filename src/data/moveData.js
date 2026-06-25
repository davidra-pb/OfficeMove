export const PHASES = [
  { id: 1, name: 'גל 1 — חופשי', day: 1, time: '08:00-09:30', type: 'wave', color: '#22c55e', colorLight: '#dcfce7', count: 13 },
  { id: 2, name: 'גל 2 — חופשי', day: 1, time: '09:30-10:30', type: 'wave', color: '#38bdf8', colorLight: '#e0f2fe', count: 4 },
  { id: 3, name: 'גל 3 — חופשי', day: 1, time: '10:30-11:30', type: 'wave', color: '#fbbf24', colorLight: '#fef9c3', count: 3 },
  { id: 4, name: 'גל 4 — סיבוב', day: 1, time: '12:00-13:30', type: 'scc', color: '#a855f7', colorLight: '#f3e8ff', count: 55 },
  { id: 5, name: 'גל 5 — חופשי', day: 2, time: '08:00-09:00', type: 'wave', color: '#fb923c', colorLight: '#fff7ed', count: 9 },
  { id: 6, name: 'גל 6 — חופשי', day: 2, time: '09:00-10:00', type: 'wave', color: '#fdba74', colorLight: '#fff7ed', count: 5 },
  { id: 7, name: 'גל 7 — סיבוב', day: 2, time: '10:00-11:00', type: 'scc', color: '#8b5cf6', colorLight: '#ede9fe', count: 11 },
  { id: 8, name: 'גל 8 — חופשי', day: 2, time: '11:00-13:00', type: 'wave', color: '#2dd4bf', colorLight: '#ccfbf1', count: 6 },
  { id: 9, name: 'גל 9 — סיבוב', day: 2, time: '13:00-14:00', type: 'scc', color: '#6366f1', colorLight: '#e0e7ff', count: 6 },
  { id: 10, name: 'גל 10 — חופשי', day: 2, time: '14:00-15:00', type: 'wave', color: '#fb7185', colorLight: '#ffe4e6', count: 2 },
  { id: 11, name: 'גל 11 — חופשי', day: 2, time: '15:00-15:30', type: 'wave', color: '#ef4444', colorLight: '#fee2e2', count: 3 },
];

export const BUILDINGS = {
  'ישראל קנדה': {
    floors: [
      { id: 'A', num: 8, rooms: ['05A','07A','08A','12A','13A','14A','16A','17A','18A','19A','20A','22A','23A','26A'] },
      { id: 'B', num: 6, rooms: ['1B','2B','3B','4B','5B','6B','7B','8B','9B','10B','11B','12B','13B','14B'] },
      { id: 'C', num: 6, rooms: ['1C','2C','3C','4C','5C','8C','9C','10C'] },
    ]
  },
  'אקרו': {
    floors: [
      { id: 'D', num: 8, rooms: ['2D','3D','4D','5D','6D','7D','8D','9D','10D','11D','12D','13D','14D','16D','17D','18D','19D','20D','21D','22D','23D','24D','25D','26D','27D','29D','30D','31D','32D','33D','34D','35D','36D'] },
      { id: 'E', num: 7, rooms: ['1E','2E','3E','4E','5E','6E','7E','8E','9E','10E','11E','13E','14E'] },
    ]
  }
};

export const DEPARTMENTS = [
  { name: 'כספים', color: '#3b82f6' },
  { name: 'הנדסה', color: '#10b981' },
  { name: 'התחדשות עירונית', color: '#f59e0b' },
  { name: 'כללי', color: '#6b7280' },
  { name: 'משפטי', color: '#8b5cf6' },
  { name: 'מכירות', color: '#ef4444' },
  { name: 'שיווק', color: '#ec4899' },
  { name: 'חווית לקוח', color: '#14b8a6' },
  { name: 'מניבים', color: '#f97316' },
  { name: 'מוקד', color: '#06b6d4' },
  { name: 'סיטי הול', color: '#a855f7' },
  { name: 'מזכירות', color: '#78716c' },
  { name: 'מערכות מידע', color: '#0ea5e9' },
];

export const EMPLOYEES = [
  // גל 1 — חופשי (13 emp)
  { id: 8, first: 'אפי', last: 'דלומי', dept: 'מכירות', oldRoom: '17A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '16A', newBld: 'ישראל קנדה', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 116, first: 'נעמה', last: 'גוטליב', dept: 'מכירות', oldRoom: 'חדש', oldBld: 'עובד חדש', oldFloor: null, newRoom: '16A', newBld: 'ישראל קנדה', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 117, first: 'חן', last: 'פרורודין', dept: 'מכירות', oldRoom: 'חדש', oldBld: 'עובד חדש', oldFloor: null, newRoom: '16A', newBld: 'ישראל קנדה', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 31, first: 'אוריאן', last: 'לזרסקו', dept: 'משפטי', oldRoom: '26D', oldBld: 'אקרו', oldFloor: 8, newRoom: '9B', newBld: 'ישראל קנדה', newFloor: 6, phase: 1, replaces: 'חדר ריק' },
  { id: 50, first: 'אדוה', last: 'יוסף', dept: 'כספים', oldRoom: '5B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '5D', newBld: 'אקרו', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 66, first: 'צבי', last: 'רוב', dept: 'כספים', oldRoom: '1E', oldBld: 'אקרו', oldFloor: 7, newRoom: '17D', newBld: 'אקרו', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 67, first: 'יעל', last: 'דהן', dept: 'מניבים', oldRoom: '07A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '18D', newBld: 'אקרו', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 85, first: 'רחל', last: 'בן חמו', dept: 'כספים', oldRoom: '8B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '32D', newBld: 'אקרו', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 87, first: 'אגם', last: 'לב ארי', dept: 'כספים', oldRoom: '14E', oldBld: 'אקרו', oldFloor: 7, newRoom: '34D', newBld: 'אקרו', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 88, first: 'ליאת', last: 'כהן גוטמן', dept: 'כספים', oldRoom: '9E', oldBld: 'אקרו', oldFloor: 7, newRoom: '35D', newBld: 'אקרו', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 89, first: 'ירין', last: 'בכר', dept: 'כספים', oldRoom: '13E', oldBld: 'אקרו', oldFloor: 7, newRoom: '35D', newBld: 'אקרו', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 90, first: 'דניאל', last: 'יצחקי', dept: 'כספים', oldRoom: '14E', oldBld: 'אקרו', oldFloor: 7, newRoom: '36D', newBld: 'אקרו', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  { id: 91, first: 'נעמה', last: 'טל', dept: 'כספים', oldRoom: '2E', oldBld: 'אקרו', oldFloor: 7, newRoom: '36D', newBld: 'אקרו', newFloor: 8, phase: 1, replaces: 'חדר ריק' },
  // גל 2 — חופשי (4 emp)
  { id: 24, first: 'גיל', last: 'לוי', dept: 'התחדשות עירונית', oldRoom: '20D', oldBld: 'אקרו', oldFloor: 8, newRoom: '5B', newBld: 'ישראל קנדה', newFloor: 6, phase: 2, replaces: 'אדוה יוסף (כספים)' },
  { id: 25, first: 'רועי', last: 'פינקר', dept: 'התחדשות עירונית', oldRoom: '20D', oldBld: 'אקרו', oldFloor: 8, newRoom: '5B', newBld: 'ישראל קנדה', newFloor: 6, phase: 2, replaces: 'אדוה יוסף (כספים)' },
  { id: 92, first: 'שראל', last: 'וינקלר', dept: 'הנדסה', oldRoom: '11D', oldBld: 'אקרו', oldFloor: 8, newRoom: '1E', newBld: 'אקרו', newFloor: 7, phase: 2, replaces: 'צבי רוב (כספים)' },
  { id: 108, first: 'אלינה', last: 'כצמן', dept: 'הנדסה', oldRoom: '13D', oldBld: 'אקרו', oldFloor: 8, newRoom: '13E', newBld: 'אקרו', newFloor: 7, phase: 2, replaces: 'ירין בכר (כספים)' },
  // גל 3 — חופשי (3 emp)
  { id: 58, first: 'שיר', last: 'ארמנדו', dept: 'כספים', oldRoom: '10B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '11D', newBld: 'אקרו', newFloor: 8, phase: 3, replaces: 'שראל וינקלר (הנדסה)' },
  { id: 59, first: 'נוי', last: 'מולגה', dept: 'כספים', oldRoom: '9E', oldBld: 'אקרו', oldFloor: 7, newRoom: '11D', newBld: 'אקרו', newFloor: 8, phase: 3, replaces: 'שראל וינקלר (הנדסה)' },
  { id: 32, first: 'אגם', last: 'אטיה', dept: 'התחדשות עירונית', oldRoom: 'מזכירות', oldBld: 'אקרו', oldFloor: null, newRoom: '10B', newBld: 'ישראל קנדה', newFloor: 6, phase: 3, replaces: 'שיר ארמנדו (כספים)' },
  // גל 4 — סיבוב (55 emp, 14 תתי-שלבים, מקסימום 5 במקביל)
  // תת-שלב 4.01 — פינוי
  { id: 104, first: 'חי', last: 'לוי', dept: 'הנדסה', oldRoom: '8C', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '8E', newBld: 'אקרו', newFloor: 7, phase: 4, replaces: 'הילה וייטנברג (כספים)' , moveStep: 1 },
  // תת-שלב 4.02 — 5 במקביל
  { id: 42, first: 'מיקה', last: 'ארבוב', dept: 'חווית לקוח', oldRoom: '25D', oldBld: 'אקרו', oldFloor: 8, newRoom: '8C', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'חי לוי (הנדסה)' , moveStep: 2 },
  { id: 79, first: 'שמוליק', last: 'סימן טוב', dept: 'כללי', oldRoom: '14D', oldBld: 'אקרו', oldFloor: 8, newRoom: '25D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'מיקה ארבוב (חווית לקוח)' , moveStep: 2 },
  { id: 64, first: 'אלונה', last: 'מור', dept: 'כספים', oldRoom: '6D', oldBld: 'אקרו', oldFloor: 8, newRoom: '14D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'שמוליק סימן טוב (כללי)' , moveStep: 2 },
  { id: 51, first: 'ניר', last: 'בר', dept: 'כספים', oldRoom: '11B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '6D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'אלונה מור (כספים)' , moveStep: 2 },
  { id: 33, first: 'דקלה', last: 'פרסיקו', dept: 'התחדשות עירונית', oldRoom: '19D', oldBld: 'אקרו', oldFloor: 8, newRoom: '11B', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'ניר בר (כספים)' , moveStep: 2 },
  // תת-שלב 4.03 — 5 במקביל
  { id: 68, first: 'מיכל', last: 'חיון', dept: 'כספים', oldRoom: '7B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '19D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: "דקלה פרסיקו (התח\"ע)" , moveStep: 3 },
  { id: 69, first: 'רפאל', last: 'ממרן', dept: 'כספים', oldRoom: '7B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '19D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: "דקלה פרסיקו (התח\"ע)" , moveStep: 3 },
  { id: 27, first: 'טום', last: 'זינגרלייך', dept: 'התחדשות עירונית', oldRoom: '20D', oldBld: 'אקרו', oldFloor: 8, newRoom: '7B', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'מיכל חיון, רפאל ממרן (כספים)' , moveStep: 3 },
  { id: 28, first: 'עידו', last: 'גורדון', dept: 'התחדשות עירונית', oldRoom: '20D', oldBld: 'אקרו', oldFloor: 8, newRoom: '7B', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'מיכל חיון, רפאל ממרן (כספים)' , moveStep: 3 },
  { id: 29, first: 'לירן', last: 'דואק', dept: 'התחדשות עירונית', oldRoom: '20D', oldBld: 'אקרו', oldFloor: 8, newRoom: '7B', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'מיכל חיון, רפאל ממרן (כספים)' , moveStep: 3 },
  // תת-שלב 4.04 — 2 במקביל
  { id: 70, first: 'ליאת', last: 'כחלון', dept: 'כספים', oldRoom: '14E', oldBld: 'אקרו', oldFloor: 7, newRoom: '20D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'צוות 20D הישן' , moveStep: 4 },
  { id: 71, first: 'דבורה', last: 'גברי', dept: 'כספים', oldRoom: '14E', oldBld: 'אקרו', oldFloor: 7, newRoom: '20D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'צוות 20D הישן' , moveStep: 4 },
  // תת-שלב 4.05 — 4 במקביל [swap]
  { id: 44, first: 'הודיה', last: 'שבבו', dept: 'חווית לקוח', oldRoom: '27D', oldBld: 'אקרו', oldFloor: 8, newRoom: '9C', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'ליאן סגל (כספים)' , moveStep: 5 },
  { id: 115, first: 'דנית', last: 'דוד', dept: 'כספים', oldRoom: '2E', oldBld: 'אקרו', oldFloor: 7, newRoom: '27D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'הודיה שבבו (חווית לקוח)' , moveStep: 5 },
  { id: 94, first: 'יעל', last: 'כספי', dept: 'הנדסה', oldRoom: '7D', oldBld: 'אקרו', oldFloor: 8, newRoom: '2E', newBld: 'אקרו', newFloor: 7, phase: 4, replaces: 'נעמה טל (כספים)' , moveStep: 5 },
  { id: 80, first: 'בטי', last: 'ליבר', dept: 'כספים', oldRoom: '14E', oldBld: 'אקרו', oldFloor: 7, newRoom: '26D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'תמר נתנאל, אוריאן' , moveStep: 5 },
  // תת-שלב 4.06 — 5 במקביל
  { id: 81, first: 'רימון', last: 'אלמוג', dept: 'מזכירות', oldRoom: '33D', oldBld: 'אקרו', oldFloor: 8, newRoom: '27D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'הודיה שבבו (חווית לקוח)' , moveStep: 6 },
  { id: 86, first: 'אמיר', last: 'למפרט', dept: 'מערכות מידע', oldRoom: '17A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '33D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'רימון אלמוג (מזכירות)' , moveStep: 6 },
  { id: 93, first: 'אביעד', last: 'פרחי', dept: 'הנדסה', oldRoom: '2C', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '2E', newBld: 'אקרו', newFloor: 7, phase: 4, replaces: 'נעמה טל (כספים)' , moveStep: 6 },
  { id: 109, first: 'חגי', last: 'הרוש', dept: 'הנדסה', oldRoom: '12D', oldBld: 'אקרו', oldFloor: 8, newRoom: '14E', newBld: 'אקרו', newFloor: 7, phase: 4, replaces: 'חדר 14E הישן' , moveStep: 6 },
  { id: 9, first: 'הילה', last: 'רוית', dept: 'מכירות', oldRoom: '10E', oldBld: 'אקרו', oldFloor: 7, newRoom: '17A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'אפי דלומי, אמיר למפרט' , moveStep: 6 },
  // תת-שלב 4.07 — 4 במקביל
  { id: 60, first: 'ליאן', last: 'סגל', dept: 'כספים', oldRoom: '9C', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '12D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'חגי הרוש (הנדסה)' , moveStep: 7 },
  { id: 10, first: "ג'ואן", last: 'יוחאי', dept: 'מוקד', oldRoom: '10E', oldBld: 'אקרו', oldFloor: 7, newRoom: '17A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'אפי דלומי, אמיר למפרט' , moveStep: 7 },
  { id: 110, first: 'קארין', last: 'משה', dept: 'הנדסה', oldRoom: '10E', oldBld: 'אקרו', oldFloor: 7, newRoom: '14E', newBld: 'אקרו', newFloor: 7, phase: 4, replaces: 'חדר 14E הישן' , moveStep: 7 },
  { id: 43, first: 'תמר', last: 'נתנאל', dept: 'חווית לקוח', oldRoom: '26D', oldBld: 'אקרו', oldFloor: 8, newRoom: '9C', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'ליאן סגל (כספים)' , moveStep: 7 },
  // תת-שלב 4.08 — 5 במקביל [swap]
  { id: 103, first: 'ולאד', last: 'קזצבורג', dept: 'הנדסה', oldRoom: '13D', oldBld: 'אקרו', oldFloor: 8, newRoom: '8E', newBld: 'אקרו', newFloor: 7, phase: 4, replaces: 'הילה וייטנברג (כספים)' , moveStep: 8 },
  { id: 30, first: 'ורד', last: 'לזר', dept: 'משפטי', oldRoom: '2D', oldBld: 'אקרו', oldFloor: 8, newRoom: '8B', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'רחל בן חמו, אינה שניידר (כספים)' , moveStep: 8 },
  { id: 46, first: 'אורון', last: "ג'ואנה", dept: 'כספים', oldRoom: '6E', oldBld: 'אקרו', oldFloor: 7, newRoom: '2D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'ורד לזר (משפטי)' , moveStep: 8 },
  { id: 100, first: 'אריאל', last: 'סבג', dept: 'הנדסה', oldRoom: '7D', oldBld: 'אקרו', oldFloor: 8, newRoom: '6E', newBld: 'אקרו', newFloor: 7, phase: 4, replaces: "אורון ג'ואנה, צחר שטיווי (כספים)" , moveStep: 8 },
  { id: 38, first: 'ערן', last: 'שני', dept: 'סיטי הול', oldRoom: '22A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '2C', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'גלית שמיעה, אביעד פרחי (הנדסה)' , moveStep: 8 },
  // תת-שלב 4.09 — 5 במקביל
  { id: 2, first: 'ליאור', last: 'אביב', dept: 'כללי', oldRoom: '26A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '08A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'יצחק סער (שיווק)' , moveStep: 9 },
  { id: 3, first: 'גיל', last: 'זלצר', dept: 'כללי', oldRoom: '26A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '08A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'יצחק סער (שיווק)' , moveStep: 9 },
  { id: 14, first: 'יצחק', last: 'סער', dept: 'שיווק', oldRoom: '08A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '22A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'ערן שני (סיטי הול)' , moveStep: 9 },
  { id: 52, first: 'טל', last: 'אביבי', dept: 'כספים', oldRoom: '12B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '7D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'אריאל סבג, יעל כספי (הנדסה)' , moveStep: 9 },
  { id: 34, first: 'אלי', last: 'גדעון', dept: 'משפטי', oldRoom: '5C', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '12B', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'טל אביבי (כספים)' , moveStep: 9 },
  // תת-שלב 4.10 — 5 במקביל
  { id: 41, first: 'חן', last: 'קליין', dept: 'סיטי הול', oldRoom: '14A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '5C', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'אלי גדעון (משפטי)' , moveStep: 10 },
  { id: 16, first: 'נעמה', last: 'רז', dept: 'שיווק', oldRoom: '23D', oldBld: 'אקרו', oldFloor: 8, newRoom: '26A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'ליאור אביב, גיל זלצר (כללי)' , moveStep: 10 },
  { id: 7, first: 'מאי', last: 'לוי', dept: 'משפטי', oldRoom: '18A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '14A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'חן קליין (סיטי הול)' , moveStep: 10 },
  { id: 11, first: 'סיון', last: 'חקק', dept: 'מוקד', oldRoom: '20A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '18A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'מאי לוי (משפטי)' , moveStep: 10 },
  { id: 53, first: 'טל', last: 'חוגי', dept: 'כספים', oldRoom: '13B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '7D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'אריאל סבג, יעל כספי (הנדסה)' , moveStep: 10 },
  // תת-שלב 4.11 — 5 במקביל
  { id: 6, first: 'שי', last: 'קורן', dept: 'משפטי', oldRoom: '23D', oldBld: 'אקרו', oldFloor: 8, newRoom: '14A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'חן קליין (סיטי הול)' , moveStep: 11 },
  { id: 63, first: 'רועי', last: 'בן אבי', dept: 'כספים', oldRoom: '5E', oldBld: 'אקרו', oldFloor: 7, newRoom: '13D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'אלינה כצמן, ולאד קזצבורג (הנדסה)' , moveStep: 11 },
  { id: 13, first: 'נלי', last: 'דוביבין', dept: 'מוקד', oldRoom: '10E', oldBld: 'אקרו', oldFloor: 7, newRoom: '20A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'סיון חקק (מוקד)' , moveStep: 11 },
  { id: 35, first: 'נתן', last: 'חדד', dept: 'משפטי', oldRoom: '10E', oldBld: 'אקרו', oldFloor: 7, newRoom: '13B', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'טל חוגי (כספים)' , moveStep: 11 },
  { id: 106, first: 'אמיר', last: 'מלאך', dept: 'הנדסה', oldRoom: '10D', oldBld: 'אקרו', oldFloor: 8, newRoom: '10E', newBld: 'אקרו', newFloor: 7, phase: 4, replaces: 'חדר 10E הישן' , moveStep: 11 },
  // תת-שלב 4.12 — 5 במקביל
  { id: 57, first: 'גיא', last: 'קנדה', dept: 'כספים', oldRoom: '14B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '10D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'אמיר מלאך (הנדסה)' , moveStep: 12 },
  { id: 36, first: 'רעות', last: 'הדר', dept: 'משפטי', oldRoom: '23A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '14B', newBld: 'ישראל קנדה', newFloor: 6, phase: 4, replaces: 'גיא קנדה (כספים)' , moveStep: 12 },
  { id: 15, first: 'גיל', last: "גורביץ'", dept: 'שיווק', oldRoom: '3D', oldBld: 'אקרו', oldFloor: 8, newRoom: '23A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'רעות הדר (משפטי)' , moveStep: 12 },
  { id: 77, first: 'אינה', last: 'שניידר', dept: 'כספים', oldRoom: '8B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '23D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'נעמה רז, שי קורן' , moveStep: 12 },
  { id: 114, first: 'אמירה', last: 'דינקוביץ', dept: 'שיווק', oldRoom: '26D', oldBld: 'אקרו', oldFloor: 8, newRoom: '26A', newBld: 'ישראל קנדה', newFloor: 8, phase: 4, replaces: 'ליאור אביב, גיל זלצר (כללי)' , moveStep: 12 },
  // תת-שלב 4.13 — 4 במקביל
  { id: 48, first: 'הילה', last: 'וייטנברג', dept: 'כספים', oldRoom: '8E', oldBld: 'אקרו', oldFloor: 7, newRoom: '3D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: "גיל גורביץ' (שיווק)" , moveStep: 13 },
  { id: 98, first: 'גלית', last: 'שמיעה', dept: 'הנדסה', oldRoom: '2C', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '5E', newBld: 'אקרו', newFloor: 7, phase: 4, replaces: 'ליאל בנימין, רועי בן אבי (כספים)' , moveStep: 13 },
  { id: 47, first: 'צחר', last: 'שטיווי', dept: 'כספים', oldRoom: '6E', oldBld: 'אקרו', oldFloor: 7, newRoom: '2D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'ורד לזר (משפטי)' , moveStep: 13 },
  { id: 62, first: 'ליאל', last: 'בנימין', dept: 'כספים', oldRoom: '5E', oldBld: 'אקרו', oldFloor: 7, newRoom: '13D', newBld: 'אקרו', newFloor: 8, phase: 4, replaces: 'אלינה כצמן, ולאד קזצבורג (הנדסה)' , moveStep: 13 },
  // תת-שלב 4.14 — כניסה לחדר יעד
  // גל 5 — חופשי (9 emp)
  { id: 17, first: 'ליאן', last: 'וינשטיין', dept: 'שיווק', oldRoom: '31D', oldBld: 'אקרו', oldFloor: 8, newRoom: '26A', newBld: 'ישראל קנדה', newFloor: 8, phase: 5, replaces: 'ליאור אביב, גיל זלצר (כללי)' },
  { id: 61, first: 'קרן', last: 'פינסטרבוש', dept: 'כספים', oldRoom: '4C', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '12D', newBld: 'אקרו', newFloor: 8, phase: 5, replaces: 'חגי הרוש (הנדסה)' },
  { id: 72, first: 'ליטל', last: 'זעפרן', dept: 'כספים', oldRoom: '4B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '21D', newBld: 'אקרו', newFloor: 8, phase: 5, replaces: 'מפוצל מ-20D הישן' },
  { id: 73, first: 'ניקול', last: 'גלעדי', dept: 'כספים', oldRoom: '4B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '21D', newBld: 'אקרו', newFloor: 8, phase: 5, replaces: 'מפוצל מ-20D הישן' },
  { id: 76, first: 'אורטל', last: 'סיני', dept: 'כספים', oldRoom: '13A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '23D', newBld: 'אקרו', newFloor: 8, phase: 5, replaces: 'נעמה רז, שי קורן' },
  { id: 97, first: 'רותם', last: 'בן יהודה', dept: 'הנדסה', oldRoom: '8D', oldBld: 'אקרו', oldFloor: 8, newRoom: '5E', newBld: 'אקרו', newFloor: 7, phase: 5, replaces: 'ליאל בנימין, רועי בן אבי (כספים)' },
  { id: 99, first: 'יולה', last: "גורביץ'", dept: 'הנדסה', oldRoom: '4D', oldBld: 'אקרו', oldFloor: 8, newRoom: '6E', newBld: 'אקרו', newFloor: 7, phase: 5, replaces: "אורון ג'ואנה, צחר שטיווי (כספים)" },
  { id: 111, first: 'שלי', last: 'לוי', dept: 'הנדסה', oldRoom: 'מזכירות', oldBld: 'אקרו', oldFloor: 8, newRoom: '14E', newBld: 'אקרו', newFloor: 7, phase: 5, replaces: 'חדר 14E הישן' },
  { id: 112, first: 'אוהד', last: 'יצחקי', dept: 'מניבים', oldRoom: '16D', oldBld: 'אקרו', oldFloor: 8, newRoom: '14E', newBld: 'אקרו', newFloor: 7, phase: 5, replaces: 'חדר 14E הישן' },
  // גל 6 — חופשי (5 emp)
  { id: 5, first: 'ווסילי', last: 'טולקנץ', dept: 'כללי', oldRoom: '29D', oldBld: 'אקרו', oldFloor: 8, newRoom: '13A', newBld: 'ישראל קנדה', newFloor: 8, phase: 6, replaces: 'אורטל סיני (כספים)' },
  { id: 22, first: 'נועם', last: 'ורבנר', dept: 'התחדשות עירונית', oldRoom: 'חדש', oldBld: 'עובד חדש', oldFloor: null, newRoom: '4B', newBld: 'ישראל קנדה', newFloor: 6, phase: 6, replaces: 'ליטל זעפרן, ניקול גלעדי (כספים)' },
  { id: 23, first: 'יותם', last: 'שפרינג', dept: 'התחדשות עירונית', oldRoom: '29D', oldBld: 'אקרו', oldFloor: 8, newRoom: '4B', newBld: 'ישראל קנדה', newFloor: 6, phase: 6, replaces: 'ליטל זעפרן, ניקול גלעדי (כספים)' },
  { id: 40, first: 'אדוה', last: 'בן יהודה', dept: 'חווית לקוח', oldRoom: 'חדש', oldBld: 'עובד חדש', oldFloor: null, newRoom: '4C', newBld: 'ישראל קנדה', newFloor: 6, phase: 6, replaces: 'קרן פינסטרבוש (כספים)' },
  { id: 84, first: 'נטלי', last: 'דהן', dept: 'כספים', oldRoom: '3E', oldBld: 'אקרו', oldFloor: 7, newRoom: '31D', newBld: 'אקרו', newFloor: 8, phase: 6, replaces: 'ליאן וינשטיין, ערן קאופמן' },
  // גל 7 — סיבוב (11 emp, 3 תתי-שלבים, סדר נחש)
  // תת-שלב 7.01 — 5 במקביל
  { id: 49, first: 'לימור', last: 'סיני', dept: 'כספים', oldRoom: '11E', oldBld: 'אקרו', oldFloor: 7, newRoom: '4D', newBld: 'אקרו', newFloor: 8, phase: 7, replaces: "יולה גורבצ'ב, דלית שעיה" , moveStep: 1 },
  { id: 107, first: 'מורן', last: 'משה', dept: 'הנדסה', oldRoom: '9D', oldBld: 'אקרו', oldFloor: 8, newRoom: '11E', newBld: 'אקרו', newFloor: 7, phase: 7, replaces: 'לימור סיני (כספים)' , moveStep: 1 },
  { id: 56, first: 'נאור', last: 'צברי', dept: 'כספים', oldRoom: '4E', oldBld: 'אקרו', oldFloor: 7, newRoom: '9D', newBld: 'אקרו', newFloor: 8, phase: 7, replaces: 'מורן משה (הנדסה)' , moveStep: 1 },
  { id: 96, first: 'יאיר', last: 'מזעקי', dept: 'הנדסה', oldRoom: '8D', oldBld: 'אקרו', oldFloor: 8, newRoom: '3E', newBld: 'אקרו', newFloor: 7, phase: 7, replaces: 'נטלי דהן (כספים)' , moveStep: 1 },
  { id: 55, first: 'יובל', last: 'דהן', dept: 'כספים', oldRoom: '3B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '8D', newBld: 'אקרו', newFloor: 8, phase: 7, replaces: 'יאיר מזעקי, רותם בן יהודה (הנדסה)' , moveStep: 1 },
  // תת-שלב 7.02 — 5 במקביל
  { id: 21, first: 'סתיו', last: 'מזרחי', dept: 'התחדשות עירונית', oldRoom: '29D', oldBld: 'אקרו', oldFloor: 8, newRoom: '3B', newBld: 'ישראל קנדה', newFloor: 6, phase: 7, replaces: 'יובל דהן (כספים)' , moveStep: 2 },
  { id: 82, first: 'עומר', last: 'לוי', dept: 'מניבים', oldRoom: '07A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '29D', newBld: 'אקרו', newFloor: 8, phase: 7, replaces: 'סתיו מזרחי, ווסילי, יותם שפרינג' , moveStep: 2 },
  { id: 1, first: 'אורי', last: 'עינב', dept: 'מכירות', oldRoom: '24D', oldBld: 'אקרו', oldFloor: 8, newRoom: '07A', newBld: 'ישראל קנדה', newFloor: 8, phase: 7, replaces: 'עומר לוי, יעל דהן (מניבים)' , moveStep: 2 },
  { id: 78, first: 'קובי', last: 'רפי', dept: 'כספים', oldRoom: '7E', oldBld: 'אקרו', oldFloor: 7, newRoom: '24D', newBld: 'אקרו', newFloor: 8, phase: 7, replaces: 'אורי עינב (מכירות)' , moveStep: 2 },
  { id: 102, first: 'גילי', last: 'שורק', dept: 'הנדסה', oldRoom: '3C', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '7E', newBld: 'אקרו', newFloor: 7, phase: 7, replaces: 'קובי רפי (כספים)' , moveStep: 2 },
  // תת-שלב 7.03
  { id: 39, first: 'דלית', last: 'שעיה', dept: 'כללי', oldRoom: '4D', oldBld: 'אקרו', oldFloor: 8, newRoom: '3C', newBld: 'ישראל קנדה', newFloor: 6, phase: 7, replaces: 'גילי שורק (הנדסה)' , moveStep: 3 },
  // גל 8 — חופשי (6 emp)
  { id: 54, first: 'נעמה', last: 'אטלן', dept: 'כספים', oldRoom: '9E', oldBld: 'אקרו', oldFloor: 7, newRoom: '8D', newBld: 'אקרו', newFloor: 8, phase: 8, replaces: 'יאיר מזעקי, רותם בן יהודה (הנדסה)' },
  { id: 101, first: 'עידן', last: 'נחום', dept: 'הנדסה', oldRoom: '16D', oldBld: 'אקרו', oldFloor: 8, newRoom: '7E', newBld: 'אקרו', newFloor: 7, phase: 8, replaces: 'קובי רפי (כספים)' },
  { id: 65, first: 'גיא', last: 'מרגולין', dept: 'הנדסה', oldRoom: '05A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '16D', newBld: 'אקרו', newFloor: 8, phase: 8, replaces: 'אוהד יצחקי, עידן נחום' },
  { id: 105, first: 'צחי', last: 'אהרוני', dept: 'הנדסה', oldRoom: '1C', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '9E', newBld: 'אקרו', newFloor: 7, phase: 8, replaces: 'ליאת כהן גוטמן, נוי מולגה, נעמה אטלן' },
  { id: 37, first: 'מני', last: 'כהן', dept: 'שיווק', oldRoom: 'חדש', oldBld: 'עובד חדש', oldFloor: null, newRoom: '1C', newBld: 'ישראל קנדה', newFloor: 6, phase: 8, replaces: 'צחי אהרוני (הנדסה)' },
  { id: 113, first: 'עומר', last: 'גולד', dept: 'מכירות', oldRoom: '25D', oldBld: 'אקרו', oldFloor: 8, newRoom: '05A', newBld: 'ישראל קנדה', newFloor: 8, phase: 8, replaces: 'גיא מרגולין (הנדסה)' },
  // גל 9 — סיבוב (6 emp, 2 תתי-שלבים, סדר נחש)
  // תת-שלב 9.01 — 5 במקביל
  { id: 45, first: 'נועה', last: 'בן פורת', dept: 'כללי', oldRoom: '12A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '10C', newBld: 'ישראל קנדה', newFloor: 6, phase: 9, replaces: 'משה פדלון (כללי)' , moveStep: 1 },
  { id: 18, first: 'משה', last: 'פדלון', dept: 'כללי', oldRoom: '10C', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '1B', newBld: 'ישראל קנדה', newFloor: 6, phase: 9, replaces: 'ישראל קרן (כספים)' , moveStep: 1 },
  { id: 83, first: 'ישראל', last: 'קרן', dept: 'כספים', oldRoom: '1B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '30D', newBld: 'אקרו', newFloor: 8, phase: 9, replaces: 'קובי עקיבא (מניבים)' , moveStep: 1 },
  { id: 95, first: 'קובי', last: 'עקיבא', dept: 'מניבים', oldRoom: '30D', oldBld: 'אקרו', oldFloor: 8, newRoom: '4E', newBld: 'אקרו', newFloor: 7, phase: 9, replaces: 'נאור צברי (כספים)' , moveStep: 1 },
  { id: 4, first: 'עופר', last: 'ריחני', dept: 'מכירות', oldRoom: '19A', oldBld: 'ישראל קנדה', oldFloor: 8, newRoom: '12A', newBld: 'ישראל קנדה', newFloor: 8, phase: 9, replaces: 'נועה בן פורת (כללי)' , moveStep: 1 },
  // תת-שלב 9.02
  { id: 12, first: 'ערן', last: 'קאופמן', dept: 'מכירות', oldRoom: '31D', oldBld: 'אקרו', oldFloor: 8, newRoom: '19A', newBld: 'ישראל קנדה', newFloor: 8, phase: 9, replaces: 'עופר ריחני (מכירות)' , moveStep: 2 },
  // גל 10 — חופשי (2 emp)
  { id: 19, first: 'עינב', last: 'גפן', dept: 'מכירות', oldRoom: '2B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '1B', newBld: 'ישראל קנדה', newFloor: 6, phase: 10, replaces: 'ישראל קרן (כספים)' },
  { id: 20, first: 'חיים', last: 'פיין', dept: 'התחדשות עירונית', oldRoom: '22D', oldBld: 'אקרו', oldFloor: 8, newRoom: '2B', newBld: 'ישראל קנדה', newFloor: 6, phase: 10, replaces: 'עינב גפן (מכירות)' },
  // גל 11 — חופשי (3 emp)
  { id: 74, first: 'לנה', last: 'גלבוע', dept: 'כספים', oldRoom: '6B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '22D', newBld: 'אקרו', newFloor: 8, phase: 11, replaces: "אמיר בראל, חיים פיין (התח\"ע)" },
  { id: 26, first: 'אמיר', last: 'בראל', dept: 'התחדשות עירונית', oldRoom: '22D', oldBld: 'אקרו', oldFloor: 8, newRoom: '6B', newBld: 'ישראל קנדה', newFloor: 6, phase: 11, replaces: "לנה גלבוע, סבטלנה ליאכובוצ'קי (כספים)" },
  { id: 75, first: 'סבטלנה', last: "ליאכובוצ'קי", dept: 'כספים', oldRoom: '6B', oldBld: 'ישראל קנדה', oldFloor: 6, newRoom: '22D', newBld: 'אקרו', newFloor: 8, phase: 11, replaces: "אמיר בראל, חיים פיין (התח\"ע)" },
];
