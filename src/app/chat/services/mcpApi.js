import axiosInstance from '../../../redux/axiosInstance';

// Use the existing axiosInstance which has JWT authentication and interceptors
const api = axiosInstance;

export const mcpApi = {
  // Get all MCP servers
  getServers: async () => {
    try {
      const response = await api.get('/api/mcp/servers');
      return response.data;
    } catch (error) {
      console.error('Error fetching MCP servers:', error);
      throw error;
    }
  },

  // Get MCP tools
  getTools: async () => {
    try {
      const response = await api.get('/api/mcp/tools');
      return response.data;
    } catch (error) {
      console.error('Error fetching MCP tools:', error);
      throw error;
    }
  },

  // Start MCP server
  startServer: async (serverId) => {
    try {
      const response = await api.post(`/api/mcp/servers/${serverId}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting MCP server:', error);
      throw error;
    }
  },

  // Stop MCP server
  stopServer: async (serverId) => {
    try {
      const response = await api.post(`/api/mcp/servers/${serverId}/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping MCP server:', error);
      throw error;
    }
  },

  // Add new MCP server
  addServer: async (serverData) => {
    try {
      const response = await api.post('/api/mcp/servers', serverData);
      return response.data;
    } catch (error) {
      console.error('Error adding MCP server:', error);
      throw error;
    }
  },

  // Remove MCP server
  removeServer: async (serverId) => {
    try {
      const response = await api.delete(`/api/mcp/servers/${serverId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing MCP server:', error);
      throw error;
    }
  },

  // Get monitoring data
  getMonitoring: async () => {
    try {
      const response = await api.get('/api/mcp/monitoring');
      return response.data;
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      throw error;
    }
  },

  // Get server health
  getServerHealth: async (serverId) => {
    try {
      const response = await api.get(`/api/mcp/servers/${serverId}/health`);
      return response.data;
    } catch (error) {
      console.error('Error fetching server health:', error);
      throw error;
    }
  },

  // Test server connection
  testConnection: async (serverData) => {
    try {
      const response = await api.post('/api/mcp/test-connection', serverData);
      return response.data;
    } catch (error) {
      console.error('Error testing connection:', error);
      throw error;
    }
  },

  // Get server logs
  getServerLogs: async (serverId, limit = 100) => {
    try {
      const response = await api.get(`/api/mcp/servers/${serverId}/logs?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching server logs:', error);
      throw error;
    }
  },

  // Update server configuration
  updateServerConfig: async (serverId, config) => {
    try {
      const response = await api.put(`/api/mcp/servers/${serverId}/config`, config);
      return response.data;
    } catch (error) {
      console.error('Error updating server config:', error);
      throw error;
    }
  },

  // Get available transport types
  getTransportTypes: async () => {
    try {
      const response = await api.get('/api/mcp/transport-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching transport types:', error);
      throw error;
    }
  },

  // Validate server configuration
  validateConfig: async (config) => {
    try {
      const response = await api.post('/api/mcp/validate-config', config);
      return response.data;
    } catch (error) {
      console.error('Error validating config:', error);
      throw error;
    }
  }
};

export default mcpApi;
