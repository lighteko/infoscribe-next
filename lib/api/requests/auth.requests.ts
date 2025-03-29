import { apiClient } from "@/lib/api/client";
import { useAuthSettingsStore, useAuthStore } from "@/lib/store/auth-store";
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

// Updated login to use Basic Authentication
export async function logIn(payload: LogInRequest) {
  // Create base64 encoded credentials for Basic Authentication
  const credentials = btoa(`${payload.email}:${payload.password}`);

  return apiClient("/auth/login", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      isSessionOnly: payload.isSessionOnly,
    }),
  }).then((response) => {
    // Store the access token in Zustand
    useAuthStore
      .getState()
      .login(
        response.data.accessToken,
        response.data.user,
        !payload.isSessionOnly
      );
    return response;
  });
}

export async function logOut() {
  console.log(useAuthStore.getState());
  return apiClient("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
  }).finally(() => {
    // Clear auth state
    useAuthStore.getState().logout();
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

// Refresh token function
export async function refreshToken() {
  return apiClient("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({
      isSessionOnly: !useAuthSettingsStore.getState().isPersistent,
    }),
  }).then((response) => {
    // Update the access token in Zustand
    useAuthStore.getState().setAccessToken(response.data.accessToken as string);
    return response;
  });
}

// Updated to handle access token from verification response
export async function verifyEmail(payload: EmailVerificationRequest) {
  return apiClient("/auth/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((response) => {
    // If response contains access token, store it
    if (response.data?.accessToken) {
      useAuthStore
        .getState()
        .login(response.data.accessToken, response.data.user || null);
    }
    return response;
  });
}
