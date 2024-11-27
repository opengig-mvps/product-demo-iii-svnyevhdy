"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-picker";
import { LoaderCircleIcon, X } from "lucide-react";

type Reminder = {
  id: number;
  userId: number;
  snoozed: boolean;
  dateTime: string;
  description: string;
};

const ManageReminders: React.FC = () => {
  const { data: session } = useSession();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      description: "",
    },
  });

  useEffect(() => {
    if (!session) {
      return;
    }
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/users/${session?.user?.id}/reminders`);
        setReminders(response?.data?.data);
      } catch (error: any) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, [session]);

  const onSubmit = async (data: any) => {
    if (!selectedDate) {
      toast.error("Please select a date and time for the reminder.");
      return;
    }
    try {
      const payload = {
        dateTime: selectedDate.toISOString(),
        description: data?.description,
      };
      const response = await api.post(`/api/users/${session?.user?.id}/reminders`, payload);
      if (response?.data?.success) {
        toast.success("Reminder created successfully!");
        setReminders((prev) => [...prev, response?.data?.data]);
        reset();
        setSelectedDate(undefined);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const deleteReminder = async (id: number) => {
    try {
      const response = await api.delete(`/api/users/${session?.user?.id}/reminders/${id}`);
      if (response?.data?.success) {
        toast.success("Reminder deleted successfully!");
        setReminders(reminders?.filter((reminder) => reminder?.id !== id));
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Manage Reminders</h2>
      <Card className="mb-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Add New Reminder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                {...register("description")}
                placeholder="Enter reminder description"
              />
            </div>
            <div className="space-y-2">
              <Label>Date and Time</Label>
              <DateTimePicker
                date={selectedDate}
                setDate={(date: Date | undefined) => setSelectedDate(date)}
              />
            </div>
          </CardContent>
          <div className="p-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Add Reminder"
              )}
            </Button>
          </div>
        </form>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-4">Upcoming Reminders</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          reminders?.map((reminder) => (
            <Card key={reminder?.id} className="mb-4">
              <CardHeader className="flex justify-between">
                <CardTitle>{reminder?.description}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteReminder(reminder?.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p>{new Date(reminder?.dateTime).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageReminders;