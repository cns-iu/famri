
export interface FamriRecord {
  recNumber: string;
  title: string;
  journal: string;
  address: string;
  type: string;
  authors: string[];
  pages: string;
  volume: string;
  number: string;
  isbn: string;
  abstract: string;
  notes: string;
  custom3: string; // Grant ID
  custom4: string; // Category
  custom5: string; // numCites
  year: string;
  date: string; // looks like Month
  keywords: string[];
  urls: string[];
}
