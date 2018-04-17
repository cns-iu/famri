export interface Location {
  zip: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  country: string;
}

export interface Grant {
  id: string;
  title: string;
  pi: {
    firstName: string;
    lastName: string;
  };
  year: number;

  institution: string;
  initialZipCode: string;
  currentZipCode: string;

  initialLocation?: Location;
  currentLocation?: Location;

  publicationIds?: number[];
}
