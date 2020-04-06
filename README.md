# Per Brahegymnasiet Arbetstidsformulär

## Att bygga projektet

Innan det går att göra något med projektet måste alla moduler installeras lokalt, och detta behöver endast göras en gång. För att installera alla moduler behöver först Node.js vara installerat på datorn. För att göra detta, gå till https://nodejs.org/en/ och ladda ned och installera den senaste LTS-versionen.

När Node.js är installerat bör även NPM ha installerats, och ska man köra följande kommando i kommandotolken från projektmappens rot:

```
npm install
```

Då kommer det ta ett par minuter för NPM att installera alla paket som projektet behöver, men detta behöver endast göras en gång.

Efter varje ändring till källkoden behöver skripten omkompileras. För att kompilera skripten som är skrivna i modernt JavaScript (ES6) till en äldre version av JS, som är kompatibel med Internet Explorer 11, behöver "build"-skriptet köras. Det gör man genom att skriva följande i kommandotolken (se till att köra detta kommando inuti projektmappens rot):

```
npm run build
```

Detta skript kommer att konvertera källkoden som ligger i `src/` till IE-kompatibel kod som läggs i `public/`.

> OBS: Gör inga ändringar till .js-filerna som ligger i `public/`-mappen, eftersom de kommer att överskridas av "build"-skriptet när det körs. Om du vill göra ändringar till koden bör du redigera filerna som ligger i `src/`-mappen.

## Att distribuera sidan

### Installera Firebase-CLI

För nuvarande ligger sidan uppe på Googles Firebase-tjänst. För att lägga upp nya versioner av sidan behöver man Firebase-CLI (Command Line Interface), vilket enkelt går att installera med hjälp av NPM med följande kommando:

```
npm install -g firebase-tools
```

Om man inte har NPM installerat går det även att ladda ned manuellt från https://firebase.google.com/docs/cli#windows-standalone-binary.

Efter Firebase-CLI är installerat behöver man logga in med ett Google-konto som har tillgång till Firebase-projektet. För att göra detta skriver man följande i en kommandotolk:

```
firebase login
```

Då öppnas ett fönster i en webbläsare där man sedan kan logga in.

Efter man har loggat in borde man kunna se projektet `per-brahe-arbetstidsformular` när man skriver kommandot `firebase projects:list`.

### Ladda upp till Firebase

För att ladda upp de lokala ändringar man har gjort till sidan borde man först bygga projektet, och sedan ladda upp det till Firebase. Detta går endast att göra om man är inloggad med ett konto med tillgång till projektet. Kommandot för att ladda upp den nya versionen av sidan är följande kommando (som bör köras från roten av projektmappen):

```
firebase deploy
```

## Filformat

Notera att CSV-filen som genereras av formuläret är i UTF-8-BOM format och att
fastän det är en CSV (Comma Separated Values) använder den semikolon (;)
för att avgränsa värden. Detta, eftersom Excel på en svensk Windows-dator
förväntar sig semikolon. Problem kan uppstå om man öppnar filen i t.ex.
en engelsk Windows-dator, eftersom den troligen förväntar sig kommatecken (,).
Detta går enkelt att justera i källkoden genom att gå in i funktionen
`generateAndDownloadCSVFile` i filen `src/exportForm.js` och ersätta varje instans av `;` med `,`.
