const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_NAME = import.meta.env.VITE_TOKEN_NAME;

export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem(TOKEN_NAME);

  if (!token) {
    throw new Error("No authentication token found");
  }

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "An error occurred while fetching the data."
    );
  }

  return response.json();
};
