export interface Letter {
  letterId: string;
  title: string;
  s3Path: string;
  createdDate: Date;
}

export interface GetLetterResponse {
  letterId: string;
  title: string;
  s3Path: string;
  createdDate: Date;
  html: string;
}

export interface GetUserInboxResponse {
  letters: LetterInbox[];
}

export interface LetterInbox {
  providerId: string;
  providerTitle: string;
  letterId: string;
  title: string;
  s3Path: string;
  createdDate: Date;
}
