// Define the host and port separately
const API_PROTOCOL = "http";
const API_HOSTNAME = "localhost";
const API_PORT = "8083";
const API_VERSION = "v1";

// Construct the full base URL dynamically
const API_HOST = `${API_PROTOCOL}://${API_HOSTNAME}:${API_PORT}`;
const API_BASE_URL = `${API_HOST}/api`;

const apiConfig = {
  API_PROTOCOL,   // HTTP or HTTPS
  API_HOSTNAME,   // Domain or IP (e.g., localhost, example.com)
  API_PORT,       // Port number
  API_VERSION,    // API version (e.g., v1, v2)
  API_HOST,       // Full base host URL
  API_BASE_URL,   // Full API base URL
  getResourceUrl: (resName: string) => `${API_BASE_URL}/${resName.toLowerCase()}`,
  getResourceMetaDataUrl: (resName: string) => `${API_BASE_URL}/getAllResourceMetaData/${resName}`,
};

export default apiConfig;
