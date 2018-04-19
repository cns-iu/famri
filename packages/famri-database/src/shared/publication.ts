import { SubdisciplineWeight } from './subdiscipline-weight';
import { Grant } from './grant';

export interface Publication {
  id: number;
  title: string;
  authors: string[];
  year: number;

  journalName: string;
  journalId: number;
  subdisciplines: SubdisciplineWeight[];

  grantId?: number;
  grant?: any;
}
