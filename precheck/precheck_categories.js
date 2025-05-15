const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public/data/categories.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let hasError = false;

data.forEach((item, index) => {
  if (!item.id || !item.icon) {
    console.error(`❌ Fehler bei Eintrag #${index + 1}:`, item);
    hasError = true;
  }
});

if (!hasError) {
  console.log('✅ categories.json wurde erfolgreich validiert.');
  process.exit(0);
} else {
  console.log('❌ categories.json enthält ungültige Einträge.');
  process.exit(1);
}
