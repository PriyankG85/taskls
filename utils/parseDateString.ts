const monthMap: { [key: string]: number } = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export default function parseDateString(dateString: string): Date {
  const parts = dateString.split(", "); // Split into "Fri" and "Jan 24"
  if (parts.length !== 2) {
    console.warn("Invalid date format:", dateString);
    return new Date(NaN); // Return an invalid Date object
  }

  const monthDay = parts[1].split(" "); // Split into "Jan" and "24"
  if (monthDay.length !== 2) {
    console.warn("Invalid date format:", dateString);
    return new Date(NaN); // Return an invalid Date object
  }

  const month = monthDay[0];
  const day = parseInt(monthDay[1], 10);
  if (isNaN(day)) {
    console.warn("Invalid day:", monthDay[1]);
    return new Date(NaN); // Return an invalid Date object
  }

  const year = new Date().getFullYear(); // Use the current year

  const monthIndex = monthMap[month]; // Look up month index in the map
  if (monthIndex === undefined) {
    console.warn("Invalid month:", month);
    return new Date(NaN); // Return an invalid Date object
  }

  const date = new Date(year, monthIndex, day);
  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", dateString);
    return new Date(NaN); // Return an invalid Date object
  }
  return date;
}
