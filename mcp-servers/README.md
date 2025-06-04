# mcp-servers

Install deps

```bash
uv sync
source .venv/bin/activate
uv pip install -e .
```

Run MCP servers

```bash
uv run src/mcp_servers/main.py
```

Run MCP inspector

```sh
npx @modelcontextprotocol/inspector
```

Use the following url

```
http://127.0.0.1:3003/echo/mcp
http://127.0.0.1:3003/math/mcp
```

