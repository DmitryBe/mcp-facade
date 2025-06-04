# MCP Facade

A powerful facade service that provides a unified interface for managing and interacting with multiple MCP (Machine Conversation Protocol) servers. It acts as a single entry point for agents to communicate with various MCP servers while providing robust authentication and access control.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
  - [Server Management](#server-management)
  - [Tool Management](#tool-management)
  - [Access Control](#access-control)
  - [MCP Protocol](#mcp-protocol)
- [Authentication](#authentication)
- [Examples](#examples)

## Features

- **Unified Access Point**: Single interface for multiple MCP servers
- **Server Management**: Register, update, and manage multiple MCP servers
- **Tool Management**: Discover and interact with tools across all registered servers
- **Authentication**: JWT-based authentication with fine-grained access control
- **Access Rules**: Configurable access rules at the tool level
- **Health Monitoring**: Built-in health check endpoints
- **Database Backend**: PostgreSQL for storing server configurations and access rules

## Run it locally

### Run MCP servers (example)

Note: can skip this step if you have your mcp servers.

```bash
cd mcp-facade/mcp-servers

uv sync
source .venv/bin/activate
uv pip install -e .

# start mcp servers
uv run src/mcp_servers/main.py
```

### Run MCP facade

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-facade.git
cd mcp-facade/mcp-facade

# Install dependencies
pnpm i

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the service
pnpm dev
```


### Adding configuration 

```bash
# add echo 
curl -X POST http://localhost:3001/api/mcp/servers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "echo",
    "url": "http://127.0.0.1:3003/echo/mcp"
  }'

# add math
curl -X POST http://localhost:3001/api/mcp/servers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "math",
    "url": "http://127.0.0.1:3003/math/mcp"
  }'
```


## API Documentation

### Server Management

Manage your MCP servers through these endpoints:

#### List All Servers
```bash
curl http://localhost:3001/api/mcp/servers | jq .
```

#### Get Server by Name
```bash
curl http://localhost:3001/api/mcp/servers/echo | jq .
```

#### Create Server
```bash
curl -X POST http://localhost:3001/api/mcp/servers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "echo",
    "url": "http://127.0.0.1:3003/echo/mcp"
  }'
```

#### Update Server
```bash
curl -X PUT http://localhost:3001/api/mcp/servers/echo \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://127.0.0.1:3003/echo/mcp"
  }'
```

#### Delete Server
```bash
curl -X DELETE http://localhost:3001/api/mcp/servers/echo
```

### Tool Management

#### List Available Tools
```bash
curl http://localhost:3000/api/mcp/tools | jq .
```

#### Call a Tool
```bash
curl -N -X POST http://localhost:3000/api/mcp \
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

### Access Control

The service supports fine-grained access control at the tool level. Access rules can be configured using different rule types:

- `WILDCARD`: Allow access to everyone
- `SCOPE`: Require specific OAuth scopes
- `USER_ID`: Restrict to specific user IDs

#### List All Access Rules
```bash
curl http://localhost:3001/api/access-rules | jq .
```

#### Get Rules for a Tool
```bash
curl http://localhost:3001/api/access-rules/by-tool/echo | jq .
```

#### Create Access Rule
```bash
# Allow everyone
curl -X POST http://localhost:3001/api/access-rules/by-tool/echo \
  -H "Content-Type: application/json" \
  -d '{"ruleType": "WILDCARD", "value": null}'

# Require specific scope
curl -X POST http://localhost:3001/api/access-rules/by-tool/add \
  -H "Content-Type: application/json" \
  -d '{"ruleType": "SCOPE", "value": "openid"}'
```

#### Update Access Rule
```bash
curl -X PUT http://localhost:3001/api/access-rules/2 \
  -H "Content-Type: application/json" \
  -d '{"ruleType": "USER_ID", "value": "1,2,3"}'
```

#### Delete Access Rule
```bash
curl -X DELETE http://localhost:3001/api/access-rules/3
```

### MCP Protocol

The service implements the MCP protocol for tool interaction. Here are some common operations:

#### Initialize Connection
```bash
curl -N -X POST http://localhost:3001/api/mcp \
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
```

#### List tools
```bash
curl -N -X POST http://localhost:3000/api/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Connection: keep-alive" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list"
  }' | jq -R 'select(startswith("data: ")) | .[6:] | fromjson'
```

#### Ping Server
```bash
curl -N -X POST http://localhost:3001/api/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Connection: keep-alive" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "ping"
  }' | jq -R 'select(startswith("data: ")) | .[6:] | fromjson'
```

## Authentication

The service uses JWT (JSON Web Tokens) for authentication. Include the JWT token in the `Authorization` header for authenticated requests:

```bash
curl -H "Authorization: Bearer your.jwt.token" http://localhost:3001/api/mcp/tools
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
