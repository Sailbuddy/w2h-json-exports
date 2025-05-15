const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data/locations.json', 'utf8'));

const requiredFields = ['id', 'wind2horizon_id', 'lat', 'lng'];
let missing = [];

data.forEach((entry, index) => {
  requiredFields.forEach((field) => {
    if (entry[field] === undefined || entry[field] === null) {
      missing.push({ index, field });
    }
  });
});

if (missing.length > 0) {
  console.error('Fehlende Werte:', missing);
  process.exit(1);
} else {
  console.log('✔️  Alle Pflichtfelder vorhanden.');
}
