const tabNames = ["", "namn", "ht", "vt"];
const days = ["mon", "tue", "wed", "thu", "fri"];

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