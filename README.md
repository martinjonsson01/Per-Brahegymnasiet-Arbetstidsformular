Notera att CSV-filen som genereras är i UTF-8-BOM format och att
fastän det är en CSV (Comma Separated Values) använder den semikolon (;)
för att avgränsa värden. Detta, eftersom Excel på en svensk windows-dator
förväntar sig semikolon. Problem kan uppstå om man öppnar filen i t.ex.
en engelsk windows-dator, eftersom den troligen förväntar sig kommatecken (,).
Detta går enkelt att justera i källkoden genom att gå in i funktionen
"generateAndDownloadCSVFile" och ersätta varje instans av ";" med ",".