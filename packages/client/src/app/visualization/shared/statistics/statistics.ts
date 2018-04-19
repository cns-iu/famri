export interface CountByYear {
  year: number;
  count: number;
}

export interface Statistics {
  // General measures
  nPublications: number;
  nAuthors: number;
  nGrants: number;

  avgAuthorsPerPublication: number;

  // Network measures
  avgDegree: number;
  maxDegree: number;

  // Other measures
  nAuthorsByYear: CountByYear[];
  nInstitutionsByYear: CountByYear[];
}
