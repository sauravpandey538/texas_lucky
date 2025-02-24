/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

/**
 * Handles API errors globally.
 * @param {Error} error - The error object.
 * @returns {NextResponse} - Standardized JSON error response.
 */
export function errorHandler(error: any) {
  console.error("❌ API Error:", error);

  // Determine response based on error type
  if (error.code === "ER_ACCESS_DENIED_ERROR") {
    return NextResponse.json(
      { success: false, message: "Database access denied." },
      { status: 403 }
    );
  }
  if (error.code === "ER_BAD_DB_ERROR") {
    return NextResponse.json(
      { success: false, message: "Database not found." },
      { status: 500 }
    );
  }
  if (error.code === "ECONNREFUSED") {
    return NextResponse.json(
      { success: false, message: "Database connection refused." },
      { status: 500 }
    );
  }

  // Default error response
  return NextResponse.json(
    { success: false, message: "Internal Server Error" },
    { status: 500 }
  );
}
