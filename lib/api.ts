export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body && typeof options.body !== "string"
      ? JSON.stringify(options.body) // auto-stringify body if not string
      : options.body,
  });

  // Handle error responses
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return null;
  }

  // Handle other responses
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null; // parse JSON if not empty
  } catch {
    return text; // return as text if not JSON
  }
}
