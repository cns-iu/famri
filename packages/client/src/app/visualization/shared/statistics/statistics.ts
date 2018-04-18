export interface CountByYear {
  year: number;
  count: number;
}

export interface CountByPaper {
  paper: string;
  count: number;
}

export interface Statistics {
  // General measures
  nPapers: number;
  nAuthors: number;
  // More?

  // Network measures
  // TODO

  // Other measures
  authorsByYear: CountByYear[];
  authorsByPaper: CountByPaper[];

  institutionsByYear: CountByYear[];
  institutionsByPaper: CountByPaper[];
  // More?
}
