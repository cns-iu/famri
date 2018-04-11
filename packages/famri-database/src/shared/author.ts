
export interface Author {
  name: string;
  paperCount: number;
  coauthorCount: number;

  paperCountsByYear: { [year: number] : number };
  coauthorCountsByYear: { [year: number] : number };
}

export interface CoAuthorEdge {
  author1: Author;
  author2: Author;

  count: number;
  countsByYear: { [year: number] : number };
}
