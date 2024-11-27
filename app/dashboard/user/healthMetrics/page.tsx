"use client";
import React, { useState, useEffect } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderCircleIcon } from 'lucide-react';

const HealthMetricsPage: React.FC = () => {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);

  useEffect(() => {
    if (!session) {
      return;
    }
    const fetchMetrics = async () => {
      try {
        setLoadingMetrics(true);
        const res = await axios.get(`/api/users/${session?.user?.id}/semenMetrics`);
        setMetrics(res?.data?.data);
      } catch (error: any) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message ?? 'Something went wrong');
        } else {
          console.error(error);
        }
      } finally {
        setLoadingMetrics(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        const res = await axios.get(`/api/users/${session?.user?.id}/recommendations`);
        setRecommendations(res?.data?.data);
      } catch (error: any) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message ?? 'Something went wrong');
        } else {
          console.error(error);
        }
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchMetrics();
    fetchRecommendations();
  }, [session]);

  const markRecommendationComplete = async (recommendationId: number) => {
    try {
      const res = await axios.patch(`/api/users/${session?.user?.id}/recommendations/${recommendationId}/complete`);
      if (res?.data?.success) {
        setRecommendations(prev =>
          prev?.map(rec =>
            rec?.id === recommendationId ? { ...rec, completed: true } : rec
          )
        );
        toast.success(res?.data?.message);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? 'Something went wrong');
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">Semen Health Metrics</h2>
      <Card>
        <CardHeader>
          <CardTitle>Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingMetrics ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : metrics ? (
            <div>
              <p>Count: {metrics?.count}</p>
              <p>Motility: {metrics?.motility}</p>
              <p>Morphology: {metrics?.morphology}</p>
            </div>
          ) : (
            <p>No metrics available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loadingRecommendations ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : recommendations?.length > 0 ? (
            recommendations?.map((rec: any) => (
              <div key={rec?.id} className="flex items-center space-x-4">
                <Checkbox
                  checked={rec?.completed}
                  onCheckedChange={() => markRecommendationComplete(rec?.id)}
                />
                <span className={rec?.completed ? "line-through" : ""}>
                  {rec?.description}
                </span>
              </div>
            ))
          ) : (
            <p>No recommendations available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthMetricsPage;