const tabNames = ["", "namn", "ht", "vt"];
const days = ["mon", "tue", "wed", "thu", "fri"];

// Get current tab through url path.
var currentTab = (location.pathname === "/" || location.pathname === "") ? 0 : tabNames.indexOf(location.pathname.slice(1));

// If current tab is not the first, display the first tab, since this part 
// of the script is only run when the page is navigated to directly.
// This is to prevent the user from skipping steps by changing the location in the address bar.
if (currentTab !== 0) {
	location.pathname = "/";
} else {
	showTab(0);
}

/*
 Polyfills for IE. 
*/
// Polyfill String.includes
if (!String.prototype.includes) {
	String.prototype.includes = function (search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}
// Polyfill output element.
if (window.HTMLOutputElement === undefined) {
	Object.defineProperty(HTMLUnknownElement.prototype, 'value', {
		get: function () {
			if (this.tagName === 'OUTPUT') {
				return this.textContent;
			}
		},
		set: function (newValue) {
			if (this.tagName === 'OUTPUT') {
				this.textContent = newValue;
			}
		}
	});
}
// Polyfill for css flexbox.
if (/*@cc_on!@*/false || !!document.documentMode) {
	var head = document.head;
	var link = document.createElement("link");

	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = "internet_explorer.css";

	head.appendChild(link);
}

// Set up event listener for browser navigation.
window.onpopstate = function (event) {
	this.currentTab = event.state ? event.state.tab : 0;
	this.showTab(this.currentTab);
}

// Update inputs once, just in case input values were stored by the browser, 
// so that the output fields update
for (var i = 0; i < days.length; i++) {
	const day = days[i];
	onTimeInput(`HT-${day}`);
	onTimeInput(`VT-${day}`);
}

/**
 * Shows the specified tab n and hides all other tabs, disabling those that haven't been reached
 * yet while leaving those that have been passed enabled so that the form can still correctly validate.
 * @param { Number } n The index of the tab to show, 0 being the first. 
 */
function showTab(n) {
	// This function will display and enable the specified tab of the form ...
	var x = document.getElementsByClassName("tab");
	x[n].style.display = "flex";
	x[n].disabled = false;
	// ... and hide all other tabs.
	hideAllTabsExcept(n);
	// ... and fix the Previous/Next buttons:
	const nextButton = document.getElementById("nextBtn");
	const prevButton = document.getElementById("prevBtn");
	// Style the nav-buttons differently depending on which page is being shown.
	if (n == 0) {
		prevButton.style.display = "none";
	} else {
		prevButton.style.display = "inline";
	}
	if (n == (x.length - 1)) {
		nextButton.innerHTML = "Slutför";
		nextButton.style.backgroundColor = "#4CAF50";
	} else {
		if (n == 0) {
			nextButton.innerHTML = "Börja";
			nextButton.style.backgroundColor = "#4CAF50";
		} else {
			nextButton.innerHTML = "Nästa";
			nextButton.style.backgroundColor = "#71ffe7";
		}
	}
	// ... and run a function that displays the correct step indicator:
	fixStepIndicator(n)
	// ... and scroll to top of page.
	window.scrollTo(0, 0);
}

function hideAllTabsExcept(tab) {
	// Get all tabs.
	var x = document.getElementsByClassName("tab");
	for (var tabIndex = 0; tabIndex < x.length; tabIndex++) {
		// Skip tab if it matches argument.
		if (tabIndex === tab) continue;
		// Only disable tabs that come before this one, to ensure that previous form fields are filled in correctly.
		if (tabIndex < tab) {
			// Disable tab.
			x[tabIndex].disabled = true;
		}
		// Hide tab.
		x[tabIndex].style.display = "none";
	}
}

function nextPrev(direction) {
	// If going back, just pop one layer off the stack.
	if (direction === -1) {
		history.back();
	}
	// Get the form element.
	const form = document.getElementById("main-form");
	// Get all tabs.
	var x = document.getElementsByClassName("tab");
	// Do not move to next tab if form is invalid.
	if (direction == 1 && !form.checkValidity()) {
		// Since the form is invalid, try submitting it once so that the error messages show up.
		return false;
	}
	// if you have reached the end of the form and are trying to go further... :
	if (currentTab >= x.length - 1 && direction == 1) {
		//...the form results get generated into CSV file:
		generateAndDownloadCSVFile();
		return false;
	} else {
		// Increase or decrease the current tab by 1:
		currentTab += direction;
		// Push history state so that browser navigation buttons can be used.
		history.pushState({ tab: currentTab }, tabNames[currentTab], `/${tabNames[currentTab] || ""}`);
	}
	// Render tab.
	showTab(currentTab);
}

function fixStepIndicator(n) {
	// This function removes the "active" class of all steps...
	var i, x = document.getElementsByClassName("step");
	for (i = 0; i < x.length; i++) {
		x[i].className = x[i].className.replace(" active", "");
	}
	//... and adds the "active" class to the current step:
	x[n].className += " active";
}

function submitForm() {
	// Form should never be technically submitted as the results are only used locally in the browser client.
	return false;
}

/**
 * Prevents enter-keypresses from doing anything.
 */
function noEnter() {
	return !(window.event && window.event.keyCode == 13);
}

function copyFromMondayToAll(term) {
	const daysExceptMonday = ["tue", "wed", "thu", "fri"];
	const mondayStartElement = document.getElementById(`${term}-mon-day-start`);
	const mondayEndElement = document.getElementById(`${term}-mon-day-end`);
	const mondayLunchStartElement = document.getElementById(`${term}-mon-lunch-start`);
	const mondayLunchEndElement = document.getElementById(`${term}-mon-lunch-end`);
	for (var t = 0; t < daysExceptMonday.length; t++) {
		const day = daysExceptMonday[t];
		// Get input elements.
		const dayStartElement = document.getElementById(`${term}-${day}-day-start`);
		const dayEndElement = document.getElementById(`${term}-${day}-day-end`);
		const lunchStartElement = document.getElementById(`${term}-${day}-lunch-start`);
		const lunchEndElement = document.getElementById(`${term}-${day}-lunch-end`);

		// Copy over values from monday to this days input elements.
		dayStartElement.value = mondayStartElement.value;
		dayEndElement.value = mondayEndElement.value;
		lunchStartElement.value = mondayLunchStartElement.value;
		lunchEndElement.value = mondayLunchEndElement.value;

		// Run 'onInput' function once to update the calculated values.
		onTimeInput(`${term}-${day}`);
	}
}

function copyFromTermToOtherTerm(from, to) {
	for (var t = 0; t < days.length; t++) {
		const day = days[t];
		// Get input-to elements.
		const dayStartElementTo = document.getElementById(`${to}-${day}-day-start`);
		const dayEndElementTo = document.getElementById(`${to}-${day}-day-end`);
		const lunchStartElementTo = document.getElementById(`${to}-${day}-lunch-start`);
		const lunchEndElementTo = document.getElementById(`${to}-${day}-lunch-end`);

		// Get input-from elements.
		const dayStartElementFrom = document.getElementById(`${from}-${day}-day-start`);
		const dayEndElementFrom = document.getElementById(`${from}-${day}-day-end`);
		const lunchStartElementFrom = document.getElementById(`${from}-${day}-lunch-start`);
		const lunchEndElementFrom = document.getElementById(`${from}-${day}-lunch-end`);

		// Copy over values from first "from" term to other "to" term.
		dayStartElementTo.value = dayStartElementFrom.value;
		dayEndElementTo.value = dayEndElementFrom.value;
		lunchStartElementTo.value = lunchStartElementFrom.value;
		lunchEndElementTo.value = lunchEndElementFrom.value;

		// Run 'onInput' function once to update the calculated values.
		onTimeInput(`${to}-${day}`);
	}
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

/**
 * Generates a CSV-file containing the values present in the input elements at the time
 * of the function being called, then downloads the file as a CSV-text blob with UTF-8-BOM encoding.
 */
function generateAndDownloadCSVFile() {
	let csvData = "";
	// Write column headers.
	csvData += "Lärare;Veckodag;Period;Ämne;Starttid;längd i min";

	const name = document.getElementById("name").value;
	const signature = document.getElementById("signature").value;

	const dayNames = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];
	const terms = ["HT", "VT"];

	for (var i = 0; i < terms.length; i++) {
		const term = terms[i];
		let csvLunch = "";
		for (var t = 0; t < days.length; t++) {
			const day = days[t];
			// Get input elements.
			const dayStartElement = document.getElementById(`${term}-${day}-day-start`);
			const dayEndElement = document.getElementById(`${term}-${day}-day-end`);
			const lunchStartElement = document.getElementById(`${term}-${day}-lunch-start`);
			const lunchEndElement = document.getElementById(`${term}-${day}-lunch-end`);
			// Calculate day minute length.
			const dayLengthMin =
				calculateMinuteDifference(dayStartElement, dayEndElement);
			// Calculate lunch minute length.
			const lunchLengthMin =
				calculateMinuteDifference(lunchStartElement, lunchEndElement);

			// Get day-name.
			const dayName = dayNames[days.indexOf(day)];

			// If this day contains a day start time.
			if (dayStartElement.value) {
				// Write row to csv-file.
				csvData += `\n${signature};${dayName};${term};Arbetstid;${dayStartElement.value};${dayLengthMin || 0}`;
			}
			// If this day contains a lunch start time.
			if (lunchStartElement.value) {
				// Write second row to temporary lunch-string that will be appended last.
				csvLunch += `\n${signature};${dayName};${term};Rast/lunch;${lunchStartElement.value};${lunchLengthMin || 0}`;
			}
		}
		// Before moving on to next term, append all the lunches for this term to the csv file.
		csvData += csvLunch;
	}

	var csvFileName = `${name}_(${signature}).csv`;
	var BOM = "\uFEFF";
	// Append Byte Order Mark at start of data to allow excel to open UTF-8 encoded file correctly.
	var csvBomData = BOM + csvData;

	// Download blob.
	BlobDownload(csvFileName, [csvBomData], "text/csv");
	// Display alert notifying user of what to do next.
	showDownloadMessage();
}

function BlobDownload(Filename, Bytes, Mimetype) {
	var fileData = new Blob(Bytes, { type: Mimetype });
	// for IE
	if (window.navigator && window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(fileData, Filename);
	} else { // for Non-IE (chrome, firefox etc.)
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		var fileUrl = URL.createObjectURL(fileData);
		a.href = fileUrl;
		a.download = Filename;
		a.click();
		a.remove();
	}
};

function showDownloadMessage() {
	var messageElement = document.getElementById("download-scrim");
	messageElement.style.visibility = "visible";
}

function hideDownloadMessage() {
	var messageElement = document.getElementById("download-scrim");
	messageElement.style.visibility = "hidden";
}