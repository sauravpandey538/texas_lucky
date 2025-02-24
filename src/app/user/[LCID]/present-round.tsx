import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, format } from "date-fns";
import { ActiveEvent } from "./page";
interface PresentRoundProps {
  activeEvent: ActiveEvent;
}

const PresentRound: React.FC<PresentRoundProps> = ({ activeEvent }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [dueDay, setDueDay] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!activeEvent?.due_date) return;

      const dueDate = new Date(activeEvent.due_date);
      const now = new Date();

      if (dueDate <= now) {
        setTimeLeft("Time's up!");
        return;
      }

      // Get relative time using date-fns
      const timeDistance = formatDistanceToNow(dueDate, { addSuffix: false });
      setTimeLeft(timeDistance);

      // Get the weekday name
      const weekday = format(dueDate, "EEEE");
      setDueDay(weekday);
    };

    // Update immediately and then every minute
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [activeEvent]);

  return (
    <Card className="w-full max-w-md mx-auto p-6 text-center shadow-lg bg-gradient-to-br from-white to-gray-50 ">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-medium text-gray-600">
          Present Round
        </CardTitle>
        <CardTitle className="text-2xl font-bold text-primary">
          Event_{activeEvent?.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Submissions open until</p>
            <p className="text-lg font-semibold text-primary">next {dueDay}</p>
          </div>

          <div className="flex flex-col items-center ">
            <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              {timeLeft}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PresentRound;
