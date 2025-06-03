import { NextResponse } from "next/server";
import { getAllAccessRules } from "@/app/db/queries";

// List all access rules
export async function GET() {
  const rules = await getAllAccessRules();
  return NextResponse.json(rules, { status: 200 });
}
