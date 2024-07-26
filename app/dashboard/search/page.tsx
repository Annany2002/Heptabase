"use client";

import { useState } from "react";
import { SearchForm } from "./search-form";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function SearchPage() {
  const [results, setResults] =
    useState<typeof api.search.searchAction._returnType>();

  return (
    <main className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-4xl">Search</h1>
      </div>
      <SearchForm setResults={setResults} />
      <ul className="flex flex-col gap-4">
        {results?.map((result) => {
          if (result.type === "notes") {
            return (
              <Link
                href={`/dashboard/notes/${result.record._id}`}
                key={result.record._id}
              >
                <li className="bg-slate-800 p-4 rounded-md whitespace-pre-line">
                  type: Notes {result.score}
                  {result.record.text.substring(0, 200)}
                </li>
              </Link>
            );
          } else {
            return (
              <Link
                href={`/dashboard/documents/${result.record._id}`}
                key={result.record._id}
              >
                <li className="bg-slate-800 p-4 rounded-md whitespace-pre-line">
                  type: Documents {result.score}
                  {result.record.title.substring(0, 200)}
                  {result.record.description.substring(0, 200)}
                </li>
              </Link>
            );
          }
        })}
      </ul>
    </main>
  );
}
