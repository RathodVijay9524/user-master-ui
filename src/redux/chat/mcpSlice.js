import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  servers: [],
  tools: [],
  monitoring: {
    cpuUsage: 45,
    memoryUsage: 67,
    activeTools: 16,
    uptime: 0,
    latency: 0
  },
  isLoading: false,
  error: null,
  selectedServer: null,
  showDashboard: false
};

// Async thunks
export const fetchMCPServers = createAsyncThunk(
  'mcp/fetchServers',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call - replace with actual API
      const response = await fetch('/api/mcp/servers');
      if (!response.ok) {
        throw new Error('Failed to fetch MCP servers');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMCPTools = createAsyncThunk(
  'mcp/fetchTools',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/mcp/tools');
      if (!response.ok) {
        throw new Error('Failed to fetch MCP tools');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startMCPServer = createAsyncThunk(
  'mcp/startServer',
  async (serverId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/mcp/servers/${serverId}/start`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to start MCP server');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const stopMCPServer = createAsyncThunk(
  'mcp/stopServer',
  async (serverId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/mcp/servers/${serverId}/stop`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to stop MCP server');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMCPServer = createAsyncThunk(
  'mcp/addServer',
  async (serverData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/mcp/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverData)
      });
      if (!response.ok) {
        throw new Error('Failed to add MCP server');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeMCPServer = createAsyncThunk(
  'mcp/removeServer',
  async (serverId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/mcp/servers/${serverId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to remove MCP server');
      }
      return serverId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMCPMonitoring = createAsyncThunk(
  'mcp/fetchMonitoring',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/mcp/monitoring');
      if (!response.ok) {
        throw new Error('Failed to fetch monitoring data');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// MCP slice
const mcpSlice = createSlice({
  name: 'mcp',
  initialState,
  reducers: {
    // Show/hide dashboard
    toggleDashboard: (state) => {
      state.showDashboard = !state.showDashboard;
    },
    showDashboard: (state) => {
      state.showDashboard = true;
    },
    hideDashboard: (state) => {
      state.showDashboard = false;
    },
    
    // Select server
    selectServer: (state, action) => {
      state.selectedServer = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Update monitoring data (for real-time updates)
    updateMonitoring: (state, action) => {
      state.monitoring = { ...state.monitoring, ...action.payload };
    },
    
    // Add server locally (optimistic update)
    addServerLocally: (state, action) => {
      const newServer = {
        id: Date.now(),
        ...action.payload,
        status: 'stopped',
        health: 0,
        uptime: '0m',
        latency: 0,
        toolsCount: 0
      };
      state.servers.push(newServer);
    },
    
    // Update server status locally
    updateServerStatus: (state, action) => {
      const { serverId, status, health, uptime, latency } = action.payload;
      const server = state.servers.find(s => s.id === serverId);
      if (server) {
        server.status = status;
        if (health !== undefined) server.health = health;
        if (uptime !== undefined) server.uptime = uptime;
        if (latency !== undefined) server.latency = latency;
      }
    },
    
    // Remove server locally
    removeServerLocally: (state, action) => {
      state.servers = state.servers.filter(s => s.id !== action.payload);
    },
    
    // Update tools
    updateTools: (state, action) => {
      state.tools = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch servers
      .addCase(fetchMCPServers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMCPServers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servers = action.payload;
      })
      .addCase(fetchMCPServers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch tools
      .addCase(fetchMCPTools.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMCPTools.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tools = action.payload;
      })
      .addCase(fetchMCPTools.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Start server
      .addCase(startMCPServer.pending, (state, action) => {
        const server = state.servers.find(s => s.id === action.meta.arg);
        if (server) {
          server.status = 'starting';
        }
      })
      .addCase(startMCPServer.fulfilled, (state, action) => {
        const server = state.servers.find(s => s.id === action.meta.arg);
        if (server) {
          server.status = 'running';
          server.health = action.payload.health || 85;
          server.uptime = '0m';
          server.latency = action.payload.latency || 0;
        }
      })
      .addCase(startMCPServer.rejected, (state, action) => {
        const server = state.servers.find(s => s.id === action.meta.arg);
        if (server) {
          server.status = 'stopped';
        }
        state.error = action.payload;
      })
      
      // Stop server
      .addCase(stopMCPServer.pending, (state, action) => {
        const server = state.servers.find(s => s.id === action.meta.arg);
        if (server) {
          server.status = 'stopping';
        }
      })
      .addCase(stopMCPServer.fulfilled, (state, action) => {
        const server = state.servers.find(s => s.id === action.meta.arg);
        if (server) {
          server.status = 'stopped';
          server.health = 0;
          server.uptime = '0m';
          server.latency = 0;
        }
      })
      .addCase(stopMCPServer.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Add server
      .addCase(addMCPServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMCPServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servers.push(action.payload);
      })
      .addCase(addMCPServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove server
      .addCase(removeMCPServer.fulfilled, (state, action) => {
        state.servers = state.servers.filter(s => s.id !== action.payload);
      })
      
      // Fetch monitoring
      .addCase(fetchMCPMonitoring.fulfilled, (state, action) => {
        state.monitoring = { ...state.monitoring, ...action.payload };
      });
  }
});

// Export actions
export const {
  toggleDashboard,
  showDashboard,
  hideDashboard,
  selectServer,
  clearError,
  updateMonitoring,
  addServerLocally,
  updateServerStatus,
  removeServerLocally,
  updateTools
} = mcpSlice.actions;

// Export reducer
export default mcpSlice.reducer;

// Selectors
export const selectMCPServers = (state) => state.mcp.servers;
export const selectMCPTools = (state) => state.mcp.tools;
export const selectMCPMonitoring = (state) => state.mcp.monitoring;
export const selectMCPDashboard = (state) => state.mcp.showDashboard;
export const selectSelectedMCPServer = (state) => state.mcp.selectedServer;
export const selectMCPLoading = (state) => state.mcp.isLoading;
export const selectMCPError = (state) => state.mcp.error;
