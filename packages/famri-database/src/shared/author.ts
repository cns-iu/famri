
export interface Author {
  id: string;
  totalPaperCount: number;
  paperCount: number;
  paperCountsByYear: { [year: number] : number };

  totalCoAuthorCount: number;
  coauthorCount: number;
  coauthors: { [authorId: string] : boolean };
  coauthorsByYear: { [year: number] : { [authorId: string] : boolean } };
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

export interface CoAuthorGraph {
  authors: Author[],
  coauthorEdges: CoAuthorEdge[]
}
