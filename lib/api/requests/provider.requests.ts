import { CreateProviderRequest } from "@api/types/provider.types";
import { apiClient } from "@api/client";

export async function createProvider(payload: CreateProviderRequest) {
  return apiClient("/provider/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
