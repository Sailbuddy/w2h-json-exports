const fs = require('fs');
const path = './public/data/categories.json';

try {
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));

  const missing = data.filter((item) =>
    item.id == null ||
    item.name_de == null ||
    item.icon == null ||
    item.sort_order == null
  );

  if (missing.length > 0) {
    console.error('🚫 Ungültige Kategorien gefunden:', missing);
    process.exit(1);
  }

  console.log('✅ categories.json erfolgreich validiert.');
} catch (err) {
  console.error('❌ Fehler beim Parsen von categories.json:', err.message);
  process.exit(1);
}
