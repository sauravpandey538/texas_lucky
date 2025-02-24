"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PastWinners from "./past-winners";
import PresentRound from "./present-round";
import AnimatedUserCount from "@/helpers/get-applied-users";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export interface Event {
  id: number;
  start_date: string;
  due_date: string;
  participants_count: number;
  lcid: string;
  rank: number;
  name: string;
}

export interface ActiveEvent {
  id: number;
  start_date: string;
  due_date: string;
  participants_count: number;
  is_participated: boolean;
}

const UserDashboard: React.FC = () => {
  const params = useParams<{ LCID: string }>();
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/events/get-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lcid: params?.LCID }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setPastEvents(data.pastEvent);
      setActiveEvent(data.activeEvent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleParticipation = async () => {
    if (!activeEvent) return;

    try {
      // Optimistically update UI based on current participation state
      setActiveEvent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          is_participated: !prev.is_participated,
          participants_count:
            prev.participants_count + (prev.is_participated ? -1 : 1),
        };
      });

      const response = await fetch("/api/events/participate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lcid: params?.LCID,
          eventId: activeEvent.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update participation");
      }
    } catch (err) {
      // Revert the changes on error
      setActiveEvent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          is_participated: !prev.is_participated,
          participants_count:
            prev.participants_count + (prev.is_participated ? 1 : -1),
        };
      });
      setError(
        err instanceof Error ? err.message : "Failed to update participation"
      );
    }
  };
  console.log(activeEvent?.participants_count);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }

    if (params?.LCID) {
      fetchEvents();
    }
  }, [params?.LCID]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto  space-y-6">
      <div className="flex flex-col justify-start  ">
        {activeEvent && (
          <div className="my-10">
            <h1 className="text-xl font-bold mb-5">New Event Alert</h1>
            <div>
              <PresentRound activeEvent={activeEvent} />
              <AnimatedUserCount
                participants={activeEvent?.participants_count}
              />
              <Button
                className="border w-full"
                onClick={handleParticipation}
                variant={
                  activeEvent.is_participated ? "destructive" : "default"
                }
              >
                {activeEvent.is_participated
                  ? "Cancel Participation"
                  : "Take Part"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <PastWinners pastEvents={pastEvents} />
      </div>
    </div>
  );
};

export default UserDashboard;
