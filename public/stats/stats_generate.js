const fs = require('fs');

const paths = {
  locations: 'public/data/locations.json',
  location_values: 'public/data/location_values.json',
  categories: 'public/data/categories.json'
};

const counts = {};
for (const [key, path] of Object.entries(paths)) {
  try {
    const raw = fs.readFileSync(path);
    const data = JSON.parse(raw);
    counts[key] = Array.isArray(data) ? data.length : 0;
  } catch (err) {
    console.error(`❌ Fehler beim Laden von ${path}:`, err.message);
    counts[key] = null;
  }
}

const output = {
  timestamp: new Date().toISOString(),
  counts
};

fs.mkdirSync('public/stats', { recursive: true });
fs.writeFileSync('public/stats/stats.json', JSON.stringify(output, null, 2));

console.log('📊 Statistikdatei erstellt: public/stats/stats.json');
