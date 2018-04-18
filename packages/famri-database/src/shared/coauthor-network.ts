import { Author, CoAuthorEdge } from '../shared/author';
import { Publication } from '../shared/publication';

export class CoAuthorNetwork {
  readonly authors: Author[] = [];
  readonly coauthorEdges: CoAuthorEdge[] = [];

  private id2author: { [id: string] : Author } = {};
  private id2edge: { [id: string] : CoAuthorEdge } = {};

  constructor(private publications: Publication[]) {
    this.buildGraph();
  }

  private buildGraph() {
    for (const pub of this.publications) {
      const year = pub.year;
      const authors: Author[] = (pub.authors || []).map((a) => this.getAuthor(a));
      const edges = this.getEdges(authors);

      for (const author of authors) {
        author.paperCount++;
        author.paperCountsByYear[year] = (author.paperCountsByYear[year] || 0) + 1;

        author.coauthorCount += authors.length - 1;
        author.coauthorCountsByYear[year] = (author.coauthorCountsByYear[year] || 0) + (authors.length - 1);
      }
      for (const edge of edges) {
        edge.count++;
        edge.countsByYear[year] = (edge.countsByYear[year] || 0) + 1;
      }
    }
    this.authors.sort((a, b) => b.paperCount - a.paperCount);
  }

  getEdges(authors: Author[]): CoAuthorEdge[] {
    const seen: any = {};
    const edges: CoAuthorEdge[] = [];
    authors.forEach((a1) => {
      authors.forEach((a2) => {
        const edge = this.getEdge(a1, a2);
        if (!seen[edge.id]) {
          seen[edge.id] = true;
          edges.push(edge);
        }
      });
    });
    return edges;
  }
  getAuthor(id: string): Author {
    let author: Author = this.id2author[id];
    if (!author) {
      author = this.id2author[id] = <Author>{
        id,
        paperCount: 0,
        coauthorCount: 0,

        paperCountsByYear: {},
        coauthorCountsByYear: {}
      };
      this.authors.push(author);
    }
    return author;
  }
  getEdgeId(author1: Author, author2: Author): string {
    const ids = [author1.id, author2.id];
    ids.sort();
    return ids.join('|');
  }
  getEdge(author1: Author, author2: Author): CoAuthorEdge {
    const id = this.getEdgeId(author1, author2);
    let edge: CoAuthorEdge = this.id2edge[id];
    if (!edge) {
      edge = this.id2edge[id] = <CoAuthorEdge>{
        id,
        source: author1.id,
        target: author2.id,
        author1,
        author2,

        count: 0,
        countsByYear: {}
      };
      this.coauthorEdges.push(edge);
    }
    return edge;
  }
}
