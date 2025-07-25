const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Umgebungsvariablen für Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

// JSON-Datei einlesen
const filePath = path.join(process.cwd(), 'public/data/location_values.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let hasWarning = false;
const reviewList = [];
const okList = [];

data.forEach((item, index) => {
  const hasValue =
    item.value_text !== null ||
    item.value_bool !== null ||
    item.value_number !== null ||
    item.value_option !== null ||
    item.value_json !== null;

  if (!hasValue) {
    console.warn(`⚠️  Warnung bei Eintrag #${index + 1}: Kein Wert angegeben (alle value_* Felder sind null)`);
    reviewList.push(item.location_id);
    hasWarning = true;
  } else {
    okList.push(item.location_id);
  }
});

// Datei mit leeren Werten speichern
if (hasWarning) {
  const reviewPath = path.join(process.cwd(), 'public/data/location_values_to_review.json');
  const entriesToReview = data.filter(item =>
    reviewList.includes(item.location_id)
  );
  fs.writeFileSync(reviewPath, JSON.stringify(entriesToReview, null, 2));
  console.warn(`⚠️  ${reviewList.length} Einträge ohne Werte wurden in location_values_to_review.json gespeichert.`);
}

// Supabase-Aktualisierung
async function updateSupabaseFlags() {
  const uniqueReviewIds = [...new Set(reviewList)];
  const uniqueOkIds = [...new Set(okList)];

  const updateLocation = async (id, flag) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/locations?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_SERVICE_ROLE,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({ to_review: flag })
      });

      if (!res.ok) {
        console.warn(`⚠️  Supabase-Aktualisierung fehlgeschlagen für ID ${id}: ${res.statusText}`);
      }
    } catch (err) {
      console.error(`❌ Fehler beim Update für ID ${id}:`, err.message);
    }
  };

  await Promise.all([
    ...uniqueReviewIds.map(id => updateLocation(id, true)),
    ...uniqueOkIds.map(id => updateLocation(id, false))
  ]);

  console.log(`✅ Supabase-Flags aktualisiert: ${uniqueReviewIds.length} auf true, ${uniqueOkIds.length} auf false.`);
}

// Hauptablauf
updateSupabaseFlags().then(() => {
  if (!hasWarning) {
    console.log('✅ location_values.json wurde erfolgreich validiert.');
  } else {
    console.warn('⚠️  location_values.json enthält unvollständige Werte.');
  }
  process.exit(0); // Immer mit Erfolg beenden
});
