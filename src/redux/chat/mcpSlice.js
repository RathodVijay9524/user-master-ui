import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mcpApi } from '../../app/chat/services/mcpApi';

// Initial state
const initialState = {
  servers: [],
  tools: [],
  serverTools: {}, // { serverId: { tools: [], count: 0, serverName: '' } }
  injectionStatus: null,
  selectedServer: null,
  showAllTools: true,
  showAddServerModal: false,
  loading: {
    servers: false,
    tools: false,
    serverTools: false,
    injection: false,
    addServer: false,
  },
  errors: {
    servers: null,
    tools: null,
    serverTools: null,
    injection: null,
    addServer: null,
  },
};

// Async thunks
export const fetchMCPServers = createAsyncThunk(
  'mcp/fetchServers',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux: Fetching MCP servers...');
      const response = await mcpApi.getServers();
      
      // Handle different response structures
      let servers;
      if (Array.isArray(response)) {
        // Direct array response
        servers = response;
      } else if (response && Array.isArray(response.servers)) {
        // Object with nested servers array
        servers = response.servers;
        console.log('✅ Redux: Loaded', servers.length, 'servers');
      } else {
        console.warn('⚠️ Redux: Unexpected response structure:', response);
        servers = [];
      }
      return servers;
    } catch (error) {
      console.error('❌ Redux: fetchMCPServers failed:', error);
      return rejectWithValue(error.message || 'Failed to fetch MCP servers');
    }
  }
);

export const fetchMCPTools = createAsyncThunk(
  'mcp/fetchTools',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mcpApi.getTools();
      
      // Handle different response structures
      let tools;
      if (Array.isArray(response)) {
        // Direct array response
        tools = response;
      } else if (response && Array.isArray(response.tools)) {
        // Object with nested tools array
        tools = response.tools;
      } else {
        tools = [];
      }
      return tools;
    } catch (error) {
      console.error('❌ Redux: fetchMCPTools failed:', error);
      return rejectWithValue(error.message || 'Failed to fetch MCP tools');
    }
  }
);

export const fetchInjectionStatus = createAsyncThunk(
  'mcp/fetchInjectionStatus',
  async (_, { rejectWithValue }) => {
    try {
      const status = await mcpApi.getInjectionStatus();
      return status;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch injection status');
    }
  }
);

export const checkServerStatus = createAsyncThunk(
  'mcp/checkServerStatus',
  async (serverId, { rejectWithValue }) => {
    try {
      console.log(`🔍 Redux: Checking status for server ${serverId}`);
      const statusData = await mcpApi.getServerStatus(serverId);
      return { serverId, status: statusData.status };
    } catch (error) {
      console.error(`❌ Redux: Failed to check server status for ${serverId}:`, error);
      return rejectWithValue({ serverId, error: error.message || 'Failed to check server status' });
    }
  }
);

export const fetchServerTools = createAsyncThunk(
  'mcp/fetchServerTools',
  async (serverId, { rejectWithValue, getState }) => {
    try {
      console.log(`🔄 Redux: Fetching tools for server ${serverId}`);
      
      // Check if we already have tools for this server and avoid duplicate calls
      const state = getState();
      const existingTools = state.mcp.serverTools[serverId];
      
      // Skip if we already have tools and they're not stale (less than 30 seconds old)
      if (existingTools && existingTools.count > 0 && !existingTools.error) {
        const cacheAge = existingTools.timestamp ? Date.now() - existingTools.timestamp : 0;
        if (cacheAge < 30000) { // 30 seconds cache
          console.log(`⚠️ Redux: Server ${serverId} already has ${existingTools.count} tools (cache age: ${cacheAge}ms), skipping fetch to avoid duplicates`);
          return { serverId, data: { tools: existingTools.tools, count: existingTools.count, serverName: existingTools.serverName, cached: true } };
        } else {
          console.log(`🔄 Redux: Server ${serverId} tools are stale (${cacheAge}ms old), refreshing...`);
        }
      }
      
      // First check if server is running before trying to get tools
      console.log(`🔍 Redux: Checking server status before fetching tools for ${serverId}`);
      try {
        const statusData = await mcpApi.getServerStatus(serverId);
        if (statusData.status !== 'RUNNING') {
          console.log(`⚠️ Redux: Server ${serverId} is not running (status: ${statusData.status}), skipping tools fetch`);
          return { 
            serverId, 
            data: { 
              tools: [], 
              count: 0, 
              serverName: '', 
              error: `Server is ${statusData.status.toLowerCase()}`,
              cached: false 
            }, 
            timestamp: Date.now() 
          };
        }
      } catch (statusError) {
        console.log(`⚠️ Redux: Could not check server status for ${serverId}, proceeding with tools fetch`);
      }
      
      // Add shorter timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Frontend timeout: Request took longer than 10 seconds')), 10000)
      );
      
      // Skip cache refresh for faster loading - just get tools directly
      console.log(`⚡ Fast fetch: Getting tools directly for ${serverId} (no cache refresh)`);
      const toolsPromise = mcpApi.getServerTools(serverId);
      
      // Race between tools fetch and timeout
      const data = await Promise.race([toolsPromise, timeoutPromise]);
      
      console.log(`✅ Redux: Tools fetched for server ${serverId}:`, data);
      
      return { serverId, data, timestamp: Date.now() };
    } catch (error) {
      console.error(`❌ Redux: Failed to fetch tools for server ${serverId}:`, error);
      return rejectWithValue({ serverId, error: error.message || 'Failed to fetch server tools' });
    }
  }
);

export const startMCPServer = createAsyncThunk(
  'mcp/startServer',
  async (serverId, { rejectWithValue }) => {
    try {
      console.log(`🔄 Redux: Starting server ${serverId}`);
      const response = await mcpApi.startServer(serverId);
      console.log(`✅ Redux: Server ${serverId} started:`, response);
      
      // Wait a moment for server to start, then check status
      setTimeout(async () => {
        try {
          const statusData = await mcpApi.getServerStatus(serverId);
          console.log(`🔍 Redux: Server ${serverId} status after start:`, statusData.status);
        } catch (error) {
          console.log(`⚠️ Redux: Could not check status after starting server ${serverId}`);
        }
      }, 2000);
      
      return { serverId, response };
    } catch (error) {
      console.error(`❌ Redux: Failed to start server ${serverId}:`, error);
      return rejectWithValue({ serverId, error: error.message || 'Failed to start server' });
    }
  }
);

export const stopMCPServer = createAsyncThunk(
  'mcp/stopServer',
  async (serverId, { rejectWithValue }) => {
    try {
      console.log(`🔄 Redux: Stopping server ${serverId}`);
      const response = await mcpApi.stopServer(serverId);
      console.log(`✅ Redux: Server ${serverId} stopped:`, response);
      
      // Clear tools for stopped server to prevent polling
      console.log(`🧹 Redux: Clearing tools for stopped server ${serverId}`);
      
      return { serverId, response, clearTools: true };
    } catch (error) {
      console.error(`❌ Redux: Failed to stop server ${serverId}:`, error);
      return rejectWithValue({ serverId, error: error.message || 'Failed to stop server' });
    }
  }
);

export const addMCPServer = createAsyncThunk(
  'mcp/addServer',
  async (serverData, { rejectWithValue }) => {
    try {
      console.log(`🔄 Redux: Adding new server:`, serverData);
      const response = await mcpApi.addServer(serverData);
      console.log(`✅ Redux: Server added successfully:`, response);
      return response;
    } catch (error) {
      console.error(`❌ Redux: Failed to add server:`, error);
      return rejectWithValue(error.message || 'Failed to add server');
    }
  }
);

// MCP slice
const mcpSlice = createSlice({
  name: 'mcp',
  initialState,
  reducers: {
    // Set selected server
    setSelectedServer: (state, action) => {
      state.selectedServer = action.payload;
    },
    
    // Toggle show all tools
    toggleShowAllTools: (state) => {
      state.showAllTools = !state.showAllTools;
    },
    
    // Clear selected server
    clearSelectedServer: (state) => {
      state.selectedServer = null;
    },
    
    // Clear errors
    clearErrors: (state) => {
      state.errors = {
        servers: null,
        tools: null,
        serverTools: null,
        injection: null,
      };
    },
    
    // Manual refresh server tools
    refreshServerTools: (state, action) => {
      const serverId = action.payload;
      if (state.serverTools[serverId]) {
        state.serverTools[serverId] = {
          ...state.serverTools[serverId],
          error: null
        };
      }
      state.loading.serverTools = true;
    },
    
    // Show/hide add server modal
    setShowAddServerModal: (state, action) => {
      state.showAddServerModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch servers
      .addCase(fetchMCPServers.pending, (state) => {
        state.loading.servers = true;
        state.errors.servers = null;
      })
      .addCase(fetchMCPServers.fulfilled, (state, action) => {
        state.loading.servers = false;
        state.servers = action.payload;
      })
      .addCase(fetchMCPServers.rejected, (state, action) => {
        state.loading.servers = false;
        state.errors.servers = action.payload;
      })
      
      // Fetch tools
      .addCase(fetchMCPTools.pending, (state) => {
        state.loading.tools = true;
        state.errors.tools = null;
      })
      .addCase(fetchMCPTools.fulfilled, (state, action) => {
        state.loading.tools = false;
        state.tools = action.payload || [];
      })
      .addCase(fetchMCPTools.rejected, (state, action) => {
        state.loading.tools = false;
        state.errors.tools = action.payload;
      })
      
      // Fetch injection status
      .addCase(fetchInjectionStatus.pending, (state) => {
        state.loading.injection = true;
        state.errors.injection = null;
      })
      .addCase(fetchInjectionStatus.fulfilled, (state, action) => {
        state.loading.injection = false;
        state.injectionStatus = action.payload;
      })
      .addCase(fetchInjectionStatus.rejected, (state, action) => {
        state.loading.injection = false;
        state.errors.injection = action.payload;
      })
      
      // Fetch server tools
      .addCase(fetchServerTools.pending, (state) => {
        state.loading.serverTools = true;
        state.errors.serverTools = null;
      })
      .addCase(fetchServerTools.fulfilled, (state, action) => {
        state.loading.serverTools = false;
        const { serverId, data, timestamp } = action.payload;
        
        console.log(`✅ Redux: Processing server tools for ${serverId}:`, data);
        
        if (data && data.tools && data.tools.length > 0) {
          state.serverTools[serverId] = {
            tools: data.tools.map(tool => ({
              ...tool,
              serverId,
              serverName: data.serverName || state.servers.find(s => s.id === serverId)?.name || 'Unknown Server'
            })),
            count: data.count || data.tools.length,
            serverName: data.serverName || state.servers.find(s => s.id === serverId)?.name || 'Unknown Server',
            cached: data.cached,
            timestamp: timestamp || Date.now(),
            error: null
          };
          console.log(`✅ Redux: Successfully loaded ${data.count || data.tools.length} tools for server ${serverId}`);
        } else if (data && data.error) {
          // Handle timeout or error cases
          console.log(`❌ Redux: Server ${serverId} returned error:`, data.error);
          state.serverTools[serverId] = {
            tools: [],
            count: 0,
            serverName: state.servers.find(s => s.id === serverId)?.name || 'Unknown Server',
            error: data.error,
            cached: data.cached,
            timestamp: Date.now()
          };
        } else {
          // No tools found
          console.log(`⚠️ Redux: No tools found for server ${serverId}`);
          state.serverTools[serverId] = {
            tools: [],
            count: 0,
            serverName: state.servers.find(s => s.id === serverId)?.name || 'Unknown Server',
            error: 'No tools found',
            cached: data?.cached,
            timestamp: Date.now()
          };
        }
      })
      .addCase(fetchServerTools.rejected, (state, action) => {
        state.loading.serverTools = false;
        const { serverId, error } = action.payload;
        state.errors.serverTools = error;
        
        // Set empty data for failed server
        state.serverTools[serverId] = {
          tools: [],
          count: 0,
          serverName: state.servers.find(s => s.id === serverId)?.name || 'Unknown Server',
          error
        };
        
        console.log(`❌ Redux: Server tools fetch failed for ${serverId}:`, error);
      })
      
      // Start server
      .addCase(startMCPServer.pending, (state, action) => {
        // Update server status optimistically
        const server = state.servers.find(s => s.id === action.meta.arg);
        if (server) {
          server.status = 'starting';
        }
      })
      .addCase(startMCPServer.fulfilled, (state, action) => {
        const { serverId } = action.payload;
        const server = state.servers.find(s => s.id === serverId);
        if (server) {
          server.status = 'running';
        }
        // Refresh server tools after starting
        if (serverId) {
          // Trigger a refetch of server tools
          state.loading.serverTools = true;
        }
      })
      .addCase(startMCPServer.rejected, (state, action) => {
        const { serverId } = action.payload;
        const server = state.servers.find(s => s.id === serverId);
        if (server) {
          server.status = 'stopped';
        }
      })
      
      // Stop server
      .addCase(stopMCPServer.pending, (state, action) => {
        // Update server status optimistically
        const server = state.servers.find(s => s.id === action.meta.arg);
        if (server) {
          server.status = 'stopping';
        }
      })
      .addCase(stopMCPServer.fulfilled, (state, action) => {
        const { serverId } = action.payload;
        const server = state.servers.find(s => s.id === serverId);
        if (server) {
          server.status = 'stopped';
        }
        // Clear server tools after stopping
        if (serverId && state.serverTools[serverId]) {
          state.serverTools[serverId] = {
            tools: [],
            count: 0,
            serverName: state.serverTools[serverId].serverName,
            error: 'Server stopped',
            timestamp: Date.now(),
            cached: false
          };
        }
      })
      .addCase(stopMCPServer.rejected, (state, action) => {
        const { serverId } = action.payload;
        const server = state.servers.find(s => s.id === serverId);
        if (server) {
          server.status = 'running';
        }
      })
      
      // Add server
      .addCase(addMCPServer.pending, (state) => {
        state.loading.addServer = true;
        state.errors.addServer = null;
      })
      .addCase(addMCPServer.fulfilled, (state, action) => {
        state.loading.addServer = false;
        state.showAddServerModal = false;
        // Refresh servers list after adding
        state.loading.servers = true;
      })
      .addCase(addMCPServer.rejected, (state, action) => {
        state.loading.addServer = false;
        state.errors.addServer = action.payload;
      })
      
      // Check server status
      .addCase(checkServerStatus.fulfilled, (state, action) => {
        const { serverId, status } = action.payload;
        // Update server status in the servers array if it exists
        const server = state.servers.find(s => s.id === serverId);
        if (server) {
          server.status = status;
        }
        console.log(`✅ Redux: Updated server ${serverId} status to ${status}`);
      })
      .addCase(checkServerStatus.rejected, (state, action) => {
        const { serverId, error } = action.payload;
        console.log(`❌ Redux: Failed to check status for server ${serverId}:`, error);
      });
  },
});

// Export actions
export const {
  setSelectedServer,
  toggleShowAllTools,
  clearSelectedServer,
  clearErrors,
  refreshServerTools,
  setShowAddServerModal,
} = mcpSlice.actions;

// Export reducer
export default mcpSlice.reducer;

// Selectors
export const selectMCPServers = (state) => state.mcp.servers;
export const selectMCPTools = (state) => state.mcp.tools;
export const selectServerTools = (state) => state.mcp.serverTools;
export const selectInjectionStatus = (state) => state.mcp.injectionStatus;
export const selectSelectedServer = (state) => state.mcp.selectedServer;
export const selectShowAllTools = (state) => state.mcp.showAllTools;
export const selectMCPLoading = (state) => state.mcp.loading;
export const selectMCPErrors = (state) => state.mcp.errors;
export const selectShowAddServerModal = (state) => state.mcp.showAddServerModal;

// Computed selectors
export const selectFilteredTools = (state) => {
  const { showAllTools, selectedServer, serverTools, tools } = state.mcp;
  
  if (showAllTools) {
    // When showing all tools, prioritize the general tools endpoint (146 tools)
    // This gives us the complete set of all available tools
    return tools;
  }
  
  if (selectedServer && serverTools[selectedServer.id]) {
    const serverToolsList = serverTools[selectedServer.id].tools || [];
    // If no server-specific tools, fallback to general tools
    return serverToolsList.length > 0 ? serverToolsList : tools;
  }
  
  return tools; // Fallback to general tools
};

export const selectToolsCountForServer = (state, serverId) => {
  const serverTools = state.mcp.serverTools[serverId];
  if (serverTools) {
    return serverTools.count || serverTools.tools?.length || 0;
  }
  return 0;
};

export const selectServerStatus = (state, server) => {
  // If server has explicit status, use it
  if (server.status) return server.status;
  
  // Check injection status for this server
  const injectionStatus = state.mcp.injectionStatus;
  if (injectionStatus?.serverStatus && injectionStatus.serverStatus[server.id] === true) {
    return 'running';
  }
  
  // Check if server has tools - if it has tools, it's likely running
  const serverTools = state.mcp.serverTools[server.id];
  if (serverTools && serverTools.count > 0) {
    return 'running';
  }
  
  // If server is enabled but has no tools, it might be stopped
  if (server.enabled) {
    return 'stopped';
  }
  
  // Default to stopped
  return 'stopped';
};