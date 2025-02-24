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
    const { lcid, password } = req.body;
    if (!lcid || !password) {
      return res.status(400).json({
        error: "Missing lcid or password",
      });
    }
    const existingStudent = await db("students").where({ lcid }).first();
    if (!existingStudent) {
      return res
        .status(400)
        .json({ for: "lcid", error: "Student doesn't exist" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingStudent.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ for: "password", error: "Invalid password" });
    }

    return res.status(201).json({ student: existingStudent });
  } catch (error) {
    // console.log(error);
    return errorHandler(error);
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
