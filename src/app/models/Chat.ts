export interface Chat {
  id?: string;
  name?: string;
  image?: string;
  // message?: string;
  type?: string; // *
  userIds?: any; // [string:bool] *
  regionID?: string;
  createdAt?: any; // timestamp *
  updatedAt?: any; // timestamp *
}

