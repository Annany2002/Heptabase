"use client";

import { SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const user = useQuery(api.user.getUser);

  return (
    <div className="bg-slate-100 dark:bg-black h-[calc(100dvh-70px)]">
      <div className="relative isolate pt-10 px-6 lg:px-8">
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
        <div className="mx-auto max-w-2xl py-12">
          <div className="text-center space-y-6">
            <Image
              src={"/undraw_add_files_re_v09g.svg"}
              width="200"
              height="200"
              alt="image"
              className="mx-auto"
            />
            <h1 className="text-4xl dark:text-white font-bold tracking-tight text-gray-900 sm:text-5xl">
              Take control over your document like never before
            </h1>
            <p className="mt-6 text-lg dark:text-gray-200 leading-8 text-gray-600">
              <span className="underline text-cyan-500 dark:text-cyan-400 font-mono underline-offset-4">Heptabase</span> is tool that allows you to chat with your pdf, make
              notes, search<span className="font-bold text-cyan-500"> 56</span>{" "}
              percent faster among all over your stuff with vector search
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Unauthenticated>
                <SignInButton>
                  <div className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
                    Let&apos;s Get Started
                  </div>
                </SignInButton>
              </Unauthenticated>
              <Authenticated>
                <Link href={"/dashboard"}>
                  <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Dashboard
                  </button>
                </Link>
              </Authenticated>
            </div>
          </div>
        </div>

        {/* Pricing Comparison Table */}
        {!user?.isPremium && <div className="mx-auto max-w-4xl py-16 px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Choose Your Plan
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Start with our free plan or upgrade for unlimited access
            </p>
          </div>

          <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Normal Plan
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center justify-center gap-2">
                      Premium Plan
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    Chats
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    10
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    Unlimited
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    Document Uploads
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    3
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    Unlimited
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    Notes
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    10
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    Unlimited
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    Searches
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    5
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    Unlimited
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
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
}
