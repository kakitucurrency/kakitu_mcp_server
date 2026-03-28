#!/usr/bin/env node

const { KakituMCPServer } = require('./server');
const { StdioTransport } = require('./stdio-transport');

// Global Error Handlers
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Keep the process alive but log the error
    // In a critical production system, we might want to exit, 
    // but for an MCP server staying alive is often preferred to avoid breaking the client connection completely.
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Keep the process alive
});

// ⚠️ CRITICAL: RPC NODE CONFIGURATION WITH REDUNDANCY
// ⚠️ Primary RPC Node: https://kakitu.org
// ⚠️ All nodes are public and require NO API KEY
// ⚠️ Failover is automatic if primary node becomes unavailable

// Default configuration
const config = {
    port: 8080,
    rpcNodes: [
        'https://kakitu.org',  // Primary RPC node
    ],
    rpcKey: null, // No API key required for public nodes
    defaultRepresentative: process.env.KAKITU_REPRESENTATIVE || 'kshs_3qya5xpjfsbk3ndfebo9dsrj6iy6f6idmogqtn1mtzdtwnxu6rw3dz18i6xf',
    transport: process.env.MCP_TRANSPORT || 'http' // 'http' or 'stdio'
};

// Create and start server
const server = new KakituMCPServer(config);

if (config.transport === 'stdio') {
    const stdioTransport = new StdioTransport(server);
    stdioTransport.start();
    console.error('Kakitu MCP Server running in stdio mode');
} else {
    server.startHttp();
}

// Handle process termination
process.on('SIGINT', () => {
    console.error('\nShutting down Kakitu MCP Server...');
    process.exit(0);
});
