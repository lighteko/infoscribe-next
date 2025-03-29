export interface GetProviderResponse {
  creator: string;
  title: string;
  sendingDay: string;
  locale: string;
  categories: string[];
  createdDate: Date;
}

export interface CreateProviderRequest {
  userId: string;
  title: string;
  locale: string;
  categories: string[];
  sendingDay: string;
}

export interface CreateProviderResponse {
  // ...
}

export interface SubscribeProviderRequest {
  providerId: string;
  userId: string;
}

export interface SubscribeProviderResponse {
  // ...
}
