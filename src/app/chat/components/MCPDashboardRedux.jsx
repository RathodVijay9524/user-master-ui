import React, { useEffect } from 'react';
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
} from '../../../redux/chat/mcpSlice';

const MCPDashboardRedux = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  // Selectors
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
      dispatch(fetchMCPServers());
      dispatch(fetchMCPTools());
      dispatch(fetchInjectionStatus());
    }
  }, [dispatch, isOpen]);

  // Fetch server tools when servers are loaded
  useEffect(() => {
    if (servers.length > 0) {
      servers.forEach(server => {
        dispatch(fetchServerTools(server.id));
      });
    }
  }, [dispatch, servers]);

  const handleServerSelect = (server) => {
    dispatch(setSelectedServer(server));
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

  const handleClearSelection = () => {
    dispatch(clearSelectedServer());
  };

  const getServerStatusColor = (server) => {
    const status = selectServerStatus({ mcp: { injectionStatus, serverTools } }, server);
    switch (status) {
      case 'running': return 'text-green-600';
      case 'stopped': return 'text-red-600';
      case 'starting': return 'text-yellow-600';
      case 'stopping': return 'text-orange-600';
      default: return 'text-gray-600';
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">MCP Dashboard</h2>
                <p className="text-blue-100 mt-1">
                  Manage Model Context Protocol servers and tools
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex">
              {/* Left Panel - Servers */}
              <div className="w-1/3 border-r bg-gray-50 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">🖥️</span>
                  Active Servers ({servers.length})
                </h3>
                
                {loading.servers ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading servers...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {servers.map((server) => (
                      <motion.div
                        key={server.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedServer?.id === server.id
                            ? 'bg-blue-50 border-blue-300 shadow-md'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleServerSelect(server)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{server.name}</h4>
                          <span className={`text-sm ${getServerStatusColor(server)}`}>
                            {getServerStatusIcon(server)} {selectServerStatus({ mcp: { injectionStatus, serverTools } }, server)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{server.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {selectToolsCountForServer({ mcp: { serverTools } }, server.id)} tools
                          </span>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleServerAction(server.id, 'start');
                              }}
                              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                              disabled={loading.serverTools}
                            >
                              Start
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleServerAction(server.id, 'stop');
                              }}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                              disabled={loading.serverTools}
                            >
                              Stop
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Panel - Tools */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="mr-2">🛠️</span>
                    {showAllTools ? 'All Tools' : selectedServer ? `${selectedServer.name} Tools` : 'Select a Server'}
                    <span className="ml-2 text-sm text-gray-500">({filteredTools.length})</span>
                  </h3>
                  
                  <div className="flex space-x-2">
                    {selectedServer && (
                      <button
                        onClick={handleShowAllTools}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                      >
                        {showAllTools ? 'Show Server Tools' : 'Show All Tools'}
                      </button>
                    )}
                    {selectedServer && (
                      <button
                        onClick={handleClearSelection}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>
                </div>

                {/* Tools List */}
                <div className="bg-white border rounded-lg max-h-96 overflow-y-auto">
                  {loading.serverTools ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading tools...</p>
                    </div>
                  ) : filteredTools.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🛠️</div>
                      <p className="text-gray-500">
                        {selectedServer 
                          ? `No tools found for ${selectedServer.name}` 
                          : 'Select a server to view its tools'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-2">
                      {filteredTools.map((tool, index) => (
                        <motion.div
                          key={tool.id || tool.name || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{tool.name}</h4>
                              <p className="text-sm text-gray-600">{tool.description}</p>
                              {tool.serverName && (
                                <p className="text-xs text-blue-600 mt-1">
                                  From: {tool.serverName}
                                </p>
                              )}
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {tool.status || 'active'}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Debug Info */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm">
                  <h4 className="font-medium mb-2">Debug Info:</h4>
                  <p>Selected Server: {selectedServer?.name || 'None'}</p>
                  <p>Show All Tools: {showAllTools ? 'Yes' : 'No'}</p>
                  <p>Filtered Tools Count: {filteredTools.length}</p>
                  <p>General Tools Count: {tools.length}</p>
                  <p>Server Tools Count: {Object.keys(serverTools).length}</p>
                  <p>Loading: {JSON.stringify(loading)}</p>
                  <p>Errors: {JSON.stringify(errors)}</p>
                  
                  <div className="mt-3 space-x-2">
                    <button
                      onClick={() => {
                        console.log('🔄 Manually refreshing all data...');
                        dispatch(fetchMCPServers());
                        dispatch(fetchMCPTools());
                        dispatch(fetchInjectionStatus());
                        if (servers.length > 0) {
                          servers.forEach(server => {
                            dispatch(fetchServerTools(server.id));
                          });
                        }
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                    >
                      🔄 Refresh All
                    </button>
                    <button
                      onClick={() => {
                        console.log('🔄 Manually fetching general tools...');
                        dispatch(fetchMCPTools());
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs"
                    >
                      🔄 Refresh Tools
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MCPDashboardRedux;
