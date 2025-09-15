import axiosInstance from '../../../redux/axiosInstance';

// Use the existing axiosInstance which has JWT authentication and interceptors
const api = axiosInstance;

export const mcpApi = {
  // Expose baseURL for debugging
  baseURL: api.defaults.baseURL,
  // Get all MCP servers
  getServers: async () => {
    try {
      console.log('🔍 MCP API - Fetching servers from:', api.defaults.baseURL + '/mcp-servers');
      console.log('🔍 MCP API - JWT Token present:', !!localStorage.getItem('jwtToken'));
      
      const response = await api.get('/mcp-servers');
      console.log('✅ MCP API - Servers response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ MCP API - Error fetching servers:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      throw error;
    }
  },

  // Get MCP tools
  getTools: async () => {
    try {
      console.log('🔍 MCP API - Fetching tools from:', api.defaults.baseURL + '/mcp-servers/tools');
      const response = await api.get('/mcp-servers/tools');
      console.log('✅ MCP API - Tools response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ MCP API - Error fetching tools:', error);
      throw error;
    }
  },

  // Get injection status
  getInjectionStatus: async () => {
    try {
      console.log('🔍 MCP API - Fetching injection status from:', api.defaults.baseURL + '/mcp-servers/injection-status');
      const response = await api.get('/mcp-servers/injection-status');
      console.log('✅ MCP API - Injection status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ MCP API - Error fetching injection status:', error);
      throw error;
    }
  },

  // Start MCP server
  startServer: async (serverId) => {
    try {
      const response = await api.post(`/mcp-servers/${serverId}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting MCP server:', error);
      throw error;
    }
  },

  // Stop MCP server
  stopServer: async (serverId) => {
    try {
      const response = await api.post(`/mcp-servers/${serverId}/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping MCP server:', error);
      throw error;
    }
  },

  // Get tools for specific server
  getServerTools: async (serverId) => {
    try {
      console.log(`🔍 MCP API - Fetching tools for server ${serverId} from:`, api.defaults.baseURL + `/mcp-servers/${serverId}/tools`);
      console.log(`🔍 MCP API - JWT Token present:`, !!localStorage.getItem('jwtToken'));
      
      const response = await api.get(`/mcp-servers/${serverId}/tools`);
      console.log(`✅ MCP API - Server ${serverId} tools response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ MCP API - Error fetching server tools for ${serverId}:`, error);
      console.error(`❌ Error details:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      throw error;
    }
  },

  // Refresh cache for specific server
  refreshServerToolsCache: async (serverId) => {
    try {
      console.log(`🔄 MCP API - Refreshing cache for server ${serverId} from:`, api.defaults.baseURL + `/mcp-servers/${serverId}/refresh-cache`);
      console.log(`🔍 MCP API - JWT Token present:`, !!localStorage.getItem('jwtToken'));
      
      const response = await api.post(`/mcp-servers/${serverId}/refresh-cache`);
      console.log(`✅ MCP API - Server ${serverId} cache refresh response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ MCP API - Error refreshing server tools cache for ${serverId}:`, error);
      console.error(`❌ Error details:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      throw error;
    }
  },

  // Add new MCP server
  addServer: async (serverData) => {
    try {
      const response = await api.post('/mcp-servers', serverData);
      return response.data;
    } catch (error) {
      console.error('Error adding MCP server:', error);
      throw error;
    }
  },

  // Remove MCP server
  removeServer: async (serverId) => {
    try {
      const response = await api.delete(`/mcp-servers/${serverId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing MCP server:', error);
      throw error;
    }
  },

  // Get monitoring data
  getMonitoring: async () => {
    try {
      const response = await api.get('/mcp/monitoring');
      return response.data;
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      throw error;
    }
  },

  // Get server health
  getServerHealth: async (serverId) => {
    try {
      const response = await api.get(`/mcp/servers/${serverId}/health`);
      return response.data;
    } catch (error) {
      console.error('Error fetching server health:', error);
      throw error;
    }
  },

  // Test server connection
  testConnection: async (serverData) => {
    try {
      const response = await api.post('/mcp/test-connection', serverData);
      return response.data;
    } catch (error) {
      console.error('Error testing connection:', error);
      throw error;
    }
  },

  // Get server logs
  getServerLogs: async (serverId, limit = 100) => {
    try {
      const response = await api.get(`/mcp/servers/${serverId}/logs?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching server logs:', error);
      throw error;
    }
  },

  // Update server configuration
  updateServerConfig: async (serverId, config) => {
    try {
      const response = await api.put(`/mcp/servers/${serverId}/config`, config);
      return response.data;
    } catch (error) {
      console.error('Error updating server config:', error);
      throw error;
    }
  },

  // Get available transport types
  getTransportTypes: async () => {
    try {
      const response = await api.get('/mcp/transport-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching transport types:', error);
      throw error;
    }
  },

  // Validate server configuration
  validateConfig: async (config) => {
    try {
      const response = await api.post('/mcp/validate-config', config);
      return response.data;
    } catch (error) {
      console.error('Error validating config:', error);
      throw error;
    }
  }
};

export default mcpApi;
