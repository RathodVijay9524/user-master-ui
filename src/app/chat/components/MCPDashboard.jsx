import React, { useState, useEffect, useRef } from 'react';
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

const MCPDashboard = ({ theme, onClose }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('servers');
  const [servers, setServers] = useState(demoMCPServers);
  const [selectedServer, setSelectedServer] = useState(null);
  const [tools, setTools] = useState(demoMCPTools);

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

  // Animate CPU and memory usage
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 10)));
      setMemoryUsage(prev => Math.max(20, Math.min(85, prev + (Math.random() - 0.5) * 8)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleServerAction = (serverId, action) => {
    setServers(prev => prev.map(server => {
      if (server.id === serverId) {
        if (action === 'start') {
          return { ...server, status: 'running', health: 85 + Math.random() * 15, uptime: '0m' };
        } else if (action === 'stop') {
          return { ...server, status: 'stopped', health: 0, uptime: '0m' };
        } else if (action === 'remove') {
          return null;
        }
      }
      return server;
    }).filter(Boolean));
  };

  const handleServerSelect = (server) => {
    setSelectedServer(server);
    setActiveTab('tools');
  };

  const getFilteredTools = () => {
    if (selectedServer) {
      return tools.filter(tool => tool.serverId === selectedServer.id);
    }
    return tools;
  };

  const getToolsCountForServer = (serverId) => {
    return tools.filter(tool => tool.serverId === serverId).length;
  };

  const handleAddServer = () => {
    if (newServer.name) {
      const newServerObj = {
        id: Date.now(),
        name: newServer.name,
        transportType: newServer.transportType,
        enabled: newServer.enabled,
        status: 'stopped',
        toolsCount: 0,
        health: 0,
        uptime: '0m',
        latency: 0,
        description: `New ${newServer.transportType} server`,
        configuration: newServer.configuration,
        lastStarted: null
      };
      setServers(prev => [...prev, newServerObj]);
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
            { id: 'config', label: 'Config', icon: '⚙️' }
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
                        <h3 className="text-lg font-semibold flex items-center">
                          <span className="mr-2">🖥️</span>
                          Active Servers ({servers.length})
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
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
                                      animate={server.status === 'running' ? pulseVariants.pulse : {}}
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
                                    <span className="text-sm sm:text-lg">{getStatusIcon(server.status)}</span>
                                    <span className={`capitalize text-xs sm:text-sm font-medium ${
                                      server.status === 'running' ? 'text-green-600' :
                                      server.status === 'stopped' ? 'text-red-600' :
                                      'text-yellow-600'
                                    }`}>
                                      {server.status}
                                    </span>
                                  </div>
                                  {server.status === 'running' && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {server.uptime} • {server.latency}ms
                                    </div>
                                  )}
                                </td>
                                <td className="px-2 sm:px-4 py-3 sm:py-4">
                                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                                    {getToolsCountForServer(server.id)} Tools
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {tools.filter(t => t.serverId === server.id && t.status === 'active').length} Active
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleServerAction(server.id, server.status === 'running' ? 'stop' : 'start');
                                      }}
                                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                        server.status === 'running'
                                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                                      }`}
                                    >
                                      {server.status === 'running' ? 'Stop' : 'Start'}
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleServerAction(server.id, 'remove');
                                      }}
                                      className="px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                      Remove
                                    </motion.button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
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
                          onClick={handleAddServer}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                        >
                          Add Server
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
                        onClick={() => setSelectedServer(null)}
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
                      <h3 className="text-lg font-semibold flex items-center">
                        <span className="mr-2">🛠️</span>
                        {selectedServer ? `${selectedServer.name} Tools` : 'Available Tools'} ({getFilteredTools().length})
                      </h3>
                    </div>
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {getFilteredTools().length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-2">🔍</div>
                          <p className="text-gray-500">No tools found for this server</p>
                        </div>
                      ) : (
                        getFilteredTools().map((tool, index) => (
                          <motion.div
                            key={tool.id}
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
                                <div className="text-sm text-gray-500">{tool.description}</div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {tool.category} • {tool.usageCount} uses
                                </div>
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
                          {selectedServer ? 'Server Tools' : 'Active Tools'}
                        </span>
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-2xl font-bold text-blue-600"
                        >
                          {selectedServer ? getFilteredTools().length : activeTools}
                        </motion.span>
                      </div>
                      
                      {selectedServer && (
                        <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-blue-900">Server Status</span>
                            <span className={`font-medium ${
                              selectedServer.status === 'running' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {selectedServer.status.charAt(0).toUpperCase() + selectedServer.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Health</span>
                            <span className="font-medium text-blue-900">{selectedServer.health}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Uptime</span>
                            <span className="font-medium text-blue-900">{selectedServer.uptime}</span>
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
                              className="w-3 h-3 bg-green-400 rounded-full"
                            />
                            <span className="text-sm text-green-600">Injected</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>API Uptime</span>
                            <span className="font-medium">99.9%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "99.9%" }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Data Transfer Rate</span>
                            <span className="font-medium">2.4 MB/s</span>
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
                        {servers.map((server, index) => (
                          <motion.div
                            key={server.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                server.health > 80 ? 'bg-green-400' :
                                server.health > 50 ? 'bg-yellow-400' : 'bg-red-400'
                              }`} />
                              <span className="font-medium">{server.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <motion.div
                                  className={`h-2 rounded-full ${
                                    server.health > 80 ? 'bg-green-400' :
                                    server.health > 50 ? 'bg-yellow-400' : 'bg-red-400'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${server.health}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                />
                              </div>
                              <span className="text-sm font-medium w-12 text-right">{server.health}%</span>
                            </div>
                          </motion.div>
                        ))}
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
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default MCPDashboard;
