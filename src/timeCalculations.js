// Update inputs once, just in case input values were stored by the browser, 
// so that the output fields update
for (var i = 0; i < days.length; i++) {
  const day = days[i];
  onTimeInput(`HT-${day}`);
  onTimeInput(`VT-${day}`);
}

/**
 * Calculates amount of minutes worked in a day and displays them in output field.
 * Also updates styling of input-element depending on content.
 * As well as auto-formatting when the user types stuff like 1600 or 16.00 instead of 16:00.
 * Including the updating of weekly time.
 * @param { String } termAndDay A string containing both the term and day of this input element. E.g. "HT-mon"
 */
function onTimeInput(termAndDay) {
  // Get input elements.
  const dayStartElement = document.getElementById(`${termAndDay}-day-start`);
  const dayEndElement = document.getElementById(`${termAndDay}-day-end`);
  const lunchStartElement = document.getElementById(`${termAndDay}-lunch-start`);
  const lunchEndElement = document.getElementById(`${termAndDay}-lunch-end`);

  // Add "contains-value" class if element contains value, remove it if not.
  dayStartElement.value ? dayStartElement.classList.add("contains-value") : dayStartElement.classList.remove("contains-value");
  dayEndElement.value ? dayEndElement.classList.add("contains-value") : dayEndElement.classList.remove("contains-value");
  lunchStartElement.value ? lunchStartElement.classList.add("contains-value") : lunchStartElement.classList.remove("contains-value");
  lunchEndElement.value ? lunchEndElement.classList.add("contains-value") : lunchEndElement.classList.remove("contains-value");

  // Fix formatting as user is inputting data.
  fixTimeFormatting(dayStartElement);
  fixTimeFormatting(dayEndElement);
  fixTimeFormatting(lunchStartElement);
  fixTimeFormatting(lunchEndElement);

  // Only continue if all inputs are valid.
  if (
    !dayStartElement.validity.valid ||
    !dayEndElement.validity.valid ||
    !lunchStartElement.validity.valid ||
    !lunchEndElement.validity.valid
  ) {
    // Update output field to display that minutes can't be calculated.
    document.getElementById(`${termAndDay}-minutes`).value = "-";
    return;
  }

  // Try to update weekly time.
  updateWeeklyTime(termAndDay.split("-")[0]);

  // Calculate amount of work-minutes.
  const workDurationMin =
    calculateWorkMinutes(dayStartElement, dayEndElement, lunchStartElement, lunchEndElement);

  // Update output field to display minutes.
  document.getElementById(`${termAndDay}-minutes`).value = formatMinutes(workDurationMin);
}

function updateWeeklyTime(term) {
  var totalMinutes = 0;
  for (var i = 0; i < days.length; i++) {
    const day = days[i];
    const termAndDay = `${term}-${day}`;

    const dayStartElement = document.getElementById(`${termAndDay}-day-start`);
    const dayEndElement = document.getElementById(`${termAndDay}-day-end`);
    const lunchStartElement = document.getElementById(`${termAndDay}-lunch-start`);
    const lunchEndElement = document.getElementById(`${termAndDay}-lunch-end`);

    // Only continue if all inputs are valid.
    if (
      !dayStartElement.validity.valid ||
      !dayEndElement.validity.valid ||
      !lunchStartElement.validity.valid ||
      !lunchEndElement.validity.valid
    ) {
      // Update output field to display that they can't be calculated right now.
      document.getElementById(`${term}-weektime`).value = "-";
      continue;
    }

    // Calculate amount of work-minutes.
    const workDurationMin =
      calculateWorkMinutes(dayStartElement, dayEndElement, lunchStartElement, lunchEndElement);

    // If a number was returned.
    if (!isNaN(workDurationMin)) {
      // Add to total.
      totalMinutes += workDurationMin;
    }
  }

  // Convert from minutes into hours with two decimal places.
  const workHours = Math.round(totalMinutes / 60 * 100) / 100;

  // Get week time output element.
  const weektimeOutput = document.getElementById(`${term}-weektime`);
  // If calculations don't return an actual number.
  if (isNaN(workHours)) {
    // Update element.
    weektimeOutput.value = "-"
  } else {
    // Update element.
    weektimeOutput.value = `${workHours} h/vecka`;
  }
}

/**
 * Fixes incorrectly formatted time inputs such as:
 * "1600" is turned into "16:00"
 * "16.00" is turned into "16:00"
 * @param { Element } element The element to format the value of.
 */
function fixTimeFormatting(element) {
  var value = element.value;
  // E.g. value is "16:" or "160" or "1600"
  if (value.length >= 3) {
    // If value uses a "." instead of a ":".
    if (value.includes(".")) {
      // Replace "." with ":".
      value = value.replace(".", ":");
    }
    // If value includes neither ":" nor "."
    else if (!value.includes(":")) {
      // Insert a ":" at index 2.
      value = value.slice(0, 2) + ":" + value.slice(2);
    }
  }
  // Update element with potentially modified value.
  element.value = value;
}

function calculateWorkMinutes(dayStartElement, dayEndElement, lunchStartElement, lunchEndElement) {
  // Calculate minute differences between starts and ends.
  const dayDurationMin = calculateMinuteDifference(dayStartElement, dayEndElement);
  const lunchDurationMin = calculateMinuteDifference(lunchStartElement, lunchEndElement);

  // Subtract lunch duration from day duration to get work duration.
  const workDurationMin = dayDurationMin - (lunchDurationMin || 0);

  // Return result.
  return workDurationMin;
}

function calculateMinuteDifference(startInputElement, endInputElement) {
  // Split hours and minutes.
  const startTime = startInputElement.value.split(":");
  const endTime = endInputElement.value.split(":");
  // Parse hours and minutes to actual Date-objects.
  // This assumes all times are on the same day.
  const startDate = new Date();
  const endDate = new Date();
  startDate.setHours(startTime[0], startTime[1]);
  endDate.setHours(endTime[0], endTime[1]);
  // Calculate difference between start and end dates (in milliseconds).
  const differenceMs = endDate - startDate;
  // Return the millisecond value converted into minutes.
  return differenceMs / 1000 / 60;
}

function formatMinutes(fullMinutes) {
  const hours = fullMinutes / 60;
  const roundedHours = Math.floor(hours);
  const minutes = (hours - roundedHours) * 60;
  const roundedMinutes = Math.floor(minutes);
  // If provided minutes is not a number.
  if (isNaN(fullMinutes)) {
    return "-";
  } else {
    if (roundedMinutes === 0) {
      return `${roundedHours} h`;
    } else {
      return `${roundedHours} h ${roundedMinutes} min`;
    }
  }
}