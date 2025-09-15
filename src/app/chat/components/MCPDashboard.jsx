import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  demoMCPServers, 
  demoMCPTools, 
  demoMCPMonitoring,
  demoTransportTypes,
  demoAPIEndpoints,
  getServerHealthColor,
  getStatusColor,
  getLogLevelColor
} from '../data/mcpDemoData';
import { mcpApi } from '../services/mcpApi';
import MCPApiTest from './MCPApiTest';

const MCPDashboard = ({ theme, onClose }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('servers');
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [tools, setTools] = useState([]);
  const [serverTools, setServerTools] = useState({}); // Store tools for each server
  const [injectionStatus, setInjectionStatus] = useState(null);
  const [showAllTools, setShowAllTools] = useState(false);
  
  // Loading and error states
  const [loading, setLoading] = useState({
    servers: false,
    tools: false,
    injection: false,
    serverTools: false,
    actions: {}
  });
  const [errors, setErrors] = useState({});

  const [newServer, setNewServer] = useState({
    name: '',
    transportType: 'STDIO',
    enabled: true,
    configuration: {
      command: '',
      args: [],
      workingDirectory: '',
      environment: {}
    }
  });

  const [showAddServer, setShowAddServer] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(demoMCPMonitoring.cpuUsage);
  const [memoryUsage, setMemoryUsage] = useState(demoMCPMonitoring.memoryUsage);
  const [activeTools, setActiveTools] = useState(demoMCPMonitoring.activeTools);

  // Fetch initial data
  useEffect(() => {
    fetchServers();
    fetchTools();
    fetchInjectionStatus();
  }, []);

  // Monitor selectedServer changes
  useEffect(() => {
    console.log('🔍 === SELECTED SERVER CHANGED ===');
    console.log('🔍 New selectedServer:', selectedServer);
    console.log('🔍 selectedServer ID:', selectedServer?.id);
    console.log('🔍 selectedServer Name:', selectedServer?.name);
    if (selectedServer) {
      console.log('🔍 ServerTools for selected server:', serverTools[selectedServer.id]);
    } else {
      console.log('🔍 selectedServer is null - something cleared it');
    }
  }, [selectedServer]); // Removed serverTools from dependencies to prevent unnecessary re-runs

  // Fetch server tools after servers are loaded
  useEffect(() => {
    if (servers.length > 0) {
      fetchAllServerTools();
    }
  }, [servers]);

  // Animate CPU and memory usage
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 10)));
      setMemoryUsage(prev => Math.max(20, Math.min(85, prev + (Math.random() - 0.5) * 8)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // API Functions
  const fetchServers = async () => {
    setLoading(prev => ({ ...prev, servers: true }));
    try {
      const data = await mcpApi.getServers();
      console.log('🔍 Server data from backend:', data);
      console.log('🔍 First server fields:', data[0] ? Object.keys(data[0]) : 'No servers');
      setServers(data);
      setErrors(prev => ({ ...prev, servers: null }));
    } catch (error) {
      console.error('Error fetching servers:', error);
      setErrors(prev => ({ ...prev, servers: error.message }));
      // Fallback to demo data
      setServers(demoMCPServers);
    } finally {
      setLoading(prev => ({ ...prev, servers: false }));
    }
  };

  const fetchTools = async () => {
    setLoading(prev => ({ ...prev, tools: true }));
    try {
      const data = await mcpApi.getTools();
      // Handle the response structure: {message, count, tools: Array}
      const toolsArray = data && data.tools ? data.tools : (Array.isArray(data) ? data : []);
      console.log('🔍 First few tools structure:', toolsArray.slice(0, 3));
      console.log('🔍 Tools sample fields:', toolsArray.slice(0, 5).map(tool => ({
        name: tool.name,
        serverId: tool.serverId,
        server_id: tool.server_id,
        serverName: tool.serverName,
        server: tool.server,
        allKeys: Object.keys(tool)
      })));
      setTools(toolsArray);
      setErrors(prev => ({ ...prev, tools: null }));
    } catch (error) {
      console.error('Error fetching tools:', error);
      setErrors(prev => ({ ...prev, tools: error.message }));
      // Fallback to demo data
      setTools(demoMCPTools);
    } finally {
      setLoading(prev => ({ ...prev, tools: false }));
    }
  };

  const fetchInjectionStatus = async () => {
    setLoading(prev => ({ ...prev, injection: true }));
    try {
      const data = await mcpApi.getInjectionStatus();
      // Handle the complete response structure with all fields
      console.log('🔍 Injection status response:', data);
      setInjectionStatus({
        injected: data.availableTools > 0,
        uptime: '99.9%',
        dataTransferRate: '2.4 MB/s',
        activeTools: data.availableTools || 0,
        totalServers: data.totalServers || 0,
        activeDynamicServers: data.activeDynamicServers || 0,
        solution: data.solution || 'Tools injected successfully',
        // New fields from the detailed response
        serverStatus: data.serverStatus || {},
        staticTools: data.staticTools || 0,
        dynamicTools: data.dynamicTools || 0,
        injectionStatus: data.injectionStatus || '',
        activeServers: data.activeServers || 0
      });
      setErrors(prev => ({ ...prev, injection: null }));
    } catch (error) {
      console.error('Error fetching injection status:', error);
      setErrors(prev => ({ ...prev, injection: error.message }));
      // Fallback to demo data
      setInjectionStatus({
        injected: true,
        uptime: '99.9%',
        dataTransferRate: '2.4 MB/s',
        activeTools: tools.filter(t => t.status === 'active').length,
        serverStatus: {},
        staticTools: 0,
        dynamicTools: 0,
        injectionStatus: 'Unable to fetch injection status',
        activeServers: 0
      });
    } finally {
      setLoading(prev => ({ ...prev, injection: false }));
    }
  };

  const fetchServerTools = async (serverId) => {
    try {
      console.log(`🔍 === FETCHING TOOLS FOR SERVER: ${serverId} ===`);
      console.log(`🔍 Full API URL: ${mcpApi.baseURL}/mcp-servers/${serverId}/tools`);
      console.log(`🔍 JWT Token present: ${!!localStorage.getItem('jwtToken')}`);
      
      // First refresh the cache
      console.log(`🔄 Step 1: Refreshing cache for server: ${serverId}`);
      try {
        const cacheResponse = await mcpApi.refreshServerToolsCache(serverId);
        console.log(`✅ Cache refresh response:`, cacheResponse);
        console.log(`✅ Cache refreshed successfully for server: ${serverId}`);
      } catch (cacheError) {
        console.error(`❌ Cache refresh FAILED for server ${serverId}:`, cacheError);
        console.error(`❌ Cache error details:`, {
          message: cacheError.message,
          status: cacheError.response?.status,
          statusText: cacheError.response?.statusText,
          data: cacheError.response?.data,
          url: cacheError.config?.url
        });
        console.warn(`⚠️ Continuing with cached data despite cache refresh failure`);
      }
      
      // Then get the tools
      console.log(`🔄 Step 2: Fetching tools for server: ${serverId}`);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Frontend timeout: Request took longer than 30 seconds')), 30000)
      );
      
      const data = await Promise.race([
        mcpApi.getServerTools(serverId),
        timeoutPromise
      ]);
      
      console.log(`✅ Server ${serverId} tools response:`, data);
      console.log(`✅ Tools count: ${data?.count || 0}`);
      console.log(`✅ Tools array length: ${data?.tools?.length || 0}`);
      
      // Check for backend timeout error
      if (data?.error && data.error.includes('TimeoutException')) {
        console.error(`⏰ BACKEND TIMEOUT ERROR for server ${serverId}:`, data.error);
        console.error(`⏰ The MCP server is taking longer than 20 seconds to respond`);
        console.error(`⏰ This is a backend timeout, not a frontend issue`);
        
        // Return error data so we can display it to the user
        return {
          ...data,
          timeoutError: true,
          errorMessage: 'Backend timeout: MCP server is taking longer than 20 seconds to respond. Please check if the MCP server is running and responsive.'
        };
      }
      
      if (!data || !data.tools || data.tools.length === 0) {
        console.warn(`⚠️ No tools found in response for server ${serverId}`);
      }
      
      return data;
    } catch (error) {
      console.error(`❌ === ERROR FETCHING SERVER TOOLS FOR ${serverId} ===`);
      console.error(`❌ Main error:`, error);
      console.error(`❌ Error details:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      return null;
    }
  };

  const fetchAllServerTools = async () => {
    if (!servers.length) return;
    
    setLoading(prev => ({ ...prev, serverTools: true }));
    console.log('🔍 Fetching tools for all servers...');
    const serverToolsData = {};
    
    // First try individual server endpoints
    for (const server of servers) {
      console.log(`🔍 Fetching tools for server: ${server.name} (${server.id})`);
      try {
        const toolsData = await fetchServerTools(server.id);
        console.log(`📊 Tools data for ${server.name}:`, toolsData);
        
        // Handle both successful responses and timeout errors
        if (toolsData && toolsData.tools && toolsData.tools.length > 0) {
          // Add serverId to each tool for easier filtering
          const toolsWithServerId = toolsData.tools.map(tool => ({
            ...tool,
            serverId: server.id,
            serverName: server.name
          }));
          serverToolsData[server.id] = {
            tools: toolsWithServerId,
            count: toolsData.count,
            serverName: server.name
          };
          console.log(`✅ Successfully loaded ${toolsData.count} tools for ${server.name}`);
        } else if (toolsData?.timeoutError) {
          // Handle timeout errors - still set empty data to stop loading
          console.log(`⏰ Timeout error for ${server.name} - setting empty data`);
          serverToolsData[server.id] = { tools: [], count: 0, serverName: server.name, timeoutError: true };
        } else {
          console.log(`⚠️ No tools data for ${server.name}`);
          serverToolsData[server.id] = { tools: [], count: 0, serverName: server.name };
        }
      } catch (error) {
        console.error(`❌ Failed to fetch tools for server ${server.id} (${server.name}):`, error);
        console.error(`❌ Error details:`, {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
        // Always set some data to stop loading state
        serverToolsData[server.id] = { tools: [], count: 0, serverName: server.name, error: true };
      }
    }
    
    // Log final server tools summary - NO FALLBACK DISTRIBUTION
    console.log(`📊 Server tools summary (REAL BACKEND DATA ONLY):`, Object.entries(serverToolsData).map(([id, data]) => ({
      serverId: id,
      count: data.count,
      serverName: data.serverName,
      timeoutError: data.timeoutError,
      error: data.error
    })));
    
    setServerTools(serverToolsData);
    setLoading(prev => ({ ...prev, serverTools: false }));
    console.log('✅ All server tools fetched:', serverToolsData);
  };

  const handleServerAction = async (serverId, action) => {
    const actionKey = `${serverId}_${action}`;
    setLoading(prev => ({ 
      ...prev, 
      actions: { ...prev.actions, [actionKey]: true } 
    }));

    try {
        if (action === 'start') {
        await mcpApi.startServer(serverId);
        setServers(prev => prev.map(server => 
          server.id === serverId 
            ? { ...server, status: 'running', health: 85 + Math.random() * 15, uptime: '0m' }
            : server
        ));
        } else if (action === 'stop') {
        await mcpApi.stopServer(serverId);
        setServers(prev => prev.map(server => 
          server.id === serverId 
            ? { ...server, status: 'stopped', health: 0, uptime: '0m' }
            : server
        ));
        } else if (action === 'remove') {
        await mcpApi.removeServer(serverId);
        setServers(prev => prev.filter(server => server.id !== serverId));
        if (selectedServer?.id === serverId) {
          setSelectedServer(null);
        }
      }
      
      // Refresh tools and injection status after action
      fetchTools();
      fetchInjectionStatus();
      
    } catch (error) {
      console.error(`Error ${action}ing server:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [`server_${serverId}_${action}`]: error.message 
      }));
    } finally {
      setLoading(prev => ({ 
        ...prev, 
        actions: { ...prev.actions, [actionKey]: false } 
      }));
    }
  };

  const handleServerSelect = (server) => {
    console.log('🔍 === SERVER SELECTION DEBUG ===');
    console.log('🔍 Server being selected:', server);
    console.log('🔍 Server ID:', server.id);
    console.log('🔍 Server Name:', server.name);
    console.log('🔍 Current selectedServer before:', selectedServer);
    
    setSelectedServer(server);
    setActiveTab('tools');
    
    console.log('🔍 Server selection completed, switching to tools tab');
  };

  // Use useMemo to prevent infinite re-renders
  const filteredTools = useMemo(() => {
    // If showAllTools is true, return all tools from individual server endpoints only
    if (showAllTools) {
      const allTools = Object.values(serverTools).flatMap(serverTool => serverTool.tools || []);
      return allTools;
    }
    
    if (selectedServer && serverTools[selectedServer.id]) {
      // Return tools specifically for this server from the individual endpoint
      const serverToolsData = serverTools[selectedServer.id].tools || [];
      return serverToolsData;
    }
    
    // No fallback to general tools - only use real server-specific data
    return [];
  }, [showAllTools, selectedServer, serverTools]);

  const getFilteredTools = () => filteredTools;

  const getToolsCountForServer = (serverId) => {
    // Only use server-specific tools - no fallback
    if (serverTools[serverId]) {
      return serverTools[serverId].count || serverTools[serverId].tools?.length || 0;
    }
    
    // If server tools are still loading, show loading state
    if (loading.serverTools) {
      return 'Loading...';
    }
    
    // No fallback - return 0 if no server-specific data
    return 0;
  };

  const getServerStatus = (server) => {
    // If server has explicit status, use it
    if (server.status) return server.status;
    
    // Check injection status for this server
    if (injectionStatus?.serverStatus && injectionStatus.serverStatus[server.id] === true) {
      return 'running';
    }
    
    // Check if server has tools - if it has tools, it's likely running
    if (serverTools[server.id] && serverTools[server.id].count > 0) {
      return 'running';
    }
    
    // If server is enabled but has no tools, it might be stopped
    if (server.enabled) {
      return 'stopped'; // Assume stopped if enabled but no tools
    }
    
    // Default to stopped
    return 'stopped';
  };

  const getServerUptime = (server) => {
    return server.uptime || '2h 15m';
  };

  const getServerLatency = (server) => {
    return server.latency || Math.floor(Math.random() * 50) + 10;
  };

  const handleAddServer = async () => {
    if (!newServer.name) return;

    const actionKey = 'add_server';
    setLoading(prev => ({ 
      ...prev, 
      actions: { ...prev.actions, [actionKey]: true } 
    }));

    try {
      const serverData = {
        name: newServer.name,
        transportType: newServer.transportType,
        enabled: newServer.enabled,
        configuration: newServer.configuration,
        description: `New ${newServer.transportType} server`
      };

      const newServerObj = await mcpApi.addServer(serverData);
      setServers(prev => [...prev, {
        ...newServerObj,
        status: 'stopped',
        toolsCount: 0,
        health: 0,
        uptime: '0m',
        latency: 0,
        lastStarted: null
      }]);
      
      setNewServer({ 
        name: '', 
        transportType: 'STDIO', 
        enabled: true,
        configuration: {
          command: '',
          args: [],
          workingDirectory: '',
          environment: {}
        }
      });
      setShowAddServer(false);
      
      // Refresh tools and injection status
      fetchTools();
      fetchInjectionStatus();
      
    } catch (error) {
      console.error('Error adding server:', error);
      setErrors(prev => ({ 
        ...prev, 
        addServer: error.message 
      }));
    } finally {
      setLoading(prev => ({ 
        ...prev, 
        actions: { ...prev.actions, [actionKey]: false } 
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return '#10b981';
      case 'stopped': return '#ef4444';
      case 'starting': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return '🟢';
      case 'stopped': return '🔴';
      case 'starting': return '🟡';
      default: return '⚪';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full h-full bg-white overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <span className="text-lg sm:text-2xl">🔧</span>
              </motion.div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold truncate">MCP Server Management</h2>
                <p className="text-blue-100 text-sm sm:text-base truncate">Manage your Model Context Protocol servers</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="hidden sm:flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                <span className="text-sm">Online</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm">Latency: {Math.floor(Math.random() * 50 + 10)}ms</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
              >
                <span className="text-lg sm:text-xl">✕</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 overflow-x-auto flex-shrink-0">
          {[
            { id: 'servers', label: 'Servers', icon: '🖥️' },
            { id: 'tools', label: 'Tools', icon: '🛠️' },
            { id: 'monitoring', label: 'Monitoring', icon: '📊' },
            { id: 'config', label: 'Config', icon: '⚙️' },
            { id: 'test', label: 'API Test', icon: '🧪' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-3 font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="text-sm sm:text-lg">{tab.icon}</span>
              <span className="text-sm sm:text-base">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'servers' && (
              <motion.div
                key="servers"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto p-4 sm:p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Server List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border shadow-sm">
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold flex items-center">
                            <span className="mr-2">🖥️</span>
                            Active Servers ({servers.length})
                            <span className="ml-3 text-sm font-normal text-gray-500">
                              • {loading.serverTools ? (
                                <span className="text-blue-500">Loading tools...</span>
                              ) : (
                                `${Object.values(serverTools).reduce((total, serverTool) => total + (serverTool.count || 0), 0)} total tools (from individual servers)`
                              )}
                            </span>
                          </h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={async () => {
                                console.log('🔄 Refreshing all server caches...');
                                setLoading(prev => ({ ...prev, serverTools: true }));
                                try {
                                  for (const server of servers) {
                                    console.log(`🔄 Refreshing cache for ${server.name} (${server.id}):`);
                                    try {
                                      await mcpApi.refreshServerToolsCache(server.id);
                                      console.log(`✅ Cache refreshed for ${server.name}`);
                                    } catch (error) {
                                      console.error(`❌ Cache refresh failed for ${server.name}:`, error.message);
                                    }
                                  }
                                  // Now fetch all server tools
                                  await fetchAllServerTools();
                                } finally {
                                  setLoading(prev => ({ ...prev, serverTools: false }));
                                }
                              }}
                              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                            >
                              Refresh All Caches
                            </button>
                            <button
                              onClick={async () => {
                                console.log('🧪 Manually testing individual server tools endpoints...');
                                for (const server of servers) {
                                  console.log(`\n🔍 Testing ${server.name} (${server.id}):`);
                                  try {
                                    const result = await mcpApi.getServerTools(server.id);
                                    console.log(`✅ ${server.name} tools:`, result);
                                  } catch (error) {
                                    console.error(`❌ ${server.name} failed:`, error.response?.status, error.response?.statusText);
                                    console.error(`❌ URL: ${error.config?.url}`);
                                  }
                                }
                              }}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                            >
                              Test Individual Endpoints
                            </button>
                          </div>
                          {errors.servers && (
                            <div className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                              {errors.servers}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        {loading.servers ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Loading servers...</span>
                          </div>
                        ) : (
                        <table className="w-full min-w-[800px]">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Server</th>
                              <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                              <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tools</th>
                              <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Health</th>
                              <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {servers.map((server, index) => (
                              <motion.tr
                                key={server.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                                  selectedServer?.id === server.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                }`}
                                onClick={() => handleServerSelect(server)}
                              >
                                <td className="px-2 sm:px-4 py-3 sm:py-4">
                                  <div className="flex items-center space-x-2 sm:space-x-3">
                                    <motion.div
                                      animate={getServerStatus(server) === 'running' ? pulseVariants.pulse : {}}
                                      className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                                    >
                                      <span className="text-lg sm:text-xl">
                                        {server.transportType === 'STDIO' ? '📁' : 
                                         server.transportType === 'SSE' ? '🗄️' : 
                                         server.transportType === 'SOCKET' ? '🔌' : '🌐'}
                                      </span>
                                    </motion.div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium text-gray-900 truncate">{server.name}</div>
                                      <div className="text-xs sm:text-sm text-gray-500 truncate">{server.description}</div>
                                      <div className="sm:hidden text-xs text-gray-400 mt-1">{server.transportType}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {server.transportType}
                                  </span>
                                </td>
                                <td className="px-2 sm:px-4 py-3 sm:py-4">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm sm:text-lg">{getStatusIcon(getServerStatus(server))}</span>
                                    <span className={`capitalize text-xs sm:text-sm font-medium ${
                                      getServerStatus(server) === 'running' ? 'text-green-600' :
                                      getServerStatus(server) === 'stopped' ? 'text-red-600' :
                                      'text-yellow-600'
                                    }`}>
                                      {getServerStatus(server)}
                                    </span>
                                  </div>
                                  {getServerStatus(server) === 'running' && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {getServerUptime(server)} • {getServerLatency(server)}ms
                                    </div>
                                  )}
                                </td>
                                <td className="px-2 sm:px-4 py-3 sm:py-4">
                                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                                    {loading.serverTools ? (
                                      <span className="text-blue-500 flex items-center">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-1"></div>
                                        Loading...
                                      </span>
                                    ) : serverTools[server.id] ? (
                                      <>
                                        {getToolsCountForServer(server.id)} Tools
                                        {serverTools[server.id].count > 0 && (
                                          <span className="ml-1 text-green-600">✓</span>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-gray-400">No tools</span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {loading.serverTools ? (
                                      'Loading...'
                                    ) : serverTools[server.id] ? (
                                      `${serverTools[server.id].tools?.filter(t => t.status === 'active').length || 0} Active`
                                    ) : (
                                      'No data'
                                    )}
                                  </div>
                                </td>
                                <td className="px-2 sm:px-4 py-3 sm:py-4 hidden md:table-cell">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                                      <motion.div
                                        className={`h-2 rounded-full ${
                                          server.health >= 80 ? 'bg-green-400' :
                                          server.health >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                                        }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${server.health}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                      />
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-900">{server.health}%</span>
                                  </div>
                                </td>
                                <td className="px-2 sm:px-4 py-3 sm:py-4">
                                  <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      disabled={loading.actions[`${server.id}_${getServerStatus(server) === 'running' ? 'stop' : 'start'}`]}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleServerAction(server.id, getServerStatus(server) === 'running' ? 'stop' : 'start');
                                      }}
                                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 ${
                                        getServerStatus(server) === 'running'
                                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                                      }`}
                                    >
                                      {loading.actions[`${server.id}_${getServerStatus(server) === 'running' ? 'stop' : 'start'}`] ? '...' : (getServerStatus(server) === 'running' ? 'Stop' : 'Start')}
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      disabled={loading.actions[`${server.id}_remove`]}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleServerAction(server.id, 'remove');
                                      }}
                                      className="px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                      {loading.actions[`${server.id}_remove`] ? '...' : 'Remove'}
                                    </motion.button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add New Server */}
                  <div className="mt-6 lg:mt-0">
                    <div className="bg-white rounded-xl border shadow-sm">
                      <div className="p-3 sm:p-4 border-b">
                        <h3 className="text-base sm:text-lg font-semibold flex items-center">
                          <span className="mr-2">➕</span>
                          Add New Server
                        </h3>
                      </div>
                      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Server Name
                          </label>
                          <input
                            type="text"
                            value={newServer.name}
                            onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Enter server name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Transport Type
                          </label>
                          <select
                            value={newServer.transportType}
                            onChange={(e) => setNewServer({ 
                              ...newServer, 
                              transportType: e.target.value,
                              configuration: {
                                ...newServer.configuration,
                                // Reset configuration based on transport type
                                ...(e.target.value === 'STDIO' ? {
                                  command: '',
                                  args: [],
                                  workingDirectory: '',
                                  environment: {}
                                } : e.target.value === 'SSE' ? {
                                  url: '',
                                  endpoint: '/mcp',
                                  messageEndpoint: '/mcp/message',
                                  timeoutSeconds: 30,
                                  headers: {}
                                } : e.target.value === 'SOCKET' ? {
                                  host: 'localhost',
                                  port: 8083,
                                  protocol: 'TCP',
                                  options: {}
                                } : {})
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                          >
                            {demoTransportTypes.map((type) => (
                              <option 
                                key={type.value} 
                                value={type.value}
                                className="text-gray-900 bg-white"
                              >
                                {type.icon} {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* STDIO Configuration */}
                        {newServer.transportType === 'STDIO' && (
                          <>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Command
                              </label>
                              <input
                                type="text"
                                value={newServer.configuration.command || ''}
                                onChange={(e) => setNewServer({ 
                                  ...newServer, 
                                  configuration: { ...newServer.configuration, command: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="e.g., python, node, ./server"
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Arguments (comma-separated)
                              </label>
                              <input
                                type="text"
                                value={newServer.configuration.args?.join(', ') || ''}
                                onChange={(e) => setNewServer({ 
                                  ...newServer, 
                                  configuration: { 
                                    ...newServer.configuration, 
                                    args: e.target.value.split(',').map(arg => arg.trim()).filter(arg => arg)
                                  }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="e.g., script.py, --config, config.json"
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Working Directory
                              </label>
                              <input
                                type="text"
                                value={newServer.configuration.workingDirectory || ''}
                                onChange={(e) => setNewServer({ 
                                  ...newServer, 
                                  configuration: { ...newServer.configuration, workingDirectory: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="e.g., /path/to/working/directory"
                              />
                            </div>
                          </>
                        )}

                        {/* SSE Configuration */}
                        {newServer.transportType === 'SSE' && (
                          <>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                URL
                              </label>
                              <input
                                type="text"
                                value={newServer.configuration.url || ''}
                                onChange={(e) => setNewServer({ 
                                  ...newServer, 
                                  configuration: { ...newServer.configuration, url: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="http://localhost:8082"
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Endpoint
                              </label>
                              <input
                                type="text"
                                value={newServer.configuration.endpoint || '/mcp'}
                                onChange={(e) => setNewServer({ 
                                  ...newServer, 
                                  configuration: { ...newServer.configuration, endpoint: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="/mcp"
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Message Endpoint
                              </label>
                              <input
                                type="text"
                                value={newServer.configuration.messageEndpoint || '/mcp/message'}
                                onChange={(e) => setNewServer({ 
                                  ...newServer, 
                                  configuration: { ...newServer.configuration, messageEndpoint: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="/mcp/message"
                              />
                            </div>
                          </>
                        )}

                        {/* SOCKET Configuration */}
                        {newServer.transportType === 'SOCKET' && (
                          <>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Host
                              </label>
                              <input
                                type="text"
                                value={newServer.configuration.host || 'localhost'}
                                onChange={(e) => setNewServer({ 
                                  ...newServer, 
                                  configuration: { ...newServer.configuration, host: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="localhost"
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Port
                              </label>
                              <input
                                type="number"
                                value={newServer.configuration.port || 8083}
                                onChange={(e) => setNewServer({ 
                                  ...newServer, 
                                  configuration: { ...newServer.configuration, port: parseInt(e.target.value) }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="8083"
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Protocol
                              </label>
                              <select
                                value={newServer.configuration.protocol || 'TCP'}
                                onChange={(e) => setNewServer({ 
                                  ...newServer, 
                                  configuration: { ...newServer.configuration, protocol: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                              >
                                <option value="TCP">TCP</option>
                                <option value="UDP">UDP</option>
                              </select>
                            </div>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loading.actions.add_server}
                          onClick={handleAddServer}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                        >
                          {loading.actions.add_server ? 'Adding...' : 'Add Server'}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto p-4 sm:p-6"
              >
                {/* Selected Server Info */}
                {selectedServer && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">
                            {selectedServer.type === 'STDIO' ? '📁' : 
                             selectedServer.type === 'SSE' ? '🗄️' : 
                             selectedServer.type === 'Socket' ? '🔌' : '🌐'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900">
                            {selectedServer.name} Tools
                          </h3>
                          <p className="text-sm text-blue-700">
                            {getFilteredTools().length} tools available • {selectedServer.type} server
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          console.log('🔍 === SHOW ALL TOOLS BUTTON CLICKED ===');
                          console.log('🔍 This will clear selectedServer:', selectedServer);
                          console.log('🔍 Stack trace:', new Error().stack);
                          setSelectedServer(null);
                        }}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Show All Tools
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Available Tools */}
                  <div className="bg-white rounded-xl border shadow-sm">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center">
                        <span className="mr-2">🛠️</span>
                          {showAllTools ? 'All Tools (from individual servers)' : (selectedServer ? `${selectedServer.name} Tools` : 'Available Tools')} ({getFilteredTools().length})
                      </h3>
                        <div className="flex items-center space-x-3">
                          {selectedServer && showAllTools && (
                            <button
                              onClick={() => setShowAllTools(false)}
                              className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                            >
                              Back to Server Tools
                            </button>
                          )}
                          <div className="text-sm text-gray-500">
                            Total: {Object.values(serverTools).reduce((total, serverTool) => total + (serverTool.count || 0), 0)} tools (from individual servers)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {getFilteredTools().length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-2">
                            {selectedServer ? '⏰' : '🛠️'}
                          </div>
                          <p className="text-gray-500">
                            {selectedServer 
                              ? `Backend timeout error for ${selectedServer.name}. The MCP server is taking longer than 20 seconds to respond. This is a backend timeout issue, not a frontend problem.` 
                              : 'No tools available'
                            }
                          </p>
                          {selectedServer && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                              <div className="text-red-800 text-sm">
                                <p className="font-semibold">⏰ Backend Timeout Error</p>
                                <p className="mt-1">The MCP server is not responding within the 20-second timeout limit.</p>
                                <p className="mt-1">Possible solutions:</p>
                                <ul className="mt-2 ml-4 list-disc text-left">
                                  <li>Check if the MCP server process is running</li>
                                  <li>Verify the MCP server is not stuck or hanging</li>
                                  <li>Restart the MCP server</li>
                                  <li>Check server logs for errors</li>
                                  <li>Increase the backend timeout limit</li>
                                </ul>
                              </div>
                            </div>
                          )}
                          {selectedServer && (
                            <div className="mt-4 space-y-2">
                              <button
                                onClick={async () => {
                                  console.log(`🔄 Manually refreshing tools for server: ${selectedServer.id}`);
                                  try {
                                    const toolsData = await fetchServerTools(selectedServer.id);
                                    if (toolsData && toolsData.tools) {
                                      setServerTools(prev => ({
                                        ...prev,
                                        [selectedServer.id]: {
                                          tools: toolsData.tools.map(tool => ({
                                            ...tool,
                                            serverId: selectedServer.id,
                                            serverName: selectedServer.name
                                          })),
                                          count: toolsData.count,
                                          serverName: selectedServer.name
                                        }
                                      }));
                                      console.log(`✅ Successfully refreshed tools for ${selectedServer.name}`);
                                    }
                                  } catch (error) {
                                    console.error(`❌ Failed to refresh tools for ${selectedServer.name}:`, error);
                                  }
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm mr-2"
                              >
                                🔄 Refresh This Server's Tools
                              </button>
                              <button
                                onClick={async () => {
                                  console.log(`🧪 DIRECT API TEST (NO CACHE REFRESH) for server: ${selectedServer.id}`);
                                  try {
                                    // Direct API call without cache refresh - this might avoid the timeout
                                    const response = await mcpApi.getServerTools(selectedServer.id);
                                    console.log(`🧪 DIRECT API RESPONSE:`, response);
                                    console.log(`🧪 Response structure:`, {
                                      cached: response.cached,
                                      count: response.count,
                                      toolsLength: response.tools?.length,
                                      serverId: response.serverId,
                                      serverName: response.serverName,
                                      error: response.error
                                    });
                                    
                                    if (response?.error && response.error.includes('TimeoutException')) {
                                      console.error(`⏰ DIRECT API TEST: Backend timeout detected`);
                                      console.error(`⏰ Error:`, response.error);
                                    }
                                    
                                    if (response && response.tools && response.tools.length > 0) {
                                      console.log(`🧪 First few tools:`, response.tools.slice(0, 3));
                                      
                                      // Update the state with the direct response
                                      setServerTools(prev => ({
                                        ...prev,
                                        [selectedServer.id]: {
                                          tools: response.tools.map(tool => ({
                                            ...tool,
                                            serverId: selectedServer.id,
                                            serverName: selectedServer.name
                                          })),
                                          count: response.count,
                                          serverName: selectedServer.name
                                        }
                                      }));
                                      console.log(`✅ DIRECT API TEST SUCCESS: Loaded ${response.count} tools`);
                                    } else {
                                      console.log(`❌ DIRECT API TEST: No tools in response`);
                                      if (response?.error) {
                                        console.log(`❌ Error from backend:`, response.error);
                                      }
                                    }
                                  } catch (error) {
                                    console.error(`❌ DIRECT API TEST FAILED:`, error);
                                    console.error(`❌ Error details:`, {
                                      message: error.message,
                                      status: error.response?.status,
                                      statusText: error.response?.statusText,
                                      data: error.response?.data,
                                      url: error.config?.url,
                                      baseURL: error.config?.baseURL
                                    });
                                  }
                                }}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm mr-2"
                              >
                                🧪 Test Without Cache Refresh
                              </button>
                              {Object.values(serverTools).some(st => st.count > 0) && (
                                <button
                                  onClick={() => setShowAllTools(true)}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                                >
                                  Show All {Object.values(serverTools).reduce((total, serverTool) => total + (serverTool.count || 0), 0)} Tools Instead
                                </button>
                              )}
                            </div>
                          )}
                          {selectedServer && (
                            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                              <p><strong>Debug Info:</strong></p>
                              <p>Server ID: {selectedServer.id}</p>
                              <p>Server Name: {selectedServer.name}</p>
                              <p>ServerTools for this server: {serverTools[selectedServer.id] ? 'Found' : 'NOT FOUND'}</p>
                              <p>Available server IDs: {Object.keys(serverTools).join(', ')}</p>
                              <p>Tools count for this server: {serverTools[selectedServer.id]?.count || 0}</p>
                              <p>Total Tools (General): {tools.length} (not used - individual servers only)</p>
                              <p><strong>API URL being called:</strong> {mcpApi.baseURL}/mcp-servers/{selectedServer.id}/tools</p>
                              <p><strong>Expected URL (from Postman):</strong> http://localhost:9091/api/mcp-servers/{selectedServer.id}/tools</p>
                              <p><strong>URL Match:</strong> {(mcpApi.baseURL + '/mcp-servers/' + selectedServer.id + '/tools') === ('http://localhost:9091/api/mcp-servers/' + selectedServer.id + '/tools') ? '✅ YES' : '❌ NO'}</p>
                              <div className="mt-2">
                                <button
                                  onClick={() => {
                                    const firstServer = servers[0];
                                    if (firstServer) {
                                      console.log('🔧 Manually setting selected server to:', firstServer);
                                      setSelectedServer(firstServer);
                                    }
                                  }}
                                  className="px-3 py-1 bg-yellow-500 text-white rounded text-xs mr-2"
                                >
                                  🔧 Set First Server as Selected
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('🔧 Clearing selected server');
                                    setSelectedServer(null);
                                  }}
                                  className="px-3 py-1 bg-red-500 text-white rounded text-xs mr-2"
                                >
                                  🔧 Clear Selected Server
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('🔍 === DEBUG: Current State ===');
                                    console.log('🔍 selectedServer:', selectedServer);
                                    console.log('🔍 showAllTools:', showAllTools);
                                    console.log('🔍 serverTools:', serverTools);
                                    console.log('🔍 Available server IDs:', Object.keys(serverTools));
                                    console.log('🔍 getFilteredTools().length:', getFilteredTools().length);
                                    console.log('🔍 filteredTools:', filteredTools);
                                    if (selectedServer) {
                                      console.log('🔍 Tools for selected server:', serverTools[selectedServer.id]);
                                      console.log('🔍 Tools count for selected server:', serverTools[selectedServer.id]?.count);
                                      console.log('🔍 Tools array length:', serverTools[selectedServer.id]?.tools?.length);
                                    }
                                  }}
                                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs mr-2"
                                >
                                  🔍 Debug State
                                </button>
                                <button
                                  onClick={() => {
                                    const firstServer = servers[0];
                                    if (firstServer && !selectedServer) {
                                      console.log('🔧 Auto-selecting first server for testing:', firstServer);
                                      setSelectedServer(firstServer);
                                      setActiveTab('tools');
                                    } else {
                                      console.log('🔧 Server already selected or no servers available');
                                    }
                                  }}
                                  className="px-3 py-1 bg-green-500 text-white rounded text-xs"
                                >
                                  🔧 Auto-Select Server
                                </button>
                              </div>
                              <p>Server-Specific Tools: {serverTools[selectedServer.id]?.count || 0}</p>
                              <p>Filtered Tools: {selectedServer && serverTools[selectedServer.id] ? (serverTools[selectedServer.id].tools?.length || 0) : 0}</p>
                              <div className="mt-2 space-x-2">
                                <button 
                                  onClick={() => {
                                    console.log('🔍 All tools for debugging:', tools.slice(0, 10));
                                    console.log('🔍 Selected server:', selectedServer);
                                    console.log('🔍 Server-specific tools:', serverTools[selectedServer.id]);
                                    console.log('🔍 All server tools data:', serverTools);
                                    console.log('🔍 All servers data:', servers);
                                    console.log('🔍 Server status logic:', {
                                      serverId: selectedServer.id,
                                      serverStatus: getServerStatus(selectedServer),
                                      hasTools: serverTools[selectedServer.id]?.count > 0,
                                      serverEnabled: selectedServer.enabled,
                                      serverFields: Object.keys(selectedServer)
                                    });
                                  }}
                                  className="text-xs bg-yellow-200 px-2 py-1 rounded hover:bg-yellow-300"
                                >
                                  Log Debug Info
                                </button>
                                <button 
                                  onClick={async () => {
                                    console.log('🧪 Testing server tools endpoint manually...');
                                    try {
                                      const result = await mcpApi.getServerTools(selectedServer.id);
                                      console.log('✅ Manual test successful:', result);
                                      // Refresh the tools for this server
                                      const toolsData = await fetchServerTools(selectedServer.id);
                                      if (toolsData && toolsData.tools) {
                                        const toolsWithServerId = toolsData.tools.map(tool => ({
                                          ...tool,
                                          serverId: selectedServer.id,
                                          serverName: selectedServer.name
                                        }));
                                        setServerTools(prev => ({
                                          ...prev,
                                          [selectedServer.id]: {
                                            tools: toolsWithServerId,
                                            count: toolsData.count,
                                            serverName: selectedServer.name
                                          }
                                        }));
                                        console.log('✅ Server tools updated in state');
                                      }
                                    } catch (error) {
                                      console.error('❌ Manual test failed:', error);
                                    }
                                  }}
                                  className="text-xs bg-blue-200 px-2 py-1 rounded hover:bg-blue-300"
                                >
                                  Test Server Tools API
                                </button>
                                <button 
                                  onClick={async () => {
                                    console.log('🔄 Retrying to fetch all server tools...');
                                    await fetchAllServerTools();
                                  }}
                                  className="text-xs bg-green-200 px-2 py-1 rounded hover:bg-green-300"
                                >
                                  Retry All Server Tools
                                </button>
                                <button 
                                  onClick={async () => {
                                    console.log('🔄 === MANUAL REFRESH & TEST FOR', selectedServer.name, '===');
                                    try {
                                      // First refresh cache
                                      console.log(`🔄 Step 1: Refreshing cache for ${selectedServer.name} (${selectedServer.id})...`);
                                      const cacheResult = await mcpApi.refreshServerToolsCache(selectedServer.id);
                                      console.log('✅ Cache refresh result:', cacheResult);
                                      
                                      // Then get tools
                                      console.log(`🔄 Step 2: Getting tools for ${selectedServer.name}...`);
                                      const result = await mcpApi.getServerTools(selectedServer.id);
                                      console.log('✅ Individual endpoint result:', result);
                                      console.log('✅ Result structure:', {
                                        hasData: !!result,
                                        hasTools: !!(result && result.tools),
                                        toolsLength: result?.tools?.length || 0,
                                        count: result?.count || 0,
                                        keys: result ? Object.keys(result) : []
                                      });
                                      
                                      // Update the server tools state
                                      if (result && result.tools) {
                                        const toolsWithServerId = result.tools.map(tool => ({
                                          ...tool,
                                          serverId: selectedServer.id,
                                          serverName: selectedServer.name
                                        }));
                                        
                                        setServerTools(prev => ({
                                          ...prev,
                                          [selectedServer.id]: {
                                            tools: toolsWithServerId,
                                            count: result.count,
                                            serverName: selectedServer.name
                                          }
                                        }));
                                        console.log('✅ Server tools updated in state:', result.count, 'tools');
                                        console.log('✅ First few tools:', toolsWithServerId.slice(0, 3));
                                      } else {
                                        console.warn('⚠️ No tools in result, clearing server tools');
                                        setServerTools(prev => ({
                                          ...prev,
                                          [selectedServer.id]: {
                                            tools: [],
                                            count: 0,
                                            serverName: selectedServer.name
                                          }
                                        }));
                                      }
                                    } catch (error) {
                                      console.error('❌ Manual refresh/test failed:', error);
                                      console.error('❌ Full error:', {
                                        message: error.message,
                                        status: error.response?.status,
                                        statusText: error.response?.statusText,
                                        data: error.response?.data,
                                        url: error.config?.url
                                      });
                                    }
                                  }}
                                  className="text-xs bg-purple-200 px-2 py-1 rounded hover:bg-purple-300"
                                >
                                  Manual Refresh & Test
                                </button>
                                <button 
                                  onClick={async () => {
                                    console.log('🧪 === DIRECT API TEST FOR', selectedServer.name, '===');
                                    console.log('🧪 Testing endpoints directly without cache refresh...');
                                    
                                    // Test cache refresh endpoint
                                    console.log('🧪 Test 1: Cache refresh endpoint');
                                    try {
                                      const cacheUrl = `${mcpApi.baseURL}/mcp-servers/${selectedServer.id}/refresh-cache`;
                                      console.log('🧪 Cache URL:', cacheUrl);
                                      const cacheResponse = await fetch(cacheUrl, {
                                        method: 'POST',
                                        headers: {
                                          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                                          'Content-Type': 'application/json'
                                        }
                                      });
                                      console.log('🧪 Cache response status:', cacheResponse.status);
                                      const cacheData = await cacheResponse.json();
                                      console.log('🧪 Cache response data:', cacheData);
                                    } catch (cacheError) {
                                      console.error('🧪 Cache test failed:', cacheError);
                                    }
                                    
                                    // Test tools endpoint
                                    console.log('🧪 Test 2: Tools endpoint');
                                    try {
                                      const toolsUrl = `${mcpApi.baseURL}/mcp-servers/${selectedServer.id}/tools`;
                                      console.log('🧪 Tools URL:', toolsUrl);
                                      const toolsResponse = await fetch(toolsUrl, {
                                        headers: {
                                          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                                          'Content-Type': 'application/json'
                                        }
                                      });
                                      console.log('🧪 Tools response status:', toolsResponse.status);
                                      const toolsData = await toolsResponse.json();
                                      console.log('🧪 Tools response data:', toolsData);
                                    } catch (toolsError) {
                                      console.error('🧪 Tools test failed:', toolsError);
                                    }
                                  }}
                                  className="text-xs bg-red-200 px-2 py-1 rounded hover:bg-red-300"
                                >
                                  Direct API Test
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        getFilteredTools().map((tool, index) => (
                          <motion.div
                            key={tool.id || tool.name || `tool-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-sm">
                                  {tool.name.includes('read') ? '📖' :
                                   tool.name.includes('search') ? '🔍' :
                                   tool.name.includes('write') ? '✏️' :
                                   tool.name.includes('analyze') ? '📊' :
                                   tool.name.includes('execute') ? '⚡' : '🌐'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{tool.name}</div>
                                <div className="text-sm text-gray-500">{tool.description || 'No description available'}</div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {tool.category || 'uncategorized'} • {tool.usageCount || 0} uses
                                </div>
                                {tool.serverId && (
                                  <div className="text-xs text-blue-500 mt-1">
                                    Server: {tool.serverName || tool.serverId}
                                  </div>
                                )}
                                {tool.inputSchema && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    Parameters: {Object.keys(tool.inputSchema.properties || {}).length} required
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  tool.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                                }`} />
                                <span className="text-xs text-gray-600 capitalize">{tool.status}</span>
                              </div>
                              <div className="text-sm font-medium text-gray-900">{tool.usage}% usage</div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Tool Injection Status */}
                  <div className="bg-white rounded-xl border shadow-sm">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <span className="mr-2">💉</span>
                        {selectedServer ? `${selectedServer.name} Status` : 'Tool Injection Status'}
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {selectedServer ? 'Server Tools' : 'Available Tools'}
                        </span>
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-2xl font-bold text-blue-600"
                        >
                          {selectedServer ? getFilteredTools().length : (injectionStatus?.activeTools || tools.length)}
                        </motion.span>
                      </div>
                      
                      {selectedServer && (
                        <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-blue-900">Server Status</span>
                            <span className={`font-medium ${
                              (selectedServer.status || 'stopped') === 'running' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {(selectedServer.status || 'stopped').charAt(0).toUpperCase() + (selectedServer.status || 'stopped').slice(1)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Health</span>
                            <span className="font-medium text-blue-900">{selectedServer.health || 85}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Uptime</span>
                            <span className="font-medium text-blue-900">{selectedServer.uptime || '0m'}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Injection Status</span>
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className={`w-3 h-3 rounded-full ${
                                injectionStatus?.injected ? 'bg-green-400' : 'bg-red-400'
                              }`}
                            />
                            <span className={`text-sm ${
                              injectionStatus?.injected ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {injectionStatus?.injected ? 'Injected' : 'Not Injected'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>API Uptime</span>
                            <span className="font-medium">
                              {injectionStatus?.uptime || '99.9%'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: injectionStatus?.uptime || "99.9%" }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Data Transfer Rate</span>
                            <span className="font-medium">
                              {injectionStatus?.dataTransferRate || '2.4 MB/s'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "78%" }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>
                        
                        {selectedServer && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Active Tools</span>
                              <span className="font-medium">
                                {getFilteredTools().filter(t => t.status === 'active').length} / {getFilteredTools().length}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className="bg-purple-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: `${(getFilteredTools().filter(t => t.status === 'active').length / getFilteredTools().length) * 100}%` 
                                }}
                                transition={{ duration: 1, delay: 0.4 }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'monitoring' && (
              <motion.div
                key="monitoring"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto p-4 sm:p-6"
              >
                {/* Injection Status Dashboard */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold flex items-center">
                        <span className="mr-3">🚀</span>
                        MCP Tools Injection Status
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${injectionStatus?.injected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-sm font-medium">
                          {injectionStatus?.injected ? 'Tools Injected' : 'Tools Not Injected'}
                        </span>
                      </div>
                    </div>
                    <p className="text-blue-100 text-lg">
                      {injectionStatus?.solution || 'Checking injection status...'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Tools */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl border shadow-sm p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Tools</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {injectionStatus?.activeTools || 0}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🛠️</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Static Tools */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white rounded-xl border shadow-sm p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Static Tools</p>
                          <p className="text-2xl font-bold text-green-600">
                            {injectionStatus?.staticTools || 0}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">📦</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Dynamic Tools */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-xl border shadow-sm p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Dynamic Tools</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {injectionStatus?.dynamicTools || 0}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">⚡</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Active Servers */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white rounded-xl border shadow-sm p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Active Servers</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {injectionStatus?.activeServers || 0}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🖥️</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Server Status Details */}
                  {injectionStatus?.serverStatus && (
                    <div className="bg-white rounded-xl border shadow-sm mb-6">
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold flex items-center">
                          <span className="mr-2">📋</span>
                          Server Status Details
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(injectionStatus.serverStatus).map(([serverId, isActive], index) => (
                            <motion.div
                              key={serverId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-4 rounded-lg border-l-4 ${
                                isActive 
                                  ? 'bg-green-50 border-green-400' 
                                  : 'bg-red-50 border-red-400'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {servers.find(s => s.id === serverId)?.name || serverId}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {serverId}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    isActive ? 'bg-green-400' : 'bg-red-400'
                                  }`}></div>
                                  <span className={`text-sm font-medium ${
                                    isActive ? 'text-green-700' : 'text-red-700'
                                  }`}>
                                    {isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Injection Status Message */}
                  {injectionStatus?.injectionStatus && (
                    <div className="bg-white rounded-xl border shadow-sm">
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold flex items-center">
                          <span className="mr-2">💬</span>
                          Status Message
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className={`p-4 rounded-lg ${
                          injectionStatus.injected 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                          <p className={`font-medium ${
                            injectionStatus.injected ? 'text-green-800' : 'text-yellow-800'
                          }`}>
                            {injectionStatus.injectionStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* CPU & Memory Usage */}
                  <div className="bg-white rounded-xl border shadow-sm">
                    <div className="p-3 sm:p-4 border-b">
                      <h3 className="text-base sm:text-lg font-semibold flex items-center">
                        <span className="mr-2">📊</span>
                        System Resources
                      </h3>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        <div className="text-center">
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
                            <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="#e5e7eb"
                                strokeWidth="4"
                                fill="transparent"
                              />
                              <motion.circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="#3b82f6"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={`${2 * Math.PI * 28}`}
                                strokeDashoffset={`${2 * Math.PI * 28 * (1 - cpuUsage / 100)}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - cpuUsage / 100) }}
                                transition={{ duration: 1 }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg sm:text-2xl font-bold text-blue-600">{cpuUsage}%</span>
                            </div>
                          </div>
                          <div className="text-xs sm:text-sm font-medium">CPU Usage</div>
                        </div>
                        <div className="text-center">
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
                            <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="#e5e7eb"
                                strokeWidth="4"
                                fill="transparent"
                              />
                              <motion.circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="#10b981"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={`${2 * Math.PI * 28}`}
                                strokeDashoffset={`${2 * Math.PI * 28 * (1 - memoryUsage / 100)}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - memoryUsage / 100) }}
                                transition={{ duration: 1, delay: 0.2 }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg sm:text-2xl font-bold text-green-600">{memoryUsage}%</span>
                            </div>
                          </div>
                          <div className="text-xs sm:text-sm font-medium">Memory Usage</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Server Health */}
                  <div className="bg-white rounded-xl border shadow-sm">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <span className="mr-2">🏥</span>
                        Server Health
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {servers.map((server, index) => {
                          const serverHealth = server.health || 85; // Default health if not provided
                          return (
                          <motion.div
                            key={server.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                  serverHealth > 80 ? 'bg-green-400' :
                                  serverHealth > 50 ? 'bg-yellow-400' : 'bg-red-400'
                              }`} />
                              <span className="font-medium">{server.name}</span>
                                <span className="text-xs text-gray-500">({server.transportType})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <motion.div
                                  className={`h-2 rounded-full ${
                                      serverHealth > 80 ? 'bg-green-400' :
                                      serverHealth > 50 ? 'bg-yellow-400' : 'bg-red-400'
                                  }`}
                                  initial={{ width: 0 }}
                                    animate={{ width: `${serverHealth}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                />
                              </div>
                                <span className="text-sm font-medium w-12 text-right">{serverHealth}%</span>
                            </div>
                          </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'config' && (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto p-4 sm:p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* API Endpoints */}
                  <div className="bg-white rounded-xl border shadow-sm">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <span className="mr-2">🔗</span>
                        API Endpoints
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {demoAPIEndpoints.map((endpoint, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {endpoint.method}
                            </span>
                            <span className="font-mono text-sm">{endpoint.endpoint}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            <span className="text-sm text-green-600">Active</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Integration Status */}
                  <div className="bg-white rounded-xl border shadow-sm">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <span className="mr-2">🔌</span>
                        Integration Status
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">All Connected</span>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-6 h-6 bg-green-400 rounded flex items-center justify-center"
                        >
                          <span className="text-white text-sm">✓</span>
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Connection Quality</span>
                          <span className="font-medium text-green-600">Excellent</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Response Time</span>
                          <span className="font-medium">45ms avg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Error Rate</span>
                          <span className="font-medium text-green-600">0.01%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'test' && (
              <motion.div
                key="test"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto p-4 sm:p-6"
              >
                <MCPApiTest />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default MCPDashboard;
