"use client";
import React, { useState, useEffect } from "react";
import axios, { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";

// Validation schema
const postSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

type PostData = z.infer<typeof postSchema>;

const ForumPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<any[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PostData>({
    resolver: zodResolver(postSchema),
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/forums/posts`);
      setPosts(res?.data?.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onSubmit = async (data: PostData) => {
    try {
      const response = await axios.post(`/api/forums/posts`, {
        content: data?.content,
      });

      if (response?.data?.success) {
        toast.success("Forum post created successfully!");
        fetchPosts();
        reset(); // Reset the form after successful submission
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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Anonymous Forums</h2>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Textarea
              {...register("content")}
              placeholder="Enter your message"
            />
            {errors?.content && (
              <p className="text-red-500 text-sm">{errors?.content?.message}</p>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {posts?.map((post: any) => (
            <Card key={post?.id}>
              <CardContent>
                <p>{post?.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumPage;