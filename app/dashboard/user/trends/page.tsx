"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, X, LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";

const TrendsPage: React.FC = () => {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [goalMetric, setGoalMetric] = useState<string>("count");
  const [goalTargetValue, setGoalTargetValue] = useState<number>(0);

  useEffect(() => {
    if (!session) return;

    const fetchTrends = async () => {
      try {
        const res = await api.get(`/api/users/${session?.user?.id}/semenReports/trends`);
        if (res?.data?.success) {
          setMetrics(res?.data?.data?.metrics);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchGoals = async () => {
      try {
        const res = await api.get(`/api/users/${session?.user?.id}/goals`);
        if (res?.data?.success) {
          setGoals(res?.data?.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrends();
    fetchGoals();
  }, [session]);

  const handleAddGoal = async () => {
    try {
      const payload = { metric: goalMetric, targetValue: goalTargetValue };
      const res = await api.post(`/api/users/${session?.user?.id}/goals`, payload);
      if (res?.data?.success) {
        toast.success("Goal created successfully!");
        setGoals((prevGoals) => [...prevGoals, res?.data?.data]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create goal.");
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    try {
      const res = await api.delete(`/api/users/${session?.user?.id}/goals/${goalId}`);
      if (res?.data?.success) {
        toast.success("Goal deleted successfully!");
        setGoals((prevGoals) => prevGoals?.filter((goal) => goal?.id !== goalId));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete goal.");
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Trends</h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Semen Health Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart width={600} height={300} data={metrics?.flatMap((metric: any) => metric?.dataPoints)}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            {metrics?.map((metric: any, idx: number) => (
              <Line type="monotone" dataKey="value" data={metric?.dataPoints} key={idx} />
            ))}
          </LineChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Set Personalized Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metric">Metric</Label>
            <Input
              value={goalMetric}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoalMetric(e?.target?.value)}
              placeholder="Enter metric"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetValue">Target Value</Label>
            <Input
              type="number"
              value={goalTargetValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoalTargetValue(Number(e?.target?.value))}
              placeholder="Enter target value"
            />
          </div>
          <Button onClick={handleAddGoal} disabled={loading}>
            {loading ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              "Add Goal"
            )}
          </Button>
          <div className="space-y-4 mt-4">
            {goals?.map((goal: any) => (
              <div key={goal?.id} className="flex justify-between items-center p-4 border rounded-lg">
                <span>
                  {goal?.metric}: {goal?.targetValue}
                </span>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal?.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsPage;