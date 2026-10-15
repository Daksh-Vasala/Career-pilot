const API_PREFIX = "/api/v1";

export function getBackendApiBaseUrl() {
  const configuredUrl =
    process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!configuredUrl) {
    throw new Error("Backend API URL is not configured");
  }

  const baseUrl = configuredUrl.replace(/\/+$/, "");
  const pathWithoutApiPrefix = baseUrl.replace(/(?:\/api\/v1)+$/, "");

  return `${pathWithoutApiPrefix}${API_PREFIX}`;
}
