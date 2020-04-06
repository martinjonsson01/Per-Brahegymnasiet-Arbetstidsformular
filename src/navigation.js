// Get current tab through url path.
var currentTab = (window.location.pathname === "/" || window.location.pathname === "") ? 0 : tabNames.indexOf(window.location.pathname.slice(1));

// If current tab is not the first, display the first tab, since this part 
// of the script is only run when the page is navigated to directly.
// This is to prevent the user from skipping steps by changing the location in the address bar.
if (currentTab !== 0) {
  window.location.pathname = "/";
} else {
  showTab(0);
}

// Set up event listener for browser navigation.
window.onpopstate = function (event) {
  this.currentTab = event.state ? event.state.tab : 0;
  this.showTab(this.currentTab);
}

/**
* Shows the specified tab n and hides all other tabs, disabling those that haven't been reached
* yet while leaving those that have been passed enabled so that the form can still correctly validate.
* @param { Number } n The index of the tab to show, 0 being the first. 
*/
function showTab(n) {
  // This function will display and enable the specified tab of the form ...
  var x = window.document.getElementsByClassName("tab");
  x[n].style.display = "flex";
  x[n].disabled = false;
  // ... and hide all other tabs.
  hideAllTabsExcept(n);
  // ... and fix the Previous/Next buttons:
  const nextButton = window.document.getElementById("nextBtn");
  const prevButton = window.document.getElementById("prevBtn");
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
  var x = window.document.getElementsByClassName("tab");
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
  const form = window.document.getElementById("main-form");
  // Get all tabs.
  var x = window.document.getElementsByClassName("tab");
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
  var i, x = window.document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}