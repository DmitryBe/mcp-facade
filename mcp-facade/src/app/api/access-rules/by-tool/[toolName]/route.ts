import { NextRequest, NextResponse } from "next/server";
import { getAccessRules, createAccessRule } from "@/app/db/queries";

// List access rules (optionally filter by toolName)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ toolName: string }> }
) {
  const { toolName } = await params;
  if (!toolName) {
    return NextResponse.json(
      { error: "Missing toolName parameter" },
      { status: 400 }
    );
  }
  const rules = await getAccessRules(toolName);
  return NextResponse.json(rules);
}

// Create a new access rule
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ toolName: string }> }
) {
  const { toolName } = await params;
  const { ruleType, value } = await req.json();
  if (!toolName || !ruleType) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const result = await createAccessRule(toolName, ruleType, value);
  return NextResponse.json(result, { status: 201 });
}
