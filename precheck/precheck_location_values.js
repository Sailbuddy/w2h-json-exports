const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public/data/location_values.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let hasError = false;

data.forEach((item, index) => {
  if (!item.id || !item.location_id || !item.language || !item.name) {
    console.error(`❌ Fehler bei Eintrag #${index + 1}:`, item);
    hasError = true;
  }
});

if (!hasError) {
  console.log('✅ location_values.json wurde erfolgreich validiert.');
  process.exit(0);
} else {
  console.log('❌ location_values.json enthält ungültige Einträge.');
  process.exit(1);
}
