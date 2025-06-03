import { NextRequest, NextResponse } from "next/server";
import {
  getRegisteredMcpServers,
  registerMcpServer,
} from "@/app/db/queries";

export async function GET() {
  const servers = await getRegisteredMcpServers();
  return NextResponse.json(servers);
}

export async function POST(req: NextRequest) {
  const { name, url } = await req.json();
  if (!name || !url) {
    return NextResponse.json({ error: "Missing name or url" }, { status: 400 });
  }
  try {
    await registerMcpServer(name, url);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to register server", details: String(e) },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
