const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public/data/location_values.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let hasError = false;

data.forEach((item, index) => {
  const errors = [];

  if (!item.id) errors.push('Fehlende ID');
  if (!item.location_id) errors.push('Fehlende Location-ID');
  if (!item.language_code) errors.push('Fehlender language_code');
  // Optional: item.name darf null sein
  // if (!item.name) errors.push('Fehlender Name');

  const hasValue =
    item.value_text !== null ||
    item.value_number !== null ||
    item.value_bool !== null ||
    item.value_option !== null ||
    item.value_json !== null;

  if (!hasValue) errors.push('Kein Wert angegeben (alle value_* Felder sind null)');

  if (errors.length > 0) {
    console.error(`❌ Fehler bei Eintrag #${index + 1}: ${errors.join(', ')}`);
    console.error(item);
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
