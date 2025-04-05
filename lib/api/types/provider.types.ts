export interface MyProvider {
  providerId: string;
  title: string;
  summary: string;
  schedule: string;
  locale: string;
  tags: string[];
  subscribers: number;
}

export interface Provider {
  providerId: string;
  creator: string;
  title: string;
  summary: string;
  schedule: string;
  locale: string;
  tags: string[];
  subscribers: number;
}

export interface Subscribable {
  providerId: string;
  title: string;
  summary: string;
  schedule: string;
  tags: string[];
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
