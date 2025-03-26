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

export interface PasswordResetValidation {
  email: string;
  username: string;
}

export interface PasswordResetRequest {
  token: string;
  newPassword: string;
}
