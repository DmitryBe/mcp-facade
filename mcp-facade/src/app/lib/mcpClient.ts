export type Tool = {
  name: string;
  description: string;
  inputSchema: {
    properties: Record<
      string,
      {
        title: string;
        type: string;
      }
    >;
    required: string[];
    title: string;
    type: string;
  };
};

export type ToolsListResponse = {
  jsonrpc: string;
  id: number;
  result: {
    tools: Tool[];
  };
};

export class MCPClient {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  async listTools(
    id: string
  ): Promise<ReadableStreamDefaultReader<Uint8Array>> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: id, method: "tools/list" }),
    });
    if (!response.body) {
      throw new Error("No body in response");
    }
    return response.body.getReader();
  }

  async callTool(id: string | number, toolName: string, args: object): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: id,
        method: "tools/call",
        params: { name: toolName, arguments: args },
      }),
    });

    if (!response.body) {
      throw new Error("No body in response");
    }
    return response.body;
  }
}

export async function getToolListResponseFromStream(
  reader: ReadableStreamDefaultReader<Uint8Array>
): Promise<ToolsListResponse | undefined> {
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const text = new TextDecoder().decode(value);
    const lines = text.split("\n");
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith("data:")) {
        const jsonStr = line.slice(5).trim();
        if (jsonStr) {
          return JSON.parse(jsonStr) as ToolsListResponse;
        }
      }
    }
  }
  return undefined;
}
