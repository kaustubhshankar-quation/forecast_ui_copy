import { Store } from 'react-notifications-component';
import { format, addMonths, parseISO, isAfter } from 'date-fns';

/*
 displayMessage("success | danger ", "String Title", `String Sub-title`);
*/
function displayMessage(type, title, message) {
  Store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "top",
    container: "bottom-left",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: false,
      pauseOnHover: true
    },

  });
}

function formatDateToDDMMMYYYY(date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
  const month = months[date.getMonth()]; // Get the short month name
  const year = date.getFullYear(); // Get the full year

  return `${day}-${month}-${year}`;
}

/*
storageType : 'local' | 'session'
storageObjectName : string

*/
function setValue(storageType, storageObjectName, propertyName, value) {
  let storageObjectStr = null;
  if (storageType.toLowerCase() === 'local') {
    storageObjectStr = localStorage.getItem(storageObjectName);
  } else if (storageType.toLowerCase() === 'session') {
    storageObjectStr = sessionStorage.getItem(storageObjectName);
  }
  let storeObject = null;
  if (storageObjectStr !== null) {
    storeObject = JSON.parse(storageObjectStr);
    if (propertyName && storeObject) {
      storeObject[propertyName] = value;
    } else if (!propertyName && storeObject) {
      storeObject = value;
    } else {
      return false; // when propertyName is defined but not the storageObjectName
    }
  } else {
    storeObject = {};
    if (propertyName && storageObjectName) {
      storeObject[propertyName] = value;
    } else if (!propertyName && storeObject) {
      storeObject = value;
    } else {
      return false; // when propertyName is defined but not the storageObjectName
    }
  }

  if (storageType.toLowerCase() === 'local') {
    localStorage.setItem(storageObjectName, JSON.stringify(storeObject));
  } else if (storageType.toLowerCase() === 'session') {
    sessionStorage.setItem(storageObjectName, JSON.stringify(storeObject));
  }
  return true;
}

function getValue(storageType, storageObjectName, propertyName) {
  let storageObjectStr = null;
  if (storageType.toLowerCase() === 'local') {
    storageObjectStr = localStorage.getItem(storageObjectName);
  } else if (storageType.toLowerCase() === 'session') {
    storageObjectStr = sessionStorage.getItem(storageObjectName);
  }
  if (storageObjectStr !== null) {
    let storeObject = JSON.parse(storageObjectStr); //https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
    if (propertyName && storeObject.hasOwnProperty(propertyName)) {
      return storeObject[propertyName];
    } else {
      return storeObject;
    }
  }
  else {
    return null;
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}



function generateMonthYearLabels(startDate, endDate) {
  if (!startDate || !endDate) return [];
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const labels = [];
  let current = start;

  while (!isAfter(current, end)) {
    labels.push(format(current, 'MMM yyyy')); // e.g., Jan 2025
    current = addMonths(current, 1);
  }

  return labels;
}

/**
 * Converts server ISO time to user's local time display (India format)
 * Input: "2025-09-08T05:56:37.492171" 
 * Output: "8/9/2025, 11:26 AM" (local IST)
 */
const convertServerTimeToLocal = (serverTime) => {
  if (!serverTime) return '';
  
  try {
    // Parse WITHOUT timezone first
    const utcDate = new Date(serverTime + '+00:00'); // Force UTC interpretation
    
    if (isNaN(utcDate.getTime())) return '';
    
    // Convert to user's LOCAL timezone - TIME ONLY
    return utcDate.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',  // Explicit IST for India users
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.warn('Invalid server time:', serverTime);
    return '';
  }
};

const zeroIfNegative = (value) => Math.max(Number(value) || 0, 0);


export {
  displayMessage,
  formatDateToDDMMMYYYY,
  setValue,
  getValue,
  isEmpty,
  generateMonthYearLabels,
  convertServerTimeToLocal,
  zeroIfNegative
}


