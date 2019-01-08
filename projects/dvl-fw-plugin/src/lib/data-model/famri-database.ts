
export class FamriDatabase {
  publications: any[];
  authors: any[];
  coAuthorLinks: any[];

  constructor(data: any) {
    Object.assign(this, data);
  }
}
