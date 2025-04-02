export interface GetProviderResponse {
  creator: string;
  title: string;
  summary: string;
  schedule: string;
  locale: string;
  tags: string[];
  createdDate: Date;
}

export interface CreateProviderRequest {
  title: string;
  summary: string;
  locale: string;
  tags: string[];
  schedule: string;
}

export interface SubscribeProviderRequest {
  providerId: string;
  userId: string;
}
