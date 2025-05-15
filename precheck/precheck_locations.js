const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public/data/locations.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let hasError = false;

data.forEach((item, index) => {
  if (!item.id || !item.lat || !item.lng) {
    console.error(`❌ Fehler bei Eintrag #${index + 1}:`, item);
    hasError = true;
  }
});

if (!hasError) {
  console.log('✅ locations.json wurde erfolgreich validiert.');
  process.exit(0);
} else {
  console.log('❌ locations.json enthält ungültige Einträge.');
  process.exit(1);
}
