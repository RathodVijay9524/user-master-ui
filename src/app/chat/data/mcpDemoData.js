// Demo data for MCP Dashboard
export const demoMCPServers = [
  {
    id: 1,
    name: 'My Python MCP Server',
    transportType: 'STDIO',
    enabled: true,
    status: 'running',
    toolsCount: 5,
    health: 95,
    uptime: '2h 15m',
    latency: 12,
    description: 'Python coding assistant with MCP',
    configuration: {
      command: 'python',
      args: ['E:/ai_projects/MCP_apps/coding_assistant_mcp/coding_assistant_mcp.py'],
      workingDirectory: 'E:/ai_projects/MCP_apps/coding_assistant_mcp',
      environment: {
        PYTHONPATH: 'E:/ai_projects/MCP_apps/coding_assistant_mcp'
      }
    },
    lastStarted: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'My SSE MCP Server',
    transportType: 'SSE',
    enabled: true,
    status: 'running',
    toolsCount: 8,
    health: 88,
    uptime: '1h 45m',
    latency: 25,
    description: 'Server-Sent Events MCP server',
    configuration: {
      url: 'http://localhost:8082',
      endpoint: '/mcp',
      messageEndpoint: '/mcp/message',
      timeoutSeconds: 30,
      headers: {
        Authorization: 'Bearer your-token',
        'Content-Type': 'application/json'
      }
    },
    lastStarted: '2024-01-15T11:00:00Z'
  },
  {
    id: 3,
    name: 'My Socket MCP Server',
    transportType: 'SOCKET',
    enabled: true,
    status: 'stopped',
    toolsCount: 3,
    health: 0,
    uptime: '0m',
    latency: 0,
    description: 'Socket-based MCP server',
    configuration: {
      host: 'localhost',
      port: 8083,
      protocol: 'TCP',
      options: {
        keepAlive: 'true',
        timeout: '30000'
      }
    },
    lastStarted: null
  },
  {
    id: 4,
    name: 'File System Server',
    transportType: 'STDIO',
    enabled: true,
    status: 'running',
    toolsCount: 12,
    health: 92,
    uptime: '3h 20m',
    latency: 8,
    description: 'Handles file system operations',
    configuration: {
      command: 'mcp-server-filesystem',
      args: ['--config', '/etc/mcp/filesystem.json'],
      workingDirectory: '/usr/local/bin'
    },
    lastStarted: '2024-01-15T09:15:00Z'
  }
];

export const demoMCPTools = [
  {
    id: 1,
    name: 'read_file',
    server: 'File System Server',
    serverId: 1,
    status: 'active',
    usage: 45,
    description: 'Read file contents from the filesystem',
    category: 'filesystem',
    parameters: ['path', 'encoding'],
    lastUsed: '2024-01-15T12:30:00Z',
    usageCount: 156
  },
  {
    id: 2,
    name: 'search_database',
    server: 'Database Server',
    serverId: 2,
    status: 'active',
    usage: 78,
    description: 'Search and query database records',
    category: 'database',
    parameters: ['query', 'limit', 'offset'],
    lastUsed: '2024-01-15T12:28:00Z',
    usageCount: 89
  },
  {
    id: 3,
    name: 'scrape_webpage',
    server: 'Web Scraper Server',
    serverId: 3,
    status: 'inactive',
    usage: 0,
    description: 'Scrape content from web pages',
    category: 'web',
    parameters: ['url', 'selectors', 'options'],
    lastUsed: '2024-01-15T08:15:00Z',
    usageCount: 23
  },
  {
    id: 4,
    name: 'write_file',
    server: 'File System Server',
    serverId: 1,
    status: 'active',
    usage: 32,
    description: 'Write content to files',
    category: 'filesystem',
    parameters: ['path', 'content', 'encoding'],
    lastUsed: '2024-01-15T12:25:00Z',
    usageCount: 67
  },
  {
    id: 5,
    name: 'analyze_code',
    server: 'Code Analysis Server',
    serverId: 4,
    status: 'active',
    usage: 61,
    description: 'Analyze code complexity and metrics',
    category: 'analysis',
    parameters: ['code', 'language', 'options'],
    lastUsed: '2024-01-15T12:20:00Z',
    usageCount: 34
  },
  {
    id: 6,
    name: 'execute_query',
    server: 'Database Server',
    serverId: 2,
    status: 'active',
    usage: 55,
    description: 'Execute SQL queries',
    category: 'database',
    parameters: ['sql', 'params', 'options'],
    lastUsed: '2024-01-15T12:18:00Z',
    usageCount: 112
  }
];

export const demoMCPMonitoring = {
  cpuUsage: 45,
  memoryUsage: 67,
  activeTools: 16,
  uptime: 86400, // 24 hours in seconds
  latency: 25,
  totalRequests: 1247,
  errorRate: 0.02,
  throughput: 2.4, // MB/s
  activeConnections: 8,
  healthScore: 92,
  lastUpdate: '2024-01-15T12:30:00Z'
};

export const demoTransportTypes = [
  {
    value: 'STDIO',
    label: 'STDIO',
    description: 'Standard input/output communication',
    icon: '📁',
    supported: true
  },
  {
    value: 'SSE',
    label: 'Server-Sent Events',
    description: 'HTTP-based streaming communication',
    icon: '📡',
    supported: true
  },
  {
    value: 'SOCKET',
    label: 'Socket',
    description: 'TCP socket communication',
    icon: '🔌',
    supported: true
  },
  {
    value: 'HTTP',
    label: 'HTTP/REST',
    description: 'Traditional HTTP request/response',
    icon: '🌐',
    supported: true
  }
];

export const demoAPIEndpoints = [
  {
    method: 'GET',
    endpoint: '/api/mcp/servers',
    description: 'Get all MCP servers',
    status: 'active',
    responseTime: 45,
    lastUsed: '2024-01-15T12:30:00Z'
  },
  {
    method: 'POST',
    endpoint: '/api/mcp/servers',
    description: 'Add new MCP server',
    status: 'active',
    responseTime: 120,
    lastUsed: '2024-01-15T11:45:00Z'
  },
  {
    method: 'GET',
    endpoint: '/api/mcp/tools',
    description: 'Get available MCP tools',
    status: 'active',
    responseTime: 38,
    lastUsed: '2024-01-15T12:28:00Z'
  },
  {
    method: 'POST',
    endpoint: '/api/mcp/tools',
    description: 'Register new MCP tool',
    status: 'active',
    responseTime: 95,
    lastUsed: '2024-01-15T10:15:00Z'
  },
  {
    method: 'GET',
    endpoint: '/api/mcp/health',
    description: 'Get system health status',
    status: 'active',
    responseTime: 25,
    lastUsed: '2024-01-15T12:30:00Z'
  }
];

export const demoServerLogs = [
  {
    id: 1,
    timestamp: '2024-01-15T12:30:15Z',
    level: 'info',
    message: 'Server started successfully',
    serverId: 1,
    serverName: 'File System Server'
  },
  {
    id: 2,
    timestamp: '2024-01-15T12:29:45Z',
    level: 'info',
    message: 'Tool "read_file" executed successfully',
    serverId: 1,
    serverName: 'File System Server'
  },
  {
    id: 3,
    timestamp: '2024-01-15T12:28:30Z',
    level: 'warning',
    message: 'High memory usage detected',
    serverId: 2,
    serverName: 'Database Server'
  },
  {
    id: 4,
    timestamp: '2024-01-15T12:27:15Z',
    level: 'error',
    message: 'Connection timeout to Web Scraper Server',
    serverId: 3,
    serverName: 'Web Scraper Server'
  },
  {
    id: 5,
    timestamp: '2024-01-15T12:26:00Z',
    level: 'info',
    message: 'New client connected',
    serverId: 4,
    serverName: 'Code Analysis Server'
  }
];

// Helper functions
export const getServerById = (servers, id) => {
  return servers.find(server => server.id === id);
};

export const getToolsByServer = (tools, serverId) => {
  return tools.filter(tool => tool.serverId === serverId);
};

export const getActiveTools = (tools) => {
  return tools.filter(tool => tool.status === 'active');
};

export const getServerHealthColor = (health) => {
  if (health >= 90) return 'text-green-600';
  if (health >= 70) return 'text-yellow-600';
  if (health >= 50) return 'text-orange-600';
  return 'text-red-600';
};

export const getServerHealthBgColor = (health) => {
  if (health >= 90) return 'bg-green-100';
  if (health >= 70) return 'bg-yellow-100';
  if (health >= 50) return 'bg-orange-100';
  return 'bg-red-100';
};

export const formatUptime = (uptime) => {
  if (!uptime || uptime === '0m') return '0m';
  return uptime;
};

export const formatLatency = (latency) => {
  return `${latency}ms`;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'running':
      return 'text-green-600 bg-green-100';
    case 'stopped':
      return 'text-red-600 bg-red-100';
    case 'starting':
      return 'text-yellow-600 bg-yellow-100';
    case 'stopping':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getLogLevelColor = (level) => {
  switch (level) {
    case 'info':
      return 'text-blue-600 bg-blue-100';
    case 'warning':
      return 'text-yellow-600 bg-yellow-100';
    case 'error':
      return 'text-red-600 bg-red-100';
    case 'debug':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export default {
  demoMCPServers,
  demoMCPTools,
  demoMCPMonitoring,
  demoTransportTypes,
  demoAPIEndpoints,
  demoServerLogs,
  getServerById,
  getToolsByServer,
  getActiveTools,
  getServerHealthColor,
  getServerHealthBgColor,
  formatUptime,
  formatLatency,
  getStatusColor,
  getLogLevelColor
};
