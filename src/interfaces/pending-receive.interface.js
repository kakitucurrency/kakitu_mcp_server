const { KakituTransactions } = require('../../utils/kakitu-transactions');

/**
 * Isolated interface for handling pending receive operations
 * Uses the same MCP infrastructure but with dedicated endpoint
 */
class PendingReceiveInterface {
    constructor() {
        // Use the same KakituTransactions class but with isolated configuration
        this.kakituTransactions = new KakituTransactions({
            rpcNodes: [process.env.PENDING_RPC_URL || 'https://kakitu.org'],
            rpcKey: null, // No API key required for kakitu.org public node
            defaultRepresentative: process.env.PENDING_REPRESENTATIVE || 'kshs_3qya5xpjfsbk3ndfebo9dsrj6iy6f6idmogqtn1mtzdtwnxu6rw3dz18i6xf'
        });
    }

    /**
     * Handle JSON-RPC request for pending receive operations
     * @param {Object} request - JSON-RPC request object
     * @returns {Promise<Object>} JSON-RPC response object
     */
    async handleRequest(request) {
        try {
            const { method, params, id } = request;

            if (method !== 'pending/receive') {
                throw new Error('Method not supported. Use pending/receive');
            }

            if (!params.account || !params.privateKey) {
                throw new Error('Missing required parameters: account and privateKey');
            }

            // Use the existing receiveAllPending method from KakituTransactions
            const result = await this.kakituTransactions.receiveAllPending(
                params.account,
                params.privateKey
            );

            return {
                jsonrpc: "2.0",
                result: {
                    success: true,
                    ...result
                },
                id
            };
        } catch (error) {
            return {
                jsonrpc: "2.0",
                error: {
                    code: -32603,
                    message: error.message
                },
                id: request.id
            };
        }
    }
}

module.exports = new PendingReceiveInterface();