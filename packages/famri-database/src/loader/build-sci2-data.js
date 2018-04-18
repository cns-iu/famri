const csvWriter = require('csv-write-stream')
const fs = require('fs');
const unidecode = require('unidecode');

const DB_JSON = '../../raw-data/database.json';
const OUT_DIR = '../../raw-data/sci2';

function readJSON(inputFile) {
  return JSON.parse(fs.readFileSync(inputFile));
}
function writeCSV(outputFile, mapper, data) {
  data = data.map(mapper);
  const fields = {};
  data.forEach((d) => {
    for (const f in d) { fields[f] = true; }
  });
  const headers = [];
  for (const f in fields) { headers.push(f); }
  headers.sort();

  var writer = csvWriter({headers});
  writer.pipe(fs.createWriteStream(outputFile));
  data.forEach(writer.write.bind(writer));
  writer.end();
}

const db = readJSON(DB_JSON);
const id2grant = {};
const id2pub = {};
db.grants.forEach((g) => id2grant[g.id] = g);
db.publications.forEach((p) => id2pub[p.ref_id] = p);

function pubMapper(data) {
  const pub = Object.assign({}, data);
  pub.authors = pub.authors.join('|');
  pub.subdisciplines = pub.subdisciplines.map(p => p.subd_id).join('|');
  const grant = pub.grantId && id2grant.hasOwnProperty(pub.grantId) ? grantMapper(id2grant[pub.grantId]) : null;
  delete pub.grantId;
  if (grant) {
      for (const f in grant) {
        pub[`grant_${f}`] = grant[f];
      }
  }
  return pub;
}
function grantMapper(data) {
  const grant = Object.assign({}, data);
  grant.publicationIds = (grant.publicationIds || []).join('|');

  for (const f in data) {
    if (f === 'pi' || f === 'institution' || f === 'location') {
      const obj = grant[f];
      delete grant[f];

      for (const field in obj) {
        switch (field) {
          case 'enteredLocation':
          case 'location':
            for (const field2 in obj[field]) {
              grant[`${f}_${field}_${field2}`] = obj[field][field2];
            }
            break;
          default:
            grant[`${f}_${field}`] = obj[field];
            break;
        }
      }
    }
  }
  return grant;
}

console.log(db.grants.length);
console.log(db.publications.length);

writeCSV(`${OUT_DIR}/publications.csv`, pubMapper, db.publications);
writeCSV(`${OUT_DIR}/grants.csv`, grantMapper, db.grants);
