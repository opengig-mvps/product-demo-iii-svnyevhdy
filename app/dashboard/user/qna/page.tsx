"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { LoaderCircleIcon } from "lucide-react";

const QnAPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [question, setQuestion] = useState<string>("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get("/api/qna/sessions");
        if (response?.data?.success) {
          setSessions(response?.data?.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSessions();
  }, []);

  const submitQuestion = async (sessionId: number) => {
    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/api/qna/sessions/${sessionId}/questions`, {
        question,
      });

      if (response?.data?.success) {
        toast.success("Question submitted successfully!");
        setQuestion(""); // Clear the input field after submission
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
      <h2 className="text-2xl font-bold mb-6">Engage in Expert-led Q&A Sessions</h2>
      {sessions?.map((session: any) => (
        <Card key={session?.id} className="mb-4">
          <CardHeader>
            <CardTitle>{session?.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{session?.description}</p>
            <p>
              Scheduled Date:{" "}
              {new Date(session?.scheduledDate).toLocaleString()}
            </p>
            <div className="space-y-2">
              <Label htmlFor="question">Your Question</Label>
              <Input
                value={question}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
                placeholder="Submit your question for the expert"
              />
            </div>
            <Button
              onClick={() => submitQuestion(session?.id)}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircleIcon className="animate-spin w-4 h-4" />
              ) : (
                "Submit Question"
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QnAPage;