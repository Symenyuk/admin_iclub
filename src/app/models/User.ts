export interface User {
  id?: string;
  name?: string; // *
  image?: string;
  description?: string;
  role?: string; // *
  regions?: any; // [string] *
  company?: string;
  profession?: string;
  pushTokens?: string; // [string]
  contacts?: object; // { “phones”: [String]?, “emails”: [String]?, “facebook”: String?,“linkedin”: String? }
  createdAt?: string; // timestamp *
  updatedAt?: any; // timestamp *
  deleted?: any; // *
  deletedAt?: any; // timestamp
  tokens?: any;
}
