const configuredBaseUrl = import.meta.env.VITE_API_URL || "https://notes-app-api-abq2.onrender.com";

export const BASE_URL = configuredBaseUrl.replace(/\/$/, "");
