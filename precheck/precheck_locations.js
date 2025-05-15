const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public/data/locations.json');
const rawData = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(rawData);

let hasError = false;
const invalidEntries = [];

data.forEach((item, index) => {
  const missingFields = [];

  if (item.id == null) missingFields.push('id');
  if (item.lat == null) missingFields.push('lat');
  if (item.lng == null) missingFields.push('lng');

  if (missingFields.length > 0) {
    hasError = true;
    invalidEntries.push({
      index: index,
      wind2horizon_id: item.wind2horizon_id || '(unbekannt)',
      missingFields: missingFields
    });
  }
});

if (hasError) {
  console.error('❌ Fehlerhafte Einträge gefunden:');
  invalidEntries.forEach(entry => {
    console.error(
      `- Index ${entry.index} (${entry.wind2horizon_id}): Fehlende Felder: ${entry.missingFields.join(', ')}`
    );
  });
  process.exit(1);
} else {
  console.log('✅ locations.json bestanden: Alle Pflichtfelder vorhanden.');
}
