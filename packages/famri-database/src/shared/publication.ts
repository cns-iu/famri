import { SubdisciplineWeight } from './subdiscipline-weight';

export interface Publication {
  id: number;
  title: string;
  author: string;
  year: number;
  pmid: string;
  doi: string;
  pmcid: string;

  journalName: string;
  journalId: number;
  subdisciplines: SubdisciplineWeight[];

  grantId: string;
  grantTitle: string;
  grantSummary: string;
  grantClasses: string[];
  grantYear: number;
  grantInstitution: string;
  grantMechanism: string;

  fulltext: string;
}
