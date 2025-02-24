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
    const { lcid, eventId } = req.body;
    const event = await db("events").where("id", eventId).first();
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (event.due_date < new Date()) {
      return res.status(400).json({ error: "Event has expired" });
    }
    const studentId = await db("students")
      .where("lcid", lcid)
      .select("id")
      .first();
    if (!studentId) {
      return res.status(404).json({ error: "Student not found" });
    }
    const isParticipated = await db("participation")
      .where("student_id", studentId.id)
      .where("event_id", eventId)
      .first();
    if (isParticipated) {
      await db("participation")
        .where({
          student_id: studentId.id,
          event_id: eventId,
        })
        .del();
      return res.status(200).json({ message: "Participation removed" });
    }
    await db("participation")
      .insert({
        student_id: studentId.id,
        event_id: eventId,
      })
      .returning("*");
    return res.status(201).json({ message: "Participation added" });
  } catch (error) {
    return errorHandler(error);
  }
}
