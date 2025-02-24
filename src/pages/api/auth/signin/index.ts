import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { errorHandler } from "../../errorHandler";
import bcrypt from "bcrypt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { lcid, phone, name, password } = req.body;
    if (!lcid || !phone || !name || !password) {
      return res.status(400).json({
        error:
          "Missing lcid or phone or name or password (password must be at least 8 characters)",
      });
    }
    const existingStudent = await db("students").where({ lcid }).first();
    if (existingStudent) {
      return res
        .status(400)
        .json({ error: "Student already exists with this LCID." });
    }

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const student = await db("students")
      .insert({ lcid, phone, name, password: hashedPassword })
      .returning("*");

    return res.status(201).json({ student });
  } catch (error) {
    return errorHandler(error);
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
