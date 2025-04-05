export interface Subscription {
  subscriptionId: string;
  providerId: string;
  title: string;
  schedule: string;
  summary: string;
  tags: string[];
  subscriptionDate: Date;
}
