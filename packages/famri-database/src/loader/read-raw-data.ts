const fs = require('fs');
const zipcodes = require('zipcodes');

import * as XLSX from 'xlsx';
import { Operator } from '@ngx-dino/core/operators';
import { issnLookup, journalLookup, disciplineLookup } from './science-mapper';
import { CoAuthorNetwork } from '../shared/coauthor-network';

import { GRANTS, CLEAN_PUBS, PUBS, COAUTH_JSON, DB_JSON } from './options';

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
const zip2locationOp = Operator.map<string, any>((rawZip) => {
  const zip = cleanZip(rawZip);
  const latlon = zipcodes.lookup(zip) || zipcodes.lookup(rawZip);
  return latlon ? latlon : null; // {zip, unmapped: true};
});
function zip2location(field): Operator<string, any> {
  return a(field).chain(zip2locationOp);
}
function log<In, Out>(op: Operator<In, Out>, debug = true) {
  return !debug ? op : Operator.map<In, Out>((x: In) => {
    console.log(x);
    const y = op.get(x);
    console.log(y);
    return y;
  });
}

const DEBUG = false;
const grantIdOp = log(Operator.map<string, string>((x) => parseInt((x || '').replace(/[^0-9]/g, ''), 10).toString()), DEBUG);
// const grantIdOp = log(Operator.map<string, string>((x) => (x || '').replace(/[^0-9a-zA-Z]/g, '').toLowerCase().replace('distprof','')), DEBUG);

const grantsProcessor = Operator.combine({
  'id': n('ID'),
  'famri_id': a('Reference No.'),
  'ref_id': a('Reference No.').chain(grantIdOp).map(Number),
  'title': a('Project Title'),
  'year': a('Fiscal Year'),
  'requestedDate': a('Request Date'),
  'createdDate': a('Create Date'),
  'pi': {
    'id': n('Primary Contact ID'),
    'name': a('Primary Contact'),
    'firstName': a('First Name'),
    'middleName': a('Middle Name'),
    'lastName': a('Last Name'),
    'totalActivities': n('Primary Contact Total Number of Activities'),
    'totalAffiliations': n('Primary Contact Total Number of Affiliations'),

    'enteredLocation': {
      'state': [
        a('Primary Contact State'),
        a('Home Address State'),
        a('Alternate Address State')
      ],
      'zipcode': [
        a('Primary Contact Postal Code'),
        a('Home Address Postal Code'),
        a('Alternate Address Postal Code')
      ]
    },
    'location': zip2location('Primary Contact Postal Code')
  },
  'piType': a('Primary Contact Type'),
  'institution': {
    'id': n('Organization ID'),
    'name': a('Name'),
    'parentName': a('Parent Organization Name'),
    'isCharitableOrganization': a('Charitable Organization'),
    'totalActivities': n('Organization Total Number of Activities'),
    'totalAffiliations': n('Organization Total Number of Affiliations'),
    'totalRequests': n('Organization Total Number of Requests'),

    'enteredLocation': {
      'city': a('City'),
      'state': a('State'),
      'country': a('Country'),
      'zipcode': a('Postal Code')
    },
    'location': zip2location('Postal Code')
  },
  'type': a('Type'),
  'status': a('Status'),
  'fund': a('Fund'),
  'geographicAreaServed': a('Geographical Area Served'),
  'programArea': a('Program Area'),

  'location': zip2location('Postal Code')
});
let grants: any[] = readXLS(GRANTS).map(grantsProcessor.getter);
let grantsMap: any = {};
grants.forEach((grant) => {
  for (const zipcode of grant.pi.enteredLocation.zipcode) {
    const location = zip2locationOp.get(zipcode);
    if (location) {
      grant.pi.location = location;
      grant.pi.enteredLocation.zipcode = zipcode;
      break;
    }
  }
  for (const state of grant.pi.enteredLocation.state) {
    if (state) {
      grant.pi.enteredLocation.state = state;
      break;
    }
  }
  if (!grant.location && grant.pi.location) {
    grant.location = grant.pi.location;
  }
  grantsMap[grant.ref_id] = grant;
});

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
});
const pubs: any[] = readJSON(CLEAN_PUBS).map(pubsProcessor.getter);

function normalizeCitation(p: {title: string, author: string, journalName: string, pages: string}): string {
  p.author = p.author.replace(/\./g,'');
  // return `${p.title} - ${p.author} - ${p.journalName} - ${p.pages}`;
  const id = `${p.title} - ${p.author}`;
  return id.toLowerCase().replace(/[^a-z0-9\ ]/g,'').replace(/\ +/g, '').trim();
}

const pubsMap = {};
pubs.forEach((p) => {
  const id = normalizeCitation({title: p.title, author: p.authors[0], journalName: p.journalName, pages: p.pages});
  pubsMap[id] = p;
});

const grantPubsProcessor = Operator.combine({
  'id': a('Grant number').chain(grantIdOp),
  'famri_id': a('Grant number'),
  'grant': Operator.map((s) => grantIdOp.get(s['Grant number'])).lookup(grantsMap),
  'citation': a('Publications')
});
const grantPubs = readXLS(PUBS).map(grantPubsProcessor.getter).filter((p: any) => p.grant);

const mappedPubs = grantPubs.map((gp: any) => {
  const cite = gp.citation.split(/\./g);
  const id = normalizeCitation({
    title: cite[1].trim(),
    author: cite[0].split(/\,/g)[0].trim(),
    journalName: cite[2],
    pages: cite.slice(2,3).join('').split(':').slice(-1)[0]
  });

  const pub = pubsMap[id];
  if (pub) {
    pub.famri_id = gp.famri_id;
    pub.grant_id = gp.grant.id;
    pub.grant = gp.grant;
    gp.grant.publicationIds = (gp.grant.publicationIds || []).concat([pub.id]);
  }
  return pub || undefined;
}).filter(p => !!p);

const journalReplacements = {
  'Am J Respir Cell Mol Biol': 'American Journal Of Physiology - Lung Cellular And Molecular Physiology',
  'Am J Physiol Lung Cell Mol Physiol': 'American Journal Of Physiology - Lung Cellular And Molecular Physiology',
  'J Biol Chem': 'Journal Of Biological Chemistry',
  'Am J Respir Crit Care Med': 'American Journal Of Respiratory And Critical Care Medicine',
  'J Immunol': 'Journal Of Immunology',
  'Proc Natl Acad Sci U S A': 'Proceedings Of The National Academy Of Sciences Of The United States Of America',
  'Int J Cancer': 'International Journal Of Cancer',
  'Cancer Biol Ther': 'Cancer Biology & Therapy',
  'Am J Prev Med': 'American Journal Of Preventive Medicine',
  'Mol Cell Biol': 'Molecular Cell Biology Research Communications',
  'Am J Rhinol Allergy': 'AMERICAN JOURNAL OF RHINOLOGY & ALLERGY',
  'Oncotarget': 'Targeted Oncology',
  'COPD': 'COPD: Journal of Chronic Obstructive Pulmonary Disease',
  'Cancer Prev Res (Phila)': 'CANCER PREVENTION RESEARCH'
}

let badJournals: any = {};
let journal2weights: any = {};
let journal2journ_id: any = {};
pubs.forEach((pub) => {
  const journal = journalReplacements[pub.journalName] || pub.journalName;
  const isbn = (pub.isbn || '').trim().split(/\s+/g).map(s => issnLookup.access('id').get(s)).filter(s => !!s);
  if (isbn.length > 0) {
    pub.journ_id = isbn[0];
    journal2weights[pub.journ_id] = disciplineLookup.get(pub.journ_id);
  } else {
    pub.journ_id = undefined;
  }
  if (!pub.journ_id) {
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
  }
  if (!pub.journ_id) {
    badJournals[`${pub.journalName}`] = (badJournals[`${pub.journalName}`] || 0) + 1;
  }

  pub.subdisciplines = journal2weights[pub.journ_id] || [];
});

journal2journ_id = null;
journal2weights = null;

const WRITE_BAD_JOURNALS = true;
if (WRITE_BAD_JOURNALS) {
  badJournals = Object.entries(badJournals);
  badJournals.sort((a,b) => b[1] - a[1]);
  fs.writeFileSync('/tmp/bad.csv', badJournals.map(t => t.join(',')).join('\n'), 'utf8');
}

const pubsDBProcessor = Operator.combine({
  'id': a('id'),
  'title': a('title'),
  'authors': a('authors'),
  'year': n('year'),
  'grantId': n('grant_id'),

  'journalName': a('journalName'),
  'journalId': a('journ_id'),
  'subdisciplines': a('subdisciplines')
});
const publications: any[] = pubs.map(pubsDBProcessor.getter);

const graph = new CoAuthorNetwork(publications);
graph.coauthorEdges.forEach((e) => {
  delete e.author1;
  delete e.author2;
});

const PRINT_INFO = true;
if (PRINT_INFO) {
  const sciPubs = publications.filter((pub) => pub.subdisciplines && pub.subdisciplines.length > 0);
  console.log('\nDEBUG INFO:\nGrants (orig -> w/ location):', grants.length, grants.filter((g) => !!g.location).length);
  console.log('Raw Pubs (orig -> w/ grant):', publications.length, publications.filter((p: any) => !!p.grantId).length);
  console.log('Sci-Mapped Pubs (sci-mapped -> w/ grant):', sciPubs.length, sciPubs.filter((p: any) => !!p.grantId).length);
  console.log('% Sci-Mapped, # unmapped, % Sci-Mapped w/ grant, # unmapped w/ grant: ')
  console.log(
    sciPubs.length / publications.length * 100,
    publications.length - sciPubs.length,
    sciPubs.filter((p: any) => !!p.grantId).length / publications.filter((p: any) => !!p.grantId).length * 100,
    publications.filter((p: any) => !!p.grantId).length - sciPubs.filter((p: any) => !!p.grantId).length
  );
  console.log('Publications:', publications.length, 'Grants:', grants.length);

  console.log('Authors', graph.authors.length);
  console.log('Co-Author Edges', graph.coauthorEdges.length);
}

const db: any = {
  publications,
  grants
};

writeJSON(DB_JSON, db);
writeJSON(COAUTH_JSON, {nodes: graph.authors, edges: graph.coauthorEdges});
