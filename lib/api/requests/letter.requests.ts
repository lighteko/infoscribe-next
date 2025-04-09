import { apiClient } from "@api/client";
import { executeWithTokenRefresh } from "@api/interceptor";

export async function getLetters(providerId: string) {
  return executeWithTokenRefresh(() =>
    apiClient(`/letter/all?providerId=${providerId}`, {
      method: "GET",
    })
  );
}

export async function getLetter(letterId: string) {
  return executeWithTokenRefresh(() =>
    apiClient(`/letter?letterId=${letterId}`, {
      method: "GET",
    })
  );
}

export async function getUserInbox() {
  return executeWithTokenRefresh(() =>
    apiClient(`/letter/inbox`, {
      method: "GET",
    })
  );
}
