import { MCPClient, Tool, getToolListResponseFromStream } from "./mcpClient";

const SECOND = 1000;
const MINUTE = 60 * SECOND;

type ToolEntry = {
  serverName: string;
  serverUrl: string;
  tool: Tool;
};

export class ToolsRegistry {
  private ttl: number;
  private lastLoad: number = 0;
  private idCounter: number = 0;
  private loader: () => Promise<{ name: string; url: string }[]>;
  //   serverName -> MCPClient
  private clientMap: Map<string, MCPClient> = new Map();
  //   toolName -> ToolEntry
  private toolMap: Map<string, ToolEntry> = new Map();

  constructor(
    loader: () => Promise<{ name: string; url: string }[]>,
    ttl: number = 1 * MINUTE
  ) {
    this.loader = loader;
    this.ttl = ttl;
  }

  async refresh(force: boolean = false) {
    const now = Date.now();
    if (!force && now - this.lastLoad < this.ttl) return;

    const servers = await this.loader();
    this.cleanCache(servers);

    this.idCounter++;
    await Promise.all(
      servers.map(async (server) => {
        try {
          const client = new MCPClient(server.url);
          this.clientMap.set(server.name, client);

          const stream = await client.listTools(this.idCounter.toString());
          const result = await getToolListResponseFromStream(stream);
          if (!result) {
            throw new Error(
              `Failed to retrieve tools list from server ${server.name}`
            );
          }

          const tools = result?.result.tools || [];
          for (const tool of tools) {
            this.toolMap.set(tool.name, {
              serverName: server.name,
              serverUrl: server.url,
              tool: tool,
            });
          }
        } catch (err) {
          console.error(String(err));
        }
      })
    );

    this.lastLoad = now;
  }

  //   remove servers that are not in the new list
  private cleanCache(servers: { name: string; url: string }[]) {
    const loadedServers = new Set(servers.map((x) => x.name));
    for (const server of this.clientMap.keys()) {
      if (!loadedServers.has(server)) {
        this.clientMap.delete(server);
      }
    }
    for (const tool of this.toolMap.values()) {
      if (!loadedServers.has(tool.serverName)) {
        this.toolMap.delete(tool.tool.name);
      }
    }
  }

  async listToolsEntry(): Promise<ToolEntry[]> {
    await this.refresh();

    return Array.from(this.toolMap.values());
  }

  async getToolClient(toolName: string): Promise<MCPClient | undefined> {
    await this.refresh();

    const toolEntry = this.toolMap.get(toolName);
    if (!toolEntry) {
      return undefined;
    }

    const client = this.clientMap.get(toolEntry.serverName);
    if (!client) {
      return undefined;
    }

    return client;
  }
}
