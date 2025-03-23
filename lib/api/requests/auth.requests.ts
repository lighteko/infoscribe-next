import { apiClient } from "@api/client";
import { LogInRequest, SignUpRequest } from "@api/types/auth.types";

export function signUp(payload: SignUpRequest) {
  console.log(payload);
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
  });
}

export async function refreshToken() {
  return apiClient("/auth/refresh", {
    method: "POST",
  });
}
