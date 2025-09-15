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
  fetchMCPServers,
  fetchMCPTools,
  fetchInjectionStatus,
  fetchServerTools,
  startMCPServer,
  stopMCPServer,
  setSelectedServer,
  toggleShowAllTools,
  clearSelectedServer,
  clearErrors,
  refreshServerTools,
} from '../../../redux/chat/mcpSlice';

const MCPDashboardReduxComplete = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('servers');
  
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
    dispatch(setSelectedServer(server));
    setActiveTab('tools');
  };

  const handleServerAction = async (serverId, action) => {
    if (action === 'start') {
      dispatch(startMCPServer(serverId));
    } else if (action === 'stop') {
      dispatch(stopMCPServer(serverId));
    }
  };

  const handleShowAllTools = () => {
    dispatch(toggleShowAllTools());
  };

  const getServerStatusColor = (server) => {
    const status = selectServerStatus({ mcp: { injectionStatus, serverTools } }, server);
    switch (status) {
      case 'running': return 'text-green-600 bg-green-50';
      case 'stopped': return 'text-red-600 bg-red-50';
      case 'starting': return 'text-yellow-600 bg-yellow-50';
      case 'stopping': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
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

  const getServerHealth = (server) => {
    const status = selectServerStatus({ mcp: { injectionStatus, serverTools } }, server);
    return status === 'running' ? 95 : 45;
  };

  if (!isOpen) return null;

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
              {[
                { id: 'servers', label: 'Servers', icon: '🖥️', shortLabel: 'Servers' },
                { id: 'tools', label: 'Tools', icon: '🛠️', shortLabel: 'Tools' },
                { id: 'monitoring', label: 'Monitoring', icon: '📊', shortLabel: 'Monitor' },
                { id: 'config', label: 'Config', icon: '⚙️', shortLabel: 'Config' },
                { id: 'api-test', label: 'API Test', icon: '🧪', shortLabel: 'Test' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
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
                            console.log('🔄 Refreshing all caches...');
                            dispatch(fetchMCPServers());
                            dispatch(fetchMCPTools());
                            dispatch(fetchInjectionStatus());
                            if (servers.length > 0) {
                              servers.forEach(server => {
                                dispatch(refreshServerTools(server.id));
                                dispatch(fetchServerTools(server.id));
                              });
                            }
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                        >
                          🔄 Refresh All Caches
                        </button>
                        <button
                          onClick={() => {
                            console.log('🧪 Testing individual endpoints...');
                            servers.forEach(server => {
                              console.log(`🧪 Testing server: ${server.name} (${server.id})`);
                              dispatch(fetchServerTools(server.id));
                            });
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                          🧪 Test Individual Endpoints
                        </button>
                        <button
                          onClick={() => {
                            console.log('🔍 Manual server fetch test...');
                            dispatch(fetchMCPServers());
                          }}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
                        >
                          🔍 Manual Fetch Servers
                        </button>
                        <button
                          onClick={() => {
                            console.log('🔄 Force refresh all server tools (bypass cache)...');
                            servers.forEach(server => {
                              console.log(`🔄 Force refreshing tools for server: ${server.name} (${server.id})`);
                              // Clear existing tools first to force refresh
                              dispatch(refreshServerTools(server.id));
                              dispatch(fetchServerTools(server.id));
                            });
                          }}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                        >
                          🔄 Force Refresh All Tools
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
                    )}
                  </div>

                  {/* Add New Server */}
                  <div className="bg-white rounded-xl border shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <span className="mr-3 text-2xl">➕</span>
                      <h3 className="text-lg font-semibold">Add New Server</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Server Name</label>
                        <input
                          type="text"
                          placeholder="Enter server name..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                        Add Server
                      </button>
                    </div>
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
                          {showAllTools ? 'Show Server Tools' : 'Show All Tools'}
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
                            {showAllTools ? 'All Tools (from individual servers)' : (selectedServer ? `${selectedServer.name} Tools` : 'Available Tools')} ({filteredTools.length})
                          </h3>
                          <div className="flex items-center space-x-3">
                            {selectedServer && showAllTools && (
                              <button
                                onClick={() => dispatch(toggleShowAllTools())}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                Show Server Tools
                              </button>
                            )}
                            {selectedServer && !showAllTools && (
                              <button
                                onClick={handleShowAllTools}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                Show All Tools
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                        {loading.serverTools ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-500">Loading tools...</p>
                          </div>
                        ) : filteredTools.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-2">
                              {selectedServer ? '🔍' : '🛠️'}
                            </div>
                            <p className="text-gray-500">
                              {selectedServer 
                                ? `No tools found for ${selectedServer.name}. The individual server tools endpoint may not be working properly.` 
                                : 'Select a server to view its tools'
                              }
                            </p>
                            {selectedServer && (
                              <div className="mt-4 space-y-2">
                                <button
                                  onClick={() => {
                                    console.log(`🔄 Manually refreshing tools for server: ${selectedServer.id}`);
                                    dispatch(refreshServerTools(selectedServer.id));
                                    dispatch(fetchServerTools(selectedServer.id));
                                  }}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm mr-2"
                                >
                                  🔄 Refresh This Server's Tools
                                </button>
                                <button
                                  onClick={() => {
                                    console.log(`🧪 DIRECT API TEST for server: ${selectedServer.id}`);
                                    dispatch(fetchServerTools(selectedServer.id));
                                  }}
                                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm mr-2"
                                >
                                  🧪 Test Without Cache Refresh
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          filteredTools.map((tool, index) => (
                            <motion.div
                              key={tool.id || tool.name || `tool-${index}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{tool.name}</h4>
                                <p className="text-sm text-gray-600">{tool.description}</p>
                                {tool.serverName && (
                                  <p className="text-xs text-blue-600 mt-1">From: {tool.serverName}</p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {tool.status || 'active'}
                                </span>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Selected Server Details */}
                    <div className="bg-white rounded-xl border shadow-sm">
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold flex items-center">
                          <span className="mr-2">📋</span>
                          Server Details
                        </h3>
                      </div>
                      <div className="p-4 space-y-4">
                        {selectedServer ? (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">Server Name</label>
                                <p className="text-gray-900">{selectedServer.name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Status</label>
                                <p className={`font-medium ${getServerStatusColor(selectedServer)}`}>
                                  {selectServerStatus({ mcp: { injectionStatus, serverTools } }, selectedServer)}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Type</label>
                                <p className="text-gray-900">{selectedServer.transportType}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Tools Count</label>
                                <p className="text-gray-900">{selectToolsCountForServer({ mcp: { serverTools } }, selectedServer.id)}</p>
                              </div>
                            </div>
                            
                            <div className="pt-4 border-t">
                              <label className="text-sm font-medium text-gray-600">Description</label>
                              <p className="text-gray-900 mt-1">{selectedServer.description}</p>
                            </div>
                            
                            <div className="pt-4 border-t">
                              <label className="text-sm font-medium text-gray-600">Configuration</label>
                              <pre className="text-xs bg-gray-100 p-3 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(selectedServer.configuration, null, 2)}
                              </pre>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-2">🖥️</div>
                            <p className="text-gray-500">Select a server to view details</p>
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
                  {/* Injection Status Dashboard */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold flex items-center">
                          <span className="mr-3">🚀</span>
                          MCP Tools Injection Status
                        </h2>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${injectionStatus?.availableTools > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className="text-sm font-medium">
                            {injectionStatus?.availableTools > 0 ? 'Tools Injected' : 'Tools Not Injected'}
                          </span>
                        </div>
                      </div>
                      <p className="text-blue-100 text-lg">
                        {injectionStatus?.solution || 'Checking injection status...'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                      {/* Total Tools */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl border shadow-sm p-3 sm:p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Tools</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {injectionStatus?.availableTools || 0}
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
                        className="bg-white rounded-xl border shadow-sm p-3 sm:p-4"
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
                        className="bg-white rounded-xl border shadow-sm p-3 sm:p-4"
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
                        className="bg-white rounded-xl border shadow-sm p-3 sm:p-4"
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
                                    <p className="text-sm text-gray-600">{serverId}</p>
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
                            injectionStatus.availableTools > 0
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-yellow-50 border border-yellow-200'
                          }`}>
                            <p className={`font-medium ${
                              injectionStatus.availableTools > 0 ? 'text-green-800' : 'text-yellow-800'
                            }`}>
                              {injectionStatus.injectionStatus}
                            </p>
                          </div>
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
