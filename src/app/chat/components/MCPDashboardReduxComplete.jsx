import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  selectMCPServers,
  selectMCPTools,
  selectServerTools,
  selectInjectionStatus,
  selectSelectedServer,
  selectShowAllTools,
  selectMCPLoading,
  selectMCPErrors,
  selectFilteredTools,
  selectToolsCountForServer,
  selectServerStatus,
  selectShowAddServerModal,
  fetchMCPServers,
  fetchMCPTools,
  fetchInjectionStatus,
  fetchServerTools,
  startMCPServer,
  stopMCPServer,
  addMCPServer,
  setSelectedServer,
  toggleShowAllTools,
  clearSelectedServer,
  clearErrors,
  refreshServerTools,
  setShowAddServerModal,
} from '../../../redux/chat/mcpSlice';

const MCPDashboardReduxComplete = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('servers');
  const [showAddServerForm, setShowAddServerForm] = useState(false);
  const [serverForm, setServerForm] = useState({
    id: '',
    name: '',
    description: '',
    transportType: 'STDIO',
    enabled: true,
    configuration: {}
  });
  const [lastServerClickTime, setLastServerClickTime] = useState(0);
  
  // Redux selectors
  const servers = useSelector(selectMCPServers);
  const tools = useSelector(selectMCPTools);
  const serverTools = useSelector(selectServerTools);
  const injectionStatus = useSelector(selectInjectionStatus);
  const selectedServer = useSelector(selectSelectedServer);
  const showAllTools = useSelector(selectShowAllTools);
  const loading = useSelector(selectMCPLoading);
  const errors = useSelector(selectMCPErrors);
  const filteredTools = useSelector(selectFilteredTools);
  const showAddServerModal = useSelector(selectShowAddServerModal);

  // Fetch initial data
  useEffect(() => {
    if (isOpen) {
      console.log('🚀 MCP Dashboard opened, fetching initial data...');
      dispatch(fetchMCPServers());
      dispatch(fetchMCPTools());
      dispatch(fetchInjectionStatus());
    }
  }, [dispatch, isOpen]);

  // Fetch server tools when servers are loaded (only once)
  useEffect(() => {
    if (servers.length > 0) {
      console.log('🚀 Fetching tools for servers:', servers.map(s => s.name));
      servers.forEach(server => {
        // Only fetch if we don't already have tools for this server
        if (!serverTools[server.id] || serverTools[server.id].count === 0) {
          console.log(`🔄 Fetching tools for server: ${server.name} (${server.id})`);
          dispatch(fetchServerTools(server.id));
        } else {
          console.log(`✅ Server ${server.name} already has ${serverTools[server.id].count} tools, skipping fetch`);
        }
      });
    }
  }, [dispatch, servers, serverTools]);

  const handleServerSelect = (server) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastServerClickTime;
    
    // Debounce rapid clicks (less than 1 second apart)
    if (timeSinceLastClick < 1000) {
      console.log(`⏳ Debouncing server selection for ${server.name} (${timeSinceLastClick}ms since last click)`);
      return;
    }
    
    setLastServerClickTime(now);
    console.log(`🔍 Selecting server: ${server.name} (${server.id})`);
    dispatch(setSelectedServer(server));
    // Automatically switch to Tools tab to show server tools
    setActiveTab('tools');
    
    // Only fetch tools if we don't have them AND they're not currently loading
    const serverToolData = serverTools[server.id];
    if (!serverToolData || (serverToolData.count === 0 && !serverToolData.loading)) {
      console.log(`🔄 Fetching tools for selected server: ${server.name}`);
      dispatch(fetchServerTools(server.id));
    } else if (serverToolData.loading) {
      console.log(`⏳ Server ${server.name} tools are already being fetched...`);
    } else {
      console.log(`✅ Server ${server.name} already has ${serverToolData.count} tools`);
    }
  };

  const handleShowAllTools = () => {
    dispatch(toggleShowAllTools());
  };

  const handleServerAction = async (serverId, action) => {
    if (action === 'start') {
      dispatch(startMCPServer(serverId));
    } else if (action === 'stop') {
      dispatch(stopMCPServer(serverId));
    }
  };

  const getServerStatusIcon = (server) => {
    const status = selectServerStatus({ mcp: { injectionStatus, serverTools } }, server);
    switch (status) {
      case 'running': return '🟢';
      case 'stopped': return '🔴';
      case 'starting': return '🟡';
      case 'stopping': return '🟠';
      default: return '⚪';
    }
  };

  const getServerStatusColor = (server) => {
    const status = selectServerStatus({ mcp: { injectionStatus, serverTools } }, server);
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      case 'starting': return 'bg-yellow-100 text-yellow-800';
      case 'stopping': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServerHealth = (server) => {
    const status = selectServerStatus({ mcp: { injectionStatus, serverTools } }, server);
    return status === 'running' ? 95 : 45;
  };

  const handleAddServer = () => {
    setShowAddServerForm(true);
  };

  const handleServerFormChange = (field, value) => {
    setServerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfigurationChange = (field, value) => {
    setServerForm(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [field]: value
      }
    }));
  };

  const handleSubmitServer = async (e) => {
    e.preventDefault();
    
    // Generate ID if not provided
    const serverData = {
      ...serverForm,
      id: serverForm.id || `server-${Date.now()}`
    };

    try {
      await dispatch(addMCPServer(serverData));
      // Reset form
      setServerForm({
        id: '',
        name: '',
        description: '',
        transportType: 'STDIO',
        enabled: true,
        configuration: {}
      });
      setShowAddServerForm(false);
      // Refresh servers list
      dispatch(fetchMCPServers());
    } catch (error) {
      console.error('Failed to add server:', error);
    }
  };

  const getTransportTypeConfig = (transportType) => {
    switch (transportType) {
      case 'STDIO':
        return {
          command: { label: 'Command', placeholder: 'python', type: 'text' },
          args: { label: 'Arguments', placeholder: '["server.py"]', type: 'text' },
          workingDirectory: { label: 'Working Directory', placeholder: '/path/to/server', type: 'text' }
        };
      case 'SSE':
        return {
          baseUrl: { label: 'Base URL', placeholder: 'http://localhost:8080', type: 'text' }
        };
      case 'SOCKET':
        return {
          wsUrl: { label: 'WebSocket URL', placeholder: 'ws://localhost:8080/mcp', type: 'text' }
        };
      case 'HTTP':
        return {
          baseUrl: { label: 'Base URL', placeholder: 'https://api.example.com', type: 'text' }
        };
      default:
        return {};
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'servers', label: 'Servers', shortLabel: 'Servers', icon: '🖥️' },
    { id: 'tools', label: 'Tools', shortLabel: 'Tools', icon: '🛠️' },
    { id: 'monitoring', label: 'Monitoring', shortLabel: 'Monitor', icon: '📊' },
    { id: 'config', label: 'Configuration', shortLabel: 'Config', icon: '⚙️' },
    { id: 'api-test', label: 'API Test', shortLabel: 'Test', icon: '🧪' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 sm:bg-white flex items-center justify-center z-50 p-2 sm:p-0 sm:items-stretch"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white shadow-2xl w-full h-full max-w-7xl max-h-full flex flex-col rounded-lg sm:rounded-none sm:shadow-none sm:w-full sm:h-full sm:max-w-full sm:max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold truncate">MCP Dashboard</h2>
                <p className="text-blue-100 mt-1 text-sm sm:text-base truncate">
                  Manage Model Context Protocol servers and tools
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors ml-2 flex-shrink-0"
              >
                <span className="text-xl sm:text-2xl">×</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b bg-gray-50">
            <div className="flex space-x-1 p-1 sm:p-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1 sm:mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {/* Servers Tab */}
              {activeTab === 'servers' && (
                <motion.div
                  key="servers"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0"
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold flex items-center">
                        <span className="mr-2">🖥️</span>
                        Active Servers ({servers.length})
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            dispatch(fetchMCPServers());
                            dispatch(fetchMCPTools());
                            dispatch(fetchInjectionStatus());
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        >
                          🔄 Refresh
                        </button>
                      </div>
                    </div>
                    
                    {/* Error Display */}
                    {errors.servers && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-red-500 mr-2">❌</span>
                          <div>
                            <h4 className="font-medium text-red-800">Server Loading Error</h4>
                            <p className="text-red-600 text-sm mt-1">{errors.servers}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {loading.servers ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading servers...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Side - Servers Table */}
                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                          <div className="overflow-x-auto max-h-96 overflow-y-auto min-w-0">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-b">
                                <tr>
                                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[200px]">SERVER</th>
                                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 hidden sm:table-cell">TYPE</th>
                                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">STATUS</th>
                                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">TOOLS</th>
                                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 hidden md:table-cell">HEALTH</th>
                                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[120px]">ACTIONS</th>
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
                                      <div className="flex items-center space-x-3">
                                        <motion.div
                                          animate={getServerStatusIcon(server) === '🟢' ? { scale: [1, 1.1, 1] } : {}}
                                          transition={{ duration: 2, repeat: Infinity }}
                                          className="text-xl"
                                        >
                                          {getServerStatusIcon(server)}
                                        </motion.div>
                                        <div>
                                          <div className="font-medium text-gray-900">{server.name}</div>
                                          <div className="text-sm text-gray-500">{server.description}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {server.transportType}
                                      </span>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getServerStatusColor(server)}`}>
                                        <span className="mr-2">{getServerStatusIcon(server)}</span>
                                        {selectServerStatus({ mcp: { injectionStatus, serverTools } }, server)}
                                      </div>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                                      <div className="flex items-center space-x-2">
                                        {loading.serverTools ? (
                                          <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                            <span className="text-sm text-gray-500">Loading...</span>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`⚡ Quick refresh for ${server.name}`);
                                                dispatch(refreshServerTools(server.id));
                                                dispatch(fetchServerTools(server.id));
                                              }}
                                              className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                            >
                                              Quick Refresh
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <span className="text-lg font-semibold text-blue-600">
                                              {selectToolsCountForServer({ mcp: { serverTools } }, server.id)}
                                            </span>
                                            <span className="text-sm text-gray-500">tools</span>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                          <motion.div
                                            className="bg-green-500 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${getServerHealth(server)}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                          />
                                        </div>
                                        <span className="text-sm text-gray-600">{getServerHealth(server)}%</span>
                                      </div>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleServerAction(server.id, 'start');
                                          }}
                                          className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                                          disabled={loading.serverTools}
                                        >
                                          Start
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleServerAction(server.id, 'stop');
                                          }}
                                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                                          disabled={loading.serverTools}
                                        >
                                          Stop
                                        </button>
                                      </div>
                                    </td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Right Side - Add New Server Form */}
                        <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
                          <div className="flex items-center mb-4">
                            <span className="mr-2 sm:mr-3 text-xl sm:text-2xl">➕</span>
                            <h3 className="text-base sm:text-lg font-semibold">Add New Server</h3>
                          </div>
                          
                          {!showAddServerForm ? (
                            <button
                              onClick={handleAddServer}
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                            >
                              ➕ Add New MCP Server
                            </button>
                          ) : (
                            <form onSubmit={handleSubmitServer} className="space-y-3 sm:space-y-4">
                              {/* Server ID */}
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Server ID</label>
                                <input
                                  type="text"
                                  value={serverForm.id}
                                  onChange={(e) => handleServerFormChange('id', e.target.value)}
                                  placeholder="my-python-mcp-server"
                                  className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              {/* Server Name */}
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Server Name</label>
                                <input
                                  type="text"
                                  value={serverForm.name}
                                  onChange={(e) => handleServerFormChange('name', e.target.value)}
                                  placeholder="Python Coding Assistant MCP Server"
                                  className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                              </div>

                              {/* Description */}
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Description</label>
                                <input
                                  type="text"
                                  value={serverForm.description}
                                  onChange={(e) => handleServerFormChange('description', e.target.value)}
                                  placeholder="FastMCP server with coding assistant tools"
                                  className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              {/* Transport Type */}
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Transport Type</label>
                                <select
                                  value={serverForm.transportType}
                                  onChange={(e) => {
                                    handleServerFormChange('transportType', e.target.value);
                                    // Reset configuration when transport type changes
                                    setServerForm(prev => ({
                                      ...prev,
                                      transportType: e.target.value,
                                      configuration: {}
                                    }));
                                  }}
                                  className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="STDIO">STDIO (Python/Node.js)</option>
                                  <option value="SSE">Server-Sent Events (SSE)</option>
                                  <option value="SOCKET">WebSocket</option>
                                  <option value="HTTP">HTTP REST API</option>
                                </select>
                              </div>

                              {/* Configuration based on transport type */}
                              {Object.entries(getTransportTypeConfig(serverForm.transportType)).map(([key, config]) => (
                                <div key={key}>
                                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{config.label}</label>
                                  <input
                                    type={config.type}
                                    value={serverForm.configuration[key] || ''}
                                    onChange={(e) => handleConfigurationChange(key, e.target.value)}
                                    placeholder={config.placeholder}
                                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              ))}

                              {/* Enabled */}
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="enabled"
                                  checked={serverForm.enabled}
                                  onChange={(e) => handleServerFormChange('enabled', e.target.checked)}
                                  className="mr-2"
                                />
                                <label htmlFor="enabled" className="text-xs sm:text-sm font-medium text-gray-700">Enable server</label>
                              </div>

                              {/* Error display */}
                              {errors.addServer && (
                                <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-red-600 text-xs sm:text-sm">{errors.addServer}</p>
                                </div>
                              )}

                              {/* Form buttons */}
                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <button
                                  type="submit"
                                  disabled={loading.addServer}
                                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
                                >
                                  {loading.addServer ? 'Adding...' : 'Add Server'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowAddServerForm(false);
                                    setServerForm({
                                      id: '',
                                      name: '',
                                      description: '',
                                      transportType: 'STDIO',
                                      enabled: true,
                                      configuration: {}
                                    });
                                  }}
                                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tools Tab */}
              {activeTab === 'tools' && (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0"
                >
                  {selectedServer && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🌐</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-blue-900">{selectedServer.name} Tools</h3>
                            <p className="text-blue-700">
                              {filteredTools.length} tools available • {selectedServer.transportType} server
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={handleShowAllTools}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                          {showAllTools ? `Show ${selectedServer?.name} Tools` : 'Show All Tools'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {!selectedServer && !showAllTools && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">👆</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-yellow-900">Select a Server to View Tools</h3>
                          <p className="text-yellow-700">
                            Click on any server in the Servers tab to view its specific tools, or toggle "Show All Tools" to see all available tools.
                          </p>
                        </div>
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
                            {showAllTools 
                              ? `All Tools (${Object.keys(serverTools).length} servers)` 
                              : (selectedServer ? `${selectedServer.name} Tools` : 'Available Tools')
                            } ({filteredTools.length})
                          </h3>
                          <div className="flex space-x-2">
                            {!selectedServer && !showAllTools && (
                              <button
                                onClick={() => dispatch(toggleShowAllTools())}
                                className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                              >
                                🌐 Show All Tools
                              </button>
                            )}
                            <button
                              onClick={() => {
                                dispatch(fetchMCPTools());
                                servers.forEach(server => dispatch(fetchServerTools(server.id)));
                              }}
                              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                            >
                              🔄 Refresh
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 max-h-96 overflow-y-auto">
                        {loading.tools || loading.serverTools ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-500 text-sm">Loading tools...</p>
                          </div>
                        ) : filteredTools.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-2">🔍</div>
                            <p className="text-gray-500">No tools available</p>
                            {selectedServer && !showAllTools && (
                              <p className="text-gray-400 text-sm mt-1">
                                Try switching to "Show All Tools" or check server status
                              </p>
                            )}
                          </div>
                        ) : (
                          filteredTools.map((tool, index) => (
                            <motion.div
                              key={tool.id || tool.name || `tool-${index}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-3 border border-gray-200 rounded-lg mb-3 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate">{tool.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{tool.description}</p>
                                  {tool.serverName && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                      📡 {tool.serverName}
                                    </span>
                                  )}
                                </div>
                                <div className="ml-2 text-xs text-gray-500 flex flex-col items-end">
                                  <span className={`px-2 py-1 rounded ${
                                    tool.serverId 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {tool.serverId ? '🖥️ Server' : '🌐 Global'}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Tools Summary */}
                    <div className="bg-white rounded-xl border shadow-sm">
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold flex items-center">
                          <span className="mr-2">📊</span>
                          Tools Summary
                        </h3>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-blue-600">{tools.length}</div>
                            <div className="text-sm text-blue-700">Total Tools</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-600">{filteredTools.length}</div>
                            <div className="text-sm text-green-700">Available</div>
                          </div>
                        </div>
                        
                        {servers.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Server Tools Breakdown</h4>
                            <div className="space-y-2">
                              {servers.map(server => (
                                <div key={server.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <span className="text-sm font-medium">{server.name}</span>
                                  <span className="text-sm text-gray-600">
                                    {selectToolsCountForServer({ mcp: { serverTools } }, server.id)} tools
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Monitoring Tab */}
              {activeTab === 'monitoring' && (
                <motion.div
                  key="monitoring"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold flex items-center mb-4">
                      <span className="mr-2">📊</span>
                      MCP Monitoring Dashboard
                    </h3>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                      {/* Total Tools */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100 text-sm">Total Tools</p>
                            <p className="text-2xl font-bold">{tools.length}</p>
                          </div>
                          <div className="text-3xl opacity-80">🛠️</div>
                        </div>
                      </motion.div>

                      {/* Static Tools */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100 text-sm">Static Tools</p>
                            <p className="text-2xl font-bold">
                              {injectionStatus?.staticTools || 0}
                            </p>
                          </div>
                          <div className="text-3xl opacity-80">📋</div>
                        </div>
                      </motion.div>

                      {/* Dynamic Tools */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-sm">Dynamic Tools</p>
                            <p className="text-2xl font-bold">
                              {injectionStatus?.dynamicTools || 0}
                            </p>
                          </div>
                          <div className="text-3xl opacity-80">⚡</div>
                        </div>
                      </motion.div>

                      {/* Active Servers */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-100 text-sm">Active Servers</p>
                            <p className="text-2xl font-bold">{servers.length}</p>
                          </div>
                          <div className="text-3xl opacity-80">🖥️</div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Server Status Grid */}
                    {injectionStatus?.serverStatus && (
                      <div className="bg-white rounded-xl border shadow-sm p-6">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <span className="mr-2">🖥️</span>
                          Server Status Overview
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(injectionStatus.serverStatus).map(([serverId, isActive], index) => (
                            <motion.div
                              key={serverId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-4 rounded-lg border-2 ${
                                isActive 
                                  ? 'border-green-200 bg-green-50' 
                                  : 'border-red-200 bg-red-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-gray-900">{serverId}</h5>
                                  <p className={`text-sm ${
                                    isActive ? 'text-green-700' : 'text-red-700'
                                  }`}>
                                    {isActive ? 'Active & Running' : 'Inactive'}
                                  </p>
                                </div>
                                <div className={`w-4 h-4 rounded-full ${
                                  isActive ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tool Details */}
                    {injectionStatus?.tools && (
                      <div className="bg-white rounded-xl border shadow-sm p-6 mt-6">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <span className="mr-2">🛠️</span>
                          Tool Injection Details
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(injectionStatus.tools).map(([toolName, isInjected], index) => (
                            <motion.div
                              key={toolName}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                isInjected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <span className="font-medium text-gray-900">{toolName}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isInjected 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {isInjected ? 'Injected' : 'Not Injected'}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Config Tab */}
              {activeTab === 'config' && (
                <motion.div
                  key="config"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0"
                >
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">⚙️</div>
                    <p className="text-gray-500">Configuration panel coming soon...</p>
                  </div>
                </motion.div>
              )}

              {/* API Test Tab */}
              {activeTab === 'api-test' && (
                <motion.div
                  key="api-test"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0"
                >
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🧪</div>
                    <p className="text-gray-500">API testing panel coming soon...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MCPDashboardReduxComplete;