"use strict";// Update inputs once, just in case input values were stored by the browser, 
// so that the output fields update
for(var day,i=0;i<days.length;i++)day=days[i],onTimeInput("HT-".concat(day)),onTimeInput("VT-".concat(day));/**
 * Calculates amount of minutes worked in a day and displays them in output field.
 * Also updates styling of input-element depending on content.
 * As well as auto-formatting when the user types stuff like 1600 or 16.00 instead of 16:00.
 * Including the updating of weekly time.
 * @param { String } termAndDay A string containing both the term and day of this input element. E.g. "HT-mon"
 */function onTimeInput(a){// Get input elements.
var b=document.getElementById("".concat(a,"-day-start")),c=document.getElementById("".concat(a,"-day-end")),d=document.getElementById("".concat(a,"-lunch-start")),e=document.getElementById("".concat(a,"-lunch-end"));// Only continue if all inputs are valid.
if(b.value?b.classList.add("contains-value"):b.classList.remove("contains-value"),c.value?c.classList.add("contains-value"):c.classList.remove("contains-value"),d.value?d.classList.add("contains-value"):d.classList.remove("contains-value"),e.value?e.classList.add("contains-value"):e.classList.remove("contains-value"),fixTimeFormatting(b),fixTimeFormatting(c),fixTimeFormatting(d),fixTimeFormatting(e),!b.validity.valid||!c.validity.valid||!d.validity.valid||!e.validity.valid)return void(document.getElementById("".concat(a,"-minutes")).value="-");// Try to update weekly time.
updateWeeklyTime(a.split("-")[0]);// Calculate amount of work-minutes.
var f=calculateWorkMinutes(b,c,d,e);// Update output field to display minutes.
document.getElementById("".concat(a,"-minutes")).value=formatMinutes(f)}function updateWeeklyTime(a){for(var b=0,c=0;c<days.length;c++){var d=days[c],e="".concat(a,"-").concat(d),f=document.getElementById("".concat(e,"-day-start")),g=document.getElementById("".concat(e,"-day-end")),h=document.getElementById("".concat(e,"-lunch-start")),j=document.getElementById("".concat(e,"-lunch-end"));// Only continue if all inputs are valid.
if(!f.validity.valid||!g.validity.valid||!h.validity.valid||!j.validity.valid){document.getElementById("".concat(a,"-weektime")).value="-";continue}// Calculate amount of work-minutes.
var m=calculateWorkMinutes(f,g,h,j);// If a number was returned.
isNaN(m)||(b+=m)}// Convert from minutes into hours with two decimal places.
var k=Math.round(100*(b/60))/100,l=document.getElementById("".concat(a,"-weektime"));// Get week time output element.
l.value=isNaN(k)?"-":"".concat(k," h/vecka")}/**
 * Fixes incorrectly formatted time inputs such as:
 * "1600" is turned into "16:00"
 * "16.00" is turned into "16:00"
 * @param { Element } element The element to format the value of.
 */function fixTimeFormatting(a){var b=a.value;// E.g. value is "16:" or "160" or "1600"
// Update element with potentially modified value.
3<=b.length&&(b.includes(".")?b=b.replace(".",":"):!b.includes(":")&&(b=b.slice(0,2)+":"+b.slice(2))),a.value=b}function calculateWorkMinutes(a,b,c,d){// Calculate minute differences between starts and ends.
var e=calculateMinuteDifference(a,b),f=calculateMinuteDifference(c,d);// Return result.
return e-(f||0)}function calculateMinuteDifference(a,b){// Split hours and minutes.
var c=a.value.split(":"),d=b.value.split(":"),e=new Date,f=new Date;e.setHours(c[0],c[1]),f.setHours(d[0],d[1]);// Return the millisecond value converted into minutes.
return(f-e)/1e3/60}function formatMinutes(a){var b=Math.floor,c=a/60,d=b(c),e=b(60*(c-d));// If provided minutes is not a number.
return isNaN(a)?"-":0===e?"".concat(d," h"):"".concat(d," h ").concat(e," min")}