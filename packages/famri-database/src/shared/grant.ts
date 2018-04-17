import { Publication } from './publication';

export interface Location {
  zip: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  country: string;
}

export interface PrimaryInvestigator {
  id: number;
  name: string;
  firstName: string;
  middleName: string;
  lastName: string;

  totalActivities: number;
  totalAffiliations: number;

  enteredLocation: {
    state: string;
    zipcode: number;
  };
  location?: Location;
}

export interface Institution {
  id: number;
  name: string;
  parentName: string;
  isCharitableOrganization: string;

  totalActivities: number;
  totalAffiliations: number;
  totalRequests: number;

  enteredLocation: {
    city: string;
    state: string;
    country: string;
    zipcode: number;
  };
  location?: Location;
}

export interface Grant {
  id: string;
  famri_id: string;
  ref_id: number;
  title: string;
  year: number;
  requestedDate: string;
  createdDate: string;

  pi: PrimaryInvestigator
  piType: string;
  institution: Institution;

  type: string;
  status: string;
  fund: string;
  geographicAreaServed: string;
  programArea: string;
  location?: Location;

  publicationIds?: number[];
  publications?: Publication[];
}
