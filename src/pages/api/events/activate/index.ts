import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { errorHandler } from "@/pages/api/errorHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { pass } = req.body;
    if (pass !== process.env.PASS) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const startDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5); // Set due date to 7 days later

    const newEvent = await db("events")
      .insert({
        start_date: startDate,
        due_date: dueDate,
      })
      .returning("*");
    return res.status(201).json({ newEvent });
  } catch (error) {
    return errorHandler(error);
  }
}
