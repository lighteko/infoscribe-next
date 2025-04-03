import { CreateProviderRequest } from "@api/types/provider.types";
import { apiClient } from "@api/client";
import { executeWithTokenRefresh } from "../interceptor";

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
