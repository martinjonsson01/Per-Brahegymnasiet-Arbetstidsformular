"use strict";// Get current tab through url path.
var currentTab="/"===window.location.pathname||""===window.location.pathname?0:tabNames.indexOf(window.location.pathname.slice(1));// If current tab is not the first, display the first tab, since this part 
// of the script is only run when the page is navigated to directly.
// This is to prevent the user from skipping steps by changing the location in the address bar.
0===currentTab?showTab(0):window.location.pathname="/",window.onpopstate=function(a){this.currentTab=a.state?a.state.tab:0,this.showTab(this.currentTab)};/**
* Shows the specified tab n and hides all other tabs, disabling those that haven't been reached
* yet while leaving those that have been passed enabled so that the form can still correctly validate.
* @param { Number } n The index of the tab to show, 0 being the first. 
*/function showTab(a){// This function will display and enable the specified tab of the form ...
var b=window.document.getElementsByClassName("tab");b[a].style.display="flex",b[a].disabled=!1,hideAllTabsExcept(a);// ... and fix the Previous/Next buttons:
var c=window.document.getElementById("nextBtn"),d=window.document.getElementById("prevBtn");// ... and run a function that displays the correct step indicator:
// ... and scroll to top of page.
d.style.display=0==a?"none":"inline",a==b.length-1?(c.innerHTML="Slutf\xF6r",c.style.backgroundColor="#4CAF50"):0==a?(c.innerHTML="B\xF6rja",c.style.backgroundColor="#4CAF50"):(c.innerHTML="N\xE4sta",c.style.backgroundColor="#71ffe7"),fixStepIndicator(a),window.scrollTo(0,0)}function hideAllTabsExcept(a){// Get all tabs.
for(var b=window.document.getElementsByClassName("tab"),c=0;c<b.length;c++)// Skip tab if it matches argument.
c!==a&&(// Hide tab.
c<a&&(b[c].disabled=!0),b[c].style.display="none");// Only disable tabs that come before this one, to ensure that previous form fields are filled in correctly.
}function nextPrev(a){-1===a&&history.back();// Get the form element.
var b=window.document.getElementById("main-form"),c=window.document.getElementsByClassName("tab");// Get all tabs.
// Do not move to next tab if form is invalid.
if(1==a&&!b.checkValidity())// Since the form is invalid, try submitting it once so that the error messages show up.
return!1;// if you have reached the end of the form and are trying to go further... :
if(currentTab>=c.length-1&&1==a)return generateAndDownloadCSVFile(),!1;// Render tab.
// Increase or decrease the current tab by 1:
// Push history state so that browser navigation buttons can be used.
currentTab+=a,history.pushState({tab:currentTab},tabNames[currentTab],"/".concat(tabNames[currentTab]||""));showTab(currentTab)}function fixStepIndicator(a){// This function removes the "active" class of all steps...
var b,c=window.document.getElementsByClassName("step");for(b=0;b<c.length;b++)c[b].className=c[b].className.replace(" active","");//... and adds the "active" class to the current step:
c[a].className+=" active"}