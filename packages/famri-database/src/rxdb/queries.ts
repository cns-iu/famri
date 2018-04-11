import { DatabaseService } from '../rxdb/database';
import { Filter } from '../shared/filter';
import { Publication } from '../shared/publication';
import { SubdisciplineWeight } from '../shared/subdiscipline-weight';
import { RxPublicationDocument } from './rxdb-types';

// FROM: https://github.com/sindresorhus/escape-string-regexp/
const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
function escapeStringRegExp(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe, '\\$&');
}

async function sumAgg<T>(items: T[], itemKeyField: string, keyField: string, valueField: string): Promise<{[key: string]: number}> {
  const acc: any = {};
  for (const innerItem of items) {
    for (const item of innerItem[itemKeyField]) {
      const key = item[keyField];
      const weight = item[valueField];
      if (acc.hasOwnProperty(key)) {
        acc[key] += weight;
      } else {
        acc[key] = weight;
      }
    }
  }
  return acc;
}

export async function getPublications(database: DatabaseService, filter: Partial<Filter> | any = {}): Promise<RxPublicationDocument[]> {
  const db = await database.get();

  let query = db.publication.find();
  if (filter.subd_id) {
    query = query.where('subdisciplines').elemMatch({ 'subd_id': {'$in': filter.subd_id }});
  }
  if (filter.journalName) {
    query = query.where('journalName').in(filter.journalName);
  }
  if (filter.mechanism) {
    query = query.where('grantMechanism').in(filter.mechanism);
  }
  if (filter.institution) {
    query = query.where('grantInstitution').in(filter.institution);
  }
  if (filter.year) {
    if (filter.year.start === filter.year.end) {
      query = query.where('year').eq(filter.year.start);
    } else {
      query = query.where('year').gte(filter.year.start).lte(filter.year.end);
    }
  }
  if (filter.sessionYear) {
    if (filter.sessionYear.start === filter.sessionYear.end) {
      query = query.where('grantYear').eq(filter.sessionYear.start);
    } else {
      query = query.where('grantYear').gte(filter.sessionYear.start).lte(filter.sessionYear.end);
    }
  }
  if (filter.researchClassification) {
    query = query.where('grantClasses').elemMatch({ '$in': filter.researchClassification });
  }
  if (filter.fulltext) {
    const regexp = new RegExp(filter.fulltext.map((text) => escapeStringRegExp(text)).join('|'), 'i');
    query = query.where('fulltext').regex(regexp);
  }

  if (filter.sort) {
    const sort = filter.sort.map((s) => (s.ascending ? '' : '-') + s.field ).join(' ');
    query = query.sort(sort);
  }
  if (filter.limit && filter.limit > 0) {
    query = query.limit(filter.limit);
  }

  const results: RxPublicationDocument[] = await query.exec();
  return results || [];
}

export async function getSubdisciplines(database: DatabaseService, filter: Partial<Filter> | any = {}): Promise<SubdisciplineWeight[]> {
  const publications = await getPublications(database, filter);
  const weights = await sumAgg<RxPublicationDocument>(publications, 'subdisciplines', 'subd_id', 'weight');

  return Object.entries(weights).map(([k, v]) => <SubdisciplineWeight>{subd_id: <number>(<any>k), weight: v});
}

export async function getDistinct(database: DatabaseService, fieldName: string, filter: Partial<Filter> = {}): Promise<string[]> {
  // TODO: make this more efficient.

  const publications = await getPublications(database, filter);
  const values: any = {};
  const distinct = [];
  publications.forEach((pub) => {
    let val = pub.get(fieldName);
    if (!(typeof val === 'string' || val instanceof String)) {
      val = JSON.stringify(val);
    }
    if (!values.hasOwnProperty(val)) {
      values[val] = 1;
      distinct.push(val);
    } else {
      values[val]++;
    }
  });
  return distinct;
}
