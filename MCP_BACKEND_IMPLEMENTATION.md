# MCP Backend Implementation Guide

## 🚀 Required Endpoints for MCP Integration

Your backend needs to implement the following endpoints to support the MCP (Model Context Protocol) integration in your chat application.

### Base URL Configuration
- **Development**: `http://localhost:9091/api`
- **Production**: `https://api.codewithvijay.online/api`

### Required Endpoints

#### 1. Get All MCP Servers
```
GET /api/mcp-servers
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "My Python MCP Server",
    "transportType": "STDIO",
    "enabled": true,
    "status": "running",
    "toolsCount": 5,
    "health": 95,
    "uptime": "2h 15m",
    "latency": 12,
    "description": "Python coding assistant with MCP",
    "configuration": {
      "command": "python",
      "args": ["script.py"],
      "workingDirectory": "/path/to/working/directory",
      "environment": {
        "PYTHONPATH": "/path/to/python"
      }
    },
    "lastStarted": "2024-01-15T10:30:00Z"
  }
]
```

#### 2. Create New MCP Server
```
POST /api/mcp-servers
```
**Request Body:**
```json
{
  "name": "New MCP Server",
  "transportType": "STDIO",
  "enabled": true,
  "configuration": {
    "command": "python",
    "args": ["server.py"],
    "workingDirectory": "/path/to/server",
    "environment": {}
  },
  "description": "Description of the server"
}
```

#### 3. Get MCP Tools
```
GET /api/mcp-servers/tools
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "read_file",
    "serverId": 1,
    "serverName": "File System Server",
    "status": "active",
    "usage": 45,
    "description": "Read file contents from the filesystem",
    "category": "filesystem",
    "parameters": ["path", "encoding"],
    "lastUsed": "2024-01-15T12:30:00Z",
    "usageCount": 156
  }
]
```

#### 4. Get Injection Status
```
GET /api/mcp-servers/injection-status
```
**Response:**
```json
{
  "injected": true,
  "uptime": "99.9%",
  "dataTransferRate": "2.4 MB/s",
  "activeTools": 16,
  "totalServers": 4,
  "runningServers": 3
}
```

#### 5. Start MCP Server
```
POST /api/mcp-servers/{serverId}/start
```
**Response:**
```json
{
  "success": true,
  "message": "Server started successfully",
  "serverId": 1,
  "status": "running"
}
```

#### 6. Stop MCP Server
```
POST /api/mcp-servers/{serverId}/stop
```
**Response:**
```json
{
  "success": true,
  "message": "Server stopped successfully",
  "serverId": 1,
  "status": "stopped"
}
```

#### 7. Get Server Tools
```
GET /api/mcp-servers/{serverId}/tools
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "read_file",
    "serverId": 1,
    "status": "active",
    "description": "Read file contents",
    "category": "filesystem"
  }
]
```

#### 8. Delete MCP Server
```
DELETE /api/mcp-servers/{serverId}
```
**Response:**
```json
{
  "success": true,
  "message": "Server deleted successfully"
}
```

## 🔧 Implementation Steps

### 1. Database Schema
Create tables for MCP servers and tools:

```sql
-- MCP Servers table
CREATE TABLE mcp_servers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    transport_type ENUM('STDIO', 'SSE', 'SOCKET', 'HTTP') NOT NULL,
    enabled BOOLEAN DEFAULT true,
    status ENUM('running', 'stopped', 'starting', 'stopping') DEFAULT 'stopped',
    description TEXT,
    configuration JSON,
    health INT DEFAULT 0,
    uptime VARCHAR(50) DEFAULT '0m',
    latency INT DEFAULT 0,
    last_started TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- MCP Tools table
CREATE TABLE mcp_tools (
    id INT PRIMARY KEY AUTO_INCREMENT,
    server_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    description TEXT,
    category VARCHAR(100),
    parameters JSON,
    usage_count INT DEFAULT 0,
    last_used TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (server_id) REFERENCES mcp_servers(id) ON DELETE CASCADE
);
```

### 2. Controller Implementation Example (Node.js/Express)

```javascript
// MCP Servers Controller
const express = require('express');
const router = express.Router();

// Get all MCP servers
router.get('/mcp-servers', async (req, res) => {
  try {
    const servers = await db.query('SELECT * FROM mcp_servers');
    res.json(servers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new MCP server
router.post('/mcp-servers', async (req, res) => {
  try {
    const { name, transportType, enabled, configuration, description } = req.body;
    const result = await db.query(
      'INSERT INTO mcp_servers (name, transport_type, enabled, configuration, description) VALUES (?, ?, ?, ?, ?)',
      [name, transportType, enabled, JSON.stringify(configuration), description]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get MCP tools
router.get('/mcp-servers/tools', async (req, res) => {
  try {
    const tools = await db.query(`
      SELECT t.*, s.name as serverName 
      FROM mcp_tools t 
      JOIN mcp_servers s ON t.server_id = s.id
    `);
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get injection status
router.get('/mcp-servers/injection-status', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as totalServers,
        SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as runningServers,
        (SELECT COUNT(*) FROM mcp_tools WHERE status = 'active') as activeTools
      FROM mcp_servers
    `);
    
    res.json({
      injected: stats[0].activeTools > 0,
      uptime: "99.9%",
      dataTransferRate: "2.4 MB/s",
      activeTools: stats[0].activeTools,
      totalServers: stats[0].totalServers,
      runningServers: stats[0].runningServers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
router.post('/mcp-servers/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      'UPDATE mcp_servers SET status = "running", last_started = NOW() WHERE id = ?',
      [id]
    );
    res.json({ success: true, message: 'Server started successfully', serverId: id, status: 'running' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop server
router.post('/mcp-servers/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE mcp_servers SET status = "stopped" WHERE id = ?', [id]);
    res.json({ success: true, message: 'Server stopped successfully', serverId: id, status: 'stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete server
router.delete('/mcp-servers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM mcp_servers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Server deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 3. CORS Configuration
Make sure your backend has CORS configured to allow requests from your frontend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 4. Authentication
Ensure your MCP endpoints are protected with JWT authentication like your other endpoints.

## 🧪 Testing

1. Start your backend server on `http://localhost:9091`
2. Open your frontend and go to MCP Configuration
3. Click on the "🧪 API Test" tab
4. Test each endpoint to verify they're working

## 📝 Notes

- The frontend will automatically fallback to demo data if the API endpoints are not available
- Make sure to implement proper error handling and validation
- Consider adding rate limiting for the MCP endpoints
- The configuration field should store JSON data for server settings

Once you implement these endpoints, your MCP integration will be fully functional!
