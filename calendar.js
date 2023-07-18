
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const monthYear = document.getElementById('monthYear');
const calendarBody = document.getElementById('calendarBody');

// Set the current date
let currentDate = new Date();

// Event listeners for prev/next buttons
prevBtn.addEventListener('click', showPreviousMonth);
nextBtn.addEventListener('click', showNextMonth);

// Initial display of the calendar
displayCalendar(currentDate);

// Display the calendar for the given month
async function displayCalendar(date) {
  // Clear the calendar
  calendarBody.innerHTML = '';

  // Set the month and year in the header
  monthYear.textContent = getMonthYearString(date);

  // Get the first day of the month
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  // Determine the number of days in the month
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  // Start the calendar on Sunday
  let dayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay();

  // Create calendar rows and cells
  let row = document.createElement('tr');

  // Add empty cells for days before the first day of the month
  for (let i = 1; i < dayOfWeek; i++) {
    let cell = document.createElement('td');
    row.appendChild(cell);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= lastDay; day++) {
    let cell = document.createElement('td');
    cell.textContent = day;
    if (date.getDate() === day) {
      cell.classList.add('highlight');
    }
    row.appendChild(cell);

    // Start a new row each week (7 cells)
    if (dayOfWeek === 7) {
      calendarBody.appendChild(row);
      row = document.createElement('tr');
      dayOfWeek = 1;
    } else {
      dayOfWeek++;
    }
  }

  // Add the last row if needed
  if (row.children.length > 0) {
    calendarBody.appendChild(row);
  }

  // Display Japanese holidays
  await displayHolidays(date.getFullYear(), date.getMonth() + 1);
}

// Show the previous month
function showPreviousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  displayCalendar(currentDate);
}

// Show the next month
function showNextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  displayCalendar(currentDate);
}

// Get the month and year as a string (e.g., "June 2023")
function getMonthYearString(date) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
}

// Fetch Japanese holidays for the given year and month from an API
async function fetchHolidays(year, month) {
  try {
    const response = await fetch(`https://holidays-jp.shogo82148.com/${year}`);
    const data = await response.json();
    return data.holidays;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}

// Display Japanese holidays in the calendar
async function displayHolidays(year, month) {
  const holidays = await fetchHolidays(year, month);
  holidays.forEach(holiday => {
    const holidayDate = new Date(holiday.date);
    const dayCells = Array.from(calendarBody.querySelectorAll('td'));
    const dayCell = dayCells.find(cell => Number(cell.textContent) === holidayDate.getDate());
    if (dayCell) {
      const holidayElement = document.createElement('div');
      holidayElement.classList.add('holiday');
      holidayElement.textContent = holiday.name;
      dayCell.appendChild(holidayElement);
    }
  });
}

// Add cells for each day of the month
for (let day = 1; day <= lastDay; day++) {
  let cell = document.createElement('td');
  cell.textContent = day;
  cell.setAttribute('data-day', day); // Add data-day attribute
  if (date.getDate() === day) {
    cell.classList.add('highlight');
  }
  row.appendChild(cell);

  // Start a new row each week (7 cells)
  if (dayOfWeek === 7) {
    calendarBody.appendChild(row);
    row = document.createElement('tr');
    dayOfWeek = 1;
  } else {
    dayOfWeek++;
  }
}
