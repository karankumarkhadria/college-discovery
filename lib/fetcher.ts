export async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const fieldErrors = payload?.error?.details?.fieldErrors;
    const firstFieldError =
      fieldErrors && typeof fieldErrors === "object"
        ? Object.values(fieldErrors).flat().find(Boolean)
        : null;
    const message =
      firstFieldError ??
      payload?.error?.message ??
      "Request failed. Please try again.";
    throw new Error(message);
  }

  return payload.data as T;
}
