const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_NAME = import.meta.env.VITE_TOKEN_NAME;

export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem(TOKEN_NAME);

  if (!token) {
    throw new Error("No authentication token found");
  }

  const isFormData = options.body instanceof FormData;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    body: isFormData ? options.body : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "An error occurred while fetching the data."
    );
  }

  return response.json();
};
