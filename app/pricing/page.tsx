"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { UpdateMembership } from "@/components/update-membership";

const PricingPage: React.FC = () => {
  const [open, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-100 dark:bg-black min-h-[100dvh-72px]">
      <div className="relative isolate px-6 lg:px-8 pt-8">
        {/* Top gradient effect */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-4xl py-12">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl dark:text-white font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-lg dark:text-gray-200 leading-8 text-gray-600">
              Choose a plan that works for you. Chat with your PDFs, make notes,
              and search
              <span className="font-bold text-cyan-500"> 56</span> percent
              faster with our powerful AI tools.
            </p>
          </div>

          <Unauthenticated>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <Card className="border-2 border-gray-200 dark:border-gray-500 shadow-sm hover:shadow-md transition-shadow dark:bg-transparent dark:text-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Free Plan
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Perfect for trying out our service
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      / month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>10 PDF chats per user</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Basic PDF analysis</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Standard response time</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-center w-full">
                  <Link className="w-full" href={"/sign-up"}>
                    <Button
                      variant="outline"
                      className="w-full dark:text-white dark:hover:bg-gray-800"
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              {/* Premium Plan */}
              <Card className="border-2 border-indigo-600 dark:border-indigo-500 shadow-md hover:shadow-lg transition-shadow relative dark:bg-transparent dark:text-gray-100">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Unlimited Plan
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    For serious PDF chat users
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$1</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      / month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">Unlimited PDF chats</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced PDF analysis</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Priority response time</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Export chat history</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500">
                    Subscribe Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </Unauthenticated>

          <Authenticated>
            <div className="grid grid-cols-1 place-items-center mx-auto">
              {/* Premium Plan */}
              <Card className="w-[20rem] border-2 border-indigo-600 dark:border-indigo-500 shadow-md hover:shadow-lg transition-shadow relative dark:bg-transparent dark:text-gray-100">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Unlimited Plan
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    For serious PDF chat users
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$1</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      / month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">Unlimited PDF chats</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced PDF analysis</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Priority response time</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Export chat history</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <UpdateMembership open={open} setIsOpen={setIsOpen} />
                </CardFooter>
              </Card>
            </div>
          </Authenticated>
        </div>

        {/* Bottom gradient effect */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-40rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
