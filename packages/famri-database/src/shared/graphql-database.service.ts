import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import gql from 'graphql-tag';

import { Apollo } from 'apollo-angular';

import { Filter } from '../shared/filter';
import { Publication } from '../shared/publication';
import { SubdisciplineWeight } from '../shared/subdiscipline-weight';

export const GET_PUBLICATIONS = gql`
  query (
    $filter: Filter!
  ) {
    getPublications(filter: $filter) {
      id
      author
      year
      title
      pmid
      doi
      pmcid
      journalName
    }
  }
`;

export const GET_SUBDISCIPLINES = gql`
  query (
    $filter: Filter!
  ) {
    getSubdisciplines(filter: $filter) {
      subd_id
      weight
    }
  }
`;

export const GET_DISTINCT = gql`
  query (
    $fieldName: String!,
    $filter: Filter!
  ) {
    getDistinct(fieldName: $fieldName, filter: $filter)
  }
`;

@Injectable()
export class DatabaseService {
  constructor(private apollo: Apollo) { }

  getPublications(filter: Partial<Filter> = {}): Observable<Publication[]> {
    return this.apollo.query<Publication[]>({
      query: GET_PUBLICATIONS,
      variables: { filter }
    }).map((result) => result.data['getPublications']);
  }

  getSubdisciplines(filter: Partial<Filter> = {}): Observable<SubdisciplineWeight[]> {
    return this.apollo.query<SubdisciplineWeight[]>({
      query: GET_SUBDISCIPLINES,
      variables: { filter }
    }).map((result) => result.data['getSubdisciplines']);
  }

  getDistinct(fieldName: string, filter: Partial<Filter> = {}): Observable<string[]> {
    return this.apollo.query<string[]>({
      query: GET_DISTINCT,
      variables: { fieldName, filter }
    }).map((result) => result.data['getDistinct']);
  }
}
