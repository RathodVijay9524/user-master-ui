import React, { useState } from 'react';
import { mcpApi } from '../services/mcpApi';

const MCPApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { success: true, data: result } 
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error.message,
          details: {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          }
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      name: 'getServers',
      label: 'Get MCP Servers',
      function: () => mcpApi.getServers()
    },
    {
      name: 'getTools',
      label: 'Get MCP Tools',
      function: () => mcpApi.getTools()
    },
    {
      name: 'getInjectionStatus',
      label: 'Get Injection Status',
      function: () => mcpApi.getInjectionStatus()
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">MCP API Connection Test</h2>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Current Configuration:</h3>
        <p><strong>Base URL:</strong> {window.location.origin.includes('localhost') ? 'http://localhost:9091/api' : 'https://api.codewithvijay.online/api'}</p>
        <p><strong>JWT Token:</strong> {localStorage.getItem('jwtToken') ? 'Present' : 'Missing'}</p>
        <p><strong>Frontend URL:</strong> {window.location.origin}</p>
      </div>

      <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-semibold mb-2 text-yellow-800">⚠️ Backend Implementation Required</h3>
        <p className="text-yellow-700 mb-2">Your backend needs to implement these MCP endpoints:</p>
        <div className="bg-white p-3 rounded border text-sm font-mono">
          <div>GET /api/mcp-servers</div>
          <div>POST /api/mcp-servers</div>
          <div>GET /api/mcp-servers/tools</div>
          <div>GET /api/mcp-servers/injection-status</div>
          <div>POST /api/mcp-servers/{id}/start</div>
          <div>POST /api/mcp-servers/{id}/stop</div>
          <div>DELETE /api/mcp-servers/{id}</div>
        </div>
      </div>

      <div className="space-y-4">
        {tests.map(test => (
          <div key={test.name} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{test.label}</h3>
              <button
                onClick={() => runTest(test.name, test.function)}
                disabled={loading[test.name]}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading[test.name] ? 'Testing...' : 'Test'}
              </button>
            </div>
            
            {testResults[test.name] && (
              <div className={`p-3 rounded ${
                testResults[test.name].success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {testResults[test.name].success ? (
                  <div>
                    <p className="text-green-800 font-semibold">✅ Success</p>
                    <pre className="text-sm mt-2 overflow-x-auto">
                      {JSON.stringify(testResults[test.name].data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-800 font-semibold">❌ Error</p>
                    <p className="text-red-700">{testResults[test.name].error}</p>
                    {testResults[test.name].details && (
                      <pre className="text-sm mt-2 overflow-x-auto">
                        {JSON.stringify(testResults[test.name].details, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure your backend server is running on port 9091</li>
          <li>Check that the MCP endpoints are implemented on your backend</li>
          <li>Verify your JWT token is valid and not expired</li>
          <li>Check the browser console for detailed error messages</li>
          <li>Test the endpoints directly with Postman or curl</li>
        </ol>
      </div>
    </div>
  );
};

export default MCPApiTest;
