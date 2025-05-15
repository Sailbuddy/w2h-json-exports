const fs = require('fs');
const path = './public/data/location_values.json';

try {
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));

  const missing = data.filter((item) =>
    item.id == null ||
    item.location_id == null ||
    item.attribute_id == null ||
    item.language_code == null
  );

  if (missing.length > 0) {
    console.error('🚫 Ungültige Einträge gefunden:', missing);
    process.exit(1);
  }

  console.log('✅ location_values.json erfolgreich validiert.');
} catch (err) {
  console.error('❌ Fehler beim Parsen von location_values.json:', err.message);
  process.exit(1);
}
