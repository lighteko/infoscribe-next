export interface GetNewsLetterResponse {
  letterId: string;
  providerName: string;
  title: string;
  s3Path: string;
  createdDate: Date;
}
