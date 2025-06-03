import { NextResponse } from "next/server";
import { toolsRegistry } from "@/app/lib/toolsRegistrySingleton";

export async function GET() {
  const toolsEntry = await toolsRegistry.listToolsEntry();

  const result = toolsEntry.map(x => {
    return {
      serverName: x.serverName,
      serverUrl: x.serverUrl,
      toolName: x.tool.name,
      toolDescription: x.tool.description,
    }
  })

  return NextResponse.json(result, { status: 200 });
}