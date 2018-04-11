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
  pi: {
    firstName: string;
    lastName: string;
  };
  title: string;
  initialZipCode: string;
  currentZipCode: string;

  initialLocation?: Location;
  currentLocation?: Location;
}
