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
  // More?

  // Network measures
  // TODO

  // Other measures
  nAuthorsByYear: CountByYear[];

  nInstitutionsByYear: CountByYear[];
  // More?
}
