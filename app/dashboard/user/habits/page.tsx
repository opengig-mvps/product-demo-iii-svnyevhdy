"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon } from "lucide-react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";

type HabitFormData = {
  category: string;
  description: string;
  dateLogged: Date;
};

const HabitsDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormData>();

  const fetchHabits = async () => {
    try {
      const res = await api.get(`/api/users/${session?.user?.id}/habits`);
      if (res?.data?.success) {
        setHabits(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchHabits();
    }
  }, [session]);

  const onSubmit = async (data: HabitFormData) => {
    try {
      const payload = {
        category: data?.category,
        description: data?.description,
        dateLogged: data?.dateLogged?.toISOString(),
      };

      const response = await api.post(
        `/api/users/${session?.user?.id}/habits`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Habit logged successfully!");
        reset();
        fetchHabits();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Manage Your Habits</h2>
      <Card>
        <CardHeader>
          <CardTitle>Log a New Habit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select {...register("category")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sleep">Sleep</SelectItem>
                  <SelectItem value="Diet">Diet</SelectItem>
                  <SelectItem value="Exercise">Exercise</SelectItem>
                </SelectContent>
              </Select>
              {errors?.category && (
                <p className="text-red-500 text-sm">
                  {errors?.category?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Describe your habit"
              />
              {errors?.description && (
                <p className="text-red-500 text-sm">
                  {errors?.description?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateLogged">Date Logged</Label>
              <DateTimePicker
                date={new Date()}
                setDate={(date: any) =>
                  register("dateLogged").onChange({ target: { value: date } })
                }
              />
              {errors?.dateLogged && (
                <p className="text-red-500 text-sm">
                  {errors?.dateLogged?.message}
                </p>
              )}
            </div>

            <Button className="w-full mt-4" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Log Habit"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <h3 className="text-xl font-bold mt-8 mb-4">Logged Habits</h3>
      {loading ? (
        <LoaderCircleIcon className="animate-spin" />
      ) : (
        <div className="space-y-4">
          {habits?.map((habit: any) => (
            <Card key={habit?.id}>
              <CardHeader>
                <CardTitle>{habit?.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{habit?.description}</p>
                <p className="text-gray-500 text-sm">
                  Logged on: {new Date(habit?.dateLogged).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitsDashboard;