export interface SignUpRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LogInRequest {
  email: string;
  password: string;
}
