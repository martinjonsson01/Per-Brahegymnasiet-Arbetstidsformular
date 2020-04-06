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