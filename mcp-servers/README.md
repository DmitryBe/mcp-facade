# MCP Servers

A collection of simple Model Context Protocol (MCP) servers designed for testing and development purposes. These servers implement basic MCP endpoints to help developers test and validate their MCP client implementations.

## Features

- Echo server: Simple echo endpoint for testing basic MCP communication
- Math server: Basic mathematical operations endpoint

## Project Structure

```
mcp-servers/
├── src/
│   └── mcp_servers/
│       └── main.py      # Main server implementation
├── pyproject.toml       # Project dependencies and metadata
└── README.md           # This file
```

## Installation

1. Clone the repository
2. Install dependencies using `uv`:

```bash
uv sync
source .venv/bin/activate
uv pip install -e .
```

## Usage

### Running the MCP Servers

Start the MCP servers using:

```bash
uv run src/mcp_servers/main.py
```

The servers will be available at:
- Echo server: `http://127.0.0.1:3003/echo/mcp`
- Math server: `http://127.0.0.1:3003/math/mcp`

### Using the MCP Inspector

For debugging and testing your MCP implementation, you can use the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector
```

The inspector provides a web interface to interact with your MCP servers and inspect the communication.
