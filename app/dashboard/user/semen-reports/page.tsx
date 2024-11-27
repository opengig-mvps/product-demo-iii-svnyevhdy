"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-picker";
import { LoaderCircleIcon } from "lucide-react";

// Zod schemas for validation
const semenReportSchema = z.object({
  count: z.number().min(0, "Count should be a positive number"),
  motility: z.number().min(0).max(100, "Motility should be between 0 and 100"),
  morphology: z.number().min(0).max(100, "Morphology should be between 0 and 100"),
  notes: z.string().optional(),
});

const habitSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

type SemenReportFormData = z.infer<typeof semenReportSchema>;
type HabitFormData = z.infer<typeof habitSchema>;

const SemenReportsPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register: registerSemenReport,
    handleSubmit: handleSemenReportSubmit,
    formState: { errors: semenReportErrors, isSubmitting: isSubmittingSemenReport },
  } = useForm<SemenReportFormData>({
    resolver: zodResolver(semenReportSchema),
  });

  const {
    register: registerHabit,
    handleSubmit: handleHabitSubmit,
    formState: { errors: habitErrors, isSubmitting: isSubmittingHabit },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
  });

  const onSubmitSemenReport = async (data: SemenReportFormData) => {
    try {
      setLoading(true);
      const response = await api.post(`/api/users/${session?.user?.id}/semen-reports`, data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHabit = async (data: HabitFormData) => {
    try {
      setLoading(true);
      const response = await api.post(`/api/users/${session?.user?.id}/habits`, data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Log Semen Report & Habits</h2>

      <Card className="mb-6">
        <form onSubmit={handleSemenReportSubmit(onSubmitSemenReport)}>
          <CardHeader>
            <CardTitle>Semen Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="count">Count</Label>
              <Input type="number" {...registerSemenReport("count")} placeholder="Enter semen count" />
              {semenReportErrors?.count && (
                <p className="text-red-500 text-sm">{semenReportErrors?.count?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="motility">Motility (%)</Label>
              <Input type="number" {...registerSemenReport("motility")} placeholder="Enter motility percentage" />
              {semenReportErrors?.motility && (
                <p className="text-red-500 text-sm">{semenReportErrors?.motility?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="morphology">Morphology (%)</Label>
              <Input type="number" {...registerSemenReport("morphology")} placeholder="Enter morphology percentage" />
              {semenReportErrors?.morphology && (
                <p className="text-red-500 text-sm">{semenReportErrors?.morphology?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea {...registerSemenReport("notes")} placeholder="Enter any notes" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmittingSemenReport}>
              {isSubmittingSemenReport ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Logging Report...
                </>
              ) : (
                "Log Semen Report"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <form onSubmit={handleHabitSubmit(onSubmitHabit)}>
          <CardHeader>
            <CardTitle>Habit Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                {...registerHabit("category")}
                onValueChange={(value) => value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sleep">Sleep</SelectItem>
                  <SelectItem value="Diet">Diet</SelectItem>
                  <SelectItem value="Exercise">Exercise</SelectItem>
                </SelectContent>
              </Select>
              {habitErrors?.category && (
                <p className="text-red-500 text-sm">{habitErrors?.category?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea {...registerHabit("description")} placeholder="Describe your habit" />
              {habitErrors?.description && (
                <p className="text-red-500 text-sm">{habitErrors?.description?.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmittingHabit}>
              {isSubmittingHabit ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Logging Habit...
                </>
              ) : (
                "Log Habit"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SemenReportsPage;