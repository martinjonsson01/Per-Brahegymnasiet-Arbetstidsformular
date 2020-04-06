"use strict";var tabNames=["","namn","ht","vt"],days=["mon","tue","wed","thu","fri"],currentTab="/"===location.pathname||""===location.pathname?0:tabNames.indexOf(location.pathname.slice(1));// Polyfill for css flexbox.
if(0===currentTab?showTab(0):location.pathname="/",String.prototype.includes||(String.prototype.includes=function(a,b){'use strict';return"number"!=typeof b&&(b=0),!(b+a.length>this.length)&&-1!==this.indexOf(a,b)}),window.HTMLOutputElement===void 0&&Object.defineProperty(HTMLUnknownElement.prototype,"value",{get:function get(){if("OUTPUT"===this.tagName)return this.textContent},set:function set(a){"OUTPUT"===this.tagName&&(this.textContent=a)}}),/*@cc_on!@*/!!document.documentMode){var head=document.head,link=document.createElement("link");link.type="text/css",link.rel="stylesheet",link.href="internet_explorer.css",head.appendChild(link)}// Set up event listener for browser navigation.
window.onpopstate=function(a){this.currentTab=a.state?a.state.tab:0,this.showTab(this.currentTab)};// Update inputs once, just in case input values were stored by the browser, 
// so that the output fields update
for(var day,i=0;i<days.length;i++)day=days[i],onTimeInput("HT-".concat(day)),onTimeInput("VT-".concat(day));/**
 * Shows the specified tab n and hides all other tabs, disabling those that haven't been reached
 * yet while leaving those that have been passed enabled so that the form can still correctly validate.
 * @param { Number } n The index of the tab to show, 0 being the first. 
 */function showTab(a){// This function will display and enable the specified tab of the form ...
var b=document.getElementsByClassName("tab");b[a].style.display="flex",b[a].disabled=!1,hideAllTabsExcept(a);// ... and fix the Previous/Next buttons:
var c=document.getElementById("nextBtn"),d=document.getElementById("prevBtn");// ... and run a function that displays the correct step indicator:
// ... and scroll to top of page.
d.style.display=0==a?"none":"inline",a==b.length-1?(c.innerHTML="Slutf\xF6r",c.style.backgroundColor="#4CAF50"):0==a?(c.innerHTML="B\xF6rja",c.style.backgroundColor="#4CAF50"):(c.innerHTML="N\xE4sta",c.style.backgroundColor="#71ffe7"),fixStepIndicator(a),window.scrollTo(0,0)}function hideAllTabsExcept(a){// Get all tabs.
for(var b=document.getElementsByClassName("tab"),c=0;c<b.length;c++)// Skip tab if it matches argument.
c!==a&&(// Hide tab.
c<a&&(b[c].disabled=!0),b[c].style.display="none");// Only disable tabs that come before this one, to ensure that previous form fields are filled in correctly.
}function nextPrev(a){-1===a&&history.back();// Get the form element.
var b=document.getElementById("main-form"),c=document.getElementsByClassName("tab");// Get all tabs.
// Do not move to next tab if form is invalid.
if(1==a&&!b.checkValidity())// Since the form is invalid, try submitting it once so that the error messages show up.
return!1;// if you have reached the end of the form and are trying to go further... :
if(currentTab>=c.length-1&&1==a)return generateAndDownloadCSVFile(),!1;// Render tab.
// Increase or decrease the current tab by 1:
// Push history state so that browser navigation buttons can be used.
currentTab+=a,history.pushState({tab:currentTab},tabNames[currentTab],"/".concat(tabNames[currentTab]||""));showTab(currentTab)}function fixStepIndicator(a){// This function removes the "active" class of all steps...
var b,c=document.getElementsByClassName("step");for(b=0;b<c.length;b++)c[b].className=c[b].className.replace(" active","");//... and adds the "active" class to the current step:
c[a].className+=" active"}function submitForm(){// Form should never be technically submitted as the results are only used locally in the browser client.
return!1}/**
 * Prevents enter-keypresses from doing anything.
 */function noEnter(){return!(window.event&&13==window.event.keyCode)}function copyFromMondayToAll(a){for(var b=["tue","wed","thu","fri"],c=document.getElementById("".concat(a,"-mon-day-start")),d=document.getElementById("".concat(a,"-mon-day-end")),e=document.getElementById("".concat(a,"-mon-lunch-start")),f=document.getElementById("".concat(a,"-mon-lunch-end")),g=0;g<b.length;g++){var h=b[g],i=document.getElementById("".concat(a,"-").concat(h,"-day-start")),j=document.getElementById("".concat(a,"-").concat(h,"-day-end")),k=document.getElementById("".concat(a,"-").concat(h,"-lunch-start")),l=document.getElementById("".concat(a,"-").concat(h,"-lunch-end"));// Get input elements.
// Copy over values from monday to this days input elements.
// Run 'onInput' function once to update the calculated values.
i.value=c.value,j.value=d.value,k.value=e.value,l.value=f.value,onTimeInput("".concat(a,"-").concat(h))}}function copyFromTermToOtherTerm(a,b){for(var c=0;c<days.length;c++){var d=days[c],e=document.getElementById("".concat(b,"-").concat(d,"-day-start")),f=document.getElementById("".concat(b,"-").concat(d,"-day-end")),g=document.getElementById("".concat(b,"-").concat(d,"-lunch-start")),h=document.getElementById("".concat(b,"-").concat(d,"-lunch-end")),i=document.getElementById("".concat(a,"-").concat(d,"-day-start")),j=document.getElementById("".concat(a,"-").concat(d,"-day-end")),k=document.getElementById("".concat(a,"-").concat(d,"-lunch-start")),l=document.getElementById("".concat(a,"-").concat(d,"-lunch-end"));// Get input-to elements.
// Copy over values from first "from" term to other "to" term.
// Run 'onInput' function once to update the calculated values.
e.value=i.value,f.value=j.value,g.value=k.value,h.value=l.value,onTimeInput("".concat(b,"-").concat(d))}}/**
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
return isNaN(a)?"-":0===e?"".concat(d," h"):"".concat(d," h ").concat(e," min")}/**
 * Generates a CSV-file containing the values present in the input elements at the time
 * of the function being called, then downloads the file as a CSV-text blob with UTF-8-BOM encoding.
 */function generateAndDownloadCSVFile(){var a="";// Write column headers.
a+="L\xE4rare;Veckodag;Period;\xC4mne;Starttid;l\xE4ngd i min";for(var b=document.getElementById("name").value,c=document.getElementById("signature").value,d=["M\xE5ndag","Tisdag","Onsdag","Torsdag","Fredag"],e=["HT","VT"],f=0;f<e.length;f++){for(var g=e[f],h="",j=0;j<days.length;j++){var k=days[j],l=document.getElementById("".concat(g,"-").concat(k,"-day-start")),m=document.getElementById("".concat(g,"-").concat(k,"-day-end")),n=document.getElementById("".concat(g,"-").concat(k,"-lunch-start")),o=document.getElementById("".concat(g,"-").concat(k,"-lunch-end")),p=calculateMinuteDifference(l,m),q=calculateMinuteDifference(n,o),r=d[days.indexOf(k)];// Get input elements.
l.value&&(a+="\n".concat(c,";").concat(r,";").concat(g,";Arbetstid;").concat(l.value,";").concat(p||0)),n.value&&(h+="\n".concat(c,";").concat(r,";").concat(g,";Rast/lunch;").concat(n.value,";").concat(q||0))}// Before moving on to next term, append all the lunches for this term to the csv file.
a+=h}var s="".concat(b,"_(").concat(c,").csv"),u="\uFEFF"+a;// Download blob.
// Display alert notifying user of what to do next.
BlobDownload(s,[u],"text/csv"),showDownloadMessage()}function BlobDownload(b,c,d){var e=new Blob(c,{type:d});// for IE
if(window.navigator&&window.navigator.msSaveOrOpenBlob)window.navigator.msSaveOrOpenBlob(e,b);else{// for Non-IE (chrome, firefox etc.)
var f=document.createElement("a");document.body.appendChild(f),f.style="display: none";var a=URL.createObjectURL(e);f.href=a,f.download=b,f.click(),f.remove()}}function showDownloadMessage(){var a=document.getElementById("download-scrim");a.style.visibility="visible"}function hideDownloadMessage(){var a=document.getElementById("download-scrim");a.style.visibility="hidden"}