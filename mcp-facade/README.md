# mcp-dacade


API

```sh

# health check
curl http://localhost:3001/api/health | jq .

# List servers
curl http://localhost:3001/api/mcp/servers | jq .

# Get by name
curl http://localhost:3001/api/mcp/servers/echo | jq .

# Update
curl -X PUT http://localhost:3001/api/mcp/servers/echo \
  -H "Content-Type: application/json" \
  -d '{"url": "http://127.0.0.1:3003/echo/mcp"}'

# Delete
curl -X DELETE http://localhost:3001/api/mcp/servers/echo

# Create 
curl -X POST http://localhost:3001/api/mcp/servers \
  -H "Content-Type: application/json" \
  -d '{"name": "echo", "url": "http://127.0.0.1:3003/echo/mcp"}'

# List tools
curl http://localhost:3001/api/mcp/tools | jq .

# Call tool via facade

curl -v -N -X POST http://localhost:3001/api/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Connection: keep-alive" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "echo",
      "arguments": {
        "message": "Hello, world!"
      }
    }
  }'

```


API access rules

>Note: If no access rules are defined for a tool, access is permitted by default.

```sh

# Get all rules
curl http://localhost:3001/api/access-rules | jq .

# Get rules for a tool
curl http://localhost:3001/api/access-rules/by-tool/echo | jq .

# Create
curl -X POST http://localhost:3001/api/access-rules/by-tool/echo -d '{"ruleType": "WILDCARD", "value": null}'
curl -X POST http://localhost:3001/api/access-rules/by-tool/add -d '{"ruleType": "SCOPE", "value": "openid"}'

# Update
curl -X PUT http://localhost:3001/api/access-rules/2 -d '{"ruleType": "WILDCARD"}'
curl -X PUT http://localhost:3001/api/access-rules/2 -d '{"ruleType": "USER_ID", "value": "1,2,3"}'
curl -X PUT http://localhost:3001/api/access-rules/2 -d '{"ruleType": "SCOPE", "value": "openid"}'

# delete rule
curl -X DELETE http://localhost:3001/api/access-rules/3

```


MCP API

```sh

curl -N -X POST http://127.0.0.1:3001/echo/mcp/ \
  -H "Accept: application/json, text/event-stream" \
  -H "Connection: keep-alive" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "capabilities": {},
      "clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      }
    }
  }'

# ping

curl -N -X POST http://localhost:3001/echo/mcp/ \
  -H "Accept: application/json, text/event-stream" \
  -H "Connection: keep-alive" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "ping"
  }' | jq -R '
    select(startswith("data: "))
    | .[6:]
    | fromjson 
    | .
  '


# list tools

curl -v -N -X POST http://localhost:3001/api/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Connection: keep-alive" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list"
  }'| jq -R '
    select(startswith("data: "))
    | .[6:]
    | fromjson 
    | .result.tools
  '



# call toll

curl -N -X POST http://localhost:3001/api/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Connection: keep-alive" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "echo",
      "arguments": {
        "message": "Hello, world!"
      }
    }
  }' | jq -R '
    select(startswith("data: "))
    | .[6:]
    | fromjson 
    | .result.content
'
```