// Common functions shared across pages

// Function to format date as YYYY-MM-DD
function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

// Function to get today's date in YYYY-MM-DD format
function getTodayDate() {
    return formatDate(new Date());
}

// Function to set minimum date for date inputs to today
function setMinDateToToday() {
    const today = getTodayDate();
    document.getElementById('start-date').min = today;
}

// Function to save data to localStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to get data from localStorage
function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Function to clear data from localStorage
function clearFromLocalStorage(key) {
    localStorage.removeItem(key);
}