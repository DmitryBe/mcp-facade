import { NextRequest, NextResponse } from "next/server";
import {
  getMcpServerByName,
  updateMcpServer,
  deleteMcpServerById,
} from "@/app/db/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ serverName: string }> }
) {
  const { serverName } = await params;
  const server = await getMcpServerByName(serverName);
  if (!server)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(server);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ serverName: string }> }
) {
  const { serverName } = await params;
  if (!serverName)
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  const data = await req.json();
  const { url } = data;
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });
  try {
    await updateMcpServer(serverName, { url });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update server", details: String(e) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ serverName: string }> }
) {
  const { serverName } = await params;
  if (!serverName)
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  const server = await getMcpServerByName(serverName);
  if (!server)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    await deleteMcpServerById(server.id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to delete server", details: String(e) },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
