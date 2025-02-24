"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Event } from "./page";

interface PastWinnersProps {
  pastEvents: Event[];
}

const PastWinners: React.FC<PastWinnersProps> = ({ pastEvents }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(pastEvents);
  }, [pastEvents]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Past Lucky Draw Winners</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>LCID</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => (
            <TableRow key={index}>
              <TableCell>{`Event_${event.id}`}</TableCell>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.lcid}</TableCell>
              <TableCell>{event.rank}</TableCell>

              <TableCell>{format(event.start_date, "yyyy-MM-dd")}</TableCell>
              <TableCell>{format(event.due_date, "yyyy-MM-dd")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PastWinners;
