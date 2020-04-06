"use strict";var tabNames=["","namn","ht","vt"],days=["mon","tue","wed","thu","fri"];// Polyfill for css flexbox.
if(String.prototype.includes||(String.prototype.includes=function(a,b){'use strict';return"number"!=typeof b&&(b=0),!(b+a.length>this.length)&&-1!==this.indexOf(a,b)}),window.HTMLOutputElement===void 0&&Object.defineProperty(HTMLUnknownElement.prototype,"value",{get:function get(){if("OUTPUT"===this.tagName)return this.textContent},set:function set(a){"OUTPUT"===this.tagName&&(this.textContent=a)}}),/*@cc_on!@*/!!document.documentMode){var head=document.head,link=document.createElement("link");link.type="text/css",link.rel="stylesheet",link.href="internet_explorer.css",head.appendChild(link)}function submitForm(){// Form should never be technically submitted as the results are only used locally in the browser client.
return!1}/**
 * Prevents enter-keypresses from doing anything.
 */function noEnter(){return!(window.event&&13==window.event.keyCode)}function copyFromMondayToAll(a){for(var b=["tue","wed","thu","fri"],c=document.getElementById("".concat(a,"-mon-day-start")),d=document.getElementById("".concat(a,"-mon-day-end")),e=document.getElementById("".concat(a,"-mon-lunch-start")),f=document.getElementById("".concat(a,"-mon-lunch-end")),g=0;g<b.length;g++){var h=b[g],i=document.getElementById("".concat(a,"-").concat(h,"-day-start")),j=document.getElementById("".concat(a,"-").concat(h,"-day-end")),k=document.getElementById("".concat(a,"-").concat(h,"-lunch-start")),l=document.getElementById("".concat(a,"-").concat(h,"-lunch-end"));// Get input elements.
// Copy over values from monday to this days input elements.
// Run 'onInput' function once to update the calculated values.
i.value=c.value,j.value=d.value,k.value=e.value,l.value=f.value,onTimeInput("".concat(a,"-").concat(h))}}function copyFromTermToOtherTerm(a,b){for(var c=0;c<days.length;c++){var d=days[c],e=document.getElementById("".concat(b,"-").concat(d,"-day-start")),f=document.getElementById("".concat(b,"-").concat(d,"-day-end")),g=document.getElementById("".concat(b,"-").concat(d,"-lunch-start")),h=document.getElementById("".concat(b,"-").concat(d,"-lunch-end")),i=document.getElementById("".concat(a,"-").concat(d,"-day-start")),j=document.getElementById("".concat(a,"-").concat(d,"-day-end")),k=document.getElementById("".concat(a,"-").concat(d,"-lunch-start")),l=document.getElementById("".concat(a,"-").concat(d,"-lunch-end"));// Get input-to elements.
// Copy over values from first "from" term to other "to" term.
// Run 'onInput' function once to update the calculated values.
e.value=i.value,f.value=j.value,g.value=k.value,h.value=l.value,onTimeInput("".concat(b,"-").concat(d))}}