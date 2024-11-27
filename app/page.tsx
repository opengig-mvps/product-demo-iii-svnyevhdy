'use client' ;
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Heart, MessageSquare, LineChart, Info } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#f2f8f9]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#edf7f9]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-[#007b83] sm:text-5xl xl:text-6xl/none">
                    Track Your Semen Health Effortlessly
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl text-[#4c5d5d]">
                    Monitor your semen health metrics, adapt healthy habits, and stay informed with our comprehensive platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="inline-flex h-10 items-center justify-center rounded-md bg-[#007b83] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#005d61]">
                    Get Started
                  </Button>
                  <Button className="inline-flex h-10 items-center justify-center rounded-md border border-[#007b83] bg-background px-8 text-sm font-medium text-[#007b83] shadow-sm transition-colors hover:bg-[#edf7f9]">
                    Learn More
                  </Button>
                </div>
              </div>
              <AspectRatio ratio={16 / 9}>
                <img
                  src="https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY"
                  alt="Semen Health"
                  className="rounded-xl object-cover"
                />
              </AspectRatio>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#007b83] sm:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed text-[#4c5d5d] lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover the top features of our semen health tracking application.
                </p>
              </div>
              <Tabs defaultValue="metrics" className="w-full max-w-3xl">
                <TabsList>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="community">Community</TabsTrigger>
                </TabsList>
                <TabsContent value="metrics">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Health Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="text-[#4c5d5d]">
                        <p>Track your semen volume, motility, and morphology effortlessly.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Trends & Goals</CardTitle>
                      </CardHeader>
                      <CardContent className="text-[#4c5d5d]">
                        <p>Visualize trends and set personalized health goals.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Personalized Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="text-[#4c5d5d]">
                        <p>Receive insights and recommendations for a healthier lifestyle.</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="reports">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Log Reports</CardTitle>
                      </CardHeader>
                      <CardContent className="text-[#4c5d5d]">
                        <p>Easily log your semen health reports and track progress.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Habit Tracking</CardTitle>
                      </CardHeader>
                      <CardContent className="text-[#4c5d5d]">
                        <p>Monitor habits like sleep and diet that impact your health.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Reminders</CardTitle>
                      </CardHeader>
                      <CardContent className="text-[#4c5d5d]">
                        <p>Get reminders for upcoming tests and healthy practices.</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="community">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Forums</CardTitle>
                      </CardHeader>
                      <CardContent className="text-[#4c5d5d]">
                        <p>Join anonymous forums to discuss semen health topics.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Expert Q&A</CardTitle>
                      </CardHeader>
                      <CardContent className="text-[#4c5d5d]">
                        <p>Engage in Q&A sessions with health experts.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Education</CardTitle>
                      </CardHeader>
                      <CardContent className="text-[#4c5d5d]">
                        <p>Access a library of educational articles on semen health.</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#e6f3f4]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#007b83] sm:text-5xl">Community Buzz</h2>
                <p className="max-w-[900px] text-muted-foreground text-[#4c5d5d] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our users are saying about the platform.
                </p>
              </div>
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>JH</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-[#007b83]">James Hill</p>
                        <p className="text-xs text-[#4c5d5d]">Health Enthusiast</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-[#4c5d5d]">
                    "This app has revolutionized my approach to semen health! The insights are invaluable."
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-[#007b83]">Anna Smith</p>
                        <p className="text-xs text-[#4c5d5d]">Lifestyle Coach</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-[#4c5d5d]">
                    "The community forums are an amazing resource. I've learned so much!"
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>JL</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-[#007b83]">John Lee</p>
                        <p className="text-xs text-[#4c5d5d]">Fitness Trainer</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-[#4c5d5d]">
                    "The goal tracking feature is my favorite. It keeps me motivated and on track."
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#007b83] sm:text-5xl">Educational Resources</h2>
                <p className="max-w-[900px] text-muted-foreground text-[#4c5d5d] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Stay informed with our curated list of articles on semen health.
                </p>
              </div>
              <Accordion type="single" collapsible className="max-w-3xl">
                <AccordionItem value="article-1">
                  <AccordionTrigger>Understanding Semen Health</AccordionTrigger>
                  <AccordionContent>
                    A comprehensive guide to understanding the key factors affecting semen health and fertility.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="article-2">
                  <AccordionTrigger>Nutrition and Semen Quality</AccordionTrigger>
                  <AccordionContent>
                    Explore the impact of diet on semen quality and discover foods that promote reproductive health.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="article-3">
                  <AccordionTrigger>Lifestyle Changes for Better Health</AccordionTrigger>
                  <AccordionContent>
                    Identify lifestyle changes that can enhance semen health and overall well-being.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#e6f3f4]">
          <div className="container flex flex-col items-center justify-center px-4 md:px-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-[#007b83] sm:text-5xl">Join the Conversation</h2>
              <p className="max-w-[900px] text-muted-foreground text-[#4c5d5d] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Participate in discussions, ask questions, and connect with experts in our community.
              </p>
            </div>
            <img
              src="https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s"
              alt="Community"
              className="w-full max-w-3xl rounded-xl object-cover"
            />
          </div>
        </section>
      </main>
      <footer className="bg-[#007b83] p-6 md:py-12 w-full text-white">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">Product</h3>
            <a href="#" className="hover:underline">Features</a>
            <a href="#" className="hover:underline">Integrations</a>
            <a href="#" className="hover:underline">Pricing</a>
            <a href="#" className="hover:underline">Security</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Company</h3>
            <a href="#" className="hover:underline">About Us</a>
            <a href="#" className="hover:underline">Careers</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Resources</h3>
            <a href="#" className="hover:underline">Documentation</a>
            <a href="#" className="hover:underline">Help Center</a>
            <a href="#" className="hover:underline">Community</a>
            <a href="#" className="hover:underline">Templates</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Legal</h3>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;