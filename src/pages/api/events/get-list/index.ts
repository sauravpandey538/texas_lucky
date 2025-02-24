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
    const { lcid } = req.body;
    //console.log("body is : ", req.body);
    if (!lcid) {
      return res.status(400).json({ error: "LCID is required" });
    }
    const validLcid = await db("students as s")
      .where("s.lcid", "=", lcid)
      .first();
    // console.log({ validLcid });
    if (!validLcid) {
      return res.status(400).json({ error: "Invalid LCID" });
    }

    //console.log("lcid is : ", lcid);
    const pastEvent = await db("events as e")
      .select(
        "e.id",
        "e.start_date",
        "e.due_date",
        "w.rank",
        "s.lcid",
        "s.name"
      )
      .where("e.due_date", "<", new Date()) // past events
      .leftJoin("winners as w", "w.event_id", "e.id")
      .leftJoin("students as s", "s.id", "w.student_id")
      .whereNotNull("w.rank") // Only get events with winners
      .orderBy("e.id", "desc") // Changed to desc to show newer events first
      .orderBy("w.rank", "asc") // Keep rank in ascending order
      .returning("*");

    const activeEvent = await db("events as e")
      .select(
        "e.id",
        "e.start_date",
        "e.due_date",
        db.raw(
          "CASE WHEN EXISTS (SELECT 1 FROM participation p2 WHERE p2.event_id = e.id AND p2.student_id IN (SELECT id FROM students WHERE lcid = ?)) THEN true ELSE false END as is_participated",
          [lcid]
        ),
        db.raw(
          "CAST(COUNT(DISTINCT p.student_id) AS INTEGER) as participants_count"
        )
      )
      .where("e.due_date", ">", new Date())
      .leftJoin("participation as p", "p.event_id", "e.id")
      .groupBy("e.id", "e.start_date", "e.due_date")
      .orderBy("e.id", "desc")
      .first();
    return res.status(200).json({ pastEvent, activeEvent });
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
}
