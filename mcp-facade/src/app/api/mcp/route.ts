import { NextRequest, NextResponse } from "next/server";
import { ToolsListResponse } from "@/app/lib/mcpClient";
import { toolsRegistry } from "@/app/lib/toolsRegistrySingleton";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { method, id, jsonrpc, params } = body;

  switch (method) {
    case "initialize":
    case "notifications/initialized":
      return handleInitialize(id);
    case "tools/list":
      return handleToolsList(id, jsonrpc);
    case "tools/call":
      return handleToolsCall(id, params);
    default:
      return new NextResponse("Method not found", { status: 404 });
  }
}

async function handleInitialize(id: number) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id: id,
    result: {
      protocolVersion: "2025-03-26",
      capabilities: {
        experimental: {},
        prompts: { listChanged: false },
        resources: { subscribe: false, listChanged: false },
        tools: { listChanged: false },
      },
      serverInfo: { name: "MathServer", version: "1.9.2" },
    },
  });
}

async function handleToolsList(id: number, jsonrpc: string) {
  const toolsEntry = await toolsRegistry.listToolsEntry();
  const stream = new ReadableStream({
    start(ctrl) {
      const encoder = new TextEncoder();
      ctrl.enqueue(encoder.encode("event: message\n"));
      const toolResultFinal: ToolsListResponse = {
        jsonrpc: jsonrpc,
        id: id,
        result: {
          tools: toolsEntry.map((tool) => tool.tool),
        },
      };
      ctrl.enqueue(
        encoder.encode(`data: ${JSON.stringify(toolResultFinal)}\n\n`)
      );
      ctrl.close();
    },
  });
  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}

async function handleToolsCall(
  id: number,
  params: {
    name: string;
    arguments: object;
  }
) {
  const { name, arguments: args } = params;
  const client = await toolsRegistry.getToolClient(name);
  if (!client) {
    return new NextResponse(`Tool ${name} not found`, { status: 404 });
  }
  const stream = await client.callTool(id.toString(), name, args);
  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
