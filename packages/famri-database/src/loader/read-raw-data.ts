const fs = require('fs');
const zipcodes = require('zipcodes');

import * as XLSX from 'xlsx';
import { Operator } from '@ngx-dino/core/operators';
import { journalLookup, disciplineLookup } from './science-mapper';

import { GRANTS_W_YR, GRANTS, CLEAN_PUBS, PUBS, DB_JSON } from './options';

function readXLS(inputFile: string, sheetName?: string): any[] {
  const wb = XLSX.readFile(inputFile);
  sheetName = sheetName || wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws);
  return data;
}
function readJSON(inputFile: string): any {
  return JSON.parse(fs.readFileSync(inputFile));
}
function writeJSON(outputFile: string, obj: any) {
  fs.writeFileSync(outputFile, JSON.stringify(obj, null, 2), 'utf8');
}
function writeJSONArray(outputFile: string, data: any[], operator: Operator<any, any>) {
  const file = fs.createWriteStream(outputFile);
  file.on('error', function(err) { console.log(err); });

  file.write('[\n');
  data.forEach((item) => {
    item = operator.get(item);

    file.cork();
    file.write(JSON.stringify(item, null, 2) + '\n');
    file.uncork();
  });
  file.write(']\n');
  file.end();
}
function a(field: string): Operator<any, any> {
  return Operator.access(field, '-').map((val) => val === '-' ? undefined : val);
}
function NumberOrUndefined(value: string): number {
  const numberValue = Number(value);
  return isNaN(numberValue) ? undefined : numberValue;
}
function n(field: string): Operator<any, number> {
  return a(field).map(NumberOrUndefined);
}
function fulltext(...fields: string[]): Operator<any, string> {
  return Operator.combine(fields.map((f) => a(f)))
    .map(v => v.filter(s => !!s).join(' ').replace(/\s+/g, ' ').toLowerCase());
}
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
function cleanZip(zipcode: string): string {
  const zip = parseInt((zipcode || '').replace(/[^0-9]/g, '').trim());
  return isNaN(zip) ? null : pad(zip, 5);
}
function zip2latlon(field): Operator<string, [number, number]> {
  return a(field).map<string>(cleanZip).map<[number, number]>((zip) => {
    const latlon = zipcodes.lookup(zip);
    return latlon ? [latlon.latitude, latlon.longitude] : null;
  })
}
function zip2state(field): Operator<string, string> {
  return a(field).map<string>((rawZip) => {
    const zip = cleanZip(rawZip);
    const latlon = zipcodes.lookup(zip) || zipcodes.lookup(rawZip);
    return latlon ? latlon.state : null;
  })
}
function zip2location(field): Operator<string, any> {
  return a(field).map<any>((rawZip) => {
    const zip = cleanZip(rawZip);
    const latlon = zipcodes.lookup(zip) || zipcodes.lookup(rawZip);
    return latlon ? latlon : null; // {zip, unmapped: true};
  });
}

function log(s) {
  console.log(s);
  return s;
}
// const grantIdOp = Operator.map<string, string>((x) => log(x).replace(/[^0-9]/g,''));
const grantIdOp = Operator.map<string, string>((x) => x.replace(/[^0-9]/g, ''));
// const grantIdOp = Operator.map<string, string>((x) => log(log(x).replace(/\_/g, '').trim().toUpperCase()));

const grantsProcessor = Operator.combine({
  'id': a('FAMRI ID number').chain(grantIdOp),
  'famri_id': a('FAMRI ID number'),
  'pi': {
    'first_name': a('PI_First_ Name'),
    'last_name': a('PI_Last_Name')
  },
  'title': a('Title'),
  'initialZipCode': a('Initial Zip Code'),
  'currentZipCode': a('Current Zip Code'),

  'initialLocation': zip2location('Initial Zip Code'),
  'currentLocation': zip2location('Current Zip Code'),
});
let grants: any[] = readXLS(GRANTS).map(grantsProcessor.getter);
let grantsMap: any = {};
grants.forEach((grant) => {
  if (grant.initialLocation && !grant.currentLocation) {
    grant.initialLocation = grant.currentLocation;
  }
  grantsMap[grant.id] = grant;
});

const grantsWithYearProcessor = Operator.combine({
  'famri_id': a('FAMRI grant number'),
  'institution': a('Institution '),
  'year': a('Year'),
  'grant': Operator.map((s) => grantIdOp.get(s['FAMRI grant number'])).lookup(grantsMap)
  // 'grant': Operator.access('FAMRI grant number', 'BAD BAD MAN').chain(grantIdOp).lookup(grantsMap)
}).map((g) => {
  if (g.grant) {
    g.grant.year = g.year;
    g.grant.institution = g.institution;
  }
  return g.grant ? undefined : g.grant;
});
readXLS(GRANTS_W_YR).forEach(grantsWithYearProcessor.getter);
grants = grants.filter(g => !!g.year);

const pubsProcessor = Operator.combine({
  'id': n('recNumber'),
  'title': a('title'),
  'journalName': a('journal'),
  'address': a('address'),
  'authors': a('authors'),
  'pages': a('pages'),
  'volume': a('volume'),
  'number': a('number'),
  'isbn': a('isbn'),
  'abstract': a('abstract'),
  'year': n('year'),
  'date': a('date'),
  'keywords': a('keywords'),
  'urls': a('urls')

  // 'grant_id': a('FAMRI ID number'),
  // 'grant': a('File Reference').lookup(grantsMap),
});
const pubs: any[] = readJSON(CLEAN_PUBS).map(pubsProcessor.getter);

let journal2weights: any = {};
let journal2journ_id: any = {};
pubs.forEach((pub) => {
  const journal = pub.journalName;
  if (!journal2journ_id.hasOwnProperty(journal)) {
    pub.journ_id = journal2journ_id[journal] = journalLookup.access('id').get(journal);
    if (pub.journ_id) {
      journal2weights[pub.journ_id] = disciplineLookup.get(pub.journ_id);
    } else {
      pub.journ_id = undefined;
    }
  } else {
    pub.journ_id = journal2journ_id[journal];
  }
  pub.subdisciplines = journal2weights[pub.journ_id] || undefined;
});

journal2journ_id = null;
journal2weights = null;

const pubsDBProcessor = Operator.combine({
  'id': a('id'),
  'title': a('title'),
  'authors': a('authors'),
  'year': n('year'),

  'journalName': a('journalName'),
  'journalId': a('journ_id'),
  'subdisciplines': a('subdisciplines')
});
const publications = pubs.filter((pub) => pub.subdisciplines && pub.subdisciplines.length > 0).map(pubsDBProcessor.getter);

const db: any = {
  publications,
  grants
};

writeJSON(DB_JSON, db);
// writeJSONArray(DB_JSON, mappedPubs, pubsDBProcessor);

// console.log(grants.length);
// console.log(JSON.stringify(grants[0]));
// console.log(pubs.length);
// console.log(JSON.stringify(pubs[0]));
//
// writeJSON(DB_JSON, pubs);
