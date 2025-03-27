import { apiClient } from "@api/client";
import {
  EmailVerificationRequest,
  LogInRequest,
  PasswordResetRequest,
  PasswordResetValidation,
  SignUpRequest,
} from "@api/types/auth.types";

export function signUp(payload: SignUpRequest) {
  return apiClient("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logIn(payload: LogInRequest) {
  const encodedCredentials = Buffer.from(
    `${payload.email}:${payload.password}`
  ).toString("base64");
  return apiClient("/auth/login", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
    body: JSON.stringify({
      isSessionOnly: payload.isSessionOnly,
    }),
  });
}

export async function logout() {
  return apiClient("/auth/logout", {
    method: "POST",
  });
}

export async function forgotPassword(payload: PasswordResetValidation) {
  return apiClient("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: PasswordResetRequest) {
  return apiClient("/auth/reset-password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function refreshToken() {
  return apiClient("/auth/refresh", {
    method: "POST",
  });
}

export async function verifyEmail(payload: EmailVerificationRequest) {
  return apiClient("/auth/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
