# Enhanced Error Responses with Templates

The Kakitu MCP Server now provides **helpful error responses** with templates showing the correct way to send requests.

## Error Response Format

When an error occurs, the server returns a JSON-RPC 2.0 error response with helpful information:

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32602,
    "message": "Descriptive error message",
    "data": {
      "correctFormat": { /* Template showing correct request format */ },
      "hint": "Helpful guidance message",
      "yourRequest": { /* What you sent (for validation errors) */ }
    }
  },
  "id": 1
}
```

## Error Codes

| Code | Type | Description |
|------|------|-------------|
| `-32600` | Invalid Request | Malformed JSON-RPC request |
| `-32601` | Method Not Found | Requested method doesn't exist |
| `-32602` | Invalid Params | Missing or invalid parameters |
| `-32603` | Internal Error | Server-side error |

---

## Example Error Responses

### 1. Missing Required Parameters

**❌ Invalid Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "sendTransaction",
  "params": {
    "fromAddress": "kshs_3h5fu..."
  },
  "id": 1
}
```

**📥 Error Response:**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32602,
    "message": "Invalid parameters: Missing required field(s): toAddress, amountRaw, privateKey",
    "data": {
      "correctFormat": {
        "jsonrpc": "2.0",
        "method": "sendTransaction",
        "params": {
          "fromAddress": "kshs_3xxxxx...",
          "toAddress": "kshs_1xxxxx...",
          "amountRaw": "1000000000000000000000000000",
          "privateKey": "your_private_key_here"
        },
        "id": 1
      },
      "hint": "Please use the correct format shown in 'correctFormat'. Ensure all required parameters are included.",
      "yourRequest": {
        "method": "sendTransaction",
        "params": {
          "fromAddress": "kshs_3h5fu..."
        }
      }
    }
  },
  "id": 1
}
```

---

### 2. Method Not Found

**❌ Invalid Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "invalidMethod",
  "params": {},
  "id": 1
}
```

**📥 Error Response:**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method invalidMethod not found",
    "data": {
      "availableMethods": [
        "generateWallet",
        "getBalance",
        "getAccountInfo",
        "getPendingBlocks",
        "initializeAccount",
        "sendTransaction",
        "receiveAllPending"
      ],
      "exampleRequest": {
        "jsonrpc": "2.0",
        "method": "generateWallet",
        "params": {},
        "id": 1
      },
      "hint": "Please use one of the available methods listed above. See 'exampleRequest' for proper JSON-RPC format."
    }
  },
  "id": 1
}
```

---

### 3. Invalid Request Structure

**❌ Invalid Request:**
```json
{
  "jsonrpc": "2.0",
  "params": {},
  "id": 1
}
```

**📥 Error Response:**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32600,
    "message": "Invalid JSON-RPC request. Missing 'method' field.",
    "data": {
      "correctFormat": {
        "jsonrpc": "2.0",
        "method": "methodName",
        "params": {},
        "id": 1
      },
      "availableMethods": [
        "generateWallet",
        "getBalance",
        "getAccountInfo",
        "getPendingBlocks",
        "initializeAccount",
        "sendTransaction",
        "receiveAllPending"
      ],
      "hint": "All requests must include: jsonrpc, method, params (if required), and id"
    }
  },
  "id": 1
}
```

---

## Request Templates for All Methods

### `generateWallet` - No parameters required
```json
{
  "jsonrpc": "2.0",
  "method": "generateWallet",
  "params": {},
  "id": 1
}
```

### `getBalance` - Get account balance
```json
{
  "jsonrpc": "2.0",
  "method": "getBalance",
  "params": {
    "address": "kshs_3xxxxx..."
  },
  "id": 1
}
```

### `getAccountInfo` - Get detailed account info
```json
{
  "jsonrpc": "2.0",
  "method": "getAccountInfo",
  "params": {
    "address": "kshs_3xxxxx..."
  },
  "id": 1
}
```

### `getPendingBlocks` - Get pending transactions
```json
{
  "jsonrpc": "2.0",
  "method": "getPendingBlocks",
  "params": {
    "address": "kshs_3xxxxx..."
  },
  "id": 1
}
```

### `initializeAccount` - Open a new account
```json
{
  "jsonrpc": "2.0",
  "method": "initializeAccount",
  "params": {
    "address": "kshs_3xxxxx...",
    "privateKey": "your_private_key_here"
  },
  "id": 1
}
```

### `sendTransaction` - Send KSHS (with auto-receive)
```json
{
  "jsonrpc": "2.0",
  "method": "sendTransaction",
  "params": {
    "fromAddress": "kshs_3xxxxx...",
    "toAddress": "kshs_1xxxxx...",
    "amountRaw": "1000000000000000000000000000",
    "privateKey": "your_private_key_here"
  },
  "id": 1
}
```

**Note:** `sendTransaction` automatically checks for and receives any pending blocks before sending.

### `receiveAllPending` - Receive all pending transactions
```json
{
  "jsonrpc": "2.0",
  "method": "receiveAllPending",
  "params": {
    "address": "kshs_3xxxxx...",
    "privateKey": "your_private_key_here"
  },
  "id": 1
}
```

---

## Benefits

✅ **Clear Error Messages** - Know exactly what went wrong  
✅ **Request Templates** - See the correct format immediately  
✅ **Available Methods** - Discover what methods are supported  
✅ **Your Request Echo** - Compare what you sent vs. what's expected  
✅ **Helpful Hints** - Guidance on how to fix the issue

---

## Integration Tips

### JavaScript/Node.js
```javascript
const axios = require('axios');

try {
  const response = await axios.post('http://localhost:8080/', {
    jsonrpc: "2.0",
    method: "sendTransaction",
    params: {
      fromAddress: "kshs_...",
      toAddress: "kshs_...",
      amountRaw: "1000000000000000000000000000",
      privateKey: "your_key"
    },
    id: 1
  });
  console.log(response.data.result);
} catch (error) {
  if (error.response && error.response.data.error) {
    const err = error.response.data.error;
    console.error('Error:', err.message);
    if (err.data && err.data.correctFormat) {
      console.log('Correct format:', JSON.stringify(err.data.correctFormat, null, 2));
    }
  }
}
```

### Python
```python
import requests

try:
    response = requests.post('http://localhost:8080/', json={
        "jsonrpc": "2.0",
        "method": "sendTransaction",
        "params": {
            "fromAddress": "kshs_...",
            "toAddress": "kshs_...",
            "amountRaw": "1000000000000000000000000000",
            "privateKey": "your_key"
        },
        "id": 1
    })
    result = response.json()
    
    if 'error' in result:
        print(f"Error: {result['error']['message']}")
        if 'data' in result['error'] and 'correctFormat' in result['error']['data']:
            print(f"Correct format: {result['error']['data']['correctFormat']}")
    else:
        print(f"Success: {result['result']}")
except Exception as e:
    print(f"Request failed: {e}")
```

---

## Summary

Every error response now includes:
- 🔴 **Error Code & Message** - What went wrong
- 📋 **Correct Format Template** - How to fix it
- 💡 **Helpful Hints** - Additional guidance
- 📍 **Available Methods** - What you can do
- 🔍 **Your Request** - What you sent (for validation errors)

This makes debugging and integration **much easier**! 🎉

