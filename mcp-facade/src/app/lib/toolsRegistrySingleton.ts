import { ToolsRegistry } from "@/app/lib/toolsRegistry";
import { getRegisteredMcpServers } from "@/app/db/queries";

export const toolsRegistry = new ToolsRegistry(async () => {
  const servers = await getRegisteredMcpServers();
  return servers.map((server) => ({ name: server.name, url: server.url }));
}); 