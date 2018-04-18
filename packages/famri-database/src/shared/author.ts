
export interface Author {
  id: string;
  paperCount: number;
  coauthorCount: number;

  paperCountsByYear: { [year: number] : number };
  coauthorCountsByYear: { [year: number] : number };
}

export interface CoAuthorEdge {
  id: string;
  source: string;
  target: string;

  author1: Author;
  author2: Author;

  count: number;
  countsByYear: { [year: number] : number };
}
