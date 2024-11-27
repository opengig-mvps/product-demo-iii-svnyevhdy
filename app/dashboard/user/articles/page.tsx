"use client";

import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { LoaderCircleIcon, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const ArticlesPage: React.FC = () => {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [markingRead, setMarkingRead] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/articles", {
          params: { search: searchKeyword },
        });
        if (response?.data?.success) {
          setArticles(response?.data?.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [searchKeyword]);

  const markArticleAsRead = async (articleId: number) => {
    if (!session) return;

    setMarkingRead(true);
    try {
      const payload = { userId: session?.user?.id, articleId };
      const response = await axios.post("/api/articles/read", payload);

      if (response?.data?.success) {
        toast.success("Article marked as read successfully!");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setMarkingRead(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Articles on Semen Health</h2>

      <div className="space-y-4 mb-6">
        <Label htmlFor="search">Search Articles</Label>
        <Input
          id="search"
          placeholder="Search by keyword..."
          value={searchKeyword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <LoaderCircleIcon className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {articles?.map((article: Article) => (
            <Card key={article?.id}>
              <CardHeader>
                <CardTitle>{article?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{article?.content}</p>
                <p className="text-sm text-gray-500">
                  Category: {article?.category}
                </p>
              </CardContent>
              <div className="p-4">
                <Button
                  onClick={() => markArticleAsRead(article?.id)}
                  disabled={markingRead}
                  className="w-full"
                >
                  {markingRead ? (
                    <LoaderCircleIcon className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Mark as Read
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;