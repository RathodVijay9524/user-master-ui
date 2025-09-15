import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mcpApi } from '../../app/chat/services/mcpApi';

// Initial state
const initialState = {
  servers: [],
  tools: [],
  serverTools: {}, // { serverId: { tools: [], count: 0, serverName: '' } }
  injectionStatus: null,
  selectedServer: null,
  showAllTools: false,
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
      const servers = await mcpApi.getServers();
      return servers;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch MCP servers');
    }
  }
);

export const fetchMCPTools = createAsyncThunk(
  'mcp/fetchTools',
  async (_, { rejectWithValue }) => {
    try {
      const tools = await mcpApi.getTools();
      return tools;
    } catch (error) {
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

export const fetchServerTools = createAsyncThunk(
  'mcp/fetchServerTools',
  async (serverId, { rejectWithValue, getState }) => {
    try {
      console.log(`🔄 Redux: Fetching tools for server ${serverId}`);
      
      // Check if we already have tools for this server and avoid duplicate calls
      const state = getState();
      const existingTools = state.mcp.serverTools[serverId];
      if (existingTools && existingTools.count > 0 && !existingTools.error) {
        console.log(`⚠️ Redux: Server ${serverId} already has ${existingTools.count} tools, skipping fetch to avoid duplicates`);
        return { serverId, data: { tools: existingTools.tools, count: existingTools.count, serverName: existingTools.serverName, cached: true } };
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
      
      return { serverId, data };
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
      return { serverId, response };
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
        state.tools = action.payload.tools || [];
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
        const { serverId, data } = action.payload;
        
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
            cached: data.cached
          };
        } else {
          // No tools found
          console.log(`⚠️ Redux: No tools found for server ${serverId}`);
          state.serverTools[serverId] = {
            tools: [],
            count: 0,
            serverName: state.servers.find(s => s.id === serverId)?.name || 'Unknown Server',
            error: 'No tools found',
            cached: data?.cached
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
            error: 'Server stopped'
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
    const serverToolsList = Object.values(serverTools).flatMap(serverTool => serverTool.tools || []);
    // If no server tools available, fallback to general tools
    return serverToolsList.length > 0 ? serverToolsList : tools;
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