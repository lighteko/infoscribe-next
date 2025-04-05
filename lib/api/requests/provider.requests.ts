import { CreateProviderRequest } from "@api/types/provider.types";
import { apiClient } from "@api/client";
import { executeWithTokenRefresh } from "@api/interceptor";

export async function createProvider(payload: CreateProviderRequest) {
  return executeWithTokenRefresh(() =>
    apiClient("/provider/create", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );
}

export async function getAllMyProviders() {
  return executeWithTokenRefresh(() =>
    apiClient("/provider/all", {
      method: "GET",
    })
  );
}

export async function getProviderById(providerId: string) {
  return executeWithTokenRefresh(() =>
    apiClient(`/provider?providerId=${providerId}`, {
      method: "GET",
    })
  );
}

export async function deleteProviderById(providerId: string) {
  return executeWithTokenRefresh(() =>
    apiClient(`/provider?providerId=${providerId}`, {
      method: "DELETE",
    })
  );
}

export async function getSubscribableProviders() {
  return executeWithTokenRefresh(() =>
    apiClient(`/provider/subscribable`, {
      method: "GET",
    })
  );
}
