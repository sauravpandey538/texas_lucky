import db from "@/lib/db";
import { NextResponse } from "next/server";
import { errorHandler } from "../errorHandler";

export async function GET() {
  try {
    await db.raw("SELECT 1");
    return NextResponse.json(
      { success: true, message: "✅ Database connected!" },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}
