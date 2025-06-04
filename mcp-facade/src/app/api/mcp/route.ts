import { NextRequest, NextResponse } from "next/server";
import { ToolsListResponse } from "@/app/lib/mcpClient";
import { toolsRegistry } from "@/app/lib/toolsRegistrySingleton";
import { getJwt, checkAccess } from "@/app/lib/auth";
import { config } from "@/app/lib/config";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const headers = req.headers;
  const { method, id, params } = body;

  switch (method) {
    case "initialize":
    case "notifications/initialized":
      return handleInitialize(id);
    case "tools/list":
      return handleToolsList(id);
    case "tools/call":
      return handleToolsCall(id, headers, params);
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

async function handleToolsList(id: number) {
  const toolsEntry = await toolsRegistry.listToolsEntry();
  const stream = new ReadableStream({
    start(ctrl) {
      const encoder = new TextEncoder();
      ctrl.enqueue(encoder.encode("event: message\n"));
      const toolResultFinal: ToolsListResponse = {
        jsonrpc: "2.0",
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
      Accept: "application/json, text/event-stream",
    },
  });
}

async function handleToolsCall(
  id: number | string,
  headers: Headers,
  params: {
    name: string;
    arguments: object;
  }
) {
  if (config.authEnabled) {
    const jwt = getJwt(headers);
    if (!jwt) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isAllowed = await checkAccess(params.name, jwt);
    if (!isAllowed) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  const client = await toolsRegistry.getToolClient(params.name);
  if (!client) {
    return new NextResponse(`Tool ${params.name} not found`, { status: 404 });
  }
  const stream = await client.callTool(id, params.name, params.arguments);
  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      Accept: "application/json, text/event-stream",
    },
  });
}
