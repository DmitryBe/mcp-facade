import { NextRequest, NextResponse } from "next/server";
import { updateAccessRule, deleteAccessRule } from "@/app/db/queries";

// Update an access rule by id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  const { ruleType } = body;
  let { value } = body;
  const { id } = await params;
  if (ruleType === "WILDCARD") {
    value = null;
  }
  const result = await updateAccessRule(parseInt(id), { ruleType, value });
  return NextResponse.json(result, { status: 200 });
}

// Delete an access rule by id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await deleteAccessRule(parseInt(id));
  return NextResponse.json(result, { status: 200 });
}
