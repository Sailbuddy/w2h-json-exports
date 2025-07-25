const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public/data/location_values.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let hasWarning = false;
const reviewList = [];

data.forEach((item, index) => {
  const hasValue =
    item.value_text !== null ||
    item.value_bool !== null ||
    item.value_number !== null ||
    item.value_option !== null ||
    item.value_json !== null;

  if (!hasValue) {
    console.warn(`⚠️  Warnung bei Eintrag #${index + 1}: Kein Wert angegeben (alle value_* Felder sind null)`);
    reviewList.push(item);
    hasWarning = true;
  }
});

if (!hasWarning) {
  console.log('✅ location_values.json wurde erfolgreich validiert.');
  process.exit(0);
} else {
  // Zusatz: Optional speichern wir die Review-Daten
  const reviewPath = path.join(process.cwd(), 'public/data/location_values_to_review.json');
  fs.writeFileSync(reviewPath, JSON.stringify(reviewList, null, 2));
  console.warn(`⚠️  ${reviewList.length} Einträge ohne Werte wurden in location_values_to_review.json gespeichert.`);
  process.exit(0); // WICHTIG: kein Abbruch!
}
