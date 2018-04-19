import { SubdisciplineWeight } from './subdiscipline-weight';

export interface Grant { }

export interface Publication {
  id: number;
  title: string;
  authors: string[];
  year: number;

  journalName: string;
  journalId: number;
  subdisciplines: SubdisciplineWeight[];

  grantId?: number;
  grant?: Grant;
}
