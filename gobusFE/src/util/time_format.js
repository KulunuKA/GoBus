function convertTo12HourFormat(time) {
  let [hours, minutes] = time.split(":").map(Number);
  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; 
  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export { convertTo12HourFormat };