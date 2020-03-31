export interface Meetup {
  id?: string;
  name?: string; // *
  description?: string; // *
  address?: string; // *
  addressUrl: string; // GeoPoint 2
  startDate?: any; // timestamp *
  endDate?: any; // timestamp *
  regionID?: string; // *
  // declinedUserIds?: string; // [string]
  // acceptedUserIds?: string; // [string]
  createdAt?: any; // timestamp *
  updatedAt?: any;
}
