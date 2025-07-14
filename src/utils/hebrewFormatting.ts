import { HDate } from '@hebcal/core';

// Hebrew numerals mapping
const hebrewNumerals: { [key: number]: string } = {
  1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט',
  10: 'י', 11: 'יא', 12: 'יב', 13: 'יג', 14: 'יד', 15: 'טו', 16: 'טז', 17: 'יז', 18: 'יח', 19: 'יט',
  20: 'כ', 21: 'כא', 22: 'כב', 23: 'כג', 24: 'כד', 25: 'כה', 26: 'כו', 27: 'כז', 28: 'כח', 29: 'כט',
  30: 'ל'
};

// Hebrew month names
const hebrewMonthNames: { [key: string]: string } = {
  'Tishrei': 'תשרי',
  'Cheshvan': 'חשון', 
  'Kislev': 'כסלו',
  'Tevet': 'טבת',
  'Sh\'vat': 'שבט',
  'Adar': 'אדר',
  'Adar I': 'אדר א',
  'Adar II': 'אדר ב',
  'Nisan': 'ניסן',
  'Iyyar': 'אייר',
  'Sivan': 'סיון',
  'Tamuz': 'תמוז',
  'Av': 'אב',
  'Elul': 'אלול'
};

export const formatHebrewDate = (date: Date, inHebrew: boolean = false): string => {
  try {
    const hDate = new HDate(date);
    
    if (inHebrew) {
      const day = hebrewNumerals[hDate.getDate()] || hDate.getDate().toString();
      const month = hebrewMonthNames[hDate.getMonthName()] || hDate.getMonthName();
      const year = convertToHebrewYear(hDate.getFullYear());
      return `${day} ב${month} ${year}`;
    } else {
      return hDate.toString();
    }
  } catch (error) {
    console.error('Error formatting Hebrew date:', error);
    return '';
  }
};

export const convertToHebrewYear = (year: number): string => {
  // Convert Hebrew year to Hebrew numerals (simplified)
  // This is a basic implementation - for full accuracy, use HDate.renderHebrew()
  const thousands = Math.floor(year / 1000);
  const remainder = year % 1000;
  const hundreds = Math.floor(remainder / 100);
  const tens = Math.floor((remainder % 100) / 10);
  const ones = remainder % 10;
  
  let result = '';
  
  // Add thousands
  if (thousands > 0) {
    result += hebrewNumerals[thousands] || thousands.toString();
  }
  
  // Add hundreds
  if (hundreds > 0) {
    const hundredsMap: { [key: number]: string } = {
      1: 'ק', 2: 'ר', 3: 'ש', 4: 'ת', 5: 'תק', 6: 'תר', 7: 'תש', 8: 'תת', 9: 'תתק'
    };
    result += hundredsMap[hundreds] || hundreds.toString();
  }
  
  // Add tens and ones
  const lastTwo = tens * 10 + ones;
  if (lastTwo > 0) {
    result += hebrewNumerals[lastTwo] || lastTwo.toString();
  }
  
  // Add geresh/gershayim
  if (result.length === 1) {
    result += "'"; // geresh for single letter
  } else if (result.length > 1) {
    result = result.slice(0, -1) + '"' + result.slice(-1); // gershayim before last letter
  }
  
  return result;
};

export const getHebrewDateInfo = (date: Date) => {
  try {
    const hDate = new HDate(date);
    return {
      day: hDate.getDate(),
      month: hDate.getMonthName(),
      year: hDate.getFullYear(),
      hebrewDay: hebrewNumerals[hDate.getDate()] || hDate.getDate().toString(),
      hebrewMonth: hebrewMonthNames[hDate.getMonthName()] || hDate.getMonthName(),
      hebrewYear: convertToHebrewYear(hDate.getFullYear()),
      toString: () => hDate.toString(),
      renderHebrew: () => formatHebrewDate(date, true)
    };
  } catch (error) {
    console.error('Error getting Hebrew date info:', error);
    return null;
  }
};