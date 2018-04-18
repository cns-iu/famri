export interface CountByYear {
  year: number;
  count: number;
}

export interface CountByPublication {
  publication: string;
  count: number;
}

export interface Statistics {
  // General measures
  nPublications: number;
  nAuthors: number;
  // More?

  // Network measures
  // TODO

  // Other measures
  nAuthorsByYear: CountByYear[];
  nAuthorsByPublication: CountByPublication[];

  nInstitutionsByYear: CountByYear[];
  nInstitutionsByPublication: CountByPublication[];
  // More?
}
