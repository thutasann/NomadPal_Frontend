import { apiClient } from "./apiClient";

async function checkHealth() {
  const response = await apiClient.get("/health");
  return response.data;
}

const healthService = {
  checkHealth,
};

export default healthService;